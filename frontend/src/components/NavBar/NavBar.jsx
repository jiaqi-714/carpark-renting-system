import React from 'react';

import { Link, useNavigate } from 'react-router-dom';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import UserMenu from './UserMenu'

import { styled } from '@mui/material/styles';

const NormalLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'inherit'
});

function NavBar () {
  const navigate = useNavigate();

  const token = localStorage.getItem("ParkrToken");
  
  return (
    <AppBar position="sticky" sx={{ bgcolor: '#ffffff' }}>
      <Toolbar>
        <Typography variant='h5' component="div" color="primary" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          {token && 
            <NormalLink to='/home'>Parkr</NormalLink>
          }
          {!token && 
            <>Parkr</>
          }
        </Typography>
        <Box
          display="flex"
          gap={2}
        >
          {token && 
            <Button 
              id="addLisitng" 
              color="black" 
              variant="outlined"
              onClick={() => navigate('/listing/new')}
            >
              Add your space
            </Button>
          }
          
          {!token && 
            <Button 
              id="loginButton" 
              color="black" 
              variant="outlined"
              onClick={() => navigate('/login')}
            >
              login              
            </Button>
          }
          
          {token && 
            <UserMenu />
          }
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;