import { Navigate, Route, Routes } from 'react-router-dom'
import { UserRoute } from './modules/users';
import { HomeComponent } from './modules/home';
import { AuthRoute } from './modules/auth';
import { EmployeeRoute } from './modules/employee/EmployeeRoute';
import { ReportRoute } from './modules/reports/ReportRoute';

export const AppRouter = () => {
    return (
        <>
            <Routes>
                <Route path="/" element={<HomeComponent />} />
                <Route path="users/*" element={<UserRoute />} />
                <Route path="employees/*" element={<EmployeeRoute />} />
                <Route path="reports/*" element={<ReportRoute />} />
                <Route path="auth/*" element={<AuthRoute />} />
                <Route path="/*" element={<Navigate to="/" />} />
            </Routes>
        </>
    )
}
