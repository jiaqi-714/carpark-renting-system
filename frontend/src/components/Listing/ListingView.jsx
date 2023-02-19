import React from 'react';

import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import FetchHelper from '../../util/FetchHelper';
import { useContext, Context } from '../../context';

import { useSearchParams } from 'react-router-dom'

function ListingView () {
  const [searchParams, setSearchParams] = useSearchParams();
  const ListingId = searchParams.get("id");
  return (
    <div>
      <Typography variant='h4'component="div" mt={4} sx={{ fontWeight: 'bold', m: 1 }}>
        Title
      </Typography>
      <Typography variant='body1'component="div" mt={4}>
        Space Type:
      </Typography>
      <Typography variant='h4'component="div" mt={4}>
        Parking space description
      </Typography>
      <Typography variant='body1'component="div" mt={4}>
        Description
      </Typography>
      <Typography variant='h4'component="div" mt={4}>
        Parking space Amenities
      </Typography>
      <Typography variant='body1'component="div" mt={4}>
        Amenities
      </Typography>
      <Typography variant='h4'component="div" mt={4}>
        Parking space Instruction
      </Typography>
      <Typography variant='body1'component="div" mt={4}>
        Instruction
      </Typography>
      <Typography variant='h4'component="div" mt={4}>
        What's NearBy
      </Typography>
      <Typography variant='body1'component="div" mt={4}>
        What's NearBy
      </Typography>
      <Typography variant='body1'component="div" mt={4}>
        Last updated
      </Typography>
      
      Price
      Availableity
      User pulbished
      <Button>Edit</Button>
      <Button>Delete</Button>

    </div>
  );
}

export default ListingView;