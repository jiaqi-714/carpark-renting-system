import React from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';

import PageContainer from '../../components/PageContainer';

import { useContext, Context } from '../../context';

function BookingSuccess ({ bookingID }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { getters } = useContext(Context);

  const listing = getters.viewListing;
  const start = getters.bookedStart;
  const end = getters.bookedEnd;
  const cost = getters.bookingCost;

  const [startStr, setStartStr] = React.useState('');
  const [endStr, setEndStr] = React.useState('');

  React.useEffect(() => {
    if (!start || !end) return;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hour12: true };
    setStartStr(start.toLocaleDateString('en-GB', options));
    setEndStr(end.toLocaleDateString('en-GB', options));    
  }, [start, end, searchParams]);

  return (
    <PageContainer items={
      <>
        <Typography variant='h5' component="div">
          Payment Successful!
        </Typography>
        <Box
          display="flex"
          flexDirection="column"
          my={3}
          p={4}
          sx={{
            border: 1,
            borderColor: 'grey.400',
            borderRadius: 1,
            boxShadow: 2,
          }}
        >
          <Typography variant='h6' component="div" pb={2} 
          >
            Booking Details
          </Typography>
          <Divider sx={{ backgroundColor: 'grey.300' }} />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            pb={2}
          >
            <Typography variant='h6' component="div" mt={2}>
              ${cost} paid 
            </Typography>
            {listing &&
              <Typography variant='body2' component="div">
                for {listing['name']}
              </Typography>
            }
          </Box>
          <Divider sx={{ backgroundColor: 'grey.300' }} />
          {listing &&
            <Typography variant='body1' component="div" pt={2}>
              <b>Address:</b> {listing.address}
            </Typography>
          }
          <Typography variant='body1' component="div" my={2}>
            <b>Booking ID:</b> {bookingID}
          </Typography>
          <Typography variant='body1' component="div">
            <b>Start Time:</b> {startStr}
          </Typography>
          <Typography variant='body1' component="div">
            <b>End Time:</b> {endStr}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            onClick={() => navigate('/bookings')}
            sx={{
              fontSize: '0.9em'
            }}
          >
            View all bookings
          </Button>
        </Box>
      </>
    } />
  )
}

export default BookingSuccess;
