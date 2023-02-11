import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import { EvidenceItemComponent } from './EvidenceItemComponent';
import { EvidenceViewerComponent } from './EvidenceViewerComponent';

export const EvidencesComponent = ({ dialogtitle = '', dialogcontenttext = '', collaborator = {}, setSelectCollaborator = () => { }, collaboratorsChangeInput = () => { }, open = false, handleClose = () => { } }) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const inputFileRef = useRef();

    const [files, setFiles] = useState([]);

    const [openEvidencesViewer, setOpenEvidencesViewer] = useState(false);

    // Events 
    const handleInputFileChange = (event) => {
        setFiles((files) => [...files, ...[...event.target.files]
            .filter(file =>
                file.type !== '' && //capetas
                file.type !== 'application/x-zip-compressed' && //RAR
                file.type !== 'application/x-msdownload'
            )]);
    }

    const handleDrag = (event) => {
        event.preventDefault();
        setFiles((files) => [
            ...files,
            ...[...event.dataTransfer.files]
                .filter(file =>
                    file.type !== '' && //capetas
                    file.type !== 'application/x-zip-compressed' && //RAR
                    file.type !== 'application/x-msdownload'
                )]
        );
    }

    const onDragOver = (event) => {
        event.preventDefault();
    };

    const handleRemove = (file) => {
        console.log('file', file);
        console.log('collaborator', collaborator);
        setSelectCollaborator({
            ...collaborator,
            files: [...collaborator.files.filter(fl => fl.evidence.file !== file)]
        });

        collaboratorsChangeInput({
            value: [...collaborator.files.filter(fl => fl.evidence.file !== file)],
            name: 'files',
            index: collaborator?.index
        });

        setFiles((files) => [...files.filter(fl => fl !== file)]);
    }

    const openFile = (file) => {
        // setImage(URL.createObjectURL(event.target.files[0]));
    }


    const handleEvidenceViewerOpen = () => {
        setOpenEvidencesViewer(true)
    }

    const handleEvidenceViewerClose = () => {
        setOpenEvidencesViewer(false)
    }

    // Event Listeners al agregar un nuevo archivo
    useEffect(() => {

        setSelectCollaborator({
            ...collaborator,
            files: [...files.map((fl, index) => ({ evidence: collaborator?.files?.find(el => el.index === index)?.evidence ?? { name: '', valid: false, file: fl } }))]
        });

        collaboratorsChangeInput({
            value: [...files.map((fl, index) => ({ evidence: collaborator?.files?.find(el => el.index === index)?.evidence ?? { name: '', valid: false, file: fl } }))],
            name: 'files',
            index: collaborator?.index
        })
    }, [files])

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
                    onDrop={handleDrag}>
                    {
                        files.map((file, index) => (
                            <EvidenceItemComponent
                                key={index}
                                collaborator={collaborator}
                                setSelectCollaborator={setSelectCollaborator}
                                handleRemove={handleRemove}
                                handleEvidenceViewerOpen={handleEvidenceViewerOpen}
                                file={file}>
                            </EvidenceItemComponent>
                        ))
                    }
                </Grid>

                <Grid container>
                    <Grid item>
                        <form className="uploader" encType="multipart/form-data">
                            <input style={{ display: 'block' }} ref={inputFileRef} type="file" multiple={true} onChange={handleInputFileChange} />
                        </form>
                    </Grid>
                </Grid>

            </DialogContent>
            <DialogActions>
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
                    collaborator={collaborator}
                    files={files}
                    handleClose={handleEvidenceViewerClose}
                ></EvidenceViewerComponent>
            }
        </Dialog>
    )
}
