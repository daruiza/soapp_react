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
        error: {
            main: red.A400
        },        
    }
})
