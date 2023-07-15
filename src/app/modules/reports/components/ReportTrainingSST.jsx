import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, FormControl, Grid, InputLabel, TextField, Select, MenuItem, Tooltip, IconButton, FormHelperText } from '@mui/material'
import { trainingsstDeleteById, trainingsstStore } from '../../../../store';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@emotion/react';
import es from 'dayjs/locale/es';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { TrainingsstEvidenceComponent } from '../../../components/evidences/TrainingsstEvidenceComponent';

export const ReportTrainingSST = ({ trainingsst = [], report = {}, setTrainingsst = () => { }, topicSSTArray = [], getReportById = () => { }, commerce_id = null }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [trainingsstinit, setTrainingsstInit] = useState([]);

    const [openEvidences, setOpenEvidences] = useState({
        open: false,
        dialogtitle: '',
        dialogcontenttext: '',
        trainingsst: {}
    });

    // Eventos
    const changeInputTrainingSST = ({ target: { value, name } }, index) => {
        setTrainingsst((sst) => sst.toSpliced(index, 1,
            {
                ...trainingsst[index],
                [name]: value
            })
        )
    }

    const handleEvidenceOpen = (tsst) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias: ${tsst?.topic}`,
            dialogcontenttext: `${tsst?.date}`,
            trainingsst: tsst,
            open: true
        }))
    }

    const handleEvidenceClose = () => {
        setOpenEvidences((openEvidences) => ({ ...openEvidences, open: false }));
    }

    const handleDeleteTrainingSST = (tsst) => {
        dispatch(trainingsstDeleteById({
            form: { ...tsst }
        })).then((data) => {
            getReportById();
        });
    }

    const handleSaveTrainingSST = (tsst) => {
        // Validamos que todos los campos esten llenos
        if (!tsst.topic ||
            !tsst.hours ||
            !tsst.assistants ||
            !tsst.date) {
            return;
        }
        dispatch(trainingsstStore({
            form: { ...tsst }
        })).then((data) => {
            setTrainingsstInit(trainingsst);
            getReportById();
        });
    }

    // Validacines
    const numberPatternValidation = (value) => {
        const regex = new RegExp(/^\d+$/);
        return regex.test(value);
    };

    const trainingSSTSavevalidator = (tsst) => {
        if (!tsst.topic ||
            !tsst.hours ||
            !tsst.assistants ||
            !tsst.date) {
            return true;
        }
        return 'id' in tsst ?
            JSON.stringify(trainingsstinit?.find(el => el.id === tsst.id)) == JSON.stringify({ ...tsst, assistants: +tsst.assistants, hours: +tsst.hours }) :
            !!(!tsst.topic ||
                !tsst.hours ||
                !tsst.assistants ||
                !tsst.date)
    }

    useEffect(() => {
        setTrainingsstInit(trainingsst);
    }, []);


    useEffect(() => {
        if (trainingsstinit.length) {
            trainingSSTSavevalidator(trainingsst[trainingsst.length - 1])
        }
    }, [trainingsstinit]);




    return (
        <Grid container>
            {
                trainingsst?.length !== 0 &&
                trainingsst.map((tsst, index) => {
                    return (
                        <Grid container key={index}>
                            <Grid item xs={12} md={12} sx={{ display: "flex" }}>
                                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>

                                    <Grid item xs={12} md={5} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                        {
                                            topicSSTArray &&
                                            topicSSTArray.length &&
                                            <FormControl
                                                fullWidth
                                                className='FormControlExamType'
                                                error={tsst?.topic === '' || tsst?.topic === null}
                                                required={true}
                                                sx={{ marginTop: '0px' }}>
                                                <InputLabel
                                                    variant="standard"
                                                    id="demo-simple-select-label"
                                                    sx={{
                                                        color: `${palette.text.primary}`
                                                    }}
                                                >Tema</InputLabel>
                                                <Select
                                                    variant="standard"
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    name="topic"
                                                    value={tsst?.topic ?? ''}
                                                    label="Tema"
                                                    onChange={(event) => changeInputTrainingSST(event, index)}>
                                                    <MenuItem value={null}><em></em></MenuItem>
                                                    {
                                                        topicSSTArray.map((el, index) => (
                                                            <MenuItem key={index} value={el?.value}>{el?.value}</MenuItem>
                                                        ))
                                                    }
                                                </Select>
                                                {
                                                    tsst?.topic === '' || tsst?.topic === null &&
                                                    <FormHelperText>Tema es un campo es requerido</FormHelperText>
                                                }
                                            </FormControl>
                                        }
                                    </Grid>

                                    <Grid item xs={12} md={2} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            variant="standard"
                                            size="small"
                                            label="Asistentes"
                                            type="text"
                                            fullWidth
                                            name="assistants"
                                            value={tsst?.assistants ?? ''}
                                            onChange={(event) => changeInputTrainingSST(event, index)}
                                            // error={tsst?.assistants === ''}
                                            error={tsst?.assistants === '' && !numberPatternValidation(tsst?.assistants) ? true : false}
                                            helperText={tsst?.assistants === '' && !numberPatternValidation(tsst?.assistants) ? 'Se espera un número positivo' : ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            variant="standard"
                                            size="small"
                                            label="Horas"
                                            type="text"
                                            fullWidth
                                            name="hours"
                                            value={tsst?.hours ?? ''}
                                            onChange={(event) => changeInputTrainingSST(event, index)}
                                            error={tsst?.hours === '' && !numberPatternValidation(tsst?.hours) ? true : false}
                                            helperText={tsst?.hours === '' && !numberPatternValidation(tsst?.hours) ? 'Se espera un número positivo' : ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center' }} >
                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                size="small"
                                                className='birth-date-piker'
                                                sx={{ width: '100%' }}
                                                inputFormat="DD/MM/YYYY"
                                                label="Fecha"
                                                name="date"
                                                value={tsst?.date ?? null}
                                                onChange={(value) => changeInputTrainingSST({ target: { name: 'date', value: value?.format('YYYY-MM-DD'), date: true } }, index)}
                                                renderInput={(params) => <TextField size="small" {...params} />}
                                            />
                                        </LocalizationProvider>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>
                                    <Tooltip title="Eliminar Registro" placement="top">
                                        <IconButton
                                            onClick={() => handleDeleteTrainingSST(tsst)}
                                        >
                                            <HighlightOffIcon
                                                sx={{
                                                    color: palette.text.disabled,
                                                    "&:hover": {
                                                        // color: `${palette.text.primary}`,
                                                        cursor: "pointer"
                                                    }
                                                }}></HighlightOffIcon>
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Guardar Cambios" placement="top">
                                        <span>
                                            <IconButton
                                                disabled={trainingSSTSavevalidator(tsst)}
                                                onClick={() => handleSaveTrainingSST(tsst)}                                            >
                                                <SaveIcon
                                                // sx={{ color: !validatorSaveEmployeeInsetDisabled(cl) ? palette.primary.main : '' }}
                                                ></SaveIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    {
                                        tsst?.id &&
                                        <Tooltip title="Evidencias" placement="top">
                                            <span>
                                                <IconButton
                                                    onClick={() => handleEvidenceOpen(tsst)}
                                                ><AttachFileIcon></AttachFileIcon></IconButton>
                                            </span>
                                        </Tooltip>
                                    }

                                </Grid>
                            </Grid>
                        </Grid>)
                })
            }

            <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Button onClick={() => {
                        setTrainingsst(sst => [...sst, {
                            topic: undefined,
                            date: null,
                            hours: null,
                            assistants: null,
                            report_id: report.id,
                            save: false
                        }])
                    }} variant="contained"
                        disabled={!!trainingsst.find(el => el.save === false)}
                        sx={{
                            height: '100%',
                            color: `${palette.text.custom}`,
                            // border: '1px solid'
                        }}>AGREGAR CAPACITACIÓN
                    </Button>
                </Grid>
            </Grid>

            {
                openEvidences.open &&
                <TrainingsstEvidenceComponent
                    open={openEvidences.open}
                    dialogtitle={openEvidences.dialogtitle}
                    dialogcontenttext={openEvidences.dialogcontenttext}
                    trainingsst={openEvidences.trainingsst}
                    report_id={report.id}
                    commerce_id={commerce_id}
                    handleClose={handleEvidenceClose}
                ></TrainingsstEvidenceComponent>
            }

        </Grid>
    )
}
