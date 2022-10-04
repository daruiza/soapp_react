import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateResponsibleRoute } from '../../middleware'
import { UserIndexComponent } from './components'

export const UserRoute = () => {
    return (
        <>
            <PrivateResponsibleRoute>
                <Routes>
                    <Route path="index" element={<UserIndexComponent />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </PrivateResponsibleRoute>
        </>
    )
}
