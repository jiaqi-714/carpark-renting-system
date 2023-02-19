import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { 
  addDays,
  addWeeks,
  getHours,
  getDay,
  getTime,
  setHours,
  differenceInDays,
  differenceInWeeks,
} from 'date-fns'

import formatISO9075 from 'date-fns/formatISO9075'

import DateTimePicker from './BookingDateTimePicker'

import { useContext, Context } from '../../context';

import FetchHelper from '../../util/FetchHelper';

const bookingBox = {
  padding: 3,
  marginTop: 6,
  width: 380,
  maxHeight: 440,
  backgroundColor: 'grey.100',
  border: 1,
  borderColor: 'grey.400',
  borderRadius: 1,
  boxShadow: 3
}

function BookingContainer () {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);

  const listing = getters.viewListing;
  const startTime = getters.bookedStart;
  const endTime = getters.bookedEnd;

  const [blockedDays, setBlockedDays] = React.useState([]);
  const [minHr, setMinHr] = React.useState(null);
  const [maxHr, setMaxHr] = React.useState(null);

  const [bookings, setBookings] = React.useState([]);
  const [bookedTimes, setBookedTimes] = React.useState([]);

  const total = getters.bookingCost;
  const setTotal = setters.setBookingCost;

  const totalHrs = getters.totalHrs;
  const setTotalHrs = setters.setTotalHrs;
  
  const start = getters.bookedStart;
  const end = getters.bookedEnd;
  const cost = getters.bookingCost;

  const handleBookClick = () => {
    if (total === ' - ' || total <= 0 || startTime > endTime) {
      alert("Please set a valid time");
      return;
    }
    // Create a pending request
    const body = {
      "car_space": listing.id,
      "start_time": formatISO9075(start),
      "end_time": formatISO9075(end),
      "price": cost,
      "status": "Pending",
      "car_type": '',
      "car_registration": '',
      "total_hours": totalHrs,
      "creation_time": formatISO9075(new Date()),
    }
    FetchHelper('POST', '/bookings/new', JSON.stringify(body), true)
      .then((data) => {
        console.log(data);
        const params = new URLSearchParams({
          step: "vehicle",
          bookingid: data["booking_id"]
        });
        navigate(`/bookingForm/${listing.id}?${params}`);
      })
      .catch((error) => { 
        // TODO: if invalid show booking time alert
        alert(error);
      })
  }
  const findCommonDays = (arr1, arr2) => {
    const commonArr = [];
    for (const item of arr1) {
      if (arr2.includes(item)) {
        commonArr.push(item);
      }
    }
    return commonArr;
  };

  
  React.useEffect(() => {
    if (!listing) return;
    setMinHr(new Date(0, 0, 0, listing.starttime));
    setMaxHr(new Date(0, 0, 0, listing.endtime));

    // fetch all bookings for the listing
    FetchHelper('GET', `/bookings/listing/${listing.id}`)
    .then(data => {
      const validBookings = data.filter(booking => booking.status !== 'Expired');
      
      // block BOOKED DAYS
      const bookingsList = [];
      for (const b of validBookings) {
        const bookedStart = setHours(new Date(b.start_time), 0);
        const bookedEnd = setHours(new Date(b.end_time), 0);
        // block days between start and end
        for (let i = bookedStart; i <= bookedEnd; i = addDays(i, 1)) {
          bookingsList.push(getTime(i));
        }
      }
      setBookedTimes(bookingsList);
      setBookings(validBookings);
    })
    .catch((err) => {
      console.log('no bookings yet');
    })

    // E.g. Tuesday = 2
    const blockedDays = [];
    if (!listing.sunday) {
      blockedDays.push(0);
    }
    if (!listing.monday) {
      blockedDays.push(1);
    }
    if (!listing.tuesday) {
      blockedDays.push(2);
    }
    if (!listing.wednesday) {
      blockedDays.push(3);
    }
    if (!listing.thursday) {
      blockedDays.push(4);
    }
    if (!listing.friday) {
      blockedDays.push(5);
    }
    if (!listing.saturday) {
      blockedDays.push(6);
    }
    setBlockedDays(blockedDays);

    // Clear blocked days on page change
    return () => {
      setBlockedDays([]);
      setBookings([]);
      setBookedTimes([]);
    };
  }, [listing, setBlockedDays]);

  React.useEffect(() => {
    // calculate total cost just by the hour (no minutes)
    if (!endTime || !startTime || !listing) return;
    let cost = ' - ';
    if (startTime > endTime || getHours(startTime) > getHours(endTime) ) {
      setTotal(cost);
      return;
    }

    // Calculate cost, not including the listing's disabled dates
    const weeksDiff = differenceInWeeks(endTime, startTime);
    const daysDiff = differenceInDays(endTime, startTime);
    // Start time will always be < End time
    const hoursDiff = getHours(endTime) - getHours(startTime);
    const hourlyCost = hoursDiff * listing.price_hourly;
    let nBlockedDays = 0;
    // Start and End time on Same day
    if (daysDiff <= 0) {
      setTotal(hourlyCost);
      setTotalHrs(hoursDiff);
      return;
    }

    // Helper function: Count day occurences between range start and end inclusive
    const countBookedDays = (start, end) => {
      // Include extra day in count
      let count = differenceInDays(end, start) + 1;
      // Subtract blocked days
      for (let i = start; i <= end; i = addDays(i, 1)) {
        if (blockedDays.includes(i.getDay())) {
          count--;
        }
      }
      return count;
    };

    // Less than 1 week and Not booked on same day
    if (weeksDiff <= 0) {
      // Get days included within a week (end inclusive) as an array
      let daysIncluded = [];
      for (let i = addDays(startTime, 1); i <= endTime; i = addDays(i, 1)) {
        daysIncluded.push(getDay(i));
      }
      // Remove end day
      const index = daysIncluded.indexOf(getDay(endTime));
      if (index > -1) {
        daysIncluded.splice(index, 1);
      }
      const leftoverDays = findCommonDays(blockedDays, daysIncluded);
      nBlockedDays = leftoverDays.length;
    // Time period is >= 1 week
    } else {
      // Calculate num blocked days in 1 week then multiply and add leftover days
      const blockedWk = blockedDays.length * weeksDiff;
      const newStart = addWeeks(startTime, weeksDiff);
      const leftoverDays = blockedDays.filter(blockedDay =>
        blockedDay > getDay(newStart) && blockedDay < getDay(endTime)
      );
      nBlockedDays = leftoverDays.length + blockedWk;
    }

    // Subtract booked days from the listing (exclude already blocked days)
    let totalBookedDays = 0;
    for (const b of bookings) {
      const bookedStart = new Date(b.start_time);
      const bookedEnd = new Date(b.end_time);
      // booked date is not within range
      if ((bookedStart < startTime && bookedEnd < startTime) ||
        (bookedStart > endTime && bookedEnd > endTime)) {
        continue;
      }
      // booking start and end is between user's start and end
      if (bookedStart > startTime && bookedEnd < endTime) {
        totalBookedDays += countBookedDays(bookedStart, bookedEnd);
      }
      // NOTE: Can never have a booked date in between user dates
    }

    const totalDays = ((daysDiff - nBlockedDays) - totalBookedDays) + 1;
    let totalHours = 0;
    // Use daily cost if times are the same 
    if (hoursDiff === 0) {
      cost = totalDays * listing.price_daily;
      totalHours = totalDays * 24;
    // Else use the hourly cost
    } else {
      cost = hourlyCost * totalDays;
      totalHours = totalDays * hoursDiff;
    }
    console.log(totalHours);
    setTotalHrs(totalHours);
    setTotal(cost);
  }, [listing, endTime, startTime, blockedDays, bookedTimes, bookings, setTotal, setTotalHrs])

  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={bookingBox}
    >
      
      <Box
        display="flex"
        alignItems="baseline"
        gap={1}
        pb={1}
        mb={2}
        sx={{ borderBottom: 1, borderColor: 'grey.500'}}
      >
        <Typography variant='h5' component="div">
          ${total}
        </Typography>
        <Typography variant='subtitle1' component="div">
          total
        </Typography>
      </Box>
      
      <Box
        display="flex"
        gap={2}
        pb={2}
        mb={2}
        sx={{
          borderBottom: 1,
          borderColor: 'grey.600'
        }}
      >
        <DateTimePicker 
          name={"Start"}
          bookings={bookedTimes}
          blockedDays={blockedDays}
          minHr={minHr}
          maxHr={maxHr}
        />
        <DateTimePicker 
          name={"End"}
          bookings={bookedTimes}
          blockedDays={blockedDays}
          minHr={minHr}
          maxHr={maxHr}
        />
      </Box>
        {listing &&
          <Typography variant='body1' component="div" mb={2}>
            ${listing.price_hourly}/hr, ${listing.price_daily}/day
          </Typography>
        }
        
        <Box
          display="flex"
          justifyContent="space-between"
          mb={2}
        >
          <Typography variant='body1' component="div" sx={{ fontWeight: 'bold' }}>
            Total
          </Typography>
          {listing &&
            <Typography variant='body1' component="div" sx={{ fontWeight: 'bold' }}>
              ${total}.00
            </Typography>
          }
        </Box>
        <Button variant="contained" onClick={handleBookClick} mb={2}
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1em'
          }}
        >
          Book
        </Button>
      
    </Box>
  );
}

export default BookingContainer;