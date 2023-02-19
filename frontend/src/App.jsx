import React from 'react';

import {
  Routes,
  Route,
  BrowserRouter,
} from 'react-router-dom'

import { 
  useJsApiLoader,
} from "@react-google-maps/api";

import googleApiKey from './util/googleApiKey';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { Context, initialValue } from './context';

import NavBar from './components/NavBar/NavBar'
import HomeScreen from './pages/HomeScreen'
import SearchScreen from './pages/SearchScreen'
import BookingsScreen from './pages/BookingsScreen'
import BookSpaceScreen from './pages/BookSpaceScreen'
import BookFormScreen from './pages/BookingFormScreen'
import AddNewListing from './pages/AddNewListing'
import AllListing from './pages/AllListing'
import LoginScreen from './pages/LoginScreen'
import SignupScreen from './pages/SignupScreen'
import ResetPasswordScreen from './pages/ResetPasswordScreen'
import ChangePasswordScreen from './pages/ChangePasswordScreen';
import ProfileScreen from './pages/ProfileScreen';
import AdminScreen from './pages/AdminScreen';
import ViewBookingScreen from './pages/ViewBookingScreen';
import ViewListingScreen from './pages/ViewListingScreen';

function App() {
  const [isAdmin, setIsAdmin] = React.useState(initialValue.isAdmin);
  const [startDateTime, setStartDateTime] = React.useState(initialValue.startDateTime);
  const [endDateTime, setEndDateTime] = React.useState(initialValue.endDateTime);
  const [bookedStart, setBookedStart] = React.useState(initialValue.bookedStart);
  const [bookedEnd, setBookedEnd] = React.useState(initialValue.bookedEnd);
  const [bookingCost, setBookingCost] = React.useState(initialValue.bookingCost);
  const [totalHrs, setTotalHrs] = React.useState(initialValue.totalHrs);

  const [allListings, setAllListings] = React.useState(initialValue.allListings);
  const [filteredListings, setFilteredListings] = React.useState(initialValue.filteredListings);
  const [filteredListingsCopy, setFilteredListingsCopy] = React.useState(initialValue.filteredListingsCopy);
  
  const [viewListing, setViewListing] = React.useState(initialValue.viewListing);

  const getters = {
    isAdmin,
    startDateTime,
    endDateTime,
    bookedStart,
    bookedEnd,
    bookingCost,
    totalHrs,
    allListings,
    filteredListings,
    filteredListingsCopy,
    viewListing,
  };

  const setters = {
    setIsAdmin,
    setStartDateTime,
    setEndDateTime,
    setBookedStart,
    setBookedEnd,
    setBookingCost,
    setTotalHrs,
    setAllListings,
    setFilteredListings,
    setFilteredListingsCopy,
    setViewListing,
  };

  const [libraries] = React.useState(['places']);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: googleApiKey,
    libraries,
  })

  const theme = createTheme({
    palette: {
      // override default theme settings
      mode: "light",
      primary: {
        main: "#4caf50",
        contrastText: 'rgba(255,255,255, 1)',
      },
      secondary: {
        main: "#ef6c00"
      },
      black: {
        main: "#212121"
      }
    },
    typography: {
      button: {
        textTransform: "none"
      }
    }
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Context.Provider value={{ getters, setters }}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <BrowserRouter>
            <NavBar />
            <Routes>
              <Route path='' element={<LoginScreen />} />
              <Route path='/login' element={<LoginScreen />} />
              <Route path='/register' element={<SignupScreen />} />
              <Route path='/resetPassword/send' element={<ResetPasswordScreen />} />
              <Route path='/resetPassword/valid' element={<ChangePasswordScreen />} />
              <Route path='/home' element={<HomeScreen />} />
              <Route path='/search' element={<SearchScreen isLoaded={isLoaded} />} />
              <Route path='/bookings' element={<BookingsScreen />} />
              <Route path='/bookings/view/:bookingId' element={<ViewBookingScreen />} />
              <Route path='/booking/:bookingId' element={<BookingsScreen />} />
              <Route path='/bookSpace/:listingId' element={<BookSpaceScreen isLoaded={isLoaded} />} />
              <Route path='/bookingForm/:listingId' element={<BookFormScreen /> } />
              <Route path='/listing/new' element={<AddNewListing isLoaded={isLoaded} />} />
              <Route path='/listing/edit' element={<AddNewListing />} />
              <Route path='/listing' element={<AllListing />} />
              <Route path='/listing/view/:listingId' element={<ViewListingScreen />} />
              <Route path='/profile' element={<ProfileScreen />} />
              <Route path='/manage' element={<AdminScreen />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      </Context.Provider>
    </LocalizationProvider>
  );
}

export default App;
