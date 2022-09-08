import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Google } from '@mui/icons-material';
import { useContext } from 'react';
import { AuthTypes } from '../../../types';
import { AuthContext } from '../context/AuthContext'

export const LoginComponent = () => {

    const { user, authDispatch } = useContext(AuthContext);

    console.log('LoginComponent', user);
    const onLogin = () => {
        const user = {
            id: '123',
            name: 'John',
            rol: 3
        }
        const action = {
            type: AuthTypes.login,
            payload: user
        }
        localStorage.setItem('user', JSON.stringify(user));
        authDispatch(action);
    }


    return (
        <Grid container spacing={0} alignItems="center" justifyContent="center"
            sx={{ minHeight: '100vh', backgroundColor: 'primary.main', padding: 2 }}>
            <Grid item xs={1} md={3}></Grid>
            <Grid item xs={10} md={6} className='box-shadow'
                sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2 }}>
                <Typography variant='h5' sx={{ mb: 1 }}>Login</Typography>
                <form>
                    <Grid container>
                        <Grid item xs={12} md={12} sx={{ mb: 1 }} >
                            <TextField
                                label="Correo"
                                type="email"
                                placeholder='correo@example.com'
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                placeholder='Contraseña'
                                fullWidth
                            />
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }} >
                            <Grid item xs={12} sm={6}>
                                <Button variant="contained" fullWidth>
                                    Login
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button variant="contained" fullWidth>
                                    <Google />
                                    <Typography sx={{ ml: 1 }}>Google</Typography>
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container direction="row" justifyContent="end">
                            <Link component={RouterLink} color='inherit' to='/acces/singin'>
                                Crear Una cuenta
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Grid >
            <Grid item xs={1} md={3}></Grid>
        </Grid >
    )
}