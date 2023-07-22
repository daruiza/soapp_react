import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'

export const DialogAlertComponent = ({ children, props = {}, open = false, handleClose = () => { }, handleAgree = () => { } }) => {
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"            
        >
            <DialogTitle id="alert-dialog-title">{props?.tittle ?? ``}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {props?.children && children}
                    {'message' in props && props.message}
                </DialogContentText>
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
