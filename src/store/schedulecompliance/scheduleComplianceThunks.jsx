import { useAppSoappLaravel } from "../../api";

export const scheduleComplianceIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/complianceschedule/index`, form);
        }
    }
}

export const scheduleComplianceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/complianceschedule/store`, form);
        }
    }
}

export const scheduleComplianceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/complianceschedule/update/${form.id}`, form);
        }
    }
}

export const scheduleComplianceDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/complianceschedule/destroy/${form.id}`);
        }
    }
}

export const scheduleComplianceShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/complianceschedule/showbyreportid/${form.id}`);
        }
    }
}
