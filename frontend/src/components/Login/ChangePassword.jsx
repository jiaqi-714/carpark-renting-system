import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import { AES, enc } from 'crypto-js';

import FetchHelper from '../../util/FetchHelper';

const listingBoxsx = {
    padding: 2,
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

function ChangePassword () {
	const navigate = useNavigate();

  const [email, setEmail]  = React.useState('');

  const [OTP, setOTP] = React.useState("");
	const [password, setPassword] = React.useState("");
	const [confirmPassword, setConfirmPassword] = React.useState("");

	const handleSignup = () => {
		if (password !== confirmPassword) {
			alert("two password must match!")
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

    if (OTP === "") {
      alert("You must enter a valid OTP")
      return;
    }

    // react hook sucks
    // regex is always the best
    const en = window.location.href.replace(/.*email=/,"");
    const de = AES.decrypt(en, 'I-dont-know-the-key');
    setEmail(de.toString(enc.Utf8));

    const body = JSON.stringify({
      email: de.toString(enc.Utf8),
      reset_code: OTP,
      new_password: password
    })

    FetchHelper('POST', '/resetPassword/valid', body, false)
      .then((_) => {
        navigate("/login")
      })
      .catch((err) => {alert(err)})
	}

  return (
    <Box
    display="flex"
    flexDirection="column"
    sx={listingBoxsx}
    >
      <Typography variant='h5' component="div" mb={1}>
        Reset Password
      </Typography>

      <Typography variant='body' component="div" ml={1}>
        To continue, complete this verification step. We've sent a One Time Password (OTP) to the email {email}. Please enter it below.
      </Typography>

      <TextField label="OTP" variant="outlined" margin='normal' onChange={(e) => setOTP(e.target.value)} />
			<TextField label="passowrd" variant="outlined" margin='normal' type="password" onChange={(e) => setPassword(e.target.value)} />
			<TextField label="confirm your password" variant="outlined" margin='normal' type="password" onChange={(e) => setConfirmPassword(e.target.value)} />

			<Button variant="contained" onClick={ handleSignup } sx={{marginTop:2}}>Confirm</Button>
		</Box>
  );
}

export default ChangePassword;
