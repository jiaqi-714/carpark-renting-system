import React from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

import set from 'date-fns/set';
import addMinutes from 'date-fns/addMinutes';
import addHours from 'date-fns/addHours';
import getTime from 'date-fns/getTime';
import isEqual from 'date-fns/isEqual';

import { useContext, Context } from '../../context';

const whiteBg = {
  backgroundColor: 'white'
}

// Dates will never be error because search already filtered correct times
function DateTimePicker ({ name, bookings, blockedDays, minHr, maxHr }) {
  const { getters, setters } = useContext(Context);

  const listing = getters.viewListing;
  
  const givenStart = getters.startDateTime;
  const givenEnd = getters.endDateTime;
  // Use given date time from search page
  const userDateTime = (name === "Start" 
    ? givenStart : name === "End" 
    ? givenEnd : null
  );

  const defaultTime = set(addHours(new Date(), 1), {minutes:0, seconds:0, milliseconds:0});
  // Remove hours and minutes from new Date()
  const [inputDate, setInputDate] = React.useState(userDateTime ? 
    set(userDateTime, { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }) : defaultTime
  );
  const [inputTime, setInputTime] = React.useState(userDateTime ? userDateTime : defaultTime);

  const bookedStart = getters.bookedStart;
  const startSetter = setters.setBookedStart;
  const endSetter = setters.setBookedEnd;

  const disableBookedDates = (date) => {
    if (!listing || !bookings)  return;
    return blockedDays.includes(date.getDay()) || bookings.includes(getTime(date));
  };

  const handleMinDate = () => {
    if (name === 'End') {
      return bookedStart;
    }
  }

  const handleMinTime = () => {
    if (name === 'End' && isEqual(set(bookedStart, {hours:0, minutes:0, seconds:0, milliseconds:0}), inputDate)) {
      return addHours(bookedStart, 1);
    } else {
      return minHr;
    }
  }

  React.useEffect(() => {
    // Combine date and time inputs
    const combineTime = () => {
      let newDateTime = set(inputDate, 
        { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
      );
      newDateTime = addMinutes(newDateTime, inputTime.getMinutes());
      newDateTime = addHours(newDateTime, inputTime.getHours());
  
      // Store in booked(Start/End) context
      if (name === "Start") {
        startSetter(newDateTime);
      } else if (name === "End") {
        endSetter(newDateTime);
      }
    };

    combineTime();
  }, [inputDate, inputTime, name, startSetter, endSetter]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap={2}
    >
      <Typography variant='subtitle1' component="div">
        {name}
      </Typography>
      <DatePicker
        label={`${name} Date`}
        value={inputDate}
        disablePast={true}
        shouldDisableDate={disableBookedDates}
        inputFormat="dd/MM/yyyy"
        onChange={(newValue) => {
          setInputDate(newValue);
        }}
        renderInput={(params) => <TextField {...params} sx={{ ...whiteBg }} />}
        minDate={handleMinDate()}
      />
      <TimePicker
        label={`${name} Time`}
        value={inputTime}
        maxTime={maxHr}
        onChange={(newValue) => {
          setInputTime(newValue);
        }}
        renderInput={(params) => <TextField {...params} sx={{ ...whiteBg }} />}
        minutesStep={60}
        views={['hours']}
        minTime={handleMinTime()}
      />
    </Box> 
  );
}

DateTimePicker.propTypes = {
  name: PropTypes.string,
  // bookings: PropTypes.array, // needs to be nullable
};

export default DateTimePicker;