import React from 'react';

import { GoogleMap, MarkerF } from "@react-google-maps/api";

const containerStyle = {
  width: '100%',
  height: '100%',
};

function ListingMap({ searchCoords }) {
  return (
    <GoogleMap
      zoom={16}
      center={searchCoords}
      mapContainerStyle={containerStyle}
      options={{
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: false,
      }}
    > 
    {-33.8688 !== searchCoords.lat && 151.2093 !== searchCoords.lng &&
      <MarkerF
        position={searchCoords}
      />
    }
    </GoogleMap>
  )
}

export default ListingMap;