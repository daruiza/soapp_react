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

import { useGeneraNamelList, useWorkManagementDeleteId, useWorkManagementStore } from '../../../../hooks';
import { ShowByWorkManagementId, workManagementEvidenceStore, deleteWorkManagementEvidenceId, workManagementEvidenceUpdate } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';


export const ReportWorkManagementComponent = ({
  report_id = null,
  commerce_id = null,
  worksManagement = [],
  setWorksManagement = () => { },
  workManagementQuery = [],
  getWorkManagementByReportIdReport = () => { } }) => {

  const dispatch = useDispatch();
  const { palette } = useTheme();

  const [workActivityArray, setWorkActivityArray] = useState([]);
  const [workTypeArray, setWorkTypeArray] = useState([]);

  const [worksManagementinit, setWorksManagementInit] = useState([]);
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

  // Funciones para querys

  // Set de las listas genericas
  const setGenericList = (arraydata) => {
    if (!!arraydata && arraydata.length) {
      setWorkActivityArray(arraydata?.filter((el) => el.name === "work_activity") ?? []);
      setWorkTypeArray(arraydata?.filter((el) => el.name === "work_type") ?? []);
    }
  }

  // Query  
  const { data: generalListArray, mutate: generalListQueryMutate } = useGeneraNamelList("work_activity,work_type", setGenericList);
  const { mutate: workManagementDelete } = useWorkManagementDeleteId(
    {},
    () => {
      getWorkManagementByReportIdReport();
      setHandleAlert({ openAlert: false })
    }
  );

  const { mutate: workManagementstore } = useWorkManagementStore(
    {}, getWorkManagementByReportIdReport
  );

  // Eventos

  // Cambios en los inputs del Array support
  const changeInputWorkManagement = ({ target: { value, name } }, index) => {
    setWorksManagement((cmms) => cmms.toSpliced(index, 1,
      {
        ...worksManagement[index],
        [name]: value,
        [`${name}Touched`]: true
      })
    );
  }

  const handleDeleteWorkManagement = (cmms) => {
    setHandleAlert({
      openAlert: true,
      functionAlertClose: () => setHandleAlert({ openAlert: false }),
      functionAlertAgree: () => workManagementDelete(cmms),
      alertTittle: 'Eliminar Registro',
      alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
    });
  }

  const handleSaveWorkManagement = (cmms) => {
    if (!cmms.activity || !cmms.work_type) {
      return;
    }
    workManagementstore(cmms);
  }

  const handleEvidenceOpen = (cmms) => {
    setOpenEvidences((openEvidences) => ({
      ...openEvidences,
      dialogtitle: `Evidencias Gestión de Trabajos Activity Item: ${cmms?.work}`,
      dialogcontenttext: ``,
      object: cmms,
      approved: cmms.approved,
      open: true
    }))
  }

  // Evidences
  const getEvidencesById = (id) => {
    if (id) {
      dispatch(ShowByWorkManagementId({
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

  const storeWorkManagementEvidence = (data, file, object) => {
    dispatch(workManagementEvidenceStore({
      form: {
        name: file.name.split('.')[0],
        type: file.type,
        work_management_id: object.id,
        file: data.storage_image_path,
        approved: false
      }
    })).then(({ data: { data: { evidence } } }) => {
      file.approved = evidence?.approved ? true : false;
      file.evidence_id = evidence.id;
      setFiles((files) => [...files, file]);
    }, error => setMessageSnackbar({ dispatch, error }))
  }

  const handleRemoveWorkManagementEvidence = (file, object) => {
    dispatch(deleteWorkManagementEvidenceId({
      form: { id: file.evidence_id }
    })).then((data) => {
      setFiles((files) => [...files.filter(fl => fl !== file)]);
      // Refrescamos el Report Component
      getEvidencesById(openEvidences?.object?.id ?? null)
    });
  }

  const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
    dispatch(workManagementEvidenceUpdate({
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
  const workManagementSavevalidator = (cmms) => {
    if (
      !cmms.activity ||
      !cmms.work_type
    ) { return true; }

    const cmmworkmanagementinit = worksManagementinit?.find(el => el.id === cmms.id);

    // Quitar todos los Touched 
    return 'id' in cmms ?
      JSON.stringify({
        id: cmmworkmanagementinit?.id,
        activity: cmmworkmanagementinit?.activity,
        work_type: cmmworkmanagementinit?.work_type,
        workers_activity: cmmworkmanagementinit?.workers_activity,
        workers_trained: cmmworkmanagementinit?.workers_trained,
        permissions: cmmworkmanagementinit?.permissions,
        observations: cmmworkmanagementinit?.observations,
        report_id: cmmworkmanagementinit?.report_id,
        created_at: cmmworkmanagementinit?.created_at,
        updated_at: cmmworkmanagementinit?.updated_at,
      }) ==
      JSON.stringify({
        id: cmms?.id,
        activity: cmms?.activity,
        work_type: cmms?.work_type,
        workers_activity: cmms?.workers_activity,
        workers_trained: cmms?.workers_trained,
        permissions: cmms?.permissions,
        observations: cmms?.observations,
        report_id: cmms?.report_id,
        created_at: cmms?.created_at,
        updated_at: cmms?.updated_at,
      }) :
      !!((!cmms.activity) || (!cmms.work_type))
  }

  useEffect(() => {
    if (!!workManagementQuery && workManagementQuery.length) {
      setWorksManagementInit(worksManagement);
      // setWorksManagementInit(workManagementQuery);
    }
  }, [workManagementQuery]);

  useEffect(() => {
    generalListQueryMutate("work_activity,work_type");
  }, []);

  return (
    <Grid container> {
      worksManagement?.length !== 0 &&
      worksManagement?.map((cmms, index) => {
        return (
          <Grid container key={index} >
            <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
            <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
              <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>

                <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                  {
                    workActivityArray &&
                    workActivityArray.length &&
                    <FormControl
                      fullWidth
                      className='FormControlExamType'
                      error={cmms?.activityTouched && !cmms?.activity}
                      required={true}
                      sx={{ marginTop: '0px' }}>
                      <InputLabel
                        variant="standard"
                        id="demo-simple-select-label"
                        sx={{
                          color: `${palette.text.primary}`
                        }}
                      >Actividad</InputLabel>
                      <Select
                        disabled={cmms?.approved ? true : false}
                        variant="standard"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="activity"
                        value={cmms?.activity ?? ''}
                        label="Actividad"
                        onChange={(event) => changeInputWorkManagement(event, index)}>
                        <MenuItem value={null}><em></em></MenuItem>
                        {
                          workActivityArray.map((el, index) => (
                            <MenuItem key={index} value={el?.value}>{el?.value}</MenuItem>
                          ))
                        }
                      </Select>
                      {
                        (cmms?.activityTouched && !cmms?.activity) &&
                        <FormHelperText>Este campo es requerido</FormHelperText>
                      }

                    </FormControl>
                  }
                </Grid>

                <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                  {
                    workTypeArray &&
                    workTypeArray.length &&
                    <FormControl
                      fullWidth
                      className='FormControlExamType'
                      error={cmms?.work_typeTouched && !cmms?.work_type}
                      required={true}
                      sx={{ marginTop: '0px' }}>
                      <InputLabel
                        variant="standard"
                        id="demo-simple-select-label"
                        sx={{
                          color: `${palette.text.primary}`
                        }}
                      >Tipo de Trabajo</InputLabel>
                      <Select
                        disabled={cmms?.approved ? true : false}
                        variant="standard"
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="work_type"
                        value={cmms?.work_type ?? ''}
                        label="Tipo de Trabajo"
                        onChange={(event) => changeInputWorkManagement(event, index)}>
                        <MenuItem value={null}><em></em></MenuItem>
                        {
                          workTypeArray.map((el, index) => (
                            <MenuItem key={index} value={el?.value}>{el?.value}</MenuItem>
                          ))
                        }
                      </Select>
                      {
                        (cmms?.work_typeTouched && !cmms?.work_type) &&
                        <FormHelperText>Este campo es requerido</FormHelperText>
                      }

                    </FormControl>
                  }
                </Grid>

                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <TextField
                    disabled={cmms?.approved ? true : false}
                    variant="standard"
                    size="small"
                    label="# Trabajadores que realizan la actividad"
                    type="text"
                    fullWidth
                    name="workers_activity"
                    value={cmms?.workers_activity ?? ''}
                    onChange={(event) => changeInputWorkManagement(event, index)}
                    error={cmms?.workers_activity === ''}
                    helperText={cmms?.workers_activityTouched && !cmms?.workers_activity ? 'Este campo es requerido' : ''}
                  />
                </Grid>

                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <TextField
                    disabled={cmms?.approved ? true : false}
                    variant="standard"
                    size="small"
                    label="# Trabajadores capacitados"
                    type="text"
                    fullWidth
                    name="workers_trained"
                    value={cmms?.workers_trained ?? ''}
                    onChange={(event) => changeInputWorkManagement(event, index)}
                    error={cmms?.workers_trained === ''}
                    helperText={cmms?.workers_trainedTouched && !cmms?.workers_trained ? 'Este campo es requerido' : ''}
                  />
                </Grid>                
                
                <Grid item xs={12} md={6} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <TextareaField
                    disabled={cmms?.approved ? true : false}
                    label="Observaciones"
                    name="observations"
                    value={cmms?.observations ?? ''}
                    onChange={(event) => changeInputWorkManagement(event, index)}
                    placeholder=""
                    minRows={2}
                    sx={{ minwidth: '100%' }}
                  ></TextareaField>
                </Grid>

                <Grid item xs={12} md={4} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <FormControlLabel
                    disabled={cmms?.approved ? true : false}
                    sx={{ ml: 2 }}
                    control={<Switch
                      checked={cmms.permissions ? true : false}
                      onChange={(event) => changeInputWorkManagement({ target: { value: event.target.checked, name: 'permissions' } }, index)}
                      name="permissions" />}
                    label={`${cmms.permissions ? 'Premisos ejecutados: SI' : 'Premisos ejecutados: NO'}`}
                  />
                </Grid>                


              </Grid>

              <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>
                <Tooltip title="Eliminar Registro" placement="top">
                  <span>
                    <IconButton
                      disabled={cmms?.approved ? true : false}
                      onClick={() => handleDeleteWorkManagement(cmms)}
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
                          disabled={workManagementSavevalidator(cmms) || cmms?.approved ? true : false}
                          onClick={() => handleSaveWorkManagement(cmms)}>
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
                                      onClick={() => handleSaveWorkManagement({ ...cmms, approved: !cmms?.approved })}>
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
              setWorksManagement(cmms => [...cmms, {
                activity: null,
                work_type: null,
                workers_activity: null,
                workers_trained: null,
                permissions: null,
                observations: null,
                report_id: report_id,
                save: false
              }])
            }}
              variant="contained"
              disabled={!!worksManagement?.find(el => el.save === false)}
              sx={{
                height: '100%',
                color: `${palette.text.custom}`,
                // border: '1px solid'
              }}>AGREGAR GESTIÓN DE TRABAJO
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
            upload_evidence_url={`images/commerce/${commerce_id}/report/${report_id}/workmanagement/${openEvidences?.object?.id ?? null}`}
            files={files}
            setFiles={setFiles}
            getEvidencesById={getEvidencesById}
            evidenceStore={storeWorkManagementEvidence}
            handleRemove={handleRemoveSupportGActivityEvidence}
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
