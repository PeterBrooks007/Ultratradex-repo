import { Box, Grid, Skeleton, Stack, useTheme } from "@mui/material";
import UseWindowSize from "../../../hooks/UseWindowSize";
import { tokens } from "../../../theme";

const AllUsersSkeleton = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize();

  return (
   <Box m={"20px"}>
    <Stack direction={"row"} justifyContent={"space-between"} alignItems={"flex-start"}>
        <Stack>
        <Skeleton variant="text" width={"150px"} height={"50px"} />
        <Skeleton variant="text" width={"250px"} />
        </Stack>

        <Skeleton variant="text" width={"150px"} height={"50px"} sx={{display: {xs: "none", sm: "flex"}}} />

    </Stack>

    {/* <Stack mt={10} direction={"row"} spacing={2}>
        <Skeleton variant="rectangular" width={"400px"} height={"400px"} />
        <Skeleton variant="rectangular" width={"400px"} height={"400px"} />
        <Skeleton variant="rectangular" width={"400px"} height={"400px"} />
        <Skeleton variant="rectangular" width={"400px"} height={"400px"} sx={{display: {xs: "none", xl: "flex"}}} />
    </Stack> */}

    {/* <Grid container spacing={2} columns={12} pt={2} px={1}>
    {[1,2,3,4].map((user) => (
                <Grid item xs={6} md={4} xl={3} key={user?._id}>
                         <Skeleton variant="rectangular" width={"400px"} height={"400px"} />
                </Grid>
              ))}
              </Grid> */}
   </Box>

  );
};

export default AllUsersSkeleton;
