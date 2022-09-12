import { ThemeProvider } from '@emotion/react';
import { CssBaseline } from '@mui/material';
import { skyTheme } from './skyTheme';

export const AppTheme = ({ children }) => {
    return (
        <ThemeProvider theme={skyTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>

    )
}
