import {
    TextField,
    FormControl,
    FormHelperText,
    Grid,
    InputLabel,
    Select,
    Switch,
    IconButton,
    FormControlLabel,
    Tooltip
} from '@mui/material';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ReportEmployeeComponent } from './ReportEmployeeComponent';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import es from "dayjs/locale/es";

import { EmployeeState } from '../../../types/EmployeeState';
import { ReportSection } from '../../../types/ReportSection';
import { useTheme } from "@emotion/react";

import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";

export const ReportHealtEmployee = ({
    collaborators = [],
    initCollaborators  = [],
    workEventArray = [],
    medicalAttentionArray = [],    
    changeInputCollaborator = () => { },
    changeInputCollaboratorValue = () => { },
    putEmployeeReportStore = () => { },
    handleDeleteEmployeeReport = () => { },
    handleEvidenceOpen= () => { }
}) => {
    const { palette } = useTheme();

    const numberPatternValidation = (value) => {
        if (!value) return true;
        const regex = new RegExp(/^\d+$/);
        return regex.test(value);
    };

    const validatorSaveDisabled = (cl, inputs) => {
        const collaboratorInit = initCollaborators.find((el) => el.id === cl.id);
        return (
            JSON.stringify(
                Object.keys(inputs ?? []).map((el) => ({
                    [el]: collaboratorInit[el] ?? "",
                }))
            ).trim() ===
            JSON.stringify(
                Object.keys(inputs ?? []).map((el) => ({
                    [el]: cl[el] ?? "",
                }))
            ).trim()
        );
    };

    return (
        <Grid container>
            {collaborators?.collaborators?.length > 0 &&
                collaborators?.collaborators
                    ?.filter((cll) =>
                        cll.state.find(
                            (el) =>
                                el.employee_state === EmployeeState.WORKEVENT
                        )
                    )
                    .map((cl) => {
                        return (
                            <Grid container key={cl.index}>
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
                                                // identification: { show: true, md: 3 },
                                                eps: { show: true, md: 3 },
                                            }}
                                        ></ReportEmployeeComponent>
                                        <Grid
                                            item
                                            xs={12}
                                            md={3}
                                            sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                                        >
                                            {workEventArray &&
                                                workEventArray.length && (
                                                    <FormControl
                                                        fullWidth
                                                        className="FormControlExamType"
                                                        error={
                                                            cl?.work_event === "" ||
                                                            cl?.work_event === null
                                                        }
                                                        required={true}
                                                        sx={{ marginTop: "0px" }}
                                                    >
                                                        <InputLabel
                                                            variant="standard"
                                                            id="demo-simple-select-label"
                                                            sx={{
                                                                color: `${palette.text.primary}`,
                                                            }}
                                                        >
                                                            Novedad
                                                        </InputLabel>
                                                        <Select
                                                            disabled={
                                                                cl?.approved_work ? true : false
                                                            }
                                                            variant="standard"
                                                            labelId="demo-simple-select-label"
                                                            id="demo-simple-select"
                                                            name="work_event"
                                                            value={cl?.work_event ?? ""}
                                                            label="Novedad"
                                                            onChange={(event) => {
                                                                changeInputCollaborator(
                                                                    event,
                                                                    cl.index
                                                                );
                                                                if (event?.target?.value === "") {
                                                                    changeInputCollaboratorValue(
                                                                        {
                                                                            name: "delivery_date",
                                                                            value: null,
                                                                            date: false,
                                                                        },
                                                                        cl.index
                                                                    );
                                                                }
                                                            }}
                                                        >
                                                            <MenuItem value={null}>
                                                                <em></em>
                                                            </MenuItem>
                                                            {workEventArray.map((el, index) => (
                                                                <MenuItem
                                                                    key={index}
                                                                    value={el?.value}
                                                                >
                                                                    {el?.value}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {cl?.work_event === "" ||
                                                            (cl?.work_event === null && (
                                                                <FormHelperText>
                                                                    Novedad es un campo requerido
                                                                </FormHelperText>
                                                            ))}
                                                    </FormControl>
                                                )}
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={3}
                                            sx={{
                                                mb: 1,
                                                pl: 0.5,
                                                pr: 0.5,
                                                display: "flex",
                                                alignItems: `${!cl?.work_event ? "center" : "end"
                                                    }`,
                                            }}
                                        >
                                            <LocalizationProvider
                                                adapterLocale={es}
                                                dateAdapter={AdapterDayjs}
                                            >
                                                <DatePicker
                                                    disabled={
                                                        !cl?.work_event || cl?.approved_work
                                                            ? true
                                                            : false
                                                    }
                                                    size="small"
                                                    className="birth-date-piker"
                                                    sx={{ width: "100%" }}
                                                    inputFormat="DD/MM/YYYY"
                                                    label={`Fecha ${cl?.delivery_date ?? "Novedad"
                                                        }`}
                                                    name="delivery_date"
                                                    value={cl?.delivery_date ?? null}
                                                    onChange={(value) =>
                                                        changeInputCollaboratorValue(
                                                            {
                                                                name: "delivery_date",
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

                                        {cl?.work_event && (
                                            <>
                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{
                                                        mb: 1,
                                                        pl: 0.5,
                                                        pr: 0.5,
                                                        alignItems: "end",
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        sx={{ ml: 2 }}
                                                        control={
                                                            <Switch
                                                                disabled={
                                                                    cl?.approved_work ? true : false
                                                                }
                                                                checked={
                                                                    cl?.was_report === "on"
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(event) =>
                                                                    changeInputCollaborator(
                                                                        {
                                                                            target: {
                                                                                name: "was_report",
                                                                                value:
                                                                                    cl?.was_report === "on"
                                                                                        ? "off"
                                                                                        : "on",
                                                                            },
                                                                        },
                                                                        cl.index
                                                                    )
                                                                }
                                                                name="was_report"
                                                            />
                                                        }
                                                        label={`${cl?.was_report === "on"
                                                            ? "Se reportó " + cl?.work_event
                                                            : "No se reportó " +
                                                            cl?.work_event
                                                            }`}
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{
                                                        mb: 1,
                                                        pl: 0.5,
                                                        pr: 0.5,
                                                        alignItems: "end",
                                                    }}
                                                >
                                                    <FormControlLabel
                                                        sx={{ ml: 2 }}
                                                        control={
                                                            <Switch
                                                                disabled={
                                                                    cl?.approved_work ? true : false
                                                                }
                                                                checked={
                                                                    cl?.was_investigated === "on"
                                                                        ? true
                                                                        : false
                                                                }
                                                                onChange={(event) =>
                                                                    changeInputCollaborator(
                                                                        {
                                                                            target: {
                                                                                name: "was_investigated",
                                                                                value:
                                                                                    cl?.was_investigated ===
                                                                                        "on"
                                                                                        ? "off"
                                                                                        : "on",
                                                                            },
                                                                        },
                                                                        cl.index
                                                                    )
                                                                }
                                                                name="was_investigated"
                                                            />
                                                        }
                                                        label={`${cl?.was_investigated === "on"
                                                            ? "Se investigó " + cl?.work_event
                                                            : "No se investigó " +
                                                            cl?.work_event
                                                            }`}
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{
                                                        mb: 1,
                                                        pl: 0.5,
                                                        pr: 0.5,
                                                        display: "flex",
                                                        alignItems: "end",
                                                    }}
                                                >
                                                    <LocalizationProvider
                                                        adapterLocale={es}
                                                        dateAdapter={AdapterDayjs}
                                                    >
                                                        <DatePicker
                                                            disabled={
                                                                cl?.was_report === "on"
                                                                    ? false
                                                                    : true || cl?.approved_work
                                                                        ? true
                                                                        : false
                                                            }
                                                            size="small"
                                                            className="birth-date-piker"
                                                            sx={{ width: "100%" }}
                                                            inputFormat="DD/MM/YYYY"
                                                            label="Fecha Reporte"
                                                            name="was_report_date"
                                                            value={cl?.was_report_date ?? null}
                                                            onChange={(value) =>
                                                                changeInputCollaboratorValue(
                                                                    {
                                                                        name: "was_report_date",
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
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>

                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{
                                                        mb: 1,
                                                        pl: 0.5,
                                                        pr: 0.5,
                                                        display: "flex",
                                                        alignItems: "end",
                                                    }}
                                                >
                                                    <LocalizationProvider
                                                        adapterLocale={es}
                                                        dateAdapter={AdapterDayjs}
                                                    >
                                                        <DatePicker
                                                            disabled={
                                                                cl?.was_investigated === "on"
                                                                    ? false
                                                                    : true || cl?.approved_work
                                                                        ? true
                                                                        : false
                                                            }
                                                            size="small"
                                                            className="birth-date-piker"
                                                            sx={{ width: "100%" }}
                                                            inputFormat="DD/MM/YYYY"
                                                            label="Fecha Investigación"
                                                            name="was_investigated_date"
                                                            value={
                                                                cl?.was_investigated_date ?? null
                                                            }
                                                            onChange={(value) =>
                                                                changeInputCollaboratorValue(
                                                                    {
                                                                        name: "was_investigated_date",
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
                                                                />
                                                            )}
                                                        />
                                                    </LocalizationProvider>
                                                </Grid>

                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{ mb: 3, pr: 0.5, pl: 0.5 }}
                                                >
                                                    <TextField
                                                        disabled={
                                                            cl?.approved_work ? true : false
                                                        }
                                                        variant="standard"
                                                        size="small"
                                                        label={`Donde Ocurrió ${cl?.event}`}
                                                        type="text"
                                                        fullWidth
                                                        name="place"
                                                        value={cl?.place ?? ""}
                                                        onChange={(event) =>
                                                            changeInputCollaborator(
                                                                event,
                                                                cl.index
                                                            )
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
                                                            cl?.approved_work ? true : false
                                                        }
                                                        variant="standard"
                                                        size="small"
                                                        label="Días de Incapacidad"
                                                        type="text"
                                                        fullWidth
                                                        name="out_days"
                                                        value={cl?.out_days ?? ""}
                                                        onChange={(event) =>
                                                            changeInputCollaborator(
                                                                event,
                                                                cl.index
                                                            )
                                                        }
                                                        error={
                                                            !numberPatternValidation(
                                                                cl?.out_days
                                                            )
                                                                ? true
                                                                : false
                                                        }
                                                        helperText={
                                                            !numberPatternValidation(
                                                                cl?.out_days
                                                            )
                                                                ? "Se espera un número positivo"
                                                                : ""
                                                        }
                                                    />
                                                </Grid>

                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                                                >
                                                    {medicalAttentionArray &&
                                                        medicalAttentionArray.length && (
                                                            <FormControl
                                                                fullWidth
                                                                className="FormControlExamType"
                                                                sx={{ marginTop: "0px" }}
                                                            // error={!cl?.medical_attention}
                                                            >
                                                                <InputLabel
                                                                    variant="standard"
                                                                    id="demo-simple-select-label"
                                                                    sx={{
                                                                        color: `${palette.text.primary}`,
                                                                    }}
                                                                >
                                                                    Atención Medica
                                                                </InputLabel>
                                                                <Select
                                                                    disabled={
                                                                        cl?.approved_work
                                                                            ? true
                                                                            : false
                                                                    }
                                                                    variant="standard"
                                                                    labelId="demo-simple-select-label"
                                                                    id="demo-simple-select"
                                                                    name="medical_attention"
                                                                    value={
                                                                        cl?.medical_attention ?? ""
                                                                    }
                                                                    label="Atención Medica"
                                                                    onChange={(medical_attention) =>
                                                                        changeInputCollaborator(
                                                                            medical_attention,
                                                                            cl.index
                                                                        )
                                                                    }
                                                                >
                                                                    <MenuItem value="">
                                                                        <em></em>
                                                                    </MenuItem>
                                                                    {medicalAttentionArray.map(
                                                                        (el, index) => (
                                                                            <MenuItem
                                                                                key={index}
                                                                                value={el?.value}
                                                                            >
                                                                                {el?.value}
                                                                            </MenuItem>
                                                                        )
                                                                    )}
                                                                </Select>
                                                            </FormControl>
                                                        )}
                                                </Grid>

                                                <Grid
                                                    item
                                                    xs={12}
                                                    md={3}
                                                    sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                                                >
                                                    {cl?.medical_attention === "Otro" && (
                                                        <TextField
                                                            disabled={
                                                                cl?.approved_work ? true : false
                                                            }
                                                            variant="standard"
                                                            size="small"
                                                            label="Otra Atención"
                                                            type="text"
                                                            fullWidth
                                                            name="other_attention"
                                                            value={cl?.other_attention ?? ""}
                                                            onChange={(event) =>
                                                                changeInputCollaborator(
                                                                    event,
                                                                    cl.index
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </Grid>
                                            </>
                                        )}
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
                                                    cl?.approved_work ? true : false
                                                }
                                                onClick={() =>
                                                    handleDeleteEmployeeReport(
                                                        cl,
                                                        EmployeeState.WORKEVENT,
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
                                                disabled={validatorSaveDisabled(cl, {
                                                    work_event: cl?.work_event,
                                                    delivery_date: cl?.delivery_date,
                                                    was_report: cl?.was_report,
                                                    was_investigated: cl?.was_investigated,
                                                    was_report_date: cl?.was_report_date,
                                                    was_investigated_date:
                                                        cl?.was_investigated_date,
                                                    place: cl?.place,
                                                    out_days: cl?.out_days,
                                                    medical_attention:
                                                        cl?.medical_attention,
                                                    other_attention: cl?.other_attention,
                                                })}
                                                onClick={() =>
                                                    putEmployeeReportStore(
                                                        cl.state.find(
                                                            (el) =>
                                                                el.employee_state ===
                                                                EmployeeState.WORKEVENT
                                                        ) ?? null,
                                                        {
                                                            work_event: cl?.work_event ?? "",
                                                            delivery_date:
                                                                cl?.delivery_date ?? "",
                                                            was_report: cl?.was_report ?? "",
                                                            was_investigated:
                                                                cl?.was_investigated ?? "",
                                                            was_report_date:
                                                                cl?.was_report_date ?? "",
                                                            was_investigated_date:
                                                                cl?.was_investigated_date ?? "",
                                                            place: cl?.place ?? "",
                                                            out_days: cl?.out_days ?? "",
                                                            medical_attention:
                                                                cl?.medical_attention ?? "",
                                                            other_attention:
                                                                cl?.other_attention ?? "",
                                                        }
                                                    )
                                                }
                                            >
                                                <SaveIcon
                                                    sx={{
                                                        color: !validatorSaveDisabled(cl, {
                                                            work_event: cl?.work_event,
                                                            delivery_date: cl?.delivery_date,
                                                            was_report: cl?.was_report,
                                                            was_investigated:
                                                                cl?.was_investigated,
                                                            was_report_date:
                                                                cl?.was_report_date,
                                                            was_investigated_date:
                                                                cl?.was_investigated_date,
                                                            place: cl?.place,
                                                            out_days: cl?.out_days,
                                                            medical_attention:
                                                                cl?.medical_attention,
                                                            other_attention:
                                                                cl?.other_attention,
                                                        })
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
                                                    cl?.approved_work ? true : false
                                                }
                                                onClick={() =>
                                                    handleEvidenceOpen(
                                                        cl,
                                                        EmployeeState.WORKEVENT,
                                                        ReportSection.WORKEVENT,
                                                        cl.approved_work ?? false
                                                    )
                                                }
                                            >
                                                <AttachFileIcon></AttachFileIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Tooltip
                                        title={`${cl?.approved_work ? "Aprobado" : "Aprobar"
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
                                                                    EmployeeState.WORKEVENT
                                                            ) ?? null,
                                                            {
                                                                work_event: cl?.work_event,
                                                                delivery_date: cl?.delivery_date,
                                                                was_report: cl?.was_report,
                                                                was_investigated:
                                                                    cl?.was_investigated,
                                                                was_report_date:
                                                                    cl?.was_report_date,
                                                                was_investigated_date:
                                                                    cl?.was_investigated_date,
                                                                place: cl?.place,
                                                                out_days: cl?.out_days,
                                                                medical_attention:
                                                                    cl?.medical_attention,
                                                                other_attention:
                                                                    cl?.other_attention,
                                                                approved_work: !cl?.approved_work,
                                                            }
                                                        )
                                                    }
                                                >
                                                    {cl?.approved_work && (
                                                        <CheckIcon
                                                            sx={{
                                                                color: `${palette.primary.main}`,
                                                            }}
                                                        ></CheckIcon>
                                                    )}
                                                    {!cl?.approved_work && (
                                                        <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                    )}
                                                </IconButton>
                                            </PrivateAgentRoute>

                                            <PrivateCustomerRoute>
                                                <IconButton disabled>
                                                    {cl?.approved_work && (
                                                        <CheckIcon
                                                            sx={{
                                                                color: `${palette.primary.main}`,
                                                            }}
                                                        ></CheckIcon>
                                                    )}
                                                    {!cl?.approved_work && (
                                                        <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                    )}
                                                </IconButton>
                                            </PrivateCustomerRoute>
                                        </span>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        );
                    })}
        </Grid>
    )
}
