import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useReduceReport } from "../../../../hooks/useReduceReport";
import { useParams, useSearchParams } from "react-router-dom";
import {
  commerceUpdate,
  compromiseRSSTShowByReportId,
  compromiseSSTShowByReportId,
  employeeIndex,
  employeeReportDelete,
  employeeReportStore,
  employeeReportUpdate,
} from "../../../../store";
import {
  Grid,
  Button,
} from "@mui/material";
import { ReportCardComponent } from "./ReportCardComponent";
import {
  useByReportId,
  useGeneraNamelList,
  useCompromiseByReportId,
  useCorrectiveRSSTByReportId,
  useSupportGroupByReportId,
  useInspectionByReportId,
  useWorkManagementByReportId,
  useEquipementMaintenanceByReportId
} from "../../../../hooks";
import { useTheme } from "@emotion/react";
import { EvidencesComponent } from "../../../components/evidences/EvidencesComponent";
import { EmployeeState } from "../../../types/EmployeeState";

import { DialogAlertComponent } from "../../../components";
import { ReportTrainingSSTComponent } from "./ReportTrainingSSTComponent";
import ReportActivityComponent from "./ReportActivityComponent";
import { ReportCompromiseComponent } from "./ReportCompromiseComponent";
import { ReportCompromiseSSTComponent } from "./ReportCompromiseSSTComponent";
import { ReportCompromiseRSSTComponent } from "./ReportCompromiseRSSTComponent";
import { ReportInspectionRSSTComponent } from "./ReportInspectionRSSTComponent";
import { ReportCorrectiveMonitoringRSSTComponent } from "./ReportCorrectiveMonitoringRSSTComponent";
import { ReportSupportGroupActivityComponent } from "./ReportSupportGroupActivityComponent";
import { ReportEvidenceComponent } from "./ReportEvidenceComponent";
import { ReportWorkManagementComponent } from "./ReportWorkManagementComponent";
import { ReportEquipementMaintenanceComponent } from "./ReportEquipementMaintenanceComponent";
import { ReportHealtEmployee } from "./ReportHealtEmployeeComponent";
import { ReportExamMedicalComponent } from "./ReportExamMedicalComponent";
import { ReportEmployeeRecallComponent } from "./ReportEmployeeRecallComponent";
import { ReportEmployeeInductionComponent } from "./ReportEmployeeInductionComponent";
import { ReportEmployeeInformationComponent } from "./ReportEmployeeInformationComponent";
import { ReportCompanyInforamtionComponent } from "./ReportCompanyInforamtionComponent";
import { ReportHeadInformation } from "./ReportHeadInformation";
import { ReportScheduleComplianceComponent } from "./ReportScheduleComplianceComponent";
import { useScheduleComplianceByReportId } from "../../../../hooks/query/useScheduleCompliance";

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
  const [trainingsst, setTrainingsst] = useState([]);
  const [compromises, setCompromises] = useState([]);
  const [compromisesSST, setCompromisesSST] = useState([]);
  const [compromisesRSST, setCompromisesRSST] = useState([]);
  const [inspectionsRSST, setInspectionsRSST] = useState([]);
  const [correctiveRSST, setCorrectiveRSST] = useState([]);
  const [supportGroupActions, setSupportGroupActions] = useState([]);
  const [worksManagement, setWorksManagement] = useState([]);
  const [equipementsMaintenance, setEquipementsMaintenance] = useState([]);
  const [scheduleCompliances, setScheduleCompliances] = useState([]);
  const [activities, setActivities] = useState([]);
  const [evidences, setEvidneces] = useState([]);

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

  const [handleAlert, setHandleAlert] = useState({
    openAlert: false,
    functionAlertClose: () => { },
    functionAlertAgree: () => { },
    alertTittle: "",
    alertMessage: "",
  });  

  // Query

  // Funciones para querys

  // Set de las listas genericas
  const setGenericList = (arraydata) => {
    if (!!arraydata && arraydata.length) {
      setWorkEventArray(arraydata?.filter((el) => el.name === "event") ?? []);
      setExamArray(arraydata?.filter((el) => el.name === "exam") ?? []);
      setExamTypeArray(arraydata?.filter((el) => el.name === "type_exam") ?? []);
      setMedicalAttentionArray(arraydata?.filter((el) => el.name === "medical_attention") ?? []);
      setTopicSSTArray(arraydata?.filter((el) => el.name === "topic_sst") ?? []);
    }
  }

  // Set del reporte consultado por id
  const reportSet = (report) => {
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
    setEvidneces([...report.evidences]);
    dispatch(commerceUpdate({ commerce: report.commerce }));
  }


  // Listas genericas llamado
  const { data: listsQuery, mutate: listQueryMutate } = useGeneraNamelList(
    "exam,type_exam,event,medical_attention,topic_sst", setGenericList
  );

  const {
    data: reportid,
    refetch: reportidQuerryReferch
  } = useByReportId({ id: param_report_id }, reportSet)


  const {
    data: compromiseQuery,
    refetch: compromiseQueryRefetch,
  } = useCompromiseByReportId({ id: param_report_id }, setCompromises);

  const {
    data: correctiveRSSTQuery,
    refetch: correctiveRSSTQueryRefetch,
  } = useCorrectiveRSSTByReportId({ id: param_report_id }, setCorrectiveRSST);

  const {
    data: supportGroupActionQuery,
    refetch: supportGroupActionQueryRefetch,
  } = useSupportGroupByReportId({ id: param_report_id }, setSupportGroupActions);

  const {
    data: inspectionRSSTQuery,
    refetch: inspectionRSSTQueryRefetch,
  } = useInspectionByReportId({ id: param_report_id }, setInspectionsRSST);

  const {
    data: workManagementQuery,
    refetch: getworkManagementQueryRefetch,
  } = useWorkManagementByReportId({ id: param_report_id }, setWorksManagement);

  const {
    data: equipementMaintenenceQuery,
    refetch: getequipementMaintenenceQueryRefetch,
  } = useEquipementMaintenanceByReportId({ id: param_report_id }, setEquipementsMaintenance);

  const {
    data: scheduleComplianceQuery,
    refetch: getScheduleComplianceQueryRefetch,
  } = useScheduleComplianceByReportId({ id: param_report_id }, setScheduleCompliances);


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
      reportidQuerryReferch();
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
      reportidQuerryReferch();
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
      reportidQuerryReferch();
      //cerramos el alert
      setHandleAlert({ openAlert: false });
    });
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

  // Calculos
  const getPending = (array) => {
    return 100 - (array?.filter((el) => !el?.approved)?.length * 100) / array?.length;
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

  // TODO: Muy peligroso y enrreda en demasia
  useEffect(() => {
    //console.log("ReportcollaboratorsEffect", collaborators);
    // console.log('selectCollaborator', selectCollaborator);
    // refrescamos el selectCollaborator
    // if (selectCollaborator && (selectCollaborator?.index || selectCollaborator?.index === 0 || selectCollaborator?.index === '0')) {
    //     setSelectCollaborator(collaborators?.collaborators.find(el => el.index === selectCollaborator.index));
    // }
  }, [collaborators]);

  useEffect(() => {
    getEmployees();
    reportidQuerryReferch();
    getCompromiseSSTByReportId();
    getCompromiseRSSTByReportId();
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

          <ReportHeadInformation
            report={report}
          ></ReportHeadInformation>
          
          <Grid item xs={12} md={12} mb={2}>
            {commerce && (
              <>
                {/* 1. INFORMACIÓN GENERAL DE LA EMPRESA */}
                <ReportCardComponent
                  sx={{ borderRadius: "4px 4px 0px 0px" }}
                  title="1. INFORMACIÓN GENERAL DE LA EMPRESA"
                >
                  <ReportCompanyInforamtionComponent
                    report={report}
                    commerce={commerce}
                  ></ReportCompanyInforamtionComponent>
                </ReportCardComponent>

                {/* 2. INFORMACIÓN COLABORADORES DE LA EMPRESA */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="2. INFORMACIÓN COLABORADORES DE LA EMPRESA"
                  expandedDefault={true}
                >
                  <ReportEmployeeInformationComponent
                    collaborators={collaborators}
                    handleAddStatus={handleAddStatus}
                  ></ReportEmployeeInformationComponent>
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
                  <ReportEmployeeInductionComponent
                    report={report}
                    collaborators={collaborators}
                    initCollaborators={initCollaborators}
                    changeInputCollaborator={changeInputCollaborator}
                    putEmployeeReportStore={putEmployeeReportStore}
                    handleDeleteEmployeeReport={handleDeleteEmployeeReport}
                    handleEvidenceOpen={handleEvidenceOpen}
                    changeInputCollaboratorValue={changeInputCollaboratorValue}
                  ></ReportEmployeeInductionComponent>
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
                  <ReportEmployeeRecallComponent
                    collaborators={collaborators}                    
                    putEmployeeReportStore={putEmployeeReportStore}
                    handleDeleteEmployeeReport={handleDeleteEmployeeReport}
                    handleEvidenceOpen={handleEvidenceOpen}
                  ></ReportEmployeeRecallComponent>

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
                    getReportById={() => reportidQuerryReferch()}
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
                  <ReportExamMedicalComponent
                    collaborators={collaborators}
                    initCollaborators={initCollaborators}
                    examTypeArray={examTypeArray}
                    examArray={examArray}
                    changeInputCollaborator={changeInputCollaborator}
                    putEmployeeReportStore={putEmployeeReportStore}
                    handleDeleteEmployeeReport={handleDeleteEmployeeReport}
                    handleEvidenceOpen={handleEvidenceOpen}
                  ></ReportExamMedicalComponent>
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
                  <ReportHealtEmployee
                    collaborators={collaborators}
                    initCollaborators ={initCollaborators}
                    workEventArray={workEventArray}
                    medicalAttentionArray={medicalAttentionArray}
                    putEmployeeReportStore={putEmployeeReportStore}
                    changeInputCollaborator={changeInputCollaborator}
                    changeInputCollaboratorValue={changeInputCollaboratorValue}
                    handleDeleteEmployeeReport={handleDeleteEmployeeReport}
                    handleEvidenceOpen={handleEvidenceOpen}
                  ></ReportHealtEmployee>
                </ReportCardComponent>

                {/* 6. CAPACITACIÓN Y ENTRENAMIENTO SST */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="6. CAPACITACIÓN Y ENTRENAMIENTO SST"
                  pending={getPending(trainingsst)}
                >
                  {trainingsst && report && (
                    <ReportTrainingSSTComponent
                      trainingsst={trainingsst}
                      report={report}
                      setTrainingsst={setTrainingsst}
                      topicSSTArray={topicSSTArray}
                      commerce_id={commerce?.id ?? param_commerce_id}
                      getReportById={() => reportidQuerryReferch()}
                    ></ReportTrainingSSTComponent>
                  )}
                </ReportCardComponent>               

                {/* 7. CUMPLIMIENTO DE CRONOGRAMA */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="7. CUMPLIMIENTO DE CRONOGRAMA"
                  pending={getPending(scheduleCompliances)}
                >
                  <ReportScheduleComplianceComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    scheduleCompliances={scheduleCompliances}
                    scheduleComplianceQuery={scheduleComplianceQuery}
                    setScheduleCompliance={setScheduleCompliances}
                    getScheduleComplianceByReportIdReport={() => getScheduleComplianceQueryRefetch()}
                  ></ReportScheduleComplianceComponent>
                </ReportCardComponent>

                {/* 8. COMPROMISOS DE ASISTIR EN SALUD Y RIESGOS LABORALES */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="8. COMPROMISOS DE ASISTIR EN SALUD Y RIESGOS LABORALES"
                  pending={getPending(compromises)}
                >
                  {/* TODO: revisar el compromiseQueryRefetch, que si funcione sin necesidad del querClient */}
                  <ReportCompromiseComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    compromises={compromises}
                    setCompromises={setCompromises}
                    getCompromiseByReportIdReport={() => compromiseQueryRefetch()}
                  ></ReportCompromiseComponent>
                </ReportCardComponent>

                {/* 9. COMPROMISOS DEL RESPONSABLE DEL SST, CADA MES */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="9. COMPROMISOS DEL RESPONSABLE DEL SST, CADA MES"
                  pending={getPending(compromisesSST)}
                >
                  <ReportCompromiseSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    compromises={compromisesSST}
                    setCompromises={setCompromisesSST}
                    getReportById={() => reportidQuerryReferch()}
                    getCompromiseByReportIdReport={() =>
                      getCompromiseSSTByReportId()
                    }
                  ></ReportCompromiseSSTComponent>
                </ReportCardComponent>

                {/* 10. TAREAS Y COMPROMISOS DEL RESPONSABLE DEL SST" */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="10. TAREAS Y COMPROMISOS DEL RESPONSABLE DEL SST"
                  pending={getPending(compromisesRSST)}
                >
                  <ReportCompromiseRSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    compromises={compromisesRSST}
                    setCompromises={setCompromisesRSST}
                    getReportById={() => reportidQuerryReferch()}
                    getCompromiseByReportIdReport={() =>
                      getCompromiseRSSTByReportId()
                    }
                  ></ReportCompromiseRSSTComponent>
                </ReportCardComponent>

                {/* 11. INSPECCIONES REALIZADAS POR EL RESPONSABLE DEL SST */}
                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="11. INSPECCIONES REALIZADAS POR EL RESPONSABLE DEL SST"
                  pending={getPending(inspectionsRSST)}
                >
                  <ReportInspectionRSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    inspections={inspectionsRSST}
                    setInspections={setInspectionsRSST}
                    inspectionRSSTQuery={inspectionRSSTQuery}
                    getInspectionByReportIdReport={inspectionRSSTQueryRefetch}
                  ></ReportInspectionRSSTComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="11.1 SEGUIMIENTE A MEDIDAS CORRECTIVAS PROPUESTAS POR EL RESPONSABLE DEL SST DE LA EMPRESA"
                  pending={getPending(correctiveRSST)}
                >
                  <ReportCorrectiveMonitoringRSSTComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    correctives={correctiveRSST}
                    setCorrectives={setCorrectiveRSST}
                    correctiveRSSTQuery={correctiveRSSTQuery}
                    getCorrectiveMotiroringByReportIdReport={() => correctiveRSSTQueryRefetch()}
                  ></ReportCorrectiveMonitoringRSSTComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="12. ACTIVIDADES GRUPOS DE APOYO"
                  pending={getPending(supportGroupActions)}
                >
                  <ReportSupportGroupActivityComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    supports={supportGroupActions}
                    setSupports={setSupportGroupActions}
                    supportGroupActionQuery={supportGroupActionQuery}
                    getSupportGrpupByReportIdReport={() => supportGroupActionQueryRefetch()}
                  ></ReportSupportGroupActivityComponent>

                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="15. GESTIÓN DE TRABAJOS DE ALTO RIESGO"
                  pending={getPending(worksManagement)}
                >
                  <ReportWorkManagementComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    worksManagement={worksManagement}
                    setWorksManagement={setWorksManagement}
                    workManagementQuery={workManagementQuery}
                    getWorkManagementByReportIdReport={getworkManagementQueryRefetch}
                  ></ReportWorkManagementComponent>
                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="16. MANTENIMIENTO PERIÓDICO A LAS INSTALACIONES, EQUIPOS Y HERRAMIENTAS"
                  pending={getPending(equipementsMaintenance)}
                >
                  <ReportEquipementMaintenanceComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    equipementsMaintenance={equipementsMaintenance}
                    setEquipementsMaintenance={setEquipementsMaintenance}
                    equipementMaintenenceQuery={equipementMaintenenceQuery}
                    getequipementMaintenenceByReportIdReport={getequipementMaintenenceQueryRefetch}
                  ></ReportEquipementMaintenanceComponent>

                </ReportCardComponent>

                <ReportCardComponent
                  sx={{ borderRadius: "0px" }}
                  title="17. ANEXOS"
                >
                  <ReportEvidenceComponent
                    report_id={param_report_id}
                    commerce_id={param_commerce_id}
                    evidences={evidences}
                    setEvidences={setEvidneces}
                    upload_evidence_url={`commerce/${param_commerce_id ?? null}/report/${param_report_id ?? null}/reportevidence`}
                    getReportById={() => reportidQuerryReferch()}
                  ></ReportEvidenceComponent>
                </ReportCardComponent>               
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
      {
        openEvidences.open && (
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
        )
      }
      {
        handleAlert.openAlert && (
          <DialogAlertComponent
            open={handleAlert.openAlert}
            handleClose={() => handleAlert.functionAlertClose()}
            handleAgree={() => handleAlert.functionAlertAgree()}
            props={{
              tittle: handleAlert.alertTittle,
              message: handleAlert.alertMessage,
            }}
          ></DialogAlertComponent>
        )
      }
    </Grid>
  )
};
