import { useAppSoappLaravel } from "../../api";

export const correctiveRSSTIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/correctiversst/index`, form);
        }
    }
}

export const correctiveRSSTStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/correctiversst/store`, form);
        }
    }
}

export const correctiveRSSTUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/correctiversst/update/${form.id}`, form);
        }
    }
}

export const correctiveRSSTDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/correctiversst/destroy/${form.id}`);
        }
    }
}

export const correctiveRSSTShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/correctiversst/showbyreportid/${form.id}`);
        }
    }
}