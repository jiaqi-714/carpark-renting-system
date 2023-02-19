import React from 'react';

import SpaceType from '../InputDataStructure/SpaceType';

import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

function ListingSearchBar ({ setID, setSearchType, setSearchAddress }) { 
  const [typeOfSpot, setTypeOfSpot] = React.useState('');
  const [searchId, setSearchId] = React.useState();
  const [address, setAddress] = React.useState('')

  const handleChange = (func, event) => {
    func(event.target.value);
  };

  const handleSearch = () => {
    if (searchId !== undefined) {
      setID(searchId);
    }

    if (typeOfSpot !== '') {
      setSearchType(typeOfSpot);
    }

    if (address !== '') {
      setSearchAddress(address);
    }
  }

  return (
    <Grid container ml={5} spacing={2} mb={2}>
      <Grid item xs={2}>
        <TextField 
          id="outlined-basic" 
          label="Listing ID" 
          variant="outlined" 
          type="number"
          fullWidth 
          value={searchId} 
          onChange={(e) => handleChange(setSearchId, e)}
        />
      </Grid>
      <Grid item xs={2}>
        <SpaceType typeOfSpot={typeOfSpot} setTypeOfSpot={setTypeOfSpot} handleChange={handleChange} blank={true}/>
      </Grid>
      <Grid item xs={2}>
        <TextField 
          id="outlined-basic"
          label="Address" 
          variant="outlined" 
          value={address} 
          onChange={(e) => handleChange(setAddress, e)} 
          fullWidth
        />
      </Grid>
      <Grid item xs={2}>
        <Box sx={{marginTop: 1}}>
          <Button
            variant="contained"
            color="secondary"
            onClick={handleSearch}
          >
            Search
          </Button>
        </Box>
      </Grid>
  </Grid>
  );
}

export default ListingSearchBar;
