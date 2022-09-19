import { useUpload } from './useUpload';

export const uploadPhoto = (file) => {
    return async (dispatch) => {
        const { uploadApi } = useUpload(dispatch);
        const formData = new FormData();
        formData.append('file', file);        
        formData.append('folder', 'images/users');        
        console.log('formData', formData);
        console.log('file', file);
        // uploadApi.post('api/upload/photo', formData).then((response) => {
        //     console.log(response.data);
        // });
    }
}
