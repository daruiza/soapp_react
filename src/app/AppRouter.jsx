import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginComponent } from './modules/access/components/LoginComponent'
import { HomeComponent } from './modules/home/components/HomeComponent'

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="login" element={<LoginComponent />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}
