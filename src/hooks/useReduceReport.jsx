import { useCallback, useReducer } from "react";
import { ReportReducer } from "../app/modules/reports";

const defaultInit = { collaborators: [] };
export const useReduceReport = (init) => {

    const [state, dispatch] = useReducer(ReportReducer, init ?? defaultInit);

    const setCollaborators = useCallback((collaborators) => {
        dispatch({ type: 'init', payload: { collaborators } });
    }, [])

    const collaboratorsChangeInput = useCallback(({ value, name, index }) => {
        dispatch({ type: 'changeInput', payload: { value, name, index } });
    }, []
    )

    return { state, setCollaborators, collaboratorsChangeInput }
}
