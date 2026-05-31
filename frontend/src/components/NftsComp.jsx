import React, { useContext, useState } from "react";
import MyNfts from "../pages/walletDashboard/walletComponents/MyNfts";
import { Box, Stack, Tab, Tabs, Typography, useTheme } from "@mui/material";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import { ColorModeContext, tokens } from "../theme";
import UseWindowSize from "../hooks/UseWindowSize";
import AllNfts from "../pages/walletDashboard/walletComponents/AllNfts";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: "24px 0 0 0" }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const NftsComp = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { user } = useSelector((state) => state.auth);


  return (
    <>
      <Box sx={{ width: "100%" }} mt={{ xs: 3.5, md: 0 }}>
        <Box
          backgroundColor={
            theme.palette.mode === "light"
              ? "#f2f2f2"
              : colors.dashboardbackground[100]
          }
          height={"38px"}
          borderRadius={"20px"}
          p={"3px"}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs "
            variant="fullWidth"
            centered
            sx={{
              "& .MuiTabs-indicator": {
                backgroundColor: "transparent",
              },
              "& .MuiTab-root": {
                textTransform: "none",
                minHeight: "32px",
                padding: "4px 12px",
                minWidth: "auto",
                borderRadius: "20px",
                border: "none",
                borderBottom: "2px solid transparent",
                "&:hover": {
                  //   border: "2px solid #ccc",
                },
                "&.Mui-selected": {
                  // border: "2px solid #007bff",
                  backgroundColor: "white",
                  // boxShadow: `${theme.shadows[2]}`,
                  color: "black",
                },
              },
            }}
          >
            <Tab label="All NFTs" {...a11yProps(0)} />
            <Tab label={user?.role === "admin" ? "User Nfts" : "My Nfts"} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Stack>
            {/* <Typography
              variant={size.width < 600 ? "h5" : "h4"}
              fontWeight={800}
            >
              Tops NFTs
            </Typography>
            <Typography variant="subtitle1">
              These are our top NFTs. select to buy
            </Typography> */}

            <AllNfts />
          </Stack>
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Stack>
            {/* <Typography
              variant={size.width < 600 ? "h5" : "h4"}
              fontWeight={800}
            >
              My NFTs
            </Typography>
            <Typography variant="subtitle1">See all Nft You own</Typography> */}

            <MyNfts />
          </Stack>
        </CustomTabPanel>
      </Box>
    </>
  );
};

export default NftsComp;
