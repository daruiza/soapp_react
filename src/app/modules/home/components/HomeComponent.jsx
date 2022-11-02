import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Alert, Grid, Stack, Typography } from "@mui/material";
import { authstatusTypes } from "../../../../store";
import { RolTypes } from "../../../types";

export const HomeComponent = ({ navBarWidth = 58 }) => {
  const { status, user } = useSelector(state => state.auth);
  const CUSTOMERAUTHENTICATED = useMemo(() =>
    status === authstatusTypes.AUTHENTICATED && user?.rol?.id === RolTypes.customer,
    [status, user])

  console.log('user', user)
  console.log('CUSTOMERAUTHENTICATED', CUSTOMERAUTHENTICATED)

  return (
    <Grid container spacing={0} justifyContent="center"
      sx={{
        minHeight: `calc(100vh - ${navBarWidth}px)`,
        backgroundColor: 'secondary.main',
        padding: 2,
        alignItems: { xs: 'start', md: 'center' }
      }}
    >
      {CUSTOMERAUTHENTICATED &&
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="warning">
            {user.name}, aún no cuantas con un Comercio, en la opción: Negocio podras diligenciar los campos requeridos.
          </Alert>
        </Stack>
      }
      <Typography>HomeComponent</Typography>
    </Grid>
  )
}
