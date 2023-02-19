import React from 'react';

import SpaceType from '../InputDataStructure/SpaceType'

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';

function ListingBoxStep2 ({ typeOfSpot, setTypeOfSpot, description, setDescription, instruction, setInstruction, setAccess, setSheltered, setSecurityGate, handleCheckbox, access, sheltered, securityGate }) {
  const widthOfAme = { width: "150px" };

  const handleChange = (func, event) => {
    func(event.target.value);
  };

  return (
    <div>
      <Box sx={{ minWidth: 120 }}>
        <Typography variant='body1' component="div" mt={2}>
          What type of space are you listing?
        </Typography>
        <SpaceType typeOfSpot={typeOfSpot} setTypeOfSpot={setTypeOfSpot} handleChange={handleChange}/>
      </Box>

      <Typography variant='body1' component="div" mt={2}>
        Please select amenities nearby
      </Typography>

      <FormGroup
        display="flex">
        <div>
          <FormControlLabel control={<Checkbox checked={access} onChange={(e) => {handleCheckbox(e, setAccess)}} />} sx={widthOfAme} label="24/7 access" />
          <FormControlLabel control={<Checkbox checked={sheltered} onChange={(e) => {handleCheckbox(e, setSheltered)}} />} sx={widthOfAme} label="Sheltered" />
          <FormControlLabel control={<Checkbox checked={securityGate} onChange={(e) => {handleCheckbox(e, setSecurityGate)}} />} sx={widthOfAme} label="Security Gates" />
        </div>
        {/* <div>
          <FormControlLabel control={<Checkbox false />} onChange={(e) => {handleCheckbox(e, setCctv)}} sx={widthOfAme} label="CCTV" />
          <FormControlLabel control={<Checkbox false />} onChange={(e) => {handleCheckbox(e, setUnderground)}} sx={widthOfAme} label="Underground" />
          <FormControlLabel control={<Checkbox false />} onChange={(e) => {handleCheckbox(e, setCarWash)}} sx={widthOfAme} label="Car Wash" />
        </div>
        <div>
          <FormControlLabel control={<Checkbox false />} onChange={(e) => {handleCheckbox(e, setElectricCharging)}} label="Electric charging" />
        </div> */}
      </FormGroup>

      <Typography variant='body1' component="div" mt={2}>
        Please enter a description of your car space
      </Typography>
      <TextField
        label="Description"
        multiline
        maxRows={4}
        minRows={4}
        value={description}
        fullWidth
        onChange={(e) => handleChange(setDescription, e)}
      />

      <Typography variant='body1' component="div" mt={2}>
        Please enter some instructions on how to use the car space
      </Typography>
      <TextField
        label="Instruction"
        multiline
        maxRows={4}
        minRows={4}
        value={instruction}
        fullWidth
        onChange={(e) => handleChange(setInstruction, e)}
      />
    </div>
  );
}

export default ListingBoxStep2;
