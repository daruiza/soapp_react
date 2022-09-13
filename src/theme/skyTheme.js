import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const skyTheme = createTheme({
    palette: {
        primary: {
            main: '#69a1f3'
        },
        secondary: {
            main: '#dce8f9'
        },
        text: { 
            primary: '#0000008C'
        },
        error: {
            main: red.A400
        },
    }
})
