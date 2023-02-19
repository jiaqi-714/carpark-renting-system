import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Divider from '@mui/material/Divider';
import Modal from '@mui/material/Modal';

import FetchHelper from '../../util/FetchHelper';

const listingBoxsx = {
  padding: 2,
  marginTop: 10,
  width: 500,
  maxHeight: 1000,
  backgroundColor: 'grey.100',
  border: 1,
  borderColor: 'grey.400',
  borderRadius: 1,
  boxShadow: 1,
  marginLeft: "auto",
  marginRight: "auto",
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const buttonStyle = {
  width: "50%",
  margin: "auto"
};

function Profile () {
	const navigate = useNavigate();

	const [email, setEmail] = React.useState("");
	const [userName, setUsername] = React.useState("");
  const [cardNum, setCardNum] = React.useState("5280 1865 1345 8653");
  const [name, setName] = React.useState("");
  const [openDelete, setOpenDelete] = React.useState(false);
  const [openChangePassword, setOpenChangePassword] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setnewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [userId, setUserID] = React.useState(0);

  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);
  const handelOpenPass = () => setOpenChangePassword(true);
  const handleClosePass = () => setOpenChangePassword(false);

  const handleChangePassword = () => {
    if (newPassword === '' || confirmPassword === '' || oldPassword === '') {
      alert("You must eneter a valid password!");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }

    if (newPassword.length < 8) {
      alert("Password must be at least 8 characters long");
      return;
    }
    if (!/[a-z]/.test(newPassword)){
      alert("password must contain a letter")
      return;
    }
    if (!/[A-Z]/.test(newPassword)){
      alert("password must contain a capital letter")
      return;
    }
    if (!/[0-9]/.test(newPassword)){
      alert("password must contain a number")
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("two password does not match");
      return;
    }

    const body = JSON.stringify({
      password: newPassword
    })
    
    FetchHelper('PUT', '/password', body, true)
    .then(() => {
      alert("update success");
      handleClosePass();
    })
    .catch((err) => alert(err))
  }

  React.useEffect(() => {
    FetchHelper('GET', '/user/selfID', null, true)
      .then(data => {
        const id = data.user_id;
        setUserID(data.user_id);
        FetchHelper('GET', '/users/' + id, null, true)
        .then(data2 => {
          setEmail(data2.email);
          setUsername(data2.name);
          setName(data2.name)
        })
      })
  }, []);

  const handleSavechange = () => {
    FetchHelper('GET', '/users/' + userId, null, true)
      .then(data => {
        let res = data;
        res.email = email;
        res.name = userName;
        const body = JSON.stringify(res)
        FetchHelper('PUT', '/users/' + userId, body, true)
        .then(() => {
          localStorage.setItem("ParkrName", userName);
          alert("Informtion updated:)")
          navigate('/')
        })
      })
      .catch((err) => alert(err))
  }

  const handleDeleteAccount = () => {
    FetchHelper('DELETE', '/users/' + userId, null, true)
    .then(data => {
      alert("delete success");
      localStorage.removeItem("ParkrToken");
      localStorage.removeItem("ParkrName");
      navigate('/')
      })
    .catch((err) => alert(err))

  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={listingBoxsx}
    >
      <Typography variant='h5' component="div" mb={1}>
        Your profile
      </Typography>

      <TextField
        label="Username" 
        value={userName} 
        variant="outlined" 
        onChange={(e) => setUsername(e.target.value)}
        margin="normal"
        />
		  <TextField 
        label="email" 
        value={email} 
        variant="outlined" 
        onChange={(e) => setEmail(e.target.value)}
        margin="normal"
      />
      <Button variant="contained" onClick={handleSavechange}>Save Changes</Button>

      <Typography component="div" variant='h6' mt={2}>
        Payment Method
      </Typography>
      <Typography component="div" variant='body1'>
        This is the credit card account where you can give and receive payments.
      </Typography>
      <Box 
        display="flex"
        flexDirection="column"
      >
        <TextField 
          id="name-input" 
          label="Name on card" 
          variant="outlined" 
          disabled
          value={name} 
          onChange={(e) => setName(e.target.value)}
          margin="normal"
        />
        <TextField 
          id="card-input" 
          label="Card number" 
          variant="outlined" 
          disabled
          inputProps={{ maxLength: 16 }}
          onChange={(e) => setCardNum(e.target.value)}
          value={cardNum}
          margin="normal"
          />
      </Box>

      <Accordion sx={{
        backgroundColor: 'grey.100',
        borderStyle: 'solid',
        borderColor: 'rgb(217,217,217)'
      }}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Advanced options</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Button fullWidth onClick={handleOpenDelete}>Close Account</Button>
          <Divider />
          <Button fullWidth onClick={handelOpenPass}>Change Password</Button>
        </AccordionDetails>
      </Accordion>

      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="close-modal-title" variant="h6" component="h2">
            Are you sure you want to close your account?
          </Typography>
          <Typography id="close-modal-description" sx={{ mt: 1 }}>
            This operation cannot be reverted! You will lose the access of this account once your confirm to close this account. 
          </Typography>
          <Button sx={buttonStyle} onClick={handleDeleteAccount}>Confirm</Button>
          <Button sx={buttonStyle} onClick={handleCloseDelete}>No, I still want to use Parkr</Button>
        </Box>
      </Modal>

      <Modal
        open={openChangePassword}
        onClose={handleClosePass}
        aria-labelledby="pass-modal-title"
        aria-describedby="pass-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" component="h2">
            Change password
          </Typography>
          
          <Typography variant="body1" component="div" mt={2}>
            Enter your old password
          </Typography>
          <TextField label="old password" fullWidth variant="outlined" type="password" onChange={(e) => setOldPassword(e.target.value)} />

          <Typography variant="body1" component="div" mt={2}>
            Enter your new password
          </Typography>
          <TextField label="new password" fullWidth variant="outlined" type="password" onChange={(e) => setnewPassword(e.target.value)} />

          <Typography variant="body1" component="div" mt={2}>
            Enter your new password again
          </Typography>
          <TextField label="consirm your new password" fullWidth variant="outlined" type="password" onChange={(e) => setConfirmPassword(e.target.value)} />
          <Button fullWidth onClick={handleChangePassword}>Confirm</Button>
        </Box>
      </Modal>
	  </Box>
  );
}

export default Profile;
