import { Box, Stack, Typography, useTheme } from "@mui/material";
import LineChartdashboard from "../../../components/charts/LineChart";
import { tokens } from "../../../theme";
import { useSelector } from "react-redux";
import { XCircle } from "@phosphor-icons/react";

const TradeHistoryChart = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const { singleCoinDetails } = useSelector((state) => state.auth);

  const { isSemiLoading, allTrades } = useSelector((state) => state.trades);

  const allTradeFiltered = Array.isArray(allTrades.trades)
  ? [...allTrades.trades]
  : [];


  return (
    <Box
      flex={{ xs: "", md: "65%" }}
      width={"100%"}
      height={"500px"}
      backgroundColor={`${colors.dashboardbackground[100]}`}
      boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
      borderRadius={"10px"}
      padding={"10px 15px"}
      display={{ xs: "none", sm: "block" }}
    >
      <Box>
        <Typography variant="h6">Trade History Chart</Typography>
        <Typography variant="caption">
          Pictorial View of your trade history
        </Typography>
      </Box>
      <Box
        // flex={}
        overflow={"hidden"}
        height={"400px"}
        mt={2}
        ml={"-0px"}
        mr={"-10"}
      >
        {
          allTradeFiltered.length > 2 ?  <LineChartdashboard
          data={allTradeFiltered?.map((trade) => ({
            name: new Date(trade?.createdAt).toLocaleDateString("en-US", {
              day: "numeric",
              month: "short",
            }), // Formats like "7 Dec"
            value: Number(trade?.profitOrLossAmount),
          }))}
          // dataPricePercentage={singleCoinDetails?.price_change_percentage_24h}
        /> : <Stack spacing={1} justifyContent={"center"} alignItems={"center"} mt={4}>
        <XCircle size={52} />
        <Typography variant="h6"> TRADES MUST BE UP TO THREE TO SEE CHART</Typography>
        </Stack>
        }
       
      </Box>
    </Box>
  );
};

export default TradeHistoryChart;
