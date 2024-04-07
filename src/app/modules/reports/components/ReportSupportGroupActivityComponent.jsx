
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Divider, Grid } from "@mui/material";
import { useTheme } from '@emotion/react';

import { useGeneralList, useSupportGroupDeleteId, useSupportGroupStore } from '../../../../hooks';
import { ShowBySupportGActivityEvidenceId, supportGActivityEvidenceStore, deleteSupportGActivityEvidenceId, supportGActivityEvidenceUpdate } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';


export const ReportSupportGroupActivityComponent = ({
    report_id = null,
    commerce_id = null,
    supports = [],
    setSupports = () => { },
    supportGroupActionQuery = [],
    getSupportGrpupByReportIdReport = () => { } }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [supporstsinit, setSupporstsInit] = useState([]);
    const [files, setFiles] = useState([]);

    const [openEvidences, setOpenEvidences] = useState({
        open: false,
        dialogtitle: '',
        dialogcontenttext: '',
        object: {}
    });

    const [handleAlert, setHandleAlert] = useState({
        openAlert: false,
        functionAlertClose: () => { },
        functionAlertAgree: () => { },
        alertTittle: '',
        alertMessage: '',
        alertChildren: false
    });  


    // Query  
    const { data: supportGroupArray } = useGeneralList('support_group');

    const { mutate: supportGActivityDelete } = useSupportGroupDeleteId(
        {},
        () => {
            getSupportGrpupByReportIdReport();
            setHandleAlert({ openAlert: false })
        }
    );
    
    const { mutate: supporGActivitystore } = useSupportGroupStore(
        {}, getSupportGrpupByReportIdReport
    );

     // Eventos

    // Cambios en los inputs del Array support
    const changeInputSupport = ({ target: { value, name } }, index) => {
        setSupports((cmms) => cmms.toSpliced(index, 1,
        {
            ...supports[index],
            [name]: value,
            [`${name}Touched`]: true
        })
        );
    }

    const handleDeleteSupportReport = (cmms) => {
        setHandleAlert({
          openAlert: true,
          functionAlertClose: () => setHandleAlert({ openAlert: false }),
          functionAlertAgree: () => supportGActivityDelete(cmms),
          alertTittle: 'Eliminar Registro',
          alertMessage: `Estas seguro de borrar el registro ${cmms.name}.`
        });
    }

    const handleSaveSupport = (cmms) => {    
        if (!cmms.work) {
          return;
        }
        supporGActivitystore(cmms);
    }

    const handleEvidenceOpen = (cmms) => {    
        setOpenEvidences((openEvidences) => ({
          ...openEvidences,
          dialogtitle: `Evidencias Support Activity Item: ${cmms?.work}`,
          dialogcontenttext: ``,
          object: cmms,
          approved: cmms.approved,
          open: true
        }))
    }

    // Evidences
    const getEvidencesById = (id) => {
        if (id) {
        dispatch(ShowBySupportGActivityEvidenceId({
            form: {
            id: id ?? ''
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
    }

    const storeSupportGActivityEvidence = (data, file, object) => {
        dispatch(supportGActivityEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                support_group_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveSupportGActivityEvidence = (file, object) => {
        dispatch(deleteSupportGActivityEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });
    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(supportGActivityEvidenceUpdate({
            form: {
                ...selectFile?.evidence ?? {},
                id: selectFile?.evidence?.evidence_id ?? null,
                approved: selectFile?.evidence?.approved ? 1 : 0
            }
        })).then(({ data: { data: { evidence } } }) => {

            setFormInit(JSON.stringify({
                name: evidence.name,
                approved: evidence.approved ? true : false,
            }));
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

    // Validaciones
    const supportGActivitySavevalidator = (cmms) => {
        if (!cmms.work) {
        return true;
        }
        const cmmsupporstinit = supporstsinit?.find(el => el.id === cmms.id);

        // Quitar todos los Touched 
        return 'id' in cmms ?
        JSON.stringify({
            id: cmmsupporstinit?.id,
            support_group: cmmsupporstinit?.support_group,
            date_meet: cmmsupporstinit?.date_meet,
            responsible: cmmsupporstinit?.responsible,
            tasks_copasst: cmmsupporstinit?.tasks_copasst,
            report_id: cmmsupporstinit?.report_id,
            created_at: cmmsupporstinit?.created_at,
            updated_at: cmmsupporstinit?.updated_at,
        }) ==
        JSON.stringify({
            id: cmms?.id,
            support_group: cmms?.support_group,
            date_meet: cmms?.date_meet,
            responsible: cmms?.responsible,
            tasks_copasst: cmms?.tasks_copasst,
            report_id: cmms?.report_id,
            created_at: cmms?.created_at,
            updated_at: cmms?.updated_at,
        }) :
        !!(!cmms.work)
    }


  useEffect(() => {
    if (!!supportGroupActionQuery && supportGroupActionQuery.length) {
        setSupports(supportGroupActionQuery);
        setSupporstsInit(supportGroupActionQuery);
    }
  }, [supportGroupActionQuery]);

    return (
        <Grid container> {
            supports?.length !== 0 &&
            supports?.map((cmms, index) => {
                return (
                    <Grid container key={index} >
                        <Divider sx={{ mb: 2, mt: 2, width: '100%', bgcolor: "text.primary" }} />
                        <Grid item xs={12} md={12} sx={{ display: "flex", mb: 1 }}>
                            <Grid item xs={12} md={9} sx={{ display: "flex", flexWrap: 'wrap', mb: 1, pr: 0.5, pl: 0.5 }}>

                            </Grid>
                            <Grid item xs={12} md={3} sx={{ display: "flex", mb: 1, pr: 0.5, pl: 0.5, alignItems: 'center', justifyContent: 'start' }}>

                            </Grid>
                        </Grid>
                    </Grid>
                )
            })}
        </Grid>
    )
}