import { useState } from 'react';
import { useMutation, useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { scheduleComplianceStore, scheduleComplianceUpdate, scheduleComplianceDeleteById, scheduleComplianceShowByReportId } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useScheduleComplianceByReportId = (dataQueryinit = {}, fnSuccess = ()=> {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['schedulecompliance', {dataQuery, fnSuccess}],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(scheduleComplianceShowByReportId({ form: { ...dataQuery } }))
            .then(({ data: { data } }) => (data))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: (response) => fnSuccess(response)
    });

    return { isSuccess: query.isSuccess, isRefetching: query.isRefetching, data: query.data, setDataQuery, refetch: query.refetch }
}

const useScheduleComplianceDeleteId = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['schedulecompliance_delete', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(!('id' in dataQuery)){return ()=>({})}
            return dispatch(scheduleComplianceDeleteById({form: { ...dataQuery }})).then((response) => (response))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

const useScheduleComplianceStore = (dataQuery = {}, fnSuccess=()=>{}) => {
    const dispatch = useDispatch();    
    const query = useMutation({
        mutationKey: ['schedulecompliance_store', { dataQuery, fnSuccess}],
        mutationFn: (dataQuery) => {
            if(('id' in dataQuery)){
                return dispatch(scheduleComplianceUpdate({form: { ...dataQuery }})).then(({ data: { data: { schedulecompliance } } }) => (schedulecompliance))
            }
            return dispatch(scheduleComplianceStore({form: { ...dataQuery }})).then(({ data: { data: { schedulecompliance } } }) => (schedulecompliance))
        },
        onSuccess: (response) => fnSuccess(response)        
    });    

    return { data: query.data, mutate: query.mutate }
}

export { useScheduleComplianceByReportId, useScheduleComplianceDeleteId, useScheduleComplianceStore }