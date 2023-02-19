import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Popover from '@mui/material/Popover';

import RecommendationCard from '../Home/RecommendationCard';

import FetchHelper from '../../util/FetchHelper';

function Recommendation ({ coords, setIsOpen, resetTimer }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [listingID, setListingID] = React.useState(null);
  const [photo, setPhoto] = React.useState('');
  const [name, setName] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [hPrice, setHPrice] = React.useState(0);
  const [dPrice, setDPrice] = React.useState(0);

  const handleClose = () => {
    setIsOpen(false);
    // reset timeout
    resetTimer();
  }

  const handleClick = (event) => {
    // get rec
    FetchHelper('GET', '/recommendation', null, true)
    .then(data => {
      setListingID(data.id);
      setPhoto(data.photo_link);
      setName(data.name);
      setAddress(data.address);
      setDescription(data.description);
      setHPrice(data.price_hourly);
      setDPrice(data.price_daily);
    })
  // show popover
    setAnchorEl(event.currentTarget);
  }

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'rec-popover' : undefined;

  return (
    <Box
      display="flex"
      flexDirection="column"
      p={2}
      sx={{
        borderBottom: 1,
        borderColor: 'grey.300',
        boxShadow: 2
      }}
    >
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <CloseIcon color="action" onClick={handleClose} cursor={"pointer"} />
      </Box>
      <Box
        display="flex"
        justifyContent="space-around"
      >
        <Typography variant='h6' component="div">
          Don't know what to choose?
        </Typography>
        <Button variant="contained" onClick={handleClick}>Get a suggestion</Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <RecommendationCard 
            id={listingID}
            name={name}
            description={description}
            photo={photo}
            address={address}
            hPrice={hPrice}
            dPrice={dPrice}
          />
        </Popover>
      </Box>
    </Box>
  )
};

export default Recommendation;