import {
Divider,
TextField,
Grid,
IconButton,
Tooltip
} from '@mui/material';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ReportEmployeeComponent } from './ReportEmployeeComponent';

import { EmployeeState } from '../../../types/EmployeeState';
import { ReportSection } from '../../../types/ReportSection';
import { useTheme } from "@emotion/react";

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import es from "dayjs/locale/es";

import CheckIcon from "@mui/icons-material/Check";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export const ReportEmployeeInductionComponent = ({
    report = {},
    collaborators = [],
    initCollaborators  = [],
    changeInputCollaborator = () => { },    
    putEmployeeReportStore = () => { },
    handleDeleteEmployeeReport = () => { },
    handleEvidenceOpen = () => { },
}) => {

    const { palette } = useTheme();

    //Validaciones
    const validatorSaveEmployeeInsetDisabled = (cl) => {
        const collaboratorInit = initCollaborators.find((el) => el.id === cl.id);

        return (
        JSON.stringify({
            campus: `${collaboratorInit?.campus ?? ""}`,
            company: `${collaboratorInit?.company ?? report?.commerce?.name}`,
            inset_delivery_date: `${collaboratorInit?.inset_delivery_date ?? ""}`,
            inset_induction_date: `${collaboratorInit?.inset_induction_date ?? ""}`,
            inset_st_date: `${collaboratorInit?.inset_st_date ?? ""}`,
            approved_induction: collaboratorInit?.approved_induction ?? false,
        }).trim() ===
        JSON.stringify({
            campus: cl?.campus ?? "",
            company: `${cl?.company ?? report?.commerce?.name}`,
            inset_delivery_date: cl?.inset_delivery_date ?? "",
            inset_induction_date: cl?.inset_induction_date ?? "",
            inset_st_date: cl?.inset_st_date ?? "",
            approved_induction: cl?.approved_induction ?? false,
        }).trim()
        );
    };  

    return(
        <>
        {" "}
        <Divider
        sx={{
            mb: 2,
            mt: 2,
            width: "100%",
            bgcolor: "text.primary",
        }}
        />
        <Grid container>
        {collaborators?.collaborators?.length > 0 &&
            collaborators?.collaborators
            ?.filter((cll) =>
                cll.state.find(
                (el) =>
                    el.employee_state === EmployeeState.NUEVOINGRESO
                )
            )
            .map((cl, index) => {
                return (
                <Grid
                    container
                    key={cl.index}
                    //sx={{ backgroundColor: ((index + 1) % 2) ? palette.secondary.support : '' }}
                >
                    <Grid
                    item
                    xs={12}
                    md={9}
                    sx={{
                        display: "flex",
                        mb: 1,
                        pr: 0.5,
                        pl: 0.5,
                    }}
                    >
                    <Grid container>
                        <ReportEmployeeComponent
                        collaborator={cl}
                        fieldset={{
                            name: { show: true, md: 3 },
                            identification: {
                            show: true,
                            md: 3,
                            age: true,
                            },
                        }}
                        ></ReportEmployeeComponent>

                        <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ mb: 3, pr: 0.5, pl: 0.5 }}
                        >
                        <TextField
                            disabled={
                            cl?.is_employee ||
                                cl?.approved_induction
                                ? true
                                : false
                            }
                            variant="standard"
                            size="small"
                            label="Empresa"
                            type="text"
                            fullWidth
                            name="company"
                            value={`${cl?.is_employee
                            ? report?.commerce?.name
                            : cl?.company ?? ""
                            }`}
                            onChange={(event) =>
                            changeInputCollaborator(event, cl.index)
                            }
                        />
                        </Grid>

                        <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ mb: 3, pr: 0.5, pl: 0.5 }}
                        >
                        <TextField
                            disabled={
                            cl?.approved_induction ? true : false
                            }
                            variant="standard"
                            size="small"
                            label="Sede"
                            type="text"
                            fullWidth
                            name="campus"
                            value={cl?.campus ?? ""}
                            onChange={(event) =>
                            changeInputCollaborator(event, cl.index)
                            }
                        />
                        </Grid>

                        <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ mb: 1, pl: 0.5, pr: 0.5 }}
                        >
                        <LocalizationProvider
                            adapterLocale={es}
                            dateAdapter={AdapterDayjs}
                        >
                            <DatePicker
                            disabled={
                                cl?.approved_induction ? true : false
                            }
                            size="small"
                            className="birth-date-piker"
                            sx={{ width: "100%" }}
                            inputFormat="DD/MM/YYYY"
                            label={`${cl?.inset_st_date ? "Fecha" : ""
                                } Inducción SST`}
                            name="inset_st_date"
                            value={cl?.inset_st_date ?? null}
                            onChange={(value) =>
                                changeInputCollaboratorValue(
                                {
                                    name: "inset_st_date",
                                    value,
                                    date: true,
                                },
                                cl.index
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                size="small"
                                {...params}
                                error={false}
                                // sx={{ input: { color: `${palette.text.primary}` } }}
                                />
                            )}
                            />
                        </LocalizationProvider>
                        </Grid>

                        <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ mb: 1, pl: 0.5, pr: 0.5 }}
                        >
                        <LocalizationProvider
                            adapterLocale={es}
                            dateAdapter={AdapterDayjs}
                        >
                            <DatePicker
                            disabled={
                                cl?.approved_induction ? true : false
                            }
                            size="small"
                            className="birth-date-piker"
                            sx={{ width: "100%" }}
                            inputFormat="DD/MM/YYYY"
                            label={`${cl?.inset_induction_date
                                ? "Fecha"
                                : ""
                                } Inducción al Cargo`}
                            name="inset_induction_date"
                            value={cl?.inset_induction_date ?? null}
                            onChange={(value) =>
                                changeInputCollaboratorValue(
                                {
                                    name: "inset_induction_date",
                                    value,
                                    date: true,
                                },
                                cl.index
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                size="small"
                                {...params}
                                error={false}
                                // sx={{ input: { color: `${palette.text.primary}` } }}
                                />
                            )}
                            />
                        </LocalizationProvider>
                        </Grid>

                        <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ mb: 1, pl: 0.5, pr: 0.5 }}
                        >
                        <LocalizationProvider
                            adapterLocale={es}
                            dateAdapter={AdapterDayjs}
                        >
                            <DatePicker
                            disabled={
                                cl?.approved_induction ? true : false
                            }
                            size="small"
                            className="birth-date-piker"
                            sx={{ width: "100%" }}
                            inputFormat="DD/MM/YYYY"
                            label={`${cl?.inset_delivery_date ? "Fecha" : ""
                                }  Entrega Elementos`}
                            name="inset_delivery_date"
                            value={cl?.inset_delivery_date ?? null}
                            onChange={(value) =>
                                changeInputCollaboratorValue(
                                {
                                    name: "inset_delivery_date",
                                    value,
                                    date: true,
                                },
                                cl.index
                                )
                            }
                            renderInput={(params) => (
                                <TextField
                                size="small"
                                {...params}
                                error={false}
                                // sx={{ input: { color: `${palette.text.primary}` } }}
                                />
                            )}
                            />
                        </LocalizationProvider>
                        </Grid>
                    </Grid>
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
                        title="Eliminar Registro"
                        placement="top"
                    >
                        <span>
                        <IconButton
                            disabled={
                            cl?.approved_induction ? true : false
                            }
                            onClick={() =>
                            handleDeleteEmployeeReport(
                                cl,
                                EmployeeState.NUEVOINGRESO,
                                cl.index
                            )
                            }
                        >
                            <HighlightOffIcon
                            sx={{
                                color: palette.text.disabled,
                                "&:hover": {
                                // color: `${palette.text.primary}`,
                                cursor: "pointer",
                                },
                            }}
                            ></HighlightOffIcon>
                        </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip
                        title="Guardar Cambios"
                        placement="top"
                    >
                        <span>
                        <IconButton
                            disabled={validatorSaveEmployeeInsetDisabled(
                            cl
                            )}
                            onClick={() =>
                            putEmployeeReportStore(
                                cl.state.find(
                                (el) =>
                                    el.employee_state ===
                                    EmployeeState.NUEVOINGRESO
                                ) ?? null,
                                {
                                campus: cl?.campus ?? "",
                                company: cl?.company ?? "",
                                inset_delivery_date:
                                    cl?.inset_delivery_date ?? "",
                                inset_induction_date:
                                    cl?.inset_induction_date ?? "",
                                inset_st_date:
                                    cl?.inset_st_date ?? "",
                                // approved_induction: cl?.approved_induction ?? '',
                                }
                            )
                            }
                        >
                            <SaveIcon
                            sx={{
                                color:
                                !validatorSaveEmployeeInsetDisabled(
                                    cl
                                )
                                    ? palette.primary.main
                                    : "",
                            }}
                            ></SaveIcon>
                        </IconButton>
                        </span>
                    </Tooltip>
                    <Tooltip title="Evidencias" placement="top">
                        <span>
                        <IconButton
                            disableFocusRipple={
                            cl?.approved_induction ? true : false
                            }
                            onClick={() =>
                            handleEvidenceOpen(
                                cl,
                                EmployeeState.NUEVOINGRESO,
                                ReportSection.NUEVOINGRESO,
                                cl.approved_induction ?? false
                            )
                            }
                        >
                            <AttachFileIcon></AttachFileIcon>
                        </IconButton>
                        </span>
                    </Tooltip>

                    <Tooltip
                        title={`${cl?.approved_induction
                        ? "Aprobado"
                        : "Aprobar"
                        }`}
                        placement="top"
                    >
                        <span>
                        <PrivateAgentRoute>
                            <IconButton
                            onClick={() =>
                                putEmployeeReportStore(
                                cl.state.find(
                                    (el) =>
                                    el.employee_state ===
                                    EmployeeState.NUEVOINGRESO
                                ) ?? null,
                                {
                                    campus: cl?.campus ?? "",
                                    company: cl?.company ?? "",
                                    inset_delivery_date:
                                    cl?.inset_delivery_date ?? "",
                                    inset_induction_date:
                                    cl?.inset_induction_date ?? "",
                                    inset_st_date:
                                    cl?.inset_st_date ?? "",
                                    approved_induction:
                                    !cl?.approved_induction,
                                }
                                )
                            }
                            >
                            {cl?.approved_induction && (
                                <CheckIcon
                                sx={{
                                    color: `${palette.primary.main}`,
                                }}
                                ></CheckIcon>
                            )}
                            {!cl?.approved_induction && (
                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                            )}
                            </IconButton>
                        </PrivateAgentRoute>

                        <PrivateCustomerRoute>
                            <IconButton disabled>
                            {cl?.approved_induction && (
                                <CheckIcon
                                sx={{
                                    color: `${palette.primary.main}`,
                                }}
                                ></CheckIcon>
                            )}
                            {!cl?.approved_induction && (
                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                            )}
                            </IconButton>
                        </PrivateCustomerRoute>
                        </span>
                    </Tooltip>
                    </Grid>
                    <Divider
                    sx={{
                        mb: 2,
                        mt: 2,
                        width: "100%",
                        bgcolor: "text.primary",
                    }}
                    />
                </Grid>
                );
            })}
        </Grid>
        </>
    )
}