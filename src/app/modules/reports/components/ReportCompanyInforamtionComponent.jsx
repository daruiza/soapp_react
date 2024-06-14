import {
    Grid,
    TextField
} from '@mui/material';


export const ReportCompanyInforamtionComponent = ({
    report={},
    commerce={},
})=>{
    return (
        <Grid container alignItems="center">
        {commerce && (
            <>
            <Grid
                item
                xs={12}
                md={3}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
            >
                <TextField
                label="Empresa/Negocio"
                type="text"
                fullWidth
                name="name"
                value={commerce?.name}
                disabled
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={3}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
            >
                <TextField
                label="NIT"
                type="text"
                fullWidth
                name="nit"
                value={commerce?.nit}
                disabled
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={3}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
            >
                <TextField
                label="Teléfono"
                type="text"
                fullWidth
                name="phone"
                value={commerce?.phone}
                disabled
                />
            </Grid>
            <Grid
                item
                xs={12}
                md={3}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
            >
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
        )}
        {report && (
            <>
            {report?.elaborated && (
                <Grid
                item
                xs={12}
                md={4}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                >
                <TextField
                    label="Elaboró"
                    type="text"
                    fullWidth
                    name="elaborated"
                    value={report?.elaborated}
                    disabled
                />
                </Grid>
            )}
            {report?.email_elaborated && (
                <Grid
                item
                xs={12}
                md={4}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                >
                <TextField
                    label="Correo Elaboró"
                    type="text"
                    fullWidth
                    name="email_elaborated"
                    value={report?.email_elaborated}
                    disabled
                />
                </Grid>
            )}
            {report?.phone_elaborated && (
                <Grid
                item
                xs={12}
                md={4}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                >
                <TextField
                    label="Teléfono Elaboró"
                    type="text"
                    fullWidth
                    name="phone_elaborated"
                    value={report?.phone_elaborated}
                    disabled
                />
                </Grid>
            )}
            {report?.passed && (
                <Grid
                item
                xs={12}
                md={4}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                >
                <TextField
                    label="Aprobó"
                    type="text"
                    fullWidth
                    name="passed"
                    value={report?.passed}
                    disabled
                />
                </Grid>
            )}
            {report?.email_passed && (
                <Grid
                item
                xs={12}
                md={4}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                >
                <TextField
                    label="Correo Aprobó"
                    type="text"
                    fullWidth
                    name="email_passed"
                    value={report?.email_passed}
                    disabled
                />
                </Grid>
            )}
            {report?.phone_passed && (
                <Grid
                item
                xs={12}
                md={4}
                sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                >
                <TextField
                    label="Teléfono Aprobó"
                    type="text"
                    fullWidth
                    name="phone_passed"
                    value={report?.phone_passed}
                    disabled
                />
                </Grid>
            )}
            </>
        )}
        </Grid>
    )
}