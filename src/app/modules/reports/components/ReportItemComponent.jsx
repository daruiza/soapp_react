import { useEffect, useState } from 'react';
import { Grid, Card, CardContent, CardHeader, capitalize, IconButton, Box, CircularProgress, Typography, CardActions, Tooltip } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import InfoIcon from '@mui/icons-material/Info';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { yellow } from '@mui/material/colors';
import dayjs from 'dayjs';

export const ReportItemComponent = ({ report, monthArray }) => {

    const [focusToggle, setFocusToggle] = useState(false);
    const [year, setYear] = useState({});
    const [month, setMonth] = useState({});

    // EVENTOS
    const toggleFocus = () => setFocusToggle((focus) => !focus);

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
                    {
                        report.description &&
                        <CardContent>
                            <Box>

                            </Box>
                        </CardContent>
                    }
                    <CardActions disableSpacing sx={{ justifyContent: 'space-between' }}>
                        <Box>
                            <IconButton aria-label="share">
                                <ShareIcon />
                            </IconButton>
                            <IconButton aria-label="share">
                                <InfoIcon />
                            </IconButton>
                            <IconButton aria-label="share">
                                <EditIcon />
                            </IconButton>
                            <IconButton aria-label="share">
                                <DeleteIcon />
                            </IconButton>
                        </Box>

                        <Box>
                            <IconButton aria-label="share" onClick={toggleFocus} >
                                {focusToggle && <StarIcon sx={{ color: `${yellow[700]}` }} />}
                                {!focusToggle && <StarBorderIcon />}
                            </IconButton>
                        </Box>

                    </CardActions>
                </Card>
            }
        </Grid>
    )
}
