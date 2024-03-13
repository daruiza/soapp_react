import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { correctiveRSSTShowByReportId, correctiveRSSTDeleteById, correctiveRSSTStore, correctiveRSSTUpdate } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useCorrectiveRSSTByReportId = (dataQueryinit = {}, fnSuccess = ()=> {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['correctives', {dataQuery, fnSuccess}],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(correctiveRSSTShowByReportId({ form: { ...dataQuery } })).then(({ data: { data } }) => (data))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: (response) => fnSuccess(response)
    });

    return { isSuccess: query.isSuccess, isRefetching: query.isRefetching, data: query.data, setDataQuery, refetch: query.refetch }
}

const useCorectiveRSSTDeleteId = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['corrective_delete', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(!('id' in dataQuery)){return ()=>({})}
            return dispatch(correctiveRSSTDeleteById({form: { ...dataQuery }})).then((response) => (response))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

const useCorectiveRSSTStore = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['corrective_store', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(('id' in dataQuery)){
                return dispatch(correctiveRSSTUpdate({form: { ...dataQuery }})).then(({ data: { data: { corrective } } }) => (corrective))
            }
            return dispatch(correctiveRSSTStore({form: { ...dataQuery }})).then(({ data: { data: { corrective } } }) => (corrective))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

export { useCorrectiveRSSTByReportId, useCorectiveRSSTDeleteId, useCorectiveRSSTStore }