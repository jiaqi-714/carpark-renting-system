import React from 'react';

import Typography from '@mui/material/Typography';

import BookingSearchBar from './BookingSearchBar';
import BookingDetail from './BookingDetail';

import FetchHelper from '../../util/FetchHelper';

function AllBookings () {
  const [bookings, setBookings] = React.useState([]);
  const [ID, setID] = React.useState('');
  const [start, setStart] = React.useState(new Date(Date.now() - 2629743 * 1000));
  const [end, setEnd] = React.useState(new Date());
  const [status, setStatus] = React.useState('')

  React.useEffect(() => {
    FetchHelper('GET', '/admin', null, true)
      .then(data => {
      // Get ALL bookings for admin
      if (data.is_admin) {
        FetchHelper('GET', '/bookings', null, true)
          .then(data2 => {
            if (data2) filter(data2);
          })
      } else {
        // Get bookings for specific user
        FetchHelper('GET', '/bookings/user', null, true)
          .then(data2 => {
            if (data2 !== 'error') {
              filter(data2);
            }
          })
      }
    })
  }, [ID, start, end, status]);

  const filter = (data) => {    
    let resultAfterID = [];
    if (ID !== '') {
      console.log(typeof(ID));
      if (ID < 0) {
        alert('Invalid search, check your input and try again.');
        return;
      }
      for (let booking of data) {
        let re = new RegExp(booking.id);
        if (ID.search(re) !== -1) {
          resultAfterID.push(booking);
        }
      }
    } else {
      for (let booking of data) {
        resultAfterID.push(booking);
      }
    }

    let resultAfterStart = [];
    for (let booking of resultAfterID) {
      let time = String(booking.start_time).split(/[:\s-]+/);
      let unixT = new Date(Number(time[0]), Number(time[1]) - 1, Number(time[2]), Number(time[3]), Number(time[4]), Number(time[5]));
      if (start <= unixT && end >= unixT) {
        resultAfterStart.push(booking);
      }
    }

    let resultAfterStatus = []
    if (status !== '' && status !== 'Any') {
      for (let booking of resultAfterStart) {
        if (status === booking.status) {
          resultAfterStatus.push(booking);
        }
      }
    } else {
      for (let booking of resultAfterStart) {
        resultAfterStatus.push(booking);
      }
    }

    setBookings(resultAfterStatus);
  }

  return (
    <>
      <Typography margin='auto' variant='h5' ml={3} mb={4} sx={{ fontWeight: 'bold', m: 1 }}>
        Your Bookings
      </Typography>
      <BookingSearchBar setID={setID} setStart={setStart} setEnd={setEnd} setStat={setStatus} />

      {bookings.map((booking) => (
        <BookingDetail
          key={booking.id}
          bookingID={booking.id}
          carSpaceID={booking.car_space}
          status={booking.status}
          start={booking.start_time}
          end={booking.end_time}
          price={booking.price}
        />
      ))}
    </>
  )
}

export default AllBookings;
