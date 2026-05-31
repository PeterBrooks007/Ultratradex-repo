import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Stack, Typography, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import TinyLineChart from "../../../components/charts/TinyLineChart";
import UseWindowSize from "../../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import CoinDetailsDrawer from "../../../components/drawers/CoinDetailsDrawer";
import { useState } from "react";
import { SETSELECTEDCOIN } from "../../../redux/features/auth/authSlice";
import { XCircle } from "@phosphor-icons/react";
import MiniSymbolOverviewWidget from "../../../components/TradeviewWidgets/MiniSymbolOverviewWidget";
import MarketNewsWidgets from "../../../components/TradeviewWidgets/MarketNewsWidgets";

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
      {value === index && <Box sx={{ p: 1.5 }}>{children}</Box>}
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

export default function CryptoTrending() {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const dispatch = useDispatch();

  const size = UseWindowSize();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { user, allCoins, conversionRate } = useSelector((state) => state.auth);

  const firstSix = Array.isArray(allCoins)
    ? allCoins.slice(0, size.width < 600 ? 8 : 6)
    : [];

  const [coinDetailsLoader, setCoinDetailsLoader] = useState(false);

  const [openCoinDetailsDrawer, setCoinDetailsDrawer] = useState(false);

  // Coin Details Drawer
  const handleOpenCoinDetailsDrawer = () => {
    setCoinDetailsDrawer(true);
    document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
  };

  const handleCloseCoinDetailsDrawer = () => {
    setCoinDetailsDrawer(false);
    document.documentElement.style.overflow = ""; // Resets <html> scroll
  };

  return (
    <>
      <Box
        flex={{ xs: "100%", md: "0 0 35%", lg: "0 0 30%", xl: "0 0 25%" }}
        height={"auto"}
        minHeight={"380px"}
        width="100%"
        backgroundColor={`${colors.dashboardbackground[100]}`}
        boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
        borderRadius={"10px"}
        // padding={"10px 10px"}
        sx={{ overflowY: "auto" }}
        className="hover123"
      >
        <Box
          sx={{ width: "100%" }}
          height={"auto"}
          maxHeight={{ xs: "auto", md: "380px" }}
        >
          <Box
            sx={{
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTabs-scrollButtons.Mui-disabled": {
                opacity: 0.3,
              },
              "& .MuiTab-root:first-of-type": {
                paddingLeft: "2px",
                marginLeft: `${size.width < 600 ? 0 : "20px"}`,
              },
            }}
          >
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              variant="scrollable"
              scrollButtons="auto"
              allowScrollButtonsMobile
            >
              <Tab label="Top Cryptos" {...a11yProps(0)} />
              <Tab label="Stocks" {...a11yProps(1)} />
              <Tab label="Forex" {...a11yProps(2)} />
              <Tab label="News" {...a11yProps(3)} />
              {/* <Tab label="News" {...a11yProps(4)} /> */}
            </Tabs>
          </Box>

          <CustomTabPanel value={value} index={0}>
            <Stack width={"100%"} spacing={1.5}>
              {firstSix && firstSix.length > 0 ? (
                firstSix.map((data, index) => (
                  <Stack
                    direction={"row"}
                    spacing={1}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    key={index}
                    onClick={() => {
                      dispatch(SETSELECTEDCOIN(data));
                      setCoinDetailsLoader(true);
                      handleOpenCoinDetailsDrawer();
                    }}
                    sx={{ cursor: "pointer" }}
                  >
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      <img
                        src={data?.image}
                        width={"30px"}
                        height={"30px"}
                        alt=""
                        style={{
                          backgroundColor: "white",
                          borderRadius: "50%",
                        }}
                      />
                      <Stack>
                        <Typography variant="subtitle1">
                          {data?.symbol.toUpperCase()}
                        </Typography>

                        <Typography variant="caption" mt={"-5px"}>
                          {data?.name}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Box width={"100px"} height={"50px"}>
                      <TinyLineChart
                        data={data?.sparkline_in_7d.price.map((price, i) => ({
                          name: i,
                          value: price,
                        }))}
                        dataPricePercentage={data?.price_change_percentage_24h}
                      />
                    </Box>
                    <Typography>
                      {conversionRate?.rate
                        ? Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: conversionRate?.code,
                            ...(data?.current_price * conversionRate?.rate >
                            9999
                              ? { notation: "compact" }
                              : {}),
                          }).format(data?.current_price * conversionRate?.rate)
                        : Intl.NumberFormat("en-US", {
                            style: "currency",
                            currency: user?.currency?.code,
                            ...(data?.current_price > 9999
                              ? { notation: "compact" }
                              : {}),
                          }).format(data?.current_price)}
                    </Typography>
                    <Typography
                      color={
                        data?.price_change_percentage_24h < 0
                          ? "red"
                          : "#009a4c"
                      }
                    >
                      {Number(data?.price_change_percentage_24h).toFixed(2)}%
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Stack
                  justifyContent={"center"}
                  alignItems={"center"}
                  height={"100%"}
                  spacing={1}
                  pt={3}
                >
                  <XCircle color="red" size={52} />
                  <Typography textAlign={"center"}>
                    Unable to load crypto data at this time
                  </Typography>
                </Stack>
              )}
            </Stack>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Box
              display={"flex"}
              flexWrap={"wrap"}
              gap={1.5}
              justifyContent={"center"}
            >
              <MiniSymbolOverviewWidget symbol={"NASDAQ:TSLA"} />
              <MiniSymbolOverviewWidget symbol={"NASDAQ:AAPL"} />
              <MiniSymbolOverviewWidget symbol={"NASDAQ:NVDA"} />
              <MiniSymbolOverviewWidget symbol={"NASDAQ:META"} />
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={2}>
          <Box
              display={"flex"}
              flexWrap={"wrap"}
              gap={1.5}
              justifyContent={"center"}
            >
              <MiniSymbolOverviewWidget symbol={"FX:EURUSD"}  />
              <MiniSymbolOverviewWidget symbol={"FX:GBPUSD"}  />
              <MiniSymbolOverviewWidget symbol={"FX:EURJPY"}  />
              <MiniSymbolOverviewWidget symbol={"FX:GBPJPY"}  />
            </Box>
          </CustomTabPanel>

          <CustomTabPanel value={value} index={3}>
            <Box height={"400px"} >

            <MarketNewsWidgets />
            </Box>
          </CustomTabPanel>
          
        </Box>
      </Box>

      <CoinDetailsDrawer
        open={openCoinDetailsDrawer}
        handleClose={handleCloseCoinDetailsDrawer}
        handleOpen={handleOpenCoinDetailsDrawer}
        coinDetailsLoader={coinDetailsLoader}
        setCoinDetailsLoader={setCoinDetailsLoader}
      />
    </>
  );
}
