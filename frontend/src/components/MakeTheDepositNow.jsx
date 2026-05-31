import {
  Box,
  Button,
  Divider,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { CaretLeft, Copy, ExclamationMark, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { tokens } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import { shortenText } from "../utils";
import BankLogoImg from "../assets/bank.png";
import DepositProof from "./dialogs/DepositProof";
import { toast } from "react-toastify";
import { SET_COINPRICE_NULL } from "../redux/features/coinPrice/coinPriceSlice";

const CountdownTimer = ({ setSelectedWallet }) => {
  const theme = useTheme();
  const [timeLeft, setTimeLeft] = useState({ minutes: 0, seconds: 0 });
  const dispatch = useDispatch()

  useEffect(() => {
    const interval = setInterval(() => {
      const savedSession = localStorage.getItem("depositSession");
      if (savedSession) {
        const { countdownEndTime } = JSON.parse(savedSession);
        const endTime = new Date(countdownEndTime).getTime();
        const currentTime = new Date().getTime();
        const timeDiff = endTime - currentTime;

        if (timeDiff > 0) {
          setTimeLeft({
            minutes: Math.floor(timeDiff / (1000 * 60)),
            seconds: Math.floor((timeDiff % (1000 * 60)) / 1000),
          });
        } else {
          setTimeLeft({ minutes: 0, seconds: 0 });
          localStorage.removeItem("depositSession");
          dispatch(SET_COINPRICE_NULL())
          setSelectedWallet(null);
          toast.info("Deposit Session Expired.");
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Stack direction={"row"} alignItems={"center"} spacing={1}>
      <Box
        direction={"row"}
        alignItems={"center"}
        backgroundColor={"transparent"}
        // p={"8px 16px"}
        borderRadius={"10px"}
        // border={"1px solid orange"}
        width={"50px"}
        height={"20px"}
      >
        <Typography
          variant="body1"
          color={
            timeLeft.minutes <= 5
              ? "red"
              : `${
                  theme.palette.mode === "light" ? "forestgreen" : "springgreen"
                }`
          }
          fontWeight={600}
        >
          {timeLeft.minutes}:
          {timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds}
        </Typography>
      </Box>
    </Stack>
  );
};

const MakeTheDepositNow = ({
  Wallet,
  setSelectedWallet,
  handleClose,
  amount,
  // setCoinID
}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // const { isLoading, allWalletAddress, walletAddress } = useSelector(
  //   (state) => state.walletAddress
  // );
  const { coinPrice } = useSelector((state) => state.coinPrice);

  const [openDepositProof, setOpenDepositProof] = useState(false);

  const handleCloseDepositProof = () => {
    setOpenDepositProof(false);
  };

  const handleOpenDepositProof = () => {
    setOpenDepositProof(true);
  };

  // start of copy wallet

  const [tooltipOpenAmount, setTooltipOpenAmount] = useState(false);
  const [tooltipOpenWallet, setTooltipOpenWallet] = useState(false);

  // Function to handle copy amount
  const handleCopyAmount = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipOpenAmount(true); // Show tooltip
    setTimeout(() => setTooltipOpenAmount(false), 1500); // Hide tooltip after 1.5 seconds
  };

  // Function to handle copy wallet
  const handleCopyWallet = (text) => {
    navigator.clipboard.writeText(text);
    setTooltipOpenWallet(true); // Show tooltip
    setTimeout(() => setTooltipOpenWallet(false), 1500); // Hide tooltip after 1.5 seconds
  };

  // end of copy wallet

  const savedSession = localStorage.getItem("depositSession")
    ? JSON.parse(localStorage.getItem("depositSession"))
    : null;

  // console.log("savedSession", savedSession);

  const handleCancelSession = () => {
    const savedSession = localStorage.getItem("depositSession");

    if (!savedSession) {
      return toast.info("No active deposit session to cancel.");
    }

    // Clear session data
    localStorage.removeItem("depositSession");
    // setCoinID(null);
    dispatch(SET_COINPRICE_NULL())
    setSelectedWallet(null); // Reset selected wallet if applicable
    toast.error("Deposit session canceled.");
  };

  return (
    <>
      {savedSession && (
        <>
          <Stack
            spacing={1}
            p={"15px 15px 10px 15px"}
            position={"sticky"}
            top={0}
            backgroundColor={colors.dashboardforeground[100]}
            zIndex={1000}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              p={"5px 5px"}
              alignItems={"center"}
            >
              <IconButton
                size="small"
                onClick={() => {
                  setSelectedWallet(null);
                }}
              >
                <CaretLeft size={20} weight="bold" />
              </IconButton>
              <Typography fontWeight={"600"}>
                {savedSession?.walletName} Deposit
              </Typography>
              <IconButton
                size="small"
                onClick={() => {
                  handleClose();
                  setSelectedWallet(null);
                }}
              >
                <X size={20} weight="bold" />
              </IconButton>
            </Stack>
          </Stack>
          <Box mx={"-15px"}>
            <Divider />
          </Box>

          <Box
            border={"0.5px dashed orange"}
            padding={"2px 4px"}
            textAlign={"center"}
            mt={1}
            mx={2}
            borderRadius={"10px"}
          >
            <Typography variant="caption">
              Scan the QR code or copy the address to deposit. Notify us with
              proof of deposit for faster processing.
            </Typography>
          </Box>

          <Stack
            direction="row"
            justifyContent={"center"}
            alignItems={"center"}
            mt={1}
            spacing={1}
          >
            <Typography color="textSecondary">Time Left:</Typography>
            {/* timer countdown */}
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <CountdownTimer
                setSelectedWallet={setSelectedWallet}
                // setCoinID={setCoinID}
              />
            </Stack>
          </Stack>

          <Stack
            justifyContent={"center"}
            alignItems={"center"}
            spacing={1}
            mt={1}
            mb={2}
          >
            <Stack
              justifyContent={"center"}
              direction={"row"}
              border={"2px solid lightgrey"}
              padding={2}
              borderRadius={"20px"}
              position={"relative"}
            >
              <img
                src={savedSession?.walletQRCode}
                alt={savedSession?.walletName}
                width={150}
                style={{ border: "2px solid lightgrey" }}
              />
              <Stack
                position={"absolute"}
                bottom={"-15px"}
                backgroundColor={colors.dashboardforeground[100]}
                minHeight={0}
                p={"0 10px"}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={0.5}
              >
                <img
                  src={
                    Wallet === "Bank" ? BankLogoImg : savedSession?.walletPhoto
                  }
                  alt={Wallet}
                  width={20}
                />

                <Typography>
                  {shortenText(
                    savedSession?.walletName ? savedSession?.walletName : "",
                    15
                  )}
                </Typography>
              </Stack>
              <Stack
                position={"absolute"}
                top={"25%"}
                left={"-15px"}
                backgroundColor={colors.dashboardforeground[100]}
                minHeight={0}
                p={"0 10px"}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={0.5}
                width={"10px"}
                height={"80px"}
              ></Stack>
              <Stack
                position={"absolute"}
                top={"25%"}
                right={"-15px"}
                backgroundColor={colors.dashboardforeground[100]}
                minHeight={0}
                p={"0 10px"}
                direction={"row"}
                alignItems={"center"}
                justifyContent={"center"}
                spacing={0.5}
                width={"10px"}
                height={"80px"}
              ></Stack>
            </Stack>

            <Divider flexItem sx={{ pt: "8px" }}>
              Or
            </Divider>

            <Stack spacing={1} width={"90%"}>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <InputLabel htmlFor="my-input">Amount</InputLabel>
                <ExclamationMark weight="fill" />
                <Typography variant="caption" color={"orange"}>
                  Amount to deposit:
                  {Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code,
                    ...(savedSession?.amountFiat > 9999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(savedSession?.amountFiat)}
                </Typography>
              </Stack>

              {savedSession?.amountCrypto &&
              savedSession?.amountCrypto !== "NaN" && savedSession?.amountCrypto !== "Infinity" ? (
                <OutlinedInput
                  size="normal"
                  readOnly
                  placeholder="Enter Price"
                  value={
                    Number(savedSession?.amountCrypto).toFixed(8) +
                    " " +
                    savedSession?.walletSymbol.toUpperCase()
                  }
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "10px",
                    },
                  }}
                  endAdornment={
                    <InputAdornment
                      position="end"
                      sx={{ marginRight: "-10px" }}
                    >
                      <Tooltip
                        title="Copied!"
                        open={tooltipOpenAmount}
                        disableFocusListener
                        disableHoverListener
                        disableTouchListener
                        arrow
                        placement="top"
                      >
                        <IconButton
                          onClick={() =>
                            handleCopyAmount(
                              Number(savedSession?.amountCrypto).toFixed(8)
                            )
                          }
                        >
                          <Stack alignItems={"center"}>
                            <Copy />
                            <Typography fontSize={"12px"}> copy </Typography>
                          </Stack>
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  }
                />
              ) : (
                <OutlinedInput
                  size="normal"
                  readOnly
                  placeholder="Enter Price "
                  value={savedSession?.amountFiat + " " + user?.currency?.code}
                  sx={{
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderRadius: "10px",
                    },
                  }}
                />
              )}
            </Stack>

            <Stack spacing={1} width={"90%"}>
              <InputLabel htmlFor="my-input">Address</InputLabel>

              <OutlinedInput
                readOnly
                size="normal"
                placeholder="Enter Price "
                value={savedSession?.walletAddress}
                sx={{
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderRadius: "10px",
                  },
                }}
                endAdornment={
                  <InputAdornment position="end" sx={{ marginRight: "-10px" }}>
                    <Tooltip
                      title="Copied!"
                      open={tooltipOpenWallet}
                      disableFocusListener
                      disableHoverListener
                      disableTouchListener
                      arrow
                      placement="top"
                    >
                      <IconButton
                        onClick={() =>
                          handleCopyWallet(savedSession?.walletAddress)
                        }
                      >
                        <Stack alignItems={"center"}>
                          <Copy />
                          <Typography fontSize={"12px"}> copy </Typography>
                        </Stack>
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                }
              />
            </Stack>

            <Typography variant="caption" color={"orange"} fontSize={"11px"} textAlign={"center"}>
              Account will be funded after one{" "}
              {savedSession?.walletSymbol.toUpperCase()} Transaction
              Confirmation
            </Typography>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              width={"100%"}
              backgroundColor={
                theme.palette.mode === "light"
                  ? "#f2f2f2"
                  : colors.dashboardbackground[100]
              }
              p={"10px 20px"}
              color={"grey"}
            >
              <Stack spacing={0.5} alignItems={"center"}>
                <Typography variant="caption">Made the Deposit ?</Typography>
                <Button
                  // variant="contained"
                  sx={{ height: "25px" }}
                  onClick={handleOpenDepositProof}
                >
                  Click to Notify
                </Button>
              </Stack>

              <Button
                startIcon={<X />}
                variant="outlined"
                onClick={handleCancelSession}
              >
                Cancel
              </Button>
            </Stack>
          </Stack>

          <DepositProof
            open={openDepositProof}
            handleClose={handleCloseDepositProof}
            handleOpen={handleOpenDepositProof}
            amount={amount}
            Wallet={Wallet}
            savedSession={savedSession}
          />
        </>
      )}
    </>
  );
};

export default MakeTheDepositNow;
