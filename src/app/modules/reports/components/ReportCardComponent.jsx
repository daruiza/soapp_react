import { useState } from "react";
import { Box, Card, CardContent, CardHeader, CircularProgress, Collapse, IconButton, LinearProgress, Typography } from "@mui/material"
import { styled } from '@mui/material/styles';
import { useTheme } from "@emotion/react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

export const ReportCardComponent = ({ children, title, subheader, expandedDefault = false, sx, pending = 100 }) => {

    const { palette } = useTheme();

    const [expanded, setExpanded] = useState(expandedDefault);
    const handleExpandClick = () => { setExpanded(!expanded) };    
    return (
        <Card sx={sx} >
            <CardHeader
                sx={{
                    backgroundColor: `${pending < 100 ? palette.primary.pending : palette.primary.main}`,
                    padding: "6px",
                }}
                className="card-header-report"
                avatar={
                    pending < 100 ?
                        <>
                            {/* <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                <CircularProgress variant="determinate" value={pending} />
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
                                        {`${parseInt(pending)}%`}
                                    </Typography>
                                </Box>
                            </Box> */}
                        </> : <></>
                }
                action={
                    <ExpandMore
                        expand={expanded}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label=""
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                }
                title={<Typography sx={{ fontSize: "15px", }}>{title ?? ''}</Typography>}
                subheader={
                    pending < 100 ?
                        <Box sx={{ width: '100%' }}>
                            <LinearProgress variant="determinate" value={pending} />
                        </Box> : <></>
                }
            />
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                    {children}
                </CardContent>
            </Collapse>
        </Card>
    )
}
