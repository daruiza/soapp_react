import { useRef, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTheme } from '@emotion/react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid } from '@mui/material'
import { EvidenceItemComponent } from './EvidenceItemComponent';
import { EvidenceViewerComponent } from './EvidenceViewerComponent';
import { showByEmpoyeeReportId } from '../../../store';
import { getSoappFile } from '../../../api/upload/uploadThuks';

export const EvidencesComponent = ({ dialogtitle = '', dialogcontenttext = '', collaborator = {}, setSelectCollaborator = () => { }, collaboratorsChangeInput = () => { }, open = false, handleClose = () => { }, employee_report = {} }) => {
    const { palette } = useTheme();
    const dispatch = useDispatch();
    const inputFileRef = useRef();

    const [files, setFiles] = useState([]);
    const [url, setUrl] = useState(`http://soapp_laravel.thinkwg.com/storage/images/employee/2/3/gSlgEma2WZHpOgBWeeZfmcqHnDLZKtqMWuPTi90k.jpg`);

    const [openEvidencesViewer, setOpenEvidencesViewer] = useState(false);

    //Init
    const EmpoyeeReporBytId = (id) => {
        dispatch(showByEmpoyeeReportId({
            form: {
                id: id ?? ''
            }
        })).then(({ data: { data: { evidence } } }) => {
            // console.log('data', evidence[0].file);
            // const url = URL.createObjectURL(`http://soapp_laravel.thinkwg.com/${evidence[0].file}`)
            // `${window.location.origin}${employee.photo}`
            // const url = new URL(`http://soapp_laravel.thinkwg.com/${evidence[0].file}`);
            // console.log('url: ', url);
            // const file = new File(url.getFile());

            // console.log('file: ',  file);


        });

        dispatch(getSoappFile({ path: '/storage/images/employee/2/3/gSlgEma2WZHpOgBWeeZfmcqHnDLZKtqMWuPTi90k.jpg' }))
            // .then(({ data }) => {
            //     const blob = new File([data], 'prueba.txt', { type: blob.type });
            //     console.log('file: ', blob);
            //     setFiles((files) => [...files, blob])
            // })
            .then((data) => {

                console.log(data);
                const newfile = new File([data.data], 'name.jpeg', { type: 'image/jpeg' });
                const url = URL.createObjectURL(newfile);
                // setUrl(url);
                console.log('file: ', newfile);
                // console.log('url: ', url);
                setFiles((files) => [...files, newfile])
            })

        fetch(`http://soapp_laravel.thinkwg.com/storage/images/employee/2/3/gSlgEma2WZHpOgBWeeZfmcqHnDLZKtqMWuPTi90k.jpg`)
            .then(res => res.blob())
            .then(blob => {
                console.log('blob: ', blob);
                const file = new File([blob], 'image', { type: blob.type })
                console.log('file:', file);
            });



        //LARAVEL
        // return response()
        // ->download($file_path, "file_name",
        //     [
        //         'Content-Type' => 'application/octet-stream'
        //     ]);


    }

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
            files: [...files.map((fl, index) => ({
                evidence:
                    collaborator?.files?.find(el => el.index === index)?.evidence ??
                    { name: '', approved: false, save: false, file: fl }
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
                <a href={url}>hola</a>
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
                                employee_report={employee_report}
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
