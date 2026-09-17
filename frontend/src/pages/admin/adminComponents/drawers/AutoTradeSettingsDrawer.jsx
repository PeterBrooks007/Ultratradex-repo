import { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  CircularProgress,
  Divider,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  TextField,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";

import { ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import { tokens } from "../../../../theme";
import { useDispatch, useSelector } from "react-redux";

import { IOSSwitch } from "../../../dashboard/Profile";
import { useParams } from "react-router-dom";
import {
  adminActivateDemoAccount,
  adminSetUserAutoTrade,
  adminVerifyEmail,
} from "../../../../redux/features/auth/authSlice";
import { toast } from "react-toastify";
import { getAllTradingSetting } from "../../../../redux/features/tradingSettings/tradingSettingsSlice";

const AutoTradeSettingsDrawer = ({
  open,
  handleClose,
  handleOpen,
  autoTradeSettingsDrawerLoader,
  setAutoTradeSettingsDrawerLoader,
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { id } = useParams();
  const { singleUser, isSemiLoading } = useSelector((state) => state.auth);

  const { isLoading, allExchanges } = useSelector(
    (state) => state.tradingSettings,
  );

  // console.log(allExchanges)

  useEffect(() => {
    if (allExchanges.length === 0) {
      dispatch(getAllTradingSetting());
    }
  }, [dispatch, allExchanges.length]);

  useEffect(() => {
    if (autoTradeSettingsDrawerLoader) {
      const timer = setTimeout(() => {
        setAutoTradeSettingsDrawerLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [autoTradeSettingsDrawerLoader, setAutoTradeSettingsDrawerLoader]);

  // const [isEditing, setIsEditing] = useState(false);

  // const [checked, setChecked] = useState(false);

  const [checked, setChecked] = useState({
    switch1: singleUser?.autoTradeSettings?.isAutoTradeActivated,
    switch2: singleUser?.autoTradeSettings?.type === "Random" ? true : false,
    switch3:
      singleUser?.autoTradeSettings?.type === "Always_Win" ? true : false,
    switch4:
      singleUser?.autoTradeSettings?.type === "Always_Lose" ? true : false,
  });

  useEffect(() => {
    setChecked({
      switch1: singleUser?.autoTradeSettings?.isAutoTradeActivated,
      switch2: singleUser?.autoTradeSettings?.type === "Random" ? true : false,
      switch3:
        singleUser?.autoTradeSettings?.type === "Always_Win" ? true : false,
      switch4:
        singleUser?.autoTradeSettings?.type === "Always_Lose" ? true : false,
    });
  }, [singleUser?.autoTradeSettings, singleUser?.type]);

  const [winLoseValue, setWinLoseValue] = useState(
    singleUser?.autoTradeSettings?.winLoseValue,
  );

  const [botTrade, setBotTrade] = useState(
    singleUser?.autoTradeSettings?.autoTradeCronJobStatus,
  );

  const [botTradeMax, setBotTradeMax] = useState(
    singleUser?.autoTradeSettings?.maxAutoTradeCronJob,
  );

  const [tradeDuration, setTradeDurarion] = useState(
    singleUser?.autoTradeSettings?.autotradeDuration,
  );

  const [resetchecked, setResetchecked] = useState(false);

  const [tradeExchange, setTradeExchange] = useState(
    singleUser?.autoTradeSettings?.tradeExchange,
  );

  // Handle switch change
  const handleSwitchChange = (event) => {
    const { name, checked: isChecked } = event.target;

    setChecked((prevState) => {
      let updatedState;

      if (name === "switch1") {
        // Toggle only `switch1` without affecting others
        updatedState = {
          ...prevState,
          switch1: isChecked,
        };
      } else {
        // If any of `switch2`, `switch3`, or `switch4` is toggled
        updatedState = {
          switch1: prevState.switch1, // Keep `switch1` unchanged
          switch2: name === "switch2" ? isChecked : false,
          switch3: name === "switch3" ? isChecked : false,
          switch4: name === "switch4" ? isChecked : false,
        };

        // If all `switch2`, `switch3`, and `switch4` are off, set `switch2` to true
        if (
          !updatedState.switch2 &&
          !updatedState.switch3 &&
          !updatedState.switch4
        ) {
          updatedState.switch2 = true;
        }
      }

      return updatedState;
    });

    // setTimeout(() => {
    //   handleFormSubmit(name, isChecked);
    // }, 600);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!winLoseValue) {
      return toast.error("Please Enter a win or Lose Value");
    }

    let type;
    if (checked.switch2) {
      type = "Random";
    }
    if (checked.switch3) {
      type = "Always_Win";
    }
    if (checked.switch4) {
      type = "Always_Lose";
    }

    const isStartingFresh =
      botTrade === "OPEN" &&
      singleUser?.autoTradeSettings?.autoTradeCronJobStatus !== "OPEN";

    const userData = {
      isAutoTradeActivated: checked.switch1,
      type,
      winLoseValue,
      autoTradeCronJobStatus: botTrade,
      maxAutoTradeCronJob: botTradeMax,
      numberOfTrades:
        resetchecked || isStartingFresh
          ? "0"
          : String(singleUser?.autoTradeSettings?.numberOfTrades) || "0",
      lastTradeAt:
        resetchecked || isStartingFresh
          ? ""
          : singleUser?.autoTradeSettings?.lastTradeAt || "",
      autotradeDuration: tradeDuration,
      autoTradeCronJobStartTime:
        resetchecked || isStartingFresh
          ? ""
          : singleUser?.autoTradeSettings?.autoTradeCronJobStartTime || "",
      tradeExchange: tradeExchange || "random",
    };

    console.log(userData);

    await dispatch(adminSetUserAutoTrade({ id, userData }));
    setResetchecked(false);
  };

  return (
    <>
      <Drawer
        anchor="right"
        open={open}
        onClose={() => {
          handleClose();
        }}
        onOpen={handleOpen}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", md: "550px" },
          },
        }}
      >
        {autoTradeSettingsDrawerLoader || isSemiLoading ? (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"auto"}
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
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Auto Trade Settings
                </Typography>
              </Toolbar>
            </AppBar>

            <Stack
              justifyContent={"center"}
              alignItems={"center"}
              height={"100%"}
              width={"100%"}
            >
              <CircularProgress />
            </Stack>
          </Box>
        ) : (
          <Box
            backgroundColor={colors.dashboardforeground[100]}
            width={"100%"}
            height={"100%"}
            overflow={"hidden"}
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
                  <ArrowLeft size={26} />
                </IconButton>
                <Typography variant="body1" color="inherit" component="div">
                  Auto Trade Settings
                </Typography>
              </Toolbar>
            </AppBar>

            <Box p={2} height={"90%"} overflow={"auto"}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                pb={2}
                alignItems={"center"}
              >
                <Typography variant="body1" fontWeight={"bold"}>
                  Set Auto Trade Mode
                </Typography>
                {/* <Button startIcon={<PlusCircle size={20} />}  size="small" variant="outlined" onClick={handleOpenAddWalletModal}>
                    Add Wallet
                  </Button> */}
              </Stack>

              <Divider flexItem />

              <Stack
                direction={"row"}
                alignItems={"center"}
                p={"10px 0"}
                spacing={1}
                display={{ xs: "flex", md: "flex" }}
              >
                <Avatar
                  src={singleUser?.photo}
                  alt="profile picture"
                  sx={{ width: "60px", height: "60px" }}
                />
                <Stack>
                  <Typography variant="h6" fontWeight={"600"}>
                    {singleUser?.firstname} {singleUser?.lastname}
                  </Typography>
                  <Typography variant="caption">{singleUser?.email}</Typography>
                </Stack>
              </Stack>

              <Divider />

              <Box
                sx={{ flexGrow: 1 }}
                mt={2}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 15px"}
                borderRadius={"10px"}
              >
                <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      {singleUser?.autoTradeSettings?.isAutoTradeActivated ? (
                        <CheckCircle size={28} color="springgreen" />
                      ) : (
                        <XCircle size={28} color="red" />
                      )}

                      <Typography variant="body1" fontWeight={500}>
                        {singleUser?.autoTradeSettings?.isAutoTradeActivated
                          ? "Auto Trading is Activated"
                          : "Activate Auto Trade"}
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch1}
                      onChange={handleSwitchChange}
                      name="switch1"
                    />
                  </Stack>

                  <Typography>
                    Click to Activate or deactivate Autotrade
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{ flexGrow: 1 }}
                mt={2}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 15px"}
                borderRadius={"10px"}
              >
                <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      {singleUser?.autoTradeSettings?.type === "Random" ? (
                        <CheckCircle size={28} color="springgreen" />
                      ) : (
                        <XCircle size={28} color="red" />
                      )}

                      <Typography variant="body1" fontWeight={500}>
                        {singleUser?.autoTradeSettings?.type === "Random"
                          ? "Random Win or Lose is activated"
                          : "Activate Random Win or Lose"}
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch2}
                      onChange={handleSwitchChange}
                      name="switch2"
                    />
                  </Stack>

                  <Typography>
                    Check this if you want user to have random win or lose
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{ flexGrow: 1 }}
                mt={2}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 15px"}
                borderRadius={"10px"}
              >
                <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      {singleUser?.autoTradeSettings?.type === "Always_Win" ? (
                        <CheckCircle size={28} color="springgreen" />
                      ) : (
                        <XCircle size={28} color="red" />
                      )}

                      <Typography variant="body1" fontWeight={500}>
                        {singleUser?.autoTradeSettings?.type === "Always_Win"
                          ? "Always Win is activated"
                          : "Activate always Win"}
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch3}
                      onChange={handleSwitchChange}
                      name="switch3"
                    />
                  </Stack>

                  <Typography>
                    Check this if you want user to always win the trade
                  </Typography>
                </Stack>
              </Box>

              <Box
                sx={{ flexGrow: 1 }}
                mt={2}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 15px"}
                borderRadius={"10px"}
              >
                <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    sx={{ cursor: "not-allowed" }}
                  >
                    <Stack direction={"row"} spacing={1} alignItems={"center"}>
                      {singleUser?.autoTradeSettings?.type === "Always_Lose" ? (
                        <CheckCircle size={28} color="springgreen" />
                      ) : (
                        <XCircle size={28} color="red" />
                      )}

                      <Typography variant="body1" fontWeight={500}>
                        {singleUser?.autoTradeSettings?.type === "Always_Lose"
                          ? "Always Lose is activated"
                          : "Activate always Lose"}
                      </Typography>
                    </Stack>

                    <IOSSwitch
                      checked={checked.switch4}
                      onChange={handleSwitchChange}
                      name="switch4"
                    />
                  </Stack>

                  <Typography>
                    Check this if you want user to always lose the trade
                  </Typography>
                </Stack>
              </Box>
              <Box
                sx={{ flexGrow: 1 }}
                mt={2}
                backgroundColor={`${colors.dashboardbackground[100]}`}
                boxShadow={
                  theme.palette.mode === "light" && `${theme.shadows[2]}`
                }
                p={"10px 15px"}
                borderRadius={"10px"}
              >
                <Stack spacing={2.5} sx={{ cursor: "pointer" }}>
                  <Typography>
                    Set the rate you want user to win or lose
                  </Typography>

                  <form onSubmit={handleFormSubmit}>
                    <Stack spacing={2} mt={2}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Rate Value
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={winLoseValue}
                          label="Rate Value"
                          onChange={(e) => setWinLoseValue(e.target.value)}
                        >
                          <MenuItem value={"Ten"}>
                            Ten {"[ e.g, 10, 20, 30 ]"}
                          </MenuItem>
                          <MenuItem value={"Hundred"}>
                            Hundred {" [ e.g, 100, 200, 300 ]"}
                          </MenuItem>
                          <MenuItem value={"Thousand"}>
                            Thousand {"[ e.g, 1000, 2000, 10,000 ]"}
                          </MenuItem>
                          <MenuItem value={"Million"}>
                            Million{" "}
                            {" [ e.g, 1,000,000, 2,000,000, 3,000,000 ]"}
                          </MenuItem>
                          <MenuItem value={"Random"}>
                            Random {" [ e.g, 10, 1000, 20,000, 1,000,000 ]"}
                          </MenuItem>
                        </Select>
                      </FormControl>{" "}
                      <br />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          SELECT TO OPEN BOT TRADE
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={botTrade}
                          label="SELECT BOT TRADE"
                          onChange={(e) => setBotTrade(e.target.value)}
                        >
                          <MenuItem value={"OPEN"}>OPEN</MenuItem>
                          <MenuItem value={"CLOSE"}>CLOSE</MenuItem>
                        </Select>
                      </FormControl>{" "}
                      <br />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          SELECT BOT TRADE MAX PER DAY
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={botTradeMax}
                          label="SELECT BOT TRADE MAX PER DAY"
                          onChange={(e) => setBotTradeMax(e.target.value)}
                        >
                          <MenuItem value={"1"}>1 TRADE PER DAY</MenuItem>
                          <MenuItem value={"2"}>2 TRADE PER DAY</MenuItem>
                          <MenuItem value={"3"}>3 TRADE PER DAY</MenuItem>
                          <MenuItem value={"4"}>4 TRADE PER DAY</MenuItem>
                          <MenuItem value={"5"}>5 TRADE PER DAY</MenuItem>
                          <MenuItem value={"6"}>6 TRADE PER DAY</MenuItem>
                          <MenuItem value={"7"}>7 TRADE PER DAY</MenuItem>
                          <MenuItem value={"10"}>10 TRADE PER DAY</MenuItem>
                          <MenuItem value={"14"}>14 TRADE PER DAY</MenuItem>
                          <MenuItem value={"20"}>20 TRADE PER DAY</MenuItem>
                        </Select>
                      </FormControl>
                      <br />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          TRADE DURATION
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={tradeDuration}
                          label="SELECT TRADE DURATION"
                          onChange={(e) => setTradeDurarion(e.target.value)}
                        >
                          <MenuItem value={"1"}>1 day</MenuItem>
                          <MenuItem value={"2"}>2 days</MenuItem>
                          <MenuItem value={"3"}>3 days</MenuItem>
                          <MenuItem value={"4"}>4 days</MenuItem>
                          <MenuItem value={"5"}>5 days</MenuItem>
                          <MenuItem value={"6"}>6 days</MenuItem>
                          <MenuItem value={"7"}>7 days</MenuItem>
                          <MenuItem value={"10"}>10 days</MenuItem>
                          <MenuItem value={"14"}>14 days</MenuItem>
                          <MenuItem value={"15"}>15 days</MenuItem>
                          <MenuItem value={"21"}>21 days</MenuItem>
                          <MenuItem value={"30"}>30 days</MenuItem>
                        </Select>
                      </FormControl>
                      <br />
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          SELECT EXCHANGE TO TRADE
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={tradeExchange}
                          label="SELECT EXCHANGE TO TRADE"
                          onChange={(e) => setTradeExchange(e.target.value)}
                        >
                          {/* Default Random Option */}
                          <MenuItem value={"random"}>Random</MenuItem>

                          {/* Dynamically Map Each Exchange from MongoDB */}
                          {allExchanges &&
                            allExchanges.length > 0 &&
                            allExchanges.map((setting) => {
                              // Optional: Skip or disable options that have no trading pairs
                              const isDisabled =
                                !setting.tradingPairs ||
                                setting.tradingPairs.length === 0;

                              return (
                                <MenuItem
                                  key={setting._id}
                                  value={setting.exchangeType.toLowerCase()}
                                  disabled={isDisabled}
                                >
                                  {setting.exchangeType.toUpperCase()}{" "}
                                  {isDisabled ? "(No Pairs Available)" : ""}
                                </MenuItem>
                              );
                            })}
                        </Select>
                      </FormControl>
                      <br />
                      <Stack
                        spacing={2.5}
                        sx={{ cursor: "pointer" }}
                        border={"1px solid green"}
                        p={2}
                      >
                        <Stack
                          direction={"row"}
                          justifyContent={"space-between"}
                          sx={{ cursor: "not-allowed" }}
                        >
                          <Stack
                            direction={"row"}
                            spacing={1}
                            alignItems={"center"}
                          >
                            <Typography variant="body1" fontWeight={500}>
                              Reset Bot Trades back to start
                            </Typography>
                          </Stack>

                          <IOSSwitch
                            checked={resetchecked}
                            onChange={(e) => setResetchecked(e.target.checked)}
                            name="resetchecked"
                          />
                        </Stack>

                        <Typography>
                          Current Bot trade = {`${botTrade} `}
                        </Typography>

                        <Typography>
                          Current number of Bot trade on going ={" "}
                          {`${singleUser?.autoTradeSettings?.numberOfTrades} /
                            ${botTradeMax}`}
                        </Typography>
                      </Stack>{" "}
                      <br />
                      <Button
                        fullWidth
                        color="inherit"
                        size="large"
                        type="submit"
                        variant="contained"
                        sx={{
                          bgcolor: "text.primary",
                          borderRadius: "10px",
                          padding: "15px",
                          fontWeight: "600",
                          color: (theme) =>
                            theme.palette.mode === "light"
                              ? "common.white"
                              : "grey.800",
                          "&:hover": {
                            bgcolor: "text.primary",
                            color: (theme) =>
                              theme.palette.mode === "light"
                                ? "common.whitw"
                                : "grey.800",
                          },
                        }}
                      >
                        {isSemiLoading ? (
                          <CircularProgress size={22} />
                        ) : (
                          "Initiate Changes"
                        )}
                      </Button>
                    </Stack>
                  </form>
                </Stack>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
    </>
  );
};

export default AutoTradeSettingsDrawer;
