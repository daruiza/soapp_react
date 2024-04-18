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

import { useGeneralList, useWorkManagementDeleteId, useWorkManagementStore } from '../../../../hooks';
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
    getWorkManagementByReportIdReport = () => { } 
}) => {


  // General lsit name
  // work_activity
  // work_type
  console.log('worksManagement', worksManagement);


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
