import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Divider, Grid, FormControl, TextField, Select, InputLabel, MenuItem, FormHelperText, IconButton, Tooltip, Button } from "@mui/material";
import { TextareaField } from '../../../components/textarea/TextareaField';
import { EvidenceGenericComponent } from '../../../components/evidences/EvidenceGenericComponent';
import { DialogAlertComponent } from '../../../components';

import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import es from 'dayjs/locale/es';
import { useTheme } from '@emotion/react';

import { useGeneraNamelList, useWorkManagementDeleteId, useWorkManagementStore } from '../../../../hooks';
import { ShowByWorkManagementId, workManagementEvidenceStore, deleteWorkManagementEvidenceId, workManagementEvidenceUpdate } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';

import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';


export const ReportWorkManagementComponent = ({
  report_id = null,
  commerce_id = null,
  worksManagement = [],
  setWorksManagement = () => { },
  workManagementQuery = [],
  getWorkManagementByReportIdReport = () => { } }) => {

  const dispatch = useDispatch();
  const { palette } = useTheme();

  const [worksManagementinit, setWorksManagementInit] = useState([]);
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
  const { data: generalListArray, mutate: generalListQueryMutate } = useGeneraNamelList("work_activity,work_type");
  const { mutate: workManagementDelete } = useWorkManagementDeleteId(
    {},
    () => {
      getWorkManagementByReportIdReport();
      setHandleAlert({ openAlert: false })
    }
  );

  const { mutate: workManagementstore } = useWorkManagementStore(
    {}, getWorkManagementByReportIdReport
  );

  // Eventos

  // Cambios en los inputs del Array support
  const changeInputSupport = ({ target: { value, name } }, index) => {
    setWorksManagement((cmms) => cmms.toSpliced(index, 1,
      {
        ...supports[index],
        [name]: value,
        [`${name}Touched`]: true
      })
    );
  }

  const handleDeleteWorkManagement = (cmms) => {
    setHandleAlert({
      openAlert: true,
      functionAlertClose: () => setHandleAlert({ openAlert: false }),
      functionAlertAgree: () => workManagementDelete(cmms),
      alertTittle: 'Eliminar Registro',
      alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
    });
  }

  const handleSaveWorkManagement = (cmms) => {
    if (!cmms.support_group || !cmms.responsible) {
      return;
    }
    workManagementstore(cmms);
  }

  const handleEvidenceOpen = (cmms) => {
    setOpenEvidences((openEvidences) => ({
      ...openEvidences,
      dialogtitle: `Evidencias Gestión de Trabajos Activity Item: ${cmms?.work}`,
      dialogcontenttext: ``,
      object: cmms,
      approved: cmms.approved,
      open: true
    }))
  }

  // Evidences
  const getEvidencesById = (id) => {
    if (id) {
      dispatch(ShowByWorkManagementId({
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

  const storeWorkManagementEvidence = (data, file, object) => {
    dispatch(workManagementEvidenceStore({
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

  const handleRemoveWorkManagementEvidence = (file, object) => {
    dispatch(deleteWorkManagementEvidenceId({
      form: { id: file.evidence_id }
    })).then((data) => {
      setFiles((files) => [...files.filter(fl => fl !== file)]);
      // Refrescamos el Report Component
      getEvidencesById(openEvidences?.object?.id ?? null)
    });
  }

  const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
    dispatch(workManagementEvidenceUpdate({
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

  // Validaciones
  const workManagementSavevalidator = (cmms) => {
    if (
      !cmms.support_group ||
      !cmms.responsible
    ) { return true; }

    const cmmsupporstinit = supporstsinit?.find(el => el.id === cmms.id);

    // Quitar todos los Touched 
    return 'id' in cmms ?
      JSON.stringify({
        id: cmmsupporstinit?.id,
        support_group: cmmsupporstinit?.support_group,
        date_meet: cmmsupporstinit?.date_meet,
        responsible: cmmsupporstinit?.responsible,
        tasks_copasst: cmmsupporstinit?.tasks_copasst,
        report_id: cmmsupporstinit?.report_id,
        created_at: cmmsupporstinit?.created_at,
        updated_at: cmmsupporstinit?.updated_at,
      }) ==
      JSON.stringify({
        id: cmms?.id,
        support_group: cmms?.support_group,
        date_meet: cmms?.date_meet,
        responsible: cmms?.responsible,
        tasks_copasst: cmms?.tasks_copasst,
        report_id: cmms?.report_id,
        created_at: cmms?.created_at,
        updated_at: cmms?.updated_at,
      }) :
      !!((!cmms.support_group) || (!cmms.responsible))
  }

  useEffect(() => {
    if (!!worksManagement && worksManagement.length) {
      setWorksManagementInit(worksManagement);
    }
  }, [worksManagement]);

  useEffect(() => {
    generalListQueryMutate("work_activity,work_type");
  }, []);

  return (
    <Grid container> {
      worksManagement?.length !== 0 &&
      worksManagement?.map((cmms, index) => {
        return (
          <Grid container key={index} >
          </Grid>)

      })}
    </Grid>
  )
}
