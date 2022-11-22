import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../../../hooks';
import { genericListGetByName } from '../../../../store/genericlist/genericlistThunks';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

import { yellow } from '@mui/material/colors';
import { reportStore, reportUpdate, userIndex } from '../../../../store';
import { RolTypes } from '../../../types';
import dayjs from 'dayjs';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

const formData = {
  id: '',
  commerce_id: '',
  project: '',
  focus: 0,
  description: '',
  responsible: '',
  email_responsible: '',
  phone_responsible: '',
  year: dayjs().format('YYYY') ?? '',
  month: '',
};
const formValidations = {
  project: [(value) => value, 'El Proyecto es obligatorio.'],
  responsible: [(value) => value, 'El Responsible es obligatorio.'],
  year: [(value) => (RegExp('^[0-9]+$').test(value) && value < 9999) || !value, 'El año es un número de 0 a 9999.'],
  month: [(value) => value, 'El Mes es obligatorio.'],
};

const setInputsForm = (report) => {
  for (const formField of Object.keys(formData)) {
    formData[formField] = report[formField] ?? formData[formField];
  }
  return formData;
};

export const ReportStoreComponent = ({
  report = {},
  open = false,
  commerce = {},
  monthArray = [],
  projectArray = [],
  responsibleArray = [],
  getReports = () => { },
  handleClose = () => { } }) => {

  const dispatch = useDispatch();

  const {
    formState,
    commerce_id,
    project,
    projectValid,
    projectToched,
    responsible,
    responsibleValid,
    responsibleToched,
    email_responsible,
    email_responsibleValid,
    email_responsibleToched,
    phone_responsible,
    phone_responsibleValid,
    phone_responsibleToched,
    description,
    descriptionValid,
    descriptionToched,
    year,
    yearValid,
    yearToched,
    month,
    monthValid,
    monthToched,
    focus,
    isFormValid,
    formChange,
    onInputChange,
    onInputClick,
    setInput,
    setInputPromise,
    setInputs,
    onResetForm
  } = useForm(setInputsForm({
    ...report,
    responsible: report?.responsible ? responsibleArray.find(el => el.name === report.responsible).id : '',
    year: report?.date ? dayjs(report.date).format('YYYY') : '',
    month: report?.date ? monthArray.find(el => el.index === +dayjs(report.date).format('M'))?.index : ''
  }), formValidations);

  const [focusToggle, setFocusToggle] = useState(report?.focus === 1 ? true : false);

  // EVENTOS
  const toggleFocus = () => {
    setFocusToggle((focus) => !focus);
  };

  const responsibleSelect = () => {
    if (responsible) {
      const selectresponsible = responsibleArray.find(el => el.id === responsible);
      setInputs([
        { 'email_responsible': selectresponsible?.email ?? '' },
        { 'phone_responsible': selectresponsible?.phone ?? '' }
      ]);
    } else {
      // se limpia el email y el phone      
      setInputs([
        { 'email_responsible': '' },
        { 'phone_responsible': '' }
      ]);
    }
  }

  // COMPORTAMIENTO
  const onInputYear = (event) => {
    const { target: { value } } = event;
    if (RegExp('^[0-9]+$').test(value) || !value) {
      setInput('year', value);
    }
    event.preventDefault();
  }

  useEffect(() => {
    setInput('focus', focusToggle === true ? 1 : 0);
  }, [focusToggle])

  useEffect(() => {
    if (!year) {
      setInput('month', '');
    }
  }, [year])


  // Observable sobre responsible
  useEffect(() => {
    responsibleSelect()
  }, [responsible])

  useEffect(() => {

  }, [report])

  useEffect(() => {
    onResetForm({ initialForm: formState, formState })
  }, [commerce_id, year])

  useEffect(() => {
    if (commerce) {

      setInputs([
        { 'commerce_id': commerce?.id ?? '' },
        { 'year': dayjs().format('YYYY') ?? '' }
      ]);
      // setInput('commerce_id', commerce?.id ?? '');
      // setInput('year', dayjs().format('YYYY') ?? '');
    }
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isFormValid) {
      if (!formState.id) {
        // Nuevo report
        dispatch(reportStore({
          form: {
            ...formState,
            responsible: responsibleArray.find(el => el.id === formState.responsible).name,
            date: dayjs(`${year}-${month}`).format('YYYY-MM-DD')
          }
        })).then((response) => {
          getReports();// Refrescamos la tabla
          handleClose();
        }, error => setMessageSnackbar({ dispatch, error }))
      } else {
        // Actualizar report
        dispatch(reportUpdate({
          form: {
            ...formState,
            responsible: responsibleArray.find(el => el.id === formState.responsible).name,
            date: dayjs(`${year}-${month}`).format('YYYY-MM-DD')
          }
        })).then((response) => {
          getReports();// Refrescamos la tabla
          handleClose();
        }, error => setMessageSnackbar({ dispatch, error }))
      }
    }


  }

  return (
    <div>
      <Dialog
        open={open}
        fullWidth={true}
        maxWidth='md'
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Grid container justifyContent="space-between">
            <Grid item md={6} sx={{ display: 'flex', alignItems: 'center' }}>
              <Box mr={1} sx={{ position: 'relative', display: 'inline-flex' }}>
                <CircularProgress variant="determinate" value={report?.progress ?? 1} />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="caption" component="div" color="text.secondary">
                    {`${report?.progress ?? 0}%`}
                  </Typography>
                </Box>
              </Box>
              <Box> {month && monthArray.find(el => el.index === month).value}
              </Box>
            </Grid>
            <Grid item >
              <Box>
                <IconButton className="sizeLarge" aria-label="share" size="large" onClick={toggleFocus} >
                  {focusToggle && <StarIcon className="sizeLarge" size="large" sx={{ color: `${yellow[700]}`, size: 'large' }} />}
                  {!focusToggle && <StarBorderIcon />}
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </DialogTitle>
        <DialogContent>
          <Grid container alignItems="center">
            <Grid item>
              <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
                Información
                {report.id && `a Editar/Actualizar de `}
                {!report.id && `de nuevo `}
                Reporte
              </DialogContentText>
            </Grid>
          </Grid>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={0} justifyContent="center" sx={{ mb: 2 }}>
              <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
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

              <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
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
                        <MenuItem key={index} value={el.id}>{el.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                <TextField
                  label="Correo de Responsable"
                  type="text"
                  placeholder='Correo de Responsable'
                  fullWidth
                  name="email_responsible"
                  value={email_responsible}
                  onChange={onInputChange}
                  onClick={onInputClick}
                  helperText={email_responsibleValid}
                  error={!!email_responsibleValid && email_responsibleToched}
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                <TextField
                  label="Teléfono de Responsable"
                  type="text"
                  placeholder='Teléfono de Responsable'
                  fullWidth
                  name="phone_responsible"
                  value={phone_responsible}
                  onChange={onInputChange}
                  onClick={onInputClick}
                  helperText={phone_responsibleValid}
                  error={!!phone_responsibleValid && phone_responsibleToched}
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                <TextField
                  label="Año"
                  type="text"
                  placeholder='Año'
                  fullWidth
                  name="year"
                  value={year}
                  onChange={e => { onInputYear(e) }}
                  onClick={e => { onInputClick(e) }}
                  helperText={yearValid}
                  error={!!yearValid && yearToched}
                />
              </Grid>

              <Grid item xs={12} md={6} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
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

              <Grid item xs={12} md={12} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                <TextField
                  label="Descripción"
                  type="text"
                  placeholder='Descripción'
                  fullWidth
                  name="description"
                  value={description}
                  onChange={onInputChange}
                  onClick={onInputClick}
                  helperText={descriptionValid}
                  error={!!descriptionValid && descriptionToched}
                />
              </Grid>
            </Grid>
          </form>

        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} variant="outlined"
            sx={{
              height: '100%',
              // color: `${palette.text.primary}`, 
              border: '1px solid'
            }} >Cerrar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || !formChange}
            variant="outlined"
            sx={{
              height: '100%',
              // color: `${palette.text.primary}`
            }}>
            {report?.id && `Actualizar`}
            {!report?.id && `Guardar`}
          </Button>

        </DialogActions>
      </Dialog>

    </div>
  )
}
