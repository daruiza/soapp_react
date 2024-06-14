import {
    Button,
    Grid,
    IconButton,
    Tooltip
} from '@mui/material';
import { ReportEmployeeComponent } from './ReportEmployeeComponent';

import { EmployeeState } from '../../../types/EmployeeState';
import { useTheme } from "@emotion/react";

import InfoIcon from "@mui/icons-material/Info";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HealingIcon from "@mui/icons-material/Healing";
import { useState } from 'react';

export const ReportEmployeeInformationComponent = ({
    collaborators = [],
    handleAddStatus = () => { }
}) => {

    const { palette } = useTheme();
    // openModalNewColaborador
    const [openModalNewColaborador, setOpenModalNewColaborador ]= useState(false);

    // Coportamiento
    const getAge = (birth_date) => {
        if (birth_date) {
            const birthDate = new Date(birth_date);
            const difference = Date.now() - birthDate.getTime();
            const age = new Date(difference);
            return `${Math.abs(age.getUTCFullYear() - 1970)}`;
        }
    };

    return (
        <Grid container>
            {collaborators?.collaborators.map((cl) => {
                return (
                    <Grid container key={cl.index}>
                        <Grid
                            item
                            xs={12}
                            md={9}
                            sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}
                        >
                            <ReportEmployeeComponent
                                collaborator={cl}
                                fieldset={{
                                    name: { show: true, md: 3, age: true },
                                    identification: {
                                        show: true,
                                        md: 3,
                                        age: true,
                                    },
                                    email: { show: true, md: 3, age: true },
                                    phone: { show: true, md: 3, age: true },
                                }}
                            ></ReportEmployeeComponent>
                        </Grid>

                        <Grid
                            item
                            xs={12}
                            md={3}
                            sx={{
                                mb: 1,
                                pr: 0.5,
                                pl: 0.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "start",
                            }}
                        >
                            <Tooltip
                                title={
                                    <Grid
                                        container
                                        sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <Grid item>
                                            {cl?.name} {cl?.lastname}
                                        </Grid>
                                        <Grid item>Teléfono: {cl?.phone}</Grid>
                                        <Grid item>
                                            Edad: {getAge(cl?.birth_date)} Años
                                        </Grid>
                                        <Grid item>{`${cl?.is_employee
                                            ? "Es Contratado"
                                            : "ES Subcontratado"
                                            }`}</Grid>
                                    </Grid>
                                }
                                placement="top"
                            >
                                <IconButton>
                                    <InfoIcon
                                        sx={{ color: palette.text.disabled }}
                                    />
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Ingreso este Mes" placement="top">
                                <IconButton
                                    onClick={() => handleAddStatus(cl, EmployeeState.NUEVOINGRESO)}
                                >
                                    <AddCircleIcon
                                        sx={{
                                            color: `${cl.state.find(
                                                (el) =>
                                                    el.employee_state ===
                                                    EmployeeState.NUEVOINGRESO
                                            )
                                                ? palette.primary.main
                                                : palette.text.disabled
                                                }`,
                                            "&:hover": {
                                                // color: `${palette.text.primary}`,
                                                cursor: "pointer",
                                            },
                                        }}
                                    ></AddCircleIcon>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Retiro este Mes" placement="top">
                                <IconButton
                                    onClick={() =>
                                        handleAddStatus(cl, EmployeeState.RETIRED)
                                    }
                                >
                                    <RemoveCircleIcon
                                        sx={{
                                            color: `${cl.state.find(
                                                (el) =>
                                                    el.employee_state ===
                                                    EmployeeState.RETIRED
                                            )
                                                ? palette.primary.main
                                                : palette.text.disabled
                                                }`,
                                            "&:hover": {
                                                // color: `${palette.text.primary}`,
                                                cursor: "pointer",
                                            },
                                        }}
                                    ></RemoveCircleIcon>
                                </IconButton>
                            </Tooltip>

                            <Tooltip
                                title={EmployeeState.EXAMENESMEDICOS}
                                placement="top"
                            >
                                <IconButton
                                    onClick={() =>
                                        handleAddStatus(
                                            cl,
                                            EmployeeState.EXAMENESMEDICOS
                                        )
                                    }
                                >
                                    <HealthAndSafetyIcon
                                        sx={{
                                            color: `${cl.state.find(
                                                (el) =>
                                                    el.employee_state ===
                                                    EmployeeState.EXAMENESMEDICOS
                                            )
                                                ? palette.primary.main
                                                : palette.text.disabled
                                                }`,
                                            "&:hover": {
                                                // color: `${palette.text.primary}`,
                                                cursor: "pointer",
                                            },
                                        }}
                                    ></HealthAndSafetyIcon>
                                </IconButton>
                            </Tooltip>

                            <Tooltip
                                title={EmployeeState.WORKEVENT}
                                placement="top"
                            >
                                <IconButton
                                    onClick={() =>
                                        handleAddStatus(cl, EmployeeState.WORKEVENT)
                                    }
                                >
                                    <HealingIcon
                                        sx={{
                                            color: `${cl.state.find(
                                                (el) =>
                                                    el.employee_state ===
                                                    EmployeeState.WORKEVENT
                                            )
                                                ? palette.primary.main
                                                : palette.text.disabled
                                                }`,
                                            "&:hover": {
                                                // color: `${palette.text.primary}`,
                                                cursor: "pointer",
                                            },
                                        }}
                                    ></HealingIcon>
                                </IconButton>
                            </Tooltip>
                        </Grid>

                    </Grid>
                );
            })}
            <Grid container>
                <Grid item xs={12} md={9} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}></Grid>
                <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                    <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5 }}>
                        <Button onClick={() => setOpenModalNewColaborador(true)}
                            variant="contained"
                            // TODO
                            // Se sehabilita cuando ya no hay colaboradores
                            disabled={false}
                            sx={{
                                height: '100%',
                                color: `${palette.text.custom}`,
                                // border: '1px solid'
                            }}>AGREGAR COLABORADOR
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}