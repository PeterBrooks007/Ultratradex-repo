import { Box, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
import { use } from "react";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import { useLocation } from "react-router-dom";

const HomeFooter = () => {
const theme = useTheme(); 
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

     const location = useLocation();
      const path = location.pathname

  return (
    <>
    {/* <Box position={"absolute"}
      bottom={50}
      right={0}
      left={0}
      display={isMobile ? "none" : "flex"}
      justifyContent={"center"}
      // sx={{ borderTop: "0.5px solid darkgrey", padding: "0px" }}
      // sx={{backgroundColor: "green"}}
      >
      <TickerTapeWidget />
    </Box> */}
    
    <Box
      position={"absolute"}
      bottom={0}
      right={0}
      left={0}
      display={isMobile ? "none" : path !== "/" ? "none" : "flex"}
      justifyContent={"center"}
      sx={{ borderTop: "0.5px solid darkgrey", padding: "10px" }}
    >
        (c) Copyright © {new Date().getFullYear()} ultratradex, Inc.       

    </Box>
    </>
  );
};

export default HomeFooter;
