import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateCustomerRoute, PrivateResponsibleRoute } from '../../middleware'
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

            <PrivateResponsibleRoute>
                <Routes>
                    <Route path="commerce/:commerce_id" element={<EmployeeIndexComponent />} />
                </Routes>
            </PrivateResponsibleRoute>
        </>
    )
}
