import { Box, Grid, Skeleton, Stack, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import DashboardSidebar from "../DashboardSidebar";

const DashboardHomeSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      backgroundColor={colors.dashboardforeground[100]}
      sx={{
        color: "#fff",
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      {size.width > 899 && <DashboardSidebar Skeletonloader={true} />}

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
        {/* Top Tape widget */}
        <Box
          mb={{ xs: 1.5, md: 3 }}
          mt={"-9px"}
          mx={"-10px"}
          borderBottom={"1px solid #111820"}
        >
          <Skeleton variant="rectangular" height={"30px"} />
        </Box>

        {/* Welcome */}
        <Box
          display={"flex"}
          flexDirection={{ xs: "column", lg: "row" }}
          gap={2}
        >
          <Box flex={{ xs: "100%", lg: "75%" }}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"flex-start"}
            >
              {/* Profile Image */}
              <Stack direction={"row"} spacing={1} alignItems={"center"}>
                <Skeleton variant="circular" width={50} height={50} />
                <Stack>
                  <Skeleton
                    variant="text"
                    width={size.width < 355 ? "80px" : "100px"}
                  />

                  <Skeleton variant="text" width={"70px"} />
                </Stack>
              </Stack>

              <Stack direction={"row"} spacing={1.5}>
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

                {size.width > 355 && (
                  <Skeleton
                    variant="rectangular"
                    width={"40px"}
                    height={"40px"}
                    sx={{ borderRadius: "10px" }}
                  />
                )}
              </Stack>
            </Stack>

            <Stack
              mt={{ xs: 1.5, md: 3 }}
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"flex-end"}
            >
              <Stack spacing={4} direction={"row"} width={"100%"} mt={2}>
                <Box>
                  <Stack direction={"row"} alignItems={"center"} spacing={0.7}>
                    <Skeleton variant="text" width="150px" />
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={0.2}
                    ></Stack>
                  </Stack>

                  <Skeleton variant="text" width="200px" />
                  {/* <Skeleton variant="text" width="120px" /> */}
                </Box>
              </Stack>
            </Stack>

            <Box
              sx={{ flexGrow: 1 }}
              mt={3}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]}`
              }
              borderRadius={"10px"}
              display={{ xs: "flex", md: "none" }}
              overflow={"hidden"}
            >
              <Grid
                container
                rowSpacing={3}
                spacing={1.5}
                textAlign={"center"}
                height={"140px"}
              >
                <Skeleton
                  variant="rectangular"
                  width={"100%"}
                  height={"100%"}
                />
              </Grid>
            </Box>

            {/* Crypyo grid */}
            {size.width > 899 && (
              <Stack direction={"row"} spacing={2} mt={5}>
                {[1, 2, 3, 4].map((index) => (
                  <Box
                    key={index}
                    width={"100%"}
                    height={{ xs: "150px", md: "180px" }}
                    backgroundColor={`${colors.dashboardbackground[100]}`}
                    boxShadow={
                      theme.palette.mode === "light" && `${theme.shadows[2]}`
                    }
                    borderRadius={"10px"}
                    overflow={"hidden"}
                  >
                    <Skeleton
                      variant="rectangular"
                      width={"100%"}
                      height={"100%"}
                    />
                  </Box>
                ))}
              </Stack>
            )}
          </Box>

          {size.width > 899 && (
            <Box
              flex={{ xs: "100%", lg: "25%" }}
              height={"360px"}
              width="100%"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]}`
              }
              borderRadius={"10px"}
              // padding={"10px 10px"}
              sx={{ overflowY: "auto" }}
              className="hover123"
            >
              <Skeleton variant="100%" width={"100%"} height={"100%"} />
            </Box>
          )}
        </Box>

        {/* Market Overview */}

        {size.width > 899 && (
          <Box
            display={{ xs: "none", md: "flex" }}
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            mt={{ xs: 2, sm: 2 }}
          >
            <Box
              flex={{ xs: "", md: "75%" }}
              width={"100%"}
              height={"510px"}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]}`
              }
              borderRadius={"10px"}
              display={"flex"}
              flexDirection={"column"}
            >
              <Skeleton variant="100%" width={"100%"} height={"100%"} />
            </Box>
            <Box
              flex={"25%"}
              width={"100%"}
              height={"510px"}
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]}`
              }
              borderRadius={"10px"}
            >
              <Skeleton variant="100%" width={"100%"} height={"100%"} />
            </Box>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default DashboardHomeSkeleton;
