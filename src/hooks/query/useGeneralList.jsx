import { useQuery, useMutation } from 'react-query';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { genericListGetByName, genericListGetByNamelist } from '../../store/genericlist/genericlistThunks';

const useGeneralList = (name = '', dataQueryinit = {}) => {

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

const useGeneraNamelList = (name = '', fnSuccess=()=>{} ) => {

    const dispatch = useDispatch();
    const query = useMutation({
        mutationKey: [name, {name, fnSuccess}],
        mutationFn: (name)=>dispatch(genericListGetByNamelist({name})).then(({ data: { data: { generallist } } }) => (generallist)),
        onSuccess: (response) => { fnSuccess()}
        
    });    

    return { data: query.data, mutate: query.mutate }}

export { useGeneralList, useGeneraNamelList }