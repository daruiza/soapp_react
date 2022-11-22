import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { commerceUpdate, getCommerceByCommerce, reportIndex, userByRolId, userIndex } from '../../../../store';
import { ReportItemComponent } from './ReportItemComponent';
import { ReportStoreComponent } from './ReportStoreComponent';
import { useForm } from '../../../../hooks';
import { useParams } from 'react-router-dom';
import { PrivateResponsibleRoute } from '../../../middleware';
import { Button, Grid, Switch, TextField, Typography, FormControl, FormHelperText, InputLabel, Select, MenuItem, Card, Collapse, Alert, IconButton, Box, Pagination } from '@mui/material';
import { genericListGetByName } from '../../../../store/genericlist/genericlistThunks';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';
import { RolTypes } from '../../../types';

const formValidations = {
  progress: [(value) => (RegExp('^[0-9]+$').test(value) && value < 101) || !value, 'El Progrespo es un número de 0 a 100.'],
  year: [(value) => (RegExp('^[0-9]+$').test(value) && value < 9999) || !value, 'El año es un número de 0 a 9999.'],
};

const forminit = {
  commerce_id: '',
  project: '',
  responsible: '',
  progress: '',
  year: dayjs().format('YYYY'),
  month: '',
};

export const ReportIndexComponent = ({ navBarWidth = 58 }) => {

  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { commerce_id: param_commerce_id } = useParams();
  const { commerce: commerceState } = useSelector(state => state.commerce);
  const commerce = useMemo(() => commerceState, [commerceState]);

  const {
    project,
    responsible,
    progress,
    year,
    month,
    progressToched,
    progressValid,
    yearToched,
    yearValid,
    formState,
    isFormValid,
    formChange,
    setInput,
    onResetForm,
    onInputClick,
    onInputChange,
    onInputChangeValue
  } = useForm(forminit, formValidations);

  const [flterToggle, setFilterToggle] = useState(false);
  const [openReportStore, setOpenStoreReport] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);

  const [report, setReport] = useState({});
  const [reportTable, setReportTable] = useState({});
  const [reportArray, setReportArray] = useState([]);
  const [responsibleArray, setResponsibleArray] = useState([])
  const [projectArray, setProjectArray] = useState([])
  const [monthArray, setMontArray] = useState([]);

  // LLAMADO DE SERVICIOS
  const getReports = (attr = {}, form = formState) => {
    const commerce_id = form?.commerce_id ? form.commerce_id : commerce?.id ?? param_commerce_id;
    if (commerce_id) {
      dispatch(reportIndex({
        form: {
          ...form,
          ...attr,
          commerce_id: commerce_id
        }
      })).then(({ data: { data: { report } } }) => {
        setReportTable(report);
        setReportArray(report.data);
      });
    }
  }

  const getProject = () => {
    dispatch(genericListGetByName({ name: 'project' }))
      .then(({ data: { data: { generallist } } }) => {
        setProjectArray(generallist ?? []);
      });
  }

  const getResponsibles = (attr = {}, form = formState) => {
    dispatch(userByRolId({ form: { ...form, ...attr, rol_id: RolTypes.responsible } }))
      .then(({ data: { data: { users } } }) => {
        setResponsibleArray(users);
      });
  }

  const getMonth = () => {
    dispatch(genericListGetByName({ name: 'month' }))
      .then(({ data: { data: { generallist } } }) => {
        setMontArray(generallist ?? []);
      });
  }

  // COMPORTAMIENTO
  const changeFilterToggle = (event) => {
    setFilterToggle(event.target.checked);
  }

  const onInputProgress = (event) => {
    const { target: { value } } = event;
    if (RegExp('^[0-9]+$').test(value) || !value) {
      setInput('progress', value);
    }
    event.preventDefault();
  }

  const onInputYear = (event) => {
    const { target: { value } } = event;
    if (RegExp('^[0-9]+$').test(value) || !value) {
      setInput('year', value);
    }
    event.preventDefault();
  }

  // EVENTOS
  const onClearForm = () => {
    onResetForm({ initialForm: forminit });
    getReports({ page: 1 }, forminit);
  }

  const handleReportStoreOpen = () => {
    setReport({});
    setOpenStoreReport(true);
  }

  const handleReportStoreClose = () => {
    setReport({});
    setOpenStoreReport(false);
  }

  const handleReportUpdate = (report) => {
    setReport(report);
    setOpenStoreReport(true);
  }

  const handlePaginationChange = (event, page) => {
    getReports({ page: page });
  }

  // COMPORTAMIENTO YEAR
  useEffect(() => {
    if (!year) {
      setInput('month', '');
    }
  }, [year])

  useEffect(() => {
    if (commerce || param_commerce_id) {
      getReports();
      getProject();
      getResponsibles();
      getMonth();
      setInput('commerce_id', commerce?.id ?? param_commerce_id);
      setTimeout(() => onResetForm({ initialForm: formState, formState }), 100);
    }

    if (param_commerce_id && !commerce) {
      dispatch(getCommerceByCommerce({ commerce: { id: param_commerce_id } })).then(({ data: { data: { commerce: commercebycommerce } } }) => {
        dispatch(commerceUpdate({ commerce: commercebycommerce }))
      }, error => setMessageSnackbar({ dispatch, error }));
    }
  }, [commerce])

  const onSubmit = () => {
    getReports();
  }

  return (
    <Grid container
      sx={{
        minHeight: `calc(100vh - ${navBarWidth}px)`,
        backgroundColor: 'secondary.main',
        padding: 2,
        // alignItems: { xs: 'start', md: 'center' }
      }}>

      <Grid item xs={12} md={12} >
        <Grid container>
          <Grid item xs={12} md={12} mb={2}>
            {
              commerce &&
              <PrivateResponsibleRoute>
                <Grid container sx={{}}>
                  <Grid item xs={12} md={12} sx={{ mb: 1, pl: 1, display: 'flex', alignItems: 'center' }}>
                    <Box sx={{ width: '100%' }}>
                      <Collapse in={openAlert}>
                        <Alert
                          severity="warning"
                          action={
                            <IconButton
                              aria-label="close"
                              color="inherit"
                              size="small"
                              onClick={() => {
                                setOpenAlert(false);
                              }}
                            >
                              <CloseIcon fontSize="inherit" />
                            </IconButton>
                          }
                          sx={{ mb: 2 }}
                        >
                          {`${commerce?.name} NIT: ${commerce?.nit} --- ${commerce?.user?.name} ${commerce?.user?.lastname} [${commerce?.user?.email} : ${commerce?.user?.phone}]`}
                        </Alert>
                      </Collapse>
                    </Box>
                  </Grid>
                </Grid>
              </PrivateResponsibleRoute>
            }
            <Grid container sx={{ justifyContent: 'space-between' }}>
              <Grid item xs={12} md={6} sx={{
                mb: 1,
                pl: 1,
                display: 'flex',
                alignItems: 'center'
              }}>
                <Typography className='navbar-text'
                  sx={{
                    fontSize: '1.2rem',
                    // color: `${palette.text.secondary}`,
                  }}>
                  Filtros Búsqueda de Reportes</Typography>
                <Switch
                  checked={flterToggle}
                  onChange={changeFilterToggle}
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'end'
              }}>
                <Grid container sx={{ justifyContent: 'end' }}>
                  <Grid item xs={12} md={3} >
                    <Button
                      fullWidth
                      sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`,
                        // border: '1px solid'
                      }}
                      onClick={onClearForm}
                      variant="text">Limpiar</Button>
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ ml: 1 }}>
                    <Button
                      fullWidth
                      sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`,
                        border: '1px solid'
                      }}
                      onClick={onSubmit}
                      disabled={!isFormValid || !formChange}
                      variant="outlined">Consultar</Button>
                  </Grid>
                  <PrivateResponsibleRoute>
                    <Grid item xs={12} md={4} sx={{ ml: 1 }}>
                      <Button
                        fullWidth
                        sx={{
                          height: '100%',
                          // color: `${palette.text.primary}`
                          color: "text.primary"
                        }}
                        onClick={handleReportStoreOpen}
                        variant="contained">Nuevo Reporte</Button>
                    </Grid>
                  </PrivateResponsibleRoute>
                </Grid>
              </Grid>
            </Grid>
            <form onSubmit={onSubmit}>
              {
                flterToggle &&
                <Grid container>
                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Proyecto</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="project"
                        value={project}
                        label="Proyecto"
                        onChange={e => { onInputChange(e) }}>
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          projectArray &&
                          projectArray.length &&
                          projectArray.map((el, index) => (
                            <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Responsable</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="responsible"
                        value={responsible}
                        label="Responsable"
                        onChange={e => { onInputChange(e) }}>
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          responsibleArray &&
                          responsibleArray.length &&
                          responsibleArray.map((el, index) => (
                            <MenuItem key={index} value={el.name}>{el.name}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Progreso"
                      type="text"
                      placeholder='Progreso'
                      fullWidth
                      name="progress"
                      value={progress}
                      onClick={onInputClick}
                      onChange={onInputProgress}
                      helperText={!!progressToched && progressValid}
                      error={!!progressValid && !!progressToched}
                    />
                  </Grid>

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Año"
                      type="text"
                      placeholder='Año'
                      fullWidth
                      name="year"
                      value={year}
                      onClick={onInputClick}
                      onChange={onInputYear}
                      helperText={!!yearToched && yearValid}
                      error={!!yearValid && !!yearToched}
                    />
                  </Grid>

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Mes</InputLabel>
                      <Select
                        disabled={year ? false : true}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="month"
                        value={month}
                        label="Mes"
                        onChange={e => { onInputChange(e) }}
                      >
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          monthArray &&
                          monthArray.length &&
                          monthArray.map((el, index) => (
                            <MenuItem key={index} value={el.index}>{el.value}</MenuItem>
                          ))
                        }
                      </Select>
                      <FormHelperText>{year ? '' : 'Mes deshabilitado'}</FormHelperText>
                    </FormControl>
                  </Grid>

                </Grid>
              }
            </form>
          </Grid>
          <Grid item xs={12} md={12}>
            <Grid container>
              {reportArray.map((report) => (
                <ReportItemComponent key={report.id} report={report} monthArray={monthArray} getReports={getReports} handleReportUpdate={() => handleReportUpdate(report)}></ReportItemComponent>
              ))}
            </Grid>
          </Grid>
          <Grid container sx={{
            mb: 2,
            justifyContent: 'end',
            display: 'flex',
            // color: `${palette.text.secondary}`,
          }} >
            {
              reportTable?.data &&
              <Pagination
                showFirstButton showLastButton
                size="large"
                sx={{ mr: 5, color: `${palette.text.secondary}`, }}
                count={Math.ceil(reportTable.total / reportTable.per_page)}
                // defaultPage={userTable.current_page}
                page={reportTable.current_page}
                onChange={handlePaginationChange}
                color="secondary"
              />
            }
          </Grid>
        </Grid>
      </Grid>

      {openReportStore && <ReportStoreComponent
        open={openReportStore}
        report={report}
        commerce={commerce}
        getReports={getReports}
        monthArray={monthArray}
        projectArray={projectArray}
        responsibleArray={responsibleArray}
        handleClose={handleReportStoreClose}
      ></ReportStoreComponent>}
    </Grid>
  )
}