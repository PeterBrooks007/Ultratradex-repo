import { Box, Stack, Typography } from "@mui/material";
import { CryptoImages } from "../../../data";

const CryptoAssets = () => {
  return (
    <Stack spacing={2}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
          <Box>
            <img src={CryptoImages[0].url} width={"40px"} alt="bitcoin" />
          </Box>
          <Stack>
            <Typography variant="caption">Bitcoin</Typography>
            <Typography variant="subtitle2">BTC</Typography>
          </Stack>
        </Stack>

        <Stack textAlign={"right"}>
          <Typography variant="subtitle2">$2,786.00</Typography>
          <Typography variant="caption">0.00767876 BTC</Typography>
        </Stack>
      </Stack>

      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
          <Box>
            <img src={CryptoImages[10].url} width={"40px"} alt="bitcoin" />
          </Box>
          <Stack>
            <Typography variant="caption">Bitcoin</Typography>
            <Typography variant="subtitle2">BTC</Typography>
          </Stack>
        </Stack>

        <Stack textAlign={"right"}>
          <Typography variant="subtitle2">$27,786.00</Typography>
          <Typography variant="caption">0.00767876 BTC</Typography>
        </Stack>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
          <Box>
            <img src={CryptoImages[12].url} width={"40px"} alt="bitcoin" />
          </Box>
          <Stack>
            <Typography variant="caption">Bitcoin</Typography>
            <Typography variant="subtitle2">BTC</Typography>
          </Stack>
        </Stack>

        <Stack textAlign={"right"}>
          <Typography variant="subtitle2">$27,786.00</Typography>
          <Typography variant="caption">0.00767876 BTC</Typography>
        </Stack>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
          <Box>
            <img src={CryptoImages[18].url} width={"40px"} alt="bitcoin" />
          </Box>
          <Stack>
            <Typography variant="caption">Bitcoin</Typography>
            <Typography variant="subtitle2">BTC</Typography>
          </Stack>
        </Stack>

        <Stack textAlign={"right"}>
          <Typography variant="subtitle2">$27,786.00</Typography>
          <Typography variant="caption">0.00767876 BTC</Typography>
        </Stack>
      </Stack>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} alignItems={"center"} spacing={1.5}>
          <Box>
            <img src={CryptoImages[4].url} width={"40px"} alt="bitcoin" />
          </Box>
          <Stack>
            <Typography variant="caption">Bitcoin</Typography>
            <Typography variant="subtitle2">BTC</Typography>
          </Stack>
        </Stack>

        <Stack textAlign={"right"}>
          <Typography variant="subtitle2">$27,786.00</Typography>
          <Typography variant="caption">0.00767876 BTC</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default CryptoAssets;
