import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

import { ButtonBox, ModalStyle } from '../Modal';

function PaymentFail () {
  let { listingId } = useParams();
  const navigate = useNavigate();

  // Modal settings
  const [open, setOpen] = React.useState(true);
  // const handleOpen = () => setOpen(true);

  const handleClose = () => {
    setOpen(false);
    navigate(`/bookSpace/${listingId}`);
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={ModalStyle(400, 500)}>
          <Box mb={2} sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="h6" component="h6">
              Reservation cancelled
            </Typography>
            <CloseIcon color="action" onClick={handleClose} cursor={"pointer"} />
          </Box>
          <Typography variant="body1" component="div" gutterBottom={true}>
            The payment window has expired. 
          </Typography>
          <Typography variant="body1" component="div" gutterBottom={true}>
            Please start your booking again.
          </Typography>
          <Box sx={ButtonBox}>
            <Button sx={{ mt: 2 }} variant="contained" color='success'
              onClick={handleClose}
            >
              OK
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default PaymentFail;