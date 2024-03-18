import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { supportGroupActivityDeleteById, supportGroupActivityShowByReportId, supportGroupActivityStore, supportGroupActivityUpdate } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useSupportGroupByReportId = (dataQueryinit = {}, fnSuccess = ()=> {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['supports', {dataQuery, fnSuccess}],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(supportGroupActivityShowByReportId({ form: { ...dataQuery } })).then(({ data: { data } }) => (data))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: (response) => fnSuccess(response)
    });

    return { isSuccess: query.isSuccess, isRefetching: query.isRefetching, data: query.data, setDataQuery, refetch: query.refetch }
}

const useSupportGroupDeleteId = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['support_delete', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(!('id' in dataQuery)){return ()=>({})}
            return dispatch(supportGroupActivityDeleteById({form: { ...dataQuery }})).then((response) => (response))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

const useSupportGroupStore = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['support_store', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(('id' in dataQuery)){
                return dispatch(supportGroupActivityUpdate({form: { ...dataQuery }})).then(({ data: { data: { corrective } } }) => (corrective))
            }
            return dispatch(supportGroupActivityStore({form: { ...dataQuery }})).then(({ data: { data: { corrective } } }) => (corrective))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

export { useSupportGroupByReportId, useSupportGroupDeleteId, useSupportGroupStore }