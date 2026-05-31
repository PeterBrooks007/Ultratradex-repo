import { Typography, Box, useTheme } from "@mui/material";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";

const Header = ({ title, subtitle }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const size = UseWindowSize()

  return (
    <Box mb={"10px"}>
      <Typography
        variant={size.width > 899 ? "h5" : "h6"}
        color={colors.grey[100]}
        fontWeight={"bold"}
        sx={{ mb: "5px" }}
      >
        {title}
      </Typography>
      <Typography variant={size.width > 899 ? "body1" : "h6"} color={colors.greenAccent[400]} display={size.width > 899 ? "flex" : "none"}>{subtitle}</Typography>
    </Box>
  );
};

export default Header;
