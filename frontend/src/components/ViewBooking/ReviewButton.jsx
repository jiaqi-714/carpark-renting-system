import React from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';

import FetchHelper from '../../util/FetchHelper';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function ReviewButton ({ listingID }) {
  const [star, setStar] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [description, setDescription] = React.useState('')
  const [reviewID, setReviewID] = React.useState(0);
  const [ch, setch] = React.useState(0);

  React.useEffect(() => {
    FetchHelper('GET', '/user/selfID', null, true)
    .then((data) => {
      FetchHelper('GET', '/reviews/users/' + data.user_id, null, true)
      .then((data2) => {
        for (let review of data2) {
          if (review.car_space === listingID) {
            setReviewID(review.id);
            setStar(review.rating);
            setDescription(review.description);
            break;
          }
        }
      })
    })
    .catch((err) => {console.log(err)}) 
  }, [listingID, ch])

  const handleClose2 = () => setOpen2(false);

  const handleOpen = () => {
    if (reviewID !== 0) {
      setOpen2(true);
      return;
    }

    setOpen(true);
  }

  const handleClose = () => setOpen(false);

  const deleteReview = () => {
    FetchHelper('DELETE', '/reviews/' + reviewID , null, true)
    .catch((err) => console.log(err));

    alert('delete success')
    setOpen2(false);
  }

  const submitReview = () => {
    if (description === '') {
      alert('You must leave a description');
      return;
    }

    if (star === 0) {
      alert('You must give a rating')
      return;
    }

    const body = JSON.stringify({
      rating: star,
      description
    })

    if (reviewID !== 0) {
      FetchHelper('PUT', '/reviews/' + reviewID, body, true)
      .then(() => {
        alert('edit success!')
      })
      .catch((err) => alert(err))
    } else {
      FetchHelper('POST', `/reviews/listings/${listingID}`, body, true)
      .then(() => {
        alert('review success!')
      })
      .catch((err) => alert(err))
    }

    setch(ch + 1);
    setOpen(false);
    setOpen2(false);
  }

  return (
    <Box>
      <Button variant="contained" onClick={handleOpen}>
        Review
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography id="modal-modal-title" variant="h5" component="h2" mb={2}>
            Overall rating
            </Typography>
            <Typography component="legend">Rate your overall experience</Typography>
            <Rating
                name="simple-controlled"
                value={star}
                onChange={(_, newValue) => {setStar(newValue);}}
                size='large'
            />
            <Typography component="legend" mt={2}>Add a written review</Typography>
            <TextField id="outlined-basic" label="review" variant="outlined" fullWidth multiline rows={4} value={description} onChange={(e) => setDescription(e.target.value)}/>
            <Typography mt={2}></Typography>
            <Button variant="contained" onClick={submitReview} fullWidth>Submit</Button>
        </Box>
      </Modal>

      <Modal
        open={open2}
        onClose={handleClose2}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        >
        <Box sx={style}>
            <Typography component="legend" variant='h6' mt={2}>You have already reviewed. What do you want to do next?</Typography>
            <Button variant="contained" onClick={() => {setOpen(true)}} sx={{marginRight: '50px'}}>Edit review</Button>
            <Button variant="contained" onClick={deleteReview} sx={{marginRight: '50px'}}>Delete review</Button>
            <Button variant="contained" onClick={handleClose2}>Back to the last page</Button>
        </Box>
      </Modal>
    </Box>
  )
}

export default ReviewButton;
