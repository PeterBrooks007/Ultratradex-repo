import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { tokens } from "../theme";
import connectWalletImages from "./connectWalletImages";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useDispatch, useSelector } from "react-redux";
import { shortenText } from "../utils";
import { SETSELECTEDWALLETADDRESS } from "../redux/features/walletAddress/walletAddressSlice";

const AllWallets = ({ setSelectedWallet, setWallet }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch()

  const { allWalletAddress } = useSelector((state) => state.walletAddress);

  const sortedAllWallets = allWalletAddress?.slice().sort((a, b) => {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });
  const [searchTerm, setSearchTerm] = useState("");

  const filteredWallets = Array.isArray(sortedAllWallets)
    ? sortedAllWallets.filter((wallet) =>
        wallet.walletName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <>
      <Stack mt={2} mx={1}>
        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton aria-label="search" edge="end">
                  <MagnifyingGlass />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderRadius: "20px",
            },
          }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Stack>

      <Box
        display={"flex"}
        flexWrap={"wrap"}
        p={1}
        mt={2}
        gap={"20px"}
        justifyContent={"center"}
        alignItems={"start"}
        // height={"auto"}
        overflow={"auto"}
      >
        <>
          {filteredWallets.map((wallet) => (
            <Stack
              key={wallet._id}
              flex={"0 0 20%"}
              alignItems={"center"}
              backgroundColor={
                theme.palette.mode === "light"
                  ? "#f2f2f2"
                  : colors.dashboardbackground[100]
              }
              py={1}
              borderRadius={"15px"}
              onClick={() => {
                setSelectedWallet("enteramount");
                setWallet(wallet?.walletName);
                dispatch(SETSELECTEDWALLETADDRESS(wallet));
               
              }}
              sx={{cursor: "pointer"}}
            >
              <Box>
                <img
                  src={wallet.walletPhoto}
                  alt={wallet.walletName}
                  width={"60px"}
                  height={"60px"}
                  style={{ border: "0.1px solid grey", borderRadius: "15px", padding: "4px" }}
                />
              </Box>
              <Typography variant="caption" sx={{ whiteSpace: "nowrap" }}>
                {shortenText(wallet.walletName, 10)}
              </Typography>
            </Stack>
          ))}
        </>
      </Box>
    </>
  );
};

export default AllWallets;
