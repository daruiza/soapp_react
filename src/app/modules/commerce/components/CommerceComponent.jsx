import { useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from '../../../../hooks';
import { uploadLogo } from '../../../../api/upload/uploadThuks';
import { commerceSave, geoDivCommecerDepartamentos, geoDivCommecerMunicipios } from '../../../../store/commerce/commerceThuks';
import {
    capitalize,
    Avatar,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    TextField,
    DialogActions,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel
} from '@mui/material'
import { useEffect } from 'react';
import { commerceUpdate } from '../../../../store';


const formData = { id: '', logo: '', name: '', nit: '', department: '', city: '', adress: '' };
const formValidations = {
    name: [(value) => value.length >= 1, 'El Nombre es obligatorio.'],
    nit: [(value) => value.length >= 1, 'El NIT es obligatorio.'],
};

const setInputsForm = (commerce) => {
    for (const formField of Object.keys(formData)) {
        formData[formField] = commerce ? commerce[formField] ?? '' : '';
    }
    return formData;
};

export const CommerceComponent = ({ commerce = {}, user = {}, open = false, handleClose = () => { } }) => {

    const dispatch = useDispatch();
    // const commerce = useMemo(() => commerceState, [commerceState]);

    const [departmentArray, setDepartmentArray] = useState([])
    const [cityArray, setCityArray] = useState([]);

    const {
        formState,
        name,
        nit,
        department,
        city,
        adress,
        nameValid,
        nameToched,
        nitValid,
        nitToched,
        isFormValid,
        formChange,
        onInputChange,
        onInputClick,
        setInput,
        onResetForm
    } = useForm(setInputsForm(commerce), formValidations);

    const [image, setImage] = useState(commerce?.logo ? `${window.location.origin}${commerce.logo}` : null);
    const inputFileRef = useRef();

    // Behavior
    const AddImage = () => { inputFileRef.current.click(); }

    // Events
    // municipios
    const geoMunicipiosByDepartamento = ({ target: { value: departamento } }) => {
        dispatch(geoDivCommecerMunicipios(departamento ?? '')).then((municipios) => {
            setCityArray(municipios);
            // setInput('city', city)
        });
    }

    const handleInputFileChange = (event) => {
        const file = event.target.files[0]
        if (file.type.includes('image')) {
            setImage(URL.createObjectURL(event.target.files[0]));
            dispatch(uploadLogo(file)).then(({ data }) => {
                setInput('logo', data.storage_image_path)
            });
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if (isFormValid) {
            dispatch(commerceSave({ form: { ...commerce, ...formState, user_id: user.id } })).then(({ data: { data } }) => {
                // Actualizamos el comercio
                dispatch(commerceUpdate({ commerce: { ...commerce, ...data.commerce } }))
                onResetForm({
                    initialForm: setInputsForm({ ...commerce, ...data.commerce }),
                    formState: { ...formState, id: data?.commerce?.id ?? '' }
                });
            });
        }
    }

    useEffect(() => {
        dispatch(geoDivCommecerDepartamentos()).then((departamentos) => {
            setDepartmentArray(departamentos)
        });
    }, [])

    useEffect(() => {
        if (department) {
            geoMunicipiosByDepartamento({ target: { value: department } })
        }
    }, [department])

    useEffect(() => {
        // Update de Formulario        
        onResetForm({
            initialForm: commerce ? setInputsForm(commerce) : formData,
            formState: { ...formState }
        })
    }, [commerce])

    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth='md'
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                <Grid container alignItems="center">
                    <Grid item sx={{ mr: 2 }}>
                        <Avatar
                            style={{ cursor: 'pointer' }}
                            alt="Logo"
                            src={image}
                            onClick={AddImage}
                            sx={{ width: 56, height: 56 }}
                        />
                    </Grid>
                    <Grid item>
                        {`${capitalize(name ?? '')}`}
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>Editar y Actualizar la Información de mi Negocio</DialogContentText>
                <form onSubmit={handleSubmit}>
                    <input style={{ display: 'none' }} ref={inputFileRef} type="file" onChange={handleInputFileChange} />
                    <Grid container spacing={0} justifyContent="flex-start" sx={{ mb: 2 }}>
                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
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

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                            <TextField
                                label="NIT"
                                type="text"
                                placeholder='NIT'
                                fullWidth
                                name="nit"
                                value={nit}
                                onChange={onInputChange}
                                onClick={onInputClick}
                                helperText={nitValid}
                                error={!!nitValid && nitToched}
                            />
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Departamento</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="department"
                                    value={department}
                                    label="Departamento"
                                    onChange={e => { onInputChange(e); geoMunicipiosByDepartamento(e) }}>
                                    {
                                        departmentArray.map((el, index) => (
                                            <MenuItem key={index} value={el}>{el}</MenuItem>
                                        ))
                                    }

                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Municipio</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    name="city"
                                    value={cityArray.find(el => el === city) ? city : ''}
                                    label="Municipio"
                                    onChange={onInputChange}>
                                    {
                                        cityArray.map((el, index) => (
                                            <MenuItem key={index} value={el}>{el}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} md={6} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                            <TextField
                                label="Dirección"
                                type="text"
                                placeholder='Dirección'
                                fullWidth
                                name="adress"
                                value={adress}
                                onChange={onInputChange}
                                onClick={onInputClick}
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
