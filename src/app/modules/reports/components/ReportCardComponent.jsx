import { useState } from "react";
import { Card, CardContent, CardHeader, Collapse, IconButton, Typography } from "@mui/material"
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

export const ReportCardComponent = ({ children, title, subheader, expandedDefault = true, sx }) => {

    const { palette } = useTheme();

    const [expanded, setExpanded] = useState(expandedDefault);
    const handleExpandClick = () => { setExpanded(!expanded) };   

    return (
        <Card sx={sx} >
            <CardHeader
                sx={{
                    backgroundColor: `${palette.primary.main}`,
                    padding: "6px",
                }}
                className="card-header-report"
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
                subheader={<Typography sx={{ color: `${palette.text.support}`, fontSize: "12px", }}>{subheader ?? ''}</Typography>
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
