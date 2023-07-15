import { messagePush } from "../store/requestapi/requestApiSlice";

export const setMessageSnackbar = ({ dispatch, error }) => {
    if (error?.response?.data?.error?.validator) {
        const { validator } = error.response.data.error;
        for (const attr of Object.keys(validator)) {
            dispatch(messagePush({
                message: validator[attr],
                alert: 'error'
            }));
        }
    }
}
