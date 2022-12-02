import { Navigate, Route, Routes } from 'react-router-dom'
import { PrivateCustomerRoute, PrivateResponsibleRoute } from '../../middleware'
import { ReportComponent } from './components/ReportComponent'
import { ReportIndexComponent } from './components/ReportIndexComponent'

export const ReportRoute = () => {
    return (
        <>
            <PrivateCustomerRoute>
                <Routes>
                    <Route path="index" element={<ReportIndexComponent />} />
                    <Route path="report/:report_id" element={<ReportComponent />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </PrivateCustomerRoute>

            <PrivateResponsibleRoute>
                <Routes>
                    <Route path="commerce/:commerce_id" element={<ReportIndexComponent />} />
                    <Route path="commerce/:commerce_id/report/:report_id" element={<ReportComponent />} />
                </Routes>
            </PrivateResponsibleRoute>
        </>
    )
}
