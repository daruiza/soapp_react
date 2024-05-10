import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ShowByCompromiseEvidenceId, ShowByScheduleComplianceId, compromiseDeleteById, compromiseEvidenceStore, compromiseShowByReportId, compromiseStore, compromiseUpdate, deleteCompromiseEvidenceId, deleteScheduleComplianceEvidenceId, scheduleComplianceEvidenceStore, scheduleComplianceEvidenceUpdate } from '../../../../store';
import { EvidenceGenericComponent } from '../../../components/evidences/EvidenceGenericComponent';
import { Button, Divider, FormControlLabel, Grid, IconButton, Switch, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@emotion/react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import SaveIcon from '@mui/icons-material/Save';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { DialogAlertComponent } from '../../../components';
import { getSoappDownloadFile } from '../../../../api';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';
import { useScheduleComplianceDeleteId, useScheduleComplianceStore } from '../../../../hooks/query/useScheduleCompliance';

export const ReportScheduleComplianceComponent = ({
    report_id = null,
    commerce_id = null,
    scheduleCompliances = [],
    setScheduleCompliance = ()=>{},
    scheduleComplianceQuery = [],
    getScheduleComplianceByReportIdReport = ()=>{},
}) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [scheduleComplianceinit, setScheduleComplianceInit] = useState([]);
    const [files, setFiles] = useState([]);

    const [openEvidences, setOpenEvidences] = useState({
        open: false,
        dialogtitle: '',
        dialogcontenttext: '',
        object: {}
        });

    const [handleAlert, setHandleAlert] = useState({
        openAlert: false,
        functionAlertClose: () => { },
        functionAlertAgree: () => { },
        alertTittle: '',
        alertMessage: '',
        alertChildren: false
    });   

    // Query  
    const { mutate: shceduleComplianceDelete } = useScheduleComplianceDeleteId(
        {},
        () => {
            getScheduleComplianceByReportIdReport();
            setHandleAlert({ openAlert: false })
        }
    );

    const { mutate: shceduleComplianceStore } = useScheduleComplianceStore(
        {}, getScheduleComplianceByReportIdReport
    );

     // Cambios en los inputs del Array support
     const changeInputScheduleCompliance = ({ target: { value, name } }, index) => {
        setScheduleCompliance((cmms) => cmms.toSpliced(index, 1,
            {
                ...scheduleCompliances[index],
                [name]: value,
                [`${name}Touched`]: true
            })
        );
    }

    const handleDeleteScheduleCompliance = (cmms) => {
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => shceduleComplianceDelete(cmms),
            alertTittle: 'Eliminar Registro',
            alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
        });
    }

    const handleSaveScheduleCompliance = (cmms) => {
        if (!cmms.date || !cmms.observations) {
            return;
        }
        shceduleComplianceStore(cmms);
    }

    const handleEvidenceOpen = (cmms) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias Cumplimiento de Cronogama Item: ${cmms?.work}`,
            dialogcontenttext: ``,
            object: cmms,
            approved: cmms.approved,
            open: true
        }))
    }

     // Evidences
     const getEvidencesById = (id) => {
        if (id) {
            dispatch(ShowByScheduleComplianceId({
                form: {
                    id: id ?? ''
                }
            })).then(({ data: { data: { evidence: evidences } } }) => {
                evidences.forEach(evidence => {
                    dispatch(getSoappDownloadFile({ path: evidence.file }))
                        .then((response) => {
                            const newfile = new Blob([response.data], { type: response.data.type });
                            newfile.name = evidence.name;
                            newfile.approved = evidence.approved;
                            newfile.evidence_id = evidence.id;
                            setFiles((files) => [
                                // filtra que ya no este el mismo archivo, 
                                ...files.filter(file => file.name !== newfile.name),
                                newfile
                            ])
                        })
                });
            });
        }
    }

    const storeScheduleComplianceEvidence = (data, file, object) => {
        dispatch(scheduleComplianceEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                equipement_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveScheduleComplianceEvidence = (file, object) => {
        dispatch(deleteScheduleComplianceEvidenceId({            
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });
    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(scheduleComplianceEvidenceUpdate({
            form: {
                ...selectFile?.evidence ?? {},
                id: selectFile?.evidence?.evidence_id ?? null,
                approved: selectFile?.evidence?.approved ? 1 : 0
            }
        })).then(({ data: { data: { evidence } } }) => {

            setFormInit(JSON.stringify({
                name: evidence.name,
                approved: evidence.approved ? true : false,
            }));
            setSelectFile({
                ...selectFile,
                evidence: {
                    ...selectFile.evidence,
                    name: evidence.name,
                    approved: evidence.approved ? true : false
                }
            });
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const scheduleComplianceSaveValidator = (cmms) => {
        if (
            !cmms.date ||
            !cmms.observations
        ) { return true; }

        const cmmschedulecompliance = scheduleComplianceinit?.find(el => el.id === cmms.id);

        // Quitar todos los Touched 
        return 'id' in cmms ?
            JSON.stringify({
                id: cmmschedulecompliance?.id,
                buildings: cmmschedulecompliance?.buildings,
                tools: cmmschedulecompliance?.tools,
                teams: cmmschedulecompliance?.teams,
                date: cmmschedulecompliance?.date,
                observations: cmmschedulecompliance?.observations,
                report_id: cmmschedulecompliance?.report_id,
                created_at: cmmschedulecompliance?.created_at,
                updated_at: cmmschedulecompliance?.updated_at,
            }) ==
            JSON.stringify({
                id: cmms?.id,
                buildings: cmms?.buildings,
                tools: cmms?.tools,
                teams: cmms?.teams,
                date: cmms?.date,
                observations: cmms?.observations,
                report_id: cmms?.report_id,
                created_at: cmms?.created_at,
                updated_at: cmms?.updated_at,
            }) :
            !!((!cmms.date) || (!cmms.observations))
    }

    useEffect(() => {
        if (!!scheduleComplianceQuery && scheduleComplianceQuery.length) {
            setScheduleComplianceInit(scheduleCompliances);
            // setScheduleComplianceInit(scheduleComplianceQuery);
        }
    }, [scheduleComplianceQuery]);



    return (
        <div>ReportScheduleComplianceComponent</div>
    )
}
