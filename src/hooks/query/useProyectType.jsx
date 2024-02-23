import { useQuery } from 'react-query';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { genericListGetByName } from '../../store';

export const useProyectType = (dataQueryinit = {}) => {

    const dispatch = useDispatch();

    const [dataQuery, setDataQuery] = useState(dataQueryinit);

    const query = useQuery({
        queryKey: ['projecttype', dataQuery],
        queryFn: () => dispatch(genericListGetByName({ name: 'project' })).then(({ data: { data: { generallist } } }) => (generallist ?? [])),
        enabled: true,
        staleTime: Infinity,
        cacheTime: Infinity
    });

    return { data: query.data, setDataQuery }
}