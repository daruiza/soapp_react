import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateRoute, PublicRoute } from '../../router'
import { LoginComponent, LogoutComponent, SinginComponent } from './components'
import { AuthContext } from './context'

export const AccesRoute = () => {
    const { logged } = useContext(AuthContext)
    return (logged)
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

