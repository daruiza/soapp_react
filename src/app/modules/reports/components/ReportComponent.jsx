import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useReduceReport } from '../../../../hooks/useReduceReport';
import { useParams, useSearchParams } from 'react-router-dom';
import { commerceUpdate, employeeIndex, employeeReportDelete, employeeReportStore, reportByreportId } from '../../../../store';
import { Grid, ImageListItem, Typography, Button, TextField, IconButton, Switch, FormControl, FormControlLabel, FormGroup, Divider, InputLabel, Select, FormLabel } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import Paper from '@mui/material/Paper';
import MenuItem from '@mui/material/MenuItem';
import { ReportCardComponent } from './ReportCardComponent';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import es from 'dayjs/locale/es';
import { useTheme } from '@emotion/react';
import EditIcon from '@mui/icons-material/Edit';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import HealingIcon from '@mui/icons-material/Healing';
import SupportIcon from '@mui/icons-material/Support';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { EvidencesComponent } from '../../../components/evidences/EvidencesComponent';
import { EmployeeState } from '../../../types/EmployeeState';
import { ReportSection } from '../../../types/ReportSection';

import { DialogAlertComponent } from '../../../components';
import { genericListGetByName } from '../../../../store/genericlist/genericlistThunks';

export const ReportComponent = ({ navBarWidth = 58 }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const { state: collaborators, setCollaborators, collaboratorsChangeInput } = useReduceReport()

    // Almacena la información los colaboradores en base de datos
    const [initCollaborators, setInitCollaborators] = useState([]);

    const [report, setReport] = useState(null);
    const [employeeArray, setEmployeeArray] = useState([]);
    const [examTypeArray, setExamTypeArray] = useState([])

    const { commerce_id: param_commerce_id } = useParams();
    const { report_id: param_report_id } = useParams();
    const [searchParams] = useSearchParams();

    const { commerce: commerceState } = useSelector(state => state.commerce);
    const commerce = useMemo(() => commerceState, [commerceState]);

    const [openNewInEvidences, setOpenNewInEvidences] = useState({
        open: false,
        dialogtitle: '',
        dialogcontenttext: '',
        employee_report: {}
    });
    const [selectCollaborator, setSelectCollaborator] = useState({});

    const [interval_test, setIntervalTest] = useState({
        income: false,
        periodical: false,
        retirement: false
    });

    const [handleAlert, setHandleAlert] = useState({
        openAlert: false,
        functionAlertClose: () => { },
        functionAlertAgree: () => { },
        alertTittle: '',
        alertMessage: '',
    });

    const asistirEnSaludBran = `${window.location.origin}/src/assets/asistirEnSaludBran.png`;

    // reportByreportId
    const getReportById = (id) => {
        dispatch(reportByreportId({
            form: {
                id: id ?? ''
            }
        })).then(({ data: { data: { report } } }) => {
            setReport(report);
            setCollaborators(report.employee.map((em, index) => ({ ...em, index })));
            setInitCollaborators(report.employee.map((em, index) => ({ ...em, index })));
            dispatch(commerceUpdate({ commerce: report.commerce }))
        });
    }

    // Obtener los colaboradores, en su último estado reportado
    const getEmployees = () => {
        const commerce_id = commerce?.id ?? param_commerce_id;
        if (commerce_id) {
            dispatch(employeeIndex({
                form: {
                    commerce_id: commerce_id,
                    employee_state: 'Pendiente',
                }
            })).then(({ data: { data: { employee } } }) => {
                setEmployeeArray(employee.data);
            });
        }
    }

    const getExamType = () => {
        dispatch(genericListGetByName({ name: 'type_medical_test' }))
            .then(({ data: { data: { generallist } } }) => {
                setExamTypeArray(generallist ?? []);
            });
    }

    const setEmployeeReportStore = (collaborator, employee_state) => {
        // se debe llamar al back para que guarde el cambio
        dispatch(employeeReportStore({
            form: {
                employee_state,
                ...collaborator.pivot
            }
        })).then((data) => {
            // Refrescamos el Report Component
            getReportById(param_report_id);
        });
    }

    const deleteEmployeeReportStore = (collaborator) => {
        dispatch(employeeReportDelete({
            form: { id: collaborator.state.find(el => el.employee_state === EmployeeState.NUEVOINGRESO).id ?? null }
        })).then((data) => {
            // Refrescamos el Report Component
            getReportById(param_report_id);
            //cerramos el alert
            setHandleAlert({ openAlert: false });
        });
    }

    // Coportamiento
    const getAge = (birth_date) => {
        if (birth_date) {
            const birthDate = new Date(birth_date);
            const difference = Date.now() - birthDate.getTime();
            const age = new Date(difference);
            return `${Math.abs(age.getUTCFullYear() - 1970)}`;
        }
    }

    // Eventos

    const changeInputCollaborator = ({ target }, index) => {
        const { name, value } = target;
        collaboratorsChangeInput({ value, name, index })
    }

    const changeInputCollaboratorValue = ({ name, value, date = false }, index) => {
        changeInputCollaborator({ target: { name: name, value: date ? value.format('YYYY-MM-DD') : value } }, index);
    }

    const handleDeleteIncomeMonth = (collaborator, index) => {
        // collaboratorsChangeInput({ value: [collaborator.state.filter(el => el.employee_state !== EmployeeState.NUEVOINGRESO)], name: 'state', index })
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => deleteEmployeeReportStore(collaborator),
            alertTittle: 'Eliminar Registro Inducción',
            alertMessage: `Estas seguro de borrar el registro de ${collaborator.name}.`
        });
    }

    const handleAddStatus = (collaborator, status) => {
        setEmployeeReportStore(collaborator, status);
        // collaboratorsChangeInput({ value: [...collaborator.state, { id: null, employee_state: EmployeeState.NUEVOINGRESO }], name: 'state', index })
    }

    const handleRemove = (collaborator, index) => {
        collaboratorsChangeInput({ value: [...collaborator.state, { id: null, employee_state: 'Retirado' }], name: 'state', index })
    }

    // Manejador de apertura de PopUp de Evidencias
    const handleEvidenceOpen = (collaborator, EmployeeState, ReportSection) => {

        setOpenNewInEvidences((openNewInEvidences) => ({
            ...openNewInEvidences,
            dialogtitle: ReportSection,
            dialogcontenttext: `${collaborator.name} ${collaborator.lastname} [${collaborator.identification}]`,
            employee_report: collaborator.state.find(el => el.employee_state === EmployeeState),
            open: true
        }));

        setSelectCollaborator(collaborator);
    }

    const handleEvidenceClose = () => {
        setOpenNewInEvidences((openNewInEvidences) => ({ ...openNewInEvidences, open: false }));
        setSelectCollaborator(null);
    }

    //Validaciones

    const validatorSaveEmployeeInsetDisabled = (cl) => {
        return JSON.stringify({
            campus: `${initCollaborators.find(el => el.id === cl.id)?.campus ?? ''}`,
            company: `${initCollaborators.find(el => el.id === cl.id)?.company ?? report?.commerce?.name}`
        }).trim() === JSON.stringify({
            campus: cl?.campus ?? '',
            company: `${cl?.company ?? report?.commerce?.name}`
        }).trim()
    }

    // Muy peligroso y enrreda en demasia
    useEffect(() => {
        console.log('ReportcollaboratorsEffect', collaborators);

        // console.log('selectCollaborator', selectCollaborator);
        // refrescamos el selectCollaborator
        // if (selectCollaborator && (selectCollaborator?.index || selectCollaborator?.index === 0 || selectCollaborator?.index === '0')) {
        //     setSelectCollaborator(collaborators?.collaborators.find(el => el.index === selectCollaborator.index));
        // }

    }, [collaborators])

    useEffect(() => {
        getEmployees();
        getReportById(param_report_id);
        getExamType();
    }, [])

    return (
        <Grid container
            sx={{
                minHeight: `calc(100vh - ${navBarWidth}px)`,
                backgroundColor: 'secondary.main',
                padding: 2,
                // alignItems: { xs: 'start', md: 'center' }
            }}>
            <Grid item xs={12} md={12}>
                <Grid container>
                    <Grid item xs={12} md={12} mb={2} sx={{ marginBottom: '0px' }} display={'flex'}>
                        <Grid item xs={6} md={2} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <ImageListItem>
                                <img
                                    src={asistirEnSaludBran}
                                    alt="asistirEnSaludBran"
                                    loading="lazy" />
                            </ImageListItem>
                        </Grid>

                        <Grid item xs={6} md={7} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography>
                                        ACTAS DE CONSULTORIA
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Typography sx={{ fontSize: '14px' }}>
                                        ÁREA:  SEGURIDAD Y SALUD EN EL TRABAJO
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6} md={3} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container>

                                {
                                    report?.project &&
                                    <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid item xs={12} md={6} >
                                            <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid', borderLeft: '1px solid' }}>
                                                Proyecto
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid' }}>
                                                {report?.project}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }

                                {
                                    report?.elaborated &&
                                    <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid item xs={12} md={6} >
                                            <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid', borderLeft: '1px solid' }}>
                                                Elaboró
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid' }}>
                                                {report?.elaborated}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }

                                {
                                    report?.passed &&
                                    <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Grid item xs={12} md={6} >
                                            <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid', borderLeft: '1px solid' }}>
                                                Aprobó
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6} >
                                            <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid' }}>
                                                {report?.passed}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                }

                                <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Grid item xs={12} md={6} >
                                        <Typography sx={{ textAlign: 'center', border: '1px solid' }}>
                                            Fecha
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid', borderBottom: '1px solid' }}>
                                            {dayjs(report?.date).format('DD-MM-YYYY')}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} md={12} mb={2}>
                        <Typography sx={{ fontSize: '13px', textAlign: 'center' }}>
                            Este formulario debe ser diligenciado semanalmente por la persona responsable del sistema de gestion sst de la empresa, resume las principales actividades e indicadores que deben ser reportados mensualmente a la Gerencia de la empresa " cliente"y la consultora ASISTIR EN SALUD Y RIESGOS LABORALES, Los datos reportados deben tener un soporte escrito y se presentaran anexos a este informe.
                            Nota: en caso de tener contratados Sub_contratistas debe incluir  información de cada contratista.
                        </Typography>
                    </Grid>
                    <Grid item xs={12} md={12} mb={2}>
                        {
                            commerce &&
                            <>
                                <ReportCardComponent
                                    sx={{ borderRadius: '4px 4px 0px 0px' }}
                                    title="1. INFORMACIÓN GENERAL DE LA EMPRESA"
                                >
                                    <Grid container alignItems="center">
                                        {commerce && <>
                                            <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Empresa/Negocio"
                                                    type="text"
                                                    fullWidth
                                                    name="name"
                                                    value={commerce?.name}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="NIT"
                                                    type="text"
                                                    fullWidth
                                                    name="nit"
                                                    value={commerce?.nit}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Teléfono"
                                                    type="text"
                                                    fullWidth
                                                    name="phone"
                                                    value={commerce?.phone}
                                                    disabled
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Dirección"
                                                    type="text"
                                                    fullWidth
                                                    name="nit"
                                                    value={commerce?.adress}
                                                    disabled
                                                />
                                            </Grid>
                                        </>
                                        }
                                        {report && <>
                                            {report?.elaborated && <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Elaboró"
                                                    type="text"
                                                    fullWidth
                                                    name="elaborated"
                                                    value={report?.elaborated}
                                                    disabled
                                                />
                                            </Grid>}
                                            {report?.email_elaborated && <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Correo Elaboró"
                                                    type="text"
                                                    fullWidth
                                                    name="email_elaborated"
                                                    value={report?.email_elaborated}
                                                    disabled
                                                />
                                            </Grid>}
                                            {report?.phone_elaborated && <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Teléfono Elaboró"
                                                    type="text"
                                                    fullWidth
                                                    name="phone_elaborated"
                                                    value={report?.phone_elaborated}
                                                    disabled
                                                />
                                            </Grid>}
                                            {report?.passed && <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Aprobó"
                                                    type="text"
                                                    fullWidth
                                                    name="passed"
                                                    value={report?.passed}
                                                    disabled
                                                />
                                            </Grid>}
                                            {report?.email_passed && <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Correo Aprobó"
                                                    type="text"
                                                    fullWidth
                                                    name="email_passed"
                                                    value={report?.email_passed}
                                                    disabled
                                                />
                                            </Grid>}
                                            {report?.phone_passed && <Grid item xs={12} md={4} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                <TextField
                                                    label="Teléfono Aprobó"
                                                    type="text"
                                                    fullWidth
                                                    name="phone_passed"
                                                    value={report?.phone_passed}
                                                    disabled
                                                />
                                            </Grid>}
                                        </>
                                        }

                                    </Grid>
                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="2. INFORMACIÓN COLABORADORES DE LA EMPRESA"
                                >
                                    <Grid container>
                                        {
                                            collaborators?.collaborators.map((cl) => {
                                                return (
                                                    <Grid container key={cl.index}>

                                                        <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label={cl?.lastname}
                                                                type="text"
                                                                fullWidth
                                                                name="name"
                                                                value={`${cl?.name}`}
                                                                disabled
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={2} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label={cl?.identification_type}
                                                                type="text"
                                                                fullWidth
                                                                name="identification"
                                                                value={cl?.identification}
                                                                disabled
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={2} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label="Correo Electrónico"
                                                                type="text"
                                                                fullWidth
                                                                name="email"
                                                                value={cl?.email}
                                                                disabled
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={2} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label="Teléfono"
                                                                type="text"
                                                                fullWidth
                                                                name="phone"
                                                                value={cl?.phone}
                                                                disabled
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5, display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                                                            <Tooltip title={
                                                                <Grid container sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                    <Grid item>{cl?.name} {cl?.lastname}</Grid>
                                                                    <Grid item>Teléfono: {cl?.phone}</Grid>
                                                                    <Grid item>Edad: {getAge(cl?.birth_date)} Años</Grid>
                                                                    <Grid item>{`${cl?.is_employee ? 'Es Contratado' : 'ES Subcontratado'}`}</Grid>
                                                                </Grid>
                                                            } placement="top">
                                                                <IconButton >
                                                                    <InfoIcon sx={{ color: palette.text.disabled }} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Ingreso este Mes" placement="top">
                                                                <IconButton onClick={() => handleAddStatus(cl, EmployeeState.NUEVOINGRESO)}>
                                                                    <AddCircleIcon
                                                                        sx={{
                                                                            color: `${cl.state.find((el) => el.employee_state === EmployeeState.NUEVOINGRESO) ? palette.primary.main : palette.text.disabled}`,
                                                                            "&:hover": {
                                                                                // color: `${palette.text.primary}`,
                                                                                cursor: "pointer"
                                                                            }
                                                                        }}></AddCircleIcon>
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title="Retiro este Mes" placement="top">
                                                                <IconButton onClick={() => handleRemove(cl, cl.index)}>
                                                                    <RemoveCircleIcon
                                                                        sx={{
                                                                            color: `${cl.state.find((el) => el.employee_state === 'Retirado') ? palette.primary.main : palette.text.disabled}`,
                                                                            "&:hover": {
                                                                                // color: `${palette.text.primary}`,
                                                                                cursor: "pointer"
                                                                            }
                                                                        }}></RemoveCircleIcon>
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title={EmployeeState.EXAMENESMEDICOS} placement="top">
                                                                <IconButton onClick={() => handleAddStatus(cl, EmployeeState.EXAMENESMEDICOS)}>
                                                                    <HealingIcon
                                                                        sx={{
                                                                            color: `${cl.state.find((el) => el.employee_state === EmployeeState.EXAMENESMEDICOS) ? palette.primary.main : palette.text.disabled}`,
                                                                            "&:hover": {
                                                                                // color: `${palette.text.primary}`,
                                                                                cursor: "pointer"
                                                                            }
                                                                        }}></HealingIcon>
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip title={EmployeeState.WORKEVENT} placement="top">
                                                                <IconButton onClick={() => handleAddStatus(cl, EmployeeState.WORKEVENT)}>
                                                                    <SupportIcon
                                                                        sx={{
                                                                            color: `${cl.state.find((el) => el.employee_state === EmployeeState.WORKEVENT) ? palette.primary.main : palette.text.disabled}`,
                                                                            "&:hover": {
                                                                                // color: `${palette.text.primary}`,
                                                                                cursor: "pointer"
                                                                            }
                                                                        }}></SupportIcon>
                                                                </IconButton>
                                                            </Tooltip>


                                                        </Grid>
                                                    </Grid>
                                                )
                                            })

                                        }
                                    </Grid>

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="3. INDUCCIÓN Y PREPARACIÓN EMPLEADOS"
                                >   <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                                    <Grid container>
                                        {
                                            collaborators?.collaborators?.length &&
                                            collaborators?.collaborators?.filter((cll) => cll.state.find((el) => el.employee_state === EmployeeState.NUEVOINGRESO)).map((cl, index) => {
                                                return (
                                                    <Grid container key={cl.index}>
                                                        <Grid container
                                                        //sx={{ backgroundColor: ((index + 1) % 2) ? palette.secondary.support : '' }}
                                                        >
                                                            <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                                                                <Grid container>
                                                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                                                        <TextField
                                                                            variant="standard"
                                                                            size="small"
                                                                            label={cl?.lastname}
                                                                            type="text"
                                                                            fullWidth
                                                                            name="name"
                                                                            value={`${cl?.name} ${getAge(cl?.birth_date)}`}
                                                                            disabled
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                                                        <TextField
                                                                            variant="standard"
                                                                            size="small"
                                                                            label={cl?.identification_type}
                                                                            type="text"
                                                                            fullWidth
                                                                            name="identification"
                                                                            value={cl?.identification}
                                                                            disabled
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                                                        <TextField
                                                                            variant="standard"
                                                                            size="small"
                                                                            label="Empresa"
                                                                            type="text"
                                                                            fullWidth
                                                                            name="company"
                                                                            value={`${cl?.is_employee ? report?.commerce?.name : ''} `}
                                                                            disabled={cl?.is_employee ? true : false}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                                                                        <TextField
                                                                            variant="standard"
                                                                            size="small"
                                                                            label="Sede"
                                                                            type="text"
                                                                            fullWidth
                                                                            name="campus"
                                                                            value={cl?.campus || ''}
                                                                            onChange={(event) => changeInputCollaborator(event, cl.index)}
                                                                        />
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                                                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                                                            <DatePicker
                                                                                size="small"
                                                                                className='birth-date-piker'
                                                                                sx={{ width: '100%' }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                label="Fecha Inducción SST"
                                                                                name="sst_date"
                                                                                value={cl?.sst_date}
                                                                                onChange={(value) => changeInputCollaboratorValue({ name: 'sst_date', value, date: true }, cl.index)}
                                                                                renderInput={(params) => <TextField size="small" {...params} />}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                                                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                                                            <DatePicker
                                                                                size="small"
                                                                                className='birth-date-piker'
                                                                                sx={{ width: '100%' }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                label="Fecha Inducción al Cargo"
                                                                                name="induction_date"
                                                                                value={cl?.induction_date}
                                                                                onChange={(value) => changeInputCollaboratorValue({ name: 'induction_date', value, date: true }, cl.index)}
                                                                                renderInput={(params) => <TextField size="small" {...params} />}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
                                                                        <LocalizationProvider adapterLocale={es} dateAdapter={AdapterDayjs}>
                                                                            <DatePicker
                                                                                size="small"
                                                                                className='birth-date-piker'
                                                                                sx={{ width: '100%' }}
                                                                                inputFormat="DD/MM/YYYY"
                                                                                label="Fecha Emtrega Elementos"
                                                                                name="delivery_date"
                                                                                value={cl?.delivery_date}
                                                                                onChange={(value) => changeInputCollaboratorValue({ name: 'delivery_date', value, date: true }, cl.index)}
                                                                                renderInput={(params) => <TextField size="small" {...params} />}
                                                                            />
                                                                        </LocalizationProvider>
                                                                    </Grid>

                                                                    <Grid item xs={12} md={3} >
                                                                        <Button
                                                                            size="medium"
                                                                            fullWidth
                                                                            sx={{
                                                                                color: `${palette.text.primary}`,
                                                                                // border: '1px solid',
                                                                                // borderColor: `${palette.text.disabled}`
                                                                            }}
                                                                            onClick={() => handleEvidenceOpen(cl, EmployeeState.NUEVOINGRESO, ReportSection.NUEVOINGRESO)}
                                                                            variant="contained">Evidencias
                                                                        </Button>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>

                                                            <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                                                <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5, display: 'flex', alignItems: 'end', justifyContent: 'center' }}>
                                                                    <Tooltip title="Eliminar Entrada" placement="top">
                                                                        <IconButton onClick={() => handleDeleteIncomeMonth(cl, cl.index)}>
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


                                                                    <Tooltip title="Guardar Archivo" placement="top">
                                                                        <span>
                                                                            <IconButton
                                                                                disabled={validatorSaveEmployeeInsetDisabled(cl)}
                                                                            //onClick={(event) => handleUpdate(event)}
                                                                            >
                                                                                <SaveIcon
                                                                                    sx={{ color: !validatorSaveEmployeeInsetDisabled(cl) ? palette.primary.main : '' }}
                                                                                ></SaveIcon>
                                                                            </IconButton>
                                                                        </span>
                                                                    </Tooltip>

                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />

                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="4. OTRAS ACTIVIDADES EJECUTADAS EN EL MES"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="5.2 EXÁMENES MEDICO OCUPACIONAL"
                                >
                                    <Grid container>
                                        {
                                            collaborators?.collaborators?.length &&
                                            collaborators?.collaborators?.filter((cll) => cll.state.find((el) => el.employee_state === EmployeeState.EXAMENESMEDICOS)).map((cl) => {
                                                return (
                                                    <Grid container key={cl.index}>
                                                        <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <Grid container>
                                                                <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                                    <TextField
                                                                        variant="standard"
                                                                        size="small"
                                                                        label={cl?.lastname}
                                                                        type="text"
                                                                        fullWidth
                                                                        name="name"
                                                                        value={`${cl?.name} ${getAge(cl?.birth_date)}`}
                                                                        disabled
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                                    <TextField
                                                                        variant="standard"
                                                                        size="small"
                                                                        label={cl?.identification_type}
                                                                        type="text"
                                                                        fullWidth
                                                                        name="identification"
                                                                        value={cl?.identification}
                                                                        disabled
                                                                    />
                                                                </Grid>

                                                                <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                                    <FormControl fullWidth className='FormControlExamType' sx={{ marginTop: '0px' }}>
                                                                        <InputLabel
                                                                            variant="standard"
                                                                            id="demo-simple-select-label"
                                                                            sx={{
                                                                                color: `${palette.text.primary}`
                                                                            }}
                                                                        >Tipo Examen</InputLabel>
                                                                        <Select
                                                                            variant="standard"
                                                                            labelId="demo-simple-select-label"
                                                                            id="demo-simple-select"
                                                                            name="exam_type"
                                                                            value={cl?.exam_type || ''}
                                                                            label="Proyecto"
                                                                            onChange={(event) => changeInputCollaborator(event, cl.index)}>
                                                                            <MenuItem value=''><em></em></MenuItem>
                                                                            {
                                                                                examTypeArray &&
                                                                                examTypeArray.length &&
                                                                                examTypeArray.map((el, index) => (
                                                                                    <MenuItem key={index} value={el.value}>{el.value}</MenuItem>
                                                                                ))
                                                                            }
                                                                        </Select>
                                                                    </FormControl>
                                                                </Grid>

                                                                <Grid item xs={12} md={3} sx={{
                                                                    display: 'flex',
                                                                    justifyContent: 'center',
                                                                    alignSelf: 'center'
                                                                }} >
                                                                    <Button
                                                                        size="medium"
                                                                        fullWidth
                                                                        sx={{
                                                                            color: `${palette.text.primary}`,
                                                                            // border: '1px solid',
                                                                            // borderColor: `${palette.text.disabled}`
                                                                        }}
                                                                        onClick={() => handleEvidenceOpen(cl, EmployeeState.EXAMENESMEDICOS, ReportSection.EXAMENESMEDICOS)}
                                                                        variant="contained">Evidencias
                                                                    </Button>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>

                                                        <Grid item xs={12} md={3} sx={{ mb: 1, pr: 0.5, pl: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
                                                           
                                                            <Tooltip
                                                                // open={true}
                                                                placement="top"
                                                                disableFocusListener
                                                                title={
                                                                    <Grid className='tooltip-menu-transparent' container sx={{ display: 'flex', flexDirection: 'column' }}>
                                                                        <Paper>
                                                                            <MenuItem>Tipo</MenuItem>
                                                                            <MenuItem
                                                                                // onClick={handleClose}
                                                                                sx={{paddingTop:'0px', paddingBottom:'0px'}}
                                                                            >
                                                                                <Grid item xs={12} md={4}>
                                                                                    <FormControlLabel
                                                                                        sx={{ color: `${cl?.interval_test?.income ? palette.text.secondary : palette.text.primary}` }}
                                                                                        control={<Switch checked={cl?.interval_test?.income ?? false} onChange={() =>
                                                                                            changeInputCollaborator({
                                                                                                target: {
                                                                                                    name: 'interval_test',
                                                                                                    value: { income: true, periodical: false, retirement: false }
                                                                                                }
                                                                                            }, cl.index)}
                                                                                            name="interval_test_income" />
                                                                                        }
                                                                                        label={`Ingreso`}
                                                                                    />
                                                                                </Grid>
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                // onClick={handleClose}
                                                                                sx={{paddingTop:'0px', paddingBottom:'0px'}}
                                                                            >
                                                                                <Grid item xs={12} md={4}>
                                                                                    <FormControlLabel
                                                                                        sx={{ color: `${cl?.interval_test?.periodical ? palette.text.secondary : palette.text.primary}` }}
                                                                                        control={<Switch checked={cl?.interval_test?.periodical ?? false} onChange={() =>
                                                                                            changeInputCollaborator({
                                                                                                target: {
                                                                                                    name: 'interval_test',
                                                                                                    value: { income: false, periodical: true, retirement: false }
                                                                                                }
                                                                                            }, cl.index)}
                                                                                            name="interval_test_periodical" />}
                                                                                        label={`Periodico`}
                                                                                    />
                                                                                </Grid>
                                                                            </MenuItem>
                                                                            <MenuItem
                                                                                // onClick={handleClose}
                                                                                sx={{paddingTop:'0px', paddingBottom:'0px'}}
                                                                            >
                                                                                <Grid item xs={12} md={4}>
                                                                                    <FormControlLabel
                                                                                        sx={{ color: `${cl?.interval_test?.retirement ? palette.text.secondary : palette.text.primary}` }}
                                                                                        control={<Switch checked={cl?.interval_test?.retirement ?? false} onChange={() =>
                                                                                            changeInputCollaborator({
                                                                                                target: {
                                                                                                    name: 'interval_test',
                                                                                                    value: { income: false, periodical: false, retirement: true }
                                                                                                }
                                                                                            }, cl.index)}
                                                                                            name="interval_test_retirement" />}
                                                                                        label={`Retiro`}
                                                                                    />
                                                                                </Grid>
                                                                            </MenuItem>

                                                                        </Paper>

                                                                    </Grid>
                                                                }
                                                            >
                                                                <AddCircleOutlineIcon >
                                                                    <InfoIcon sx={{ color: palette.text.disabled }} />
                                                                </AddCircleOutlineIcon>
                                                            </Tooltip>
                                                        </Grid>

                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>
                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="5. VIGILANCIA EN SALUD DE LOS TRABAJADORES"
                                >
                                    <Grid container>
                                        {
                                            collaborators?.collaborators?.length &&
                                            collaborators?.collaborators?.filter((cll) => cll.state.find((el) => el.employee_state === EmployeeState.WORKEVENT)).map((cl) => {
                                                return (
                                                    <Grid container key={cl.index}>
                                                        <Grid item xs={12} md={2} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label={cl?.lastname}
                                                                type="text"
                                                                fullWidth
                                                                name="name"
                                                                value={`${cl?.name} ${getAge(cl?.birth_date)}`}
                                                                disabled
                                                            />
                                                        </Grid>

                                                        <Grid item xs={12} md={2} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                                                            <TextField
                                                                variant="standard"
                                                                size="small"
                                                                label={cl?.identification_type}
                                                                type="text"
                                                                fullWidth
                                                                name="identification"
                                                                value={cl?.identification}
                                                                disabled
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                )
                                            })
                                        }
                                    </Grid>

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="6. CAPACITACION Y ENTRENAMIENTO SST"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="HORAS HOMBRE CAPACITACIÓN"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="7. CUMPLIMIENTO DE CRONOGRAMA"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="8. COMPROMISOS DE ASISTIR EN SALUD Y RIESGOS LABORALES"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="9. COMPROMISOS DEL RESPONSABLE DEL SST, CADA MES"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="10.TAREAS Y COMPROMISOS COMPROMISOS DEL RESPONSABLE DEL SST"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="11. INSPECCIONES REALIZADAS POR EL RESPONSABLE DEL SST"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="11.1 SEGUIMIENTE A MEDIDAS CORRECTIVAS PROPUESTAS POR EL RESPONSABLE DEL SST DE LA EMPRESA"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="12. ACTIVIDADES GRUPOS DE APOYO"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="15. GESTIÓN DE TRABAJOS DE ALTO RIESGO"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="16. MANTENIMIENTO PERIODICO A LAS INSTALACIONES, EQUIPOS Y HERRAMIENTAS"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="17. REGISTRO FOTOGRAFICO"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px 0px 4px 4px' }}
                                    title="18. ANEXOS "
                                >

                                </ReportCardComponent>
                            </>
                        }
                    </Grid>
                </Grid>
            </Grid>
            <Grid container sx={{ justifyContent: 'end' }}>
                {
                    commerce &&
                    <>
                        <Grid item xs={12} md={2} sx={{ ml: 1, mr: 1 }}>
                            <Button
                                fullWidth
                                sx={{
                                    // color: `${palette.text.primary}`,
                                    border: '1px solid'
                                }}
                                // onClick={onSubmit}
                                // disabled={!isFormValid || !formChange}
                                variant="outlined">Regresar</Button>
                        </Grid>
                        <Grid item xs={12} md={2} >
                            <Button
                                fullWidth
                                sx={{
                                    // color: `${palette.text.primary}`,
                                    // border: '1px solid'
                                }}
                                // onClick={onClearForm}
                                variant="contained">Guardar
                            </Button>
                        </Grid>
                    </>
                }
            </Grid>
            {
                openNewInEvidences.open &&
                <EvidencesComponent
                    open={openNewInEvidences.open}
                    dialogtitle={openNewInEvidences.dialogtitle}
                    dialogcontenttext={openNewInEvidences.dialogcontenttext}
                    collaborator={selectCollaborator}
                    employee_report={openNewInEvidences.employee_report}
                    setSelectCollaborator={setSelectCollaborator}
                    collaboratorsChangeInput={collaboratorsChangeInput}
                    handleClose={handleEvidenceClose}
                ></EvidencesComponent>
            }
            {
                handleAlert.openAlert && <DialogAlertComponent
                    open={handleAlert.openAlert}
                    handleClose={() => handleAlert.functionAlertClose()}
                    handleAgree={() => handleAlert.functionAlertAgree()}
                    props={{
                        tittle: handleAlert.alertTittle,
                        message: handleAlert.alertMessage
                    }}
                ></DialogAlertComponent>
            }
        </Grid >
    )
}
