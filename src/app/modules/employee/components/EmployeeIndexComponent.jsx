import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Grid, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import { useForm } from '../../../../hooks';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import es from 'date-fns/locale/es'
import { employeeIndex } from '../../../../store';
import { useTheme } from '@emotion/react';

const forminit = {
  commerce_id: '',
  name: '',
  lastname: '',
  phone: '',
  email: '',
  adress: '',
  birth_date: dayjs().format('YYYY-MM-DD'),
  identification: '',
  identification_type: '',

};
export const EmployeeIndexComponent = ({ navBarWidth = 58 }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { commerce: commerceState } = useSelector(state => state.commerce);
  const commerce = useMemo(() => commerceState, [commerceState]);
  const [employeeTable, setEmployeeTable] = useState({});
  const [employeeArray, setEmployeeArray] = useState([]);

  const getEmployees = (attr = {}, form = formState) => {
    const commerce_id = form.commerce_id ? form.commerce_id : commerce.id
    if (commerce_id) {
      dispatch(employeeIndex({ form: { ...form, ...attr, commerce_id: commerce_id } })).then(({ data: { data: { employee } } }) => {
        console.log('data', employee);
        setEmployeeTable(employee);
        setEmployeeArray(employee.data);
      });
    }
  }

  const {
    formState,
    name,
    lastname,
    phone,
    email,
    adress,
    birth_date,
    identification,
    identification_type,
    isFormValid,
    formChange,
    setInput,
    onResetForm,
    onInputClick,
    onInputChange,
    onInputChangeValue
  } = useForm(forminit);

  const [flterToggle, setFilterToggle] = useState(false);


  // COMPORTAMIENTO
  const changeFilterToggle = (event) => {
    setFilterToggle(event.target.checked);
  }

  // EVENTOS
  const onClearForm = () => {
    // onResetForm({ initialForm: forminit });
    // getEmployees({ page: 1 }, forminit);
  }

  const handleUserStoreOpen = () => { }

  const onSubmit = () => { }

  useEffect(() => {
    if (commerce) {
      setInput('commerce_id', commerce.id)
      getEmployees();
    }
  }, [commerce]);

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
                  Filtros Busqueda de Usuario</Typography>
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
                  <Grid item xs={12} md={4} sx={{ ml: 1 }}>
                    <Button
                      fullWidth
                      sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`
                      }}
                      onClick={handleUserStoreOpen}
                      variant="contained">Nuevo Colaborador</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <form onSubmit={onSubmit}>
              {
                flterToggle &&
                <Grid container>
                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Nombre"
                      type="text"
                      placeholder='Nombre(s)'
                      fullWidth
                      name="name"
                      value={name}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Apellido"
                      type="text"
                      placeholder='Apellidos(s)'
                      fullWidth
                      name="lastname"
                      value={lastname}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Teléfono"
                      type="text"
                      placeholder='Teléfono o Móvil'
                      fullWidth
                      name="phone"
                      value={phone}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Correo"
                      type="text"
                      placeholder='Correo electrónico'
                      fullWidth
                      name="email"
                      value={email}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Dirección"
                      type="text"
                      placeholder='Dirección de recidencia'
                      fullWidth
                      name="adress"
                      value={adress}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Identificación"
                      type="text"
                      placeholder='Identificación'
                      fullWidth
                      name="identification"
                      value={identification}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{}}
                      label="Tipo Identificación"
                      type="text"
                      placeholder='Tipo Identificación'
                      fullWidth
                      name="identification_type"
                      value={identification_type}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>

                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                      <DatePicker
                        className='birth-date-piker'
                        sx={{ width: '100%' }}
                        inputFormat="DD/MM/YYYY"
                        label="Fecha nacimiento"
                        name="birth_date"
                        value={birth_date}
                        onChange={(value) => onInputChangeValue({ name: 'birth_date', value, date: true })}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                  </Grid>

                </Grid>
              }
            </form>
          </Grid>
          <Grid item xs={12} md={12} sx={{}}>
            <TableContainer component={Paper}>
              <Table size={'small'} sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow sx={{
                    // background: `${palette.primary.main}`
                  }}>
                    <TableCell >Nombres</TableCell>
                    <TableCell align="right">Apellidos</TableCell>
                    <TableCell align="right">Correo</TableCell>
                    <TableCell align="right">Teléfono</TableCell>
                    <TableCell align="right">Dirección</TableCell>
                    <TableCell align="right">Identificación</TableCell>
                    <TableCell align="right">Estado</TableCell>
                    <TableCell align="right">Activo</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {employeeArray.map((employee) => (
                    <TableRow
                      key={employee.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} component="th" scope="row">{employee.name}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.lastname}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.email}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.phone}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.adress}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.identification}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.employee_state}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.active}</TableCell>
                      

                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}
