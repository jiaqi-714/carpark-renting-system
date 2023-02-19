import React from 'react';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Grid from '@mui/material/Grid';

function BookingSearchBar ({ setID, setStart, setEnd, setStat }) {
  const [status, setStatus] = React.useState('');
  const [startDate, setStartDate] = React.useState(new Date(Date.now() - 2629743 * 1000));
  const [endDate, setEndDate] = React.useState(new Date());
  const [bookingID, setBookingID] = React.useState('');

  const handleChange = (event) => {
    setStatus(event.target.value);
  };

  const handleSearch = () => {
    setID(bookingID);

    if (startDate >= endDate) {
      alert('End date cannot happen before start date!');
    }

    setStart(startDate);
    setEnd(endDate);
    setStat(status);
  }

  return (
    <div>
      <Grid container spacing={2} ml={5}>
        <Grid item xs={1.5}>
          <TextField id="outlined-basic" type='number' label="Booking ID" variant="outlined" value={bookingID} onChange={(e) => setBookingID(e.target.value)}/>
        </Grid>
        <Grid item xs={1.5}>
          <DatePicker
            label="Start Date"
            value={startDate} 
            onChange={(newValue) => {
              setStartDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={1.5}>
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(newValue) => {
              setEndDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Grid>
        <Grid item xs={1.5}>
          <FormControl fullWidth>
            <InputLabel id="order-status-label">Order Status</InputLabel>
            <Select
              labelId="order-select-label"
              id="order-select-select"
              value={status}
              label="Order Status"
              onChange={handleChange}
            >
              <MenuItem value={'Any'}>Any</MenuItem>
              <MenuItem value={'Cancelled'}>Cancelled</MenuItem>
              <MenuItem value={'Completed/Paid'}>Completed/Paid</MenuItem>
              <MenuItem value={'Not paid'}>Not paid</MenuItem>
              <MenuItem value={'Refunded'}>Refunded</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={1.5}>
          <TextField id="vehicle-no" label="Vehicle No" variant="outlined" />
        </Grid> */}
        <Grid item xs={3} sx={{marginTop: 1}}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Grid>
      </Grid>

    </div>
  );
}

export default BookingSearchBar;
