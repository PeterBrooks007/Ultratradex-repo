import {
  AppBar,
  Box,
  Button,
  CircularProgress,
  Drawer,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import {
  ArrowLeft,
  Cardholder,
  CheckFat,
  CurrencyCircleDollar,
  Globe,
  HandCoins,
  Lightning,
  Lock,
  ShieldCheck,
  ShoppingCart,
} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import PropTypes from "prop-types";
import { useState } from "react";
import CardComponent from "../cardComponent/CardComponent";
import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import { requestCard } from "../../redux/features/auth/authSlice";

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
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
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

const CardDrawer = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();
  const dispatch = useDispatch()

  const [value, setValue] = useState(0);
  const [openSide, setOpenSide] = useState(true);

  // console.log(value)

  const { isSemiLoading, user } = useSelector((state) => state.auth);


  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


   const requestCardNow = async () => {
      
      const userData = {
        firstname: user?.firstname,
        lastname: user?.lastname,
        email: user?.email,
        phone: user?.phone,
        country: user?.address?.country,
        cardType: value === 0 ? "Virtual Card" : "Physical Card",
       
      };
  
      // console.log(userData)
  
      await dispatch(requestCard(userData));
      // await setIsEditing(false);
     
    };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          width: { xs: "100%", md: "auto" },
        },
      }}
    >
      <Box
        backgroundColor={colors.dashboardforeground[100]}
        width={"100%"}
        height={"100%"}
        overflow={"auto"}
        position={"relative"}
      >
        <AppBar
          position="sticky"
          sx={{
            backgroundColor: `${
              theme.palette.mode === "light"
                ? "lightgrey"
                : colors.dashboardbackground[100]
            }`,
            top: 0,
            height: "56px",
          }}
          color="grey"
        >
          <Toolbar variant="dense" sx={{ minHeight: "56px" }}>
            <IconButton
              edge="start"
              aria-label="menu"
              sx={{ mr: 2, backgroundColor: "grey" }}
              onClick={handleClose}
              size="small"
            >
              <ArrowLeft color="white" size={26} />
            </IconButton>
            <Typography variant="body1" color="inherit" component="div">
              Card Application
            </Typography>
          </Toolbar>
        </AppBar>

        <Stack
          position={"absolute"}
          width={"100%"}
          sx={{
            opacity: !openSide ? 1 : 0,
            visibility: !openSide ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
          }}
        >
          <Stack
            spacing={2}
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            p={2}
            mt={2}
            mx={2}
            borderRadius={"10px"}
          >
            <Typography variant="h6" fontWeight={600}>
              Personal Information
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>First Name</Typography>
              <Typography >{user?.firstname} </Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Last Name</Typography>
              <Typography>{user?.lastname}</Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Email</Typography>
              <Typography >{user?.email}</Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>phone</Typography>
              <Typography >{user?.phone}</Typography>
            </Stack>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Country</Typography>
              <Typography >{user?.address?.country}</Typography>
            </Stack>
          </Stack>

          <Stack
            spacing={2}
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            p={2}
            mt={2}
            mx={2}
            borderRadius={"10px"}
          >
            <Typography variant="h6" fontWeight={600}>
              Account Details{" "}
            </Typography>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Wallet Balance</Typography>
              <CheckFat weight="fill" color="#009a4c" size={24} />
            </Stack>
          </Stack>
          <Stack
            spacing={2}
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            p={2}
            mt={2}
            mx={2}
            borderRadius={"10px"}
          >
            <Typography variant="h6" fontWeight={600}>
              {" "}
              Transaction Limit{" "}
            </Typography>
            <Box
              backgroundColor="#009a4c"
              color={"white"}
              p={"4px 10px"}
              borderRadius={"10px"}
            >
              You can customise the limit after card has been issued
            </Box>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography>Daily Limit</Typography>
              <Typography>NO LIMIT</Typography>
            </Stack>
          </Stack>

          <Stack direction={"row"} mt={3} spacing={2} mb={2} mx={2}>
            <Button
              variant="outlined"
              size="large"
              fullWidth
              onClick={() => setOpenSide(true)}
            >
              Cancel
            </Button>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ backgroundColor: "#009a4c", color: "white" }}
              onClick={requestCardNow}
              disabled={isSemiLoading}
            >
              {
                isSemiLoading ? <CircularProgress size={18} /> : "Send Request"
              }
              
            </Button>
          </Stack>
        </Stack>

        <Box
          mt={2}
          sx={{
            width: "100%",
            opacity: openSide ? 1 : 0,
            visibility: openSide ? "visible" : "hidden",
            transition: "opacity 0.3s ease, visibility 0.3s ease",
          }}
        >
          <Box
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            height={"38px"}
          borderRadius={"20px"}
          p={"3px"}
          mt={2}
          mx={2}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              centered
              variant="fullWidth"
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
              <Tab label="Virtual Card" {...a11yProps(0)} />
              <Tab label="Physical Card" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <Stack
              alignItems={"center"}
              height={size.height - 150}
              overflow={"auto"}
            >
              <Stack
                width={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CardComponent card={"Virtual Card"} color={"#03552c"} />
              </Stack>

              <Stack mt={2} spacing={3} p={2} mx={2}>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <Lightning size={38} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Instant Access
                    </Typography>
                    <Typography variant="body2">
                      Apply and activate
                      <span style={{ color: "#009a4c", fontWeight: 600 }}>
                        Instantly
                      </span>
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <HandCoins size={38} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Safety
                    </Typography>
                    <Typography variant="body2">
                      No Physical handling, No risk of loss
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <ShoppingCart size={40} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Online Merchant
                    </Typography>
                    <Typography variant="body2">
                      Accepted by 240,000+ online merchants worldwide{" "}
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <Lock size={40} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Security
                    </Typography>
                    <Typography variant="body2">
                      World Bank Licensed.
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: "#009a4c", color: "white" }}
                  onClick={() => setOpenSide(false)}
                >
                  Apply Now
                </Button>
              </Stack>
            </Stack>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={1}>
            <Stack
              alignItems={"center"}
              height={size.height - 150}
              overflow={"auto"}
            >
              <Stack
                width={"100%"}
                justifyContent={"center"}
                alignItems={"center"}
              >
                <CardComponent
                  card={"Physical Card"}
                  color={"rgb(24, 24, 24)"}
                />
              </Stack>

              <Stack mt={2} spacing={3} p={2} mx={2}>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <Cardholder size={38} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Free Application and Usage
                    </Typography>
                    <Typography variant="body2">
                      <span style={{ color: "#009a4c", fontWeight: 600 }}>
                        Free
                      </span>{" "}
                      application,{" "}
                      <span style={{ color: "#009a4c", fontWeight: 600 }}>
                        Zero
                      </span>{" "}
                      cost for ATM withdrawal and maintenance
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <HandCoins size={38} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Get 10% off Daily
                    </Typography>
                    <Typography variant="body2">
                      Enjoy{" "}
                      <span style={{ color: "#009a4c", fontWeight: 600 }}>
                        Exciting Discounts
                      </span>{" "}
                      with your ultratradex card
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <CurrencyCircleDollar
                    size={40}
                    color="#009a4c"
                    weight="fill"
                  />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Earn
                    </Typography>
                    <Typography variant="body2">
                      Flexible Spending with 15% annual interest
                    </Typography>
                  </Stack>
                </Stack>
                <Stack direction={"row"} spacing={3} alignItems={"center"}>
                  <ShieldCheck size={40} color="#009a4c" weight="fill" />
                  <Stack>
                    <Typography variant="h6" fontWeight={600}>
                      Security
                    </Typography>
                    <Typography variant="body2">
                      World Bank Licensed.
                    </Typography>
                  </Stack>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  sx={{ backgroundColor: "#009a4c", color: "white" }}
                  onClick={() => setOpenSide(false)}
                >
                  Apply Now
                </Button>
              </Stack>
            </Stack>
          </CustomTabPanel>
        </Box>
      </Box>
    </Drawer>
  );
};

export default CardDrawer;
