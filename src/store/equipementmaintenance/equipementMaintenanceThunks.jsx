import { useAppSoappLaravel } from "../../api";

export const equipementMaintenanceIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/equipementmaintenance/index`, form);
        }
    }
}

export const equipementMaintenanceStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/equipementmaintenance/store`, form);
        }
    }
}

export const equipementMaintenanceUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/equipementmaintenance/update/${form.id}`, form);
        }
    }
}

export const equipementMaintenanceDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/equipementmaintenance/destroy/${form.id}`);
        }
    }
}

export const equipementMaintenanceShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/equipementmaintenance/showbyreportid/${form.id}`);
        }
    }
}
