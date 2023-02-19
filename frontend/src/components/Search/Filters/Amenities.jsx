import React from 'react';

import PropTypes from 'prop-types';

import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

function Amenities({ amenities, amenityHandler }) {
  const handleChange = (event) => {
    // setAmenities({
    //   ...amenities,
    //   [event.target.name]: event.target.checked,
    // });
    amenityHandler(event);
  };

  const { amenity_24_7, amenity_sheltered, amenity_security_gates } = amenities;

  return (
    <FormGroup
      row={true}
    >
      <FormControlLabel control={<Checkbox checked={amenity_24_7} onChange={handleChange} name="amenity_24_7" />} label="24/7 access" />
      <FormControlLabel control={<Checkbox checked={amenity_sheltered} onChange={handleChange} name="amenity_sheltered" />} label="Sheltered" />
      <FormControlLabel control={<Checkbox checked={amenity_security_gates} onChange={handleChange} name="amenity_security_gates" />} label="Security Gates" />
    </FormGroup>
  )
}

Amenities.propTypes = {
  amenitiesList: PropTypes.array
};

export default Amenities;