import { useAppSoappLaravel } from "../../api";

export const evidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/evidence/store`, form);
        }
    }
}

export const evidenceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.put(`api/evidence/update/${form.id}`, form);
        }
    }
}

export const showByEmpoyeeReportId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/evidence/showbyempoyeereportid/${form.id}`, { params: { ...form } });
        }
    }
}

export const deleteEvidenceId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/evidence/destroy/${form.id}`);
        }
    }
}
