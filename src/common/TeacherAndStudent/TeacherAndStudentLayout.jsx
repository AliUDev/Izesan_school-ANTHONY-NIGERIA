import * as React from 'react';
import Box from '@mui/material/Box';
import { useState } from 'react';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import CryptoJS from 'crypto-js';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ImagePopup from '../ImagePopup';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Logout } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { typeProvider } from '../../Helper/ParticipantTypeProvider';
import { storageApi } from '../../api';

const TeacherAndStudentLayout = () => {
    const rawData2 = localStorage.getItem('encrypted_data_ts')
    const decryptedData = CryptoJS.AES.decrypt(rawData2, '001').toString(CryptoJS.enc.Utf8);
    const parsedData = JSON.parse(decryptedData);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const handleImageClick = (param) => {
      setSelectedImage(param);
      handleOpenPopUp();
    };
   const handleOpenPopUp  = () => setShowPopup(true);
    const handleClosePopup = () => {
      setShowPopup(false);
      setSelectedImage(null);
    };
    const logout = () => {
        localStorage.clear();
        localStorage.setItem("counter", 0);
        localStorage.clear("startTime");
        toast.success('Logged out successfully!')
    }

    const menuList = [
        // { title: "Home", icon: <MailIcon />, url: '/' },
        // { title: "About", icon: <InboxIcon />, url: '/' },
        // { title: "Login", icon: <MailIcon />, url: '/' },
        // { title: "Home", icon: <Home />, url: '/dashboard' },
        { title: "Logout", icon: <Logout />, url: `${typeProvider() === 'student' ? '/student-login' : '/teacher-login'}`, functionCall: logout },
    ]

    const [state, setState] = React.useState(false);

    const toggleDrawer = (anchor, open) => (event) => {
        if (
            event &&
            event.type === 'keydown' &&
            (event.key === 'Tab' || event.key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250, height: '100%',}}
            role="presentation"
            className=""
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
           <div className='d-flex justify-content-center'>
            {typeProvider() !== "student" ? 
            (
                <div className='d-flex flex-column text-center'>
                <img className='rounded-circle mt-2' style={{width:"120px", height:"120px"}} onClick={()=>handleImageClick(`${storageApi}teacher/${parsedData.teacher_image}`)} src={`${storageApi}teacher/${parsedData.teacher_image}`} alt="..."/>
                {
                    showPopup &&
                    <ImagePopup open={handleOpenPopUp} onClose={handleClosePopup} imageUrl={selectedImage} />
                }
                <p className='fs-3'>Teacher</p>
                </div>

            ):(
                <div className='d-flex flex-column text-center'>
            <img className='rounded-circle mt-2' style={{width:"120px", height:"120px"}} onClick={()=>handleImageClick(`${storageApi}student/${parsedData.student_image}`)} src={`${storageApi}student/${parsedData.student_image}`} alt="..."/>
            {
                    showPopup &&
                    <ImagePopup open={handleOpenPopUp} onClose={handleClosePopup} imageUrl={selectedImage} />
                }
            <p className='fs-3'>Student</p>
            </div>
            
            )}
           </div>

            <List className='position-absolute bottom-0'>
                {menuList.map((data, index) => (
                    <Link key={index} to={data?.url} className='w-100 text-decoration-none text-muted' onClick={() => { data?.functionCall() }}>
                        <ListItem key={data} className='w-100' disablePadding>
                            <ListItemButton style={{width:"100%"}}>
                                <ListItemIcon style={{width:"100px"}}> 
                                    {data?.icon}
                                </ListItemIcon >
                                <ListItemText style={{width:"110px"}} primary={data?.title} />
                            </ListItemButton>
                        </ListItem>
                    </Link>
                ))}
            </List>
        </Box>
    );
    const [anchorEl] = React.useState(null);

    const navigate = useNavigate()

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
        >
        </Menu>
    );

  
    return (
        <div>
            <div>
                {['left'].map((anchor, index) => (
                    <SwipeableDrawer
                        key={index}
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                ))}
            </div>
            <Box sx={{ flexGrow: 1 }} >
                <AppBar sx={{ bgcolor: `${typeProvider() === 'student' ? "var(--color4)" : "var(--color3)"}` }} position="static">
                    <Toolbar>
                        <IconButton
                            onClick={toggleDrawer('left', true)}
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            noWrap
                            component="div"
                            sx={{ display: { xs: 'none', sm: 'block' } }}
                        >
                            {
                                typeProvider() === 'student' ? (
                                    <>
                                        Student Dashboard
                                    </>
                                ) : (
                                    <>
                                        Teacher Dashboard
                                    </>
                                )
                            }
                        </Typography>

                        <Box sx={{ flexGrow: 1 }} />
                        <IconButton
                         sx={{ display: { xl: 'none', xs: 'block',  md:"none" } }}
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick = {()=>navigate('/profile')}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>

                    </Toolbar>
                </AppBar>
                {/* {renderMobileMenu} */}
                {renderMenu}
            </Box>
        </div>
    )
}

export default TeacherAndStudentLayout