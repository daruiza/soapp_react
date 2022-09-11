import { useSelector } from 'react-redux'
import { Navigate, Route, Routes } from 'react-router-dom'
import { authstatusTypes } from '../../../store'
import { PrivateRoute, PublicRoute } from '../../middleware'
import { LoginComponent, LogoutComponent, SinginComponent } from './components'

export const AuthRoute = () => {
    const { status } = useSelector(state => state.auth);
    return (status === authstatusTypes.AUTHENTICATED)
        ? <PrivateRoute>
            <Routes>
                <Route path="logout" element={<LogoutComponent />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </PrivateRoute> :
        <PublicRoute>
            <Routes>
                <Route path="singin" element={<SinginComponent />} />
                <Route path="login" element={<LoginComponent />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </PublicRoute>
}

