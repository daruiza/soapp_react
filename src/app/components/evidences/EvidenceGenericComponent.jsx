import { useTheme } from '@emotion/react';
import { Dialog, DialogContent, DialogTitle, DialogActions, Grid, Button, DialogContentText } from '@mui/material'
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setMessageSnackbar } from '../../../helper/setMessageSnackbar';
import { uploadEvidenceFileName } from '../../../api';
import { ActivityEvidenceItemComponent } from './ActivityEvidenceItemComponent';
import { EvidenceViewerComponent } from './EvidenceViewerComponent';

export const EvidenceGenericComponent = ({
    dialogtitle = '',
    dialogcontenttext = '',
    open = false,
    handleClose = () => { },
    object = {},
    commerce_id = null,
    report_id = null,
    approved = false,
    upload_evidence_url = '',
    files = [],
    setFiles = () => { },
    getEvidencesById = () => { },
    evidenceStore = () => { },
    handleRemove = () => { },
    handleFileItemUpload = () => { } }
) => {

    const { palette } = useTheme();
    const dispatch = useDispatch();
    const inputFileRef = useRef();

    const [openEvidencesViewer, setOpenEvidencesViewer] = useState(false);

    //Init   

    // Events
    const AddFile = () => { inputFileRef.current.click(); }

    const callSaveFile = (file) => {
        if (
            file.type == '' || //capetas
            // file.type == 'application/x-zip-compressed' || //RAR
            file.type == 'application/x-msdownload'
        ) return;


        dispatch(uploadEvidenceFileName(file, upload_evidence_url))
            .then(({ data }) => {
                // Guardamos la evidencia
                evidenceStore(data, file, object);
            }, error => setMessageSnackbar({ dispatch, error }));
    }

    const handleInputFileChange = (event) => {
        callSaveFile(...event.target.files);
    }

    const handleDrag = (event) => {
        event.preventDefault();
        callSaveFile(...event.dataTransfer.files);
    }

    const onDragOver = (event) => {
        event.preventDefault();
    }

    const handleEvidenceViewerOpen = () => {
        setOpenEvidencesViewer(true)
    }

    const handleEvidenceViewerClose = () => {
        setOpenEvidencesViewer(false)
    }

    useEffect(() => {
        getEvidencesById(object?.id ?? null);
    }, [])


    return (
        <Dialog
            open={open}
            fullWidth={true}
            maxWidth='md'
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description">
            <DialogTitle id="alert-dialog-title">
                <Grid container justifyContent="space-between">
                    <Grid item sx={{ color: `${palette.text.secondary}` }}>
                        {dialogtitle}
                    </Grid>
                </Grid>
            </DialogTitle>
            <DialogContent>
                {dialogcontenttext &&
                    <DialogContentText id="alert-dialog-description" sx={{ mb: 2 }}>
                        {dialogcontenttext}
                    </DialogContentText>
                }
                <Grid
                    container
                    style={{
                        minHeight: "160px",
                        padding: "10px",
                        border: "1px solid",
                        borderStyle: "dashed",
                        borderColor: `${palette.primary.support}`,
                    }}

                    onDragOver={onDragOver}
                    onDrop={!approved ? handleDrag : () => { }}>
                    {
                        files.map((file, index) => (
                            <ActivityEvidenceItemComponent
                                key={index}
                                handleRemove={handleRemove}
                                handleEvidenceViewerOpen={handleEvidenceViewerOpen}
                                file={file}
                                approved={approved}
                                handleFileItemUpload={handleFileItemUpload}>
                            </ActivityEvidenceItemComponent>
                        ))
                    }
                </Grid>

                <Grid container>
                    <Grid item>
                        <form className="uploader" encType="multipart/form-data">
                            <input style={{ display: 'none' }} ref={inputFileRef} type="file" multiple={true} onChange={handleInputFileChange} />
                        </form>
                    </Grid>
                </Grid>
            </DialogContent>

            <DialogActions>
                {
                    !approved &&
                    <Button onClick={AddFile} variant="contained"
                        sx={{
                            height: '100%',
                            color: `${palette.text.primary}`,
                            border: '1px solid'
                        }} >Cargar Archivos</Button>
                }
                <Button onClick={handleClose} variant="outlined"
                    sx={{
                        height: '100%',
                        // color: `${palette.text.primary}`, 
                        border: '1px solid'
                    }} >Cerrar</Button>
            </DialogActions>
            {
                openEvidencesViewer &&
                <EvidenceViewerComponent
                    open={openEvidencesViewer}
                    files={files}
                    handleClose={handleEvidenceViewerClose}
                ></EvidenceViewerComponent>
            }
        </Dialog>
    )
}

