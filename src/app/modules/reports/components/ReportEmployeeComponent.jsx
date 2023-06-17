import { Grid, TextField } from '@mui/material';
import React from 'react'

// Este componente es para mostrar los atributos estaticos en sus inputs
const initShow = {
    name: false,
    age: false,
    identification: false,
    email: false,
    phone: false,
};
export const ReportEmployeeComponent = ({ collaborator: cl, show = initShow }) => {

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
                show.name &&
                <Grid item xs={12} md={3} sx={{ mb: 3, pr: 0.5, pl: 0.5 }}>
                    <TextField
                        variant="standard"
                        size="small"
                        label={cl?.lastname}
                        type="text"
                        fullWidth
                        name="name"
                        value={`${cl?.name} ${show.age ? getAge(cl?.birth_date) : ''}`}
                        disabled
                    />
                </Grid>
            }
        </>
    )
}
