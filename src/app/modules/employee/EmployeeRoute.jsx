import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateCustomerRoute, PrivateAgentRoute } from '../../middleware'
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

            <PrivateAgentRoute>
                <Routes>
                    <Route path="commerce/:commerce_id" element={<EmployeeIndexComponent />} />
                </Routes>
            </PrivateAgentRoute>
        </>
    )
}
