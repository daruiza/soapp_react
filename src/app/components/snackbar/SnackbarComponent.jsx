import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, IconButton, Snackbar } from '@mui/material';

export const SnackbarComponent = () => {
    const [open, setOpen] = useState(false);
    const { open: stateOpen, message, alert } = useSelector(state => state.requestApi);

    useEffect(() => {
        if (message) {
            setOpen(true);
            setTimeout(() => handleClose, 6000);
        }
    }, [stateOpen, message])

    const handleClose = (event) => {
        setOpen(false);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (alert && message) ?
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            action={action}
        >
            <Alert action={action} severity={alert ? alert : 'info'} sx={{ width: '100%', border: '1px solid' }}>
                {message}
            </Alert>
        </Snackbar> : <></>

}
