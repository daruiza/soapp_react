import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { inspectionRSSTDeleteById, inspectionRSSTShowByReportId, inspectionRSSTStore, inspectionRSSTUpdate } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useWorkManagementByReportId = (dataQueryinit = {}, fnSuccess = ()=> {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['inspection', {dataQuery, fnSuccess}],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(inspectionRSSTShowByReportId({ form: { ...dataQuery } }))
            .then(({ data: { data } }) => {
                console.log('pasa pro aqui', dataQuery);
                return data
            })
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
        mutationKey: ['inspection_delete', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(!('id' in dataQuery)){return ()=>({})}
            return dispatch(inspectionRSSTDeleteById({form: { ...dataQuery }})).then((response) => (response))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

const useWorkManagementStore = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['inspection_store', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(('id' in dataQuery)){
                return dispatch(inspectionRSSTUpdate({form: { ...dataQuery }})).then(({ data: { data: { corrective } } }) => (corrective))
            }
            return dispatch(inspectionRSSTStore({form: { ...dataQuery }})).then(({ data: { data: { corrective } } }) => (corrective))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

export { useWorkManagementByReportId, useWorkManagementDeleteId, useWorkManagementStore }