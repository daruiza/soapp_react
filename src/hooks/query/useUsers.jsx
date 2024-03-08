import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { userIndex } from '../../store';
import { useState } from 'react';

export const useUser = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['users', dataQuery],
        queryFn: () => dispatch(userIndex({ form: { ...dataQuery } })).then(({ data: { data: { users } } }) => (users)),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });

    return { isSuccess: query.isSuccess, data: query.data, setDataQuery, refetch: query.refetch }
}