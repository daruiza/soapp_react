import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";
import { esES } from '@mui/material/locale';

export const skyTheme = createTheme({
    palette: {
        primary: {
            main: '#69a1f3',
            support: '#c1d6f5'
        },
        secondary: {
            main: '#dce8f9'
        },
        text: { 
            primary: '#0000008C',
            secondary: '#69a1f3',
            support: '#c1d6f5',
            disabled: 'rgba(0, 0, 0, 0.38)'
        },
        error: {
            main: red.A400
        },
    }, esES
})
