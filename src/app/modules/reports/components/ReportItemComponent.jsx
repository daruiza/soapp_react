import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardHeader, capitalize, IconButton, Box, CircularProgress, Typography, CardActions, Tooltip, Collapse } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/material/styles';

import { yellow } from '@mui/material/colors';
import dayjs from 'dayjs';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch } from 'react-redux';
import { reportDelete, reportUpdate } from '../../../../store';
import { DialogAlertComponent } from '../../../components';

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

    const [year, setYear] = useState({});
    const [month, setMonth] = useState({});

    const [openReportDelete, setOpenDeleteReport] = useState(false);

    const [expanded, setExpanded] = useState(false);
    const [focusToggle, setFocusToggle] = useState(false);

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
    }, [report]);

    return (
        <Grid item xs={12} md={3} sx={{ mb: 1, pl: 0.5, pr: 0.5 }} >
            {
                month?.value &&
                <Card sx={{}}>
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
                            <IconButton aria-label="settings">
                                <ContentPasteIcon />
                            </IconButton>
                        }
                        title={`${month.value}, ${year}`}
                        subheader={`Responsable ${capitalize(report.responsible)}`}

                    />
                    {/* <CardContent></CardContent> */}
                    <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                        <Box>
                            <IconButton onClick={handleSharedClick} aria-label="share">
                                <ShareIcon />
                            </IconButton>
                            <Tooltip title={report.project} placement="top">
                                <IconButton aria-label="share">
                                    <InfoIcon />
                                </IconButton>
                            </Tooltip>
                            <IconButton onClick={handleReportUpdate} aria-label="share">
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={handleReportDeleteOpen} aria-label="share">
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <Box>
                            {
                                report.description &&
                                <ExpandMore
                                    expand={expanded}
                                    onClick={handleExpandClick}
                                    aria-expanded={expanded}
                                    aria-label="show more"
                                >
                                    <ExpandMoreIcon />
                                </ExpandMore>
                            }


                            <IconButton aria-label="share" onClick={(e) => toggleFocus(report)} >
                                {focusToggle && <StarIcon sx={{ color: `${yellow[700]}` }} />}
                                {!focusToggle && <StarBorderIcon />}
                            </IconButton>
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
            {openReportDelete && <DialogAlertComponent
                open={openReportDelete}
                handleClose={handleReportDeleteClose}
                handleAgree={handleReportDelete}
                props={{
                    tittle: 'Eliminar Reporte',
                    message: `Estas segur@ de eliminar el reporte de ${month?.value ?? ''} de ${year ?? ''}`
                }}
            ></DialogAlertComponent>}
        </Grid>
    )
}
