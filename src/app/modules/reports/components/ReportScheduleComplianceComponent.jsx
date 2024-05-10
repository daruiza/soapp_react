import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../../middleware';
import { ShowByCompromiseEvidenceId, compromiseDeleteById, compromiseEvidenceStore, compromiseShowByReportId, compromiseStore, compromiseUpdate, deleteCompromiseEvidenceId } from '../../../../store';
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


    return (
        <div>ReportScheduleComplianceComponent</div>
    )
}
