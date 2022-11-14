import axios from "axios";
import { useCommerce } from "../../api";

export const getCommerceByUser = ({ User: user }) => {
    return async (dispatch) => new Promise((resolve, reject) => {
        if (user && user?.id && user.rol_id === 2) {
            const { commerceApi } = useCommerce(dispatch);
            return commerceApi.get(`api/commerce/showbyuserid/${user?.id}`)
                .then((response) => {
                    resolve(response);
                });
        }
    });
}

export const getCommerceByCommerce = ({ commerce }) => {
    return async (dispatch) => new Promise((resolve, reject) => {
        if (commerce && commerce?.id) {
            const { commerceApi } = useCommerce(dispatch);
            return commerceApi.get(`api/commerce/showbycommerceid/${commerce?.id}`)
                .then((response) => {
                    resolve(response);
                });
        }
    });
}

export const commerceSave = ({ form }) => {
    return async (dispatch) => {
        const { commerceApi } = useCommerce(dispatch);
        if (form && form.id) {
            // Update commerce
            return commerceApi.put(`api/commerce/update/${form.id}`, form);
        } else {
            // Store commerce
            return commerceApi.post(`api/commerce/store`, form);
        }
    }
}

// Division geografica de Colombia
export const geoDivCommecerDepartamentos = () => (
    async () => new Promise((resolve, reject) => {
        axios.get(`https://www.datos.gov.co/resource/95qx-tzs7.json`)
            .then(({ data }) => {
                resolve([...new Set(data.map(x => x.departamento))])
            })
    })
);

export const geoDivCommecerMunicipios = (departamento) => (
    async () => new Promise((resolve, reject) => {
        axios.get(`https://www.datos.gov.co/resource/95qx-tzs7.json`)
            .then(({ data }) => {
                resolve(data.filter(el => el.departamento === departamento).map(el => (el.municipio)))
            })
    })
);
