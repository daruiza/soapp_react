
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Divider, FormControlLabel, Grid, IconButton, Switch, TextField, Tooltip } from '@mui/material';
import { ShowByCorrectiveRSSTEvidenceId, inspectionRSSTCorrectiveStore, deleteCorrectiveRSSTEvidenceId, correctiveRSSTEvidenceUpdate } from '../../../../store';
import { EvidenceGenericComponent } from '../../../components/evidences/EvidenceGenericComponent';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';

import { useTheme } from '@emotion/react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { DialogAlertComponent } from '../../../components';
import { useCorectiveRSSTDeleteId, useCorectiveRSSTStore } from '../../../../hooks';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { getSoappDownloadFile } from '../../../../api';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

export const ReportCorrectiveMonitoringRSSTComponent = ({
  report_id = null,
  commerce_id = null,
  correctives = null,
  setCorrectives = () => { },
  correctiveRSSTQuery = [],
  getCorrectiveMotiroringByReportIdReport = () => { } }) => {

  const dispatch = useDispatch();
  const { palette } = useTheme();

  const [correctivesinit, setCorrectivesInit] = useState([]);
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

  // QUERYs
  const { mutate: correctiveRSSTdelete } = useCorectiveRSSTDeleteId(
    {},
    () => {
      getCorrectiveMotiroringByReportIdReport();
      setHandleAlert({ openAlert: false })
    });

  const { mutate: correctiveRSSTstore } = useCorectiveRSSTStore(
    {}, getCorrectiveMotiroringByReportIdReport
  )
  
  // Eventos

  // Cambios en los inputs del Array correctives
  const changeInputCorrective = ({ target: { value, name } }, index) => {
    setCorrectives((cmms) => cmms.toSpliced(index, 1,
      {
        ...correctives[index],
        [name]: value,
        [`${name}Touched`]: true
      })
    );
  }

  const handleDeleteCorrectiveReport = (cmms) => {
    setHandleAlert({
      openAlert: true,
      functionAlertClose: () => setHandleAlert({ openAlert: false }),
      functionAlertAgree: () => correctiveRSSTdelete(cmms),
      alertTittle: 'Eliminar Registro',
      alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
    });
  }

  const handleSaveCorrective = (cmms) => {
    
    if (!cmms.work) {
      return;
    }
    correctiveRSSTstore(cmms);
  }

  const handleEvidenceOpen = (cmms) => {    
    setOpenEvidences((openEvidences) => ({
      ...openEvidences,
      dialogtitle: `Evidencias Correción RSST Item: ${cmms?.work}`,
      dialogcontenttext: ``,
      object: cmms,
      approved: cmms.approved,
      open: true
    }))
  }

  // Evidences
  const getEvidencesById = (id) => {
    if (id) {
      dispatch(ShowByCorrectiveRSSTEvidenceId({
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

  const storeCorrectiveEvidence = (data, file, object) => {
        dispatch(inspectionRSSTCorrectiveStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                corrective_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveCorrectiveEvidence = (file, object) => {
        dispatch(deleteCorrectiveRSSTEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });
    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(correctiveRSSTEvidenceUpdate({
            form: {
                ...selectFile?.evidence ?? {},
                id: selectFile?.evidence?.evidence_id ?? null,
                approved: selectFile?.evidence?.approved ? 1 : 0,

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
  const correctiveSavevalidator = (cmms) => {
    if (!cmms.work) {
      return true;
    }
    const cmmcorrectiveinit = correctivesinit?.find(el => el.id === cmms.id);

    // Quitar todos los Touched 
    return 'id' in cmms ?
      JSON.stringify({
        id: cmmcorrectiveinit?.id,
        work: cmmcorrectiveinit?.work,
        date: cmmcorrectiveinit?.date,
        corrective_action: cmmcorrectiveinit?.corrective_action ? true : false,
        executed: cmmcorrectiveinit?.executed ? true : false,
        observations: cmmcorrectiveinit?.observations,
        report_id: cmmcorrectiveinit?.report_id,
        created_at: cmmcorrectiveinit?.created_at,
        updated_at: cmmcorrectiveinit?.updated_at,
      }) ==
      JSON.stringify({
        id: cmms?.id,
        work: cmms?.work,
        date: cmms?.date,
        corrective_action: cmms?.corrective_action ? true : false,
        executed: cmms?.executed ? true : false,
        observations: cmms?.observations,
        report_id: cmms?.report_id,
        created_at: cmms?.created_at,
        updated_at: cmms?.updated_at,
      }) :
      !!(!cmms.work)
  }


  useEffect(() => {
    if (!!correctiveRSSTQuery && correctiveRSSTQuery.length) {
      setCorrectives(correctiveRSSTQuery);
      setCorrectivesInit(correctiveRSSTQuery);
    }
  }, [correctiveRSSTQuery]);


  return (
    <Grid container> {
      correctives?.length !== 0 &&
      correctives?.map((cmms, index) => {
        return (
          <Grid container key={index} >
            <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
            <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
              <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>
                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <TextField
                    disabled={cmms?.approved ? true : false}
                    variant="standard"
                    size="small"
                    label="Obra/Frente/Area*"
                    type="text"
                    fullWidth
                    name="work"
                    value={cmms?.work ?? ''}
                    onChange={(event) => changeInputCorrective(event, index)}
                    error={cmms?.work === ''}
                    helperText={cmms?.workTouched && !cmms?.work ? 'Este campo es requerido' : ''}
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
                      label="Fecha Propuesta"
                      name="date"
                      value={cmms?.date ?? null}
                      onChange={(value) => changeInputCorrective({ target: { name: 'date', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                      renderInput={(params) => <TextField size="small" {...params} />}
                    />
                  </LocalizationProvider>
                </Grid>

                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <FormControlLabel
                    disabled={cmms?.approved ? true : false}
                    sx={{ ml: 2 }}
                    control={<Switch
                      checked={cmms.corrective_action ? true : false}
                      onChange={(event) => changeInputCorrective({ target: { value: event.target.checked, name: 'corrective_action' } }, index)}
                      name="corrective_action" />}
                    label={`${cmms.corrective_action ? 'Acción correctiva SI' : 'Acción correctiva NO'}`}
                  />
                </Grid>

                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <FormControlLabel
                    disabled={cmms?.approved ? true : false}
                    sx={{ ml: 2 }}
                    control={<Switch
                      checked={cmms.executed ? true : false}
                      onChange={(event) => changeInputCorrective({ target: { value: event.target.checked, name: 'executed' } }, index)}
                      name="executed" />}
                    label={`${cmms.executed ? 'Acción correctiva ejecutada' : 'Acción Correctiva no ejecutada'}`}
                  />
                </Grid>

                <Grid item xs={12} md={6} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                  <TextField
                    disabled={cmms?.approved ? true : false}
                    variant="standard"
                    size="small"
                    label="Observaciones"
                    type="text"
                    fullWidth
                    name="observations"
                    value={cmms?.observations ?? ''}
                    onChange={(event) => changeInputCorrective(event, index)}
                  />
                </Grid>

              </Grid>

              <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>
                <Tooltip title="Eliminar Registro" placement="top">
                  <span>
                    <IconButton
                      disabled={cmms?.approved ? true : false}
                      onClick={() => handleDeleteCorrectiveReport(cmms)}
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
                      disabled={correctiveSavevalidator(cmms) || cmms?.approved ? true : false}
                      onClick={() => handleSaveCorrective(cmms)}>
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
                            onClick={() => handleSaveCorrective({ ...cmms, approved: !cmms?.approved })}>
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
              setCorrectives(cmms => [...cmms, {
                work: null,
                date: null,
                corrective_action: false,
                executed: false,
                observations: null,
                report_id: report_id,
                save: false
              }])
            }}
              variant="contained"
              disabled={!!correctives?.find(el => el.save === false)}
              sx={{
                height: '100%',
                color: `${palette.text.custom}`,
                // border: '1px solid'
              }}>AGREGAR CORRECCIÓN
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
          upload_evidence_url={`images/commerce/${commerce_id}/report/${report_id}/correctiversst/${openEvidences?.object?.id ?? null}`}
          files={files}
          setFiles={setFiles}
          getEvidencesById={getEvidencesById}
          evidenceStore={storeCorrectiveEvidence}
          handleRemove={handleRemoveCorrectiveEvidence}
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
