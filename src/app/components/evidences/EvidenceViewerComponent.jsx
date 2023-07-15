import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid } from '@mui/material'
import { useEffect, useState } from 'react'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';

export const EvidenceViewerComponent = ({ files = [], open = false, handleClose = () => { } }) => {
    const { palette } = useTheme();


    const [docs, setDocs] = useState([]);

    useEffect(() => {
        setDocs(([...files.map(el => ({ uri: URL.createObjectURL(el), fileName: el.name }))]))
    }, [])  

    return (
        <Dialog open={open}
            fullWidth={true}
            maxWidth='md'
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">

            <DialogTitle id="alert-dialog-title">
                <Grid container justifyContent="space-between">
                    <Grid item sx={{ color: `${palette.text.secondary}` }}>
                        Visualizador de archivos
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                
                <DocViewer
                    pluginRenderers={DocViewerRenderers}
                    documents={docs}
                    config={{
                        header: {
                            disableHeader: false,
                            disableFileName: false,
                            retainURLParams: false
                        }
                    }}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={handleClose} variant="outlined"
                    sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`, 
                        border: '1px solid'
                    }} >Cerrar</Button>
            </DialogActions>

        </Dialog>
    )
}
