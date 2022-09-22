import { Grid, Typography } from '@mui/material';

export const UserComponent = ({ navBarWidth = 56 }) => {
  return (
    <Grid container spacing={0} justifyContent="center"
      sx={{
        minHeight: `calc(100vh - ${navBarWidth}px)`,
        backgroundColor: 'secondary.main',
        padding: 2,
        alignItems: { xs: 'start', md: 'center' }
      }}
    >
      <Typography>UserComponent</Typography>
    </Grid>
  )
}
