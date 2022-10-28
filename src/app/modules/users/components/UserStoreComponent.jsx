import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../../../hooks';
import { useTheme } from '@emotion/react';
import { Button, capitalize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Grid, Select, InputLabel, MenuItem, TextField, FormHelperText } from '@mui/material'
import { userStore, userUpdateById } from '../../../../store/user/userThunks';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

const formValidations = {
    name: [(value) => value.length >= 1, 'El Nombre es obligatorio.'],
    email: [(value) => value.includes('@'), 'El Correo debe tener una @.'],
    rol_id: [(value) => value, 'El Rol es obligatorio.'],
    // password: [(value) => value.length >= 1, 'La Contraseña es obligatoria.'],
};

const formData = { id: '', name: '', lastname: '', email: '', phone: '', theme: '', photo: '', rol_id: '', password: '' };
const setInputsForm = (user) => {
    for (const formField of Object.keys(formData)) {
        formData[formField] = user[formField] ?? '';
    }
    return formData
};

export const UserStoreComponent = ({ user = {}, open = false, handleClose = () => { }, rolArray = [], getUsers = () => { } }) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const {
        formState,
        name,
        lastname,
        email,
        phone,
        theme,
        rol_id,
        password,
        nameValid,
        lastnameValid,
        emailValid,
        phoneValid,
        themeValid,
        rol_idValid,
        passwordValid,
        nameToched,
        lastnameToched,
        emailToched,
        phoneToched,
        themeToched,
        rol_idToched,
        passwordToched,
        isFormValid,
        formChange,
        setFormState,
        onInputChange,
        onInputClick,
        onResetForm
    } = useForm(setInputsForm(user), formValidations);

    useEffect(() => {
        setFormState(setInputsForm(user), user ? formValidations : {})
        onResetForm({ initialForm: setInputsForm(user), formState: formState });
    }, [user]);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            if (!formState.id) {
                // Guardar Nuevo Usuario                
                dispatch(userStore({ form: { ...formState } })).then((response) => {
                    getUsers();// Refrescamos la tabla
                    handleClose();
                }, error => setMessageSnackbar({ dispatch, error }))
            } else {
                // Actualizar Usuario
                dispatch(userUpdateById({ form: { ...formState } })).then((response) => {
                    console.log('response', response);
                    getUsers();// Refrescamos la tabla
                    handleClose();
                }, error => setMessageSnackbar({ dispatch, error }))
            }
        }
    }

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth='md'
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                <Grid container justifyContent="space-between">
                    <Grid item sx={{ color: `${palette.text.secondary}` }}>
                        {`${capitalize(name)}`} {`${capitalize(lastname)}`}
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
                    Información
                    {user.id && `a Editar/Actualizar de `}
                    {!user.id && `de nuevo `}
                    Usuario
                </DialogContentText>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={0} justifyContent="center" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Nombres"
                                type="text"
                                placeholder='Nombre Completo'
                                fullWidth
                                name="name"
                                value={name}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!nameToched && nameValid}
                                error={!!nameValid && !!nameToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Apellido"
                                type="text"
                                placeholder='Apellido Completo'
                                fullWidth
                                name="lastname"
                                value={lastname}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!lastnameToched && lastnameValid}
                                error={!!lastnameValid && lastnameToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Correo"
                                type="text"
                                placeholder='Correo Eléctronico'
                                fullWidth
                                name="email"
                                value={email}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!emailToched && emailValid}
                                error={!!emailValid && emailToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Teléfono"
                                type="text"
                                placeholder='Teléfono o Móvil'
                                fullWidth
                                name="phone"
                                value={phone}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!phoneToched && phoneValid}
                                error={!!phoneValid && phoneToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Diseño"
                                type="text"
                                placeholder='Diseño o Tema'
                                fullWidth
                                name="theme"
                                value={theme}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!themeToched && themeValid}
                                error={!!themeValid && themeToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pl: 0.5, pr: 0.5 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Rol</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="rol_id"
                                    value={rol_id}
                                    label="Rol"
                                    onChange={e => { onInputChange(e) }}
                                    error={!!rol_idValid && rol_idToched}
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
                                <FormHelperText>{!!rol_idToched && rol_idValid}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Contraseña"
                                type="text"
                                placeholder='Contraseña'
                                fullWidth
                                name="password"
                                value={password}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!passwordToched && passwordValid}
                                error={!!passwordValid && passwordToched}
                            />
                        </Grid>
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined" sx={{ height: '100%', color: `${palette.text.primary}`, border: '1px solid' }} >Cerrar</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || !formChange}
                    variant="outlined"
                    sx={{
                        height: '100%',
                        color: `${palette.text.primary}`
                    }}>
                    {user.id && `Actualizar`}
                    {!user.id && `Guardar`}
                </Button>
            </DialogActions>

        </Dialog>
    )
}
