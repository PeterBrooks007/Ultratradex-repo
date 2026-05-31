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

const AdminUserDepositHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize()

  const { deposits, isLoading } = useSelector(
    (state) => state.deposit
  );
  const { user, conversionRate, singleUser } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    if (singleUser) {
      dispatch(adminGetUserDeposithistory(singleUser?._id));
    }
  }, [singleUser, dispatch]);

  const handleRefresh = () => {
    dispatch(adminGetUserDeposithistory(singleUser?._id));
  };

  const handleSelectDeposit = (withdrawal) => {
    dispatch(SETSELECTEDDEPOSIT(withdrawal));
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


  
  // AdminAddHistoryToUserDrawer 
  const [openAdminAddHistoryToUserDrawer, setAdminAddHistoryToUserDrawer ] = useState(false);
  const [adminAddHistoryToUserLoader, setAdminAddHistoryToUserLoader] = useState(false);

  const handleOpenAdminAddHistoryToUserDrawer  = () => {
    setAdminAddHistoryToUserDrawer(true);
  };

  const handleCloseAdminAddHistoryToUserDrawer  = () => {
    setAdminAddHistoryToUserDrawer(false);
  };
  // End AdminAddHistoryToUserDrawer 


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
              <Typography variant="subtitle2">Deposit History</Typography>
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
              onClick={() => {
                setAdminAddHistoryToUserLoader(true);
                handleOpenAdminAddHistoryToUserDrawer();
              }}
            >
              ADD HISTORY
            </Button>
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
                            ID-{shortenText(deposit?._id, size.width < 600 ? 4 : 30)}
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
                        <Typography color={"springgreen"} fontWeight={600}>
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
                        color={
                          deposit?.status === "APPROVED"
                            ? "springgreen"
                            : deposit?.status === "NOT-APPROVED"
                            ? "red"
                            : "orange"
                        }
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

      <AdminAddHistoryToUserDrawer
        open={openAdminAddHistoryToUserDrawer}
        handleClose={handleCloseAdminAddHistoryToUserDrawer}
        handleOpen={handleOpenAdminAddHistoryToUserDrawer}
        adminAddHistoryToUserLoader={adminAddHistoryToUserLoader}
        setAdminAddHistoryToUserLoader={setAdminAddHistoryToUserLoader}
      />
    </>
  );
};

export default AdminUserDepositHistory;
