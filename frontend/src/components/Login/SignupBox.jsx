import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import FetchHelper from '../../util/FetchHelper';

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

function SignupBox () {
	const navigate = useNavigate();

	const [username, setUsername] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	const handleSignup = () => {
    if(email === "") {
      alert("You must enter a valid email address!");
      return;
    }

    if (password === "" || confirmPassword === "") {
      alert("You must enter a valid password");
      return;
    }

    if (username === "") {
      alert("You must enter a valid username")
      return;
    }

		if (password !== confirmPassword) {
			alert("two password must match!")
			return;
		}

    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
      alert("You have entered an invalid email address!");
      return;
    }

    if (password.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (!/[a-z]/.test(password)){
      alert("password must contain a letter")
      return;
    }
    if (!/[A-Z]/.test(password)){
      alert("password must contain a capital letter")
      return;
    }
    if (!/[0-9]/.test(password)){
      alert("password must contain a number")
      return;
    }

    const body = JSON.stringify({
      email,
      password,
      name: username
    })
    FetchHelper('POST', '/auth/register', body)
      .then(data => {
        // Auto login after registering
        localStorage.setItem('ParkrToken', data.token);
        FetchHelper('POST', '/token_to_ID', null, true)
          .then(data2 => {
            localStorage.setItem('ParkrName', data2.name);
            navigate("/home");
          })
      })
      .catch(err => {
        alert(err)
      });
	}

  return (
    <Box
    display="flex"
    flexDirection="column"
    sx={listingBoxsx}
    >
      <Typography variant='h5' component="div" mb={2}>
        Register
      </Typography>

			<TextField id="username-input" label="Username" variant="outlined" margin="normal" onChange={(e) => setUsername(e.target.value)}/>
			<TextField id="signup-email-input" label="email" variant="outlined" margin="normal" onChange={(e) => setEmail(e.target.value)}/>
			<TextField id="signup-password-input" label="password" variant="outlined" margin="normal" type="password" onChange={(e) => setPassword(e.target.value)} />
			<TextField id="signup-confirm-pass-input" label="confirm your password" variant="outlined" type="password" margin="normal" onChange={(e) => setConfirmPassword(e.target.value)} />

			<Button variant="contained" onClick={ handleSignup }>Sign up</Button>
		</Box>
  );
}

export default SignupBox;
