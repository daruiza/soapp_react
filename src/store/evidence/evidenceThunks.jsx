import { useAppSoappLaravel } from "../../api";

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


export const ShowByInspectionRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/inspectionrsstevidence/showbyinspectionevidenceid/${form.id}`, { params: { ...form } });
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

export const ShowByCorrectiveRSSTEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/correctivemonitoringrsstevidence/showbycorrectivemonitoringevidenceid/${form.id}`, { params: { ...form } });
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








