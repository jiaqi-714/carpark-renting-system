import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import DateTimePicker from './SearchDateTimePicker'
import ListingItem from './ListingItem'
import SearchGeocode from './SearchGeocode'
import FiltersBtn from './Filters/FiltersBtn'

import { useContext, Context } from '../../context';

const whiteBg = {
  backgroundColor: 'white'
}

const customScrollbar = {
  overflow: "hidden",
  overflowY: "auto",
  // overflowY: "scroll",
  margin: 0,
  padding: 0,
  height: "100%",
  '&::-webkit-scrollbar': {
    width: '0.4em'
  },
  '&::-webkit-scrollbar-track': {
    borderRadius: '5px',
    backgroundColor: "grey.100"
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0, 0, 0, .1)',
    borderRadius: '5px'
  },
}

function SideBar ({ setSearchCoords, sortVal, handleSortChange, applyFilter, setApplyFilter, searchFilterVals, setSearchFilterVals, filterValues, changeHandler, amenityHandler, numericHandler }) {
  const { getters } = useContext(Context);

  // TODO: Pagination / load more btn
  const filteredListings = getters.filteredListings;

  const [searchErr, setSearchErr] = React.useState(false);
  
  return (
    <Box
      display="flex"
      flexGrow={1}
      flexDirection="column"
      sx={{
        borderRight: 1,
        borderColor: "grey.500",
        boxShadow: 1,
        maxWidth: 530,
        ...customScrollbar,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        bgcolor="grey.100"
        sx={{ padding: 3, borderBottom: 1, borderColor: 'grey.500' }}
      >
        <Typography variant='h6' component="div" sx={{ fontWeight: 'bold' }}>
          Parking spaces in Sydney
        </Typography>
        <Typography variant='subtitle1' component="div" sx={{ fontWeight: 'bold' }}>
          Daily booking
        </Typography>

        <SearchGeocode 
          setSearchErr={setSearchErr}
          applyFilter={applyFilter}
          searchFilterVals={searchFilterVals}
          sortBy={sortVal}
          setSearchCoords={setSearchCoords}
        />

        <Box
          display="flex"
          gap={4}
        >
          <DateTimePicker 
            name={"Start"}
          />
          <DateTimePicker 
            name={"End"}
          />
        </Box>

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="baseline"
          sx={{ mt: 3, mb: 1 }}
        >
          <FormControl sx={{ width: 190 }}>
            <InputLabel id="sort-by">Sort by</InputLabel>
            <Select
              labelId="sort-by-label"
              id="sort-by"
              value={sortVal}
              label="Sort by"
              onChange={handleSortChange}
              sx={{ ...whiteBg }}
            >
              <MenuItem value={0}>Nearest</MenuItem>
              <MenuItem value={1}>Hourly Price</MenuItem>
              <MenuItem value={2}>Daily Price</MenuItem>
              {/* <MenuItem value={'U'}>User Rating</MenuItem> */}
            </Select>
          </FormControl>

          <FiltersBtn 
            filterValues={filterValues}
            changeHandler={changeHandler}
            amenityHandler={amenityHandler}
            numericHandler={numericHandler}
            setSearchFilterVals={setSearchFilterVals}
            setApplyFilter={setApplyFilter}
          /> 
        </Box>
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        gap={3}
        sx={{ margin: 3 }}
      >
        {!searchErr && filteredListings.map(listing => 
          <ListingItem 
            key={listing.id}
            id={listing.id}
            name={listing.name}
            address={listing.address}
            price_hourly={listing.price_hourly}
            price_daily={listing.price_daily}
            distance={listing.distance_to_user}
          />
        )}
        {searchErr &&
          <p>No search results</p>
        }
      </Box>
    </Box>
  );
}

export default SideBar;