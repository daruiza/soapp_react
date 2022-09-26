import { useUser } from "./useUser";


export const userSave = ({ form, user }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form && form.id) {
            return userApi.put(`api/user/update/${form.id}`, form);

        }
    }
}