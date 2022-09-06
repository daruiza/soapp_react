import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginComponent, SinginComponent } from './modules/access'

import { HomeComponent } from './modules/home/components/HomeComponent'

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="singin" element={<SinginComponent />} />
                <Route path="login" element={<LoginComponent />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}
