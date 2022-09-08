import 'bootstrap/dist/css/bootstrap.min.css';
import { AppTheme } from '../theme/AppTheme';
import './App.css'
import { NavBar, AppRouter } from './router';

function App() {
  return (
    <AppTheme>
      {/* <NavBar /> */}
      <AppRouter />
    </AppTheme>
  )
}

export default App
