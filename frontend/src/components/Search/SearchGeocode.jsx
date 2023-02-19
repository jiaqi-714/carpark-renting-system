import React from 'react';

import Geocode from "react-geocode";
import { useSearchParams } from 'react-router-dom'

import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';

import formatISO9075 from 'date-fns/formatISO9075';

import { useContext, Context } from '../../context';
import FetchHelper from '../../util/FetchHelper';
import googleApiKey from '../../util/googleApiKey';

Geocode.setApiKey(googleApiKey);
// Geocode.enableDebug();

function SearchGeocode ({ setSearchErr, applyFilter, searchFilterVals, sortBy, setSearchCoords }) {
  const { getters, setters } = useContext(Context);
  
  const startDT = getters.startDateTime;
  const endDT = getters.endDateTime;

  const filteredListingSetter = setters.setFilteredListings;

  const [searchParams] = useSearchParams();

  const [searchVal, setSearchVal] = React.useState('');
  
  const handleSearchChange = (event) => {
    setSearchVal(event.target.value);
  };
  
  const handleSearchKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.target.blur();
      handleClickSearch();
    }
  }

  const handleClickSearch = () => {
    Geocode.fromAddress(searchVal).then(
      (response) => {
        setSearchErr(false);
        const { lat, lng } = response.results[0].geometry.location;
        // Set map search area to coords
        setSearchCoords(response.results[0].geometry.location);

        // default search without filters applied
        if (!applyFilter) {
          const body = {
            "latitude": lat,
            "longtitude": lng,
            "starttime": formatISO9075(startDT),
            "endtime": formatISO9075(endDT),
            "max_distance": searchFilterVals.distance,
            "sort_by": sortBy
          }
          FetchHelper('POST', '/search/all', JSON.stringify(body), true)
            .then(data => {
              filteredListingSetter(data);
              if (data.length === 0) {
                setSearchErr(true);
              }
            })
            .catch(err => {
              setSearchErr(true);
            });
          return;
        }

        const body = {
          "latitude": lat,
          "longtitude": lng,
          "amenity_24_7": searchFilterVals.amenities['amenity_24_7'] ? 1 : 0,
          "amenity_sheltered": searchFilterVals.amenities['amenity_sheltered'] ? 1 : 0,
          "amenity_security_gates": searchFilterVals.amenities['amenity_security_gates'] ? 1 : 0,
          "starttime": formatISO9075(startDT),
          "endtime": formatISO9075(endDT),
          "min_daily_price": searchFilterVals.minPrice,
          "max_daily_price": searchFilterVals.maxPrice,
          "type_of_space": searchFilterVals.spaceType,
          "max_distance": searchFilterVals.distance,
          "sort_by": sortBy
        }
        FetchHelper('POST', '/search', JSON.stringify(body), true)
          .then(data => {
            filteredListingSetter(data);
            if (data.length === 0) {
              setSearchErr(true);
            }
          })
          .catch(err => {
            setSearchErr(true);
          });
      },
      (error) => {
        setSearchErr(true);
      }
    );
  };

  React.useEffect(() => {
    const query = searchParams.get('q');
    if (query) {
      setSearchVal(query);
    } 
  }, [searchParams]);

  return (
    <>
      <FormControl sx={{ backgroundColor: 'white', mt: 1, mb: 2 }} variant="outlined">
        <TextField
          id="main-search-input-geocode"
          type="text"
          onChange={handleSearchChange}
          value={searchVal}
          onKeyDown={handleSearchKeyDown}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SearchIcon
                  aria-label="search icon"
                  onClick={handleClickSearch}
                  edge="end"
                  cursor="pointer"
                />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
    </>
  );
}

export default SearchGeocode;