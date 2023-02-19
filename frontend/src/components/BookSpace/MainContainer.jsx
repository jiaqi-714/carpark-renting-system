import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Rating from '@mui/material/Rating';

import fromUnixTime from 'date-fns/fromUnixTime'

import AppBarHeight from '../../components/NavBar/AppBarHeight'
import Review from './Review'
import Directions from './Directions'

import { useContext, Context } from '../../context';
import FetchHelper from '../../util/FetchHelper';

function MainContainer ({ isLoaded }) {
  const { getters } = useContext(Context);

  const listing = getters.viewListing;

  const [rating, setRating] = React.useState(0);
  const [amenity247, setAmenity247] = React.useState(false);
  const [security, setSec] = React.useState(false);
  const [shelter, setShelter] = React.useState(false);

  const [reviews, setReviews] = React.useState([]);

  const [creationDate, setCreationDate] = React.useState(null);

  React.useEffect(() => {
    if (!listing) return;
    FetchHelper('GET', `/listings/${listing.id}`)
      .then(data => {
        setAmenity247(data['amenity_24_7'] ? true : false);
        setSec(data['amenity_security_gates'] ? true : false);
        setShelter(data['amenity_sheltered'] ? true : false);

        const dateStr = fromUnixTime(data['creation_date']);
        setCreationDate(dateStr.toDateString());
      })
    FetchHelper('GET', `/reviews/listings/${listing.id}`)
      .then(reviews => {
        setReviews(reviews);
        // calculate avg rating
        const ratings = reviews.map(x => x.rating);
        const sum = ratings.reduce((a, b) => a + b, 0);
        const avg = (sum / ratings.length) || 0;
        // 1 dp
        setRating(Math.round(avg * 10) / 10);
      })
  }, [listing]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      py={6}
      px={4}
      sx={{
        width: '55%',
        maxWidth: 800,
        minHeight: `calc(100vh - ${AppBarHeight()}px)`
      }}
      >
      {listing &&
        <>
          <Typography variant='h5' component="div" sx={{ fontWeight: "bold" }}>
            {listing.name}
          </Typography>
          <Typography variant='subtitle1' component="div" gutterBottom={true}>
            Address: {listing.address}
          </Typography>
          <Box display="flex" justifyContent="space-between" pb={1}>
            <Box display="flex" gap={1} alignItems="flex-start">
              <Typography variant='body2' component="div" color="grey.600">
                {rating}
              </Typography>
              <Rating name="read-only" value={rating} size="small" precision={0.5} readOnly />
            </Box>
            <Typography variant='body2' component="div" color="grey.700">
              Type of space: {listing.space_type}
            </Typography>
          </Box>
          {listing.photo_link && listing.photo_link !== 'mydirectory/url' &&
            <Box display="flex" maxWidth="80%" maxHeight="250px" my={2}>
              <img src={listing.photo_link} width="100%" height="100%" alt="Listing's thumbnail" />
            </Box>
          }
          <Divider sx={{ backgroundColor: 'grey.200' }} />
          
          <Typography variant='h6' component="div" mt={2} gutterBottom={true}>
            Parking Description
          </Typography>
          <Typography variant='body2' component="div" mb={2} pb={1}>
            {listing.description}
          </Typography>
          <Divider sx={{ backgroundColor: 'grey.100' }} />

          <Typography variant='h6' component="div" mt={2} gutterBottom={true}>
            Amenities
          </Typography>
          <Stack direction="row" spacing={1} mb={2}>
            {amenity247 &&
              <Chip label="24/7 Access" variant="outlined" />
            }
            {security &&
              <Chip label="Security Gates" variant="outlined" />
            }
            {shelter &&
              <Chip label="Sheltered" variant="outlined" />
            }
            {!amenity247 && !security && !shelter &&
              <div>None</div>
            }
          </Stack>
          <Divider sx={{ backgroundColor: 'grey.100' }} />

          <Typography variant='h6' component="div" mt={2} gutterBottom={true}>
            Location
          </Typography>
          <Directions
            isLoaded={isLoaded}
            name={listing.name}
            address={listing.address}
            coordinates={listing.coordinates}
          />
          <Divider sx={{ backgroundColor: 'grey.100' }} />
          
          <Typography variant='h6' component="div" mt={2}>
            Reviews
          </Typography>
          <Typography variant='caption' component="div">
            {reviews.length} reviews
          </Typography>
          <Box
            display="flex"
            flexDirection="column"
            gap={1}
            my={2}
          >
            {reviews.map((review) => (
              <Review 
                key={review.id}
                author={review.author}
                rating={review.rating}
                description={review.description}
                time={review.time}
              />
            ))}
          </Box>

          <Divider sx={{ backgroundColor: 'grey.100' }} />
          
          <Box
            display="flex"
            flexDirection="column"
            alignItems="baseline"
            mt={2}
            gap={1}
          >
            <Typography variant='subtitle1' component="div" sx={{ fontWeight: "bold" }}>
              {/* TODO: get owner'name from their id */}
              Listing created by {listing.owner}
            </Typography>
            <Typography variant='body2' component="div">
              on {creationDate}
            </Typography>
          </Box>
        </>
      }
    </Box>
  );
}

export default MainContainer;