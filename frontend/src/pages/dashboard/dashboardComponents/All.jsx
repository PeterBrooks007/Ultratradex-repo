import { Stack, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import AllCryptoAssets from "./AllCryptoAssets";

const All = ({ filteredAllCoins }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Stack spacing={4}>
      <Stack
        backgroundColor={
          theme.palette.mode === "light"
            ? "#f2f2f2"
            : colors.dashboardbackground[100]
        }
        borderRadius={"20px 20px 20px 20px"}
        spacing={2.5}
        px={2}
      >
        <AllCryptoAssets filteredAllCoins={filteredAllCoins} />
      </Stack>
    </Stack>
  );
};

export default All;
