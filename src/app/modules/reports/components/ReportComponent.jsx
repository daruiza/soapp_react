import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useSearchParams } from 'react-router-dom';
import { reportByreportId } from '../../../../store';
import { useTheme } from '@emotion/react';
import { Grid, IconButton, ImageListItem, Typography, Fab, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { ReportCardComponent } from './ReportCardComponent';
import dayjs from 'dayjs';

import CloseIcon from '@mui/icons-material/Close';

export const ReportComponent = ({ navBarWidth = 58 }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const { commerce_id: param_commerce_id } = useParams();
    const { report_id: param_report_id } = useParams();
    const [searchParams] = useSearchParams();

    const { commerce: commerceState } = useSelector(state => state.commerce);
    const commerce = useMemo(() => commerceState, [commerceState]);

    const [report, setReport] = useState(null);


    // reportByreportId
    const getReportById = (id) => {
        dispatch(reportByreportId({
            form: {
                id: id ?? ''
            }
        })).then(({ data: { data: { report } } }) => {
            setReport(report);
            console.log('report', report)
        });
    }

    const asistirEnSaludBran = `${window.location.origin}/src/assets/asistirEnSaludBran.png`;

    useEffect(() => {
        if (param_report_id && !report) {
            getReportById(param_report_id)
        }
        console.log('commerce_id', param_commerce_id);
        console.log('report_id', param_report_id);
        console.log('searchParams', searchParams.get('option'));
        console.log('commerce', commerce);
    }, [commerce]);

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
                    <Grid item xs={12} md={12} mb={2} display={'flex'}>

                        <Grid item xs={6} md={2} mb={2}>
                            <ImageListItem>
                                <img
                                    src={asistirEnSaludBran}
                                    alt="asistirEnSaludBran"
                                    loading="lazy" />
                            </ImageListItem>
                        </Grid>

                        <Grid item xs={6} md={8} mb={2} >
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

                        <Grid item xs={6} md={2} mb={2} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Grid container>
                                <Grid item xs={12} md={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Grid item xs={12} md={6} >
                                        <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid', borderLeft: '1px solid' }}>
                                            Elaboró
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} md={6} >
                                        <Typography sx={{ textAlign: 'center', borderTop: '1px solid', borderRight: '1px solid' }}>
                                            {report?.project}
                                        </Typography>
                                    </Grid>
                                </Grid>

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

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="2. INFORMACIÓN COLABORADORES DE LA EMPRESA"
                                >

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="3. INDUCCIÓN Y PREPARACIÓN EMPLEADOS"
                                >

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

                                </ReportCardComponent>

                                <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="5. VIGILANCIA EN SALUD DE LOS TRABAJADORES"
                                >

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
                <Grid item xs={12} md={2} sx={{ ml: 1, mr: 1 }}>
                    <Button
                        fullWidth
                        sx={{
                            height: '100%',
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
                            height: '100%',
                            // color: `${palette.text.primary}`,
                            // border: '1px solid'
                        }}
                        // onClick={onClearForm}
                        variant="contained">Guardar
                    </Button>
                </Grid>
            </Grid>

        </Grid >
    )
}
