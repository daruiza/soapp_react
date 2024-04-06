import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { reportIndex, reportByreportId } from '../../store';
import { useState } from 'react';

const useReport = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['reportid', dataQuery],
        queryFn: () => dispatch(reportIndex({ form: { ...dataQuery } })).then(({ data: { data: { report } } }) => (report)),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });

    return { isSuccess: query.isSuccess, data: query.data, setDataQuery, refetch: query.refetch }
}


const useByReportId = (dataQueryinit = {}, fnSuccess = ()=> {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['reportid', {dataQuery, fnSuccess}],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(reportByreportId({ form: { ...dataQuery } })).then(({
                data: {
                  data: { report },
                },
              }) => (report))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity,
        onSuccess: (response) => fnSuccess(response)
    });

    return { isSuccess: query.isSuccess, isRefetching: query.isRefetching, data: query.data, setDataQuery, refetch: query.refetch }
}

export { useReport, useByReportId }