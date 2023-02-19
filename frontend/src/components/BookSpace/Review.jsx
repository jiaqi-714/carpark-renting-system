import React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Rating from '@mui/material/Rating';

function Review({ author, rating, description, time }) {
  // const convertDate = () => {
  // }

  return (
    <Box
      p={2}
      sx={{ border: 1, borderColor: 'grey.500', borderRadius: 1}}
    >
      <Typography variant='subtitle1' component="div">
        Posted by {author}
      </Typography>
      <Box display="flex" gap={1} alignItems="flex-start">
        <Rating name="read-only" value={rating} readOnly size="small" />
        <Typography variant='body2' component="div" color="grey.500">
          on {time}
        </Typography>
      </Box>

      <Typography variant='body2' component="div" mt={1}>
        {description}
      </Typography>
    </Box>
  )
}

export default Review;