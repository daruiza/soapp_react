import { useEmployee } from "../../api/employee/useEmployee";


export const employeeIndex = ({ form = {} }) => {
    return async (dispatch) => {
        const { employeeApi } = useEmployee(dispatch);
        return employeeApi.get(`api/employee/index`, { params: { ...form } });
    }
}
