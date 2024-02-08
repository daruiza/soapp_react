
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { Grid, Divider, Button, IconButton, TextField, FormControl, FormControlLabel, InputLabel, Select, Switch, MenuItem, Tooltip } from '@mui/material';
import { useTheme } from '@emotion/react';
import { inspectionRSSTDeleteById, inspectionRSSTShowByReportId, inspectionRSSTUpdate } from '../../../../store/inspection/inspectionRSSTThunks';
import { ShowByInspectionRSSTEvidenceId, inspectionRSSTEvidenceStore } from '../../../../store';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { getSoappDownloadFile } from '../../../../api';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';
import { genericListGetByName } from '../../../../store/genericlist/genericlistThunks';
import { useQuery } from 'react-query';

export const ReportInspectionRSSTComponent = ({
    report_id = null,
    commerce_id = null,
    inspections = null,
    setInspections = () => { },
    getReportById = () => { },
    getInspectionByReportIdReport = () => { } }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [inspectionsinit, setInspectionsInit] = useState([]);
    const [files, setFiles] = useState([]);

    // const [workArray, setWorkArray] = useState([]);

    const [openEvidences, setOpenEvidences] = useState({
        open: false,
        dialogtitle: '',
        dialogcontenttext: '',
        object: {}
    });

    const [handleAlert, setHandleAlert] = useState({
        openAlert: false,
        functionAlertClose: () => { },
        functionAlertAgree: () => { },
        alertTittle: '',
        alertMessage: '',
        alertChildren: false
    });

    // Llamado de Servicios

    const { data: workArray } = useQuery({
        queryKey: ['works'],
        queryFn: () => dispatch(genericListGetByName({ name: 'inspection_work' })).then(({ data: { data: { generallist } } }) => (generallist)),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    })

    const getInspectionByReportId = () => {
        if (report_id) {
            dispatch(inspectionRSSTShowByReportId({
                form: { id: report_id }
            })).then(({ data: { data } }) => {
                setInspections(data);
                setInspectionsInit(data);
            })
        }
    }

    const getWork = () => {
        dispatch(genericListGetByName({ name: 'inspection_work' }))
            .then(({ data: { data: { generallist } } }) => {
                setWorkArray(generallist ?? []);
            });
    }

    // Eventos

    // Cambios en los inputs del Array inspections
    const changeInputInspection = ({ target: { value, name } }, index) => {
        setInspections((cmms) => cmms.toSpliced(index, 1,
            {
                ...inspections[index],
                [name]: value
            })
        )
    }

    const handleEvidenceOpen = (cmms) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias Inspección RSST Item: ${cmms?.item}`,
            dialogcontenttext: `Norma: ${cmms?.rule} -- Nombre: ${cmms?.name}`,
            object: cmms,
            approved: cmms.approved,
            open: true
        }))
    }

    const handleDeleteInspectionReport = (cmms) => {
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => handleDeleteInspection(cmms),
            alertTittle: 'Eliminar Registro',
            alertMessage: `Estas seguro de borrar el registro ${cmms.item}.`
        });
    }

    const handleDeleteInspection = (cmms) => {
        dispatch(inspectionRSSTDeleteById({
            form: { ...cmms }
        })).then((data) => {
            getInspectionByReportIdReport();
            setHandleAlert({ openAlert: false })
        });
    }

    const handleSaveInspection = (cmms) => {
        // Validamos que todos los campos esten llenos
        if (!cmms.work ||
            !cmms.machines ||
            !cmms.vehicles ||
            !cmms.tools ||
            !cmms.epp ||
            !cmms.cleanliness ||
            !cmms.chemicals ||
            !cmms.risk_work ||
            !cmms.emergency_item ||
            !cmms.other) {
            return;
        }

        if ('id' in cmms && cmms.id) {
            dispatch(inspectionRSSTUpdate({
                form: { ...cmms }
            })).then(({ data: { data: { inspection } } }) => {
                setInspectionsInit(cmms => ([...cmms.filter(el => el.id !== inspection.id), inspection]));
                getInspectionByReportIdReport();
            });
        } else {
            dispatch(compromiseRSSTStore({
                form: { ...cmms }
            })).then(({ data: { data: { inspection } } }) => {
                getInspectionByReportId();
            });
        }
    }

    const getEvidencesById = (id) => {
        if (id) {
            dispatch(ShowByInspectionRSSTEvidenceId({
                form: {
                    id: id ?? ''
                }
            })).then(({ data: { data: { evidence: evidences } } }) => {
                evidences.forEach(evidence => {
                    dispatch(getSoappDownloadFile({ path: evidence.file }))
                        .then((response) => {
                            const newfile = new Blob([response.data], { type: response.data.type });
                            newfile.name = evidence.name;
                            newfile.approved = evidence.approved;
                            newfile.evidence_id = evidence.id;
                            setFiles((files) => [
                                // filtra que ya no este el mismo archivo, 
                                ...files.filter(file => file.name !== newfile.name),
                                newfile
                            ])
                        })
                });
            });
        }
    }

    // Evidenses
    const storeInspectionEvidence = (data, file, object) => {
        dispatch(inspectionRSSTEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                compromise_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveCompromiseEvidence = (file, object) => {
        dispatch(deleteCompromiseRSSTEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });

    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(compromiseRSSTEvidenceUpdate({
            form: {
                ...selectFile?.evidence ?? {},
                id: selectFile?.evidence?.evidence_id ?? null,
                approved: selectFile?.evidence?.approved ? 1 : 0,

            }
        })).then(({ data: { data: { evidence } } }) => {

            setFormInit(JSON.stringify({
                name: evidence.name,
                approved: evidence.approved ? true : false,
            })
            )

            setSelectFile({
                ...selectFile,
                evidence: {
                    ...selectFile.evidence,
                    name: evidence.name,
                    approved: evidence.approved ? true : false
                }
            });
        }, error => setMessageSnackbar({ dispatch, error }))
    }


    // Validacines
    const numberPatternValidation = (value) => {
        if (!value) return true;
        // const regex = new RegExp(/^\d+$/);
        const regex = new RegExp(/^\d*\.?\d*$/);
        return regex.test(value);
    };

    const inspectionSavevalidator = (cmms) => {
        if (!cmms.work ||
            !cmms.machines ||
            !cmms.vehicles ||
            !cmms.tools ||
            !cmms.epp ||
            !cmms.cleanliness ||
            !cmms.chemicals ||
            !cmms.risk_work ||
            !cmms.emergency_item ||
            !cmms.other) {
            return true;
        }


        const cmmsinspectionsinit = inspectionsinit?.find(el => el.id === cmms.id);
        return 'id' in cmms ?
            JSON.stringify({ ...cmmsinspectionsinit, canon: cmmscompromiseinit?.canon ? true : false, approved: cmmscompromiseinit?.approved ? true : false }) ==
            JSON.stringify({ ...cmms, canon: cmms?.canon ? true : false, approved: cmms?.approved ? true : false }) :
            !!(
                !cmms.work ||
                !cmms.machines ||
                !cmms.vehicles ||
                !cmms.tools ||
                !cmms.epp ||
                !cmms.cleanliness ||
                !cmms.chemicals ||
                !cmms.risk_work ||
                !cmms.emergency_item ||
                !cmms.other
            )
    }

    const getDate = (dateinit) => {
        const date = new Date(dateinit);
        return date.setDate(date.getDate() + 1);

    }

    useEffect(() => {
        // getWork();
        setInspectionsInit(inspections);
    }, [])

    useEffect(() => {
        if (inspectionsinit.length) {
            inspections.forEach(el => {
                inspectionSavevalidator(el);
            })
        }
    }, [inspectionsinit]);


    return (
        <Grid container>
            {
                inspections?.length !== 0 &&
                inspections?.map((cmms, index) => {
                    return (
                        <Grid container key={index} >
                            <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                            <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
                                <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControl
                                            fullWidth
                                            error={cmms?.topic === '' || cmms?.topic === null}
                                            required={true}
                                        >
                                            <InputLabel id="demo-simple-select-label">Obra/Frente/Area</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                disabled={cmms?.approved ? true : false}
                                                name="work"
                                                value={cmms?.work ?? ''}
                                                label="Obra/Frente/Area"
                                                onChange={e => changeInputInspection(e, index)}>
                                                <MenuItem value=''><em></em></MenuItem>
                                                {
                                                    workArray &&
                                                    workArray.length &&
                                                    workArray.map((el, index) => (
                                                        <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.machines ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'machines' } }, index)}
                                                name="machines" />}
                                            label={`${cmms.machines ? 'Incluye' : 'No incluye'} maquinas y equipo`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.vehicles ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'vehicles' } }, index)}
                                                name="vehicles" />}
                                            label={`${cmms.vehicles ? 'Incluye' : 'No incluye'} vehiculo`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.tools ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'tools' } }, index)}
                                                name="tools" />}
                                            label={`${cmms.tools ? 'Incluye' : 'No incluye'} herramientas`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.epp ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'epp' } }, index)}
                                                name="epp" />}
                                            label={`${cmms.epp ? 'Incluye' : 'No incluye'} EPP`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.cleanliness ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'cleanliness' } }, index)}
                                                name="cleanliness" />}
                                            label={`${cmms.cleanliness ? 'Incluye' : 'No incluye'} orden y aseo (ambiental)`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.chemicals ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'chemicals' } }, index)}
                                                name="chemicals" />}
                                            label={`${cmms.chemicals ? 'Incluye' : 'No incluye'} sustancias quimicas`}
                                        />
                                    </Grid>                                    
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.risk_work ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'risk_work' } }, index)}
                                                name="risk_work" />}
                                            label={`${cmms.risk_work ? 'Incluye' : 'No incluye'} trabajos de alto riesgo`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <FormControlLabel
                                            disabled={cmms?.approved ? true : false}
                                            sx={{ ml: 2 }}
                                            control={<Switch
                                                checked={cmms.emergency_item ? true : false}
                                                onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'emergency_item' } }, index)}
                                                name="emergency_item" />}
                                            label={`${cmms.emergency_item ? 'Incluye' : 'No incluye'} elementos de emergencia`}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            disabled={cmms?.approved ? true : false}
                                            variant="standard"
                                            size="small"
                                            label="Otro, ¿Cual?"
                                            type="text"
                                            fullWidth
                                            name="other"
                                            value={cmms?.other ?? ''}
                                            onChange={(event) => changeInputInspection(event, index)}
                                            error={false}
                                            helperText={''}
                                        />
                                    </Grid>

                                </Grid>
                                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>
                                    <Tooltip title="Eliminar Registro" placement="top">
                                        <span>
                                            <IconButton
                                                disabled={cmms?.approved ? true : false}
                                                onClick={() => handleDeleteComprmiseReport(cmms)}
                                            >
                                                <HighlightOffIcon
                                                    sx={{
                                                        color: palette.text.disabled,
                                                        "&:hover": {
                                                            // color: `${palette.text.primary}`,
                                                            cursor: "pointer"
                                                        }
                                                    }}></HighlightOffIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Guardar Cambios" placement="top">
                                        <span>
                                            <IconButton
                                                disabled={inspectionSavevalidator(cmms) || cmms?.approved ? true : false}
                                                onClick={() => handleSaveInspection(cmms)}                                            >
                                                <SaveIcon></SaveIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    {
                                        cmms?.id &&
                                        <>

                                            <Tooltip title="Evidencias" placement="top">
                                                <span>
                                                    <IconButton
                                                        disableFocusRipple={cmms?.approved ? true : false}
                                                        onClick={() => handleEvidenceOpen(cmms)}
                                                    ><AttachFileIcon></AttachFileIcon></IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip title={`${cmms?.approved ? 'Aprobado' : 'Aprobar'}`} placement="top">
                                                <span>
                                                    <PrivateAgentRoute>
                                                        <IconButton
                                                            onClick={() => handleSaveInspection({ ...cmms, approved: !cmms?.approved })}>
                                                            {!!cmms?.approved &&
                                                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                                            }
                                                            {!cmms?.approved &&
                                                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                            }
                                                        </IconButton>
                                                    </PrivateAgentRoute>

                                                    <PrivateCustomerRoute>
                                                        <IconButton disabled>
                                                            {cmms?.approved &&
                                                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                                            }
                                                            {!cmms?.approved &&
                                                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                            }
                                                        </IconButton>
                                                    </PrivateCustomerRoute>
                                                </span>
                                            </Tooltip>
                                        </>
                                    }
                                </Grid>
                            </Grid>

                        </Grid>
                    )
                })
            }

            <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>

                </Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                        <Button onClick={() => {
                            setInspections(cmps => [...cmps, {
                                work: null,
                                machines: false,
                                vehicles: false,
                                tools: false,
                                epp: false,
                                cleanliness: false,
                                chemicals: false,
                                risk_work: false,
                                emergency_item: false,
                                other: null,
                                report_id: report_id,
                                save: false
                            }])
                        }}
                            variant="contained"
                            disabled={!!inspections?.find(el => el.save === false)}
                            sx={{
                                height: '100%',
                                color: `${palette.text.custom}`,
                                // border: '1px solid'
                            }}>AGREGAR COMPROMISO
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )

}