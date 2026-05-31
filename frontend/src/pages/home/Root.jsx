import React from "react";
import HomeHeader from "./HomeHeader";
import { Outlet, useLocation } from "react-router-dom";
import HomeFooter from "./HomeFooter";
import { Box } from "@mui/material";
import HeroBackgroundImage from "../../assets/herobackgroundImage.webp";
import UseWindowSize from "../../hooks/UseWindowSize";
import MatrixPopup from "./MatrixPopup";

const Root = () => {
  const size = UseWindowSize();

  // const location = useLocation();
  //     const path = location.pathname

  return (
    <>
      <Box
        // display={"flex"}
        // flexDirection={"column"}
        height={"auto"}
        // height={{ xs: `${size.height}px`, md: `${size.height}px` }}
        overflow={"hidden"}
        // sx={{
        //   backgroundImage: path === "/" ? `url(${HeroBackgroundImage})` : "",
        //   backgroundSize: "cover", // Ensures the image covers the entire Box
        //   backgroundPosition: {
        //     xs: "75% ", // 100px from the left and vertically centered on small screens
        //     md: "center",       // Fully centered for medium screens and larger
        //   },
        //    backgroundRepeat: "no-repeat", // Prevents the image from repeating
        // }}
      >
        <MatrixPopup />

        <HomeHeader />
        <Outlet />
        {/* <HomeFooter /> */}
      </Box>
    </>
  );
};

export default Root;
