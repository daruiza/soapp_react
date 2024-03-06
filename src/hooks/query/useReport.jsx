import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { reportIndex } from '../../store';
import { useState } from 'react';

export const useReport = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['reports', dataQuery],
        queryFn: () => dispatch(reportIndex({ form: { ...dataQuery } })).then(({ data: { data: { report } } }) => (report)),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });

    return { isSuccess: query.isSuccess, data: query.data, setDataQuery, refetch: query.refetch }
}