import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../theme";
import { CryptoImages } from "../data";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { shortenText } from "../utils";
import BankLogoImg from "../assets/bank.png";
import DepositDetails from "./dialogs/DepositDetails";
import {
  getUserDeposithistory,
  SETSELECTEDDEPOSIT,
} from "../redux/features/deposit/depositSlice";

const DepositHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { deposits, isLoading, isSuccess, isError, isLoggedIn } = useSelector(
    (state) => state.deposit
  );
  const { user, conversionRate } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !isLoading &&
      deposits.length === 0 &&
      isSuccess === false &&
      isError === false
    ) {
      dispatch(getUserDeposithistory());
    }
  }, [deposits.length, dispatch, isLoading, isSuccess, isError]);

  const handleRefresh = () => {
    dispatch(getUserDeposithistory());
  };

  const handleSelectDeposit = (deposit) => {
    dispatch(SETSELECTEDDEPOSIT(deposit));
  };

  const [openDepositDetails, setopenDepositDetails] = useState(false);

  const handleCloseDepositDetails = () => {
    setopenDepositDetails(false);
  };

  const handleopenDepositDetails = () => {
    setopenDepositDetails(true);
  };

  // Function to get the URL by the crypto name
  const getCryptoImageUrl = (cryptoName) => {
    const crypto = CryptoImages.find((image) => image.name === cryptoName);
    return crypto ? crypto.url : "URL not found";
  };

  return (
    <>
      {isLoading ? (
        <Stack justifyContent={"center"} alignItems={"center"} height={"100%"}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Button
            p={0.5}
            startIcon={<ArrowsClockwise />}
            variant="contained"
            onClick={handleRefresh}
          >
            Refresh
          </Button>
          <Stack spacing={2} p={"15px 10px 10px 10px"} overflow={"auto"}>
            {deposits?.map((deposit) => (
              <>
                <Stack
                  key={deposit?._id}
                  spacing={1}
                  direction={"row"}
                  alignItems={"center"}
                  backgroundColor={
                    theme.palette.mode === "light"
                      ? "#f2f2f2"
                      : colors.dashboardbackground[100]
                  }
                  p={"16px 16px"}
                  mt={0.5}
                  mx={1}
                  borderRadius={"15px"}
                  border={`${
                    theme.palette.mode === "light"
                      ? "1px solid #202020"
                      : "1px solid lightgrey"
                  }`}
                  onClick={() => {
                    handleSelectDeposit(deposit);
                    handleopenDepositDetails();
                  }}
                >
                  <Stack spacing={0.5} width={"100%"}>
                    <Stack
                      direction={"row"}
                      spacing={2}
                      justifyContent={"space-between"}
                      width={"100%"}
                    >
                      <Stack
                        direction={"row"}
                        justifyContent={"space-between"}
                        spacing={2}
                      >
                        <img
                          src={
                            deposit?.method === "Bank"
                              ? BankLogoImg
                              : deposit?.methodIcon
                          }
                          alt={deposit?.method}
                          style={{
                            borderRadius: "10px",
                            backgroundColor: "white",
                            padding: "4px",
                          }}
                          width={50}
                          height={50}
                        />
                        <Stack>
                          <Typography>
                            ID-{shortenText(deposit?._id, 4)}
                          </Typography>
                          <Typography>{deposit?.method} Method</Typography>
                        </Stack>
                      </Stack>
                      <Stack textAlign={"right"}>
                        <Typography>
                          {new Date(deposit?.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "2-digit", // 12 for December
                              day: "2-digit", // 12 for the day
                              year: "numeric", // 2024 for the year
                            }
                          )}
                        </Typography>
                        <Typography color={"#009e4a"} fontWeight={600}>
                          {conversionRate?.rate
                            ? Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: conversionRate?.code,
                                ...(deposit?.amount * conversionRate?.rate >
                                9999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(deposit?.amount * conversionRate?.rate)
                            : Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: user?.currency?.code,
                                ...(deposit?.amount > 9999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(deposit?.amount)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                    >
                      <Typography variant="subtitle2">
                        Tap to display receipt
                      </Typography>
                      <Typography
                        fontWeight={600}
                        variant="subtitle2"
                        color={deposit?.status === "APPROVED"? "#009e4a" : deposit?.status === "NOT-APPROVED" ? "red" : "orange"}
                      >
                        {deposit?.status}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </>
            ))}
          </Stack>
        </>
      )}

      <DepositDetails
        open={openDepositDetails}
        handleClose={handleCloseDepositDetails}
        handleOpen={handleopenDepositDetails}
      />
    </>
  );
};

export default DepositHistory;
