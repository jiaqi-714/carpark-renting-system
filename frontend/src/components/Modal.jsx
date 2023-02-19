import useMediaQuery from '@mui/material/useMediaQuery';

const ButtonsContainer = {
  display: 'flex',
  justifyContent: 'flex-end'
};

export function ButtonBox () {
  return (ButtonsContainer);
}

export function ModalStyle (width, maxHeight) {
  const phone = useMediaQuery('(max-width:600px)');

  const modalStyle = {
    position: 'absolute',
    top: '40%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '1px solid DarkGrey',
    borderRadius: '5px',
    boxShadow: 10,
    p: 4,
    width: width,
    maxHeight: maxHeight,
    ...(phone && {
      width: '70%'
    }),
  };

  return (modalStyle);
}