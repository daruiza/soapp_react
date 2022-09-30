import axios from "axios";
import { useCommerce } from "../../api";
import { commerceUpdate } from "./commerceSlice";

export const getCommerceByUser = ({ User: user }) => {
    return async (dispatch) => {
        if (user && user?.id && user.rol_id === 2) {
            const { commerceApi } = useCommerce(dispatch);
            return commerceApi.get(`api/commerce/showbyuserid/${user?.id}`)
                .then(({ data: { data: { commerce: commerce } } }) => {
                    dispatch(commerceUpdate({ commerce }))
                })
        }
    }
}

export const commerceSave = ({ form }) => {
    return async (dispatch) => {
        const { commerceApi } = useCommerce(dispatch);
        if (form && form.id) {
            return commerceApi.put(`api/commerce/update/${form.id}`, form);

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
