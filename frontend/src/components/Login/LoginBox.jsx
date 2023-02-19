import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

import FetchHelper from '../../util/FetchHelper';

import { useContext, Context } from '../../context';

const listingBoxsx = {
    padding: 3,
    marginTop: 10,
    width: 500,
    backgroundColor: 'grey.100',
    border: 1,
    borderColor: 'grey.400',
    borderRadius: 1,
    boxShadow: 1,
    marginLeft: "auto",
    marginRight: "auto"
  }

  const buttonSx = {
    marginTop: 2,
  }

function LoginBox () {
	const navigate = useNavigate();
  const token = localStorage.getItem("ParkrToken");

  const { setters } = useContext(Context);
  const isAdminSetter = setters.setIsAdmin;

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleText = (event, func) => {
    func(event.target.value);
  }

  const fetchAdmin = () => {
    FetchHelper('GET', '/admin', null, true)
    .then(data3 => {
      isAdminSetter(data3.is_admin === 'True');
    })
  };

  const handleLoginButton = () => {
    if(email === "") {
      alert("You must enter a valid email address!");
      return;
    }

    if (password === "") {
      alert("You must enter a valid password");
      return;
    }

    let body = JSON.stringify({
      email,
      password,
    })

    FetchHelper('POST', '/auth/login', body)
      .then(data => {
        localStorage.setItem('ParkrToken', data.token);
        fetchAdmin();
        
        FetchHelper('POST', '/token_to_ID', null, true)
        .then(data2 => {
          localStorage.setItem('ParkrName', data2.name);
          navigate("/home");
          // alert("login success :)")
        })
      })
      .catch(err => {
        alert(err);
      });
  }

  React.useEffect(() => {
    // Already logged in from last session
    if (token) {
      navigate("/home");
    }
  }, [token, navigate]);

  return (
    <Box
    display="flex"
    flexDirection="column"
    sx={listingBoxsx}
    >
      <Typography variant='h5' component="div" mb={1}>
        Login
      </Typography>

			<TextField id="email-input" label="email" variant="outlined" margin="normal" onChange={(e) => handleText(e, setEmail)}/>
			<TextField id="password-input" label="password" variant="outlined" type="password" margin="normal" onChange={(e) => handleText(e, setPassword)}/>

			<Link href="/resetPassword/send">forget your password?</Link>

      <Button variant="contained" sx={buttonSx} onClick={ handleLoginButton }>Login</Button>
      <Box 
        display="flex"
        gap={1}
        mt={1}
        maxHeight={44}
        alignItems={"baseline"}
      >
        <p>Not a member yet?</p>
        <Button variant="outlined" sx={{ fontWeight: 'bold' }} onClick={() => navigate("/register")}>Register</Button>
      </Box>

		</Box>
  );
}

export default LoginBox;
