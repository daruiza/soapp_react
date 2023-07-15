import { useMemo } from 'react'
import { useSelector } from 'react-redux';

export const PrivateCommerceRoute = ({ children }) => {
    const { commerce: commerceState } = useSelector(state => state.commerce);
    const commerce = useMemo(() => commerceState, [commerceState]);    
    return (commerce)
        ? children
        : <></>
}
