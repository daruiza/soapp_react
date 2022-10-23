import { useGenericList } from "../../api/genericlist/UseGenericList";


export const genericListGetByName = ({ name = '' }) => {
    return async (dispatch) => {
        const { genericlistApi } = useGenericList(dispatch);
        return genericlistApi.get(`api/generallist/showbyname`, { params: { name } });
    }
}
