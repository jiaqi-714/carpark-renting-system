import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import PageContainer from '../../components/PageContainer';

import { useContext, Context } from '../../context';

const names = [
  'Hatchback',
  'Sedan',
  'SUV/4WD',
  'Bike',
  'Van',
];

function VehicleForm ({ carNum, carType, setCarNum, setCarType, bookingID }) {
  const navigate = useNavigate();

  const { getters } = useContext(Context);

  const listing = getters.viewListing;

  const start = getters.bookedStart;
  const end = getters.bookedEnd;

  const [startStr, setStartStr] = React.useState('');
  const [endStr, setEndStr] = React.useState('');

  const handleNextBtn = () => {
    if (!carNum || !carType) {
      alert('Please fill in all fields');
      return;
    }
    // Set query string for the next page
    const params = new URLSearchParams({
      previous_step: "vehicle",
      step: "payment",
      bookingid: bookingID
    });
    navigate(`/bookingForm/${listing.id}?${params}`);
  }

  const handleCarNumChange = (event) => {
    setCarNum(event.target.value.toUpperCase());
  }

  const handleCarTypeChange = (event) => {
    setCarType(event.target.value);
  }

  React.useEffect(() => {
    if (!start || !end) return;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      hour: 'numeric', minute: 'numeric', hour12: true };
    setStartStr(start.toLocaleDateString('en-GB', options));
    setEndStr(end.toLocaleDateString('en-GB', options));
  }, [start, end]);

  return (
    <PageContainer items={
      <>
        <Typography variant='h5' component="div">
          Booking Form
        </Typography>
        <Typography variant='caption' component="div" mb={2}>
          This car space will be reserved for 10 minutes
        </Typography>
        <Typography variant='h6' component="div" sx={{ fontWeight: 'bold' }}>
          {listing.name}
        </Typography>
        <Typography variant='subtitle1' component="div" mb={2}>
          Address: {listing.address}
        </Typography>
        <Typography variant='body1' component="div">
          Start Time: {startStr}
        </Typography>
        <Typography variant='body1' component="div" mb={2}>
          End Time: {endStr}
        </Typography>
        <Typography variant='h6' component="div" mb={1}>
          Vehicle
        </Typography>
        <TextField 
          id="vehicle-num-input"
          label="Vehicle Registration Number"
          variant="outlined"
          sx={{ maxWidth: 250, mb: 3 }} 
          inputProps={{style: {textTransform: 'uppercase'}}}
          value={carNum}
          onChange={handleCarNumChange}
        />
        <FormControl>
          <InputLabel id="vehicle-select-label">Vehicle Type</InputLabel>
          <Select
            labelId="vehicle-select-label"
            id="vehicle-select"
            value={carType}
            label="Vehicle Type"
            onChange={handleCarTypeChange}
            sx={{ maxWidth: 400 }} 
          >
            {names.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Box
          display="flex"
          justifyContent="space-between"
          mt={4}
        >
          <Button variant="outlined" onClick={() => navigate(-1)}>Back</Button>
          <Button variant="outlined" onClick={handleNextBtn}>Next</Button>
        </Box>
      </>
    } />
  )
}

export default VehicleForm;
