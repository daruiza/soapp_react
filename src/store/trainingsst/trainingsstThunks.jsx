import { useAppSoappLaravel } from "../../api";

export const trainingsstStore = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/trainingsst/store`, form);
        }
    }
}

export const trainingsstDeleteById = ({ form }) => {
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form && form.id) {
            return soappLaravelApi.delete(`api/trainingsst/destroy/${form.id}`);
        }
    }
}
