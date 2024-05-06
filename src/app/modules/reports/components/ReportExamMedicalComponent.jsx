import {
  Divider,
  TextField,
  FormControl,
  Grid,
  InputLabel,
  Select,
  IconButton,
  Tooltip
} from '@mui/material';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ReportEmployeeComponent } from './ReportEmployeeComponent';

import { EmployeeState } from '../../../types/EmployeeState';
import { ReportSection } from '../../../types/ReportSection';
import { useTheme } from "@emotion/react";

import MenuItem from "@mui/material/MenuItem";
import CheckIcon from "@mui/icons-material/Check";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveIcon from "@mui/icons-material/Save";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";


export const ReportExamMedicalComponent = ({
    collaborators = [],
    initCollaborators  = [],
    examTypeArray = [],
    examArray = [],    
    changeInputCollaborator = () => { },    
    putEmployeeReportStore = () => { },
    handleDeleteEmployeeReport = () => { },
    handleEvidenceOpen= () => { }
}) => {

  const { palette } = useTheme();

  const validatorSaveDisabledExam = (cl, inputs) => {
    const collaboratorInit = initCollaborators.find((el) => el.id === cl.id);
    return (
      JSON.stringify(
        Object.keys(inputs ?? []).map((el) => ({
          [el]:
            el === "exam"
              ? collaboratorInit[el]?.toString() ?? ""
              : collaboratorInit[el] ?? "",
        }))
      ).trim() ===
      JSON.stringify(
        Object.keys(inputs ?? []).map((el) => ({
          [el]: el === "exam" ? cl[el]?.toString() ?? "" : inputs[el] ?? "",
        }))
      ).trim()
    );
  };  

  return (
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
                  (el) =>
                    el.employee_state ===
                    EmployeeState.EXAMENESMEDICOS
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
                          }}
                        ></ReportEmployeeComponent>

                        <Grid
                          item
                          xs={12}
                          md={3}
                          sx={{ mb: 1, pr: 0.5, pl: 0.5 }}
                        >
                          {examTypeArray && examTypeArray.length && (
                            <FormControl
                              fullWidth
                              className="FormControlExamType"
                              sx={{ marginTop: "0px" }}
                            >
                              <InputLabel
                                variant="standard"
                                id="demo-simple-select-label"
                                sx={{
                                  color: `${palette.text.primary}`,
                                }}
                              >
                                Tipo Examen
                              </InputLabel>
                              <Select
                                variant="standard"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                name="type_exam"
                                value={cl?.type_exam ?? ""}
                                label="Proyecto"
                                onChange={(event) =>
                                  changeInputCollaborator(
                                    event,
                                    cl.index
                                  )
                                }
                              >
                                <MenuItem value="">
                                  <em></em>
                                </MenuItem>
                                {examTypeArray.map((el, index) => (
                                  <MenuItem
                                    key={index}
                                    value={el?.value}
                                  >
                                    {el?.value}
                                  </MenuItem>
                                ))}
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
                          {examArray && examArray.length && (
                            <FormControl
                              fullWidth
                              className="FormControlExamType"
                              sx={{ marginTop: "0px" }}
                            >
                              <InputLabel
                                variant="standard"
                                id="demo-multiple-name-label"
                                sx={{
                                  color: `${palette.text.primary}`,
                                }}
                              >
                                Examen
                              </InputLabel>
                              <Select
                                variant="standard"
                                labelId="demo-multiple-name-label"
                                id="demo-multiple-name"
                                name="exam"
                                value={
                                  cl?.exam?.length > 0 ? cl?.exam : []
                                }
                                label="Proyecto"
                                multiple={true}
                                onChange={(event) =>
                                  changeInputCollaborator(
                                    {
                                      target: {
                                        name: "exam",
                                        value:
                                          event.target.value.filter(
                                            (el) => el
                                          ),
                                      },
                                    },
                                    cl.index
                                  )
                                }
                              >
                                {examArray.map((el, index) => (
                                  <MenuItem
                                    key={index}
                                    value={el?.value}
                                  >
                                    {el?.value}
                                  </MenuItem>
                                ))}
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
                          {cl?.exam?.length > 0 &&
                            cl?.exam?.find((el) => el === "Otro") && (
                              <TextField
                                disabled={
                                  cl?.approved_exam ? true : false
                                }
                                variant="standard"
                                size="small"
                                label="Otro Examen"
                                type="text"
                                fullWidth
                                name="other_exam"
                                value={cl?.other_exam ?? ""}
                                onChange={(event) =>
                                  changeInputCollaborator(
                                    event,
                                    cl.index
                                  )
                                }
                              />
                            )}
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
                              cl?.approved_exam ? true : false
                            }
                            onClick={() =>
                              handleDeleteEmployeeReport(
                                cl,
                                EmployeeState.EXAMENESMEDICOS,
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
                            disabled={validatorSaveDisabledExam(cl, {
                              exam: cl?.exam,
                              type_exam: cl?.type_exam,
                              other_exam: cl?.other_exam,
                              // approved_exam: cl?.approved_exam ?? false
                            })}
                            onClick={() =>
                              putEmployeeReportStore(
                                cl.state.find(
                                  (el) =>
                                    el.employee_state ===
                                    EmployeeState.EXAMENESMEDICOS
                                ) ?? null,
                                {
                                  exam: cl?.exam ?? "",
                                  type_exam: cl?.type_exam ?? "",
                                  other_exam: cl?.other_exam ?? "",
                                  // approved_exam: cl?.approved_exam ?? '',
                                }
                              )
                            }
                          >
                            <SaveIcon
                              sx={{
                                color: !validatorSaveDisabledExam(
                                  cl,
                                  {
                                    exam: cl?.exam,
                                    type_exam: cl?.type_exam,
                                    other_exam: cl?.other_exam,
                                    // approved_exam: cl?.approved_exam ?? false
                                  }
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
                              cl?.approved_exam ? true : false
                            }
                            onClick={() =>
                              handleEvidenceOpen(
                                cl,
                                EmployeeState.EXAMENESMEDICOS,
                                ReportSection.EXAMENESMEDICOS,
                                cl.approved_exam ?? false
                              )
                            }
                          >
                            <AttachFileIcon></AttachFileIcon>
                          </IconButton>
                        </span>
                      </Tooltip>

                      <Tooltip
                        title={`${cl?.approved_exam ? "Aprobado" : "Aprobar"
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
                                        EmployeeState.EXAMENESMEDICOS
                                    ) ?? null,
                                    {
                                      exam: cl?.exam ?? "",
                                      type_exam: cl?.type_exam ?? "",
                                      other_exam:
                                        cl?.other_exam ?? "",
                                      approved_exam:
                                        !cl?.approved_exam,
                                    }
                                  )
                                // changeInputCollaborator({
                                //     target: {
                                //         name: 'approved_exam',
                                //         value: !cl?.approved_exam
                                //     }
                                // }, cl.index)
                              }
                            >
                              {cl?.approved_exam && (
                                <CheckIcon
                                  sx={{
                                    color: `${palette.primary.main}`,
                                  }}
                                ></CheckIcon>
                              )}
                              {!cl?.approved_exam && (
                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                              )}
                            </IconButton>
                          </PrivateAgentRoute>

                          <PrivateCustomerRoute>
                            <IconButton disabled>
                              {cl?.approved_exam && (
                                <CheckIcon
                                  sx={{
                                    color: `${palette.primary.main}`,
                                  }}
                                ></CheckIcon>
                              )}
                              {!cl?.approved_exam && (
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
