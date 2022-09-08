import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { AppTheme } from '../theme/AppTheme';
import { AppRouter } from './router';
import { NavBar } from './NavBar';

function App() {
  return (
    <AppTheme>      
      <NavBar />
      <AppRouter />
    </AppTheme>
  )
}

export default App
