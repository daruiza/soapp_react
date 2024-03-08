import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { getAllRols } from '../../store';
import { useState } from 'react';

export const useRol = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['roles', dataQuery],
        queryFn: () => dispatch(getAllRols()).then(({ data: { data } }) => (data)),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });    

    return { data: query.data, setDataQuery }
}