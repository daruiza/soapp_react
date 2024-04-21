import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { workManagementStore, workManagementUpdate, workManagementDeleteById, workManagementShowByReportId } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useWorkManagementByReportId = (dataQueryinit = {}, fnSuccess = ()=> {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['workmanagement', {dataQuery, fnSuccess}],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(workManagementShowByReportId({ form: { ...dataQuery } }))
            .then(({ data: { data } }) => (data))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: (response) => fnSuccess(response)
    });

    return { isSuccess: query.isSuccess, isRefetching: query.isRefetching, data: query.data, setDataQuery, refetch: query.refetch }
}

const useWorkManagementDeleteId = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['workmanagement_delete', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(!('id' in dataQuery)){return ()=>({})}
            return dispatch(workManagementDeleteById({form: { ...dataQuery }})).then((response) => (response))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

const useWorkManagementStore = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['workmanagement_store', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(('id' in dataQuery)){
                return dispatch(workManagementUpdate({form: { ...dataQuery }})).then(({ data: { data: { workmanagement } } }) => (workmanagement))
            }
            return dispatch(workManagementStore({form: { ...dataQuery }})).then(({ data: { data: { workmanagement } } }) => (workmanagement))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

export { useWorkManagementByReportId, useWorkManagementDeleteId, useWorkManagementStore }