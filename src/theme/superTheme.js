import { createTheme } from "@mui/material";
import { green, red } from "@mui/material/colors";
import { esES } from '@mui/material/locale';

export const superTheme = createTheme({
    palette: {
        primary: {
            main: 'rgb(72 10 116)',
            support: '#c1d6f5',
            pending: '#F9E79F'
        },
        secondary: {
            main: '#dce8f9'
        },
        text: { 
            primary: green.A400,
            secondary: 'rgb(72 10 116)',
            support: '#c1d6f5'
        },
        error: {
            main: red.A400
        },        
    }, esES
})
