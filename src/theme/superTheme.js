import { createTheme } from "@mui/material";
import { green, red } from "@mui/material/colors";

export const superTheme = createTheme({
    palette: {
        primary: {
            main: '#000000'
        },
        secondary: {
            main: '#dce8f9'
        },
        text: { 
            primary: green.A400
        },
        error: {
            main: red.A400
        },        
    }
})
