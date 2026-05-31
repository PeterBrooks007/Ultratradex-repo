import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import referralImg from "../../../assets/referral2.jpg";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import referImage from "./../../../assets/refer.jpg";
import { useState } from "react";

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData("Frozen yoghurt", 159, 6.0, 24, 4.0),
  createData("Ice cream sandwich", 237, 9.0, 37, 4.3),
  createData("Eclair", 262, 16.0, 24, 6.0),
  createData("Cupcake", 305, 3.7, 67, 4.3),
  createData("Gingerbread", 356, 16.0, 49, 3.9),
];

const ReferralSystem = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const elevation = theme.palette.mode === "light" ? 1 : 0;
  const size = UseWindowSize();


    // Function to handle copy referral Link

    const [tooltipOpenLink, setTooltipOpenLink] = useState(false);
    const [tooltipOpenLinkmobile, setTooltipOpenLinkmobile

    ] = useState(false);
  

  const handleCopyReferralLink = (text) => {
   navigator.clipboard.writeText(text);
   setTooltipOpenLink(true); // Show tooltip
   setTimeout(() => setTooltipOpenLink(false), 1500); // Hide tooltip after 1.5 seconds
 };

  const handleCopyReferralLinkMobile = (text) => {
   navigator.clipboard.writeText(text);
   setTooltipOpenLinkmobile(true); // Show tooltip
   setTimeout(() => setTooltipOpenLinkmobile(false), 1500); // Hide tooltip after 1.5 seconds
 };

  return (
    <Stack spacing={{ xs: 2, md: 4 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={"center"}
        component={Paper}
        p={2}
        elevation={elevation}
        backgroundColor={`${colors.dashboardbackground[100]}`}
      >
        <Card sx={{ maxWidth: { xs: 400, sm: 345 }, backgroundColor: colors.dashboardbackground[100] }}>
          <CardActionArea disableRipple>
            <CardMedia
              component="img"
              height="140"
              image={referImage}
              alt="refer-image"
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Refer and Earn
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Refer People to our platform and Earn up to $10,000 from all
                your refer
              </Typography>

              <Stack
                direction={"row"}
                spacing={1}
                mt={2}
                display={{ xs: "flex", sm: "none" }}
              >
                <TextField
                  value={
                    "http://ultratradex.io/auth/register"
                  }
                  sx={{ width: `${size.width < 400 ? "170px" : "240px"}` }}
                />
                 <Tooltip
              title="Referral Link Copied!"
              open={tooltipOpenLinkmobile}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              arrow
              placement="top"
            >
                <Button
                  variant="contained"
                  sx={{ fontWeight: "bold" }}
                  color="secondary"
                  onClick={() =>
                    handleCopyReferralLinkMobile("http://ultratradex.io/auth/register")
                  }
                >
                  Copy Link
                </Button>
                </Tooltip>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>

        <Divider flexItem sx={{ display: { xs: "none", sm: "flex" } }} />

        <Stack
          spacing={2}
          p={{ xs: "0 10px 0 10px", md: 0 }}
          display={{ xs: "none", sm: "flex" }}
        >
          <Typography variant={size.width < 600 ? "h6" : "h5"}>
            Refer People to our platform and Earn up to $10,000
          </Typography>
          <Typography
            variant={size.width < 600 ? "body2" : "h6"}
            color={"orange"}
          >
            Click on Copy Referral Link below to copy Your Referral Link
          </Typography>

          <Stack direction={"row"} spacing={1}>
            <TextField
              value={
                "http://ultratradex.io/auth/register"
              }
              sx={{ width: `${size.width < 400 ? "200px" : "250px"}` }}
            />
            <Tooltip
              title="Referral Link Copied!"
              open={tooltipOpenLink}
              disableFocusListener
              disableHoverListener
              disableTouchListener
              arrow
              placement="top"
            >
            <Button
              variant="contained"
              sx={{ fontWeight: "bold" }}
              color="secondary"
              onClick={() =>
                handleCopyReferralLink("http://ultratradex.io/auth/register")
              }
            >
              Copy Link
            </Button>
           </Tooltip>
          </Stack>
          {/* <Typography variant="subtitle2">
            http://ultratradex.io/register
          </Typography> */}
        </Stack>
      </Stack>

      <Stack
        spacing={1}
        component={Paper}
        p={3}
        elevation={elevation}
        backgroundColor={`${colors.dashboardbackground[100]}`}
      >
        <Typography variant="h5" fontWeight={600} pl={1}>
          Your Referrals
        </Typography>

        <TableContainer component={Paper} sx={{backgroundColor: colors.dashboardbackground[100]}}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right"></TableCell>
                <TableCell align="right">Country</TableCell>
                <TableCell align="right">Phone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <Stack p={2}>
              No Data Available

              </Stack>
              {/* {rows.map((row) => (
                <TableRow
                  key={row.name}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.calories}</TableCell>
                  <TableCell align="right">{row.fat}</TableCell>
                  <TableCell align="right">{row.carbs}</TableCell>
                  <TableCell align="right">{row.protein}</TableCell>
                </TableRow>
              ))} */}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </Stack>
  );
};

export default ReferralSystem;
