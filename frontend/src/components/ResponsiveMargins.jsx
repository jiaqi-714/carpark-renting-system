import useMediaQuery from '@mui/material/useMediaQuery';

function ResponsiveMargins () {
  const desktop = useMediaQuery('(min-width:1401px)');

  const tablet = useMediaQuery('(max-width:1400px)');
  const medium = useMediaQuery('(max-width:1000px)');
  const phone = useMediaQuery('(max-width:500px)');

  const responsiveStyles = {
    mb: '5%',
    mt: 4,
    ...(tablet && {
      mx: '16%'
    }),
    ...(medium && {
      mx: '10%'
    }),
    ...(phone && {
      mx: 2
    }),
    ...(desktop && {
      mx: '24%',
      mt: 6
    }),
  };
  return (responsiveStyles);
}

export default ResponsiveMargins;
