import React from 'react';

import PropTypes from 'prop-types';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import differenceInHours from 'date-fns/differenceInHours'

import { useContext, Context } from '../../context';

function ListingItem ({ id, name, address, price_hourly, price_daily, distance }) {
  const navigate = useNavigate();
  const { getters } = useContext(Context);

  const startTime = getters.startDateTime;
  const endTime = getters.endDateTime;

  const [total, setTotal] = React.useState(0);
  
  const handleItemClick = (event) => {
    navigate(`/bookSpace/${id}`);
  };

  React.useEffect(() => {
    // calculate total cost just by the hour (no minutes)
    const totalHrs = differenceInHours(endTime, startTime);
    let cost = totalHrs * price_hourly
    if (totalHrs >= 24) {
      const days = Math.floor(totalHrs / 24)
      const leftoverHrs = totalHrs % 24
      cost = leftoverHrs * price_hourly + days * price_daily
    } else if (totalHrs < 0) {
      cost = ' - ';
    }
    setTotal(cost);
  }, [startTime, endTime, price_hourly, price_daily])

  const roundDp = (x) => {
    return Number.parseFloat(x).toFixed(2);
  }

  return (
    <Box
      sx={{
        // borderBottom: 1,
        border: 1,
        borderRadius: 2,
        backgroundColor: 'white',
        borderColor: 'grey.400',
        boxShadow: 1,
        cursor: "pointer",
        padding: 3
      }}
      onClick={handleItemClick}
    >
      <Typography variant='h6' component="div">
        {name}
      </Typography>
      <Typography variant='subtitle1' component="div">
        {address}
      </Typography>
      <Typography variant='caption' component="div">
        ${price_hourly}/hr, ${price_daily}/day
      </Typography>
      
      <Box
        display={"flex"}
        alignItems={"baseline"}
        justifyContent={"space-between"}
        sx={{
          marginTop: 3
        }}
      >
        <Typography variant='subtitle1' component="div">
          {roundDp(distance)} km away
        </Typography>
        <Box
          display={"flex"}
          alignItems={"baseline"}
          gap={0.6}
        >
          <Typography variant='h6' component="div">
            ${total}
          </Typography>
          <Typography variant='caption' component="div">
            total
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

ListingItem.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  address: PropTypes.string,
  price_hourly: PropTypes.number,
  price_daily: PropTypes.number,
};

export default ListingItem;