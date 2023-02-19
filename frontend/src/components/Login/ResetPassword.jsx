import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import FetchHelper from '../../util/FetchHelper';

import { AES } from 'crypto-js';

const listingBoxsx = {
    padding: 2,
    marginTop: 10,
    width: 500,
    maxHeight: 360,
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

	const [email, setEmail] = React.useState("");

	const handleReset = () => {
    const body = JSON.stringify({
      email
    })

    FetchHelper('POST', '/resetPassword/send', body, false)
      .then((_) => {
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
          alert("You have entered an invalid email address!");
          return;
        }

        navigate("/resetPassword/valid?email=" + AES.encrypt(email, 'I-dont-know-the-key'));
      })
      .catch((error) => alert(error));
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

      <Typography variant='body1' component="div">
        A link to reset your password will be sent to the provided email address
      </Typography>

        <TextField id="outlined-basic" label="email" variant="outlined" margin="normal" onChange={(e) => setEmail(e.target.value)}/>

        <Button variant="contained" onClick={ handleReset } sx={{marginTop: 1}}>Confirm</Button>
    </Box>
  );
}

export default SignupBox;
