
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Grid } from '@mui/material';
import { useTheme } from '@emotion/react';
import { inspectionRSSTDeleteById, inspectionRSSTShowByReportId, inspectionRSSTUpdate } from '../../../../store/inspection/inspectionRSSTThunks';
import { ShowByInspectionRSSTEvidenceId, inspectionRSSTEvidenceStore } from '../../../../store';
import { getSoappDownloadFile } from '../../../../api';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

export const ReportInspectionRSSTComponent = ({
    report_id = null,
    commerce_id = null,
    inspections = null,
    setInspections = () => { },
    getReportById = () => { },
    getInspectionByReportIdReport = () => { } }) => {

    const dispatch = useDispatch();
    const { palette } = useTheme();

    const [inspectionsinit, setInspectionsInit] = useState([]);
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

    const getInspectionByReportId = () => {
        if (report_id) {
            dispatch(inspectionRSSTShowByReportId({
                form: { id: report_id }
            })).then(({ data: { data } }) => {
                setInspections(data);
                setInspectionsInit(data);
            })
        }
    }

    // Eventos

    // Cambios en los inputs del Array inspections
    const changeInputInspection = ({ target: { value, name } }, index) => {
        setInspections((cmms) => cmms.toSpliced(index, 1,
            {
                ...inspections[index],
                [name]: value
            })
        )
    }

    const handleEvidenceOpen = (cmms) => {
        setOpenEvidences((openEvidences) => ({
            ...openEvidences,
            dialogtitle: `Evidencias Inspección RSST Item: ${cmms?.item}`,
            dialogcontenttext: `Norma: ${cmms?.rule} -- Nombre: ${cmms?.name}`,
            object: cmms,
            approved: cmms.approved,
            open: true
        }))
    }

    const handleDeleteInspectionReport = (cmms) => {
        setHandleAlert({
            openAlert: true,
            functionAlertClose: () => setHandleAlert({ openAlert: false }),
            functionAlertAgree: () => handleDeleteInspection(cmms),
            alertTittle: 'Eliminar Registro',
            alertMessage: `Estas seguro de borrar el registro ${cmms.item}.`
        });
    }

    const handleDeleteInspection = (cmms) => {
        dispatch(inspectionRSSTDeleteById({
            form: { ...cmms }
        })).then((data) => {
            getInspectionByReportIdReport();
            setHandleAlert({ openAlert: false })
        });
    }

    const handleSaveInspection = (cmms) => {
        // Validamos que todos los campos esten llenos
        if (!cmms.work ||
            !cmms.machines ||
            !cmms.vehicles ||
            !cmms.tools ||
            !cmms.epp ||
            !cmms.cleanliness ||
            !cmms.chemicals ||
            !cmms.risk_work ||
            !cmms.emergency_item ||
            !cmms.other) {
            return;
        }

        if ('id' in cmms && cmms.id) {
            dispatch(inspectionRSSTUpdate({
                form: { ...cmms }
            })).then(({ data: { data: { inspection } } }) => {
                setInspectionsInit(cmms => ([...cmms.filter(el => el.id !== inspection.id), inspection]));
                getInspectionByReportIdReport();
            });
        } else {
            dispatch(compromiseRSSTStore({
                form: { ...cmms }
            })).then(({ data: { data: { inspection } } }) => {
                getInspectionByReportId();
            });
        }
    }

    const getEvidencesById = (id) => {
        if (id) {
            dispatch(ShowByInspectionRSSTEvidenceId({
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

    // Evidenses
    const storeInspectionEvidence = (data, file, object) => {
        dispatch(inspectionRSSTEvidenceStore({
            form: {
                name: file.name.split('.')[0],
                type: file.type,
                compromise_id: object.id,
                file: data.storage_image_path,
                approved: false
            }
        })).then(({ data: { data: { evidence } } }) => {
            file.approved = evidence?.approved ? true : false;
            file.evidence_id = evidence.id;
            setFiles((files) => [...files, file]);
        }, error => setMessageSnackbar({ dispatch, error }))
    }

    const handleRemoveCompromiseEvidence = (file, object) => {
        dispatch(deleteCompromiseRSSTEvidenceId({
            form: { id: file.evidence_id }
        })).then((data) => {
            setFiles((files) => [...files.filter(fl => fl !== file)]);
            // Refrescamos el Report Component
            getEvidencesById(openEvidences?.object?.id ?? null)
        });

    }

    const handleFileItemUpload = (selectFile, setFormInit = () => { }, setSelectFile = () => { }) => {
        dispatch(compromiseRSSTEvidenceUpdate({
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


    // Validacines
    const numberPatternValidation = (value) => {
        if (!value) return true;
        // const regex = new RegExp(/^\d+$/);
        const regex = new RegExp(/^\d*\.?\d*$/);
        return regex.test(value);
    };

    const inspectionSavevalidator = (cmms) => {
        if (!cmms.work ||
            !cmms.machines ||
            !cmms.vehicles ||
            !cmms.tools ||
            !cmms.epp ||
            !cmms.cleanliness ||
            !cmms.chemicals ||
            !cmms.risk_work ||
            !cmms.emergency_item ||
            !cmms.other) {
            return true;
        }

        
        // const cmmscompromiseinit = compormisesinit?.find(el => el.id === cmms.id);
        // return 'id' in cmms ?
        //     JSON.stringify({ ...cmmscompromiseinit, canon: cmmscompromiseinit?.canon ? true : false, approved: cmmscompromiseinit?.approved ? true : false }) ==
        //     JSON.stringify({ ...cmms, canon: cmms?.canon ? true : false, approved: cmms?.approved ? true : false }) :
        //     !!(!cmms.item ||
        //         !cmms.rule ||
        //         !cmms.name ||
        //         !cmms.dateinit ||
        //         !cmms.dateclose ||
        //         !cmms.detail ||
        //         !cmms.recommendations)
    }

    const getDate = (dateinit) => {
        const date = new Date(dateinit);
        return date.setDate(date.getDate() + 1);

    }



    useEffect(() => {
        setInspectionsInit(inspections);
        // getCompromiseByReportId();
    }, [])

    useEffect(() => {
        if (inspectionsinit.length) {
            inspections.forEach(el => {
                inspectionSavevalidator(el);
            })
        }
    }, [inspectionsinit]);


    return (
        <Grid container>
            hOLA  ReportInspectionRSSTConponent
        </Grid>
    )

}