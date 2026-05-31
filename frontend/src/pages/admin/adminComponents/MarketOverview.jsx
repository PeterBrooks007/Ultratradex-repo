import AdvanceChartWidget from '../../../components/TradeviewWidgets/AdvanceChartWidget'
import { Box, FormControl, FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, Stack, Typography, useMediaQuery, useTheme } from '@mui/material'
import { tokens } from '../../../theme';

const MarketOverview = () => {

    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const isMobile = useMediaQuery("(max-width: 900px)");


  return (
    <Box
    flex={{ xs: "", md: "75%" }}
    width={"100%"}
    height={{xs:"550px", sm: "510px"}}
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
          alignItems={"center"}
        >
          {/* <Box display={{ xs: "none", md: "flex" }}>
            <RadioGroup
              row
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value="btc"
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
          </Box> */}

          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="demo-simple-select-label">
                Intervals
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                size="small"
                value={1}
                label="Intervals"
                onChange={() => {}}
                inputProps={{
                  sx: {
                    padding: "5px",
                  },
                }}
              >
                <MenuItem value={1}>1 Minute</MenuItem>
                <MenuItem value={"D"}>1 Hour</MenuItem>
                <MenuItem value={60}>1 Day</MenuItem>
                <MenuItem value={"w"}>7 day</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Stack>
      </Stack>
    </Stack>

    <Box
      padding={{xs: "10px 5px 5px 5px",sm:"10px 15px"}}
      // flex={}
      overflow={"hidden"}
      height={{xs:"540px", sm: "500px"}}
    >
      <AdvanceChartWidget />
    </Box>
  </Box>
  )
}

export default MarketOverview