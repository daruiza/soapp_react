import { Divider, Grid } from "@mui/material";
import { useEffect } from "react";
import { EvidenceGenericComponent } from "../../../components/evidences/EvidenceGenericComponent";

export const ReportEvidenceComponent = ({
    report_id = null,
    commerce_id = null,
    supports = [],
    setsupports = () => { },
    supportGroupActionQuery = [],
    getCorrectiveMotiroringByReportIdReport = () => { } }) => {

    return (
        <Grid container>
            <EvidenceGenericComponent
            open={openEvidences.open}
            dialogtitle={openEvidences.dialogtitle}
            dialogcontenttext={openEvidences.dialogcontenttext}
            object={openEvidences.object}
            report_id={report_id}
            commerce_id={commerce_id}
            approved={openEvidences.approved}
            handleClose={() => {
              setFiles([]);
              setOpenEvidences((openEvidences) => ({ ...openEvidences, open: false }))
            }}
            upload_evidence_url={`images/commerce/${commerce_id}/report/${report_id}/correctiversst/${openEvidences?.object?.id ?? null}`}
            files={files}
            setFiles={setFiles}
            getEvidencesById={getEvidencesById}
            evidenceStore={storeCorrectiveEvidence}
            handleRemove={handleRemoveCorrectiveEvidence}
            handleFileItemUpload={handleFileItemUpload}
        ></EvidenceGenericComponent>
        </Grid>
    )
}