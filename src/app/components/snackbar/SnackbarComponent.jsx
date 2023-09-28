import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import CloseIcon from '@mui/icons-material/Close';
import { Alert, Grid, IconButton, styled } from '@mui/material';
import { useTheme } from '@emotion/react';
import { messagePush } from '../../../store';

export const SnackbarComponent = () => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [messageArray, setMessageArray] = useState([]);
    const { open: stateOpen, message, alert } = useSelector(state => state.requestApi);
    const [open, setOpen] = useState(false);


    // STYLE
    const AlertStyle = styled(Alert)(({ theme }) => ({
        opacity: '0.4',
        '&:hover': {
            opacity: '1',
        },
    }));

    useEffect(() => {
        if (message) {
            setMessageArray((array) => ([
                ...array ?? [],
                !array.find(m => message === m.message) ? { message, alert } : undefined
            ].filter(m => m)));
            setOpen(true);

        }
    }, [message]);

    const handleClose = (event) => {
        setMessageArray(array => array.filter(el => el.message !== event.message));
        dispatch(messagePush({
            message: '',
            alert: ''
        }));
    };

    useEffect(() => {
        if (messageArray.length === 0) {
            setOpen(false);
        }

        if (messageArray.length) {
            // Vamos retirando uno a uno los mensajes
            // setTimeout(() => handleClose(messageArray[0]), 3750);
        }
    }, [messageArray]);

    return (open) ?
        // <>
        //     {
        //         messageArray.length != 0 &&
        //         <Snackbar 
        //             open={open}
        //             // autoHideDuration={6000}
        //             onClose={handleClose} >
        //             <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>
        //                 <Grid container justifyContent="space-between" sx={{ display: 'flex', flexDirection: 'column' }}>
        //                     {
        //                         messageArray.map((m, key) => (
        //                             <Grid item key={key} sx={{ color: `${m.alert === 'error' ? palette.text.error : palette.text.succes}` }} >
        //                                 {m.message}
        //                             </Grid>
        //                         ))
        //                     }
        //                 </Grid>
        //             </Alert>
        //         </Snackbar >
        //     }
        // </>

        <Grid
            sx={{
                position: 'fixed',
                bottom: '24px',
                left: '24px',
                right: 'auto',
                zIndex: '1400',
            }}>
            {
                messageArray.map((m, key) => (
                    <AlertStyle
                        key={key}
                        // classes={{ root: classes.root, }}
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
                    </AlertStyle>
                ))
            }
        </Grid >
        : <></>
}
