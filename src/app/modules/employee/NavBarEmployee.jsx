import { NavLink } from 'react-router-dom';
import { PrivateCommerceRoute, PrivateCustomerRoute } from '../../middleware';
import { useTheme } from '@emotion/react';

export const NavBarEmployee = () => {
    const { palette } = useTheme();
    return (
        <>
            <PrivateCustomerRoute>
                <PrivateCommerceRoute>
                    <NavLink style={{ color: `${palette.text.primary}` }} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} to="employees/index"> Colaboradores </NavLink>
                </PrivateCommerceRoute>
            </PrivateCustomerRoute>
        </>
    )
}
