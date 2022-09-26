import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { PrivateCustomerRoute, PrivateNavBar } from '../../../middleware';
import { UserComponent } from '../components';
import { logoutDispatcher } from '../../../../store';
import { Avatar, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from "@mui/material";
import SettingsSuggestIcon from '@mui/icons-material/SettingsSuggest';
import CloseIcon from '@mui/icons-material/Close';
import { Settings, Work } from '@mui/icons-material';
import { CommerceComponent } from '../../commerce';

export const TooltipAvatarComponent = ({ xs = 'none', sm = 'block' }) => {
    const dispatch = useDispatch();

    const { user: userauth } = useSelector(state => state.auth);
    const user = useMemo(() => userauth, [userauth])

    const [anchorEl, setAnchorEl] = useState(null);
    const [openUser, setOpenUser] = useState(false);
    const [openCommerce, setOpenCommerce] = useState(false);

    const handleClick = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);

    const handleUserOpen = () => setOpenUser(true);
    const handleUserClose = () => setOpenUser(false);

    const handleCommerceOpen = () => setOpenCommerce(true);
    const handleCommerceClose = () => setOpenCommerce(false);

    const onLogout = () => dispatch(logoutDispatcher());

    return (
        <PrivateNavBar>
            <Box sx={{ display: { xs: xs, sm: sm }, margin: '0 10px 0 auto' }}>
                <Tooltip title="Account settings">
                    <IconButton
                        onClick={handleClick}
                        size="small"
                        sx={{ ml: 1 }}
                        aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={Boolean(anchorEl) ? 'true' : undefined}                                >
                        <Avatar
                            sx={{
                                backgroundColor: 'text.primary',
                                color: 'primary.main',
                                width: 32,
                                height: 32
                            }}
                            src={user?.photo ? `${window.location.origin}${user.photo}` : null}
                        >
                            {user?.capital ?? 'A'}
                        </Avatar>
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorEl}
                    id="account-menu"
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    onClick={handleClose}
                    PaperProps={{
                        elevation: 0,
                        sx: {
                            backgroundColor: 'primary.main',
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            '&:before': {
                                content: '""',
                                display: 'block',
                                position: 'absolute',
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: 'primary.main',
                                transform: 'translateY(-50%) rotate(45deg)',
                                zIndex: 0,
                            },
                        },
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                    <MenuItem onClick={handleUserOpen}>
                        {/* <Avatar /> Perfil */}
                        <ListItemIcon>
                            {/* <Settings fontSize="small" /> */}
                            <SettingsSuggestIcon sx={{ color: "text.primary" }} fontSize="medium"></SettingsSuggestIcon>
                        </ListItemIcon>
                        Perfil
                    </MenuItem>
                    <PrivateCustomerRoute>
                        <MenuItem onClick={handleCommerceOpen}>
                            <ListItemIcon>
                                <Work sx={{ color: "text.primary" }} fontSize="medium" ></Work>
                            </ListItemIcon>
                            Negocio
                        </MenuItem>
                    </PrivateCustomerRoute>
                    <Divider sx={{ bgcolor: "text.primary" }} />
                    {/* <MenuItem>
                        <ListItemIcon>
                            <PersonAdd fontSize="small" />
                        </ListItemIcon>
                        Add another account
                    </MenuItem> */}

                    <MenuItem onClick={onLogout}>
                        <ListItemIcon>
                            <CloseIcon sx={{ color: "text.primary" }} fontSize="medium"></CloseIcon>
                        </ListItemIcon>
                        Logout
                    </MenuItem>
                </Menu>
            </Box>
            <UserComponent open={openUser} handleClose={handleUserClose} user={userauth}></UserComponent>
            <PrivateCustomerRoute>
                <CommerceComponent open={openCommerce} handleClose={handleCommerceClose} user={userauth}></CommerceComponent>
            </PrivateCustomerRoute>
        </PrivateNavBar >
    )
}
