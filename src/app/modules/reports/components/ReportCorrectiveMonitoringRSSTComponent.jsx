
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Divider, FormControlLabel, Grid, IconButton, Switch, TextField, Tooltip } from '@mui/material';
import { correctiveRSSTShowByReportId, correctiveRSSTDeleteById } from '../../../../store';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';

import { useTheme } from '@emotion/react';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export const ReportCorrectiveMonitoringRSSTComponent = ({
  report_id = null,
  commerce_id = null,
  correctives = null,
  setCorrectives = () => { },
  getReportById = () => { },
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

  const getCorrectiveByReportId = () => {
    if (report_id) {
      dispatch(correctiveRSSTShowByReportId({
        form: { id: report_id }
      })).then(({ data: { data } }) => {
        setCorrectives(data);
        setCorrectivesInit(data);
      })
    }
  }

  // Eventos

  // Cambios en los inputs del Array correctives
  const changeInputInspection = ({ target: { value, name } }, index) => {
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
      functionAlertAgree: () => handleDeleteCorrective(cmms),
      alertTittle: 'Eliminar Registro',
      alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
    });
  }

  const handleDeleteCorrective = (cmms) => {
    dispatch(correctiveRSSTDeleteById({
      form: { ...cmms }
    })).then((data) => {
      // queryClient.invalidateQueries({ queryKey: ['compromises'] })
      getCorrectiveMotiroringByReportIdReport();
      setHandleAlert({ openAlert: false })
    });
  }

  useEffect(() => {
    if (!!correctiveRSSTQuery && correctiveRSSTQuery.length) {
      console.log('correctiveRSSTQuery', correctiveRSSTQuery);

      setCorrectives(correctiveRSSTQuery);
      setCorrectivesInit(correctiveRSSTQuery);
    }
  }, [correctiveRSSTQuery]);


  return (
    <Grid container>
      {
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
                      onChange={(event) => changeInputInspection(event, index)}
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
                        onChange={(value) => changeInputCompromise({ target: { name: 'date', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
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
                        onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'corrective_action' } }, index)}
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
                        onChange={(event) => changeInputInspection({ target: { value: event.target.checked, name: 'executed' } }, index)}
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
                      onChange={(event) => changeInputInspection(event, index)}
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
                </Grid>
              </Grid>
            </Grid>
          )
        })
      }
    </Grid>
  )
}
