import {
Divider,
Grid,
IconButton,
Tooltip
} from '@mui/material';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ReportEmployeeComponent } from './ReportEmployeeComponent';

import { EmployeeState } from '../../../types/EmployeeState';
import { useTheme } from "@emotion/react";

import CheckIcon from "@mui/icons-material/Check";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import { ReportSection } from '../../../types/ReportSection';

export const ReportEmployeeRecallComponent = ({
    collaborators = [],    
    putEmployeeReportStore = () => { },
    handleDeleteEmployeeReport = () => { },
    handleEvidenceOpen= () => { }
})=>{

    const { palette } = useTheme();

    return(
        <>
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
                    (el) => el.employee_state === EmployeeState.RETIRED
                    )
                )
                .map((cl, index) => {
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
                        <ReportEmployeeComponent
                            collaborator={cl}
                            fieldset={{
                            name: { show: true, md: 3 },
                            identification: {
                                show: true,
                                md: 3,
                                age: true,
                            },
                            email: { show: true, md: 3 },
                            phone: { show: true, md: 3 },
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
                            title="Eliminar Registro"
                            placement="top"
                        >
                            <span>
                            <IconButton
                                disabled={
                                cl?.approved_retired ? true : false
                                }
                                onClick={() =>
                                handleDeleteEmployeeReport(
                                    cl,
                                    EmployeeState.RETIRED,
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

                        <Tooltip title="Evidencias" placement="top">
                            <span>
                            <IconButton
                                disableFocusRipple={
                                cl?.approved_retired ? true : false
                                }
                                onClick={() =>
                                handleEvidenceOpen(
                                    cl,
                                    EmployeeState.RETIRED,
                                    ReportSection.RETIRED,
                                    cl.approved_retired ?? false
                                )
                                }
                            >
                                <AttachFileIcon></AttachFileIcon>
                            </IconButton>
                            </span>
                        </Tooltip>

                        <Tooltip
                            title={`${cl?.approved_retired
                            ? "Aprobado"
                            : "Aprobar"
                            }`}
                            placement="top"
                        >
                            <span>
                            <PrivateAgentRoute>
                                <IconButton
                                onClick={
                                    () =>
                                    putEmployeeReportStore(
                                        cl.state.find(
                                        (el) =>
                                            el.employee_state ===
                                            EmployeeState.RETIRED
                                        ) ?? null,
                                        {
                                        approved_retired:
                                            !cl?.approved_retired,
                                        }
                                    )
                                    // changeInputCollaborator({
                                    //     target: {
                                    //         name: 'approved_retired',
                                    //         value: !cl?.approved_retired
                                    //     }
                                    // }, cl.index)
                                }
                                >
                                {cl?.approved_retired && (
                                    <CheckIcon
                                    sx={{
                                        color: `${palette.primary.main}`,
                                    }}
                                    ></CheckIcon>
                                )}
                                {!cl?.approved_retired && (
                                    <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                )}
                                </IconButton>
                            </PrivateAgentRoute>

                            <PrivateCustomerRoute>
                                <IconButton disabled>
                                {cl?.approved_retired && (
                                    <CheckIcon
                                    sx={{
                                        color: `${palette.primary.main}`,
                                    }}
                                    ></CheckIcon>
                                )}
                                {!cl?.approved_retired && (
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
