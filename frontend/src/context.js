import React, { createContext } from 'react';

export const initialValue = {
  isAdmin: false,
  startDateTime: null,
  endDateTime: null,
  bookedStart: null,
  bookedEnd: null,
  bookingCost: 0,
  totalHrs: 0,
  allListings: [],
  filteredListings: [],
  filteredListingsCopy: [],
  viewListing: null,
};

export const Context = createContext(initialValue);
export const useContext = React.useContext;