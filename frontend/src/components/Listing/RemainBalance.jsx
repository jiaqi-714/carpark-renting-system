import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import FetchHelper from '../../util/FetchHelper';

const Boxsx = {
  float: "right", 
  border: 1,
  marginRight: '50px',
  width: 200
};

function RemainBalance () {
  const [balance, setBalance] = React.useState(150);

  React.useEffect(() => {
    // mimic get balacne
    FetchHelper('GET', '/admin', null, true)
    .then(data => {
      if (data.is_admin === 'True') {
        setBalance(250);
      }})
  }, [])

  const handleClaim = () => {
    setBalance(0);
    alert("Claim success!")
  }

  return (
    <Box p={1} sx={Boxsx}>
      <Typography variant='h5' component="div" textAlign="center" mb={1}>Balance: ${balance}</Typography>
      <Button variant="outlined" onClick={handleClaim} size='large' fullWidth>Claim now</Button>
    </Box>
  );
}

export default RemainBalance;
