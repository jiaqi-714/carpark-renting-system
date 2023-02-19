import React from 'react';

import { 
  GoogleMap,
  MarkerF,
  Autocomplete,
  DirectionsRenderer,
} from "@react-google-maps/api";

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';

import { convertCoords } from '../../util/helpers';

function Directions({ isLoaded, name, address, coordinates }) {
  // get listing lat, lng
  const [center] = React.useState(convertCoords(coordinates));

  const [showMarker, setShowMarker] = React.useState(true);
  const [directionsRes, setdirectionsRes] = React.useState(null);
  const [distance, setDistance] = React.useState('');
  const [length, setLength] = React.useState('');
  const [isRoute, setIsRoute] = React.useState(true);

  const startRef = React.useRef();
  const destRef = React.useRef();

  const calcRoute = () => {
    if (startRef.current.value === '' || destRef.current.value === '') {
      return;
    }
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService();
    const req = {
      origin: startRef.current.value === address ? convertCoords(coordinates) : startRef.current.value,
      destination: destRef.current.value === address ? convertCoords(coordinates) : destRef.current.value,
      travelMode: 'DRIVING'
    };
    // eslint-disable-next-line no-undef
    directionsService.route(req, function(response, status) {
      if (status === "OK") {
        setdirectionsRes(response);
        setDistance(response.routes[0].legs[0].distance.text);
        setLength(response.routes[0].legs[0].duration.text);
        setIsRoute(true);
        setShowMarker(false);
      } else {
        setIsRoute(false);
        setDistance('');
        setLength('');
      }
    });
  }

  return (
    <>
      <Box
        width="100%"
        height="500px"
        mb={2}
      >
        {isLoaded &&
          <GoogleMap
            zoom={15}
            center={center}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <MarkerF position={center} title={name} visible={showMarker} />
            {directionsRes && (
              <DirectionsRenderer directions={directionsRes} />
            )}
          </GoogleMap>
        }
      </Box>

      <Typography variant='subtitle1' component="div" fontWeight="bold">
        Directions
      </Typography>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        my={2}
      >
        {isLoaded &&
          <>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Start'
                inputRef={startRef}
                variant="outlined"
                fullWidth
              />
            </Autocomplete>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                defaultValue={address}
                inputRef={destRef}
                variant="outlined"
                fullWidth
              />
            </Autocomplete>
          </>
        }
        <Box
          display="flex"
          justifyContent="space-between"
        >
          {distance &&
            <>
              <Typography variant='body1' component="div">
                Distance: {distance}
              </Typography>
              <Typography variant='body1' component="div">
                Trip length by car: {length}
              </Typography>
            </>
          }
          {!isRoute &&
            <Typography variant='body1' component="div">
              No route could be found
            </Typography>
          }
        </Box>
        <Button variant="contained" onClick={calcRoute}>Get Route</Button>
      </Box>
    </>
  )
}

export default Directions;