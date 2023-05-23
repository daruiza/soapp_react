import { useAppSoappLaravel } from "../../api";

export const evidenceStore = ({ form }) => {
    console.log('form', form);
    return async (dispatch) => {
        const { soappLaravelApi } = useAppSoappLaravel(dispatch);
        if (form) {
            return soappLaravelApi.post(`api/evidence/store`, form);
        }
    }
}



