import { Navigate, Route, Routes } from 'react-router-dom'
import { UserRoute } from '../modules/users';
import { HomeComponent } from '../modules/home';
import { AccesRoute } from '../modules/access';

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="users/*" element={<UserRoute />} />
                <Route path="acces/*" element={<AccesRoute />} />
                {/* <Route path="/*" element={<Navigate to="/" />} /> */}
            </Routes>
        </>
    )
}
