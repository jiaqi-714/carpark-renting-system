import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const bookingBox = {
  padding: 3,
  marginTop: 1,
  backgroundColor: 'grey.100',
  border: 1,
  borderColor: 'grey.400',
  borderRadius: 1,
  boxShadow: 2
}

function BookingItem ({ bookingID, status, start, end, vnum, type, cost }) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={1}
      sx={bookingBox}
    >
      <Typography variant='h6' component="div" >
        Booking ID: {bookingID}
      </Typography>

      <Typography variant='subtitle1' component="div" >
        Payment Status: {status}
      </Typography>

      <Typography variant='subtitle1' component="div">
        Start: {start}
      </Typography>
      <Typography variant='subtitle1' component="div">
        End: {end}
      </Typography>

      <Typography variant='subtitle1' component="div">
        Vehicle registration number: {vnum}
      </Typography>
      <Typography variant='subtitle1' component="div">
        Vehicle Type: {type}
      </Typography>

      <Typography variant='subtitle1' component="div">
        Total Cost: ${cost}
      </Typography>
    </Box>
  )
}

export default BookingItem;
