import Trading from "../Trading";
import { Drawer, Stack, useTheme } from "@mui/material";
import { tokens } from "../../theme";

const TradeDrawer = ({ open, handleClose, handleOpen }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      sx={{
        "& .MuiDrawer-paper": {
          height: "100%",
          backgroundColor: colors.dashboardforeground[100],
        },
      }}
    >
      <Stack
        backgroundColor={colors.dashboardforeground[100]}
        height={"100%"}
        border={"1px solid rgba(47,49,58,0.5)"}
        p={"15px 15px 10px 15px"}
        overflow={"auto"}
        // onClick={handleClose}
      >
        <Trading handleClose={handleClose} drawer={true} />
      </Stack>
    </Drawer>
  );
};

export default TradeDrawer;
