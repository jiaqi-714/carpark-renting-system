import { useMediaQuery, useTheme } from '@mui/material';

export default function AppBarHeight() {
  const {
    mixins: { toolbar },
    breakpoints,
  } = useTheme();
  const toolbarDesktopQuery = breakpoints.up('sm');
  const isDesktop = useMediaQuery(toolbarDesktopQuery);
  let currentToolbarMinHeight;
  if (isDesktop) {
    currentToolbarMinHeight = toolbar[toolbarDesktopQuery];
  } else {
    currentToolbarMinHeight = toolbar;
  }

  return currentToolbarMinHeight.minHeight;
}