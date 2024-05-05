    import {
    Grid,
    ImageListItem,
    Typography
} from '@mui/material';

import dayjs from "dayjs";

export const ReportHeadInformation =({
    report={}
})=>{

    const asistirEnSaludBran = `${window.location.origin}/src/assets/asistirEnSaludBran.png`;

    return (
        <>
        <Grid
            item
            xs={12}
            md={12}
            mb={2}
            sx={{ marginBottom: "0px" }}
            display={"flex"}>
            <Grid
              item
              xs={6}
              md={2}
              mb={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <ImageListItem>
                <img
                  src={asistirEnSaludBran}
                  alt="asistirEnSaludBran"
                  loading="lazy"
                />
              </ImageListItem>
            </Grid>

            <Grid
              item
              xs={6}
              md={7}
              mb={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Grid
                container
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography>ACTAS DE CONSULTORIA</Typography>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography sx={{ fontSize: "14px" }}>
                    ÁREA: SEGURIDAD Y SALUD EN EL TRABAJO
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={6}
              md={3}
              mb={2}
              sx={{ display: "flex", alignItems: "center" }}
            >
              <Grid container>
                {report?.project && (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          borderTop: "1px solid",
                          borderRight: "1px solid",
                          borderLeft: "1px solid",
                        }}
                      >
                        Proyecto
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          borderTop: "1px solid",
                          borderRight: "1px solid",
                        }}
                      >
                        {report?.project}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {report?.elaborated && (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          borderTop: "1px solid",
                          borderRight: "1px solid",
                          borderLeft: "1px solid",
                        }}
                      >
                        Elaboró
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          borderTop: "1px solid",
                          borderRight: "1px solid",
                        }}
                      >
                        {report?.elaborated}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                {report?.passed && (
                  <Grid
                    item
                    xs={12}
                    md={12}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          borderTop: "1px solid",
                          borderRight: "1px solid",
                          borderLeft: "1px solid",
                        }}
                      >
                        Aprobó
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography
                        sx={{
                          textAlign: "center",
                          borderTop: "1px solid",
                          borderRight: "1px solid",
                        }}
                      >
                        {report?.passed}
                      </Typography>
                    </Grid>
                  </Grid>
                )}

                <Grid
                  item
                  xs={12}
                  md={12}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Grid item xs={12} md={6}>
                    <Typography
                      sx={{ textAlign: "center", border: "1px solid" }}
                    >
                      Fecha
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography
                      sx={{
                        textAlign: "center",
                        borderTop: "1px solid",
                        borderRight: "1px solid",
                        borderBottom: "1px solid",
                      }}
                    >
                      {dayjs(report?.date).format("DD-MM-YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={12} mb={2}>
            <Typography sx={{ fontSize: "13px", textAlign: "center" }}>
              Este formulario debe ser diligenciado semanalmente por la persona
              responsable del sistema de gestion sst de la empresa, resume las
              principales actividades e indicadores que deben ser reportados
              mensualmente a la Gerencia de la empresa " cliente"y la consultora
              ASISTIR EN SALUD Y RIESGOS LABORALES, Los datos reportados deben
              tener un soporte escrito y se presentaran anexos a este informe.
              Nota: en caso de tener contratados Sub_contratistas debe incluir
              información de cada contratista.
            </Typography>
          </Grid>

        </>
    )
}