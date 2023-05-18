import { useEffect, useState } from 'react';
import { Grid, IconButton, TextField, Tooltip } from '@mui/material'
import { useTheme } from '@emotion/react';
import { ImgIconsType } from '../../types/ImgIconsType';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckIcon from '@mui/icons-material/Check';

export const EvidenceItemComponent = ({ collaborator = {}, setSelectCollaborator = () => { }, handleRemove = () => { }, handleEvidenceViewerOpen = () => { }, file = {} }) => {
    const { palette } = useTheme();

    // Es el objeto {evidence: {}, file:{}}
    const [selectFile, setSelectFile] = useState({ evidence: { name: '', valid: false, file } });

    const collaboratorsChangeInputAux = ({ target }) => {
        const { name, value } = target;
        setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence, name: value } })
    }

    const handleValidToggle = () => {
        setSelectFile({ ...selectFile, evidence: { ...selectFile.evidence, valid: !selectFile.evidence.valid } })
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
                                    <Tooltip title={`${selectFile?.evidence?.valid ? 'Invalidar' : 'Validar'}`} placement="top">
                                        <IconButton onClick={() => handleValidToggle()}>
                                            {selectFile?.evidence?.valid &&
                                                <CheckIcon sx={{ color: `${palette.primary.main}` }}></CheckIcon>
                                            }
                                            {!selectFile?.evidence?.valid &&
                                                <CheckBoxOutlineBlankIcon></CheckBoxOutlineBlankIcon>
                                            }
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={12} md={3} sx={{}} >
                                    <Tooltip title="Quitar Archivo" placement="top">
                                        <IconButton onClick={() => handleRemove(file)}>
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

            </Grid >
        </>
    )
}
