import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { compromiseShowByReportId } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useCompromiseByReportId = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['compromises', dataQuery],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(compromiseShowByReportId({ form: { ...dataQuery } })).then(({ data: { data } }) => (data))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });

    return { isSuccess: query.isSuccess, data: query.data, setDataQuery, refetch: query.refetch }
}

export { useCompromiseByReportId }