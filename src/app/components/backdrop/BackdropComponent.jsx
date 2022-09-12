import { useSelector } from 'react-redux';
import { Backdrop, CircularProgress } from '@mui/material'

export const BackdropComponent = () => {
    const { open } = useSelector(state => state.requestApi);
    return (
        <Backdrop
            sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={open}
        >
            <CircularProgress color="primary" />
        </Backdrop>
    )
}
