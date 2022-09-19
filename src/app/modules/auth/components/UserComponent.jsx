import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, TextField } from '@mui/material'
import axios from 'axios';
import { useRef, useState } from 'react'
import { useDispatch } from 'react-redux';
import { uploadPhoto } from '../../../../api/upload/uploadThuks';
import { useForm } from '../../../../hooks';

const formData = { name: '', email: '' }
const setInputsForm = (user) => {
    console.log('user', user);
    return formData
}


export const UserComponent = ({ user = {}, open = false, handleClose = () => { } }) => {

    const dispatch = useDispatch();

    const { } = useForm(setInputsForm(user));

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
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault()
        dispatch(uploadPhoto(file));
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                <Grid container justifyContent="space-between">
                    <Grid item>
                        {user?.fullname}
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
                <DialogContentText id="alert-dialog-description">Editar y Actualizar mi Información de Usuario</DialogContentText>

                <form onSubmit={handleSubmit}>
                    <input style={{ display: 'none' }} ref={inputFileRef} type="file" onChange={handleChange} />
                    <Grid container sx={{ flexWrap: 'nowrap' }}>
                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 2 }} >
                            <TextField
                                label="Correo"
                                type="email"
                                placeholder='correo@example.com'
                                fullWidth
                                name="email"
                            // value={email}
                            // onClick={onInputClick}
                            // onChange={onInputChange}
                            // helperText={emailValid}
                            // error={!!emailValid && emailToched}
                            // inputProps={{ className: `` }}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, mr: 0 }} >
                            <TextField
                                label="Correo"
                                type="email"
                                placeholder='correo@example.com'
                                fullWidth
                                name="email"
                            // value={email}
                            // onClick={onInputClick}
                            // onChange={onInputChange}
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
                <Button onClick={handleClose} variant="contained" autoFocus>
                    Actualizar
                </Button>
            </DialogActions>
        </Dialog>
    )
}
