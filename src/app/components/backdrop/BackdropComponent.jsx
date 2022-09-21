import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material'

export const BackdropComponent = () => {
    const { open } = useSelector(state => state.requestApi);
    const isOpen = useMemo(() => open === true, [open])
    return (
        <Backdrop
            sx={{
                color: '#fff',
                // zIndex: (theme) => theme.zIndex.drawer + 1,
                zIndex: 12000
            }}
            open={isOpen}
        >
            <CircularProgress color="primary" />
        </Backdrop>
    )
}
