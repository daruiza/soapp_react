
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Divider, Grid, FormControl, TextField, Select, InputLabel, MenuItem, FormHelperText, IconButton, Tooltip, Button, FormControlLabel, Switch } from "@mui/material";
import { TextareaField } from '../../../components/textarea/TextareaField';
import { EvidenceGenericComponent } from '../../../components/evidences/EvidenceGenericComponent';
import { DialogAlertComponent } from '../../../components';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import { useTheme } from '@emotion/react';

import { useGeneraNamelList, useEquipementMaintenanceDeleteId, useEquipementMaintenanceStore } from '../../../../hooks';
import { ShowByEquipementMaintenanceId, equipementMaintenanceEvidenceStore, deleteEquipementMaintenanceEvidenceId, equipementMaintenanceEvidenceUpdate } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

export const ReportEquipementMaintenanceComponent = ({
    report_id = null,
    commerce_id = null,
    equipementsMaintenance = [],
    setEquipementsMaintenance = () => { },
    equipementMaintenenceQuery = [],
    getequipementMaintenenceByReportIdReport = () => { }
}) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [equipementMaintenanceinit, setEquipementMaintenanceInit] = useState([]);
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
    const { mutate: equipementMaintenanceDelete } = useEquipementMaintenanceDeleteId(
        {},
        () => {
            getequipementMaintenenceByReportIdReport();
            setHandleAlert({ openAlert: false })
        }
    );

    const { mutate: equipementMaintenancestore } = useEquipementMaintenanceStore(
        {}, getequipementMaintenenceByReportIdReport
    );

    // Cambios en los inputs del Array support
    const changeInputEquipementMaintenance = ({ target: { value, name } }, index) => {
        setEquipementsMaintenance((cmms) => cmms.toSpliced(index, 1,
            {
                ...equipementsMaintenance[index],
                [name]: value,
                [`${name}Touched`]: true
            })
        );
    }

    const handleDeleteEquipementMaintenence = (cmms) => {
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => equipementMaintenanceDelete(cmms),
            alertTittle: 'Eliminar Registro',
            alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
        });
    }

    const handleSaveEquipementMaintenenece = (cmms) => {
        if (!cmms.activity || !cmms.work_type || !cmms.workers_activity || !cmms.workers_trained) {
            return;
        }
        equipementMaintenancestore(cmms);
    }

    const handleEvidenceOpen = (cmms) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias Mantenimiento Periódico Item: ${cmms?.work}`,
            dialogcontenttext: ``,
            object: cmms,
            approved: cmms.approved,
            open: true
        }))
    }

    // Evidences
    const getEvidencesById = (id) => {
        if (id) {
            dispatch(ShowByEquipementMaintenanceId({
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

    const storeEquipementMaintenanceEvidence = (data, file, object) => {
        dispatch(equipementMaintenanceEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                work_management_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveEquipementMaintenanceEvidence = (file, object) => {
        dispatch(deleteEquipementMaintenanceEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });
    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(equipementMaintenanceEvidenceUpdate({
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

    const equipementMaintenenceSaveValidator = (cmms) => {
        if (
            !cmms.activity ||
            !cmms.work_type ||
            !cmms.workers_activity ||
            !cmms.workers_trained
        ) { return true; }

        const cmmworkmanagementinit = worksManagementinit?.find(el => el.id === cmms.id);

        // Quitar todos los Touched 
        return 'id' in cmms ?
            JSON.stringify({
                id: cmmworkmanagementinit?.id,
                activity: cmmworkmanagementinit?.activity,
                work_type: cmmworkmanagementinit?.work_type,
                workers_activity: cmmworkmanagementinit?.workers_activity,
                workers_trained: cmmworkmanagementinit?.workers_trained,
                permissions: cmmworkmanagementinit?.permissions,
                observations: cmmworkmanagementinit?.observations,
                report_id: cmmworkmanagementinit?.report_id,
                created_at: cmmworkmanagementinit?.created_at,
                updated_at: cmmworkmanagementinit?.updated_at,
            }) ==
            JSON.stringify({
                id: cmms?.id,
                activity: cmms?.activity,
                work_type: cmms?.work_type,
                workers_activity: cmms?.workers_activity,
                workers_trained: cmms?.workers_trained,
                permissions: cmms?.permissions,
                observations: cmms?.observations,
                report_id: cmms?.report_id,
                created_at: cmms?.created_at,
                updated_at: cmms?.updated_at,
            }) :
            !!((!cmms.activity) || (!cmms.work_type))
    }

    useEffect(() => {
        if (!!equipementMaintenenceQuery && equipementMaintenenceQuery.length) {
            setEquipementMaintenanceInit(equipementsMaintenance);
            // setEquipementMaintenanceInit(equipementMaintenenceQuery);
        }
    }, [equipementMaintenenceQuery]);


    return (
        <div>ReportEquipementMaintenanceComponent</div>
    )
}
