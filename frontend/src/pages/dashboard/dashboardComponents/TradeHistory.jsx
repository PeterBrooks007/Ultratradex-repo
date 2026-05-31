import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowRight, XCircle } from "@phosphor-icons/react";
import { tokens } from "../../../theme";
import { useEffect, useState } from "react";
import { adminGetAllUserTrades } from "../../../redux/features/trades/tradesSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TradeHistoryDrawer from "../../../components/drawers/TradeHistoryDrawer";

const TradeHistory = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const isMobile = useMediaQuery("(max-width: 900px)");
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { isSemiLoading, allTrades } = useSelector((state) => state.trades);

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

  useEffect(() => {
    if (user?.role !== "admin" && allTrades?.length === 0) {
      dispatch(adminGetAllUserTrades(user?._id));
    }
  }, [dispatch]);

  const allTradeFiltered = Array.isArray(allTrades.trades)
    ? [...allTrades.trades].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      ).slice(0, 5)
    : [];

  return (
    <>
      {isSemiLoading ? (
        <Box
          flex={{ xs: "", md: "30%" }}
          width={"100%"}
          height={"500px"}
          backgroundColor={`${colors.dashboardbackground[100]}`}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          borderRadius={"10px"}
        >
          <Stack justifyContent={"center"} alignItems={"center"} mt={3}>
            <CircularProgress size={22} />
          </Stack>
        </Box>
      ) : (
        <Box
          flex={{ xs: "", md: "30%" }}
          width={"100%"}
          height={{xs: "460px", md: "500px"}}
          overflow={"auto"}
          backgroundColor={`${colors.dashboardbackground[100]}`}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          borderRadius={"10px"}
        >
          <Stack p={"10px 15px"}>
            <Stack
              direction={"column"}
              justifyContent={"space-between"}
              spacing={1.5}
            >
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"start"}
              >
                <Box>
                  <Typography variant={isMobile ? "body1" : "h6"}>
                    Trading History
                  </Typography>
                  <Typography variant="caption">
                    Last 5 trading history
                  </Typography>
                </Box>

                <Box>
                  <Button
                    color="secondary"
                    onClick={() => {
                      setTradeHistoryDrawerLoader(true);
                      handleOpenTradeHistoryDrawer();
                    }}
                    variant="outlined"
                    size="small"
                  >
                    View All
                  </Button>
                </Box>
              </Stack>

              {allTradeFiltered && allTradeFiltered.length !== 0
                ? allTradeFiltered.map((trade) => (
                    <Stack
                      key={trade?._id}
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      borderTop={"1px solid grey"}
                      borderBottom={"1px solid grey"}
                      borderLeft={`2px solid ${
                        trade?.status === "Won" ? "#009a4c" : "red"
                      }`}
                      borderRight={`2px solid ${
                        trade?.status === "Won" ? "#009a4c" : "red"
                      }`}
                      p={"5px 10px"}
                      borderRadius={"15px"}
                    >
                      <Stack spacing={0.5}>
                        <Stack
                          direction={"row"}
                          spacing={0.5}
                          alignItems={"center"}
                        >
                          <Typography
                            variant={isMobile ? "subitle1" : "subtitle2"}
                          >
                            {trade?.symbols}
                          </Typography>
                          <Typography
                            variant={isMobile ? "caption" : "caption"}
                            color={
                              trade?.buyOrSell === "Buy" ? "#009a4c" : "red"
                            }
                          >
                            {trade?.buyOrSell}, {trade?.units} {trade?.units == 1 ? "unit" : "units"}
                          </Typography>
                        </Stack>

                        <Stack
                          direction={"row"}
                          spacing={1}
                          alignItems={"center"}
                        >
                          <Typography
                            variant={isMobile ? "subtitle2" : "subtitle2"}
                          >
                            {trade?.open}
                          </Typography>
                          <ArrowRight />
                          <Typography
                            variant={isMobile ? "subtitle2" : "subtitle2"}
                          >
                            {trade?.close}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Stack>
                        <Stack spacing={1} alignItems={"flex-end"}>
                          <Typography
                            variant={isMobile ? "subtitle2" : "subtitle2"}
                          >
                            {new Date(trade?.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </Typography>

                          <Typography
                            variant={isMobile ? "subtitle2" : "subtitle2"}
                            color={
                              trade?.status === "Won" ? "#009a4c" : "red"
                            }
                            fontWeight={"bold"}
                          >
                            <span
                              style={{
                                display:
                                  trade?.status === "Lose"
                                    ? "inline-block"
                                    : "none",
                              }}
                            >
                              -
                            </span>
                            {trade?.status === "PENDING"
                              ? "PENDING"
                              : Intl.NumberFormat("en-US", {
                                  style: "currency",
                                  currency: user?.currency?.code,
                                  ...(trade?.profitOrLossAmount > 999999
                                    ? { notation: "compact" }
                                    : {}),
                                }).format(trade?.profitOrLossAmount)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  ))
                : <Stack spacing={1} justifyContent={"center"} alignItems={"center"} mt={4}>
                  <XCircle size={52} />
                  <Typography variant="h6">NO TRADE AVAILABLE</Typography>
                  </Stack>}
            </Stack>
          </Stack>
        </Box>
      )}

      <TradeHistoryDrawer
        open={openTradeHistoryDrawer}
        handleClose={handleCloseTradeHistoryDrawer}
        handleOpen={handleOpenTradeHistoryDrawer}
        tradeHistoryDrawerLoader={tradeHistoryDrawerLoader}
        setTradeHistoryDrawerLoader={setTradeHistoryDrawerLoader}
      />
    </>
  );
};

export default TradeHistory;
