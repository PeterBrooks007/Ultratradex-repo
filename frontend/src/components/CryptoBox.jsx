import {
  Box,
  IconButton,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens } from "../theme";
import { ArrowDownLeft, ArrowUpRight } from "@phosphor-icons/react";
import TinyLineChart from "./charts/TinyLineChart";
import { useSelector } from "react-redux";

const CryptoBox = ({ data }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery("(max-width: 767px)");
  const { user, conversionRate } = useSelector((state) => state.auth);

  return (
    <Box
      width={"100%"}
      height={{ xs: "140px", md: "170px" }}
      backgroundColor={`${colors.dashboardbackground[100]}`}
      boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
      borderRadius={"10px"}
      padding={"10px 20px"}
    >
      <Stack height={"100%"} spacing={1.5}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <Stack
            direction={"row"}
            spacing={{ xs: 0.7, md: 1.5 }}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <img
              src={data?.image}
              width={isMobile ? "30px" : "45px"}
              height={isMobile ? "30px" : "45px"}
              alt=""
              style={{borderRadius: "50%"}}
            />

            <Stack>
              <Typography variant={isMobile ? "subtitle1" : "h6"}>
                {data?.symbol.toUpperCase()}
              </Typography>
              <Typography
                variant={isMobile ? "caption" : "subtitle1"}
                mt={"-7px"}
              >
                {data?.name}
              </Typography>
            </Stack>
          </Stack>

          <IconButton
            sx={{
              backgroundColor:
                data?.price_change_percentage_24h < 0 ? "#d01725" : "#009a4c",
              color: "white",
              width: isMobile ? "30px" : "45px",
              height: isMobile ? "30px" : "45px",
            }}
          >
            {data?.price_change_percentage_24h < 0 ? (
              <ArrowDownLeft sx={{ fontSize: { xs: "20px", md: "30px" } }} />
            ) : (
              <ArrowUpRight sx={{ fontSize: { xs: "20px", md: "30px" } }} />
            )}
          </IconButton>
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
          spacing={2}
        >
          <Stack spacing={1}>
            <Typography fontSize={{ xs: "20px", md: "30px" }} fontWeight={500}>
              {conversionRate?.rate
                ? Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: conversionRate?.code,
                    ...(data?.current_price * conversionRate?.rate > 999
                      ? { notation: "compact" }
                      : {}),
                  }).format(data?.current_price * conversionRate?.rate)
                : Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: user?.currency?.code,
                    ...(data?.current_price > 999
                      ? { notation: "compact" }
                      : {}),
                  }).format(data?.current_price)}
            </Typography>
            <Typography
              variant="caption"
              color={
                data?.price_change_percentage_24h < 0 ? "red" : "#009a4c"
              }
            >
              {Number(data?.price_change_percentage_24h).toFixed(2)}%
            </Typography>
          </Stack>

          <Box width={"100%"} height={"70px"}>
            <TinyLineChart
              data={data?.sparkline_in_7d.price.map((price, i) => ({
                name: i,
                value: price,
              }))}
              dataPricePercentage={data?.price_change_percentage_24h}
            />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CryptoBox;
