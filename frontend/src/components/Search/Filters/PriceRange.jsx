import React from 'react';

import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';

function PriceRange({ type, price, handleChange }) {
  const handlePriceChange = (event) => {
    handleChange(event, "number", event.target.value);
  }

  return (
    <>
      <FormControl>
        <InputLabel htmlFor={`${type}-price-input`}>{type}</InputLabel>
        <OutlinedInput
          id={`${type}-price-input`}
          name={`${type}Price`}
          value={price}
          size="small"
          sx={{ maxWidth: "120px" }}
          onChange={handlePriceChange}
          startAdornment={<InputAdornment position="start">$</InputAdornment>}
          label={`${type}`}
          inputProps={{
            min: 0,
            max: 10000,
            step: 10,
          }}
        />
      </FormControl>
    </>
  )
}

export default PriceRange;