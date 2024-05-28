import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import { EvidenceItemComponent } from './EvidenceItemComponent';
import { EvidenceViewerComponent } from './EvidenceViewerComponent';
import { deleteEvidenceId, evidenceStore, showByEmpoyeeReportId } from '../../../store';
import { getSoappDownloadFile, uploadEvidence } from '../../../api/upload/uploadThuks';
import { setMessageSnackbar } from '../../../helper/setMessageSnackbar';

export const EvidencesComponent = ({ dialogtitle = '', dialogcontenttext = '', collaborator = {}, setSelectCollaborator = () => { }, collaboratorsChangeInput = () => { }, open = false, handleClose = () => { }, employee_report = {}, approved = false }) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const inputFileRef = useRef();

    const [files, setFiles] = useState([]);

    const [openEvidencesViewer, setOpenEvidencesViewer] = useState(false);

    //Init
    const EmpoyeeReporBytId = (employee_report_id) => {
        dispatch(showByEmpoyeeReportId({
            form: {
                id: employee_report_id ?? ''
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
            // file.type == 'application/x-zip-compressed' || //RAR
            file.type == 'application/x-msdownload'
        ) return;


        dispatch(uploadEvidence(file, collaborator.commerce_id, collaborator.pivot.report_id, employee_report.id))
            .then(({ data }) => {
                // Guardamos la evidencia
                dispatch(evidenceStore({
                    form: {
                        name: file.name.split('.')[0],
                        type: file.type,
                        employee_report_id: employee_report.id,
                        file: data.image_path,
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
        dispatch(deleteEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {

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

            // Refrescamos el Report Component
            EmpoyeeReporBytId(employee_report.id ?? null)
        });

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
            files: [...files.map((fl, index) => ({
                evidence:
                    collaborator?.files?.find(el => el.index === index)?.evidence ??
                    { name: fl?.name ?? '', approved: false, save: false, file: fl }
            }))
            ]
        });

        collaboratorsChangeInput({
            value: [...files.map((fl, index) => ({
                evidence:
                    collaborator?.files?.find(el => el.index === index)?.evidence ??
                    { name: '', approved: false, save: false, file: fl }
            }))
            ],
            name: 'files',
            index: collaborator?.index
        })
    }, [files])

    useEffect(() => {
        EmpoyeeReporBytId(employee_report.id ?? null)
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
                            <EvidenceItemComponent
                                key={index}
                                collaborator={collaborator}
                                setSelectCollaborator={setSelectCollaborator}
                                handleRemove={handleRemove}
                                handleEvidenceViewerOpen={handleEvidenceViewerOpen}
                                file={file}
                                approved={approved}>
                            </EvidenceItemComponent>
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
