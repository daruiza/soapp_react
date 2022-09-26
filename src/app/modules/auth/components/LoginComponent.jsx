import { useDispatch } from 'react-redux';
import { Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from '../../../../hooks';
import { checkingAuthentication } from '../../../../store';

const formData = { email: '', password: '' }

const formValidations = {
    email: [(value) => value.includes('@'), 'El correo debe tener una @.'],
    password: [(value) => value.length >= 1, 'La Contraseña es obligatoria.']
}

export const LoginComponent = ({ navBarWidth = 58 }) => {

    const dispatch = useDispatch();

    const {
        onInputChange,
        onInputClick,
        email,
        password,
        emailToched,
        passwordToched,
        emailValid,
        passwordValid,
        isFormValid,
    } = useForm(formData, formValidations);

    const onSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            dispatch(checkingAuthentication(email, password));
        }
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
                <Typography variant='h5' sx={{ mb: 1 }}>Inicio de Sesión</Typography>
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
                                onClick={onInputClick}
                                onChange={onInputChange}
                                helperText={emailValid}
                                error={!!emailValid && emailToched}
                                inputProps={{ className: `` }}
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
                                onClick={onInputClick}
                                onChange={onInputChange}
                                helperText={passwordValid}
                                error={!!passwordValid && passwordToched}
                            />
                        </Grid>
                        <Grid container spacing={2} sx={{ mb: 2, mt: 1 }} >
                            <Grid item xs={12} sm={6}></Grid>
                            <Grid item xs={12} sm={6}>
                                <Button disabled={!isFormValid} type="submit" variant="contained" fullWidth>
                                    Continuar
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </form>
            </Grid >
        </Grid >
    )
}