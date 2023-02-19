import React from 'react';

import Box from '@mui/material/Box';

import AppBarHeight from '../components/NavBar/AppBarHeight';
import SideBar from '../components/Search/SideBar';
import SearchMap from '../components/Search/SearchMap';
import Recommendation from '../components/Search/Recommendation';

let updateTimeout = null;

function SearchScreen ({ isLoaded }) {
  // For recommendation, get last searchVal coords from here -> sidebar -> searchgeocode
  const [searchCoords, setSearchCoords] = React.useState({ lat: -33.8688, lng: 151.2093 });

  // Filter values

  // 0 -"nearest", 1 - "hourly price", 2 - "daily price"
  const [sortVal, setSortVal] = React.useState(0);

  const [applyFilter, setApplyFilter] = React.useState(false);

  // Filter options
  const filterObj = {
    distance: 10,
    minPrice: 0,
    maxPrice: 100,
    spaceType: 'Driveway',
    amenities: {
      amenity_24_7: false,
      amenity_sheltered: false,
      amenity_security_gates: false,
    }
  };
  const [searchFilterVals, setSearchFilterVals] = React.useState(filterObj);
  const [filterValues, setFilterValues] = React.useState(filterObj);

  // setter for spacetype
  const changeHandler = e => {
    setFilterValues( prevValues => {
      return { ...prevValues, [e.target.name]: e.target.value}
    });
  }

  // setter for amenities
  const amenityHandler = e => {
    setFilterValues( prevValues => {
      return { ...prevValues, 
        "amenities": {
          ...filterValues.amenities,
          [e.target.name]: e.target.checked
        }
      }
    });
  }

  const isPosInt = (n) => {
    return n >>> 0 === parseFloat(n);
  }

  const numericHandler = (e, changeType, newVal) => {
    if (changeType === 'number') {
      setFilterValues( prevValues => {
        return { ...prevValues, [e.target.name]: isPosInt(newVal) ? Number(newVal) : ''}
      });
    } else {
      setFilterValues( prevValues => {
        return { ...prevValues, [e.target.name]: newVal}
      });
    }
  }

  const handleSortChange = (event) => {
    setSortVal(event.target.value);
  };

  const [isOpen, setIsOpen] = React.useState(false);

  const resetTimer = () => {
    updateTimeout = setTimeout(() => {
      setIsOpen(true);
    // Every 1 min, show a recommendation for testing purposes
    }, 1 * 60 * 1000)
  };

  React.useEffect(() => {
    resetTimer();
    return () => clearTimeout(updateTimeout);
  }, []);

  return (
    <Box 
      display="flex"
      alignItems='stretch'
      sx={{
        height: `calc(100vh - ${AppBarHeight()}px)`
      }}
    >
      <SideBar 
        setSearchCoords={setSearchCoords}
        sortVal={sortVal}
        handleSortChange={handleSortChange}
        applyFilter={applyFilter}
        setApplyFilter={setApplyFilter}
        searchFilterVals={searchFilterVals}
        setSearchFilterVals={setSearchFilterVals}
        filterValues={filterValues}
        changeHandler={changeHandler}
        amenityHandler={amenityHandler}
        numericHandler={numericHandler}
      />
      <Box 
        display="flex"
        flexDirection="column"
        width={'100%'}
      >
        {isOpen &&
          <Recommendation
            coords={searchCoords}
            setIsOpen={setIsOpen}
            resetTimer={resetTimer}
          />
        }
        <SearchMap 
          searchCoords={searchCoords}
          setSearchCoords={setSearchCoords}
          searchFilterVals={searchFilterVals}
          sortVal={sortVal}
          applyFilter={applyFilter}
          isLoaded={isLoaded}
        />
      </Box>
    </Box>
  )
}

export default SearchScreen;
