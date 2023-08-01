import { useTheme } from '@emotion/react';
import { Button, Grid } from '@mui/material'
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

export default function ReportActivityComponent({ activities = [], report = {}, setActivities = () => { }, getReportById = () => { } }) {

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
    dispatch(trainingsstDeleteById({
      form: { ...act }
    })).then((data) => {
      getReportById();
    });
  }

  const handleSaveActivity = (act) => {
    // Validamos que todos los campos esten llenos
    if (!act.activity || !act.date) {
      return;
    }

    if ('id' in act && act.id) {
      dispatch(trainingsstUpdate({
        form: { ...act }
      })).then(({ data: { data: { activity } } }) => {
        setActivitiesInit(act => ([...act.filter(el => el.id !== activity.id), activity]));
        getReportById();
      });
    } else {
      dispatch(trainingsstStore({
        form: { ...act }
      })).then(({ data: { data: { activity } } }) => {
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
    console.log('report', report)
  }, [report]);

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
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}></Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}></Grid>
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
              // setTrainingsst(sst => [...sst, {
              //   topic: undefined,
              //   date: null,
              //   hours: null,
              //   assistants: null,
              //   report_id: report?.id,
              //   save: false
              // }])
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
    </Grid>
  )
}
