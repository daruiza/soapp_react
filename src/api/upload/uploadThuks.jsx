import { useUpload } from './useUpload';

export const uploadPhoto = (file) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'images/users');
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadEmployeePhoto = (file, commerce_id) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `images/employee/${commerce_id}`);
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadLogo = (file) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'images/commerce/logos');
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const uploadEvidence = (file, commerce_id, report_id) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', `images/employee/${commerce_id}/${report_id}`);
        return uploadApi.post('api/upload/photo', formData);
    }
}

export const getSoappFile = (form) => {
    console.log('form', form);
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        if (form && form.path) {
            return uploadApi.post('api/upload/getfile',  { ...form } );
        }
        
    }
}