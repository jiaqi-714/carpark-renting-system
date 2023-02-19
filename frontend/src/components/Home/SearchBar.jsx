import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';

import { useNavigate } from 'react-router-dom';

function SearchBar () {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchKeyDown = (event) => {
    if (event.keyCode === 13) {
      event.target.blur();
      handleSearch();
    }
  }

  const handleSearch = () => {
    if (searchQuery === '') {
      navigate('/search');
    } else {
      const params = new URLSearchParams({
        q: searchQuery
      });

      navigate(`/search?${params}`);
    }
  }

  return (
    <>
      <Typography variant='h5' component="div"  mb={2}>
        Find a car space
      </Typography>

      <Typography variant='subtitle1' component="div" sx={{ fontWeight: 'bold' }}>
        Daily booking
      </Typography>
      <FormControl sx={{ backgroundColor: 'white', mt: 1, mb: 2 }} variant="outlined">
        <TextField
          id="home-search-input"
          type="text"
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  aria-label="search icon"
                  onClick={handleSearch}
                  edge="end"
                  cursor="pointer"
                />
              </InputAdornment>
            ),
          }}
        />
      </FormControl>
      <Box
        display="flex"
        justifyContent="flex-end"
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleSearch}
        >
          Search
        </Button>
      </Box>
    </>
  );
}

export default SearchBar;