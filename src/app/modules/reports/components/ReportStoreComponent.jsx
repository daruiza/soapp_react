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
import { userIndex } from '../../../../store';
import { RolTypes } from '../../../types';
import dayjs from 'dayjs';

const formData = {
  commerce_id: '',
  project: '',
  focus: '',
  description: '',
  responsible: '',
  email_responsible: '',
  phone_responsible: '',
  year: '',
  month: '',
};
const formValidations = {
  project: [(value) => value, 'El Proyecto es obligatorio.'],
  responsible: [(value) => value, 'El Responsible es obligatorio.'],
  year: [(value) => (RegExp('^[0-9]+$').test(value) && value < 9999) || !value, 'El año es un número de 0 a 9999.'],
  month: [(value) => value, 'El Mes es obligatorio.'],
  // month: [(value) => value.length >= 1, 'El Mes es obligatorio.'],
};

const setInputsForm = (report) => {
  for (const formField of Object.keys(formData)) {
    formData[formField] =
      report ?
        report[formField] === !null && report[formField] === !undefined ?
          report[formField] :
          '' :
        '';
  }
  return formData;
};

export const ReportStoreComponent = ({ report = {}, open = false, commerce = {}, monthArray = [], getReports = () => { }, handleClose = () => { } }) => {

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
    setInputs,
    onResetForm
  } = useForm(setInputsForm(report), formValidations);

  const [projectArray, setProjectArray] = useState([])
  const [responsibleArray, setResponsibleArray] = useState([])

  const [focusToggle, setFocusToggle] = useState(report?.focus ?? false);


  const getUsers = (attr = {}, form = formState) => {
    dispatch(userIndex({ form: { ...form, ...attr, rol_id: RolTypes.responsible } }))
      .then(({ data: { data: { users: { data } } } }) => {
        setResponsibleArray(data);
      });
  }

  const getProject = () => {
    dispatch(genericListGetByName({ name: 'project' }))
      .then(({ data: { data: { generallist } } }) => {
        setProjectArray(generallist ?? []);
      });
  }

  const getMonth = () => {
    dispatch(genericListGetByName({ name: 'month' }))
      .then(({ data: { data: { generallist } } }) => {
        setMontArray(generallist ?? []);
      });
  }

  // EVENTOS
  const toggleFocus = (focus) => {
    setFocusToggle((focus) => !focus)
    setInput('focus', !focus);
  };

  const responsibleSelect = (responsibleselect) => {
    if (responsibleselect) {
      const selectresponsible = responsibleArray.find(el => el.id = responsible);
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
    console.log('value', value)
    if (RegExp('^[0-9]+$').test(value) || !value) {
      setInput('year', value);
    }
    event.preventDefault();
  }

  useEffect(() => {
    if (!year) {
      setInput('month', '');
    }
  }, [year])


  // Observable sobre responsible
  useEffect(() => {
    responsibleSelect(responsible)
  }, [responsible])

  useEffect(() => {
  }, [report])

  useEffect(() => {
    if (commerce) {
      getProject();
      getUsers();
      setInputs([
        { 'commerce_id': commerce?.id ?? '' },
        { 'year': dayjs().format('YYYY') ?? '' }
      ]);
      setTimeout(() => onResetForm({ initialForm: formState, formState }), 100)
    }
  }, [commerce])

  const handleSubmit = () => {
    console.info('formState', formState)
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
            <Grid item md={6} sx={{ display: 'flex' }}>
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
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
              <Box> Mes
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
