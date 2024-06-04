import { useUpload } from './useUpload';

export const uploadPhoto = (file) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'users');
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadEmployeePhoto = (file, commerce_id) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `commerce/${commerce_id}/employee`);
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadLogo = (file) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'commerce/logos');
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadEvidence = (file, commerce_id, report_id, employee_report) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `commerce/${commerce_id}/report/${report_id}/employee_report/${employee_report}`);
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadEvidenceFileName = (file, filename) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `${filename}`);
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const getSoappFile = (form) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        if (form && form.path) {
            return uploadApi.get('api/upload/getfile', { ...form }, { responseType: 'blob' });
        }
    }
}

export const getSoappDownloadFile = (form) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        if (form && form.path) {
            return uploadApi.get('api/upload/downloadfile', { params: { ...form }, responseType: 'blob' }, { responseType: 'blob' });
        }
    }
}
