import { useUser } from "../../api/user/useUser";

export const userIndex = ({ form = {} }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        return userApi.get(`api/user/index`, { params: { ...form } });
    }
}

export const userStore = ({ form }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form) {
            return userApi.post(`api/user/store`, form);
        }
    }
}

export const userUpdate = ({ form }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form && form.id) {
            return userApi.put(`api/user/update`, form);
        }
    }
}

export const userUpdateById = ({ form }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form && form.id) {
            return userApi.put(`api/user/update/${form.id}`, form);
        }
    }
}

export const userDelete = ({ form }) => {
    return async (dispatch) => {
        const { userApi } = useUser(dispatch);
        if (form && form.id) {
            return userApi.delete(`api/user/destroy/${form.id}`);
        }
    }
}
