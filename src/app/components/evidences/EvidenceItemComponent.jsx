import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { evidenceStore } from '../../../store';

import { setMessageSnackbar } from '../../../helper/setMessageSnackbar';

import { Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { useTheme } from '@emotion/react';
import { ImgIconsType } from '../../types/ImgIconsType';
import { DialogAlertComponent } from '../../components';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { uploadEvidence } from '../../../api/upload/uploadThuks';

export const EvidenceItemComponent = ({ employee_report = {}, collaborator = {}, setSelectCollaborator = () => { }, handleRemove = () => { }, handleEvidenceViewerOpen = () => { }, file = {} }) => {

    const dispatch = useDispatch();

    const { palette } = useTheme();
    const [openFileDelete, setOpenDeleteFile] = useState(false);

    // Es el objeto {evidence: {}, file:{}}    
    const [selectFile, setSelectFile] = useState({
        evidence: {
            name: file.name.split('.')[0],
            approved: false,            
            file
        }
    });

    const collaboratorsChangeInputAux = ({ target }) => {
        const { name, value } = target;
        setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence, name: value } })
    }

    const handleApprovedToggle = () => {
        setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence, approved: !selectFile.evidence.approved } })
    }

    const handleSave = (event) => {
        event.preventDefault();        
        //Validación existencia de Imagen
        dispatch(uploadEvidence(file, collaborator.commerce_id, collaborator.pivot.report_id))
            .then(({ data }) => {
                dispatch(evidenceStore({
                    form: {
                        ...selectFile?.evidence ?? {},
                        employee_report_id: employee_report.id,
                        file: data.storage_image_path                        
                    }
                })).then((response) => {                    
                    setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence } })
                    //getEmployees();// Refrescamos la tabla
                    //handleClose();            
                }, error => setMessageSnackbar({ dispatch, error }))
            }, error => setMessageSnackbar({ dispatch, error }));

    }

    const handleFileDeleteClose = () => {
        setOpenDeleteFile(false);
    }

    const handleFileDeleteOpen = (file) => {
        setOpenDeleteFile(true);
    }


    // observable de selectFile
    useEffect(() => {
        if (selectFile?.evidence?.file || selectFile?.evidence?.name) {
            // Se debe actualizar el collaborator
            setSelectCollaborator({
                ...collaborator,
                files: [
                    ...collaborator?.files?.filter(el => el?.evidence?.file !== selectFile?.evidence?.file),
                    { ...selectFile }
                ]
            });
        }

    }, [selectFile]);

    useEffect(() => {
        // console.log('ActualizacionCollaborator', collaborator);
    }, [collaborator])


    useEffect(() => {
        // console.log('selectFile', selectFile);
        // console.log('EvidenceItemcollaborator', collaborator);
    }, [])

    return (
        <>
            <Grid item xs={12} md={4} sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "8px",

            }}>
                <Grid item xs={12} md={11} sx={{
                    border: "1px solid",
                    borderColor: `${palette.primary.support}`,
                    boxShadow: `1px 1px ${palette.primary.main}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingBottom: "8px",
                    paddingTop: "8px"
                }} >

                    <Grid item xs={12} md={5} sx={{
                        height: "90px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }} >
                        <img
                            style={{ maxHeight: "85%", maxWidth: "85%", cursor: "pointer" }}
                            src={ImgIconsType.setSrcIcon(file.type)}
                            alt="PDFicon"
                            loading="lazy"
                            onClick={handleEvidenceViewerOpen} />
                    </Grid>

                    <Grid item xs={12} md={7} sx={{}}>

                        <Grid item xs={12} md={11} sx={{}} >
                            <Grid container sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end' }}>
                                <Grid item xs={12} md={3} >
                                    <Tooltip title={`${selectFile?.evidence?.approved ? 'Invalidar' : 'Validar'}`} placement="top">
                                        <IconButton onClick={() => handleApprovedToggle()}>
                                            {selectFile?.evidence?.approved &&
                                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                            }
                                            {!selectFile?.evidence?.approved &&
                                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                            }
                                        </IconButton>
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={12} md={3} sx={{}} >
                                    <Tooltip title="Guardar Archivo" placement="top">
                                        <IconButton  onClick={(event) => handleSave(event)}>
                                            <SaveIcon></SaveIcon>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={12} md={3} sx={{}} >
                                    <Tooltip title="Quitar Archivo" placement="top">
                                        <IconButton onClick={() => handleFileDeleteOpen(file)}>
                                            <CancelIcon></CancelIcon>
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={12} md={11} sx={{}} >
                            <Tooltip title={selectFile?.evidence?.name}>
                                <TextField
                                    variant="standard"
                                    size="small"
                                    label="Nombre"
                                    type="text"
                                    fullWidth
                                    name="name"
                                    value={selectFile?.evidence?.name}
                                    onChange={collaboratorsChangeInputAux}
                                />
                            </Tooltip>

                        </Grid>
                    </Grid>

                </Grid>
                {
                    openFileDelete && <DialogAlertComponent
                        open={openFileDelete}
                        handleClose={handleFileDeleteClose}
                        handleAgree={() => handleRemove(file)}
                        props={{
                            tittle: 'Eliminar Archivo',
                            message: `Estas segur@ de eliminar el archivo ${file?.name?.split('.')[0] ?? ''}`
                        }}
                    ></DialogAlertComponent>
                }
            </Grid >
        </>
    )
}
