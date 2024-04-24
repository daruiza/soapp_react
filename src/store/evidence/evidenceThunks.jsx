import { useAppSoappLaravel } from "../../api";


export const evidenceByReportId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/reportevidence/showbyevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const evidenceReportStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/reportevidence/store`, form);
        }
    }
}

export const deleteReportEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/reportevidence/destroy/${form.id}`);
        }
    }
}

export const reportEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/reportevidence/update/${form.id}`, form);
        }
    }
}


// EmployeeEvidence

export const evidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/employeeevidence/store`, form);
        }
    }
}

export const evidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/employeeevidence/update/${form.id}`, form);
        }
    }
}


export const showByEmpoyeeEvidencetId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/employeeevidence/showbyemployeeevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const showByEmpoyeeReportId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/employeeevidence/showbyempoyeereportid/${form.id}`, { params: { ...form } });
        }
    }
}

export const deleteEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/employeeevidence/destroy/${form.id}`);
        }
    }
}

export const ShowByTrainingsstEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/trainingsstevidence/showbytrainingsstevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const trainingsstEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/trainingsstevidence/store`, form);
        }
    }
}

export const deleteTrainingEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/trainingsstevidence/destroy/${form.id}`);
        }
    }
}

export const trainingsstEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/trainingsstevidence/update/${form.id}`, form);
        }
    }
}

// Activity

export const ShowByActivityEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/activityevidence/showbyactivityevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const activityEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/activityevidence/store`, form);
        }
    }
}

export const deleteActivityEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/activityevidence/destroy/${form.id}`);
        }
    }
}

export const activityEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/activityevidence/update/${form.id}`, form);
        }
    }
}

// Compromise

export const ShowByCompromiseEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/compromiseevidence/showbycompromiseevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}


export const compromiseEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromiseevidence/store`, form);
        }
    }
}

export const deleteCompromiseEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/compromiseevidence/destroy/${form.id}`);
        }
    }
}

export const compromiseEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/compromiseevidence/update/${form.id}`, form);
        }
    }
}

// Compromise SST

export const ShowByCompromiseSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/compromisesstevidence/showbycompromiseevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}


export const compromiseSSTEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromisesstevidence/store`, form);
        }
    }
}

export const deleteCompromiseSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/compromisesstevidence/destroy/${form.id}`);
        }
    }
}

export const compromiseSSTEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/compromisesstevidence/update/${form.id}`, form);
        }
    }
}

// Compromise RSST

export const ShowByCompromiseRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/compromisersstevidence/showbycompromiseevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}


export const compromiseRSSTEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromisersstevidence/store`, form);
        }
    }
}

export const deleteCompromiseRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/compromisersstevidence/destroy/${form.id}`);
        }
    }
}

export const compromiseRSSTEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/compromisersstevidence/update/${form.id}`, form);
        }
    }
}

// Monitoring

export const ShowByInspectionRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/inspectionrsstevidence/showbyinspectionevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const ShowByInspectionRSSTId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/inspectionrsstevidence/showbyinspectionid/${form.id}`, { params: { ...form } });
        }
    }
}

export const inspectionRSSTEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/inspectionrsstevidence/store`, form);
        }
    }
}

export const deleteInspectionRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/compromisersstevidence/destroy/${form.id}`);
        }
    }
}

export const inspectionRSSTEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/compromisersstevidence/update/${form.id}`, form);
        }
    }
}

// Corrective 

export const ShowByCorrectiveRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/correctivemonitoringrsstevidence/showbycorrectivemonitoringevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const ShowByCorrectiveRSSTId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/correctivemonitoringrsstevidence/showbycorrectivemonitoringid/${form.id}`, { params: { ...form } });
        }
    }
}

export const inspectionRSSTCorrectiveStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/correctivemonitoringrsstevidence/store`, form);
        }
    }
}

export const deleteCorrectiveRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/correctivemonitoringrsstevidence/destroy/${form.id}`);
        }
    }
}

export const correctiveRSSTEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/correctivemonitoringrsstevidence/update/${form.id}`, form);
        }
    }
}

// Support

export const ShowBySupportGActivityEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/supportgroupactivitiyevidence/showbysupportgroupactivityevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const ShowBySupportGActivityId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/supportgroupactivitiyevidence/showbysupportgroupactivityid/${form.id}`, { params: { ...form } });
        }
    }
}


export const supportGActivityEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/supportgroupactivitiyevidence/store`, form);
        }
    }
}

export const deleteSupportGActivityEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/supportgroupactivitiyevidence/destroy/${form.id}`);
        }
    }
}

export const supportGActivityEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/supportgroupactivitiyevidence/update/${form.id}`, form);
        }
    }
}

// WorkManagement

export const ShowByWorkManagementEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/workmanagementevidence/showbyworkmanagementevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const ShowByWorkManagementId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/workmanagementevidence/showbyworkmanagementid/${form.id}`, { params: { ...form } });
        }
    }
}


export const workManagementEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/workmanagementevidence/store`, form);
        }
    }
}

export const deleteWorkManagementEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/workmanagementevidence/destroy/${form.id}`);
        }
    }
}

export const workManagementEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/workmanagementevidence/update/${form.id}`, form);
        }
    }
}


// EquipementMaintenance

export const ShowByEquipementMaintenanceEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/equipementmaintenanceevidence/showbyequipementmaintenanceevidenceid/${form.id}`, { params: { ...form } });
        }
    }
}

export const ShowByEquipementMaintenanceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/equipementmaintenanceevidence/showbyequipementmaintenanceid/${form.id}`, { params: { ...form } });
        }
    }
}


export const equipementMaintenanceEvidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/equipementmaintenanceevidence/store`, form);
        }
    }
}

export const deleteEquipementMaintenanceEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/equipementmaintenanceevidence/destroy/${form.id}`);
        }
    }
}

export const equipementMaintenanceEvidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/equipementmaintenanceevidence/update/${form.id}`, form);
        }
    }
}
