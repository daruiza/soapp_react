import { useUser } from "./useUser";

export const userIndex = ({ form = {} }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        console.log('form', form);
        return userApi.get(`api/user/index`, { params: { ...form } });
    }
}

export const userSave = ({ form, user }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form && form.id) {
            return userApi.put(`api/user/update/${form.id}`, form);

        }
    }
}
