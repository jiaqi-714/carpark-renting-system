import React from 'react';

import { useParams } from 'react-router-dom';

import Typography from '@mui/material/Typography';

import PageContainer from '../components/PageContainer';
import ListingDetails from '../components/ViewListing/ListingDetails';
import BookingItem from '../components/ViewListing/BookingItem';

import FetchHelper from '../util/FetchHelper';

function ViewListingScreen () {
  const { listingId } = useParams();

  const [bookings, setBookings] = React.useState([]);

  React.useEffect(() => {
    // Get all bookings for listing
    FetchHelper('GET', `/bookings/listing/${listingId}`)
      .then(data => {
        setBookings(data);
      })
  }, [listingId]);

  return (
    <PageContainer items={
      <>
        <ListingDetails 
          listingID={listingId}
        />
        <Typography variant='h5' component="div" my={2}>
          Bookings for this listing
        </Typography>
        {bookings.length === 0 && 
          <Typography variant='body1' component="div" mt={2}>
            No bookings
          </Typography>
        }
        {bookings.map((booking) => 
          <BookingItem 
            key={booking.id}
            bookingID={booking.id}
            status={booking.status}
            start={booking.start_time}
            end={booking.end_time}
            vnum={booking.car_registration}
            type={booking.car_type}
            cost ={booking.price}
          />
        )}
      </>
    } />
  )
}

export default ViewListingScreen;
