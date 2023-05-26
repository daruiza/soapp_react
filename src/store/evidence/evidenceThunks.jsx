import { useAppSoappLaravel } from "../../api";

export const evidenceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/evidence/store`, form);
        }
    }
}

export const showByEmpoyeeReportId = ({ form = {} }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        return soappLaravelApi.get(`api/evidence/showbyempoyeereportid/${form.id}`, { params: { ...form } });
    }
}
