import React from 'react';

import { GoogleMap, MarkerF } from "@react-google-maps/api";
import { useNavigate } from 'react-router-dom';

import MarkerBox from '../../marker_rectangle.png'

import formatISO9075 from 'date-fns/formatISO9075';

import { useContext, Context } from '../../context';
import FetchHelper from '../../util/FetchHelper';
import { convertCoords } from '../../util/helpers';

const containerStyle = {
  width: '100%',
  height: '100%'
};

function SearchMap({ isLoaded, searchCoords, setSearchCoords, searchFilterVals, sortVal, applyFilter }) {
  const navigate = useNavigate();
  const { getters, setters } = useContext(Context);

  const startDT = getters.startDateTime;
  const endDT = getters.endDateTime;

  const filteredListings = getters.filteredListings;
  const filteredListingSetter = setters.setFilteredListings;
  // filter within 5km
  const rangedListings = filteredListings.filter(listing => listing.distance_to_user <= 5);

  const [mapref, setMapRef] = React.useState(null);

  const handleOnLoad = map => {
    setMapRef(map);
  };

  // get maps center coords and perform a search
  const handleDrag = () => {
    // recenter 
    if (mapref) {
      const newCenter = mapref.getCenter();
      setSearchCoords({ lat: newCenter.lat(), lng: newCenter.lng() });
      // default search has no filter
      if (!applyFilter) {
        const body = {
          "latitude": newCenter.lat(),
          "longtitude": newCenter.lng(),
          "starttime": formatISO9075(startDT),
          "endtime": formatISO9075(endDT),
          "max_distance": searchFilterVals.distance,
          "sort_by": sortVal
        }
        FetchHelper('POST', '/search/all', JSON.stringify(body), true)
          .then(data => {
            filteredListingSetter(data);
          })
        return;
      }

      const body = {
        "latitude": newCenter.lat(),
        "longtitude": newCenter.lng(),
        "amenity_24_7": searchFilterVals.amenities['amenity_24_7'] ? 1 : 0,
        "amenity_sheltered": searchFilterVals.amenities['amenity_sheltered'] ? 1 : 0,
        "amenity_security_gates": searchFilterVals.amenities['amenity_security_gates'] ? 1 : 0,
        "starttime": formatISO9075(startDT),
        "endtime": formatISO9075(endDT),
        "min_daily_price": searchFilterVals.minPrice,
        "max_daily_price": searchFilterVals.maxPrice,
        "type_of_space": searchFilterVals.spaceType,
        "max_distance": searchFilterVals.distance,
        "sort_by": sortVal
      }
      // search
      FetchHelper('POST', '/search', JSON.stringify(body), true)
        .then(data => {
          filteredListingSetter(data);
        })
    }
  }

  const handleClick = (e, id) => {
    // navigate to listing
    navigate(`/bookSpace/${id}`);
  }

  return isLoaded ? (
    <GoogleMap
      zoom={14}
      center={searchCoords}
      mapContainerStyle={containerStyle}
      onLoad={handleOnLoad}
      onDragEnd={handleDrag}
      options={{
        streetViewControl: false,
      }}
    >
      {rangedListings.map((marker, key) => 
        <MarkerF
          key={key}
          title={marker.name}
          position={convertCoords(marker.coordinates)}
          icon={MarkerBox}
          label={`$${marker.price_daily}/day`}
          onClick={(e) => handleClick(e, marker.id)}
        />
      )}
    </GoogleMap>
  ) : <><div>Loading...</div></>;
}

export default SearchMap;