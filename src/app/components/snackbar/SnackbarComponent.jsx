import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, IconButton, Snackbar } from '@mui/material';
import { useEffect } from 'react';

export const SnackbarComponent = () => {
    const [open, setOpen] = useState(false);
    const { open: stateOpen, message, alert } = useSelector(state => state.requestApi);

    useEffect(() => {
        if (message) {
            console.log('SnackbarComponent', { stateOpen, message });
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

    return (
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            action={action}
        >
            <Alert onClose={handleClose} severity={alert ? alert : 'info'} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    )
}
