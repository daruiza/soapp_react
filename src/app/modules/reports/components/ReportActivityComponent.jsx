import { useTheme } from '@emotion/react';
import { Button, Grid, TextField, Tooltip, IconButton } from '@mui/material'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActivityEvidenceComponent } from '../../../components';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { activityDeleteById, activityStore, activityUpdate } from '../../../../store/activity/activityThunks';



export default function ReportActivityComponent({ activities = [], report = {}, setActivities = () => { }, getReportById = () => { }, commerce_id = null }) {

  const dispatch = useDispatch();
  const { palette } = useTheme();

  const [activitiesinit, setActivitiesInit] = useState([]);

  const [openEvidences, setOpenEvidences] = useState({
    open: false,
    dialogtitle: '',
    dialogcontenttext: '',
    activity: {}
  });

  const [handleAlert, setHandleAlert] = useState({
    openAlert: false,
    functionAlertClose: () => { },
    functionAlertAgree: () => { },
    alertTittle: '',
    alertMessage: '',
    alertChildren: false
  });


  // Eventos

  // Cambios en los inputs del Array activities
  const changeInputActivities = ({ target: { value, name } }, index) => {
    setActivities((sst) => sst.toSpliced(index, 1,
      {
        ...activities[index],
        [name]: value
      })
    )
  }

  const handleEvidenceOpen = (act) => {
    setOpenEvidences((openEvidences) => ({
      ...openEvidences,
      dialogtitle: `Evidencias: ${act?.activity}`,
      dialogcontenttext: `${act?.date}`,
      activity: act,
      open: true
    }))
  }

  const handleEvidenceClose = () => {
    setOpenEvidences((openEvidences) => ({ ...openEvidences, open: false }));
  }

  const handleDeleteActivity = (act) => {
    dispatch(activityDeleteById({
      form: { ...act }
    })).then((data) => {
      console.log('handleDeleteActivity', data);
      getReportById();
    });
  }

  const handleSaveActivity = (act) => {
    // Validamos que todos los campos esten llenos
    if (!act.activity || !act.date) {
      return;
    }

    if ('id' in act && act.id) {
      dispatch(activityUpdate({
        form: { ...act }
      })).then(({ data: { data: { activity } } }) => {
        setActivitiesInit(act => ([...act.filter(el => el.id !== activity.id), activity]));
        getReportById();
      });
    } else {
      dispatch(activityStore({
        form: { ...act }
      })).then(({ data: { data: { activity } } }) => {
        console.log('data', testingsst);
        setActivitiesInit(act => ([...act.filter(el => el.id !== activity.id), activity]));
        getReportById();
      });
    }
  }

  // Validacines
  const numberPatternValidation = (value) => {
    if (!value) return true;
    const regex = new RegExp(/^\d+$/);
    return regex.test(value);
  };

  const activitySavevalidator = (act) => {
    if (!act.activity || !act.date) {
      return true;
    }
    const auxactivityinit = activitiesinit?.find(el => el.id === act.id);

    return 'id' in act ?
      JSON.stringify({ ...auxactivityinit, approved: auxactivityinit?.approved ? true : false }) == JSON.stringify({ ...act, approved: act?.approved ? true : false }) :
      !!(!act.activity || !act.date)
  }

  useEffect(() => {
    setActivitiesInit(activities);
  }, []);

  useEffect(() => {
    if (activitiesinit.length) {
      activitySavevalidator(activities[activities.length - 1])
    }
  }, [activitiesinit]);

  return (
    <Grid container>
      {
        activities?.length !== 0 &&
        activities.map((activity, index) => {
          return (
            <Grid container key={index}>
              <Grid item xs={12} md={12} sx={{ display: "flex" }}>
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>

                  <Grid item xs={12} md={8} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                    <TextField
                      disabled={activity?.approved ? true : false}
                      variant="standard"
                      size="small"
                      label="Actividad"
                      type="text"
                      fullWidth
                      name="activity"
                      value={activity?.activity ?? ''}
                      onChange={(event) => changeInputActivities(event, index)}
                    />
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                      <DatePicker
                        disabled={activity?.approved ? true : false}
                        size="small"
                        className='birth-date-piker'
                        sx={{ width: '100%' }}
                        inputFormat="DD/MM/YYYY"
                        label="Fecha"
                        name="date"
                        value={activity?.date ?? null}
                        onChange={(value) => changeInputActivities({ target: { name: 'date', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                        renderInput={(params) => <TextField size="small" {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>


                </Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>

                  <Tooltip title="Eliminar Registro" placement="top">
                    <span>
                      <IconButton
                        disabled={activity?.approved ? true : false}
                        onClick={() => handleDeleteActivity(activity)}
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
                        disabled={activitySavevalidator(activity) || activity?.approved ? true : false}
                        onClick={() => handleSaveActivity(activity)}                                            >
                        <SaveIcon
                        // sx={{ color: !validatorSaveEmployeeInsetDisabled(cl) ? palette.primary.main : '' }}
                        ></SaveIcon>
                      </IconButton>
                    </span>
                  </Tooltip>

                  {
                    activity?.id &&
                    <>
                      <Tooltip title="Evidencias" placement="top">
                        <span>
                          <IconButton
                            disabled={activity?.approved ? true : false}
                            onClick={() => handleEvidenceOpen(activity)}
                          ><AttachFileIcon></AttachFileIcon></IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip title={`${activity?.approved ? 'Aprobado' : 'Aprobar'}`} placement="top">
                        <span>
                          <PrivateAgentRoute>
                            <IconButton
                              onClick={() => handleSaveActivity({ ...activity, approved: !activity?.approved })}>
                              {!!activity?.approved &&
                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                              }
                              {!activity?.approved &&
                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                              }
                            </IconButton>
                          </PrivateAgentRoute>

                          <PrivateCustomerRoute>
                            <IconButton disabled>
                              {activity?.approved &&
                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                              }
                              {!activity?.approved &&
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
              setActivities(acts => [...acts, {
                activity: null,
                date: null,
                report_id: report?.id,
                save: false
              }])
            }}
              variant="contained"
              disabled={!!activities.find(el => el.save === false)}
              sx={{
                height: '100%',
                color: `${palette.text.custom}`,
                // border: '1px solid'
              }}>AGREGAR ACTIVIDAD
            </Button>
          </Grid>
        </Grid>
      </Grid>

      {
        openEvidences.open && <ActivityEvidenceComponent
          open={openEvidences.open}
          dialogtitle={openEvidences.dialogtitle}
          dialogcontenttext={openEvidences.dialogcontenttext}
          activity={openEvidences.activity}
          report_id={report.id}
          commerce_id={commerce_id}
          handleClose={handleEvidenceClose}
        ></ActivityEvidenceComponent>
      }

    </Grid>
  )
}
