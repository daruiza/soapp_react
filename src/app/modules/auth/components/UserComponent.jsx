import { useEffect, useRef, useState } from 'react'
import { Avatar, Button, capitalize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux';
import { uploadPhoto } from '../../../../api/upload/uploadThuks';
import { userSave } from '../../../../api/user/userThunks';
import { useForm } from '../../../../hooks';
import { updateUser } from '../../../../store';

const formData = { id: '', name: '', lastname: '', email: '', phone: '', theme: '' };
const formValidations = {
    name: [(value) => value.length >= 1, 'El Nombre es obligatorio.'],
    email: [(value) => value.includes('@'), 'El Correo debe tener una @.'],
};
const setInputsForm = (user) => {
    for (const formField of Object.keys(formData)) {
        formData[formField] = user[formField];
    }
    return formData
};

export const UserComponent = ({ user = {}, open = false, handleClose = () => { } }) => {

    const dispatch = useDispatch();

    const {
        formState,
        name,
        lastname,
        email,
        phone,
        theme,
        emailValid,
        nameValid,
        nameToched,
        emailToched,
        isFormValid,
        formChange,
        setInput,
        onInputChange,
        onInputClick,
        onResetForm } = useForm(setInputsForm(user), formValidations);

    const [image, setImage] = useState(user.photo ? `${window.location.origin}${user.photo}` : null);
    const inputFileRef = useRef();

    const AddImage = () => {
        inputFileRef.current.click();
    }

    // Init


    // Behavior


    // Events
    const handleInputFileChange = (event) => {
        const file = event.target.files[0]
        if (file.type.includes('image')) {
            setImage(URL.createObjectURL(event.target.files[0]));
            dispatch(uploadPhoto(file)).then(({ data }) => {
                setInput('photo', data.storage_image_path)
            });
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            dispatch(userSave({ form: { ...user, ...formState }, user: user })).then(({ data: { data } }) => {
                // Actualizamos el usuario
                dispatch(updateUser({ user: { ...user, ...data.user } }))
                onResetForm({ initialForm: setInputsForm(user), formState });
            });
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
                    <Grid item>
                        {`${capitalize(name)} ${capitalize(lastname)}`}
                    </Grid>
                    <Grid item>
                        <Avatar
                            style={{ cursor: 'pointer' }}
                            alt="Photo"
                            src={image}
                            onClick={AddImage}
                            sx={{ width: 56, height: 56 }}
                        />
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>Editar y Actualizar mi Información de Usuario</DialogContentText>

                <form onSubmit={handleSubmit}>
                    <input style={{ display: 'none' }} ref={inputFileRef} type="file" onChange={handleInputFileChange} />
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
                                helperText={nameValid}
                                error={!!nameValid && nameToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Apellidos"
                                type="text"
                                placeholder='Apellidos Completos'
                                fullWidth
                                name="lastname"
                                value={lastname}
                                onChange={onInputChange}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0} justifyContent="center" sx={{}}>
                        <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Celular"
                                type="phone"
                                placeholder=''
                                fullWidth
                                name="phone"
                                value={phone}
                                onChange={onInputChange}
                            />
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Correo"
                                type="email"
                                placeholder='correo@example.com'
                                fullWidth
                                name="email"
                                value={email}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={emailValid}
                                error={!!emailValid && emailToched}
                                inputProps={{ className: `` }}
                            />
                        </Grid>

                        <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Diseño"
                                type="theme"
                                placeholder=''
                                fullWidth
                                name="theme"
                                value={theme}
                                onChange={onInputChange}
                            />
                        </Grid>
                    </Grid>
                </form>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" >Cerrar</Button>
                <Button onClick={handleSubmit} disabled={!isFormValid || !formChange} variant="contained" autoFocus>Actualizar</Button>
            </DialogActions>
        </Dialog>
    )
}
