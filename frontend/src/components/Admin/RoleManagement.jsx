import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';

import FetchHelper from '../../util/FetchHelper';

const Boxsx = {
  padding: 3,
  marginTop: 3,
  width: 500,
  backgroundColor: 'grey.100',
  border: 1,
  borderColor: 'grey.400',
  borderRadius: 1,
  boxShadow: 1,
  marginLeft: "auto",
  marginRight: "auto"
}

const buttonStyle = {
  width: "30%",
  margin: "auto"
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function RoleManagement () {
  const [currentUser, setCurrentUser] = React.useState('');
  const [role, setRole] = React.useState('');
  const [allUsers, setAllusers] = React.useState([]);
  const [roles, setRoles] = React.useState({});
  const [ids, setids] = React.useState({})
  const [currentChoice, setCurrentChoice] = React.useState('');
  const [err, setErr] = React.useState(true);
  const [change, setChange] = React.useState(0);

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  React.useEffect(() => {    
    FetchHelper('GET', '/users', null, true)
    .then(data => {
      let userList = [];
      let rolesDict = {};
      let idDict = {};
      for (let i in data) {
        userList.push({'label': data[i].name});
        rolesDict[data[i].name] = data[i].is_admin;
        idDict[data[i].name] = data[i].id;
      }
      setAllusers(userList);
      setRoles(rolesDict);
      setids(idDict);
    })
  }, [change]);

  React.useEffect(() => {
    if (roles[currentUser] === 1) {
      setRole('Admin');
    } else if (roles[currentUser] === 0) {
      setRole('User')
    } else {
      setRole('Invalid username')
    }
  }, [currentUser, roles])

  const handleUserChange = () => {
    if (roles[currentUser] === undefined) {
      alert('invalid username!');
      return;
    } 
    
    if (err) {
      alert('You must choose a role before submit');
      return;
    }

    if (currentChoice === roles[currentUser]) {
      alert("Roles is same as before");
      return;
    }

    let set_admin;
    if (currentChoice === 'BAN') {
      if (role === 'Admin') {
        alert('You cannot delete an admin!')
        return;
      }
      setOpen(true);
      return;
    } else if (currentChoice === 'Admin') {
      set_admin = 1;
    } else {
      set_admin = 0;
    }
    const body = JSON.stringify({
      target_user: ids[currentUser],
      set_admin
    });

    FetchHelper('PUT', '/users/set-role', body, true)
    .then(() => {
      alert("User role change success!");
      setChange(change + 1);
    })
    .catch((error) => {alert(error)})
  }

  const handleSelect = (e) => {
    setCurrentChoice(e.target.value);
    setErr(false);
  }

  const handleDeleteOthers = () => {
    FetchHelper('DELETE', '/users/' + ids[currentUser], null, true)
    .then(() => {
      alert("User delete success!");
      setChange(change + 1);
    })
    .catch((error) => {alert(error)})
  }

  return (
    <div>
      <Typography variant='h4' component="div" mt={2} mb={5} align='center'>
        Role management
      </Typography>

      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={allUsers}
        sx={{ width: 500, margin: 'auto' }}
        value={currentUser}
        onInputChange={(_, v) => setCurrentUser(v)}
        renderInput={(params) => <TextField {...params} label="Users" />}
      />

      <Box sx={Boxsx}>
        <Typography variant='h6' component="div">
          {currentUser}
        </Typography>
        <Typography variant='body1' component="div">
          current role: {role}
        </Typography>

        <FormControl margin='normal'>
          <FormLabel id="demo-row-radio-buttons-group-label">New Role</FormLabel>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="row-radio-buttons-group"
            sx={{ width: 500 }}
            value={currentChoice}
            onChange={(e) => handleSelect(e)}
          >
            <FormControlLabel value="Admin" sx={buttonStyle} control={<Radio />} label="Admin" />
            <FormControlLabel value="User"  sx={buttonStyle} control={<Radio />} label="User" />
            <FormControlLabel value="BAN"  sx={buttonStyle} control={<Radio />} label="BAN" />
          </RadioGroup>
          <Button sx={{marginRight: '50px'}} onClick={handleUserChange}>confirm</Button>
        </FormControl>
      </Box>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            WARNING!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            You are delteing a user! This is not revertable, are you sure to continue?
          </Typography>
          <Button variant="outlined" onClick={() => handleDeleteOthers()} sx={{width: "30%", marginLeft: 4, marginRight: 10 }}>Continue</Button>
          <Button variant="outlined" onClick={handleClose} sx={buttonStyle}>Back</Button>
        </Box>
      </Modal>

    </div>
  );
}

export default RoleManagement;
