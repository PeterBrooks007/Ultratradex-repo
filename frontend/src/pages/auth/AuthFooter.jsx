import {
  Avatar,
  AvatarGroup,
  Box,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowUpRight } from "@phosphor-icons/react";

const images = [
  {
    name: "Bitcoin",
    url: "https://assets.coingecko.com/coins/images/1/large/bitcoin.png",
  },
  {
    name: "Tether",
    url: "https://assets.coingecko.com/coins/images/325/large/Tether-logo.png",
  },
  {
    name: "USD Coin",
    url: "https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png",
  },
  {
    name: "Binance Coin",
    url: "https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png",
  },
];

const AuthFooter = () => {
  return (
    <Box border={"1px solid green"} mt={2} borderRadius={"20px"}>
      <Stack direction={"row"} justifyContent={"space-between"}>
        <Stack direction={"row"} spacing={0.5} alignItems={"center"}>
          <Box p={1}>
            <AvatarGroup
              sx={{
                "& .MuiAvatar-root": {
                  border: "none", // Removes the border
                },
              }}
            >
              {images.map((image, index) => (
                <Avatar alt="Remy Sharp" key={index} src={image.url} />
              ))}
            </AvatarGroup>
          </Box>

          <Box p={1} color={"white"}>
            <Stack>
              <Typography variant="caption2">Join with 1M+ users</Typography>
              <Typography variant="caption">
                Lets see our happy customer
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Stack p={1} display={{ xs: "none", sm: "flex" }}>
          <IconButton sx={{ border: "1px solid green" }}>
            <ArrowUpRight color="white" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};

export default AuthFooter;
