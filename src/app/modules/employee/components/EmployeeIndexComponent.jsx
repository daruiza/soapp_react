import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../../../hooks';
import { EmployeeStoreComponent } from './EmployeeStoreComponent';
import { DialogAlertComponent } from '../../../components';
import { Alert, Box, Button, Collapse, FormControl, Grid, IconButton, InputLabel, MenuItem, Pagination, Paper, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@emotion/react';
import dayjs from 'dayjs';
import esES from 'dayjs/locale/es';
import { commerceUpdate, employeeDelete, employeeIndex, getCommerceByCommerce, login, messagePush, reportIndex } from '../../../../store';
import { genericListGetByName } from '../../../../store/genericlist/genericlistThunks';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { PrivateAgentRoute } from '../../../middleware';

const forminit = {
  commerce_id: '',
  name: '',
  lastname: '',
  phone: '',
  email: '',
  adress: '',
  birth_date: dayjs('1969-01-01').format('YYYY-MM-DD'),
  identification: '',
  identification_type: '',
  employee_state: [],
  is_employee: ''
};

export const EmployeeIndexComponent = ({ navBarWidth = 58 }) => {

  const dispatch = useDispatch();
  const { palette } = useTheme();
  const { commerce_id: param_commerce_id } = useParams();
  const { commerce: commerceState } = useSelector(state => state.commerce);
  const commerce = useMemo(() => commerceState, [commerceState]);

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
    employee_state,
    is_employee,
    isFormValid,
    formChange,
    setInput,
    onResetForm,
    onInputClick,
    onInputChange,
    onInputChangeValue
  } = useForm(forminit);

  const [flterToggle, setFilterToggle] = useState(false);
  const [openEmployeeStore, setOpenStoreEmployee] = useState(false);
  const [openEmployeeDelete, setOpenDeleteEmployee] = useState(false);
  const [openAlert, setOpenAlert] = useState(true);
  const [openEmployeeSteteSelect, setOpenEmployeeSteteSelect] = useState(false);

  const [employee, setEmployee] = useState({});
  const [employeeTable, setEmployeeTable] = useState({});
  const [employeeArray, setEmployeeArray] = useState([]);
  const [documenttypeArray, setDocumenttypeArray] = useState([]);
  const [employeestateArray, setEmployeestateArray] = useState([]);
  const [isemployeetypeArray, setIsemployeetypeArray] = useState([]);

  const getEmployees = (attr = {}, form = formState) => {
    const commerce_id = form?.commerce_id ? form.commerce_id : commerce?.id ?? param_commerce_id;
    if (commerce_id) {
      dispatch(employeeIndex({
        form: {
          ...form,
          ...attr,
          is_employee: form.is_employee === '' ? '' : form.is_employee === 'Si' ? 1 : 0,
          employee_state: form.employee_state.toString(),
          commerce_id: commerce_id
        }
      })).then(({ data: { data: { employee } } }) => {
        setEmployeeTable(employee);
        setEmployeeArray(employee.data);
      });
    }
  }

  const getDocumentTypes = () => {
    dispatch(genericListGetByName({ name: 'documenttype' }))
      .then(({ data: { data: { generallist } } }) => {
        setDocumenttypeArray(generallist ?? []);
      });
  }

  const getEmployeeState = () => {
    dispatch(genericListGetByName({ name: 'employee_state' }))
      .then(({ data: { data: { generallist } } }) => {
        setEmployeestateArray(generallist ?? []);
      });
  }

  const getIsEmployeeTypes = () => {
    dispatch(genericListGetByName({ name: 'boolean' }))
      .then(({ data: { data: { generallist } } }) => {
        setIsemployeetypeArray(generallist ?? []);
      });
  }

  const handlePaginationChange = (event, page) => {
    getEmployees({ page: page });
  }

  // COMPORTAMIENTO
  const changeFilterToggle = (event) => {
    setFilterToggle(event.target.checked);
  }

  // EVENTOS
  const onClearForm = () => {
    onResetForm({ initialForm: forminit });
    getEmployees({ page: 1 }, forminit);
  }

  const handleEmployeeStoreOpen = () => {
    setEmployee({});
    setOpenStoreEmployee(true);
  }

  const handleEmployeeStoreClose = () => {
    setEmployee({});
    setOpenStoreEmployee(false);
  }

  const handleEmployeeUpdate = (employee) => {
    setEmployee(employee);
    setOpenStoreEmployee(true);
  }

  const handleEmployeeDeleteOpen = (employee) => {
    setEmployee(employee);
    setOpenDeleteEmployee(true);
  }

  const handleEmployeeDeleteClose = () => {
    setEmployee({});
    setOpenDeleteEmployee(false);
  }

  const handleEmployeeDelete = () => {
    dispatch(employeeDelete({ form: { ...employee } })).then(() => {
      handleEmployeeDeleteClose();
      getEmployees({ page: 1 });
    });
  }

  const handleEmployeeSteteSelectClose = () => { setOpenEmployeeSteteSelect(false) }
  const handleEmployeeSteteSelectOpen = () => { setOpenEmployeeSteteSelect(true) }

  const onSubmit = () => { getEmployees() }

  // Comportamiento almenos un reporte
  // Revisamos si tenemos almenos un reporte
  const handleNewEmployee = () => {
    dispatch(reportIndex({
      form: { commerce_id: commerce?.id ?? null }
    })).then(({ data: { data: { report } } }) => {
      if (report.data.length) {
        handleEmployeeStoreOpen();
      } else {
        dispatch(messagePush({
          message: 'Debes primero solicitar la creación de almenos un Reporte',
          alert: 'warning'
        }));
      }
    });
  }

  useEffect(() => {
    if (commerce || param_commerce_id) {
      getEmployees();
      getDocumentTypes();
      getEmployeeState();
      getIsEmployeeTypes();
      setInput('commerce_id', commerce?.id ?? param_commerce_id);
      setTimeout(() => onResetForm({ initialForm: formState, formState }), 100)
    }

    if (param_commerce_id && !commerce) {
      dispatch(getCommerceByCommerce({ commerce: { id: param_commerce_id } })).then(({ data: { data: { commerce: commercebycommerce } } }) => {
        dispatch(commerceUpdate({ commerce: commercebycommerce }))
      }, error => setMessageSnackbar({ dispatch, error }));
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
            {
              commerce &&
              <PrivateAgentRoute>
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
              </PrivateAgentRoute>
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
                  Filtros Búsqueda de Colaborador</Typography>
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
                      onClick={handleNewEmployee}
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

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
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

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
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

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Tipo Identificación</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="identification_type"
                        value={identification_type}
                        label="Tipo Identificación"
                        onChange={e => { onInputChange(e) }}
                      >
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          documenttypeArray &&
                          documenttypeArray.length &&
                          documenttypeArray.map((el, index) => (
                            <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <LocalizationProvider adapterLocale={esES} dateAdapter={AdapterDayjs}>
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


                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Estado</InputLabel>
                      <Select
                        open={openEmployeeSteteSelect}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="employee_state"
                        value={employee_state}
                        label="Estado de Colaborador"
                        onChange={e => { onInputChange(e); handleEmployeeSteteSelectClose(e) }}
                        onClose={handleEmployeeSteteSelectClose}
                        onOpen={handleEmployeeSteteSelectOpen}
                        multiple
                      >
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          employeestateArray &&
                          employeestateArray.length &&
                          employeestateArray.map((el, index) => (
                            <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Es Empleado</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="is_employee"
                        value={is_employee}
                        label="Es Empleado"
                        onChange={e => { onInputChange(e) }}
                      >
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          isemployeetypeArray &&
                          isemployeetypeArray.length &&
                          isemployeetypeArray.map((el, index) => (
                            <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                          ))
                        }
                      </Select>
                    </FormControl>
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
                    <TableCell align="right">Es Empleado</TableCell>
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
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{employee.is_employee ? 'Si' : 'No'}</TableCell>
                      <TableCell align="center">
                        <Grid sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Editar">
                            <IconButton
                              sx={{ ml: 0.5 }}
                              onClick={() => handleEmployeeUpdate(employee)}
                            >
                              <EditIcon sx={{
                                // color: `${palette.text.secondary}`,
                                "&:hover": {
                                  // color: `${palette.text.primary}`,
                                  cursor: "pointer"
                                }
                              }}></EditIcon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Eliminar">
                            <IconButton
                              sx={{ ml: 0.5, }}
                              onClick={() => handleEmployeeDeleteOpen(employee)}>
                              <DeleteIcon sx={{
                                // color: `${palette.text.secondary}`,
                                "&:hover": {
                                  // color: `${palette.text.primary}`,
                                  cursor: "pointer"
                                }
                              }}></DeleteIcon>
                            </IconButton>
                          </Tooltip>
                        </Grid>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Grid container sx={{
                mb: 2,
                justifyContent: 'end',
                display: 'flex',
                // color: `${palette.text.secondary}`,
              }} >
                {
                  employeeTable?.data &&
                  <Pagination
                    showFirstButton showLastButton
                    size="large"
                    sx={{ mr: 5, color: `${palette.text.secondary}`, }}
                    count={Math.ceil(employeeTable.total / employeeTable.per_page)}
                    // defaultPage={userTable.current_page}
                    page={employeeTable.current_page}
                    onChange={handlePaginationChange}
                    color="secondary"
                  />
                }
              </Grid>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      {openEmployeeStore && <EmployeeStoreComponent
        open={openEmployeeStore}
        employee={employee}
        commerce={commerce}
        getEmployees={getEmployees}
        identificationtypeArray={documenttypeArray}
        handleClose={handleEmployeeStoreClose}
      ></EmployeeStoreComponent>}
      {openEmployeeDelete && <DialogAlertComponent
        open={openEmployeeDelete}
        handleClose={handleEmployeeDeleteClose}
        handleAgree={handleEmployeeDelete}
        props={{
          tittle: 'Eliminar Colaborador',
          message: `Estas segur@ de eliminar el colaborador ${employee?.name ?? ''}`
        }}
      ></DialogAlertComponent>}
    </Grid>
  )
}
