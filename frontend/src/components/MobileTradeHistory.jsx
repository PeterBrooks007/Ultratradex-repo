import { Box, Button, IconButton, Stack, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery,useTheme } from '@mui/material'
import { CaretDown } from '@phosphor-icons/react'
import { useContext } from 'react'
import { ColorModeContext, tokens } from '../theme';



const data = [
    {
      type: "CRYPTO",
      action: "SELL",
      symbol: "BTCUSDT",
      units: "10unit(s)",
      color: "red",
    },
    {
      type: "FOREX",
      action: "BUY",
      symbol: "EURUSD",
      units: "2unit(s)",
      color: "#009e4a",
    },
    {
      type: "STOCK",
      action: "SELL",
      symbol: "AAAL",
      units: "50unit(s)",
      color: "red",
    },
    {
      type: "FOREX",
      action: "BUY",
      symbol: "EURUSD",
      units: "2unit(s)",
      color: "#009e4a",
    },
    {
      type: "STOCK",
      action: "SELL",
      symbol: "AAAL",
      units: "50unit(s)",
      color: "red",
    },
    {
      type: "FOREX",
      action: "BUY",
      symbol: "EURUSD",
      units: "2unit(s)",
      color: "#009e4a",
    },
  ];
  

const MobileTradeHistory = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);
    const colorMode = useContext(ColorModeContext);

    const extraSmallMobile = useMediaQuery("(max-width: 360px)");
    const isMobileShortscreen = useMediaQuery("(max-height: 600px)");
    // const isSmallMobileScreen = useMediaQuery("(max-width: 395px)");
  
  return (
    <Box
          height={{ xs: `${isMobileShortscreen ? "50%" : "40%"}` }}
          display={{ xs: "block", sm: "none" }}
          overflow={"auto"}
          pb={"140px"}
        >
          {/* <Divider sx={{backgroundColor: "red", mx: "-10px", mt: "0px"}} /> */}

          <Box
            border={
              theme.palette.mode === "light"
                ? "2px solid transparent"
                : "2px solid rgba(47,49,58,1)"
            }
            borderTop={"none"}
            // borderBottom={"none"}
            backgroundColor={colors.dashboardbackground[100]}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              p={"15px 10px 10px 10px"}
            >
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={1}
                borderRadius={"6px"}
                p={"2px 2px"}
                pr={"8px"}
                border={"2px solid #009e4a"}
                // bgcolor={`${theme.palette.mode === "light"
                //   ? " rgba(47,49,58,0.1)"
                //   : "rgba(47,49,58,1)"}`}
              >
                <Button
                  size="small"
                  variant="contained"
                  sx={{
                    fontSize: `${extraSmallMobile && "10px"}`,
                    // fontWeight: "bold",
                    textTransform: "capitalize",
                    py: "8px",
                    // px: "18px",
                    bgcolor: `${
                      theme.palette.mode === "light" ? "#009e4a" : "#009e4a"
                    }`,
                    // bgcolor: `${theme.palette.mode === "light"
                    // ? "rgba(11,18,20,0.9)"
                    // : "#111820"}`,
                    color: `${
                      theme.palette.mode === "light" ? "white" : "white"
                    }`,
                    boxShadow: "none",

                    // borderRadius: "6px"
                  }}
                >
                  Recent Trades
                </Button>

                <Button
                  size="small"
                  sx={{
                    fontSize: `${extraSmallMobile && "10px"}`,
                    // fontWeight: "bold",
                    textTransform: "capitalize",
                    color: `${
                      theme.palette.mode === "light" ? "black" : "#f1f3f8"
                    }`,
                  }}
                >
                  Order Book
                </Button>
              </Stack>
              <Stack direction={"row"} justifyContent={"space-between"}>
                <Button
                  // variant="outlined"
                  sx={{
                    borderRadius: "6px",
                    fontSize: `${extraSmallMobile && "12px"}`,
                    // fontWeight: "bold",
                    py: "5px",
                    textTransform: "capitalize",
                    color:
                      theme.palette.mode === "light"
                        ? `colors.dashboardbackground[100]`
                        : "#f1f3f8",
                    //   border: `${theme.palette.mode === "light"
                    // ? "2px solid rgba(11,18,20,0.5)"
                    // : "2px solid rgba(47,49,58,1)"}`,
                  }}
                >
                  All Trades
                </Button>

                <IconButton sx={{ border: "2px solid #009e4a" }} size="small">
                  <CaretDown size={28} />
                </IconButton>
              </Stack>
            </Stack>

            {/* <Divider
            sx={{
              border:
                theme.palette.mode === "light"
                  ? "2px solid rgba(47,49,58,0.5)"
                  : "2px solid rgba(47,49,58,1)",
            }}
          /> */}

            <Box
              width={"100%"}
              overflow={"auto"}
              borderTop={
                theme.palette.mode === "light"
                  ? "4px solid rgba(47,49,58,0.1)"
                  : "4px solid rgba(47,49,58,1)"
              }
            >
              <Table size="small" aria-label="a dense table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      EXCHANGE
                    </TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      TYPE
                    </TableCell>
                    <TableCell align="left" sx={{ fontWeight: "bold" }}>
                      SYMBOLS
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold" }}>
                      UNIT(s)
                    </TableCell>
                    {/* <TableCell align="center">
                    DATE
                  </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{
                        "&:nth-of-type(odd)": {
                          backgroundColor:
                            theme.palette.mode === "light"
                              ? "rgba(0,0,0,0.05)"
                              : "rgba(47,49,58,0.5)",
                        },
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell align="left" sx={{ fontWeight: "500" }}>
                        {row.type}
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        scope="row"
                        sx={{ color: row.color, fontWeight: "500" }}
                      >
                        {row.action}
                      </TableCell>
                      <TableCell
                        component="th"
                        align="left"
                        scope="row"
                        sx={{ color: row.color, fontWeight: "500" }}
                      >
                        {row.symbol}
                      </TableCell>
                      <TableCell align="center" sx={{ fontWeight: "500" }}>
                        {row.units}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Box>
        </Box>
  )
}

export default MobileTradeHistory