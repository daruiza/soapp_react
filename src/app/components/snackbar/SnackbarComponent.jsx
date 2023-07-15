import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Grid, IconButton, Snackbar } from '@mui/material';
import { useTheme } from '@emotion/react';

export const SnackbarComponent = () => {

    const { palette } = useTheme();


    const [messageArray, setMessageArray] = useState([]);
    const { open: stateOpen, message, alert } = useSelector(state => state.requestApi);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (message) {
            setMessageArray((array) => ([
                ...array ?? [],
                !array.find(m => message === m.message) ? { message, alert } : undefined
            ].filter(m => m)));
            setOpen(true);
            setTimeout(() => handleClose(), 6000);
        }
    }, [message]);

    const handleClose = (event, reason) => {
        setMessageArray([]);
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    return (alert && message && open) ?
        <>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} >
                <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                    <Grid container justifyContent="space-between" sx={{ display: 'flex', flexDirection: 'column' }}>
                        {
                            messageArray.map((m, key) => (
                                <Grid item key={key} sx={{ color: `${m.alert === 'error' ? palette.text.error : palette.text.succes}` }} >
                                    {m.message}
                                </Grid>
                            ))
                        }
                    </Grid>
                </Alert>
            </Snackbar >
        </>

        // <Grid
        //     sx={{
        //         position: 'absolute',
        //         bottom: '24px',
        //         left: '24px',
        //         right: 'auto',
        //         zIndex: '1400'
        //     }}>
        //     {
        //         messageArray.map((m, key) => (
        //             <Alert
        //                 key={key}
        //                 action={
        //                     <React.Fragment>
        //                         <IconButton
        //                             size="small"
        //                             aria-label="close"
        //                             color="inherit"
        //                             onClick={() => handleClose(m)}
        //                         >
        //                             <CloseIcon fontSize="small" />
        //                         </IconButton>
        //                     </React.Fragment>
        //                 }
        //                 severity={m.alert ? m.alert : 'info'}
        //                 sx={{ width: '100%', border: '1px solid', marginBottom: '5px' }}>
        //                 {m.message}
        //             </Alert>
        //         ))
        //     }
        // </Grid >
        : <></>
}
