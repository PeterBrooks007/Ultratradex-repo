import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { tokens } from "../../../theme";
import TinyLineChart from "./adminCharts/TinyLineChart";

const CryptoBox = ({icon: Icon, title, total }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery("(max-width: 767px)");

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
          

            <Stack>
              <Typography variant={isMobile ? "subtitle1" : "h6"}>
                {title}
              </Typography>
             
            </Stack>
          </Stack>

          {Icon}
        </Stack>

        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"flex-start"}
          spacing={5}
        >
          <Stack spacing={1}>
            <Typography fontSize={{ xs: "20px", md: "40px" }} fontWeight={500}>
              {total}
            </Typography>
          </Stack>

          <Box width={"100%"} height={"70px"}>
            <TinyLineChart />
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default CryptoBox;
