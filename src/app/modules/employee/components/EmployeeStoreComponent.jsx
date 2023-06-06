import { useRef, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useForm } from '../../../../hooks';
import { Avatar, Button, capitalize, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, InputLabel, MenuItem, Select, Switch, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { uploadEmployeePhoto } from '../../../../api/upload/uploadThuks';
import { employeeStore, employeeUpdate } from '../../../../store';

const formValidations = {
    name: [(value) => value.length >= 1, 'El Nombre es obligatorio.'],
    email: [(value) => value.includes('@'), 'El Correo debe tener una @.'],
    identification_type: [(value) => value, 'El Tipo de Identificación es obligatorio.'],
};

const formData = { id: '', name: '', lastname: '', email: '', adress: '', phone: '', identification_type: '', identification: '', birth_date: '', photo: '', is_employee: false };

const setInputsForm = (object) => {
    for (const formField of Object.keys(formData)) {
        formData[formField] =
            object ?
                object[formField] !== null && object[formField] !== undefined ?
                    object[formField] :
                    '' :
                '';
    }
    return formData
};

export const EmployeeStoreComponent = ({ employee = {}, open = false, identificationtypeArray = [], commerce = {}, getEmployees = () => { }, handleClose = () => { } }) => {

    const dispatch = useDispatch();
    const {
        formState,
        name,
        lastname,
        email,
        phone,
        adress,
        identification_type,
        identification,
        birth_date,
        photo,
        is_employee,
        nameValid,
        lastnameValid,
        emailValid,
        phoneValid,
        adressValid,
        identification_typeValid,
        identificationValid,
        birth_dateValid,
        photoValid,
        is_employeeValid,
        nameToched,
        lastnameToched,
        emailToched,
        phoneToched,
        adressToched,
        identification_typeToched,
        identificationToched,
        birth_dateToched,
        photoToched,
        is_employeeToched,
        isFormValid,
        formChange,
        setInput,
        setFormState,
        onInputChange,
        onInputClick,
        onResetForm,
        onInputChangeValue
    } = useForm(setInputsForm(employee), formValidations);

    const [is_employeeSwitch, setIs_employeeSwitch] = useState(false);
    const [image, setImage] = useState(employee.photo ? `${window.location.origin}${employee.photo}` : null);
    const inputFileRef = useRef();

    // Behavior
    const AddImage = () => { inputFileRef.current.click(); }

    // Events
    const handleInputFileChange = (event) => {
        const file = event.target.files[0]
        if (file.type.includes('image')) {
            setImage(URL.createObjectURL(event.target.files[0]));
            dispatch(uploadEmployeePhoto(file, commerce.id ?? 1)).then(({ data }) => {
                setInput('photo', data.storage_image_path)
            });
        }
    }

    // COMPORTAMIENTO
    const changeFilterToggle = (event) => {        
        setIs_employeeSwitch(event.target.checked);
        setInput('is_employee', event.target.checked ? 1 : 0)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            if (!formState.id) {
                // Guardar Nuevo Usuario                
                dispatch(employeeStore({
                    form: {
                        ...formState,
                        is_employee: formState.is_employee === '' ? 0 : formState.is_employee,
                        commerce_id: commerce.id ?? 1
                    }
                })).then((response) => {
                    getEmployees();// Refrescamos la tabla
                    handleClose();
                }, error => setMessageSnackbar({ dispatch, error }))
            } else {
                // Actualizar Usuario
                dispatch(employeeUpdate({
                    form: {
                        ...formState,
                        commerce_id: commerce.id ?? 1
                    }
                })).then((response) => {
                    getEmployees();// Refrescamos la tabla
                    handleClose();
                }, error => setMessageSnackbar({ dispatch, error }))
            }
        }
    }

    useEffect(() => {
        if (!birth_date) {
            setInput('birth_date', dayjs('1969-01-01').format('YYYY-MM-DD'))
        }
        if (Boolean(is_employee)) {
            setIs_employeeSwitch(is_employee ? true : false);
        }
    }, [employee])

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
                    <Grid item sx={{
                        // color: `${palette.text.secondary}` 
                    }}>
                        {`${capitalize(name)}`} {`${capitalize(lastname)}`}
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
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
                            Información
                            {employee.id && `a Editar/Actualizar de `}
                            {!employee.id && `de nuevo `}
                            Colaborador
                        </DialogContentText>
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            sx={{ ml: 2 }}
                            control={<Switch checked={is_employeeSwitch} onChange={changeFilterToggle} name="is_employee" />}
                            label={`${is_employeeSwitch ? 'Si es Empleado' : 'No es Empleado'}`}
                        />
                    </Grid>
                </Grid>
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

                        <Grid item xs={12} md={6} sx={{ mb: 1, pl: 0.5, pr: 0.5 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Tipo Identificación</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="identification_type"
                                    value={identification_type}
                                    label="Tipo Identificación"
                                    onChange={e => { onInputChange(e) }}
                                    error={!!identification_typeValid && identification_typeToched}
                                >
                                    <MenuItem value=''><em></em></MenuItem>
                                    {
                                        identificationtypeArray &&
                                        identificationtypeArray.length &&
                                        identificationtypeArray.map((el, index) => (
                                            <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                                        ))
                                    }
                                </Select>
                                <FormHelperText>{!!identification_typeToched && identification_typeValid}</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }} >
                            <TextField
                                label="Identificación"
                                type="text"
                                placeholder='Identificación'
                                fullWidth
                                name="identification"
                                value={identification}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!identificationToched && identificationValid}
                                error={!!identificationValid && identificationToched}
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
                                label="Dirección"
                                type="text"
                                placeholder='Dirección de recidencia'
                                fullWidth
                                name="adress"
                                value={adress}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={!!adressToched && adressValid}
                                error={!!adressValid && adressToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                            <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
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
                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} variant="outlined"
                    sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`, 
                        border: '1px solid'
                    }} >Cerrar</Button>
                <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid || !formChange}
                    variant="outlined"
                    sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`
                    }}>
                    {employee.id && `Actualizar`}
                    {!employee.id && `Guardar`}
                </Button>

            </DialogActions>

        </Dialog>
    )
}
