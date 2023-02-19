import React from 'react';

import { useNavigate } from 'react-router-dom';

import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import ViewIcon from '@mui/icons-material/Preview';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import FetchHelper from '../../util/FetchHelper';

function ListingDetail ({ listingID, address, title, setChange, change, photo }) {
  const navigate = useNavigate();

  const [totalBookings, setTotalBookings] = React.useState(0);
  const [occupancy, setOccupancy] = React.useState(0);
  const [percentBookings, setPercentBookings] = React.useState(0);

  const navigateToEdit = () => {
    navigate('/listing/edit?id=' + listingID);
  }

  const listingView = () => {
    navigate('/listing/view/' + listingID);
  }

  const deleteListing = () => {
    FetchHelper('DELETE', '/listings/' + listingID, null, true)
    .then(() => {
      alert('delete success');
      setChange(change + 1);
    })
    .catch((err) => {alert(err)})
  }

  const actions = [
      { icon: <DeleteIcon />, name: 'delete', onClick: deleteListing },
      { icon: <EditIcon />, name: 'edit', onClick: navigateToEdit },
      { icon: <ViewIcon />, name: 'view', onClick: listingView },
  ];

  React.useEffect(() => {
    FetchHelper('GET', `/listings/${listingID}`)
    .then(data => {
      setTotalBookings(data.total_bookings);
      setPercentBookings(data.percentage_bookings);
    })
    FetchHelper('GET', `/analysis/id/userate/${listingID}`)
    .then(data => {
      setOccupancy(data);
    })
  }, [listingID]);


  return (
    <Box
      display="flex"
      flexDirection="column"
      border="solid"
      margin="30px"
    >
      <Box
        display="flex"
        alignItems='center'
        justifyContent='center'
      >
        <Typography margin='auto'>Listing ID: {listingID}</Typography>
        <Typography margin='auto'>{title}</Typography>
      </Box>
      <Divider sx={{ backgroundColor: 'grey.400' }} />
      <Box
        display="flex"
      >
        {photo && photo !== 'mydirectory/url' &&
          <img src={photo} width="300px" height="300px" alt="Listing's thumbnail" />
        }
        <Box display="flex" justifyContent="space-between" flex="10">
          <Box display="flex" flexDirection="column">
            <Box display="flex" justifyContent="space-between" m={5}>
              <Typography>{address}</Typography>
            </Box>
            <Box display="flex" flexDirection="column" flex="3" mx={5} justifyContent="center" >
              <Typography>Total number of times rented: {totalBookings}</Typography>
              <Typography>Occupancy percentage since listing creation: {occupancy}%</Typography>
              <Typography>Percentage of fulfilled bookings: {percentBookings}%</Typography>
            </Box>
          </Box>
        </Box>
        <SpeedDial
            ariaLabel="SpeedDial basic example"
            icon={<SpeedDialIcon />}
            direction="down"
            sx={{ p: 2}}
            >
            {actions.map((action) => (
              <SpeedDialAction
                key={action.name}
                icon={action.icon}
                tooltipTitle={action.name}
                onClick={action.onClick}
              />
            ))}
          </SpeedDial>
      </Box>
    </Box>
    );
}

export default ListingDetail;