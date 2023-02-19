import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import ListingDetail from './ListingDetail'
import ListingAnalysis from './ListingAnalysis'
import RemainBalance from './RemainBalance'
import ListingSearchBar from './ListingSearchBar'

import FetchHelper from '../../util/FetchHelper';
import { useContext, Context } from '../../context';

function ListingDisplay () {
  const { getters, setters } = useContext(Context);

  const [searchID, setSearchID] = React.useState('');
  const [searchType, setSearchType] = React.useState('');
  const [searchAddress, setSearchAddress] = React.useState('');
  const [change, setChange] = React.useState(0);

  const listings = getters.allListings;
  const listingSetter = setters.setAllListings;

  const filter = (data) => {
    let resultAfterID = [];
    if (searchID !== '') {
      if (searchID < 0) {
        alert('Invalid search, check your input and try again.');
        return;
      }
      for (let listing of data) {
        let re = new RegExp(listing.id);
        if (searchID.search(re) !== -1) {
          resultAfterID.push(listing);
        }
      }
    } else {
      for (let listing of data) {
        resultAfterID.push(listing);
      }
    }

    let resultsAftertype = [];
    if (searchType !== '' && searchType !== 'Any') {
      for (let listing of resultAfterID) {
        if (listing.space_type === searchType) {
          resultsAftertype.push(listing);
        }
      }
      console.log(resultAfterID);
    } else {
      for (let listing of resultAfterID) {
        resultsAftertype.push(listing);
      }
    }

    let resultsAfterAddress = [];
    if (searchAddress !== '') {
      let re = new RegExp(searchAddress);
      console.log(searchAddress);
      for (let listing of resultsAftertype) {
        if (listing.address.search(re) !== -1) {
          resultsAfterAddress.push(listing);
        }
      }
    } else {
      for (let listing of resultsAftertype) {
        resultsAfterAddress.push(listing);
      }
    }
    
    listingSetter(resultsAfterAddress);
  }

  React.useEffect(() => {
    FetchHelper('GET', '/admin', null, true)
    .then(data => {
      if (data.is_admin === 'True') {
        FetchHelper('GET', '/listings')
        .then(data2 => {
          filter(data2);
        })
      } else {
        FetchHelper('GET', '/listings/user', null, true)
        .then(data3 => {
          if (data3 !== 'error') {
            filter(data3);
          }
        })
      }
    })
  }, [listingSetter, searchID, searchType, searchAddress, change]);

  return (
    <Box>
      <Typography margin='auto' variant='h4' ml={3} my={4} fontWeight='bold'>
        All Car Space Listings
      </Typography>
      <RemainBalance />
      <ListingSearchBar setID={setSearchID} setSearchType={setSearchType} setSearchAddress={setSearchAddress} />

      {listings.map((listing) => (
        <ListingDetail
          key={listing.id}
          listingID={listing.id}
          address={listing.address}
          title={listing.name}
          photo={listing.photo_link}
          setChange={setChange}
          change={change}
        />
      ))}
      {listings.length === 0 &&
        <Typography variant='body2' ml={8} my={4} >
          No listings created yet
        </Typography>
      }
      
      <Divider sx={{ backgroundColor: 'grey.200' }} />
      <ListingAnalysis />
    </Box>
  );
}

export default ListingDisplay;