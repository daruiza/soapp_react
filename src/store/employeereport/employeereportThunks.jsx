import { useEmployeeReport } from "../../api";


export const employeeReportIndex = ({ form = {} }) => {
    return async (dispatch) => {
        const { employeereportApi } = useEmployeeReport(dispatch);
        return employeereportApi.get(`api/employeereport/index`, { params: { ...form } });
    }
}

export const employeeReportStore = ({ form }) => {
    return async (dispatch) => {
        const { employeereportApi } = useEmployeeReport(dispatch);
        if (form) {
            return employeereportApi.post(`api/employeereport/store`, form);
        }
    }
}

export const employeeReportDelete = ({ form }) => {
    return async (dispatch) => {
        const { employeereportApi } = useEmployeeReport(dispatch);
        if (form && form.id) {
            return employeereportApi.delete(`api/employeereport/destroy/${form.id}`);
        }
    }
}
