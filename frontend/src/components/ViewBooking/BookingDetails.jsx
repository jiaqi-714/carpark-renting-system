import React from 'react';
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

import CancelBtn from './CancelBtn'
import ReviewButton from './ReviewButton'

import FetchHelper from '../../util/FetchHelper';

function BookingDetails ({ bookingID }) {
  const navigate = useNavigate();

  const [status, setStatus] = React.useState('');
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(0)
  const [vnum, setVnum] = React.useState('');
  const [type, setType] = React.useState('');
  const [cost, setCost] = React.useState(0);
  const [listingID, setListingID] = React.useState(0)

  React.useEffect(() => {
    // Get booking details
    FetchHelper('GET', `/bookings/booking/${bookingID}`)
      .then(data => {
        setStatus(data.status);
        setStart(data.start_time);
        setEnd(data.end_time);
        setVnum(data.car_registration);
        setType(data.car_type);
        setCost(data.price);
        setListingID(data.car_space)
      })
  }, [bookingID]);

  return (
    <>
      <IconButton aria-label="back" sx={{marginRight: 'auto'}} onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <Typography variant='h4' component="div">
        Booking Details
      </Typography>

      <Typography variant='h6' mt={3} component="div" >
        Booking ID: {bookingID}
      </Typography>

      <Typography variant='h6' mt={3} component="div" >
        Payment Status: {status}
      </Typography>

      <Typography variant='h6' mt={3} component="div">
        Start: {start}
      </Typography>
      <Typography variant='h6' mt={3} component="div">
        End: {end}
      </Typography>

      <Typography variant='h6' mt={3} component="div">
        Vehicle registration number: {vnum}
      </Typography>
      <Typography variant='h6' mt={3} component="div">
        Vehicle Type: {type}
      </Typography>

      <Typography variant='h6' mt={3} mb={5} component="div">
        Total Cost: ${cost}
      </Typography>

      <Box
        display="flex"
        gap={4}
      >
        <ReviewButton listingID={listingID} size="large" />
        <CancelBtn status={status} bookingID={bookingID} size="large" />
      </Box>
    </>
  )
}

export default BookingDetails;
