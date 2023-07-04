import * as React from 'react';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { useState } from 'react';
import ImagePopup from '../ImagePopup';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import { AccountCircle, Logout } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { encryptedData } from '../../data.provider';
import { storageApi } from '../../api';

const SchoolLayout = () => {

  const navigate = useNavigate()
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
    toast.success('Logged out successfully!')
  }

  const menuList = [
    // { title: "Home", icon: <MailIcon />, url: '/' },
    // { title: "About", icon: <InboxIcon />, url: '/' },
    // { title: "Login", icon: <MailIcon />, url: '/' },
    // { title: "SignUp", icon: <MailIcon />, url: '/' },
    { title: "Logout", icon: <Logout />, url: '/school-login', functionCall: logout },
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
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
     
    >
       <div className='text-center'>
            <img alt="..." width="100px" height="100px" className='rounded-circle border my-2' onClick={()=>handleImageClick(`${storageApi}school/${encryptedData()?.school_image}`)} src={storageApi +'school/' + encryptedData()?.school_image} />
            {
              showPopup && 
              <ImagePopup onClose={handleClosePopup} imageUrl={selectedImage} open={handleOpenPopUp}/>
            }
            <h3>{encryptedData().school_name}</h3>
            </div>
      <List className='position-absolute bottom-0'>
        {menuList.map((data, index) => (
          <Link key={index} to={data?.url} className='text-decoration-none text-muted ' onClick={() => { data?.functionCall() }}>
            <ListItem key={data} disablePadding>
              <ListItemButton style={{width:"100%"}}>
                <ListItemIcon style={{width:"100px"}}>
                  {data?.icon}
                </ListItemIcon>
                <ListItemText style={{width:"110px"}} primary={data?.title} />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );












  const [anchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);


  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };





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

  const mobileMenuId = 'primary-search-account-menu-mobile';
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
    </Menu>
  );
  return (
    <div>
      <div>
        {['left'].map((anchor, key) => (
          <SwipeableDrawer
            key={key}
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
        <AppBar sx={{ bgcolor: "var(--color2)" }} position="static">
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
              School Dashboard
            </Typography>

            <Box sx={{ flexGrow: 1 }} />
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick = {()=>navigate('/school-profile')}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
          </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
      </Box>
    </div>
  )
}

export default SchoolLayout