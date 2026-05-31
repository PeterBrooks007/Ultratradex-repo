import {
  Box,
  Skeleton,
  Stack,
  useTheme,
} from "@mui/material";

import WalletSidebar from "../WalletSidebar";
import { tokens } from "../../../theme";

const WalletHomeSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      backgroundColor={colors.dashboardbackground[100]}
      boxSizing={"border-box"}
      width={"100%"}
      height={"100vh"}

    >
      <WalletSidebar />

      <Box
        display={"flex"}
        flexDirection={"column"}
        backgroundColor={colors.dashboardforeground[100]}
        boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
        width={"100%"}
        height={"96vh"}
        margin={{ xs: "none", md: "15px 15px 15px 65px" }}
        borderRadius={{ xs: "none", md: "12px" }}
        padding={{ xs: "15px", md: "20px" }}
        overflow={"auto"}
        sx={{ overflowX: "hidden" }}
      >
        <Box
          mb={{ xs: 1.5, md: 3 }}
          mt={"-15px"}
          mx={"-15px"}
          borderBottom={"1px solid #111820"}
        >
          <Skeleton variant="rectangular" height={"30px"} />
        </Box>

        <Box
          display={"flex"}
          flexDirection={{ xs: "column", lg: "row" }}
          // gap={2}
        >
          <Box
            flex={"25%"}
            sx={{ overflowY: "auto", overflowX: "hidden" }}
            mb={{xs: 10, sm: 0}}
          >
            <Stack spacing={2} direction={"column"}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <Skeleton variant="circular" width={50} height={50} />
                  <Stack>
                    <Skeleton variant="text" width={"100px"} />

                    <Skeleton variant="text" width={"70px"} />
                  </Stack>
                </Stack>

                <Stack direction={"row"} spacing={2}>
                  <Skeleton
                    variant="rectangular"
                    width={"40px"}
                    height={"40px"}
                    sx={{ borderRadius: "10px" }}
                  />

                  <Skeleton
                    variant="rectangular"
                    width={"40px"}
                    height={"40px"}
                    sx={{ borderRadius: "10px" }}
                  />

                  <Skeleton
                    variant="rectangular"
                    width={"40px"}
                    height={"40px"}
                    sx={{ borderRadius: "10px" }}
                  />
                </Stack>
              </Stack>

              <Stack spacing={0.5}>
                <Box pl={1}>
                  <Skeleton variant="text" width="200px" />
                </Box>

                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"200px"}
                  sx={{ borderRadius: "15px" }}
                />
              </Stack>

              <Stack p={"15px 0"}>
                <Stack
                  direction={"row"}
                  justifyContent={"space-around"}
                  alignItems={"center"}
                  textAlign={"center"}
                >
                  <Stack spacing={0.5} alignItems={"center"}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Skeleton variant="text" width={"70px"} />
                  </Stack>
                  <Stack spacing={0.5} alignItems={"center"}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Skeleton variant="text" width={"70px"} />
                  </Stack>
                  <Stack spacing={0.5} alignItems={"center"}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Skeleton variant="text" width={"70px"} />
                  </Stack>
                  <Stack spacing={0.5} alignItems={"center"}>
                    <Skeleton variant="circular" width={50} height={50} />
                    <Skeleton variant="text" width={"70px"} />
                  </Stack>
                </Stack>
              </Stack>

              <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"400px"}
                  sx={{ borderRadius: "20px" }}
                />
            </Stack>
          </Box>

          <Box
            flex={"75%"}
            overflow={"hidden"}
            display={{ xs: "none", md: "flex" }}
            pl={"20px"}
            
           
          >
            <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                  sx={{ borderRadius: "20px" }}
                />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default WalletHomeSkeleton;
