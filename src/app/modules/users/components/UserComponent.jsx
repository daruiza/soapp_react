import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { userIndex } from '../../../../api/user/userThunks';
import { useForm } from '../../../../hooks';
import { getAllRols } from '../../../../store';
import { Grid, TextField, Typography, FormControl, InputLabel, Select, MenuItem, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Tooltip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const forminit = { name: '', lastname: '', phone: '', email: '', rol_id: '' };
export const UserComponent = ({ navBarWidth = 58 }) => {

  const { palette } = useTheme();
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
    setInput,
    onInputClick,
    onInputChange
  } = useForm(forminit);
  const [rolArray, setRolArray] = useState([]);
  const [userArray, setUSerArray] = useState([]);

  const getUsers = () => {
    dispatch(userIndex({ form: formState })).then(({ data: { users } }) => {
      console.log('users', users);
      setUSerArray(users.data);
    });
  }

  const getRols = () => {
    dispatch(getAllRols()).then(({ data: { data } }) => {
      setRolArray(data ?? []);
    });
  }

  const onSubmit = () => {
    getUsers();
  }

  useEffect(() => {
    getUsers();
    getRols();
  }, [])

  useEffect(() => {
    // if (rol_id === '' && JSON.stringify(formState) === JSON.stringify(forminit)
    // ) {
    //   console.log('getUsers');
    //   getUsers();
    // }
  }, [rol_id])

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

              <Grid sx={{ mb: 1, pl: 1 }} >
                <Typography className='navbar-text'
                  sx={{
                    fontSize: '1.2rem',
                    // color: `${palette.primary.main}`
                  }}>
                  Filtros de Usuario</Typography>
              </Grid>

              <Grid sx={{ mb: 1, pr: 0.5 }} >
                <Typography className='navbar-text'
                  sx={{
                    fontSize: '1.2rem',
                    // color: `${palette.primary.main}`
                  }}>
                  Filtros de Usuario</Typography>
              </Grid>

            </Grid>
            <form onSubmit={onSubmit}>
              <Grid container>
                <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                  <TextField
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
                <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
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
                <Grid item xs={12} md={2} sx={{ mb: 1, pl: 0.5 }}>
                  <Button
                    fullWidth
                    sx={{
                      height: '100%',
                      color: `${palette.text.primary}`
                    }}
                    onClick={onSubmit}
                    disabled={!isFormValid || !formChange}
                    variant="contained"
                    autoFocus>Consultar</Button>
                </Grid>
              </Grid>
            </form>
          </Grid>

          <Grid item xs={12} md={12} sx={{}}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
                  {userArray.map((row) => (
                    <TableRow
                      key={row.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      <TableCell component="th" scope="row">{row.name}</TableCell>
                      <TableCell align="right">{row.lastname}</TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.phone}</TableCell>
                      <TableCell align="right">{row.rol.name}</TableCell>
                      <TableCell align="center">
                        <Grid sx={{ display: 'flex', flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'center' }}>
                          <Tooltip title="Editar">
                            <IconButton sx={{ ml: 0.5 }}>
                              <EditIcon sx={{
                                "&:hover": {
                                  color: `${palette.text.secondary}`,
                                  cursor: "pointer"
                                }
                              }}></EditIcon>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Editar">
                            <IconButton sx={{ ml: 0.5, ml: 0.5, }}>
                              <DeleteIcon sx={{
                                "&:hover": {
                                  color: `${palette.text.secondary}`,
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
            </TableContainer>

          </Grid>

        </Grid>
      </Grid>
    </Grid >
  )
}
