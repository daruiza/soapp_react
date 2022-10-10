import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateCustomerRoute } from '../../middleware'
import { EmployeeIndexComponent } from './components/EmployeeIndexComponent'

export const EmployeeRoute = () => {
    return (
        <>
            <PrivateCustomerRoute>
                <Routes>
                    <Route path="index" element={<EmployeeIndexComponent />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </PrivateCustomerRoute>
        </>
    )
}
