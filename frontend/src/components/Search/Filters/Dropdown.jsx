import React from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

function Dropdown({ spaceType, handleChange }) {

  const setSpaceType = (event) => {
    handleChange(event);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          id="select"
          value={spaceType}
          onChange={setSpaceType}
          size="medium"
          name="spaceType"
        >
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
    </Box>
  );
}

Dropdown.propTypes = {
  spaceType: PropTypes.string,
  setSpaceType: PropTypes.func
};

export default Dropdown;