import {
  Button,
  CircularProgress,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CryptoImages } from "../../../data";
import { ArrowsClockwise } from "@phosphor-icons/react";
import { shortenText } from "../../../utils";
import BankLogoImg from "../../../assets/bank.png";
import {
  adminGetUserDeposithistory,
  getUserDeposithistory,
  SETSELECTEDDEPOSIT,
} from "../../../redux/features/deposit/depositSlice";
import { tokens } from "../../../theme";
import DepositDetails from "../../../components/dialogs/DepositDetails";
import AdminAddHistoryToUserDrawer from "./drawers/AdminAddHistoryToUserDrawer";
import UseWindowSize from "../../../hooks/UseWindowSize";
import WithdrawalDetails from "../../../components/dialogs/WithdrawalDetails";
import { adminGetUserWithdrawalhistory, SETSELECTEDWITHDRAWAL } from "../../../redux/features/withdrawal/withdrawalSlice";

const AdminUserWithdrawalHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize()

  const { withdrawals, isLoading, isSuccess, isError, isLoggedIn } =
  useSelector((state) => state.withdrawal);

  console.log(withdrawals)

  const { user, conversionRate, singleUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (singleUser) {
      dispatch(adminGetUserWithdrawalhistory(singleUser?._id));
    }
  }, [singleUser, dispatch]);

  const handleRefresh = () => {
    dispatch(adminGetUserWithdrawalhistory(singleUser?._id));
  };

  const handleSelectWithdrawal = (withdrawal) => {
    dispatch(SETSELECTEDWITHDRAWAL(withdrawal));
  };

  
  const [openWithdrawalDetails, setOpenWithdrawalDetails] = useState(false);

  const handleCloseWithdrawalDetails = () => {
    setOpenWithdrawalDetails(false);
  };

  const handleOpenWithdrawalDetails = () => {
    setOpenWithdrawalDetails(true);
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
          <Stack direction={"row"} alignItems={"center"} p={"10px"} spacing={1}>
            <img
              src={singleUser?.photo}
              alt="profileimage"
              width={"60px"}
              height={"60px"}
              style={{
                border: "2px solid grey",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />

            <Stack>
              <Typography variant="h6" fontWeight={"600"}>
                {singleUser?.firstname} {singleUser?.lastname}
              </Typography>
              <Typography variant="subtitle2">Withdrawal History</Typography>
            </Stack>
          </Stack>

          <Stack
            direction={"row"}
            p={1}
            spacing={1}
            justifyContent={"space-around"}
          >
            
            <Button
              fullWidth
              p={0.5}
              startIcon={<ArrowsClockwise />}
              variant="outlined"
              onClick={handleRefresh}
            >
              Refresh
            </Button>
          </Stack>
          <Stack spacing={2} p={"15px 10px 10px 10px"} overflow={"auto"}>
            {withdrawals?.map((withdrawal) => (
              <>
                <Stack
                  key={withdrawal?._id}
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
                    handleSelectWithdrawal(withdrawal);
                    handleOpenWithdrawalDetails();
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
                            withdrawal?.method === "Bank"
                              ? BankLogoImg
                              : getCryptoImageUrl(withdrawal?.method.trim())
                          }
                          alt="metaMaskImg"
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
                            ID-{shortenText(withdrawal?._id, size.width < 600 ? 4 : 30)}
                          </Typography>
                          <Typography>{withdrawal?.method} Method</Typography>
                        </Stack>
                      </Stack>
                      <Stack textAlign={"right"}>
                        <Typography>
                          {new Date(withdrawal?.createdAt).toLocaleString(
                            "en-US",
                            {
                              month: "2-digit", // 12 for December
                              day: "2-digit", // 12 for the day
                              year: "numeric", // 2024 for the year
                            }
                          )}
                        </Typography>
                        <Typography color={"red"} fontWeight={600}>
                          -
                          {conversionRate?.rate
                            ? Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: conversionRate?.code,
                                ...(withdrawal?.amount * conversionRate?.rate >
                                9999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(
                                withdrawal?.amount * conversionRate?.rate
                              )
                            : Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: user?.currency?.code,
                                ...(withdrawal?.amount > 9999999
                                  ? { notation: "compact" }
                                  : {}),
                              }).format(withdrawal?.amount)}
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
                      <Typography fontWeight={600} variant="subtitle2">
                        {withdrawal?.status}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </>
            ))}
          </Stack>
        </>
      )}

<WithdrawalDetails
        open={openWithdrawalDetails}
        handleClose={handleCloseWithdrawalDetails}
        handleOpen={handleOpenWithdrawalDetails}
      />

   
    </>
  );
};

export default AdminUserWithdrawalHistory;
