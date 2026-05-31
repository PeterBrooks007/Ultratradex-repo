import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  ClockCounterClockwise,
  DotsThreeOutline,
  X,
} from "@phosphor-icons/react";
import TradeSection from "./tradesection/TradeSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getAllTradingSetting,
  SETSELECTEDEXCHANGETYPE,
} from "../redux/features/tradingSettings/tradingSettingsSlice";
import TradeHistoryDrawer from "./drawers/TradeHistoryDrawer";
import { SET_TRADEORDERCLICKED } from "../redux/features/app/appSlice";
import { useTheme } from "@emotion/react";

const Trading = ({ handleClose, drawer }) => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { isLoading, exchange, allExchanges } = useSelector(
    (state) => state.tradingSettings
  );

  const { tradingMode } = useSelector((state) => state.app);

  const [selectedExchange, setSelectedExchange] = useState(null);

  const [selectedSymbol, setSelectedSymbol] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClickMenu = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  // console.log(selectedSymbol);

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
  // End ChangeCurrencyDrawer

  return (
    <>
      {isLoading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          height={"100%"}
          width={"100%"}
          mt={4}
        >
          <CircularProgress size={28} />
        </Stack>
      ) : (
        <>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{ p: `${drawer && "5px"}` }}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
              <Typography
                variant="caption"
                sx={{
                  mr: 0.5,
                  border:
                    tradingMode.toLowerCase() === "live"
                      ? `1px solid ${
                          theme.palette.mode === "light"
                            ? "#009e4a"
                            : "rgba(0, 255, 127, 0.8)"
                        }`
                      : "1px solid red",
                  p: "0px 8px",
                  borderRadius: "8px",
                }}
                fontWeight={"600"}
                color={
                  tradingMode.toLowerCase() === "live"
                    ? theme.palette.mode === "light"
                      ? "#009e4a"
                      : "rgba(0, 255, 127, 0.8)"
                    : "red"
                }
              >
                {tradingMode}
              </Typography>
              <Typography variant={drawer ? "body1" : "body2"}>
                Trade Account
              </Typography>
            </Stack>
            <Stack
              direction={"row"}
              alignItems={"center"}
              spacing={1}
              justifyContent={"space-between"}
            >
              <IconButton onClick={handleClickMenu}>
                <DotsThreeOutline size={24} />
              </IconButton>

              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleCloseMenu}
                onClick={handleCloseMenu}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&::before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem
                  onClick={() => {
                    dispatch(SET_TRADEORDERCLICKED(""));
                    setTradeHistoryDrawerLoader(true);
                    handleOpenTradeHistoryDrawer();
                  }}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <ClockCounterClockwise size={24} />
                    <Typography>Trade History</Typography>
                  </Stack>
                </MenuItem>
              </Menu>

              <X size={30} onClick={handleClose} />
            </Stack>
          </Stack>

          {drawer && <Divider sx={{ mx: "-15px", pt: "5px" }} />}

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            spacing={3}
            mt={1.5}
          >
            <Autocomplete
              size="small"
              sx={{ width: 300 }}
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
                width: 300,
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
            mt={2}
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

          <Box
            width={"100%"}
            height={"calc(100vh - 200px)"}
            overflow={"auto"}
            pb={5}
            sx={{ overflowX: "hidden" }}
          >
            <TradeSection
              selectedExchange={selectedExchange}
              selectedSymbol={selectedSymbol}
              handleOpenTradeHistoryDrawer={handleOpenTradeHistoryDrawer}
              tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
              setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
            />
          </Box>

          <TradeHistoryDrawer
            open={openTradeHistoryDrawer}
            handleClose={handleCloseTradeHistoryDrawer}
            handleOpen={handleOpenTradeHistoryDrawer}
            tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
            setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
          />
        </>
      )}
    </>
  );
};

export default Trading;
