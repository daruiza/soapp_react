import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateCustomerRoute, PrivateResponsibleRoute } from '../../middleware'
import { ReportIndexComponent } from './components/ReportIndexComponent'

export const ReportRoute = () => {
    return (
        <>
            <PrivateCustomerRoute>
                <Routes>
                    <Route path="index" element={<ReportIndexComponent />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </PrivateCustomerRoute>

            <PrivateResponsibleRoute>
                <Routes>
                    <Route path="commerce/:commerce_id" element={<ReportIndexComponent />} />
                </Routes>
            </PrivateResponsibleRoute>
        </>
    )
}
