import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Grid, IconButton } from '@mui/material';

export const SnackbarComponent = () => {
    const [messageArray, setMessageArray] = useState([]);
    const { open: stateOpen, message, alert } = useSelector(state => state.requestApi);

    useEffect(() => {
        if (message) {
            setMessageArray((array) => ([
                ...array ?? [],
                !array.find(m => message === m.message) ? { message, alert } : undefined
            ].filter(m => m)));
            setTimeout(() => setMessageArray([]), 9000);
        }
    }, [message]);

    // useEffect(() => {
    //     if (messageArrayMemo.length) {
    //         setTimeout(() => {
    //             if (messageArray.length) {
    //                 const [fist, rest] = messageArray;
    //                 if (rest) {
    //                     setMessageArray(rest);
    //                 } else {
    //                     setMessageArray([]);
    //                 }
    //             }
    //         }, 9000);
    //     }
    // }, [messageArrayMemo]);

    const handleClose = (object) => {
        setMessageArray((array) => (array.filter(m => m.message !== object.message)));
    };

    return (alert && message) ?
        <Grid
            sx={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                right: 'auto',
                zIndex: '1400'
            }}>
            {
                messageArray.map((m, key) => (
                    <Alert
                        key={key}
                        action={
                            <React.Fragment>
                                <IconButton
                                    size="small"
                                    aria-label="close"
                                    color="inherit"
                                    onClick={() => handleClose(m)}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                        }
                        severity={m.alert ? m.alert : 'info'}
                        sx={{ width: '100%', border: '1px solid', marginBottom: '5px' }}>
                        {m.message}
                    </Alert>
                ))
            }
        </Grid >
        : <></>
}
