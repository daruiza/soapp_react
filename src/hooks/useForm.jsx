import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {

    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setformValidation] = useState({});
    const [formTouched, setTouched] = useState({});

    useEffect(() => {
        createValidators();
    }, [formState])

    const isFormValid = useMemo(() => {
        for (const formValue of Object.keys(formValidation)) {
            if (formValidation[formValue] !== null) return false;
        }
        return true;
    }, [formValidation]);

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        });
    }

    const onInputClick = ({ target }) => {
        const { name } = target;
        if (name && !(`${name}Toched` in formTouched)) {
            setTouched({
                ...formTouched,
                [`${name}Toched`]: true
            });
        }        
    }


    const onResetForm = () => {
        setFormState(initialForm);
    }

    const createValidators = () => {
        const formChechedValues = {};
        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage = 'Este Campo es requerido.'] = formValidations[formField];
            formChechedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
        }
        setformValidation(formChechedValues)
    }

    return {
        ...formState,
        ...formValidation,
        ...formTouched,
        isFormValid,
        formState,
        formValidation,
        formTouched,
        onInputChange,
        onInputClick,
        onResetForm,
    }
}