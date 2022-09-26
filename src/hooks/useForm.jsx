import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm = {}, formValidations = {}) => {

    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setformValidation] = useState({});
    const [formTouched, setTouched] = useState({});

    const [formInit, setFormInit] = useState(JSON.stringify(initialForm));
    const [formChange, setformChange] = useState(false);

    useEffect(() => {
        createValidators();
        setformChange(!(JSON.stringify(formState) === formInit));
    }, [formState]);

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
        setTouched({
            ...formTouched,
            [`${name}Toched`]: true
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

    const onResetForm = ({ initialForm, formState }) => {
        setFormState(initialForm)
        setFormInit(JSON.stringify(formState));
        setformChange(!(JSON.stringify(formState) === formInit));
    }

    const createValidators = () => {
        const formChechedValues = {};
        for (const formField of Object.keys(formValidations)) {
            const [fn, errorMessage = 'Este Campo es requerido.'] = formValidations[formField];
            formChechedValues[`${formField}Valid`] = fn(formState[formField]) ? null : errorMessage;
        }
        setformValidation(formChechedValues)

    }

    // Asignacion simple de un Input del Form
    const setInput = (name, value) => {
        setFormState({
            ...formState,
            [name]: value
        });
    }

    return {
        ...formState,
        ...formValidation,
        ...formTouched,
        formInit,
        isFormValid,
        formState,
        formValidation,
        formTouched,
        formChange,
        setInput,
        onInputChange,
        onInputClick,
        onResetForm,
    }
}