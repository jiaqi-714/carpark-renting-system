import React from 'react';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function SpaceType ({typeOfSpot, setTypeOfSpot, handleChange, blank}) {
  return (
    <div>
      <FormControl fullWidth>
          <InputLabel id="typeOfSpot" >Type of spot</InputLabel>
          <Select
          labelId="typeOfSpot"
          value={typeOfSpot}
          label="typeOfSpot"
          onChange={(e) => handleChange(setTypeOfSpot, e)}
          >
            {blank && <MenuItem value="Any">Any</MenuItem>}
            <MenuItem value="Driveway">Driveway</MenuItem>
            <MenuItem value="Indoor lot">Indoor lot</MenuItem>
            <MenuItem value="Undercover">Undercover</MenuItem>
            <MenuItem value="Outside">Outside</MenuItem>
            <MenuItem value="Block my driveway">Block my driveway</MenuItem>
            <MenuItem value="Carpot">Carpot</MenuItem>
            <MenuItem value="Lock up garage">Lock up garage</MenuItem>
            <MenuItem value="Outdoor lot">Outdoor lot</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
      </FormControl>
    </div>
  );
}

export default SpaceType;
