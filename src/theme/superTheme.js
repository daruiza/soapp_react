import { createTheme } from "@mui/material";
import { green, red } from "@mui/material/colors";

export const superTheme = createTheme({
    palette: {
        primary: {
            main: 'rgb(72 10 116)',
            support: '#c1d6f5'
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
    }
})
