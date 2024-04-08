
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Divider, Grid, FormControl, TextField, Select, InputLabel, MenuItem, FormHelperText, IconButton, Tooltip, Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import { useTheme } from '@emotion/react';

import { useGeneralList, useSupportGroupDeleteId, useSupportGroupStore } from '../../../../hooks';
import { ShowBySupportGActivityEvidenceId, supportGActivityEvidenceStore, deleteSupportGActivityEvidenceId, supportGActivityEvidenceUpdate } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';



export const ReportSupportGroupActivityComponent = ({
    report_id = null,
    commerce_id = null,
    supports = [],
    setSupports = () => { },
    supportGroupActionQuery = [],
    getSupportGrpupByReportIdReport = () => { } }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [supporstsinit, setSupporstsInit] = useState([]);
    const [files, setFiles] = useState([]);

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


    // Query  
    const { data: supportGroupArray } = useGeneralList('support_group');

    const { mutate: supportGActivityDelete } = useSupportGroupDeleteId(
        {},
        () => {
            getSupportGrpupByReportIdReport();
            setHandleAlert({ openAlert: false })
        }
    );
    
    const { mutate: supporGActivitystore } = useSupportGroupStore(
        {}, getSupportGrpupByReportIdReport
    );

     // Eventos

    // Cambios en los inputs del Array support
    const changeInputSupport = ({ target: { value, name } }, index) => {
        setSupports((cmms) => cmms.toSpliced(index, 1,
        {
            ...supports[index],
            [name]: value,
            [`${name}Touched`]: true
        })
        );
    }

    const handleDeleteSupportReport = (cmms) => {
        setHandleAlert({
          openAlert: true,
          functionAlertClose: () => setHandleAlert({ openAlert: false }),
          functionAlertAgree: () => supportGActivityDelete(cmms),
          alertTittle: 'Eliminar Registro',
          alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
        });
    }

    const handleSaveSupport = (cmms) => {    
        if (!cmms.work) {
          return;
        }
        supporGActivitystore(cmms);
    }

    const handleEvidenceOpen = (cmms) => {    
        setOpenEvidences((openEvidences) => ({
          ...openEvidences,
          dialogtitle: `Evidencias Support Activity Item: ${cmms?.work}`,
          dialogcontenttext: ``,
          object: cmms,
          approved: cmms.approved,
          open: true
        }))
    }

    // Evidences
    const getEvidencesById = (id) => {
        if (id) {
        dispatch(ShowBySupportGActivityEvidenceId({
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

    const storeSupportGActivityEvidence = (data, file, object) => {
        dispatch(supportGActivityEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                support_group_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveSupportGActivityEvidence = (file, object) => {
        dispatch(deleteSupportGActivityEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });
    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(supportGActivityEvidenceUpdate({
            form: {
                ...selectFile?.evidence ?? {},
                id: selectFile?.evidence?.evidence_id ?? null,
                approved: selectFile?.evidence?.approved ? 1 : 0
            }
        })).then(({ data: { data: { evidence } } }) => {

            setFormInit(JSON.stringify({
                name: evidence.name,
                approved: evidence.approved ? true : false,
            }));
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

    // Validaciones
    const supportGActivitySavevalidator = (cmms) => {
        if (!cmms.work) {
        return true;
        }
        const cmmsupporstinit = supporstsinit?.find(el => el.id === cmms.id);

        // Quitar todos los Touched 
        return 'id' in cmms ?
        JSON.stringify({
            id: cmmsupporstinit?.id,
            support_group: cmmsupporstinit?.support_group,
            date_meet: cmmsupporstinit?.date_meet,
            responsible: cmmsupporstinit?.responsible,
            tasks_copasst: cmmsupporstinit?.tasks_copasst,
            report_id: cmmsupporstinit?.report_id,
            created_at: cmmsupporstinit?.created_at,
            updated_at: cmmsupporstinit?.updated_at,
        }) ==
        JSON.stringify({
            id: cmms?.id,
            support_group: cmms?.support_group,
            date_meet: cmms?.date_meet,
            responsible: cmms?.responsible,
            tasks_copasst: cmms?.tasks_copasst,
            report_id: cmms?.report_id,
            created_at: cmms?.created_at,
            updated_at: cmms?.updated_at,
        }) :
        !!(!cmms.work)
    }


  useEffect(() => {
    if (!!supportGroupActionQuery && supportGroupActionQuery.length) {
        setSupports(supportGroupActionQuery);
        setSupporstsInit(supportGroupActionQuery);
    }
  }, [supportGroupActionQuery]);

    return (
        <Grid container> {
            supports?.length !== 0 &&
            supports?.map((cmms, index) => {
                return (
                    <Grid container key={index} >
                        <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                        <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
                            <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>

                                <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                        disabled={cmms?.approved ? true : false}
                                        size="small"
                                        className='birth-date-piker'
                                        sx={{ width: '100%' }}
                                        inputFormat="DD/MM/YYYY"
                                        label="Fecha Reunión"
                                        name="date_meet"
                                        value={cmms?.date_meet ?? null}
                                        onChange={(value) => changeInputSupport({ target: { name: 'date_meet', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                                        renderInput={(params) => <TextField size="small" {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                    {
                                        supportGroupArray &&
                                        supportGroupArray.length &&
                                        <FormControl
                                            fullWidth
                                            className='FormControlExamType'
                                            error={cmms?.support_group === '' || cmms?.support_group === null}
                                            required={true}
                                            sx={{ marginTop: '0px' }}>
                                            <InputLabel
                                                variant="standard"
                                                id="demo-simple-select-label"
                                                sx={{
                                                    color: `${palette.text.primary}`
                                                }}
                                            >Tema</InputLabel>
                                            <Select
                                                disabled={cmms?.approved ? true : false}
                                                variant="standard"
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                name="support_group"
                                                value={cmms?.support_group ?? ''}
                                                label="Grupo de soporte"
                                                onChange={(event) => changeInputSupport(event, index)}>
                                                <MenuItem value={null}><em></em></MenuItem>
                                                {
                                                    supportGroupArray.map((el, index) => (
                                                        <MenuItem key={index} value={el?.value}>{el?.value}</MenuItem>
                                                    ))
                                                }
                                            </Select>
                                            {
                                                cmms?.support_group === '' || cmms?.support_group === null &&
                                                <FormHelperText>Gupo de Soporte es un campo es requerido</FormHelperText>
                                            }
                                        </FormControl>
                                    }
                                </Grid>
                            </Grid>

                            <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>
                                <Tooltip title="Eliminar Registro" placement="top">
                                    <span>
                                        <IconButton
                                        disabled={cmms?.approved ? true : false}
                                        onClick={() => handleDeleteSupportReport(cmms)}
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
                                        disabled={supportGActivitySavevalidator(cmms) || cmms?.approved ? true : false}
                                        onClick={() => handleSaveSupport(cmms)}>
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
                                                onClick={() => handleSaveSupport({ ...cmms, approved: !cmms?.approved })}>
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
            })}

        <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>

                </Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Button onClick={() => {
                    setSupports(cmms => [...cmms, {
                        support_group: null,
                        date_meet: null,
                        responsible: false,
                        tasks_copasst: false,
                        report_id: report_id,
                        save: false
                    }])
                    }}
                    variant="contained"
                    disabled={!!supports?.find(el => el.save === false)}
                    sx={{
                        height: '100%',
                        color: `${palette.text.custom}`,
                        // border: '1px solid'
                    }}>AGREGAR CORRECCIÓN
                    </Button>
                </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}