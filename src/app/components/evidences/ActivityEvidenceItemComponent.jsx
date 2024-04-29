import { useTheme } from '@emotion/react';
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { activityEvidenceUpdate } from '../../../store';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material';
import { ImgIconsType } from '../../types/ImgIconsType';
import { PrivateAgentRoute, PrivateCustomerRoute } from '../../middleware';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';
import { DialogAlertComponent } from '../dialogalert/DialogAlertComponent';

export const ActivityEvidenceItemComponent = ({
    handleRemove = () => { },
    handleEvidenceViewerOpen = () => { },
    file = {},
    approved = false,
    handleFileItemUpload = () => { } }) => {

    const dispatch = useDispatch();

    const { palette } = useTheme();
    const [openFileDelete, setOpenDeleteFile] = useState(false);
    const [disabledSave, setDisabledSave] = useState(true);
    const [formInit, setFormInit] = useState(JSON.stringify({
        name: file.name.split('.')[0],
        approved: file.approved ? true : false,
    }));
    // Es el objeto {evidence: {}, file:{}}    
    const [selectFile, setSelectFile] = useState({
        evidence: {
            name: file.name.split('.')[0],
            type: file.type,
            evidence_id: file.evidence_id,
            approved: file.approved ? true : false,
            file
        }
    });

    const collaboratorsChangeInputAux = ({ target }) => {
        const { value } = target;
        setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence, name: value } })
    }

    const handleApprovedToggle = () => {
        setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence, approved: !selectFile.evidence.approved } })
    }

    // Se guarda solo para mostrar como se hace update entes de generalizar
    const handleUpdate = (event) => {

        dispatch(activityEvidenceUpdate({
            form: {
                ...selectFile?.evidence ?? {},
                id: selectFile?.evidence?.evidence_id ?? null,
                approved: selectFile?.evidence?.approved ? 1 : 0,

            }
        })).then(({ data: { data: { evidence } } }) => {

            setFormInit(JSON.stringify({
                name: evidence.name,
                approved: evidence.approved ? true : false,
            })
            )

            setSelectFile({
                ...selectFile,
                evidence: {
                    ...selectFile.evidence,
                    name: evidence.name,
                    approved: evidence.approved ? true : false
                }
            });
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleFileDeleteClose = () => {
        setOpenDeleteFile(false);
    }

    const handleFileDeleteOpen = (file) => {
        setOpenDeleteFile(true);
    }

    // observable de selectFile
    useEffect(() => {
        setDisabledSave(formInit === JSON.stringify({
            name: selectFile.evidence.name,
            approved: selectFile.evidence.approved
        }));
    }, [selectFile]);

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
                                <Grid item xs={12} md={3}>
                                    <Tooltip title={`${selectFile?.evidence?.approved ? 'Invalidar' : 'Validar'}`} placement="top">
                                        <span>
                                            <PrivateAgentRoute>
                                                <IconButton disabled={approved ? true : false} onClick={() => handleApprovedToggle()}>
                                                    {selectFile?.evidence?.approved &&
                                                        <CheckIcon sx={{ color: `${!approved ? palette.primary.main : null}` }}></CheckIcon>
                                                    }
                                                    {!selectFile?.evidence?.approved &&
                                                        <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                    }
                                                </IconButton>
                                            </PrivateAgentRoute>

                                            <PrivateCustomerRoute>
                                                <IconButton disabled onClick={() => handleApprovedToggle()}>
                                                    {selectFile?.evidence?.approved &&
                                                        <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                                    }
                                                    {!selectFile?.evidence?.approved &&
                                                        <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                                    }
                                                </IconButton>
                                            </PrivateCustomerRoute>
                                        </span>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} md={3} sx={{}} >
                                    <Tooltip title="Guardar Archivo" placement="top">
                                        <span>
                                            <IconButton
                                                disabled={(disabledSave || approved) ? true : false}
                                                onClick={(event) => handleFileItemUpload(selectFile, setFormInit, setSelectFile)}>
                                                <SaveIcon></SaveIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={12} md={3} sx={{}} >
                                    <Tooltip disabled={approved ? true : false} title="Quitar Archivo" placement="top">
                                        <span>
                                            <IconButton onClick={() => handleFileDeleteOpen(file)}>
                                                <CancelIcon></CancelIcon>
                                            </IconButton>
                                        </span>
                                    </Tooltip>
                                </Grid>

                                <Grid item xs={12} md={11} sx={{}} >
                                    <Tooltip title={selectFile?.evidence?.name}>
                                        <TextField
                                            disabled={approved ? true : false}
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
            </Grid>
        </>
    )
}
