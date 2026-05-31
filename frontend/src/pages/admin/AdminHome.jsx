import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DownloadSimple,
  EnvelopeSimple,
  HandWithdraw,
  TipJar,
  UserCirclePlus,
  Users,
} from "@phosphor-icons/react";
import ProgressCircle from "./adminComponents/ProgressCircle";
import Header from "./adminComponents/Header";
import { tokens } from "../../theme";

import UseWindowSize from "../../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  RESETSETSELECTEDUSER,
} from "../../redux/features/auth/authSlice";
import MarketOverview from "./adminComponents/MarketOverview";
import { useEffect, useState } from "react";
import LoadingScreen from "../../components/LoadingScreen";
import CryptoTrending from "../dashboard/dashboardComponents/CryptoTrending";
import TechnicalAnalysisWidget from "../../components/TradeviewWidgets/TechnicalAnalysisWidget";
import { shortenText } from "../../utils";
import { useNavigate } from "react-router-dom";
import AllUsersSkeleton from "./adminSkeletons/AllUsersSkeleton";

const Dashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true); // Track event loading

  const { isLoading, user } = useSelector((state) => state.auth);

  const {
    isLoading: totalCountsLoader,
    totalUsers,
    unreadMessages,
    totalDepositRequests,
    totalWithdrawalRequests,
    recentUsers,
  } = useSelector((state) => state.totalCounts);

  // useEffect(() => {
  //   dispatch(getLoginStatus());
  // }, [dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setPageLoading(false);
    }, 100); // Simulate a 2-second loading delay
  }, []);

  return (
    <>
      {isLoading || !user || pageLoading ? (
        <AllUsersSkeleton />
      ) : (
        <Box
          m={{ xs: "6px", sm: "18px" }}
          height={"90vh"}
          overflow={"auto"}
          pb={5}
          sx={{ overflowX: "hidden" }}
        >
          <Box
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"flex-start"}
            p={{ xs: "2px", sm: "2px" }}
            px={{ xs: "4px", sm: "4px" }}
          >
            <Header
              title={
                (() => {
                  const currentHour = new Date().getHours();
                  if (currentHour < 12) return "Good Morning";
                  if (currentHour < 18) return "Good Afternoon";
                  return "Good Evening";
                })() +
                ", " +
                "Admin."
              }
              subtitle={new Date().toLocaleDateString("en-GB", {
                weekday: "long", // "Monday"
                day: "numeric", // "18"
                month: "long", // "August"
                year: "numeric", // "2024"
              })}
            />

            <Box>V1.0</Box>

            <Box display={size.width < 899 && "none"}>
              <Button
                size="small"
                sx={{
                  backgroundColor: colors.blueAccent[700],
                  color: colors.grey[100],
                  fontSize: "14px",
                  fontWeight: "bold",
                  padding: "7px 14px",
                  borderRadius: "25px",
                }}
                startIcon={<DownloadSimple size={22} />}
              >
                Download Report
              </Button>
            </Box>
          </Box>

          <Box
            color={colors.greenAccent[400]}
            p={{ xs: "2px", sm: "2px" }}
            mt={"-15px"}
            mb={2}
            display={{ xs: "block", md: "none" }}
            px={{ xs: "4px", sm: "4px" }}
          >
            <Typography>
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long", // "Monday"
                day: "numeric", // "18"
                month: "long", // "August"
                year: "numeric", // "2024"
              })}{" "}
            </Typography>
          </Box>

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            width={"100%"}
            p={{ xs: "2px", sm: "2px" }}
          >
            {/* total user, message etc section */}

            <Box
              backgroundColor={colors.dashboardbackground[100]}
              flex={{ md: "0 0 45%", lg: "0 0 45%", xl: "0 0 32.5%" }}
              height={{ xs: "350px", sm: "370px" }}
              borderRadius={"10px"}
              boxShadow={theme.shadows[1]}
            >
              <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2 } }}>
                <Grid container spacing={1.5}>
                  <Grid
                    item
                    xs={6}
                    md={6}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("all-users")}
                  >
                    <Box
                      backgroundColor={
                        theme.palette.mode === "light"
                          ? "white"
                          : "rgba(239, 239, 240, 0.05)"
                      }
                      borderRadius={"7px"}
                      height={"160px"}
                      boxShadow={theme.shadows[1]}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        p={2}
                        spacing={1}
                      >
                        <IconButton
                          sx={{
                            backgroundColor: "green",
                            borderRadius: "10px",
                          }}
                        >
                          <Users
                            size={size.width < 391 ? 22 : 24}
                            color="white"
                          />
                        </IconButton>
                        <Typography
                          variant={size.width < 600 ? "body1" : "h6"}
                          fontWeight={600}
                        >
                          Total Users
                        </Typography>
                      </Stack>
                      <Stack
                        p={2}
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        {totalCountsLoader ? (
                          <Skeleton
                            variant="text"
                            width={"60px"}
                            height={"40px"}
                          />
                        ) : (
                          <Typography variant={size.width < 600 ? "h5" : "h4"}>
                            {totalUsers}{" "}
                            <Chip
                              size="small"
                              label={`New`}
                              sx={{
                                color:
                                  theme.palette.mode === "light"
                                    ? "#009e4a"
                                    : "rgba(0, 255, 127, 0.8)",
                                fontWeight: "bold",
                                backgroundColor: "rgba(0, 255, 127, 0.1)",
                              }}
                            />
                          </Typography>
                        )}

                        <ProgressCircle />
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("mailbox")}
                  >
                    <Box
                      backgroundColor={
                        theme.palette.mode === "light"
                          ? "white"
                          : "rgba(239, 239, 240, 0.05)"
                      }
                      borderRadius={"7px"}
                      height={"160px"}
                      boxShadow={theme.shadows[1]}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        p={2}
                        spacing={1}
                      >
                        <IconButton
                          sx={{ backgroundColor: "red", borderRadius: "10px" }}
                        >
                          <EnvelopeSimple
                            size={size.width < 391 ? 22 : 24}
                            color="white"
                          />
                        </IconButton>
                        <Typography
                          variant={size.width < 600 ? "body1" : "h6"}
                          fontWeight={600}
                        >
                          Messages
                        </Typography>
                      </Stack>
                      <Stack
                        p={2}
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        {totalCountsLoader ? (
                          <Skeleton
                            variant="text"
                            width={"60px"}
                            height={"40px"}
                          />
                        ) : (
                          <Typography variant={size.width < 600 ? "h5" : "h4"}>
                            {unreadMessages}{" "}
                            {unreadMessages !== 0 && (
                              <Chip
                                size="small"
                                label={`New`}
                                sx={{
                                  color:
                                    theme.palette.mode === "light"
                                      ? "#009e4a"
                                      : "rgba(0, 255, 127, 0.8)",
                                  fontWeight: "bold",
                                  backgroundColor: "rgba(0, 255, 127, 0.1)",
                                }}
                              />
                            )}
                          </Typography>
                        )}
                        <ProgressCircle />
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("deposit-request")}
                  >
                    <Box
                      backgroundColor={
                        theme.palette.mode === "light"
                          ? "white"
                          : "rgba(239, 239, 240, 0.05)"
                      }
                      borderRadius={"7px"}
                      height={"160px"}
                      boxShadow={theme.shadows[1]}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        p={2}
                        spacing={1}
                      >
                        <IconButton
                          sx={{
                            backgroundColor: "orange",
                            borderRadius: "10px",
                          }}
                        >
                          <TipJar
                            size={size.width < 391 ? 22 : 24}
                            color="white"
                          />
                        </IconButton>
                        <Typography
                          variant={size.width < 600 ? "body1" : "h6"}
                          fontWeight={600}
                        >
                          Deposits
                        </Typography>
                      </Stack>
                      <Stack
                        p={2}
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        {totalCountsLoader ? (
                          <Skeleton
                            variant="text"
                            width={"60px"}
                            height={"40px"}
                          />
                        ) : (
                          <Typography variant={size.width < 600 ? "h5" : "h4"}>
                            {totalDepositRequests}{" "}
                            {totalDepositRequests !== 0 && (
                              <Chip
                                size="small"
                                label={`New`}
                                sx={{
                                  color:
                                    theme.palette.mode === "light"
                                      ? "#009e4a"
                                      : "rgba(0, 255, 127, 0.8)",
                                  fontWeight: "bold",
                                  backgroundColor: "rgba(0, 255, 127, 0.1)",
                                }}
                              />
                            )}
                          </Typography>
                        )}
                        <ProgressCircle />
                      </Stack>
                    </Box>
                  </Grid>

                  <Grid
                    item
                    xs={6}
                    md={6}
                    sx={{ cursor: "pointer" }}
                    onClick={() => navigate("withdrawal-request")}
                  >
                    <Box
                      backgroundColor={
                        theme.palette.mode === "light"
                          ? "white"
                          : "rgba(239, 239, 240, 0.05)"
                      }
                      borderRadius={"7px"}
                      height={"160px"}
                      boxShadow={theme.shadows[1]}
                    >
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        p={2}
                        spacing={1}
                      >
                        <IconButton
                          sx={{
                            backgroundColor: "dodgerblue",
                            borderRadius: "10px",
                          }}
                        >
                          <HandWithdraw
                            size={size.width < 391 ? 22 : 24}
                            color="white"
                          />
                        </IconButton>
                        <Typography
                          variant={size.width < 600 ? "body1" : "h6"}
                          fontWeight={600}
                        >
                          Withdrawals
                        </Typography>
                      </Stack>
                      <Stack
                        p={2}
                        direction={"row"}
                        justifyContent={"space-between"}
                        alignItems={"center"}
                      >
                        {totalCountsLoader ? (
                          <Skeleton
                            variant="text"
                            width={"60px"}
                            height={"40px"}
                          />
                        ) : (
                          <Typography variant={size.width < 600 ? "h5" : "h4"}>
                            {totalWithdrawalRequests}{" "}
                            {totalWithdrawalRequests !== 0 && (
                              <Chip
                                size="small"
                                label={`New`}
                                sx={{
                                  color:
                                    theme.palette.mode === "light"
                                      ? "#009e4a"
                                      : "rgba(0, 255, 127, 0.8)",
                                  fontWeight: "bold",
                                  backgroundColor: "rgba(0, 255, 127, 0.1)",
                                }}
                              />
                            )}
                          </Typography>
                        )}
                        <ProgressCircle />
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Box>

            {/* New users section */}

            <Box
              backgroundColor={colors.dashboardbackground[100]}
              flex={{ md: "0 0 54%", lg: "0 0 53.5%", xl: "0 0 32.5%" }}
              height={{ xs: "340px", md: "370px" }}
              borderRadius={"10px"}
              boxShadow={theme.shadows[1]}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
                pr={2}
                mb={1}
              >
                <Stack
                  p={1}
                  py={1.5}
                  direction={"row"}
                  spacing={0.5}
                  alignItems={"center"}
                >
                  <UserCirclePlus size={28} />
                  <Typography variant="h6">Lastest Users</Typography>
                </Stack>

                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    navigate(`all-users`);
                  }}
                >
                  View All
                </Button>
              </Stack>

              <Stack spacing={0}>
                {recentUsers.length !== 0
                  ? recentUsers
                      .filter((user) => user?.role !== "admin")
                      .map((user, index) => (
                        <>
                          <Stack
                            direction={"row"}
                            alignItems={"center"}
                            px={2}
                            py={1}
                            spacing={1.5}
                            justifyContent={"space-between"}
                            key={user?._id}
                            sx={{
                              "&:hover": {
                                backgroundColor: theme.palette.action.hover,
                              },
                              "&:active": {
                                backgroundColor: (theme) =>
                                  theme.palette.action.selected,
                              },
                              cursor: "pointer",
                            }}
                            onClick={async () => {
                              dispatch(RESETSETSELECTEDUSER());
                              navigate(`user-details/${user?._id}`);
                            }}
                          >
                            <Stack
                              direction={"row"}
                              alignItems={"center"}
                              spacing={2}
                            >
                              <Stack
                                direction={"row"}
                                alignItems={"center"}
                                spacing={1.2}
                              >
                                <Typography variant="h6">
                                  {index + 1}.
                                </Typography>
                                <Divider orientation="vertical" flexItem />
                                <Avatar
                                  src={user?.photo}
                                  sx={{
                                    width: { xs: "40px", md: "50px" },
                                    height: { xs: "40px", md: "50px" },
                                  }}
                                />
                              </Stack>
                              <Stack>
                                <Typography
                                  variant={size.width < 391 ? "body1" : "h6"}
                                >
                                  {user?.firstname} {user?.lastname}
                                </Typography>
                                <Typography
                                  variant={
                                    size.width < 391 ? "caption" : "subtitle2"
                                  }
                                >
                                  {shortenText(
                                    user?.email,
                                    size.width < 600 ? 20 : 50
                                  )}
                                </Typography>
                              </Stack>
                            </Stack>
                            <Stack
                              direction={"row"}
                              justifyContent={"center"}
                              alignItems={"center"}
                              spacing={1}
                            >
                              <Typography
                                display={{ xs: "none", sm: "flex", xl: "none" }}
                              >
                                {user?.address?.country}
                              </Typography>
                              <Avatar
                                src={`https://flagcdn.com/w80/${user?.address?.countryFlag}.png`}
                                alt="countryflag"
                                sx={{width: "30px", height: "30px", borderRadius: "50%"}}
                              />
                            </Stack>
                          </Stack>
                        </>
                      ))
                  : "No User Found"}
              </Stack>
            </Box>

            {/* Trending section */}

            <Box
              backgroundColor={colors.dashboardbackground[100]}
              flex={{ md: "0 0 55%", lg: "0 0 50%", xl: "0 0 32.5%" }}
              height={"370px"}
              overflow={"hidden"}
              borderRadius={"10px"}
              boxShadow={theme.shadows[1]}
              display={{ xs: "block", lg: "none", xl: "block" }}
              p={0.5}
            >
              <CryptoTrending />
            </Box>
          </Box>

          {/* technical analysis section */}

          <Box
            display={"flex"}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            width={"100%"}
            p={{ xs: "2px", sm: "2px" }}
            mt={2}
          >
            <Box
              backgroundColor={colors.dashboardbackground[100]}
              flex={{ md: "0 0 45%", xl: "0 0 32.5%" }}
              borderRadius={"10px"}
              boxShadow={theme.shadows[1]}
            >
              <Box height={{ xs: "400px", md: "510px" }}>
                <TechnicalAnalysisWidget />
              </Box>
            </Box>

            <Box
              backgroundColor={colors.dashboardbackground[100]}
              flex={{ md: "0 0 53.5%", xl: "0 0 66%" }}
              borderRadius={"10px"}
              boxShadow={theme.shadows[1]}
            >
              <MarketOverview />
            </Box>
          </Box>

          {/* footer */}

          <Stack
            backgroundColor={colors.dashboardbackground[100]}
            p={2}
            mt={2}
            borderRadius={"10px"}
          >
            <Typography>
              All contents © {new Date().getFullYear()} Tradesx10 Ltd (TX10).
              All rights reserved.
            </Typography>
          </Stack>
        </Box>
      )}
    </>
  );
};

export default Dashboard;
