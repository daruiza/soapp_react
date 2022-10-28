import { useEmployee } from "../../api/employee/useEmployee";


export const employeeIndex = ({ form = {} }) => {
    return async (dispatch) => {
        const { employeeApi } = useEmployee(dispatch);
        return employeeApi.get(`api/employee/index`, { params: { ...form } });
    }
}

export const employeeStore = ({ form }) => {
    return async (dispatch) => {
        const { employeeApi } = useEmployee(dispatch);
        if (form) {
            return employeeApi.post(`api/employee/store`, form);
        }
    }
}

export const employeeUpdate = ({ form }) => {
    return async (dispatch) => {
        const { employeeApi } = useEmployee(dispatch);
        if (form && form.id) {
            return employeeApi.put(`api/employee/update/${form.id}`, form);
        }
    }
}

export const employeeDelete = ({ form }) => {
    return async (dispatch) => {
        const { employeeApi } = useEmployee(dispatch);
        if (form && form.id) {
            return employeeApi.delete(`api/employee/destroy/${form.id}`);
        }
    }
}

