import AdvanceChartWidget from '../../../components/TradeviewWidgets/AdvanceChartWidget'
import { Box, Button, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { tokens } from '../../../theme';
import { Link } from 'react-router-dom';

const MarketOverview = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isMobile = useMediaQuery("(max-width: 900px)");


  return (
    <Box
    flex={{ xs: "", md: "0 0 65%", lg: "0 0 70%", xl: "0 0 75%" }}
    width={"100%"}
    height={{xs:"550px", sm: "auto"}}
    minHeight={"510px"}
    backgroundColor={`${colors.dashboardbackground[100]}`}
    boxShadow={
      theme.palette.mode === "light" && `${theme.shadows[2]}`
    }
    borderRadius={"10px"}
    display={"flex"}
    flexDirection={"column"}
  >
    <Stack p={"10px 15px"}>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Box>
          <Typography variant={isMobile ? "body1" : "h6"}>Market Overview</Typography>
          <Typography variant="caption">
            Pictorial monthly analytics
          </Typography>
        </Box>

        <Stack
          direction={"row"}
          justifyContent={"center"}
          spacing={2}
          alignItems={"flex-start"}
        >
          <Box display={{ xs: "none", md: "flex" }}>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              // value="btc"
              onChange={() => {}}
            >
              <FormControlLabel
                value="btc"
                control={<Radio />}
                label="BTC"
              />
              <FormControlLabel
                value="eth"
                control={<Radio />}
                label="ETH"
              />
              <FormControlLabel
                value="usdt"
                control={<Radio />}
                label="USDT"
              />
              <FormControlLabel
                value="ltc"
                control={<Radio />}
                label="LTC"
              />
              <FormControlLabel
                value="bch"
                control={<Radio />}
                label="BCH"
              />
            </RadioGroup>
          </Box>

          <Box>
            <Link to={"/dashboard/livetrades"}>
            <Button size='small' variant='outlined'>Trade Section</Button>
            </Link>
          </Box>
        </Stack>
      </Stack>
    </Stack>

    <Box
      padding={{xs: "10px 5px 5px 5px",sm:"10px 15px"}}
      // flex={}
      overflow={"hidden"}
      height={{xs:"540px", sm: "100%"}}
    >
      <AdvanceChartWidget />
    </Box>
  </Box>
  )
}

export default MarketOverview