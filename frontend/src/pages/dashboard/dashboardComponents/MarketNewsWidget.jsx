import { Box, useTheme } from '@mui/material'
import MarketNewsWidgets from '../../../components/TradeviewWidgets/MarketNewsWidgets'
import { tokens } from '../../../theme';

const MarketNewsWidget = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
  return (
    <Box
    flex={{ xs: "", md: "100%" }}
    width={"100%"}
    height={{ xs: "450px", md: "500px" }}
    backgroundColor={`${colors.dashboardbackground[100]}`}
    boxShadow={
      theme.palette.mode === "light" && `${theme.shadows[2]}`
    }
    borderRadius={"10px"}
  >
    <Box overflow={"hidden"} height={{ xs: "430px", md: "100%" }}>
      <MarketNewsWidgets />
    </Box>
  </Box>
  )
}

export default MarketNewsWidget