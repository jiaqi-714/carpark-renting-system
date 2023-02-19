import React from 'react';

import { useParams } from 'react-router-dom';

import PageContainer from '../components/PageContainer';
import BookingDetails from '../components/ViewBooking/BookingDetails';

function ViewBookingScreen () {
  const { bookingId } = useParams();

  return (
    <PageContainer items={
      <>
        <BookingDetails 
          bookingID={bookingId}
        />
      </>
    } />
  )
}

export default ViewBookingScreen;
