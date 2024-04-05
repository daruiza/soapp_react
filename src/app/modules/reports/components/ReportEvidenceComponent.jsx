import { useTheme } from '@emotion/react';
import { Divider, Grid, Button } from "@mui/material";
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { ActivityEvidenceItemComponent } from '../../../components';
import { getSoappDownloadFile, uploadEvidenceFileName } from '../../../../api';
import { evidenceReportStore } from '../../../../store';
import { setMessageSnackbar } from '../../../../helper/setMessageSnackbar';

export const ReportEvidenceComponent = ({
  report_id = null,
  commerce_id = null,
  approved = false,
  evidences = [],
  upload_evidence_url = null,
  setEvidences = () => { },
  getReportById = () => { }
}) => {

  const dispatch = useDispatch();
  const inputFileRef = useRef();
  const { palette } = useTheme();

  const [files, setFiles] = useState([]);

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

  // Evidences
  const getEvidencesByReportId = (id) => {
    if (evidences.length) {
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
    }
  }

  const evidenceStore = (data, file, object) => {
    dispatch(evidenceReportStore({
      form: {
        name: file.name.split('.')[0],
        type: file.type,
        corrective_id: object.id,
        file: data.storage_image_path,
        approved: false
      }
    })).then(({ data: { data: { evidence } } }) => {
      file.approved = evidence?.approved ? true : false;
      file.evidence_id = evidence.id;
      setFiles((files) => [...files, file]);
    }, error => setMessageSnackbar({ dispatch, error }))
  }

  useEffect(() => {
    getEvidencesByReportId(report_id ?? null);
  }, [])

  return (
    <Grid container>
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
      <Grid container sx={{ display: 'flex', alignItems: 'end', justifyContent: 'end', mt: 2 }}>
        <Grid item >
          {
            !approved &&
            <Button onClick={AddFile} variant="contained"
              sx={{
                height: '100%',
                color: `${palette.text.primary}`,
                border: '1px solid'
              }} >Cargar Archivos</Button>
          }
        </Grid>
      </Grid>
    </Grid>
  )
}