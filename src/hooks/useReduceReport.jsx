import { useReducer } from "react";
import { ReportReducer } from "../app/modules/reports";

const form = {};
export const useReduceReport = (formInit) => {
    const [state, dispatch] = useReducer(ReportReducer, formInit ?? form);
    return { state }
}
