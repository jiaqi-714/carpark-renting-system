import React from 'react';
import { useNavigate } from 'react-router-dom';

import Typography from '@mui/material/Typography';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import IconButton from '@mui/material/IconButton';

import FetchHelper from '../../util/FetchHelper';

function ListingDetails ({ listingID }) {
  const navigate = useNavigate();

  const [address, setAddress] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [start, setStart] = React.useState(0);
  const [end, setEnd] = React.useState(0);
  const [type, setType] = React.useState('');
  const [dcost, setdCost] = React.useState(0);
  const [hcost, sethCost] = React.useState(0);

  React.useEffect(() => {
    // Get listing details
    FetchHelper('GET', `/listings/${listingID}`)
    .then(data => {
        // TODO: add further listing details
        setAddress(data.address);
        setDescription(data.description);
        if (/^\d$/.test(data.starttime)) {
          setStart('0' + data.starttime);
        } else {
          setStart(data.starttime);
        }
        console.log(data.endtime)
        if (/^\d$/.test(data.endtime)) {
          setEnd('0' + data.endtime);
        } else {
          setEnd(data.endtime);
        }
        setType(data.space_type);
        setdCost(data.price_daily);
        sethCost(data.price_hourly);
      })
  }, [listingID]);

  return (
    <>
      <IconButton aria-label="back" sx={{marginRight: 'auto'}} onClick={() => navigate(-1)}>
        <ArrowBackIcon fontSize="large" />
      </IconButton>

      <Typography variant='h4' component="div">
        Listing Details
      </Typography>

      <Typography variant='h6' mt={3} component="div" >
        Listing ID: {listingID}
      </Typography>

      <Typography variant='h6' mt={3} component="div" gutterBottom>
        Address: {address}
      </Typography>

      <Typography variant='h6' mt={3} component="div">
        Start hr: {start}:00
      </Typography>
      <Typography variant='h6' mt={3} component="div">
        End hr: {end}:00
      </Typography>

      <Typography variant='h6' mt={3} component="div">
        Car space Type: {type}
      </Typography>

      <Typography variant='h6' mt={3} component="div" gutterBottom>
        Description: {description}
      </Typography>


      <Typography variant='h6' mt={3} component="div">
        Hourly Cost: ${hcost}
      </Typography>
      <Typography variant='h6' mt={3} mb={4} component="div">
        Daily Cost: ${dcost}
      </Typography>
      
    </>
  )
}

export default ListingDetails;
