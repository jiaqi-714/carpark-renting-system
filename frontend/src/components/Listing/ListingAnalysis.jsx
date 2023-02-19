import React from 'react';

import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import format from 'date-fns/format'

import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis } from 'recharts';

import FetchHelper from '../../util/FetchHelper';

function ListingAnalysis () {

  const [postcode, setPostcode] = React.useState('');
  const [inputDate, setInputDate] = React.useState(null);
  const [userate, setUserate] = React.useState('');

  const [title, setTitle] = React.useState('');

  const defaultUsageData = [
    { name: 'Total Listings', value: 0 },
    { name: 'Total Bookings', value: 0 },
  ];
  const [chartData, setChartData] = React.useState(defaultUsageData);

  const handlePostcodeChange = (event) => {
    setPostcode(event.target.value);
  }

  const handleSearch = () => {
    if (!inputDate || !postcode) {
      return;
    }

    let dateStr = format(inputDate, 'yyyyMMdd');
    FetchHelper('GET', `/analysis/suburb/usage/${postcode}/${dateStr}`)
      .then((data) => {
        const usageData = [
          { name: 'Total Listings', value: data.num_car_spaces },
          { name: 'Total Bookings', value: data.num_bookings },
        ];
        setChartData(usageData);
        const dateStr = format(inputDate, 'dd/MM/yyyy');
        setTitle(`Car Space Frequency Usage in ${postcode} since ${dateStr}`);
      })
    FetchHelper('GET', `/analysis/suburb/userate/${postcode}`)
      .then((data) => {
        setUserate(data);
      })
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      m={4}
      gap={2}
      minHeight={150}
    >
      <Typography variant='h6' component="div" fontWeight="bold">
        Frequency Usage per Suburb
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" gap={2}>
          <TextField
            id="postcode"
            label="Postcode"
            value={postcode}
            onChange={handlePostcodeChange}
          />
          <DatePicker
            label="From Start Date"
            value={inputDate}
            inputFormat="dd/MM/yyyy"
            onChange={(newValue) => {
              setInputDate(newValue);
            }}
            renderInput={(params) => <TextField {...params} />}
          />
        </Box>
        <Button variant="contained" onClick={handleSearch}>Get analysis</Button>
      </Box>
      
      <Typography variant="subtitle1" fontWeight="bold" align="center">{title}</Typography>
      <ResponsiveContainer width="95%" height={310}>
        <BarChart width={600} height={280} maxBarSize={50} data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
      {userate &&
        <Typography variant="body1">
          <b>Usage rate of car spaces in {postcode}:</b> {userate}%
        </Typography>
      }
    </Box>
  );
}

export default ListingAnalysis;
