import React, { useContext } from "react";
import {
  Box,
  Button,
  Checkbox,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Calculator } from "@phosphor-icons/react";

const MarketTrade = () => {
  const theme = useTheme();

  const ShortScreen = useMediaQuery("(max-height: 899px)");

  return (
    <>
      <Stack spacing={1} mt={1}>
        <Stack spacing={0.5}>
          <InputLabel htmlFor="my-input">Price</InputLabel>
          <OutlinedInput size="small" placeholder="Enter Price " />
        </Stack>

        <Stack direction={"row"}>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input">Units</InputLabel>
            <OutlinedInput
              value={0}
              size="small"
              endAdornment={
                <InputAdornment position="end" sx={{ marginRight: "-10px" }}>
                  <IconButton>
                    <Calculator />
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "10px 0px 0px 10px",
                },
              }}
            />
          </Stack>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input">Risk</InputLabel>
            <OutlinedInput
              size="small"
              placeholder="Risk  "
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "0px 0px 0px 0px",
                },
              }}
            />
          </Stack>
          <Stack spacing={0.5}>
            <InputLabel htmlFor="my-input">%Risk</InputLabel>
            <OutlinedInput
              size="small"
              placeholder="Risk %"
              sx={{
                "& .MuiOutlinedInput-notchedOutline": {
                  borderRadius: "0px 10px 10px 0px",
                },
              }}
            />
          </Stack>
        </Stack>
      </Stack>

      <Box
        mx={"-15px"}
        mt={2}
        borderBottom={
          theme.palette.mode === "light"
            ? "2px solid rgba(47,49,58,0.3)"
            : "2px solid rgba(47,49,58,1)"
        }
      ></Box>

      <Stack mt={0.5} direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"}>
          <Checkbox
            checked={false}
            onChange={() => {}}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ marginLeft: "-10px" }}
          />
          <Typography variant="subtitle2">Take Profit</Typography>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"start"}
          alignItems={"center"}
          mr={"5px"}
        >
          <Checkbox
            checked={false}
            onChange={() => {}}
            inputProps={{ "aria-label": "controlled" }}
            sx={{ marginLeft: "-10px" }}
          />
          <Typography variant="subtitle2">Stop Loss</Typography>
        </Stack>
      </Stack>

      <Stack direction={"row"} spacing={2}>
        <Box
          border={
            theme.palette.mode === "light"
              ? "1px solid rgba(47,49,58,0.5)"
              : "1px solid rgba(47,49,58,1)"
          }
          borderRadius={"5px"}
        >
          <Input
            value=""
            placeholder="75"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:after": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
            }}
          />
          <Input
            value=""
            placeholder="220.01"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:after": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
            }}
          />
          <Input
            value=""
            placeholder="2000"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:after": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
            }}
          />
          <Input
            value=""
            placeholder="0.00"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
            }}
          />
        </Box>

        <Stack justifyContent={"space-around"} textAlign={"center"}>
          <Typography>Ticks</Typography>
          <Typography>Price</Typography>
          <Typography>Money</Typography>
          <Typography>%</Typography>
        </Stack>

        <Box
          border={
            theme.palette.mode === "light"
              ? "1px solid rgba(47,49,58,0.5)"
              : "1px solid rgba(47,49,58,1)"
          }
          borderRadius={"5px"}
        >
          <Input
            value=""
            placeholder="75"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:after": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
            }}
          />
          <Input
            value=""
            placeholder="220.01"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:after": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
            }}
          />
          <Input
            value=""
            placeholder="2000"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:after": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderColor:
                  theme.palette.mode === "light"
                    ? "rgba(47,49,58,0.5)"
                    : "rgba(47,49,58,1)",
              },
            }}
          />
          <Input
            value=""
            placeholder="0.00"
            fullWidth
            sx={{
              px: "10px",
              borderBottom: "none",
              "&:before": {
                borderBottom: "none",
              },
              "&:after": {
                borderBottom: "none",
              },
              "&:hover:not(.Mui-disabled):before": {
                borderBottom: "none",
              },
            }}
          />
        </Box>
      </Stack>

      <Stack direction={"row"} spacing={2} size="large" mt={2}>
        <Button
          fullWidth
          variant="contained"
          sx={{
            fontSize: "18px",
            fontWeight: "500",
            backgroundColor: "#009e4a",
            color: "white",
            padding: "10px",
            "&:hover": {
              backgroundColor: "darkgreen",
            },
          }}
        >
          Buy
        </Button>
        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            fontSize: "18px",
            fontWeight: "500",
            backgroundColor: "#d01725",
            color: "white",
            padding: "10px",
            "&:hover": {
              backgroundColor: "darkred",
            },
          }}
        >
          Sell
        </Button>
      </Stack>

      <Stack mt={1} spacing={0.5}>
        <InputLabel htmlFor="my-input">Expire Time</InputLabel>
        <OutlinedInput value={""} placeholder="Expire Time" size="small" />
      </Stack>

    

      <Box display={ShortScreen ? "none" : ""} px={"15px"}>
        <Box
          mx={"-15px"}
          mt={2}
          borderBottom={
            theme.palette.mode === "light"
              ? "2px solid rgba(47,49,58,0.3)"
              : "2px solid rgba(47,49,58,1)"
          }
        ></Box>

        <Stack spacing={1} mt={0.5}>
          <Typography variant="subtitle1" fontWeight={"bold"}>
            Order Info
          </Typography>
          <Stack direction={"row"} justifyContent={"space-between"}>
            <Stack justifyContent={"space-between"}>
              <Typography variant="subtitle2">Symbol</Typography>
              <Typography variant="subtitle2">Price</Typography>
              <Typography variant="subtitle2">Amount</Typography>
            </Stack>
            <Stack justifyContent={"space-between"}>
              <Typography variant="subtitle2">Buy BTCUSDT</Typography>
              <Typography variant="subtitle2">435665</Typography>
              <Typography variant="subtitle2">2000</Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>
    </>
  );
};

export default MarketTrade;
