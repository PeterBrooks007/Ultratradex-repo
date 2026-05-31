import CryptoMarketWidget from "./TradeviewWidgets/CryptoMarketWidget";
import { Box, Divider, Stack, Typography, useTheme } from "@mui/material";
import LineChartdashboard from "./charts/LineChart";
import SymbolOverviewWidget from "./TradeviewWidgets/SymbolOverviewWidget";
import { tokens } from "../theme";

export const WalletRight = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  const borderColor = theme.palette.mode === "light" 
    ? "rgba(108, 108, 108, 0.2)" // Light mode border color
    : "rgba(108, 108, 108, 0.5)"; // Dark mode border color

  return (
    <Stack spacing={3} width={"100%"}>
      <Box flex={1}>
       
          <SymbolOverviewWidget />
       
      </Box>

      <Divider />

      <Box flex={1.5}  sx={{ 
          border: `1px solid ${borderColor}`, 
          backgroundColor: colors.dashboardforeground[100],
        }}>
        <CryptoMarketWidget />
      </Box>
    </Stack>
  );
};
