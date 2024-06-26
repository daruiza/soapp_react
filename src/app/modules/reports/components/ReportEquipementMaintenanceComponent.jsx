
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Divider, Grid, FormControl, TextField, Select, InputLabel, MenuItem, FormHelperText, IconButton, Tooltip, Button, FormControlLabel, Switch } from "@mui/material";
import { TextareaField } from '../../../components/textarea/TextareaField';
import { EvidenceGenericComponent } from '../../../components/evidences/EvidenceGenericComponent';
import { DialogAlertComponent } from '../../../components';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import { useTheme } from '@emotion/react';

import { useEquipementMaintenanceDeleteId, useEquipementMaintenanceStore } from '../../../../hooks';
import { ShowByEquipementMaintenanceId, equipementMaintenanceEvidenceStore, deleteEquipementMaintenanceEvidenceId, equipementMaintenanceEvidenceUpdate } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

export const ReportEquipementMaintenanceComponent = ({
    report_id = null,
    commerce_id = null,
    equipementsMaintenance = [],
    setEquipementsMaintenance = () => { },
    equipementMaintenenceQuery = [],
    getequipementMaintenenceByReportIdReport = () => { }
}) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [equipementMaintenanceinit, setEquipementMaintenanceInit] = useState([]);
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
    const { mutate: equipementMaintenanceDelete } = useEquipementMaintenanceDeleteId(
        {},
        () => {
            getequipementMaintenenceByReportIdReport();
            setHandleAlert({ openAlert: false })
        }
    );

    const { mutate: equipementMaintenancestore } = useEquipementMaintenanceStore(
        {}, getequipementMaintenenceByReportIdReport
    );

    // Cambios en los inputs del Array support
    const changeInputEquipementMaintenance = ({ target: { value, name } }, index) => {
        setEquipementsMaintenance((cmms) => cmms.toSpliced(index, 1,
            {
                ...equipementsMaintenance[index],
                [name]: value,
                [`${name}Touched`]: true
            })
        );
    }

    const handleDeleteEquipementMaintenence = (cmms) => {
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => equipementMaintenanceDelete(cmms),
            alertTittle: 'Eliminar Registro',
            alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
        });
    }

    const handleSaveEquipementMaintenenece = (cmms) => {
        if (!cmms.date || !cmms.observations) {
            return;
        }
        equipementMaintenancestore(cmms);
    }

    const handleEvidenceOpen = (cmms) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias Mantenimiento Periódico Item: ${cmms?.work}`,
            dialogcontenttext: ``,
            object: cmms,
            approved: cmms.approved,
            open: true
        }))
    }

    // Evidences
    const getEvidencesById = (id) => {
        if (id) {
            dispatch(ShowByEquipementMaintenanceId({
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

    const storeEquipementMaintenanceEvidence = (data, file, object) => {
        dispatch(equipementMaintenanceEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                equipement_id: object.id,
                file: data.image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveEquipementMaintenanceEvidence = (file, object) => {
        dispatch(deleteEquipementMaintenanceEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });
    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(equipementMaintenanceEvidenceUpdate({
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

    const equipementMaintenenceSaveValidator = (cmms) => {
        if (
            !cmms.date ||
            !cmms.observations
        ) { return true; }

        const cmmequipementmaintenanceinit = equipementMaintenanceinit?.find(el => el.id === cmms.id);

        // Quitar todos los Touched 
        return 'id' in cmms ?
            JSON.stringify({
                id: cmmequipementmaintenanceinit?.id,
                buildings: cmmequipementmaintenanceinit?.buildings,
                tools: cmmequipementmaintenanceinit?.tools,
                teams: cmmequipementmaintenanceinit?.teams,
                date: cmmequipementmaintenanceinit?.date,
                observations: cmmequipementmaintenanceinit?.observations,
                report_id: cmmequipementmaintenanceinit?.report_id,
                created_at: cmmequipementmaintenanceinit?.created_at,
                updated_at: cmmequipementmaintenanceinit?.updated_at,
            }) ==
            JSON.stringify({
                id: cmms?.id,
                buildings: cmms?.buildings,
                tools: cmms?.tools,
                teams: cmms?.teams,
                date: cmms?.date,
                observations: cmms?.observations,
                report_id: cmms?.report_id,
                created_at: cmms?.created_at,
                updated_at: cmms?.updated_at,
            }) :
            !!((!cmms.date) || (!cmms.observations))
    }

    useEffect(() => {
        if (!!equipementMaintenenceQuery && equipementMaintenenceQuery.length) {
            setEquipementMaintenanceInit(equipementsMaintenance);
            // setEquipementMaintenanceInit(equipementMaintenenceQuery);
        }
    }, [equipementMaintenenceQuery]);

    return (
        <Grid container> {
            equipementsMaintenance?.length !== 0 &&
            equipementsMaintenance?.map((cmms, index) => {
                return (
                    <Grid container key={index} >
                        <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                        <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
                            <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>

                                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                    <FormControlLabel
                                        disabled={cmms?.approved ? true : false}
                                        sx={{ ml: 2 }}
                                        control={<Switch
                                            checked={cmms.buildings ? true : false}
                                            onChange={(event) => changeInputEquipementMaintenance({ target: { value: event.target.checked, name: 'buildings' } }, index)}
                                            name="buildings" />}
                                        label={`${cmms.buildings ? 'Edificios: SI' : 'Edificios: NO'}`}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                    <FormControlLabel
                                        disabled={cmms?.approved ? true : false}
                                        sx={{ ml: 2 }}
                                        control={<Switch
                                            checked={cmms.tools ? true : false}
                                            onChange={(event) => changeInputEquipementMaintenance({ target: { value: event.target.checked, name: 'tools' } }, index)}
                                            name="tools" />}
                                        label={`${cmms.tools ? 'Herramientas: SI' : 'Herramientas: NO'}`}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                    <FormControlLabel
                                        disabled={cmms?.approved ? true : false}
                                        sx={{ ml: 2 }}
                                        control={<Switch
                                            checked={cmms.teams ? true : false}
                                            onChange={(event) => changeInputEquipementMaintenance({ target: { value: event.target.checked, name: 'teams' } }, index)}
                                            name="teams" />}
                                        label={`${cmms.teams ? 'Equipo: SI' : 'Equipo: NO'}`}
                                    />
                                </Grid>

                                <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                        <DatePicker
                                            disabled={cmms?.approved ? true : false}
                                            size="small"
                                            className='birth-date-piker'
                                            sx={{ width: '100%' }}
                                            inputFormat="DD/MM/YYYY"
                                            label="Fecha"
                                            name="date"
                                            value={cmms?.date ?? null}
                                            onChange={(value) => changeInputEquipementMaintenance({ target: { name: 'date', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                                            renderInput={(params) => <TextField size="small" {...params} />}
                                        />
                                    </LocalizationProvider>
                                </Grid>

                                <Grid item xs={12} md={6} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                    <TextareaField
                                        disabled={cmms?.approved ? true : false}
                                        label="Observaciones"
                                        name="observations"
                                        value={cmms?.observations ?? ''}
                                        onChange={(event) => changeInputEquipementMaintenance(event, index)}
                                        placeholder=""
                                        minRows={2}
                                        sx={{ minwidth: '100%' }}
                                    ></TextareaField>
                                </Grid>

                            </Grid>
                            <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>
                                <Tooltip title="Eliminar Registro" placement="top">
                                    <span>
                                        <IconButton
                                            disabled={cmms?.approved ? true : false}
                                            onClick={() => handleDeleteEquipementMaintenence(cmms)}>
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
                                            disabled={equipementMaintenenceSaveValidator(cmms) || cmms?.approved ? true : false}
                                            onClick={() => handleSaveEquipementMaintenenece(cmms)}>
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
                                                        onClick={() => handleSaveEquipementMaintenenece({ ...cmms, approved: !cmms?.approved })}>
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
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}></Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                        <Button onClick={() => {
                        setEquipementsMaintenance(cmms => [...cmms, {
                            buildings: false,
                            tools: false,
                            teams: false,
                            date: null,
                            observations: null,
                            report_id: report_id,
                            save: false
                        }])
                        }}
                        variant="contained"
                        disabled={!!equipementsMaintenance?.find(el => el.save === false)}
                        sx={{
                            height: '100%',
                            color: `${palette.text.custom}`,
                            // border: '1px solid'
                        }}>AGREGAR MANTENIMIENTO PERIÓDICO
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
                    handleClose={() => {
                        setFiles([]);
                        setOpenEvidences((openEvidences) => ({ ...openEvidences, open: false }))
                    }}
                    upload_evidence_url={`commerce/${commerce_id}/report/${report_id}/equipementmaintenance/${openEvidences?.object?.id ?? null}`}
                    files={files}
                    setFiles={setFiles}
                    getEvidencesById={getEvidencesById}
                    evidenceStore={storeEquipementMaintenanceEvidence}
                    handleRemove={handleRemoveEquipementMaintenanceEvidence}
                    handleFileItemUpload={handleFileItemUpload}
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
