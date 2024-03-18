import { useAppSoappLaravel } from "../../api";

export const supportGroupActivityIndex = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/supportgroupactivitiy/index`, form);
        }
    }
}

export const supportGroupActivityStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/supportgroupactivitiy/store`, form);
        }
    }
}

export const supportGroupActivityUpdate = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {            
            return soappLaravelApi.put(`api/supportgroupactivitiy/update/${form.id}`, form);
        }
    }
}

export const supportGroupActivityDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/supportgroupactivitiy/destroy/${form.id}`);
        }
    }
}

export const supportGroupActivityShowByReportId = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.get(`api/supportgroupactivitiy/showbyreportid/${form.id}`);
        }
    }
}