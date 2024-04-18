import { useAppSoappLaravel } from "../../api";

export const workManagementRSSTIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/workmanagement/index`, form);
        }
    }
}

export const workManagementRSSTStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/workmanagement/store`, form);
        }
    }
}

export const workManagementRSSTUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/workmanagement/update/${form.id}`, form);
        }
    }
}

export const workManagementRSSTDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/workmanagement/destroy/${form.id}`);
        }
    }
}

export const workManagementRSSTShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/workmanagement/showbyreportid/${form.id}`);
        }
    }
}
