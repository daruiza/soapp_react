import { Grid, TextField } from '@mui/material';
import React from 'react'

// Este componente es para mostrar los atributos estaticos en sus inputs
const initFildSet = {
    name: { show: false, md: 3, age: false },
    identification: { show: false, md: 3 },
    email: { show: false, md: 3 },
    phone: { show: false, md: 3 },
    eps: { show: false, md: 3 }
};
export const ReportEmployeeComponent = ({ collaborator: cl, fieldset = initFildSet }) => {

    const getAge = (birth_date) => {
        if (birth_date) {
            const birthDate = new Date(birth_date);
            const difference = Date.now() - birthDate.getTime();
            const age = new Date(difference);
            return `${Math.abs(age.getUTCFullYear() - 1970)}`;
        }
    }

    return (
        <>
            {
                fieldset?.name?.show &&
                <Grid item xs={12} md={fieldset?.name?.md} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        label={cl?.lastname}
                        type="text"
                        fullWidth
                        name="name"
                        value={`${cl?.name} ${fieldset?.name?.age ? getAge(cl?.birth_date) : ''}`}
                        disabled
                    />
                </Grid>
            }

            {
                fieldset?.identification?.show &&
                <Grid item xs={12} md={fieldset?.identification?.md} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        label={cl?.identification_type}
                        type="text"
                        fullWidth
                        name="identification"
                        value={cl?.identification}
                        disabled
                    />
                </Grid>
            }

            {
                fieldset?.email?.show &&
                <Grid item xs={12} md={fieldset?.email?.md} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        label="Correo Electrónico"
                        type="text"
                        fullWidth
                        name="email"
                        value={cl?.email}
                        disabled
                    />
                </Grid>
            }

            {
                fieldset?.phone?.show &&
                <Grid item xs={12} md={fieldset?.phone?.md} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        label="Teléfono"
                        type="text"
                        fullWidth
                        name="phone"
                        value={cl?.phone}
                        disabled
                    />
                </Grid>
            }

            {
                fieldset?.eps?.show &&
                <Grid item xs={12} md={fieldset?.eps?.md} sx={{ mb: 1, pr: 0.5, pl: 0.5 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        label="EPS"
                        type="text"
                        fullWidth
                        name="eps"
                        value={cl?.eps}
                        disabled
                    />
                </Grid>
            }
        </>
    )
}
