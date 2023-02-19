import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import formatISO9075 from 'date-fns/formatISO9075'

import PageContainer from '../../components/PageContainer';

import { useContext, Context } from '../../context';
import FetchHelper from '../../util/FetchHelper';

function PaymentForm ({ cardNum, carNum, carType, setCardNum, totalHrs, bookingID, updateTimeout }) {
  const navigate = useNavigate();

  const { getters } = useContext(Context);

  const listing = getters.viewListing;
  const start = getters.bookedStart;
  const end = getters.bookedEnd;
  const cost = getters.bookingCost;

  const handlePaymentClick = () => {
    // check card number
    if (!cardNum) {
      alert('Please enter card details');
      return;
    }
    // fetch request
    const body = {
      "car_space": listing.id,
      "start_time": formatISO9075(start),
      "end_time": formatISO9075(end),
      "price": cost,
      "status": "Completed/Paid",
      "car_type": carType,
      "car_registration": carNum,
      "total_hours": totalHrs,
      "creation_time": formatISO9075(new Date()),
    };
    // TODO: PUT - update the booking status / car details
    FetchHelper('PUT', `/bookings/${bookingID}`, JSON.stringify(body), true)
      .then((data) => {
        // Set query string for the next page
        const params = new URLSearchParams({
          previous_step: "payment",
          step: "success",
          bookingid: bookingID
        });
        // Clear expiry timer
        clearTimeout(updateTimeout);
        // paymentSuccess default true

        // Always assume payment success
        navigate(`/bookingForm/${listing.id}?${params}`);
      })
  }

  const handleCardChange = (event) => {
    // if not all numbers
    setCardNum(event.target.value);
  }

  return (
    <PageContainer items={
      <>
        <Typography variant='h5' component="div">
          Payment
        </Typography>
        <Typography variant='subtitle1' component="div" mt={1} mb={2}>
          Debit/Credit Card
        </Typography>
        <TextField 
          id="payment-card-num-input"
          label="Card Number"
          variant="outlined"
          inputProps={{ maxLength: 16 }}
          sx={{ maxWidth: 300 }}
          value={cardNum}
          onChange={handleCardChange}
        />
        <Typography variant='h6' component="div" mt={3}>
          Total ${cost}
        </Typography>

        <Box
          display="flex"
          justifyContent="space-between"
          mt={4}
        >
          <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
          <Button variant="contained" onClick={handlePaymentClick}>Pay now</Button>
        </Box>
      </>
    } />
  )
}

export default PaymentForm;
