import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Calculator } from "@phosphor-icons/react";
import { tokens } from "../../../theme";

const QuickTrade = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <Box
      flex={"25%"}
      width={"100%"}
      height={"510px"}
      backgroundColor={`${colors.dashboardbackground[100]}`}
      boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
      borderRadius={"10px"}
      padding={"10px 15px"}
    >
      <Stack spacing={2} justifyContent={"space-between"}>
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          pb={1}
        >
          <Box>
            <Typography variant={isMobile ? "body1" : "h6"}>
              Quick Trade
            </Typography>
            <Typography variant="caption">place a quick trade</Typography>
          </Box>
        </Stack>
      </Stack>
    </Box>
  );
};

export default QuickTrade;
