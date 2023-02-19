import React from 'react';

import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

function InputSlider({ distance, handleChange }) {

  const handleSliderChange = (event, newValue) => {
    handleChange(event, "slider", newValue);
  };

  const handleInputChange = (event) => {
    handleChange(event, "number", event.target.value);
  };

  const handleBlur = (event) => {
    if (distance < 0) {
      handleChange(event, "blur", 0);
    } else if (distance > 100) {
      handleChange(event, "blur", 100);
    }
  };

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="baseline"
        mb={"15px"}
      >
        <Typography variant="subtitle1" id="linear-slider" fontWeight="bold">
          Max Distance:
        </Typography>
        <OutlinedInput
          value={distance}
          size="small"
          onChange={handleInputChange}
          onBlur={handleBlur}
          name="distance"
          endAdornment={<InputAdornment position="end">km</InputAdornment>}
          inputProps={{
            step: 5,
            min: 0,
            max: 100,
            type: 'number',
            'aria-labelledby': 'input-slider',
          }}
        />
      </Box>
      <Slider
        value={typeof distance === 'number' ? distance : 0}
        name="distance"
        onChange={handleSliderChange}
        aria-labelledby="input-slider"
      />
    </Box>
  );
}

Slider.propTypes = {
  distance: PropTypes.number,
  setDistance: PropTypes.func
};

export default InputSlider;