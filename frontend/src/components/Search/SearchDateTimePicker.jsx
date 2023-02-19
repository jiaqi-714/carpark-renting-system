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
import addDays from 'date-fns/addDays';
import isEqual from 'date-fns/isEqual'
import getMinutes from 'date-fns/getMinutes'
import getHours from 'date-fns/getHours'

import { useContext, Context } from '../../context';

const whiteBg = {
  backgroundColor: 'white'
}

function SearchDateTimePicker ({ name }) {
  const { getters, setters } = useContext(Context);

  const startTime = getters.startDateTime;
  const startSetter = setters.setStartDateTime;
  const endSetter = setters.setEndDateTime;

  const defaultTime = set(addHours(new Date(), 1), {minutes:0, seconds:0, milliseconds:0});
  const [inputTime, setInputTime] = React.useState(
    name === "Start" ? defaultTime
      // Make end time 1 hr ahead of start
      : addHours(defaultTime, 1)
  );
  const [inputDate, setInputDate] = React.useState((name === "End" && getHours(inputTime) === 0) ?
    // Set end date to next day if default hr is 12 AM
    addDays(defaultTime, 1) : defaultTime
  );
  
  // Set date time
  React.useEffect(() => {
    // Combine date and time inputs
    const combineTime = () => {
      let newDateTime = set(inputDate, 
        { hours: 0, minutes: 0, seconds: 0, milliseconds: 0 }
      )
      newDateTime = addMinutes(newDateTime, getMinutes(inputTime));
      newDateTime = addHours(newDateTime, getHours(inputTime));
  
      // Store in start/end context
      if (name === "Start") {
        startSetter(newDateTime);
      } else if (name === "End") {
        endSetter(newDateTime);
      }
    };
  
    combineTime();
  }, [inputDate, inputTime, name, startSetter, endSetter]);

  const handleMinDate = () => {
    if (name === 'End') {
      return startTime;
    }
  }

  const handleMinTime = () => {
    if (name === 'End' && isEqual(set(startTime, {hours:0, minutes:0, seconds:0, milliseconds:0}), inputDate)) {
      return addHours(startTime, 1);
    }
  }

  return (
    <Box
      display="flex"
      flexDirection={"column"}
      gap={1}
    >
      <Typography variant='subtitle1' component="div">
        {name}
      </Typography>
      <DatePicker
        label={`${name} Date`}
        value={inputDate}
        disablePast={true}
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
        onChange={(newValue) => {
          setInputTime(newValue);
        }}
        renderInput={(params) => <TextField {...params} sx={{ ...whiteBg }} />}
        views={['hours']}
        // End time min only works for initial render
        minTime={handleMinTime()}
      />
    </Box> 
  );
}

SearchDateTimePicker.propTypes = {
  name: PropTypes.string,
};

export default SearchDateTimePicker;
