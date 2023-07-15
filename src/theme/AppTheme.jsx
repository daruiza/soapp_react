import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { ThemeTypes } from '../app/types';
import { skyTheme } from './skyTheme';

export const AppTheme = ({ children }) => {
    const { user } = useSelector(state => state.auth);    
    const theme = user && ThemeTypes[user?.theme] ? ThemeTypes[user?.theme] : skyTheme;
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
