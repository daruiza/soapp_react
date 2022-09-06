import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import { AppRouter } from './AppRouter'
import { NavBarHome } from './modules/home/components';



function App() {
  return (
    <>
      <NavBarHome />
      <AppRouter />
    </>
  )
}

export default App
