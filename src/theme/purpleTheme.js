import { createTheme } from "@mui/material";
import { red } from "@mui/material/colors";

export const purpleTheme = createTheme({
    palette: {
        primary: {
            main: '#69a1f3'
        },
        secondary: {
            main: '#543884'
        },
        error: {
            main: red.A400
        }
    },
    overrides: {
        CssBaseline: {
            "@global": {
                ".bglight": {
                    color: "white !important",
                    backgroundColor: "#69a1f3 !important"
                },
            },
        },
    }
})
