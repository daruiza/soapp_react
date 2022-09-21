import { login } from "../../store";
import { useUser } from "./useUser";


export const userSave = ({ form, user }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form && form.id) {
            userApi.put(`api/user/update/${form.id}`, form).then(({ data: { data } }) => {
                // Actualizamos el usuario
                dispatch(login({ user: { ...user, ...data.user } }))
            });

        }
    }
}