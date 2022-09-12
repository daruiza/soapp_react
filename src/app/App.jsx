import { useDispatch } from 'react-redux';
import { initDispatcher } from '../store';
import { NavBar } from './NavBar';
import { AppRouter } from './AppRouter';
import { AppTheme } from '../theme/AppTheme';
// import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { BackdropComponent } from './components/backdrop/BackdropComponent';
import { SnackbarComponent } from './components/snackbar/SnackbarComponent';

function App() {
  const dispatch = useDispatch();
  dispatch(initDispatcher());
  return (
    <AppTheme>      
      <BackdropComponent />
      <SnackbarComponent />
      <NavBar />
      <AppRouter />
    </AppTheme>
  )
}

export default App
