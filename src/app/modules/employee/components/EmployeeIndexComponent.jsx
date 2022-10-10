import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid } from '@mui/material';

export const EmployeeIndexComponent = () => {
  const dispatch = useDispatch();
  const { commerce: commerceState } = useSelector(state => state.commerce);
  const commerce = useMemo(() => commerceState, [commerceState]);
  console.log('commerce',commerce);
  return (
    <Grid container>

    </Grid>
  )
}
