import { useAppSoappLaravel } from "../../api";


export const compromiseRSSTIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromisersst/index`, form);
        }
    }
}

export const compromiseRSSTStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/compromisersst/store`, form);
        }
    }
}

export const compromiseRSSTUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/compromisersst/update/${form.id}`, form);
        }
    }
}

export const compromiseRSSTDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/compromisersst/destroy/${form.id}`);
        }
    }
}

export const compromiseRSSTShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/compromisersst/showbyreportid/${form.id}`);
        }
    }
}
