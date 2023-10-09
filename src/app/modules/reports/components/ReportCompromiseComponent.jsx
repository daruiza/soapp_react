import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ShowByCompromiseEvidenceId, compromiseDeleteById, compromiseEvidenceStore, compromiseShowByReportId, compromiseStore, compromiseUpdate, deleteCompromiseEvidenceId } from '../../../../store';
import { EvidenceGenericComponent } from '../../../components/evidences/EvidenceGenericComponent';
import { Button, Divider, FormControlLabel, Grid, IconButton, Switch, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@emotion/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DialogAlertComponent } from '../../../components';
import { getSoappDownloadFile } from '../../../../api';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

export const ReportCompromiseComponent = ({ report_id = null, commerce_id = null, compromises = null, setCompromises = () => { }, getReportById = () => { }, getCompromiseByReportIdReport = () => { } }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [compormisesinit, setCompromisesInit] = useState([]);
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



    const getCompromiseByReportId = () => {
        if (report_id) {
            dispatch(compromiseShowByReportId({
                form: { id: report_id }
            })).then(({ data: { data } }) => {
                setCompromises(data);
                setCompromisesInit(data);
            })
        }
    }

    // Eventos

    // Cambios en los inputs del Array trainingsst
    const changeInputCompromise = ({ target: { value, name } }, index) => {
        setCompromises((cmms) => cmms.toSpliced(index, 1,
            {
                ...compromises[index],
                [name]: value
            })
        )
    }

    const handleEvidenceOpen = (cmms) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias Compromiso Item: ${cmms?.item}`,
            dialogcontenttext: `Norma: ${cmms?.rule} -- Nombre: ${cmms?.name}`,
            object: cmms,
            approved: cmms.approved,
            open: true
        }))
    }

    const handleDeleteComprmiseReport = (cmms) => {
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => handleDeleteCompromise(cmms),
            alertTittle: 'Eliminar Registro',
            alertMessage: `Estas seguro de borrar el registro ${cmms.item}.`
        });
    }

    const handleDeleteCompromise = (cmms) => {
        dispatch(compromiseDeleteById({
            form: { ...cmms }
        })).then((data) => {
            getCompromiseByReportIdReport();
            setHandleAlert({ openAlert: false })
        });
    }

    const handleSaveCompromise = (cmms) => {
        // Validamos que todos los campos esten llenos
        if (!cmms.item ||
            !cmms.rule ||
            !cmms.dateinit ||
            !cmms.dateclose ||
            !cmms.name ||
            !cmms.detail) {
            return;
        }

        if ('id' in cmms && cmms.id) {
            dispatch(compromiseUpdate({
                form: { ...cmms }
            })).then(({ data: { data: { compromise } } }) => {
                // setCompromises(cmms => ([...cmms.filter(el => el.id !== compromise.id), compromise]));
                setCompromisesInit(cmms => ([...cmms.filter(el => el.id !== compromise.id), compromise]));
                getCompromiseByReportIdReport();
            });
        } else {
            dispatch(compromiseStore({
                form: { ...cmms }
            })).then(({ data: { data: { compromise } } }) => {
                // setCompromises(cmms => ([...cmms.filter(el => el.id !== compromise.id), compromise]));
                // setCompromisesInit(cmms => ([...cmms.filter(el => el.id !== compromise.id), compromise]));
                // getCompromiseByReportIdReport();
                getCompromiseByReportId();
            });
        }
    }

    const getEvidencesById = (id) => {
        if (id) {
            dispatch(ShowByCompromiseEvidenceId({
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
    const storeCompromiseEvidence = (data, file, object) => {
        dispatch(compromiseEvidenceStore({
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
        dispatch(deleteCompromiseEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });

    }

    // Validacines
    const numberPatternValidation = (value) => {
        if (!value) return true;
        // const regex = new RegExp(/^\d+$/);
        const regex = new RegExp(/^\d*\.?\d*$/);
        return regex.test(value);
    };

    const compromiseSavevalidator = (cmms) => {
        if (!cmms.item ||
            !cmms.rule ||
            !cmms.name ||
            !cmms.dateinit ||
            !cmms.dateclose ||
            !cmms.detail) {
            return true;
        }

        const cmmscompromiseinit = compormisesinit?.find(el => el.id === cmms.id);

        return 'id' in cmms ?
            JSON.stringify({ ...cmmscompromiseinit, canon: cmmscompromiseinit?.canon ? true : false, approved: cmmscompromiseinit?.approved ? true : false }) ==
            JSON.stringify({ ...cmms, canon: cmms?.canon ? true : false, approved: cmms?.approved ? true : false }) :
            !!(!cmms.item ||
                !cmms.rule ||
                !cmms.name ||
                !cmms.dateinit ||
                !cmms.dateclose ||
                !cmms.detail)
    }

    const getDate = (dateinit) => {
        const date = new Date(dateinit);
        return date.setDate(date.getDate() + 1);

    }

    useEffect(() => {
        setCompromisesInit(compromises);
        // getCompromiseByReportId();
    }, [])

    useEffect(() => {
        if (compormisesinit.length) {
            compromises.forEach(el => {
                compromiseSavevalidator(el);
            })
        }
    }, [compormisesinit]);



    return (
        <Grid container>
            {
                compromises?.length !== 0 &&
                compromises?.map((cmms, index) => {
                    return (
                        <Grid container key={index}>
                            <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                            <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
                                <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>
                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            disabled={cmms?.approved ? true : false}
                                            variant="standard"
                                            size="small"
                                            label="Item"
                                            type="text"
                                            fullWidth
                                            name="item"
                                            value={cmms?.item ?? ''}
                                            onChange={(event) => changeInputCompromise(event, index)}
                                            error={!numberPatternValidation(cmms?.item) ? true : false}
                                            helperText={!numberPatternValidation(cmms?.item) ? 'Se espera un número positivo' : ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            disabled={cmms?.approved ? true : false}
                                            variant="standard"
                                            size="small"
                                            label="Norma"
                                            type="text"
                                            fullWidth
                                            name="rule"
                                            value={cmms?.rule ?? ''}
                                            onChange={(event) => changeInputCompromise(event, index)}
                                        // error={cmms?.rule === ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            disabled={cmms?.approved ? true : false}
                                            variant="standard"
                                            size="small"
                                            label="Name"
                                            type="text"
                                            fullWidth
                                            name="name"
                                            value={cmms?.name ?? ''}
                                            onChange={(event) => changeInputCompromise(event, index)}
                                        // error={cmms?.name === ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                        <PrivateCustomerRoute>
                                            <FormControlLabel
                                                disabled={cmms?.approved ? true : false}
                                                sx={{ ml: 2 }}
                                                control={<Switch
                                                    checked={cmms.canon ? true : false}
                                                    name="canon" />}
                                                label={`${cmms.canon ? 'Cumple' : 'No Cumple'}`}
                                            />
                                        </PrivateCustomerRoute>

                                        <PrivateAgentRoute>
                                            <FormControlLabel
                                                disabled={cmms?.approved ? true : false}
                                                sx={{ ml: 2 }}
                                                control={<Switch
                                                    checked={cmms.canon ? true : false}
                                                    onChange={(event) => changeInputCompromise({ target: { value: event.target.checked, name: 'canon' } }, index)}
                                                    name="canon" />}
                                                label={`${cmms.canon ? 'Cumple' : 'No Cumple'}`}
                                            />
                                        </PrivateAgentRoute>
                                    </Grid>

                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                disabled={cmms?.approved ? true : false}
                                                maxDate={getDate(cmms.dateclose)}
                                                size="small"
                                                className='birth-date-piker'
                                                sx={{ width: '100%' }}
                                                inputFormat="DD/MM/YYYY"
                                                label="Fecha Apertura"
                                                name="dateinit"
                                                value={cmms?.dateinit ?? null}
                                                onChange={(value) => changeInputCompromise({ target: { name: 'dateinit', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>

                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                disabled={cmms?.approved ? true : false}
                                                minDate={getDate(cmms.dateinit)}
                                                size="small"
                                                className='birth-date-piker'
                                                sx={{ width: '100%' }}
                                                inputFormat="DD/MM/YYYY"
                                                label="Fecha Cierre"
                                                name="dateclose"
                                                value={cmms?.dateclose ?? null}
                                                onChange={(value) => changeInputCompromise({ target: { name: 'dateclose', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>


                                    <Grid item xs={12} md={6} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            disabled={cmms?.approved ? true : false}
                                            variant="standard"
                                            size="small"
                                            label="Detalle de Actividad"
                                            type="text"
                                            fullWidth
                                            name="detail"
                                            value={cmms?.detail ?? ''}
                                            onChange={(event) => changeInputCompromise(event, index)}
                                        // error={cmms?.detail === ''}
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
                                                disabled={compromiseSavevalidator(cmms) || cmms?.approved ? true : false}
                                                onClick={() => handleSaveCompromise(cmms)}                                            >
                                                <SaveIcon
                                                // sx={{ color: !validatorSaveEmployeeInsetDisabled(cl) ? palette.primary.main : '' }}
                                                ></SaveIcon>
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
                                                            onClick={() => handleSaveCompromise({ ...cmms, approved: !cmms?.approved })}>
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
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}></Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                        <Button onClick={() => {
                            setCompromises(cmps => [...cmps, {
                                item: null,
                                rule: null,
                                name: null,
                                detail: null,
                                canon: false,
                                dateinit: null,
                                dateclose: null,
                                report_id: report_id,
                                save: false
                            }])
                        }}
                            variant="contained"
                            disabled={!!compromises?.find(el => el.save === false)}
                            sx={{
                                height: '100%',
                                color: `${palette.text.custom}`,
                                // border: '1px solid'
                            }}>AGREGAR COMPROMISO
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {
                openEvidences.open && <EvidenceGenericComponent
                    open={openEvidences.open}
                    dialogtitle={openEvidences.dialogtitle}
                    dialogcontenttext={openEvidences.dialogcontenttext}
                    object={openEvidences.object}
                    report_id={report_id}
                    commerce_id={commerce_id}
                    approved={openEvidences.approved}
                    handleClose={() => setOpenEvidences((openEvidences) => ({ ...openEvidences, open: false }))}
                    upload_evidence_url={`images/commerce/${commerce_id}/report/${report_id}/compromises/${openEvidences?.object?.id??null}`}
                    files={files}
                    setFiles={setFiles}
                    getEvidencesById={getEvidencesById}
                    evidenceStore={storeCompromiseEvidence}
                    handleRemove={handleRemoveCompromiseEvidence}
                ></EvidenceGenericComponent>
            }

            {
                handleAlert.openAlert && <DialogAlertComponent
                    open={handleAlert.openAlert}
                    handleClose={() => handleAlert.functionAlertClose()}
                    handleAgree={() => handleAlert.functionAlertAgree()}
                    props={{
                        tittle: handleAlert.alertTittle,
                        message: handleAlert.alertMessage
                    }}
                ></DialogAlertComponent>
            }
        </Grid>
    )
}
