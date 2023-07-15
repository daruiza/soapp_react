import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateAgentRoute } from '../../middleware'
import { EmployeeIndexComponent } from '../employee/components/EmployeeIndexComponent'
import { UserIndexComponent } from './components'

export const UserRoute = () => {
    return (
        <>
            <PrivateAgentRoute>
                <Routes>
                    <Route path="index" element={<UserIndexComponent />} />                    
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </PrivateAgentRoute>
        </>
    )
}
