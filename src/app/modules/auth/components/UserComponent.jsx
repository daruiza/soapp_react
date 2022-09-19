import { Avatar, Button, capitalize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material'
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { uploadPhoto } from '../../../../api/upload/uploadThuks';
import { useForm } from '../../../../hooks';

const formData = { id: '', name: '', lastname: '', email: '', phone: '', theme: '' }
const setInputsForm = (user) => {
    console.log('user', user);
    for (const formField of Object.keys(formData)) {
        formData[formField] = user[formField];
    }
    return formData
}


export const UserComponent = ({ user = {}, open = false, handleClose = () => { } }) => {

    const dispatch = useDispatch();

    const { formState, name, lastname, email, phone, theme, setInput, onInputChange } = useForm(setInputsForm(user));

    const [file, setFile] = useState();
    const [image, setImage] = useState();
    const inputFileRef = useRef();

    const AddImage = () => {
        inputFileRef.current.click();
    }

    // Init


    // Behavior

    // Events
    const handleChange = (event) => {
        const file = event.target.files[0]
        console.log(file);
        if (file.type.includes('image')) {
            setFile(event.target.files[0])
            setImage(URL.createObjectURL(event.target.files[0]));
            dispatch(uploadPhoto(file)).then(({ data }) => {                
                setInput('photo', data.image_path)
            });
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        console.log('formState', formState)
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
                    <input style={{ display: 'none' }} ref={inputFileRef} type="file" onChange={handleChange} />
                    <Grid container sx={{ flexWrap: 'nowrap', mb: 2 }}>
                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 2 }} >
                            <TextField
                                label="Nombres"
                                type="text"
                                placeholder='Nombre Completo'
                                fullWidth
                                name="name"
                                value={name}
                                onChange={onInputChange}
                            // onClick={onInputClick}
                            // helperText={emailValid}
                            // error={!!emailValid && emailToched}
                            // inputProps={{ className: `` }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 0 }} >
                            <TextField
                                label="Apellidos"
                                type="text"
                                placeholder='Apellidos Completos'
                                fullWidth
                                name="lastname"
                                value={lastname}
                                onChange={onInputChange}
                            // onClick={onInputClick}
                            // helperText={emailValid}
                            // error={!!emailValid && emailToched}
                            // inputProps={{ className: `` }}
                            />
                        </Grid>
                    </Grid>
                    <Grid container sx={{ flexWrap: 'nowrap' }}>
                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 2 }} >
                            <TextField
                                label="Celular"
                                type="phone"
                                placeholder=''
                                fullWidth
                                name="phone"
                                value={phone}
                                onChange={onInputChange}
                            // onClick={onInputClick}
                            // helperText={emailValid}
                            // error={!!emailValid && emailToched}
                            // inputProps={{ className: `` }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 2 }} >
                            <TextField
                                label="Correo"
                                type="email"
                                placeholder='correo@example.com'
                                fullWidth
                                name="email"
                                value={email}
                                onChange={onInputChange}
                            // onClick={onInputClick}
                            // helperText={emailValid}
                            // error={!!emailValid && emailToched}
                            // inputProps={{ className: `` }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 0 }} >
                            <TextField
                                label="Diseño"
                                type="theme"
                                placeholder=''
                                fullWidth
                                name="theme"
                                value={theme}
                                onChange={onInputChange}
                            // onClick={onInputClick}
                            // helperText={emailValid}
                            // error={!!emailValid && emailToched}
                            // inputProps={{ className: `` }}
                            />
                        </Grid>
                    </Grid>
                </form>

            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="contained" >Cerrar</Button>
                <Button onClick={handleSubmit} variant="contained" autoFocus>
                    Actualizar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
