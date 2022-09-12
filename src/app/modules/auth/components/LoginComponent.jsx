import { useDispatch } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Button, Grid, Link, TextField, Typography } from '@mui/material';
import { useForm } from '../../../../hooks';
import { checkingAuthentication } from '../../../../store';


export const LoginComponent = ({ navBarWidth = 56 }) => {

    const dispatch = useDispatch();

    const { email, password, onInputChange } = useForm({
        email: 'email@example.com',
        password: 'password',
    });

    const onSubmit = (event) => {
        event.preventDefault();
        dispatch(checkingAuthentication(email, password));
    }

    return (
        <Grid container spacing={0} justifyContent="center"
            sx={{
                minHeight: `calc(100vh - ${navBarWidth}px)`,
                backgroundColor: 'secondary.main',
                padding: 2,
                alignItems: { xs: 'start', md: 'center' }
            }}>
            <Grid item xs={10} md={4} className='box-shadow'
                sx={{ backgroundColor: 'white', padding: 2, borderRadius: 2 }}>
                <Typography variant='h5' sx={{ mb: 1 }}>Login</Typography>
                <form onSubmit={onSubmit}>
                    <Grid container>
                        <Grid item xs={12} md={12} sx={{ mb: 1 }} >
                            <TextField
                                label="Correo"
                                type="email"
                                placeholder='correo@example.com'
                                fullWidth
                                name="email"
                                value={email}
                                onChange={onInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} md={12} sx={{ mb: 1 }}>
                            <TextField
                                label="Contraseña"
                                type="password"
                                placeholder='Contraseña'
                                fullWidth
                                name="password"
                                value={password}
                                onChange={onInputChange}
                            />
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }} >
                            <Grid item xs={12} sm={6}></Grid>
                            <Grid item xs={12} sm={6}>
                                <Button type="submit" variant="contained" fullWidth>
                                    Login
                                </Button>
                            </Grid>
                        </Grid>                        
                    </Grid>
                </form>
            </Grid >
        </Grid >
    )
}