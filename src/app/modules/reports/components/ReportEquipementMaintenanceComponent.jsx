
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


    return (
        <div>ReportEquipementMaintenanceComponent</div>
    )
}
