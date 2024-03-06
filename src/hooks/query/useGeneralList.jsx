import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { genericListGetByName } from '../../store/genericlist/genericlistThunks';

export const useGeneralList = (name = '', dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: [name, dataQuery],
        queryFn: () => dispatch(genericListGetByName({name})).then(({ data: { data: { generallist } } }) => (generallist)),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });    

    return { data: query.data, setDataQuery }
}