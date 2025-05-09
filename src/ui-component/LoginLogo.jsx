// material-ui
import { useTheme } from "@mui/material/styles";

// project imports
import { ThemeMode } from "config";

/**
 * if you want to use image instead of <svg> uncomment following.
 */
import logoDark from "assets/images/logo-dark.svg";
import logo from "assets/images/ecb-logo.gif";

// ==============================|| LOGO SVG ||============================== //

const LoginLogo = () => {
  const theme = useTheme();

  return (
    <img
      src={theme.palette.mode === ThemeMode.DARK ? logoDark : logo}
      alt="POC"
      width= {'40%'}
      height={'40%'}
    />
  );
};

export default LoginLogo;
import React from 'react'
