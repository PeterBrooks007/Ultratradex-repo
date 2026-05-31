import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  InputAdornment,
  Modal,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import NftImage1 from "../assets/Ape_Monkey_king_2.jpg";
import NftImage2 from "../assets/Ape_Monkey_king_3.jpg";
import NftImage3 from "../assets/Ape_Monkey_king_4.jpg";
import { useEffect, useState } from "react";
import { CaretLeft, ClockCounterClockwise, MagnifyingGlass, X } from "@phosphor-icons/react";
import UseWindowSize from "../hooks/UseWindowSize";
import { tokens } from "../theme";
import { useDispatch, useSelector } from "react-redux";
import { shortenText } from "../utils";
import { getAllTradingSignals } from "../redux/features/tradingSignals/tradingSignalsSlice";
import DepositDrawer from "./drawers/DepositDrawer";


const AllTraderSignals = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [loading, setLoading] = useState(true);

  const [openSide, setOpenSide] = useState(true);

  const size = UseWindowSize();

  const dispatch = useDispatch()

  const { isLoading, tradingSignals } = useSelector((state) => state.tradingSignals);

  useEffect(() => {
    if (tradingSignals.length === 0) {
      dispatch(getAllTradingSignals());
    }
  }, [dispatch]);


  

  const [selectedSignal, setSelectedSignal] = useState(null);



  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


    // Deposit Drawer

    
    const [depositLoader, setdepositLoader] = useState(false);
  
    const [openDepositDrawer, setOpenDepositDrawer] = useState(false);
   
     const handleOpenDepositDrawer = () => {
       setOpenDepositDrawer(true);
       document.documentElement.style.overflow = "hidden"; // Disables scroll on <html>
     };
   
     const handleCloseDepositDrawer = () => {
       setOpenDepositDrawer(false);
       document.documentElement.style.overflow = ""; // Resets <html> scroll
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
        <>
      <Box
        position={"absolute"}
        sx={{
          width: "100%",
          opacity: !openSide ? 1 : 0,
          visibility: !openSide ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
        
      >
        <Stack direction={"row"} alignItems={"center"} spacing={2}>
        <CaretLeft size={22} onClick={() => setOpenSide(true)} /> 

        <Typography
          variant={size.width < 600 ? "h5" : "h4"}
          fontWeight={800}
        >
          Purchase this Signal
          
        </Typography>
        </Stack>
        <Typography variant="subtitle1" px={1}>
          Make Payment for the purchase of this trading robot
        </Typography>

      </Box>

      <Stack
        mt={1}
        sx={{
          width: "100%",
          opacity: openSide ? 1 : 0,
          visibility: openSide ? "visible" : "hidden",
          transition: "opacity 0.3s ease, visibility 0.3s ease",
        }}
      >
        <Box display={{ xs: "flex", md: "none" }}>
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
          />
        </Box>

        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Typography
          variant={size.width < 600 ? "h5" : "h4"}
          fontWeight={800}
          mt={3}
          px={1}
        >
          Welcome to the Market!
        </Typography>

        <Button variant="contained" startIcon={<ClockCounterClockwise />} size="small">Refresh</Button>
        </Stack>
        <Typography variant="subtitle1" px={1}>
          Purchase various trading signals with 99% winning assurance.
        </Typography>


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
          {tradingSignals &&
            tradingSignals.map((tradingSignal, index) => (
              <>
                <Stack key={tradingSignal?._id}>
                  <Box position={"relative"}>
                    <Stack
                      direction={"row"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      position={"absolute"}
                      top={0}
                      width={"100%"}
                      p={0.5}
                      onClick={() => {
                        setSelectedSignal(tradingSignal);
                        handleOpen(true);
                        
                      }}
                    >
                      <Box
                        sx={{
                          backgroundColor: "rgba(0,0,0, 0.3)",
                          p: "4px 10px",
                        }}
                        borderRadius={"50%"}
                      >
                        {index + 1}
                      </Box>
                      {loading ? (
                        ""
                      ) : (
                        <Button size="small" variant="contained">View</Button>
                      )}
                    </Stack>
                    {loading && (
                      <Skeleton
                        variant="rectangle"
                        height={"100%"}
                        sx={{ borderRadius: "10px" }}
                      />
                    )}
                    <img
                      src={tradingSignal?.photo}
                      alt=""
                      onLoad={() => setLoading(false)}
                      onError={() => setLoading(false)}
                      width={"100%"}
                      style={{ borderRadius: "10px" }}
                    />
                  </Box>
                  <Typography variant="subtitle2" color={"orange"}>
                    {shortenText(tradingSignal?.name, size.width < 600 ? 18 : 30)}
                  </Typography>

                  <Stack direction={"row"} spacing={1}>
                    <Typography fontWeight={"bold"}>
                    {tradingSignal?.dailyTrades}  Daily Trades
                    </Typography>
                  </Stack>
                  <Stack direction={"row"} spacing={1}>
                    <Typography fontWeight={"bold"}>Win Rate:</Typography>
                    <Typography>{tradingSignal?.winRate}</Typography>
                  </Stack>
                  <Typography
                    fontWeight={"bold"}
                    color={"springgreen"}
                    variant="body1"
                  >
                    Price:{" "}
                    {Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      ...(tradingSignal?.price > 99999
                        ? { notation: "compact" }
                        : {}),
                    }).format(tradingSignal?.price)}{" "}
                  </Typography>
                </Stack>
              </>
            ))}
        </Box>
      </Stack>



      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "100%",
            maxWidth: {xs: "95%", sm: "60%" , md: 450},
            maxHeight: "100%",
            overflow: "auto",
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            borderRadius:"10px",
            p: 2,
           
          }}
        >
          <Stack>
            <Box position={"relative"} border={"1px solid grey"} borderRadius={"10px"} overflow={"hidden"}>
              <Stack position={"absolute"} bottom={0} left={0} backgroundColor="black" p={"4px 8px"} >
              <Typography
              sx={{ whiteSpace: "nowrap", textOverflow: "ellipsis" }}
              variant="h5"
              fontWeight={700}
              color={"white"}
            >
              {selectedSignal?.name}
            </Typography>
              </Stack>
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
                {loading ? (
                  ""
                ) : (
                  <Button
                    variant="contained"
                    sx={{ backgroundColor: "green", color: "white" }}
                    onClick={() => {
                      handleClose();

                      setdepositLoader(true);
                        handleOpenDepositDrawer();
                    
                    
                      // Set a delay before setting openSide to false
                      // setTimeout(() => {
                      //   setOpenSide(false);
                      // }, 200); // Delay in milliseconds (500ms = 0.5 seconds)
                    }}
                  >
                    Buy Now
                  </Button>
                )}
                <Box
                  sx={{
                    backgroundColor: "grey",
                    p: "3px 4px 0px 4px",
                    cursor: "pointer",
                    color: "white"
                  }}
                  borderRadius={"50%"}
                  onClick={handleClose}
                >
                  <X size={28} />
                </Box>
              </Stack>
              {/* {loading && (
                        <Skeleton
                          variant="rectangle"
                          height={"100%"}
                          sx={{ borderRadius: "10px" }}
                        />
                      )} */}
              <Box height={{xs:"320px", sm: "450px", md: "420px"}}>
                <img
                  src={selectedSignal?.photo}
                  alt=""
                  onLoad={() => setLoading(false)}
                  onError={() => setLoading(false)}
                  width={"100%"}
                  height={"100%"}
                  style={{
                    borderRadius: "10px",
                    objectFit: "cover",
                    objectPosition: "top",
                  }}
                />
              </Box>
            </Box>
            
            <Divider />
            
            {/* <Stack mb={1}>
              <Typography variant="h6" sx={{color: "springgreen", fontWeight: 600}}>About this trader</Typography>
            </Stack> */}

            <Divider />
           <Stack spacing={1}>
            <Typography fontWeight={"bold"} mt={1} variant="h6" color={"springgreen"}>
             
              Price: { Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    ...(selectedSignal?.price > 999999
                      ? { notation: "compact" }
                      : {}),
                  }).format(selectedSignal?.price)}
            </Typography>

            
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Win rate:</Typography>
                <Typography> {selectedSignal?.winRate}</Typography>
              </Stack>
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Profit Share</Typography>
                <Typography>{selectedSignal?.dailyTrades}</Typography>
              </Stack>
              <Divider />
              <Stack direction={"row"} spacing={1}>
                <Typography fontWeight={"bold"}>Info: {selectedSignal?.comment}</Typography>
               
              </Stack>
            
            </Stack>
          </Stack>
          
        </Box>
      </Modal>

      
      <DepositDrawer
        open={openDepositDrawer}
        handleClose={handleCloseDepositDrawer}
        handleOpen={handleOpenDepositDrawer}
        depositLoader={depositLoader}
        setdepositLoader={setdepositLoader}
      />
      </>
      )}
    </>
  );
};

export default AllTraderSignals;
