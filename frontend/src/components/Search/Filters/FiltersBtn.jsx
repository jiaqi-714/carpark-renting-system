import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

import { ButtonBox, ModalStyle } from '../../Modal';

import Slider from './Slider';
import PriceRange from './PriceRange';
import Dropdown from './Dropdown';
import Amenities from './Amenities';

function FiltersBtn ({ filterValues, changeHandler, amenityHandler, numericHandler, setSearchFilterVals, setApplyFilter }) {

  // Modal settings
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
  }
  
  const handleApply = () => {
    if (filterValues.minPrice > filterValues.maxPrice) {
      alert("Minimum daily price must be less than the maximum.");
      return;
    }
    setOpen(false);
    // Apply filters
    setSearchFilterVals(filterValues);
    setApplyFilter(true);
  }
  
  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={ModalStyle(500, 800)}
          display="flex"
          flexDirection="column"
          gap={2}
        >
          <Box display='flex' justifyContent='space-between' >
            <Typography variant="h5" component="h5" fontWeight="bold">
              Filters
            </Typography>
            <CloseIcon color="action" onClick={handleClose} cursor={"pointer"} />
          </Box>
          <Slider distance={filterValues.distance} handleChange={numericHandler} />

          <Box
            display='flex'
            flexDirection="column"
          >
            <Typography variant="subtitle1" component="div" fontWeight="bold">
              Price Range
            </Typography>
            <Typography variant="body2" component="div" color="grey.600">
              Daily price
            </Typography>
          </Box>
        
          <Box
            display="flex"
            gap={2}
          >
            <PriceRange type="min" price={filterValues.minPrice} handleChange={numericHandler} />
            <PriceRange type="max" price={filterValues.maxPrice} handleChange={numericHandler} />
          </Box>
          
          <Typography variant="subtitle1" component="div" fontWeight="bold">
            Type of space
          </Typography>
          <Dropdown spaceType={filterValues.spaceType} handleChange={changeHandler}/>

          <Typography variant="subtitle1" component="div" fontWeight="bold">
            Amenities
          </Typography>
          <Amenities 
            amenities={filterValues.amenities}
            amenityHandler={amenityHandler}
          />

          <Box sx={ButtonBox}>
            <Button sx={{ mt: 2 }} variant="contained" color='success'
              onClick={handleApply}
            >
              Apply
            </Button>
          </Box>
        </Box>
      </Modal>
      <Button
        onClick={handleOpen}
        variant="contained"
        color="secondary"
        sx={{
          height: '50px'
        }}
      >
        Filters
      </Button>
    </>
  )
}

export default FiltersBtn;