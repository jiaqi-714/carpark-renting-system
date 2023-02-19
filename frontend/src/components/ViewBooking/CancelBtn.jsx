import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import FetchHelper from '../../util/FetchHelper';

function CancelBtn ({ bookingID, status }) {
  const navigate = useNavigate();

  const handleCancel = () => {
    FetchHelper('DELETE', `/bookings/${bookingID}`, null, true)
      .then(() => {
        alert("Successfully cancelled booking");
        navigate("/bookings");
      })
  }

  return (
    <Box>
      <Button variant="contained" onClick={handleCancel} color="error">
        Cancel Booking
      </Button>
    </Box>
  )
}

export default CancelBtn;
