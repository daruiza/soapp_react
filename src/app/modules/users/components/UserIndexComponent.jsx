import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../../../hooks';
import { useTheme } from '@emotion/react';
import { userDelete, userIndex } from '../../../../api/user/userThunks';
import { commerceUpdate, getAllRols, getCommerceByUser } from '../../../../store';
import { Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton, Switch, TableFooter, TablePagination, Pagination } from '@mui/material';
import { DialogAlertComponent } from '../../../components';
import { UserStoreComponent } from './UserStoreComponent';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Work } from '@mui/icons-material';
import { RolTypes } from '../../../types';
import { CommerceComponent } from '../../commerce';

const forminit = { name: '', lastname: '', phone: '', email: '', rol_id: '' };
export const UserIndexComponent = ({ navBarWidth = 58 }) => {
  const { palette } = useTheme();
  const { commerce: commerceState } = useSelector(state => state.commerce);
  const dispatch = useDispatch();
  const {
    formState,
    name,
    lastname,
    phone,
    email,
    rol_id,
    isFormValid,
    formChange,
    onResetForm,
    onInputClick,
    onInputChange
  } = useForm(forminit);

  const [flterToggle, setFilterToggle] = useState(false);
  const [openUserStore, setOpenStoreUser] = useState(false);
  const [openUserDelete, setOpenDeleteUser] = useState(false);
  const [openCommerce, setOpenCommerce] = useState(false);

  const [user, setUser] = useState({});
  const [userTable, setUserTable] = useState({});
  const [rolArray, setRolArray] = useState([]);
  const [userArray, setUSerArray] = useState([]);

  const getUsers = (attr = {}, form = formState) => {
    dispatch(userIndex({ form: { ...form, ...attr } })).then(({ data: { users } }) => {
      setUserTable(users);
      setUSerArray(users.data);
    });
  }

  const getRols = () => {
    dispatch(getAllRols()).then(({ data: { data } }) => {
      setRolArray(data ?? []);
    });
  }

  // EVENTOS
  const onClearForm = () => {
    onResetForm({ initialForm: forminit });
    getUsers({ page: 1 }, forminit);
  }

  const handleUserStoreOpen = () => {
    setUser({});
    setOpenStoreUser(true);
  }

  const handleUserStoreClose = () => {
    setUser({});
    setOpenStoreUser(false);
  }

  const handleUserUpdate = (user) => {
    setUser(user);
    setOpenStoreUser(true);
  }

  const handleCommeceOpen = (user) => {
    setUser(user);
    dispatch(getCommerceByUser({ User: user })).then(({ data: { data: { commerce: commercebyuser } } }) => {
      dispatch(commerceUpdate({ commerce: commercebyuser }))
      setOpenCommerce(true);
    });
  }

  const handleCommeceClose = () => {
    setUser({});
    setOpenCommerce(false)
  }

  const handleUserDeleteClose = () => {
    setUser({});
    setOpenDeleteUser(false);
  }

  const handleUserDeleteOpen = (user) => {
    setUser(user);
    setOpenDeleteUser(true);
  }

  const handleUserDelete = () => {
    dispatch(userDelete({ form: { ...user } })).then(() => {
      handleUserDeleteClose();
      getUsers({ page: 1 });
    });
  }

  const handlePaginationChange = (event, page) => {
    getUsers({ page: page });
  }

  // COMPORTAMIENTO
  const changeFilterToggle = (event) => {
    setFilterToggle(event.target.checked);
  }

  const onSubmit = () => {
    getUsers();
  }

  useEffect(() => {
    getUsers();
    getRols();
  }, []);

  return (
    <Grid container
      // spacing={0}
      // justifyContent="center"
      sx={{
        minHeight: `calc(100vh - ${navBarWidth}px)`,
        backgroundColor: 'secondary.main',
        padding: 2,
        // alignItems: { xs: 'start', md: 'center' }
      }}
    >
      <Grid item xs={12} md={12} >
        <Grid container >

          <Grid item xs={12} md={12} mb={2}
            sx={{
              // border: '1px solid',
              // borderRadius: '5px 0 5px 0',
              // padding: '10px'
            }} >
            <Grid container sx={{ justifyContent: 'space-between' }}>

              <Grid item xs={12} md={6} sx={{
                mb: 1,
                pl: 1,
                display: 'flex',
                alignItems: 'center',

              }}>
                <Typography className='navbar-text'
                  sx={{
                    fontSize: '1.2rem',
                    color: `${palette.text.secondary}`,
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
              }} >
                <Grid item xs={12} md={3} >
                  <Button
                    fullWidth
                    sx={{
                      height: '100%',
                      color: `${palette.text.primary}`,
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
                      color: `${palette.text.primary}`,
                      border: '1px solid'
                    }}
                    onClick={onSubmit}
                    disabled={!isFormValid || !formChange}
                    variant="outlined">Consultar</Button>
                </Grid>

                <Grid item xs={12} md={3} sx={{ ml: 1 }}>
                  <Button
                    fullWidth
                    sx={{
                      height: '100%',
                      color: `${palette.text.primary}`
                    }}
                    onClick={handleUserStoreOpen}
                    variant="contained">Nuevo Usuario</Button>
                </Grid>

              </Grid>

            </Grid>
            <form onSubmit={onSubmit}>
              {
                flterToggle &&
                <Grid container>
                  <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
                      sx={{ color: `${palette.text.secondary}` }}
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
                      label="Apellido"
                      type="text"
                      placeholder='Apellido(s)'
                      fullWidth
                      name="lastname"
                      value={lastname}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                    <TextField
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
                      label="Correo"
                      type="text"
                      placeholder='Correo'
                      fullWidth
                      name="email"
                      value={email}
                      onClick={onInputClick}
                      onChange={onInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }}>
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name="rol_id"
                        value={rol_id}
                        label="Rol"
                        onChange={e => { onInputChange(e) }}
                      >
                        <MenuItem value=''><em></em></MenuItem>
                        {
                          rolArray &&
                          rolArray.length &&
                          rolArray.map((el, index) => (
                            <MenuItem key={index} value={el.id}>{el.name}</MenuItem>
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
                  <TableRow sx={{ background: `${palette.primary.main}` }}>
                    <TableCell >Nombres</TableCell>
                    <TableCell align="right">Apellidos</TableCell>
                    <TableCell align="right">Correo</TableCell>
                    <TableCell align="right">Teléfono</TableCell>
                    <TableCell align="right">Rol</TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {userArray.map((user) => (
                    <TableRow
                      key={user.id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 }
                      }}
                    >
                      <TableCell sx={{ color: `${palette.text.secondary}` }} component="th" scope="row">{user.name}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{user.lastname}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{user.email}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{user.phone}</TableCell>
                      <TableCell sx={{ color: `${palette.text.secondary}` }} align="right">{user.rol.name}</TableCell>
                      <TableCell align="center">
                        <Grid sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Editar">
                            <IconButton
                              sx={{ ml: 0.5 }}
                              onClick={() => handleUserUpdate(user)}
                            >
                              <EditIcon sx={{
                                color: `${palette.text.secondary}`,
                                "&:hover": {
                                  // color: `${palette.text.primary}`,
                                  cursor: "pointer"
                                }
                              }}></EditIcon>
                            </IconButton>
                          </Tooltip>
                          {
                            user?.rol?.id === RolTypes.customer &&
                            <Tooltip title="Negocio">
                              <IconButton
                                sx={{ ml: 0.5 }}
                                onClick={() => handleCommeceOpen(user)}
                              >
                                <Work sx={{
                                  color: `${palette.text.secondary}`,
                                  "&:hover": {
                                    // color: `${palette.text.primary}`,
                                    cursor: "pointer"
                                  }
                                }}></Work>
                              </IconButton>
                            </Tooltip>
                          }
                          <Tooltip title="Eliminar">
                            <IconButton
                              sx={{ ml: 0.5, }}
                              onClick={() => handleUserDeleteOpen(user)}>
                              <DeleteIcon sx={{
                                color: `${palette.text.secondary}`,
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
                <TableFooter>
                </TableFooter>
              </Table>
              <Grid container sx={{
                mb: 2,
                justifyContent: 'end',
                display: 'flex',
                color: `${palette.text.secondary}`,
              }} >
                {
                  userTable?.data &&
                  <Pagination
                    showFirstButton showLastButton
                    size="large"
                    sx={{ mr: 5, color: `${palette.text.secondary}`, }}
                    count={Math.ceil(userTable.total / userTable.per_page)}
                    // defaultPage={userTable.current_page}
                    page={userTable.current_page}
                    onChange={handlePaginationChange}
                    color="secondary"
                  />
                }
              </Grid>
            </TableContainer>
          </Grid>
        </Grid>
      </Grid>
      {openUserStore && <UserStoreComponent
        open={openUserStore}
        handleClose={handleUserStoreClose}
        user={user}
        rolArray={rolArray}
        getUsers={getUsers}
      ></UserStoreComponent>
      }
      {openUserDelete && <DialogAlertComponent
        open={openUserDelete}
        handleClose={handleUserDeleteClose}
        handleAgree={handleUserDelete}
        props={{
          tittle: 'Eliminar Usuario',
          message: `Estas segur@ de eliminar el usuario ${user?.name ?? ''}`
        }}
      ></DialogAlertComponent>}
      {
        openCommerce && <CommerceComponent
          open={openCommerce}
          handleClose={handleCommeceClose}
          user={user}
          commerce={commerceState}>
        </CommerceComponent>
      }
    </Grid>
  )
}
