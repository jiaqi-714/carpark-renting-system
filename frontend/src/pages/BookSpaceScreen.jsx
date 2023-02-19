import React from 'react';

import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';

import MainContainer from '../components/BookSpace/MainContainer';
import BookingContainer from '../components/BookSpace/BookingContainer';

import { useContext, Context } from '../context';

// import { callNoBody } from '../util/helpers';
import FetchHelper from '../util/FetchHelper';

function BookSpaceScreen ({ isLoaded }) {
  let { listingId } = useParams();

  const { setters } = useContext(Context);

  const listingSetter = setters.setViewListing;

  React.useEffect(() => {
    FetchHelper('GET', `/listings/${listingId}`)
      .then(data => {
        listingSetter(data);
      })
  }, [listingId, listingSetter]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      gap={6}
    >
      <MainContainer isLoaded={isLoaded} />
      <BookingContainer />
    </Box>
  )
}

export default BookSpaceScreen;
