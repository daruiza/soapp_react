import { useAppSoappLaravel } from "../../api";

export const activityStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/activity/store`, form);
        }
    }
}

export const activityUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/activity/update/${form.id}`, form);
        }
    }
}

export const activityDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/activity/destroy/${form.id}`);
        }
    }
}
