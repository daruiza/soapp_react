import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { TrainingsstEvidenceComponent } from '../../../components/evidences/TrainingsstEvidenceComponent';
import { Button, FormControl, Grid, InputLabel, TextField, Select, MenuItem, Tooltip, IconButton, FormHelperText, Card, CardContent, Typography, Paper, TableContainer, Table, TableBody, TableRow, TableCell, CardActions, CardHeader, Box } from '@mui/material'
import { trainingsstDeleteById, trainingsstStore, trainingsstUpdate } from '../../../../store';
import { DialogAlertComponent } from '../../../components';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useTheme } from '@emotion/react';
import es from 'dayjs/locale/es';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';

export const ReportTrainingSSTComponent = ({ trainingsst = [], report = {}, setTrainingsst = () => { }, topicSSTArray = [], getReportById = () => { }, commerce_id = null }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [trainingsstinit, setTrainingsstInit] = useState([]);

    const [openEvidences, setOpenEvidences] = useState({
        open: false,
        dialogtitle: '',
        dialogcontenttext: '',
        trainingsst: {},
        approved: false
    });

    const [handleAlert, setHandleAlert] = useState({
        openAlert: false,
        functionAlertClose: () => { },
        functionAlertAgree: () => { },
        alertTittle: '',
        alertMessage: '',
        alertChildren: false
    });

    const [handleAlertDelete, setHandleAlertDelete] = useState({
        openAlert: false,
        functionAlertClose: () => { },
        functionAlertAgree: () => { },
        alertTittle: '',
        alertMessage: '',
        alertChildren: false
    });    

    // Eventos

    // Cambios en los inputs del Array trainingsst
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
            approved: tsst?.approved ?? false,
            open: true
        }))
    }

    const handleEvidenceClose = () => {
        setOpenEvidences((openEvidences) => ({ ...openEvidences, open: false }));
    }

    const handleDeleteTrainingSSTReport = (tsst) => {        
        setHandleAlertDelete({
          openAlert: true,
          functionAlertClose: () => setHandleAlertDelete({ openAlert: false }),
          functionAlertAgree: () => handleDeleteTrainingSST(tsst),
          alertTittle: 'Eliminar Registro',
          alertMessage: `Estas seguro de borrar el registro ${tsst.topic}.`
        });
    }

    const handleDeleteTrainingSST = (tsst) => {
        dispatch(trainingsstDeleteById({
            form: { ...tsst }
        })).then((data) => {
            getReportById();
            setHandleAlertDelete({ openAlert: false })
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

        if ('id' in tsst && tsst.id) {
            dispatch(trainingsstUpdate({
                form: { ...tsst }
            })).then(({ data: { data: { trainingsst } } }) => {
                setTrainingsstInit(tsst => ([...tsst.filter(el => el.id !== trainingsst.id), trainingsst]));
                getReportById();
            });
        } else {
            dispatch(trainingsstStore({
                form: { ...tsst }
            })).then(({ data: { data: { testingsst } } }) => {
                setTrainingsstInit(tsst => ([...tsst.filter(el => el.id !== testingsst.id), testingsst]));
                getReportById();
            });
        }
    }

    // Validacines
    const numberPatternValidation = (value) => {
        if (!value) return true;
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

        const tssttrainingsstinit = trainingsstinit?.find(el => el.id === tsst.id);

        return 'id' in tsst ?
            JSON.stringify({ ...tssttrainingsstinit, approved: tssttrainingsstinit?.approved ? true : false }) == JSON.stringify({ ...tsst, assistants: +tsst?.assistants, hours: +tsst?.hours, approved: tsst?.approved ? true : false }) :
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
                                                    disabled={tsst?.approved ? true : false}
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
                                            disabled={tsst?.approved ? true : false}
                                            variant="standard"
                                            size="small"
                                            label="Asistentes"
                                            type="text"
                                            fullWidth
                                            name="assistants"
                                            value={tsst?.assistants ?? ''}
                                            onChange={(event) => changeInputTrainingSST(event, index)}
                                            // error={tsst?.assistants === ''}
                                            error={!numberPatternValidation(tsst?.assistants) ? true : false}
                                            helperText={!numberPatternValidation(tsst?.assistants) ? 'Se espera un número positivo' : ''}
                                        />
                                    </Grid>

                                    <Grid item xs={12} md={2} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                        <TextField
                                            disabled={tsst?.approved ? true : false}
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

                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5, display: 'flex', alignItems: 'center', marginTop: '-10px' }} >
                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                            <DatePicker
                                                disabled={tsst?.approved ? true : false}
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
                                        <span>
                                            <IconButton
                                                disabled={tsst?.approved ? true : false}
                                                onClick={() => handleDeleteTrainingSSTReport(tsst)}
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
                                        </span>
                                    </Tooltip>

                                    <Tooltip title="Guardar Cambios" placement="top">
                                        <span>
                                            <IconButton
                                                disabled={trainingSSTSavevalidator(tsst) || tsst?.approved ? true : false}
                                                onClick={() => handleSaveTrainingSST(tsst)}                                            >
                                                <SaveIcon
                                                // sx={{ color: !validatorSaveEmployeeInsetDisabled(cl) ? palette.primary.main : '' }}
                                                ></SaveIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    {
                                        tsst?.id &&
                                        <>
                                            <Tooltip title="Evidencias" placement="top">
                                                <span>
                                                    <IconButton
                                                        disableFocusRipple={tsst?.approved ? true : false}
                                                        onClick={() => handleEvidenceOpen(tsst)}
                                                    ><AttachFileIcon></AttachFileIcon></IconButton>
                                                </span>
                                            </Tooltip>

                                            <Tooltip title={`${tsst?.approved ? 'Aprobado' : 'Aprobar'}`} placement="top">
                                                <span>
                                                    <PrivateAgentRoute>
                                                        <IconButton
                                                            onClick={() => handleSaveTrainingSST({ ...tsst, approved: !tsst?.approved })}>
                                                            {!!tsst?.approved &&
                                                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                                            }
                                                            {!tsst?.approved &&
                                                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                            }
                                                        </IconButton>
                                                    </PrivateAgentRoute>

                                                    <PrivateCustomerRoute>
                                                        <IconButton disabled>
                                                            {tsst?.approved &&
                                                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                                            }
                                                            {!tsst?.approved &&
                                                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                            }
                                                        </IconButton>
                                                    </PrivateCustomerRoute>
                                                </span>
                                            </Tooltip>
                                        </>
                                    }

                                </Grid>
                            </Grid>
                        </Grid>)
                })
            }

            <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "end" }}>
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Grid item xs={12} md={12} sx={{ display: "flex", justifyContent: "end", mb: 1, pr: 0.5, pl: 0.5 }}>
                        <Button
                            disabled={trainingsst?.length === 0}
                            onClick={() => {
                                setHandleAlert({
                                    openAlert: true,
                                    props: { children: true },
                                    functionAlertClose: () => setHandleAlert({ openAlert: false }),
                                    functionAlertAgree: () => setHandleAlert({ openAlert: false }),
                                    // alertTittle: 'Informe',
                                    alertChildren: true
                                });
                            }}
                            variant="contained"
                            sx={{
                                height: '100%',
                                color: `${palette.text.custom}`,
                                // border: '1px solid'
                            }}>Informe Capacitaciones
                        </Button>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                        <Button onClick={() => {
                            setTrainingsst(sst => [...sst, {
                                topic: undefined,
                                date: null,
                                hours: null,
                                assistants: null,
                                report_id: report?.id,
                                save: false
                            }])
                        }}
                            variant="contained"
                            disabled={!!trainingsst.find(el => el.save === false)}
                            sx={{
                                height: '100%',
                                color: `${palette.text.custom}`,
                                // border: '1px solid'
                            }}>AGREGAR CAPACITACIÓN
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            {
                openEvidences.open && <TrainingsstEvidenceComponent
                    open={openEvidences.open}
                    dialogtitle={openEvidences.dialogtitle}
                    dialogcontenttext={openEvidences.dialogcontenttext}
                    trainingsst={openEvidences.trainingsst}
                    approved={openEvidences.approved}
                    report_id={report.id}
                    commerce_id={commerce_id}
                    handleClose={handleEvidenceClose}
                ></TrainingsstEvidenceComponent>
            }

            {
                handleAlert.openAlert && <DialogAlertComponent
                    open={handleAlert.openAlert}
                    handleClose={() => handleAlert.functionAlertClose()}
                    handleAgree={() => handleAlert.functionAlertAgree()}
                    props={{
                        tittle: handleAlert.alertTittle,
                        message: handleAlert.alertMessage,
                        children: handleAlert.alertChildren
                    }}
                >
                    <Card>
                        {/* <CardHeader action={<>hello</>}></CardHeader> */}
                        <CardContent>
                            <Typography gutterBottom variant="h7" component="div" sx={{ marginBottom: '20px' }}>
                                INFORME CAPACITACIÓN Y ENTRANAMIENTO
                            </Typography>
                            <TableContainer component={Paper}>
                                <Table size={'small'} aria-label="simple table"
                                    sx={{
                                        // minWidth: 650 
                                    }}
                                >
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Total Capacitaciones en SST</TableCell>
                                            <TableCell>{trainingsst?.length ?? 0}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total duración (Horas) Capacitación SST</TableCell>
                                            <TableCell>{trainingsst.reduce((a, b) => (a + b.hours), 0) ?? 0}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Total Asistentes Capacitaciones SST (B)</TableCell>
                                            <TableCell>{trainingsst.reduce((a, b) => (a + b.assistants), 0) ?? 0}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>N° Total de personas del proyecto (A)</TableCell>
                                            <TableCell>{report.employee.length ?? 0}</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Sumatoria de N° horas cap. SST * N° personas asistieron a capacitaciones.</TableCell>
                                            <TableCell>{
                                                (trainingsst.reduce((a, b) => (a + b.hours), 0) ?? 0) *
                                                (trainingsst.reduce((a, b) => (a + b.assistants), 0) ?? 0)
                                            }</TableCell>
                                        </TableRow>

                                        <TableRow>
                                            <TableCell>Horas hombre capacitación en SST (B/A).</TableCell>
                                            <TableCell>{
                                                (trainingsst.reduce((a, b) => (a + b.assistants), 0) ?? 0) /
                                                (report.employee.length ?? 0)
                                            }</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                        <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                            <Box></Box>
                            <Box>
                                <IconButton onClick={() => handleAlert.functionAlertAgree()}>
                                    <CloseIcon sx={{ color: palette.text.disabled }} />
                                </IconButton>
                            </Box>
                        </CardActions>
                    </Card>
                </DialogAlertComponent>
            }

            {
                handleAlertDelete.openAlert && <DialogAlertComponent
                    open={handleAlertDelete.openAlert}
                    handleClose={() => handleAlertDelete.functionAlertClose()}
                    handleAgree={() => handleAlertDelete.functionAlertAgree()}
                    props={{
                        tittle: handleAlertDelete.alertTittle,
                        message: handleAlertDelete.alertMessage
                    }}
                ></DialogAlertComponent>
            }
        </Grid >
    )
}
