import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReduceReport } from "../../../../hooks/useReduceReport";
import { useParams, useSearchParams } from "react-router-dom";
import {
  commerceUpdate,
  compromiseRSSTShowByReportId,
  compromiseSSTShowByReportId,
  compromiseShowByReportId,
  employeeIndex,
  employeeReportDelete,
  employeeReportStore,
  employeeReportUpdate,
  reportByreportId,
} from "../../../../store";
import {
  Grid,
  ImageListItem,
  Typography,
  Button,
  TextField,
  IconButton,
  Switch,
  FormControl,
  FormControlLabel,
  FormGroup,
  Divider,
  InputLabel,
  Select,
  FormHelperText,
} from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { ReportCardComponent } from "./ReportCardComponent";
import { useGeneraNamelList, useCompromiseByReportId } from "../../../../hooks";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import es from "dayjs/locale/es";
import { useTheme } from "@emotion/react";
import MenuItem from "@mui/material/MenuItem";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import InfoIcon from "@mui/icons-material/Info";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import HealthAndSafetyIcon from "@mui/icons-material/HealthAndSafety";
import HealingIcon from "@mui/icons-material/Healing";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckIcon from "@mui/icons-material/Check";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import EditIcon from "@mui/icons-material/Edit";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import SupportIcon from "@mui/icons-material/Support";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { EvidencesComponent } from "../../../components/evidences/EvidencesComponent";
import { EmployeeState } from "../../../types/EmployeeState";
import { ReportSection } from "../../../types/ReportSection";

import { DialogAlertComponent } from "../../../components";
import { ReportEmployeeComponent } from "./ReportEmployeeComponent";
import { ReportTrainingSSTComponent } from "./ReportTrainingSSTComponent";
import { PrivateAgentRoute, PrivateCustomerRoute } from "../../../middleware";
import ReportActivityComponent from "./ReportActivityComponent";
import { ReportCompromiseComponent } from "./ReportCompromiseComponent";
import { ReportCompromiseSSTComponent } from "./ReportCompromiseSSTComponent";
import { ReportCompromiseRSSTComponent } from "./ReportCompromiseRSSTComponent";
import { ReportInspectionRSSTComponent } from "./ReportInspectionRSSTComponent";
import { ReportCorrectiveMonitoringRSSTComponent } from "./ReportCorrectiveMonitoringRSSTComponent";
import { inspectionRSSTShowByReportId } from "../../../../store/inspection/inspectionRSSTThunks";

export const ReportComponent = ({ navBarWidth = 58 }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();

  const {
    state: collaborators,
    setCollaborators,
    collaboratorsChangeInput,
  } = useReduceReport();

  // Almacena la información los colaboradores en base de datos
  const [initCollaborators, setInitCollaborators] = useState([]);

  const [report, setReport] = useState(null);
  // trainingsst se inicializa en null y la consulta lo modifica
  const [trainingsst, setTrainingsst] = useState(null);
  const [compromises, setCompromises] = useState(null);
  const [compromisesSST, setCompromisesSST] = useState(null);
  const [compromisesRSST, setCompromisesRSST] = useState(null);
  const [inspectionsRSST, setInspectionsRSST] = useState(null);
  const [activities, setActivities] = useState([]);

  const [employeeArray, setEmployeeArray] = useState([]);
  const [examTypeArray, setExamTypeArray] = useState([]);
  const [examArray, setExamArray] = useState([]);
  const [workEventArray, setWorkEventArray] = useState([]);
  const [medicalAttentionArray, setMedicalAttentionArray] = useState([]);
  const [topicSSTArray, setTopicSSTArray] = useState([]);

  const { commerce_id: param_commerce_id } = useParams();
  const { report_id: param_report_id } = useParams();
  const [searchParams] = useSearchParams();

  const { commerce: commerceState } = useSelector((state) => state.commerce);
  const commerce = useMemo(() => commerceState, [commerceState]);

  const [openEvidences, setopenEvidences] = useState({
    open: false,
    dialogtitle: "",
    dialogcontenttext: "",
    employee_report: {},
    approved: false,
  });
  const [selectCollaborator, setSelectCollaborator] = useState({});

  const [interval_test, setIntervalTest] = useState({
    income: false,
    periodical: false,
    retirement: false,
  });

  const [handleAlert, setHandleAlert] = useState({
    openAlert: false,
    functionAlertClose: () => {},
    functionAlertAgree: () => {},
    alertTittle: "",
    alertMessage: "",
  });

  const asistirEnSaludBran = `${window.location.origin}/src/assets/asistirEnSaludBran.png`;

  // Query

  // Listas genericas llamado
  const { data: listsQuery, mutate: listQueryMutate } = useGeneraNamelList(
    "exam,type_exam,event,medical_attention,topic_sst"
  );

  const {
    data: compromiseQuery,
    refetch: compromiseQueryRefetch,
    isSuccess: compromiseQueryisSuccess,
  } = useCompromiseByReportId({ id: param_report_id });

  // reportByreportId
  const getReportById = (id) => {
    dispatch(
      reportByreportId({
        form: {
          id: id ?? "",
        },
      })
    ).then(
      ({
        data: {
          data: { report },
        },
      }) => {
        // Asignación de Attributes
        setReport(report);
        const employees = report.employee.map((em, index) => ({
          ...em,
          state: em.state.map((st) => ({
            ...st,
            attributes: JSON.parse(st.attributes),
          })),
          //objetualizamos los campos de el estado
          ...em.state.reduce(
            (a, b) => ({ ...a, ...JSON.parse(b.attributes) }),
            {}
          ),
          index,
        }));

        setCollaborators([...employees]);
        setInitCollaborators([...employees]);
        setTrainingsst([...report.trainingsst]);
        setActivities([...report.activities]);
        dispatch(commerceUpdate({ commerce: report.commerce }));
      }
    );
  };

  // Obtener los colaboradores, en su último estado reportado
  const getEmployees = () => {
    const commerce_id = commerce?.id ?? param_commerce_id;
    if (commerce_id) {
      dispatch(
        employeeIndex({
          form: {
            commerce_id: commerce_id,
            employee_state: "Pendiente",
          },
        })
      ).then(
        ({
          data: {
            data: { employee },
          },
        }) => {
          setEmployeeArray(employee.data);
        }
      );
    }
  };

  const getCompromiseByReportId = () => {
    if (param_report_id) {
      dispatch(
        compromiseShowByReportId({
          form: { id: param_report_id },
        })
      ).then(({ data: { data } }) => {
        setCompromises(data);
      });
    }
  };

  const getCompromiseSSTByReportId = () => {
    if (param_report_id) {
      dispatch(
        compromiseSSTShowByReportId({
          form: { id: param_report_id },
        })
      ).then(({ data: { data } }) => {
        setCompromisesSST(data);
      });
    }
  };

  const getCompromiseRSSTByReportId = () => {
    if (param_report_id) {
      dispatch(
        compromiseRSSTShowByReportId({
          form: { id: param_report_id },
        })
      ).then(({ data: { data } }) => {
        setCompromisesRSST(data);
      });
    }
  };

  const getInspectionRSSTByReportId = () => {
    if (param_report_id) {
      dispatch(
        inspectionRSSTShowByReportId({
          form: { id: param_report_id },
        })
      ).then(({ data: { data } }) => {
        setInspectionsRSST(data);
      });
    }
  };

  const setEmployeeReportStore = (collaborator, employee_state) => {
    // se debe llamar al back para que guarde el cambio
    dispatch(
      employeeReportStore({
        form: {
          employee_state,
          ...collaborator.pivot,
        },
      })
    ).then((data) => {
      // Refrescamos el Report Component
      getReportById(param_report_id);
    });
  };

  const putEmployeeReportStore = (state, object) => {
    dispatch(
      employeeReportUpdate({
        form: {
          id: state.id,
          attributes: JSON.stringify(object),
        },
      })
    ).then((data) => {
      // Refrescamos el Report Component
      getReportById(param_report_id);
    });
  };

  const deleteEmployeeReport = (collaborator, state) => {
    dispatch(
      employeeReportDelete({
        form: {
          id:
            collaborator.state.find((el) => el.employee_state === state).id ??
            null,
        },
      })
    ).then((data) => {
      // Refrescamos el Report Component
      getReportById(param_report_id);
      //cerramos el alert
      setHandleAlert({ openAlert: false });
    });
  };

  // Coportamiento
  const getAge = (birth_date) => {
    if (birth_date) {
      const birthDate = new Date(birth_date);
      const difference = Date.now() - birthDate.getTime();
      const age = new Date(difference);
      return `${Math.abs(age.getUTCFullYear() - 1970)}`;
    }
  };

  // Eventos

  const changeInputCollaborator = ({ target }, index) => {
    const { name, value } = target;
    collaboratorsChangeInput({ value, name, index });
  };

  const changeInputCollaboratorValue = (
    { name, value, date = false },
    index
  ) => {
    changeInputCollaborator(
      {
        target: {
          name: name,
          value: date ? value?.format("YYYY-MM-DD") : value,
        },
      },
      index
    );
  };
  const handleDeleteEmployeeReport = (collaborator, state, index) => {
    // collaboratorsChangeInput({ value: [collaborator.state.filter(el => el.employee_state !== EmployeeState.NUEVOINGRESO)], name: 'state', index })
    setHandleAlert({
      openAlert: true,
      functionAlertClose: () => setHandleAlert({ openAlert: false }),
      functionAlertAgree: () => deleteEmployeeReport(collaborator, state),
      alertTittle: "Eliminar Registro",
      alertMessage: `Estas seguro de borrar el registro de ${collaborator.name}.`,
    });
  };

  const handleAddStatus = (collaborator, status) => {
    setEmployeeReportStore(collaborator, status);
    // collaboratorsChangeInput({ value: [...collaborator.state, { id: null, employee_state: EmployeeState.NUEVOINGRESO }], name: 'state', index })
  };

  // Manejador de apertura de PopUp de Evidencias
  const handleEvidenceOpen = (
    collaborator,
    EmployeeState,
    ReportSection,
    approved = false
  ) => {
    setopenEvidences((openEvidences) => ({
      ...openEvidences,
      dialogtitle: ReportSection,
      dialogcontenttext: `${collaborator.name} ${collaborator.lastname} [${collaborator.identification}]`,
      employee_report: collaborator.state.find(
        (el) => el.employee_state === EmployeeState
      ),
      approved: approved,
      open: true,
    }));

    setSelectCollaborator(collaborator);
  };

  const handleEvidenceClose = () => {
    setopenEvidences((openEvidences) => ({ ...openEvidences, open: false }));
    setSelectCollaborator(null);
  };

  const reportCardPending = (attibute, EmployeeState) =>
    100 -
    (collaborators?.collaborators
      ?.filter((cll) =>
        cll.state.find((el) => el.employee_state === EmployeeState)
      )
      ?.filter((el) => !el[attibute]).length *
      100) /
      collaborators?.collaborators?.filter((cll) =>
        cll.state.find((el) => el.employee_state === EmployeeState)
      ).length;

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

  const numberPatternValidation = (value) => {
    if (!value) return true;
    const regex = new RegExp(/^\d+$/);
    return regex.test(value);
  };

  // Muy peligroso y enrreda en demasia
  useEffect(() => {
    console.log("ReportcollaboratorsEffect", collaborators);

    // console.log('selectCollaborator', selectCollaborator);
    // refrescamos el selectCollaborator
    // if (selectCollaborator && (selectCollaborator?.index || selectCollaborator?.index === 0 || selectCollaborator?.index === '0')) {
    //     setSelectCollaborator(collaborators?.collaborators.find(el => el.index === selectCollaborator.index));
    // }
  }, [collaborators]);

  useEffect(() => {
    // console.log('trainingsst', trainingsst);
    // console.log('trainingsstlength', trainingsst?.length);
    // console.log('trainingsstUnApproved', trainingsst?.filter(el => !el.approved)?.length);
    // console.log('porcentage', 100 - parseInt(trainingsst?.filter(el => !el.approved)?.length * 100 / trainingsst?.length));
    // console.log('selectCollaborator', selectCollaborator);
    // refrescamos el selectCollaborator
    // if (selectCollaborator && (selectCollaborator?.index || selectCollaborator?.index === 0 || selectCollaborator?.index === '0')) {
    //     setSelectCollaborator(collaborators?.collaborators.find(el => el.index === selectCollaborator.index));
    // }
  }, [trainingsst]);

  // Mutación QUERY para todas las listas
  useEffect(() => {
    if (!!listsQuery && listsQuery.length) {
      setWorkEventArray(listsQuery?.filter((el) => el.name === "event") ?? []);
      setExamArray(listsQuery?.filter((el) => el.name === "exam") ?? []);
      setExamTypeArray(
        listsQuery?.filter((el) => el.name === "type_exam") ?? []
      );
      setMedicalAttentionArray(
        listsQuery?.filter((el) => el.name === "medical_attention") ?? []
      );
      setTopicSSTArray(
        listsQuery?.filter((el) => el.name === "topic_sst") ?? []
      );
    }
  }, [listsQuery]);

  useEffect(() => {
    if (!!compromiseQuery && compromiseQuery.length) {
      setCompromises(compromiseQuery);
    }
  }, [compromiseQueryisSuccess]);

  useEffect(() => {
    getEmployees();
    getReportById(param_report_id);
    // getCompromiseByReportId();
    getCompromiseSSTByReportId();
    getCompromiseRSSTByReportId();
    getInspectionRSSTByReportId();
    listQueryMutate("exam,type_exam,event,medical_attention,topic_sst");
  }, []);

  return (
    <Grid
      container
      sx={{
        minHeight: `calc(100vh - ${navBarWidth}px)`,
        backgroundColor: "secondary.main",
        padding: 2,
        // alignItems: { xs: 'start', md: 'center' }
      }}
    >
      <Grid item xs={12} md={12}>
        <Grid container>
          {/* Head Report */}

          <Grid
            item
            xs={12}
            md={12}
            mb={2}
            sx={{ marginBottom: "0px" }}
            display={"flex"}
          >
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

          <Grid item xs={12} md={12} mb={2}>
            {commerce && (
              <>
                {/* 1. INFORMACIÓN GENERAL DE LA EMPRESA */}
                <ReportCardComponent
                  sx={{ borderRadius: "4px 4px 0px 0px" }}
                  title="1. INFORMACIÓN GENERAL DE LA EMPRESA"
                >
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
                </ReportCardComponent>

                {/* 2. INFORMACIÓN COLABORADORES DE LA EMPRESA */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="2. INFORMACIÓN COLABORADORES DE LA EMPRESA"
                  expandedDefault={true}
                >
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
                                  <Grid item>{`${
                                    cl?.is_employee
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
                                onClick={() =>
                                  handleAddStatus(
                                    cl,
                                    EmployeeState.NUEVOINGRESO
                                  )
                                }
                              >
                                <AddCircleIcon
                                  sx={{
                                    color: `${
                                      cl.state.find(
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
                                    color: `${
                                      cl.state.find(
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
                                    color: `${
                                      cl.state.find(
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
                                    color: `${
                                      cl.state.find(
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
                  </Grid>
                </ReportCardComponent>

                {/* 3. INDUCCIÓN Y PREPARACIÓN EMPLEADOS */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="3. INDUCCIÓN Y PREPARACIÓN EMPLEADOS"
                  pending={reportCardPending(
                    "approved_induction",
                    EmployeeState.NUEVOINGRESO
                  )}
                >
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
                                      value={`${
                                        cl?.is_employee
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
                                        label={`${
                                          cl?.inset_st_date ? "Fecha" : ""
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
                                        label={`${
                                          cl?.inset_induction_date
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
                                        label={`${
                                          cl?.inset_delivery_date ? "Fecha" : ""
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
                                  title={`${
                                    cl?.approved_induction
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
                </ReportCardComponent>

                {/* 3 RETIRO DE EMPLEADOS */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="3 RETIRO DE EMPLEADOS"
                  pending={reportCardPending(
                    "approved_retired",
                    EmployeeState.RETIRED
                  )}
                >
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
                                  title={`${
                                    cl?.approved_retired
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
                </ReportCardComponent>

                {/* 4. OTRAS ACTIVIDADES EJECUTADAS EN EL MES */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="4. OTRAS ACTIVIDADES EJECUTADAS EN EL MES"
                  pending={
                    100 -
                    (activities?.filter((el) => !el.approved)?.length * 100) /
                      activities?.length
                  }
                >
                  <ReportActivityComponent
                    activities={activities}
                    setActivities={setActivities}
                    report={report}
                    getReportById={() => getReportById(param_report_id)}
                    commerce_id={commerce?.id ?? param_commerce_id}
                  ></ReportActivityComponent>
                </ReportCardComponent>

                {/* 5.2 EXÁMENES MEDICO OCUPACIONAL */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="5.2 EXÁMENES MEDICO OCUPACIONAL"
                  pending={reportCardPending(
                    "approved_exam",
                    EmployeeState.EXAMENESMEDICOS
                  )}
                >
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
                                  title={`${
                                    cl?.approved_exam ? "Aprobado" : "Aprobar"
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
                </ReportCardComponent>

                {/* 5. VIGILANCIA EN SALUD DE LOS TRABAJADORES */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="5. VIGILANCIA EN SALUD DE LOS TRABAJADORES"
                  pending={reportCardPending(
                    "approved_work",
                    EmployeeState.WORKEVENT
                  )}
                >
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
                                      alignItems: `${
                                        !cl?.work_event ? "center" : "end"
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
                                        label={`Fecha ${
                                          cl?.delivery_date ?? "Novedad"
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
                                          label={`${
                                            cl?.was_report === "on"
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
                                          label={`${
                                            cl?.was_investigated === "on"
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
                                  title={`${
                                    cl?.approved_work ? "Aprobado" : "Aprobar"
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
                </ReportCardComponent>

                {/* 6. CAPACITACIÓN Y ENTRENAMIENTO SST */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="6. CAPACITACIÓN Y ENTRENAMIENTO SST"
                  pending={
                    100 -
                    (trainingsst?.filter((el) => !el.approved)?.length * 100) /
                      trainingsst?.length
                  }
                >
                  {trainingsst && report && (
                    <ReportTrainingSSTComponent
                      trainingsst={trainingsst}
                      report={report}
                      setTrainingsst={setTrainingsst}
                      topicSSTArray={topicSSTArray}
                      commerce_id={commerce?.id ?? param_commerce_id}
                      getReportById={() => getReportById(param_report_id)}
                    ></ReportTrainingSSTComponent>
                  )}
                </ReportCardComponent>

                {/* HORAS HOMBRE CAPACITACIÓN */}
                {/* <ReportCardComponent
                                    sx={{ borderRadius: '0px' }}
                                    title="HORAS HOMBRE CAPACITACIÓN"
                                > */}
                {/* 6. CAPACITACIÓN Y ENTRENAMIENTO SST */}
                {/* Informes excel linea 66 */}
                {/* </ReportCardComponent> */}

                {/* 7. CUMPLIMIENTO DE CRONOGRAMA */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="7. CUMPLIMIENTO DE CRONOGRAMA"
                ></ReportCardComponent>

                {/* 8. COMPROMISOS DE ASISTIR EN SALUD Y RIESGOS LABORALES */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="8. COMPROMISOS DE ASISTIR EN SALUD Y RIESGOS LABORALES"
                  pending={
                    100 -
                    (compromises?.filter((el) => !el.approved)?.length * 100) /
                      compromises?.length
                  }
                >
                  <ReportCompromiseComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    compromises={compromises}
                    setCompromises={setCompromises}
                    getReportById={() => getReportById(param_report_id)}
                    getCompromiseByReportIdReport={() =>
                      compromiseQueryRefetch()
                    }
                  ></ReportCompromiseComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="9. COMPROMISOS DEL RESPONSABLE DEL SST, CADA MES"
                  pending={
                    100 -
                    (compromisesSST?.filter((el) => !el.approved)?.length *
                      100) /
                      compromisesSST?.length
                  }
                >
                  <ReportCompromiseSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    compromises={compromisesSST}
                    setCompromises={setCompromisesSST}
                    getReportById={() => getReportById(param_report_id)}
                    getCompromiseByReportIdReport={() =>
                      getCompromiseSSTByReportId()
                    }
                  ></ReportCompromiseSSTComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="10. TAREAS Y COMPROMISOS COMPROMISOS DEL RESPONSABLE DEL SST"
                  pending={
                    100 -
                    (compromisesRSST?.filter((el) => !el.approved)?.length *
                      100) /
                      compromisesRSST?.length
                  }
                >
                  <ReportCompromiseRSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    compromises={compromisesRSST}
                    setCompromises={setCompromisesRSST}
                    getReportById={() => getReportById(param_report_id)}
                    getCompromiseByReportIdReport={() =>
                      getCompromiseRSSTByReportId()
                    }
                  ></ReportCompromiseRSSTComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="11. INSPECCIONES REALIZADAS POR EL RESPONSABLE DEL SST"
                  pending={
                    100 -
                    (inspectionsRSST?.filter((el) => !el.approved)?.length *
                      100) /
                      inspectionsRSST?.length
                  }
                >
                  <ReportInspectionRSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    inspections={inspectionsRSST}
                    setInspections={setInspectionsRSST}
                    getReportById={() => getReportById(param_report_id)}
                    getInspectionByReportIdReport={() =>
                      getInspectionRSSTByReportId()
                    }
                  ></ReportInspectionRSSTComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="11.1 SEGUIMIENTE A MEDIDAS CORRECTIVAS PROPUESTAS POR EL RESPONSABLE DEL SST DE LA EMPRESA"
                >
                  <ReportCorrectiveMonitoringRSSTComponent></ReportCorrectiveMonitoringRSSTComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="12. ACTIVIDADES GRUPOS DE APOYO"
                ></ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="15. GESTIÓN DE TRABAJOS DE ALTO RIESGO"
                ></ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="16. MANTENIMIENTO PERIODICO A LAS INSTALACIONES, EQUIPOS Y HERRAMIENTAS"
                ></ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="17. REGISTRO FOTOGRAFICO"
                ></ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px 0px 4px 4px" }}
                  title="18. ANEXOS "
                ></ReportCardComponent>
              </>
            )}
          </Grid>
        </Grid>
      </Grid>
      <Grid container sx={{ justifyContent: "end" }}>
        {commerce && (
          <>
            <Grid item xs={12} md={2} sx={{ ml: 1, mr: 1 }}>
              <Button
                fullWidth
                sx={{
                  // color: `${palette.text.primary}`,
                  border: "1px solid",
                }}
                // onClick={onSubmit}
                // disabled={!isFormValid || !formChange}
                variant="outlined"
              >
                Regresar
              </Button>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button
                fullWidth
                sx={{
                  color: `${palette.text.custom}`,
                  // border: '1px solid'
                }}
                // onClick={onClearForm}
                variant="contained"
              >
                Guardar
              </Button>
            </Grid>
          </>
        )}
      </Grid>
      {openEvidences.open && (
        <EvidencesComponent
          open={openEvidences.open}
          dialogtitle={openEvidences.dialogtitle}
          dialogcontenttext={openEvidences.dialogcontenttext}
          collaborator={selectCollaborator}
          employee_report={openEvidences.employee_report}
          approved={openEvidences.approved}
          setSelectCollaborator={setSelectCollaborator}
          collaboratorsChangeInput={collaboratorsChangeInput}
          handleClose={handleEvidenceClose}
        ></EvidencesComponent>
      )}
      {handleAlert.openAlert && (
        <DialogAlertComponent
          open={handleAlert.openAlert}
          handleClose={() => handleAlert.functionAlertClose()}
          handleAgree={() => handleAlert.functionAlertAgree()}
          props={{
            tittle: handleAlert.alertTittle,
            message: handleAlert.alertMessage,
          }}
        ></DialogAlertComponent>
      )}
    </Grid>
  );
};
