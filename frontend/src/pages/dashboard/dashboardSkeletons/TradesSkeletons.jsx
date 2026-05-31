import { Box,  Divider,  Skeleton, Stack, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { tokens } from "../../../theme";

import UseWindowSize from "../../../hooks/UseWindowSize";
import DashboardSidebar from "../DashboardSidebar";

const TradesSkeletons = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const extraSmallMobile = useMediaQuery("(max-width: 360px)");
  const isMobileShortscreen = useMediaQuery("(max-height: 600px)");
  const size = UseWindowSize();


  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      backgroundColor={colors.dashboardforeground[100]}
      boxSizing={"border-box"}
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      width={"100%"}
    >
      {/* <Stack
        position={"fixed"}
        top={0}
        left={0}
        bottom={0}
        justifyContent={"space-between"}
        width="60px"
        height="100vh"
        padding={"15px 20px 20px 20px"}
        alignItems={"center"}
        display={{ xs: "none", md: "flex" }}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        <Stack p={"10px"} justifyContent={"space-between"} height={"100vh"}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
          <Stack spacing={5}>
            <Skeleton
              variant="rectangular"
              width={40}
              height={200}
              sx={{ borderRadius: "20px" }}
            />
            <Skeleton
              variant="rectangular"
              width={40}
              height={150}
              sx={{ borderRadius: "20px" }}
            />
          </Stack>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="circular" width={40} height={40} />
        </Stack>
      </Stack> */}

      <DashboardSidebar Skeletonloader={true} />
      
      <Box
          display={"flex"}
          backgroundColor={colors.dashboardforeground[100]}
          boxShadow={theme.palette.mode === "light" && `${theme.shadows[2]}`}
          width={"100%"}
          height={"96vh"}
          margin={{ xs: "none", md: "15px 15px 15px 65px" }}
          borderRadius={{ xs: "none", md: "10px" }}
          overflow={"hidden"}
        >
          <Box
            flex={{
              sm: "0 0 60%",
              md: "0 0 60%",
              lg: "0 0 50%",
              xl: "0 0 60%",
            }}
            sx={{ overflow: { xs: "auto", sm: "hidden" } }}
            width={"100%"}
          >

            {/* Advancechart */}
            <Box
              height={{
                xs: `${isMobileShortscreen ? "60%" : "60%"}`,
                sm: "60%",
              }}
              width={"100%"}
              // border={{xs: `${theme.palette.mode === "light"
              //   ? "4px solid rgba(47,49,58,0.3)"
              //   : "4px solid rgba(47,49,58,0.5)"}`, sm: "none"}}
              p={"5px 5px 8px 5px"}
            >
              <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Box>

            <Stack
              display={{ xs: "flex", sm: "none" }}
              direction={"row"}
              justifyContent={"space-between"}
              p={"8px 10px"}
              backgroundColor={colors.dashboardbackground[100]}
              color={
                theme.palette.mode === "light"
                  ? `colors.dashboardbackground[100]`
                  : "#f1f3f8"
              }
              // border={
              //   theme.palette.mode === "light"
              //     ? "2px solid rgba(47,49,58,0.1)"
              //     : "2px solid rgba(47,49,58,1)"
              // }
              borderTop={"none"}
            >

              {/* Buy and sell buttons */}
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Stack>
                  <Skeleton variant="text" width={"150px"} />
                  <Skeleton variant="text" width={"150px"} />
                </Stack>

                <Stack direction={"row"} spacing={1}>
                <Skeleton variant="rectangular" width={extraSmallMobile ?"60px" : "90px"} height={"50px"} sx={{borderRadius: "5px"}} />

                <Skeleton variant="rectangular" width={extraSmallMobile ?"60px" :"90px"} height={"50px"} sx={{borderRadius: "5px"}} />
                  
                </Stack>
              </Stack>
            </Stack>

            <Box
              
              display={{ xs: "block", sm: "none" }}
              overflow={"auto"}
              pb={"120px"}
            >
           
              <Box
                // border={
                //   theme.palette.mode === "light"
                //     ? "2px solid transparent"
                //     : "2px solid rgba(47,49,58,1)"
                // }
              
                backgroundColor={colors.dashboardforeground[100]}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  p={"15px 10px 10px 10px"}
                >
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1}
                    borderRadius={"6px"}
                    p={"2px 2px"}
                    pr={"8px"}
                
                  >
                    
                    {/* Recent trade button */}
                    
                    <Skeleton variant="rectangular" width={"190px"} height={"40px"} sx={{borderRadius: "5px"}} />
                  </Stack>
                  <Stack direction={"row"} justifyContent={"space-between"}>
                  <Skeleton variant="rectangular" width={"70px"} height={"40px"} sx={{borderRadius: "5px"}} />

                  </Stack>
                </Stack>

                 {/* Trade history */}
                <Box
                px={1.5}
                  width={"100%"}
                  overflow={"auto"}
                  borderTop={
                    theme.palette.mode === "light"
                      ? "2px solid rgba(47,49,58,0.1)"
                      : "2px solid rgba(47,49,58,1)"
                  }
                >
                   <Skeleton variant="text" width={"100%"} height={"100px"} sx={{borderRadius: "5px"}} />
                </Box>
              </Box>
            </Box>

            <Box display={{ xs: "none", sm: "block" }}>
              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                p={"2px 20px"}
                // border={
                //   theme.palette.mode === "light"
                //     ? "1px solid rgba(47,49,58,0.4)"
                //     : "1px solid rgba(47,49,58)"
                // }
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={2} p={"8px 0"}>
                  <Typography variant="subtitle2" color={"dodgerblue"}>
                  <Skeleton variant="text" width={"190px"}  />
                  </Typography>

                  <Skeleton variant="rectangular" width={"100px"} height={"30px"} sx={{borderRadius: "5px"}} />

                </Stack>
                <Stack direction={"row"} spacing={2}>
                <Skeleton variant="rectangular" width={"50px"} height={"30px"} sx={{borderRadius: "5px"}} />

                <Skeleton variant="rectangular" width={"50px"} height={"30px"} sx={{borderRadius: "5px"}} />
                </Stack>
              </Stack>

              <Stack
                direction={"row"}
                justifyContent={"space-between"}
                p={"2px 20px"}
                alignItems={"center"}
              >
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                <Skeleton variant="text" width={"220px"}  />
                  
                </Stack>
                <Stack>
                <Skeleton variant="text" width={"170px"}  />
                 <Skeleton variant="text" width={"170px"}  />
                </Stack>
              </Stack>
            </Box>

            <Box display={{ xs: "none", sm: "block" }} height={"100%"}>
              <Box
                // borderBottom={
                //   theme.palette.mode === "light"
                //     ? "2px solid rgba(47,49,58,0.2)"
                //     : "2px solid rgba(47,49,58,1)"
                // }
                margin={"0px 20px"}
                sx={{
                  borderColor: "divider",
                  "& .MuiTab-root": {
                    fontSize: "12px",
                    color: theme.palette.mode === "light" ? "#202020" : "white",
                   
                  },
                  "& .MuiTab-root:first-of-type": {
                    minWidth: 0,
                    paddingLeft: "0px",
                    marginLeft: 0,
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(47,49,58,0.5)"
                        : "",
                  },
                }}
              >
                <Stack direction={"row"} spacing={2}>
                  
                
                  <Skeleton variant="text" width={"120px"} sx={{mr: "10px"}} />
                  <Skeleton variant="text" width={"120px"} sx={{mr: "10px"}} />
                  <Skeleton variant="text" width={"120px"} sx={{mr: "10px"}} />
                  <Skeleton variant="text" width={"120px"} sx={{mr: "10px"}} />
                </Stack>
              </Box>

              <Box
                height={"30%"}
                overflow={"auto"}
                pb={{ xs: "100px", md: "60px" }}
                m={2}
              >
               <Skeleton variant="rectangular" width={"100%"} height={"300px"}  />
              </Box>
            </Box>
          </Box>

          
            <Stack
              flex={{
                sm: "0 0 40%",
                md: "0 0 40%",
                lg: "0 0 25%",
                xl: "0 0 20%",
              }}
              // border={"1px solid rgba(47,49,58,0.5)"}
              sx={{ borderRight: "none" }}
              m={"0px 5px 0 5px"}
              overflow={"hidden"}
              display={{ xs: "none", sm: "block" }}
            >
              <Skeleton variant="rectangular" width={"1100%"} height={"100%"}/>
            </Stack>
         

         
            <Box
              flex={{
                sm: "0 0 25%",
                md: "0 0 25%",
                lg: "0 0 25%",
                xl: "0 0 20%",
              }}
              borderRadius={"0px 15px 15px 0px"}
              border={"1px solid rgba(47,49,58,0.5)"}
              height={"100%"}
              display={{ xs: "none", sm: "none", md: "block" }}
            >
            
            <Skeleton variant="rectangular" width={"100%"} height={"100%"}/>
            
            </Box>
        
        </Box>
      
    </Box>
  );
};

export default TradesSkeletons;
