import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { DialogAlertComponent } from '../../../components';
import { Grid, Card, CardContent, CardHeader, capitalize, IconButton, Box, CircularProgress, Typography, CardActions, Tooltip, Collapse } from '@mui/material';
import { reportDelete, reportUpdate } from '../../../../store';
import dayjs from 'dayjs';
import ShareIcon from '@mui/icons-material/Share';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import { styled } from '@mui/material/styles';

import { grey, yellow } from '@mui/material/colors';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { PrivateCustomerRoute, PrivateAgentRoute } from '../../../middleware';

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

export const ReportItemComponent = ({ report, monthArray, getReports, handleReportUpdate }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [year, setYear] = useState({});
    const [month, setMonth] = useState({});

    const [openReportDelete, setOpenDeleteReport] = useState(false);

    const [expanded, setExpanded] = useState(false);
    const [focusToggle, setFocusToggle] = useState(false);
    const [lockToggle, setLockToggle] = useState(false);

    // EVENTOS
    const toggleFocus = (report) => {
        setFocusToggle((focus) => !focus);

        // Actualizar report
        dispatch(reportUpdate({
            form: {
                ...report,
                focus: report.focus === 1 ? 0 : 1
            }
        })).then((response) => {
            getReports();// Refrescamos la tabla
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const toggleLock = (report) => {
        setLockToggle((active) => !active);
        // Actualizar report
        dispatch(reportUpdate({
            form: {
                ...report,
                active: report.active === 1 ? 0 : 1
            }
        })).then((response) => {
            getReports();// Refrescamos la tabla
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleReportDelete = () => {
        // Eliminar report        
        dispatch(reportDelete({
            form: {
                ...report
            }
        })).then((response) => {
            getReports();// Refrescamos la tabla
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const navegateReport = () => {
        navigate(`report/${report.id}?option=${report.active ? 'write' : 'read'}`);
    }

    const navegateCustomerReport = () => {
        navigate(`/reports/report/${report.id}?option=${report.active ? 'write' : 'read'}`);
    }

    const handleReportDeleteOpen = () => {
        setOpenDeleteReport(true);
    }

    const handleReportDeleteClose = () => {
        setOpenDeleteReport(false);
    }

    const handleExpandClick = () => { setExpanded(!expanded) };

    const handleSharedClick = () => { navigator.clipboard.writeText(`${window.location.host}/report/${report.id}`) }

    useEffect(() => {
        setYear(+dayjs(report.date).format('YYYY'));
        setMonth(monthArray.find((el) => el.index === +dayjs(report.date).format('M')));
        setFocusToggle(report.focus ? true : false);
        setLockToggle(report.active ? true : false);
    }, [report]);

    return (
        <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
            {
                month?.value &&
                <Card sx={{ background: !report?.active ? `${grey[300]}` : `` }}>
                    <CardHeader
                        avatar={
                            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress variant="determinate" value={report.progress} />
                                <Box
                                    sx={{
                                        top: 0,
                                        left: 0,
                                        bottom: 0,
                                        right: 0,
                                        position: 'absolute',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="caption" component="div" color="text.secondary">
                                        {`${report.progress}%`}
                                    </Typography>
                                </Box>
                            </Box>
                        }
                        action={
                            <>
                                <PrivateCustomerRoute>
                                    <IconButton onClick={() => navegateCustomerReport()} aria-label="settings">
                                        {
                                            report.active === 1 ?
                                                <ContentPasteIcon /> :
                                                <ContentPasteSearchIcon />
                                        }
                                    </IconButton>
                                </PrivateCustomerRoute>

                                <PrivateAgentRoute>
                                    <IconButton onClick={() => navegateReport()} aria-label="settings">
                                        {
                                            report.active === 1 ?
                                                <ContentPasteIcon /> :
                                                <ContentPasteSearchIcon />
                                        }
                                    </IconButton>
                                </PrivateAgentRoute>
                            </>
                        }
                        title={`${month.value}, ${year}`}
                        subheader={`Agente ${capitalize(report.responsible)}`}

                    />
                    {/* <CardContent></CardContent> */}
                    <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                        < Box >
                            <IconButton onClick={handleSharedClick} aria-label="share">
                                <ShareIcon />
                            </IconButton>
                            <Tooltip title={report.project} placement="top">
                                <IconButton aria-label="share">
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                            {
                                report.active === 1 &&
                                <>
                                    <Tooltip title="Editar" placement="top">
                                        <IconButton onClick={handleReportUpdate} aria-label="share">
                                            <EditIcon />
                                        </IconButton>
                                    </Tooltip>

                                    <PrivateAgentRoute>
                                        <Tooltip title="Eliminar" placement="top">
                                            <IconButton onClick={handleReportDeleteOpen} aria-label="share">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </PrivateAgentRoute>

                                </>
                            }

                            {
                                report.description &&
                                <ExpandMore
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="descripción"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            }
                        </Box>
                        <Box>

                            <PrivateCustomerRoute>
                                <IconButton aria-label="share">
                                    {lockToggle && <LockOpenIcon />}
                                    {!lockToggle && <LockIcon />}
                                </IconButton>

                                <IconButton aria-label="share"  >
                                    {focusToggle && <StarIcon sx={{ color: `${yellow[700]}` }} />}
                                    {!focusToggle && <StarBorderIcon />}
                                </IconButton>
                            </PrivateCustomerRoute>

                            <PrivateAgentRoute>
                                <IconButton onClick={(e) => toggleLock(report)} aria-label="share">
                                    {lockToggle && <LockOpenIcon />}
                                    {!lockToggle && <LockIcon />}
                                </IconButton>

                                {
                                    report.active === 1 &&
                                    <IconButton aria-label="share" onClick={(e) => toggleFocus(report)} >
                                        {focusToggle && <StarIcon sx={{ color: `${yellow[700]}` }} />}
                                        {!focusToggle && <StarBorderIcon />}
                                    </IconButton>
                                }

                                {
                                    report.active === 0 &&
                                    <>
                                        {focusToggle && <StarIcon sx={{ color: `${yellow[700]}` }} />}
                                        {!focusToggle && <StarBorderIcon />}
                                    </>

                                }
                            </PrivateAgentRoute>

                        </Box>

                    </CardActions>
                    {
                        report.description &&
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <CardContent>
                                <Typography paragraph>Descripción:</Typography>
                                <Typography paragraph>
                                    {report.description}
                                </Typography>
                            </CardContent>
                        </Collapse>
                    }

                </Card>
            }
            {
                openReportDelete && <DialogAlertComponent
                    open={openReportDelete}
                    handleClose={handleReportDeleteClose}
                    handleAgree={handleReportDelete}
                    props={{
                        tittle: 'Eliminar Reporte',
                        message: `Estas segur@ de eliminar el reporte de ${month?.value ?? ''} de ${year ?? ''}`
                    }}
                ></DialogAlertComponent>
            }
        </Grid >
    )
}
