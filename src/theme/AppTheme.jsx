import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { skyTheme } from './skyTheme';
import { superTheme } from './superTheme';

export const AppTheme = ({ children }) => {
    return (
        <ThemeProvider theme={skyTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>

    )
}
