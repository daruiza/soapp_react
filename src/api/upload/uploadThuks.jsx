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

export const uploadLogo = (file) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('folder', 'images/commerce/logos');
        return uploadApi.post('api/upload/photo', formData);
    }
}
