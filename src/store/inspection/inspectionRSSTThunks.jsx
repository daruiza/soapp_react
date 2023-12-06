import { useAppSoappLaravel } from "../../api";

export const inspectionRSSTIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/inspectionrsst/index`, form);
        }
    }
}

export const inspectionRSSTStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/inspectionrsst/store`, form);
        }
    }
}

export const inspectionRSSTUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/inspectionrsst/update/${form.id}`, form);
        }
    }
}

export const inspectionRSSTDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/inspectionrsst/destroy/${form.id}`);
        }
    }
}

export const inspectionRSSTShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/inspectionrsst/showbyreportid/${form.id}`);
        }
    }
}
