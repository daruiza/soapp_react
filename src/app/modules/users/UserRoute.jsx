import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { PrivateResponsibleRoute } from '../../middleware'
import { UserComponent } from './components'

export const UserRoute = () => {
    return (
        <>
            <PrivateResponsibleRoute>
                <Routes>
                    <Route path="index" element={<UserComponent />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                </Routes>
            </PrivateResponsibleRoute>
        </>
    )
}
