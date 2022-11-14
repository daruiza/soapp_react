import { useReport } from "../../api";


export const reportIndex = ({ form = {} }) => {
    return async (dispatch) => {
        const { reportApi } = useReport(dispatch);
        return reportApi.get(`api/report/index`, { params: { ...form } });
    }
}

export const reportStore = ({ form }) => {
    return async (dispatch) => {
        const { reportApi } = useEmployee(dispatch);
        if (form) {
            return reportApi.post(`api/report/store`, form);
        }
    }
}

export const reportUpdate = ({ form }) => {
    return async (dispatch) => {
        const { reportApi } = useEmployee(dispatch);
        if (form && form.id) {
            return reportApi.put(`api/report/update/${form.id}`, form);
        }
    }
}

export const reportDelete = ({ form }) => {
    return async (dispatch) => {
        const { reportApi } = useEmployee(dispatch);
        if (form && form.id) {
            return reportApi.delete(`api/report/destroy/${form.id}`);
        }
    }
}
