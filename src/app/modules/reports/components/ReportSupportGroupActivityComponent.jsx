import { Grid } from "@mui/material"

export const ReportSupportGroupActivityComponent = ({
    report_id = null,
    commerce_id = null,
    supports = [],
    setsupports = () => { },
    supportGroupActionQuery = [],
    getCorrectiveMotiroringByReportIdReport = () => { } }) => {

    // Lista generica : support_group

    return (
        <Grid container>{
            supports?.length !== 0 &&
            supports?.map((cmms, index) => {
            return (
                <Grid container key={index} >

                </Grid>
            )})}
        </Grid>
    )
}