import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import RecommendationCard from './RecommendationCard'

import FetchHelper from '../../util/FetchHelper';

function Recommendations () {

  const [recs, setRecs] = React.useState([]);
  
  // TODO: fetch recommendations list
  React.useEffect(() => {
    // temporarily get 1 random listing
    FetchHelper('GET', '/recommendation', null, true)
      .then(data => {
        const newRecs = [];
        newRecs.push(data);
        setRecs(newRecs);
      }
    );
  }, [] );

  return (
    <>
      <Typography variant='h6' component="div" mt={3}>
        Recommendations
      </Typography>
      {/* Display multiple cards */}
      <Box>
        {recs.map((rec) =>
          <RecommendationCard 
            key={rec.id}
            id={rec.id}
            name={rec.name}
            description={rec.description}
            photo={rec.photo_link}
            address={rec.address}
            hPrice={rec.price_hourly}
            dPrice={rec.price_daily}
          />
        )}
      </Box>
    </>
  );
}

export default Recommendations;