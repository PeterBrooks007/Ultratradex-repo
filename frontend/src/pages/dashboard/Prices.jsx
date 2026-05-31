import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  Tab,
  Tabs,
  TextField,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import TickerTapeWidget from "../../components/TradeviewWidgets/TickerTapeWidget";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SET_ISLOADING_FALSE } from "../../redux/features/app/appSlice";
import PropTypes from "prop-types";
import Tradable from "./dashboardComponents/Tradable";
import All from "./dashboardComponents/All";
import Favourite from "./dashboardComponents/Favourite";
import { WalletRight } from "../../components/WalletRight";
import { getLoginStatus } from "../../redux/features/auth/authSlice";
import TopBar from "./dashboardComponents/TopBar";
import LoadingScreen from "../../components/LoadingScreen";
import AllUsersSkeleton from "../admin/adminSkeletons/AllUsersSkeleton";

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
      {value === index && <Box sx={{ p: "20px 0 0 0" }}>{children}</Box>}
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

const Prices = () => {
  const dispatch = useDispatch();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();
  const { isLoading: appLoading } = useSelector((state) => state.app);

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { user, isLoading, isLoggedIn, allCoins } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (user) {
      dispatch(SET_ISLOADING_FALSE());
    }
  }, [dispatch, user]);

  const [allCoinsNow, setAllCoins] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(allCoinsNow) ? allCoinsNow.filter((allCoin) =>
    allCoin.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];



  useEffect(() => {
    setAllCoins(allCoins);
  }, [allCoins]);

  return (
    <>
      {appLoading || isLoading || !user ? (
        <AllUsersSkeleton />
      ) : (
        <Box
          display={"flex"}
          flexDirection={"column"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "12px" }}
          padding={{ xs: "15px", md: "20px" }}
          sx={{ overflowX: "hidden" }}
          // overflow={"auto"}
          className="scrollable-element"
        >
          <Box
            mb={{ xs: 1.5, md: 3 }}
            mt={"-15px"}
            mx={"-15px"}
            borderBottom={"1px solid #111820"}
          >
            <TickerTapeWidget />
          </Box>

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", lg: "row" }}
            // mb={{xs: 10, md: 0}}
            // gap={2}
          >
            <Box
              flex={{ xs: "100%", lg: "30%", xl: "25%" }}
              sx={{ overflowY: "auto", overflowX: "hidden" }}
              // pb={{xs: 20, sm: 20, md: 0}}
            >
              <Stack spacing={2} direction={"column"} p={0.5}>
                <TopBar />
              </Stack>

              <Stack spacing={2} mt={2}>
                <TextField
                  label="Search"
                  variant="outlined"
                  fullWidth
                  size="small"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="calculator" edge="end">
                          <MagnifyingGlass />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "20px",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "20px",
                    },
                  }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      value={value}
                      onChange={handleChange}
                      aria-label="basic tabs "
                      variant="fullWidth"
                      centered
                      //   sx={{
                      //     "& .MuiTabs-indicator": {
                      //       backgroundColor: "transparent", // Remove default indicator
                      //     },
                      //     "& .MuiTab-root": {
                      //       textTransform: "none", // Remove default uppercase
                      //       minWidth: "auto", // Adjust min-width for better responsiveness
                      //       borderRadius: "12px", // Match the rounded corners
                      //       border: "none", // Remove default border
                      //       borderBottom: "2px solid transparent", // Add underline for active tab
                      //       "&:hover": {
                      //         borderBottom: "2px solid #ccc", // Hover effect
                      //       },
                      //       "&.Mui-selected": {
                      //         borderBottom: "2px solid #007bff", // Active tab color
                      //       },
                      //     },
                      //   }}
                    >
                      <Tab label="Tradable" {...a11yProps(0)} />
                      <Tab label="Favorites" {...a11yProps(1)} />
                      <Tab label="All" {...a11yProps(2)} />
                    </Tabs>
                  </Box>
                  <CustomTabPanel value={value} index={0}>
                    <Tradable filteredAllCoins={filteredAllCoins} />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={1}>
                    <Favourite />
                  </CustomTabPanel>
                  <CustomTabPanel value={value} index={2}>
                    <All filteredAllCoins={filteredAllCoins} />
                  </CustomTabPanel>
                </Box>
              </Stack>
            </Box>

            {size.width > 899 && (
              <Box
                flex={{ xs: "100%", lg: "70%", xl: "75%" }}
                // backgroundColor="red"
                overflow={"hidden"}
                display={{ xs: "none", lg: "flex" }}
                p={"15px"}
                ml={"20px"}
                // border={"1px solid grey"}
                borderRadius={"20px"}
              >
                <WalletRight />
              </Box>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Prices;
