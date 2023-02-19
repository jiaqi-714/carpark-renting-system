import React from 'react';

import Geocode from "react-geocode";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Input from '@mui/material/Input';

import { Autocomplete } from "@react-google-maps/api";

import ListingMap from './ListingMap'

function ListingBoxStep1 ({ address, setAddress }) {
  const [lat, setLat] = React.useState(-33.8688);
  const [lng, setLng] = React.useState(151.2093);

  const addressRef = React.useRef();

  const handleChange = () => {
    setAddress(addressRef.current.value);
  }

  const handleAutocompleteChange = () => {
    handleChange();
    // Gets postcode and geocode again in ListingStep.jsx
    Geocode.fromAddress(addressRef.current.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
      }
    );
  }

  return (
    <>
      <Typography variant='body1' align="center" component="div" mt={4}>
        Enter the full address of your parking space:
      </Typography>

      <Box sx={{ width: '35ch', margin:'auto', paddingTop: '10px'}}>
        <Autocomplete 
          onPlaceChanged={handleAutocompleteChange}
          restrictions={{country: 'au'}}
        >
          <Input
            type='text'
            placeholder='Address'
            inputRef={addressRef}
            value={address}
            onChange={handleChange}
            variant="outlined"
            fullWidth
          />
        </Autocomplete>
      </Box>

      <Box 
        display="flex"
        justifyContent="center"
        mt={5}
        sx={{
          height: '250px',
          width: '100%',
        }}
      >
        <ListingMap 
          searchCoords={{ lat, lng }}
        />
      </Box>
    </>
  );
}

export default ListingBoxStep1;
