
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
    getequipementMaintenenceQueryRefetch = () => { }
}) => {



    return (
        <div>ReportEquipementMaintenanceComponent</div>
    )
}
