import { Divider, Grid } from "@mui/material";
import { useEffect } from "react";

export const ReportSupportGroupActivityComponent = ({
    report_id = null,
    commerce_id = null,
    supports = [],
    setsupports = () => { },
    supportGroupActionQuery = [],
    getCorrectiveMotiroringByReportIdReport = () => { } }) => {

    // Lista generica : support_group



    return (
        <Grid container> {
            supports?.length !== 0 &&
            supports?.map((cmms, index) => {
                return (
                    <Grid container key={index} >
                        <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                        <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
                            <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>

                            </Grid>
                            <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>

                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}