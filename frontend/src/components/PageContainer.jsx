import React from 'react';

import Box from '@mui/material/Box';

import ResponsiveMargins from './ResponsiveMargins';

import PropTypes from 'prop-types';

function PageContainer (props) {
  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      sx={ResponsiveMargins()}
    >
      {props.items}
    </Box>
  )
}

PageContainer.propTypes = {
  items: PropTypes.object,
};

export default PageContainer;
