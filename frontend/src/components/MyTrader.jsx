import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import NftImage1 from "../assets/Ape_Monkey_king_2.jpg";
import NftImage2 from "../assets/Ape_Monkey_king_3.jpg";
import NftImage3 from "../assets/Ape_Monkey_king_4.jpg";
import { useEffect, useState } from "react";
import { ClockCounterClockwise, ListDashes, MagnifyingGlass, XCircle } from "@phosphor-icons/react";
import UseWindowSize from "../hooks/UseWindowSize";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllExpertTraders,
  getMyExpertTrader,
  removeMyExpertTrader,
} from "../redux/features/expertTraders/expertTradersSlice";
import { shortenText } from "../utils";
const MyTrader = () => {
  const [loading, setLoading] = useState(true);

  const size = UseWindowSize();

  const dispatch = useDispatch();

  const { isLoading, myExpertTraders } = useSelector(
    (state) => state.expertTraders
  );

  useEffect(() => {
    if (myExpertTraders.length === 0) {
      dispatch(getMyExpertTrader());
    }
  }, [dispatch]);

  const [expertTradersList, setExpertTradersList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllCoins = Array.isArray(expertTradersList)
    ? expertTradersList.filter(
        (expertTraders) =>
          expertTraders.firstname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTraders.lastname
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          expertTraders.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (myExpertTraders.length !== 0) {
      setExpertTradersList(myExpertTraders);
    }
  }, [myExpertTraders]);

  const handleRemoveTrader = (id) => {
    dispatch(removeMyExpertTrader(id));
    // console.log({id})
  };

  return (
    <>
      {isLoading ? (
        <Stack
          justifyContent={"center"}
          alignItems={"center"}
          height={size.height - 100}
        >
          <CircularProgress />
        </Stack>
      ) : (
        <Stack mt={1}>
          <Box display={{ xs: "flex", md: "flex" }}>
            <TextField
              label="Search"
              variant="outlined"
              fullWidth
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton aria-label="calculator" edge="end">
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
          </Box>

          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Stack>
              <Typography
                variant={size.width < 600 ? "h5" : "h4"}
                fontWeight={800}
                mt={3}
                px={1}
              >
                My Traders
              </Typography>
              <Typography variant="subtitle2" px={1}>
                List of all my traders
              </Typography>
            </Stack>

            <Button
              variant="contained"
              size="small"
              startIcon={<ClockCounterClockwise size={20} />}
              onClick={() => dispatch(getMyExpertTrader())}
            >
              Refresh
            </Button>
          </Stack>

          {myExpertTraders.length < 1 ? (
            <Stack mt={2} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No Trader Available</Typography>
            </Stack>
          ) : (
            <>
              <Box
                mt={2}
                display={"flex"}
                gap={2}
                rowGap={{ xs: 1, sm: 24, md: 5 }}
                flexWrap={"wrap"}
                justifyContent={"center"}
                sx={{
                  "& > div": {
                    width: { xs: "47%", md: "230px" },
                    height: "330px",
                    backgroundColor: "transparent",
                  },
                }}
              >
                {myExpertTraders &&
                  filteredAllCoins.map((experttrader, index) => (
                    <>
                      <Stack key={experttrader?._id} mb={{ xs: 0, md: 5 }}>
                        <Box position={"relative"}>
                          <Stack
                            direction={"row"}
                            justifyContent={"space-between"}
                            alignItems={"flex-start"}
                            position={"absolute"}
                            top={0}
                            width={"100%"}
                            height={"220px"}
                            p={0.5}
                          >
                             <Box
                            sx={{
                              backgroundColor: "rgba(0,0,0, 0.3)",
                              p: "1px 8px",
                              color: "white"
                            }}
                            borderRadius={"50%"}
                          >
                           {index + 1}
                          </Box>
                            {loading ? (
                              ""
                            ) : (
                              <Button
                                variant="contained"
                                sx={{
                                  backgroundColor: "green",
                                  color: "white",
                                }}
                                onClick={() =>
                                  handleRemoveTrader(experttrader?._id)
                                }
                              >
                                Remove
                              </Button>
                            )}
                          </Stack>
                          {/* {loading && (
                        <Skeleton
                          variant="rectangle"
                          height={"100%"}
                          sx={{ borderRadius: "10px" }}
                        />
                      )} */}
                          <Box
                            height={{ xs: "180px", sm: "370px", md: "250px" }}
                          >
                            <img
                              src={experttrader?.photo}
                              alt=""
                              onLoad={() => setLoading(false)}
                              onError={() => setLoading(false)}
                              width={"100%"}
                              height={"100%"}
                              style={{
                                borderRadius: "10px",
                                objectFit: "cover",
                                border: "1px solid grey",
                                objectPosition: "top",
                              }}
                            />
                          </Box>
                        </Box>
                        <Typography
                          sx={{
                            whiteSpace: "nowrap",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {experttrader?.firstname} {experttrader?.lastname}
                        </Typography>
                        <Typography fontWeight={"bold"}>
                          {shortenText(
                            experttrader?.email,
                            size.width < 600 ? 16 : 22
                          )}
                        </Typography>
                        <Stack direction={"row"} spacing={1}>
                          <Typography fontWeight={"bold"}>Win rate:</Typography>
                          <Typography> {experttrader?.winRate}</Typography>
                        </Stack>
                        <Stack direction={"row"} spacing={1}>
                          <Typography fontWeight={"bold"}>
                            Profit Share
                          </Typography>
                          <Typography>{experttrader?.profitShare}</Typography>
                        </Stack>
                      </Stack>
                    </>
                  ))}
              </Box>
            </>
          )}
        </Stack>
      )}
    </>
  );
};

export default MyTrader;
