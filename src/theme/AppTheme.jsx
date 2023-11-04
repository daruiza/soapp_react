import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { useSelector } from 'react-redux';
import { ThemeTypes } from '../app/types';

export const AppTheme = ({ children }) => {
    const { user } = useSelector(state => state.auth);    
    const theme = user && ThemeTypes[user?.theme] ? ThemeTypes[user?.theme] : ThemeTypes['skyblue'];
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    )
}
