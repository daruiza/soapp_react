import { useTheme } from '@emotion/react';
import { Grid } from '@mui/material'
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function ReportActivityComponent({ activities = [], report = {}, setActivities = () => { } }) {

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

  const handleDeleteTrainingSST = (tsst) => {
    dispatch(trainingsstDeleteById({
      form: { ...tsst }
    })).then((data) => {
      getReportById();
    });
  }

  const handleSaveTrainingSST = (tsst) => {
    // Validamos que todos los campos esten llenos
    if (!tsst.topic ||
      !tsst.hours ||
      !tsst.assistants ||
      !tsst.date) {
      return;
    }

    if ('id' in tsst && tsst.id) {
      dispatch(trainingsstUpdate({
        form: { ...tsst }
      })).then(({ data: { data: { trainingsst } } }) => {
        setTrainingsstInit(tsst => ([...tsst.filter(el => el.id !== trainingsst.id), trainingsst]));
        getReportById();
      });
    } else {
      dispatch(trainingsstStore({
        form: { ...tsst }
      })).then(({ data: { data: { testingsst } } }) => {
        setTrainingsstInit(tsst => ([...tsst.filter(el => el.id !== testingsst.id), testingsst]));
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

  const trainingSSTSavevalidator = (tsst) => {
    if (!tsst.topic ||
      !tsst.hours ||
      !tsst.assistants ||
      !tsst.date) {
      return true;
    }

    const tssttrainingsstinit = trainingsstinit?.find(el => el.id === tsst.id);

    return 'id' in tsst ?
      JSON.stringify({ ...tssttrainingsstinit, approved: tssttrainingsstinit?.approved ? true : false }) == JSON.stringify({ ...tsst, assistants: +tsst?.assistants, hours: +tsst?.hours, approved: tsst?.approved ? true : false }) :
      !!(!tsst.topic ||
        !tsst.hours ||
        !tsst.assistants ||
        !tsst.date)
  }

  useEffect(() => {
    setTrainingsstInit(trainingsst);
  }, []);

  useEffect(() => {
    console.log('report', report)
  }, [report]);

  useEffect(() => {
    if (trainingsstinit.length) {
      trainingSSTSavevalidator(trainingsst[trainingsst.length - 1])
    }
  }, [trainingsstinit]);

  return (
    <Grid container>
      { }
    </Grid>
  )
}
