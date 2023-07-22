import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

export const DialogAlertComponent = ({ children, props = {}, open = false, handleClose = () => { }, handleAgree = () => { } }) => {

    // MuiDialog-paper
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className = { props?.children? 'dialog-soapp-custome': '' }
            >
            {
                !props?.children &&
                <DialogTitle id="alert-dialog-title">{props?.tittle ?? ``}</DialogTitle>
            }
            <DialogContent sx={{ backgroundColor: props?.children ? 'transparent' : '' }}>
                {props?.children && children}
                {
                    'message' in props &&
                    <DialogContentText id="alert-dialog-description">
                        {props.message}
                    </DialogContentText>
                }
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>{props?.cancel ?? `Cerrar`}</Button>
                <Button
                    sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`,
                        border: '1px solid'
                    }}
                    onClick={handleAgree} autoFocus>{props?.agree ?? `Aceptar`}</Button>
            </DialogActions>
        </Dialog>
    )
}
