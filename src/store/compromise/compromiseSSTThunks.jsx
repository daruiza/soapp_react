import { useAppSoappLaravel } from "../../api";


export const compromiseSSTIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromisesst/index`, form);
        }
    }
}

export const compromiseSSTStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromisesst/store`, form);
        }
    }
}

export const compromiseSSTUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/compromisesst/update/${form.id}`, form);
        }
    }
}

export const compromiseSSTDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/compromisesst/destroy/${form.id}`);
        }
    }
}

export const compromiseSSTShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/compromisesst/showbyreportid/${form.id}`);
        }
    }
}
