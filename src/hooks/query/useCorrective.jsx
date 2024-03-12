import { useState } from 'react';
import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { correctiveRSSTShowByReportId } from '../../store';

// dataQueryinit, debe tener un parametro llamado id, con el id de reporte
const useCorrectiveRSSTByReportId = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['correctives', dataQuery],
        queryFn: () => {    
            if(!('id' in dataQuery)){return ()=>([])}
            return dispatch(correctiveRSSTShowByReportId({ form: { ...dataQuery } })).then(({ data: { data } }) => (data))
        },
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });

    return { isSuccess: query.isSuccess, isRefetching: query.isRefetching, data: query.data, setDataQuery, refetch: query.refetch }
}

export { useCorrectiveRSSTByReportId }