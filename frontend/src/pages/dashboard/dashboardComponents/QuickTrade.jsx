import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Calculator } from "@phosphor-icons/react";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import {
  getAllTradingSetting,
  SETSELECTEDEXCHANGETYPE,
} from "../../../redux/features/tradingSettings/tradingSettingsSlice";
import { useDispatch, useSelector } from "react-redux";
import TradeSection from "../../../components/tradesection/TradeSection";
import TradeHistoryDrawer from "../../../components/drawers/TradeHistoryDrawer";

const QuickTrade = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 900px)");

  const dispatch = useDispatch();
  const { isLoading, exchange, allExchanges } = useSelector(
    (state) => state.tradingSettings
  );

  const { user } = useSelector((state) => state.auth);

  const [selectedExchange, setSelectedExchange] = useState(null);

  const [selectedSymbol, setSelectedSymbol] = useState(null);

  useEffect(() => {
    if (allExchanges.length === 0) {
      dispatch(getAllTradingSetting());
    }
  }, [dispatch]);

  useEffect(() => {
    // Clear selected value when exchange changes
    setSelectedSymbol(null);
  }, [exchange?.tradingPairs]);

  // TradeHistoryDrawer
  const [openTradeHistoryDrawer, setTradeHistoryDrawer] = useState(false);
  const [tradeHistoryDrawerLoader, setTradeHistoryDrawerLoader] =
    useState(false);

  const handleOpenTradeHistoryDrawer = () => {
    setTradeHistoryDrawer(true);
  };

  const handleCloseTradeHistoryDrawer = () => {
    setTradeHistoryDrawer(false);
  };

  return (
    <>
      {isLoading ? (
        <Box
          flex={{ xs: "", md: "0 0 35%", lg: "0 0 30%", xl: "0 0 25%" }}
          width={"100%"}
          height={"auto"}
          backgroundColor={`${colors.dashboardbackground[100]}`}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          borderRadius={"10px"}
          padding={"10px 15px"}
        >
          <Stack justifyContent={"center"} alignItems={"center"} mt={4}>
            <CircularProgress size={32} />
          </Stack>
        </Box>
      ) : (
        <Box
          flex={{ xs: "", md: "0 0 35%", lg: "0 0 30%", xl: "0 0 25%" }}
          width={"100%"}
          height={"auto"}
          backgroundColor={`${colors.dashboardbackground[100]}`}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          borderRadius={"10px"}
          padding={"10px 15px"}
        >
          <Stack spacing={2} justifyContent={"space-between"}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              borderBottom={"2px solid grey"}
              pb={1}
            >
              <Box>
                <Typography variant={isMobile ? "body1" : "h6"}>
                  Quick Trade
                </Typography>
                <Typography variant="caption">place a quick trade</Typography>
              </Box>

              <Stack alignItems={"flex-start"}>
                <Typography>Balance</Typography>
                <Typography
                  variant="body1"
                 
                >
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code,
                    ...(user?.balance > 999999 ? { notation: "compact" } : {}),
                  }).format(user?.balance)}
                </Typography>
              </Stack>
            </Stack>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              spacing={3}
              mt={1.5}
              width={"100%"}
            >
              <Autocomplete
                size="small"
                sx={{ width: "100%" }}
                value={selectedExchange}
                options={allExchanges || []}
                autoHighlight
                getOptionLabel={(option) => option.exchangeType}
                onChange={(event, newValue) => {
                  setSelectedExchange(newValue);
                  dispatch(SETSELECTEDEXCHANGETYPE(newValue));
                }}
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <Box
                      key={key}
                      component="li"
                      sx={{ "& > img": { mr: 2, flexShrink: 0 } }}
                      {...optionProps}
                    >
                      <img
                        loading="lazy"
                        width="30"
                        height="30"
                        srcSet={option?.photo}
                        src={option?.photo}
                        alt={option?.exchangeType}
                        style={{ borderRadius: "50%" }}
                      />
                      {option.exchangeType}
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Exchange"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "16px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "16px",
                      },
                    }}
                  />
                )}
              />

              <Autocomplete
                size="small"
                disablePortal
                id="combo-box-demo"
                value={selectedSymbol}
                onChange={(event, newValue) => setSelectedSymbol(newValue)}
                options={exchange?.tradingPairs || []}
                sx={{
                  width: "100%",
                  "& .MuiAutocomplete-popupIndicator": {
                    borderRadius: "50%",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    borderRadius: "50%",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Symbols"
                    sx={{
                      "& .MuiOutlined-root": {
                        borderRadius: "16px",
                      },
                      "& .MuiOutlinedInput-notchedOutline": {
                        borderRadius: "16px",
                      },
                    }}
                  />
                )}
              />
            </Stack>

            <Box
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Box
                flex={"50%"}
                backgroundColor="#009e4a"
                borderRadius={"15px 0 0 15px"}
                p={"4px 12px"}
                color={"white"}
              >
                <Typography fontWeight={"500"}>Sell</Typography>
                <Typography fontWeight={"500"}>{selectedSymbol || "None"}</Typography>
              </Box>
              <Box
                flex={"50%"}
                backgroundColor="#d01724"
                borderRadius={"0 15px 15px 0"}
                p={"4px 12px"}
                display={"flex"}
                justifyContent={"flex-end"}
                color={"white"}
              >
                <Stack alignItems={"end"}>
                  <Typography fontWeight={"500"}>Buy</Typography>
                  <Typography fontWeight={"500"}>{selectedSymbol || "None"}</Typography>
                </Stack>
              </Box>
            </Box>

            <Stack>
              <TradeSection
                selectedExchange={selectedExchange}
                selectedSymbol={selectedSymbol}
                isQuickTrade={true}
                handleOpenTradeHistoryDrawer={handleOpenTradeHistoryDrawer}
                tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
                setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
              />

              <TradeHistoryDrawer
                open={openTradeHistoryDrawer}
                handleClose={handleCloseTradeHistoryDrawer}
                handleOpen={handleOpenTradeHistoryDrawer}
                tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
                setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
              />
            </Stack>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default QuickTrade;
