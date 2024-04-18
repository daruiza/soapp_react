import { useAppSoappLaravel } from "../../api";

export const workManagementIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/workmanagement/index`, form);
        }
    }
}

export const workManagementStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/workmanagement/store`, form);
        }
    }
}

export const workManagementUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/workmanagement/update/${form.id}`, form);
        }
    }
}

export const workManagementDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/workmanagement/destroy/${form.id}`);
        }
    }
}

export const workManagementShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/workmanagement/showbyreportid/${form.id}`);
        }
    }
}
