import { NavLink } from 'react-router-dom';
import { PrivateCommerceRoute, PrivateCustomerRoute } from '../../middleware';
import { useTheme } from '@emotion/react';

export const NavBarReport = () => {
    const { palette } = useTheme();
    return (
        <>
            <PrivateCustomerRoute>
                <PrivateCommerceRoute>
                    <NavLink style={{ color: `${palette.text.primary}` }} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="reports/index"> Reportes </NavLink>
                </PrivateCommerceRoute>
            </PrivateCustomerRoute>
        </>
    )
}
