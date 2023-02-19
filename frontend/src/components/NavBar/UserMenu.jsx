
import React from 'react';

import { useNavigate } from 'react-router-dom';

import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import FetchHelper from '../../util/FetchHelper';

import { useContext, Context } from '../../context';

function UserMenu () {
	const navigate = useNavigate();

  const userName = localStorage.getItem("ParkrName");

  const { setters } = useContext(Context);
  const listingSetter = setters.setAllListings;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [isAdmin, setIsAdmin] = React.useState(false);

  const open = Boolean(anchorEl);
  let token = localStorage.getItem("ParkrToken");

  React.useEffect(() => {
    FetchHelper('GET', '/admin', null, true)
    .then(data => {
      if (data.is_admin === 'True') {
        setIsAdmin(true);
      }
    });
  },[]);

  const handleMenuItemClick = (route) => {
    // setAnchorEl(null);
    navigate(`/${route}`);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    alert("You have been logged out")
    localStorage.removeItem("ParkrToken");
    localStorage.removeItem("ParkrName");
    setIsAdmin(false);
    handleClose();
    listingSetter([]);
    navigate('/login');
  }

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <div>
      <Button
        id="standard-user-button"
        aria-controls={open ? 'standard-user-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        color="black"
        onClick={handleClick}
      >
        <Box 
          display="flex"
          gap={0.8}
          sx={{
            alignItems: 'center'
          }}
        >
          <MenuIcon fontSize="inherit" />
          {userName}
        </Box>
      </Button>
      <Menu
        id="standard-user-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'standard-user-button',
        }}
      >
        <MenuItem onClick={(e) => handleMenuItemClick('profile')}>
          <Typography component="div" variant='body1'>
            Profile
          </Typography>
        </MenuItem>
        {isAdmin && 
          <MenuItem onClick={(e) => handleMenuItemClick('manage')}>
            <Typography component="div" variant='body1'>
              Manage roles
            </Typography>
          </MenuItem>
        }
        <MenuItem onClick={(e) => handleMenuItemClick('bookings')}>
          <Typography component="div" variant='body1'>
            Manage bookings
          </Typography>
        </MenuItem>
        <MenuItem onClick={(e) => handleMenuItemClick('listing')}>
          <Typography component="div" variant='body1'>
            Manage listings
          </Typography>
        </MenuItem>
        {token &&
          <MenuItem onClick={logout}>Logout</MenuItem>
        }
      </Menu>
    </div>
  );
}

export default UserMenu;