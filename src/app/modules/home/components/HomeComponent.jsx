import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Alert, Grid, Stack, Typography } from "@mui/material";
import { authstatusTypes, commerceInitialState } from "../../../../store";
import { RolTypes } from "../../../types";

export const HomeComponent = ({ navBarWidth = 58 }) => {
  const dispatch = useDispatch();

  const { status, user } = useSelector(state => state.auth);
  const { commerce: commerceState } = useSelector(state => state.commerce);
  const commerce = useMemo(() => commerceState, [commerceState]);
  const CUSTOMERAUTHENTICATED = useMemo(() =>
    status === authstatusTypes.AUTHENTICATED && user?.rol?.id === RolTypes.customer,
    [status, user]);

  useEffect(() => {
    // Inicia el commercio al entrar Home
    // Para validar lo del commercio de debe consultar con el u
    dispatch(commerceInitialState());
  }, []);

  // TODO: CONSULTAR EL COMERCIO PRA REALIZAR LA VALIDACIÓN


  return (
    <Grid container spacing={0} justifyContent="center"
      sx={{
        minHeight: `calc(100vh - ${navBarWidth}px)`,
        backgroundColor: 'secondary.main',
        padding: 2,
        alignItems: { xs: 'start', md: 'center' }
      }}
    >
      {CUSTOMERAUTHENTICATED && !commerce &&
        <Stack sx={{ width: '100%' }} spacing={2}>
          <Alert severity="warning">
            {user.name}, aún no cuantas con un Comercio, en la opción: Negocio podras diligenciar los campos requeridos.
          </Alert>
        </Stack>
      }
      <Typography sx={{fontSize: '84px', fontFamily: "'Nunito', sans-serif", fontWeight: '200'}}>SOAPP</Typography>
    </Grid>
  )
}
