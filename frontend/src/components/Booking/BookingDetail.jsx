import React from 'react';

import { useNavigate } from 'react-router-dom';

import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import FetchHelper from '../../util/FetchHelper';

const itemBoxStyle = {
  margin: 4,
  border: 1,
  borderColor: 'grey.500',
  borderRadius: 1,
  boxShadow: 3
}

function BookingDetail ({ bookingID, carSpaceID, status, start, end, price }) {
  const navigate = useNavigate();

  const [address, setAddress] = React.useState('');
	const [totalBookings, setTotalBookings] = React.useState(0);
	const [occupancy, setOccupancy] = React.useState(0);
	const [photo, setPhoto] = React.useState(null);
  
  const handleViewClick = () => {
    navigate(`/bookings/view/${bookingID}`);
  }

  React.useEffect(() => {
    // Get address
    FetchHelper('GET', `/listings/${carSpaceID}`)
      .then(data => {
        setAddress(data.address);
        setTotalBookings(data.total_bookings);
        if (data.photo_link !== "mydirectory/url") {
          setPhoto(data.photo_link);
        }
      })
    FetchHelper('GET', `/analysis/id/userate/${carSpaceID}`)
    .then(data => {
      setOccupancy(data);
    })
  }, [carSpaceID]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={itemBoxStyle}
    >
      <Box 
        display="flex"  
        alignItems='center'
        justifyContent='center'
        mt={1}
        p={1}
      >
        <Typography margin='auto'>Booking ID: {bookingID}</Typography>
        <Typography margin='auto'>Date: from {start} to {end}</Typography>
        <Typography margin='auto'>Status: {status}</Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'grey.400' }} />
      <Box
        display="flex"
      >
        {photo &&
          <img src={photo} width="300px" height="300px" alt="booking's thumbnail" />
        }
        <Box display="flex" justifyContent="space-between">
          <Box display="flex" flexDirection="column" flex="1">
            <Box display="flex" justifyContent="space-between" m={5}>
              <Typography>{address}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" flex="3" mx={5} justifyContent="center" >
            <Typography>Total number of times rented: {totalBookings}</Typography>
            <Typography>Occupancy percentage since listing creation: {occupancy}%</Typography>
            </Box>
          </Box>
        </Box>
        <Typography fontWeight="bold" flex="10">Total Cost: ${price}</Typography>
        <Box>
          <Button variant="contained" onClick={handleViewClick} sx={{marginTop:'40px', marginRight: '40px'}}>View</Button>
        </Box>
      </Box>
    </Box>
  );
}

export default BookingDetail;