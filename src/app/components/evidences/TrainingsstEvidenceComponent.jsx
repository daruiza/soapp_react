
import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import { EvidenceViewerComponent } from './EvidenceViewerComponent';
import { ShowByTrainingsstEvidenceId, deleteTrainingEvidenceId, trainingsstEvidenceStore } from '../../../store';
import { getSoappDownloadFile, uploadEvidenceFileName } from '../../../api/upload/uploadThuks';
import { setMessageSnackbar } from '../../../helper/setMessageSnackbar';
import TrainingsstEvidenceItemComponent from './TrainingsstEvidenceItemComponent';

export const TrainingsstEvidenceComponent = ({ dialogtitle = '', dialogcontenttext = '', open = false, handleClose = () => { }, trainingsst = {}, commerce_id = null, report_id = null, approved = false }) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const inputFileRef = useRef();

    const [files, setFiles] = useState([]);

    const [openEvidencesViewer, setOpenEvidencesViewer] = useState(false);

    //Init
    const TrainingsstEvidenceById = (trainingsst_id) => {
        dispatch(ShowByTrainingsstEvidenceId({
            form: {
                id: trainingsst_id ?? ''
            }
        })).then(({ data: { data: { evidence: evidences } } }) => {

            evidences.forEach(evidence => {
                dispatch(getSoappDownloadFile({ path: evidence.file }))
                    .then((response) => {
                        const newfile = new Blob([response.data], { type: response.data.type });
                        newfile.name = evidence.name;
                        newfile.approved = evidence.approved;
                        newfile.evidence_id = evidence.id;
                        setFiles((files) => [
                            // filtra que ya no este el mismo archivo, 
                            ...files.filter(file => file.name !== newfile.name),
                            newfile
                        ])
                    })
            });
        });
    }

    // Events
    const AddFile = () => { inputFileRef.current.click(); }

    const callSaveFile = (file) => {
        if (
            file.type == '' || //capetas
            file.type == 'application/x-zip-compressed' || //RAR
            file.type == 'application/x-msdownload'
        ) return;


        dispatch(uploadEvidenceFileName(file, `images/commerce/${commerce_id}/report/${report_id}/trainingsst/${trainingsst?.id}`))
            .then(({ data }) => {
                // Guardamos la evidencia
                dispatch(trainingsstEvidenceStore({
                    form: {
                        name: file.name.split('.')[0],
                        type: file.type,
                        trainingsst_id: trainingsst.id,
                        file: data.storage_image_path,
                        approved: false
                    }
                })).then(({ data: { data: { evidence } } }) => {
                    file.approved = evidence?.approved ? true : false;
                    file.evidence_id = evidence.id;

                    setFiles((files) => [...files, file]);
                }, error => setMessageSnackbar({ dispatch, error }))
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
    };

    const handleRemove = (file) => {
        dispatch(deleteTrainingEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            TrainingsstEvidenceById(trainingsst?.id ?? null)
        });

    }

    const handleEvidenceViewerOpen = () => {
        setOpenEvidencesViewer(true)
    }

    const handleEvidenceViewerClose = () => {
        setOpenEvidencesViewer(false)
    }

    useEffect(() => {
        TrainingsstEvidenceById(trainingsst?.id ?? null)
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
                            <TrainingsstEvidenceItemComponent
                                key={index}
                                handleRemove={handleRemove}
                                handleEvidenceViewerOpen={handleEvidenceViewerOpen}
                                file={file}
                                approved={approved}>
                            </TrainingsstEvidenceItemComponent>
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

