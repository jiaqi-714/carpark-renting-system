import React from 'react';

import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import { CardActionArea } from '@mui/material';

function RecommendationCard ({ id, name, description, photo, address, hPrice, dPrice }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/bookSpace/${id}`);
  }

  return (
    <>
      <Card sx={{ maxWidth: 345 }}>
        <CardActionArea
          onClick={handleClick}
        >
          {photo !== "mydirectory/url" &&
            <CardMedia
              component="img"
              height="140"
              image={photo}
              alt="parking-space-thumbnail"
            />
          }
          <CardContent>
            <Typography variant="h6" component="div">
              {name}
            </Typography>
            <Typography gutterBottom variant="subtitle1" component="div">
              {address}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              {description}
            </Typography>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" color="grey.700">
                ${hPrice}/hr
              </Typography>
              <Typography variant="body2" color="grey.700">
                ${dPrice}/day
              </Typography>
            </Box>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default RecommendationCard;