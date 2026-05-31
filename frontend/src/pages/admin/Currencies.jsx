import { Box, Button, Paper, Stack } from "@mui/material";
import { useState } from "react";
import Header from "./adminComponents/Header";
import AddExpertTrader from "./adminComponents/drawers/AddExpertTrader";

import CurrenciesTable from "./adminComponents/CurrenciesTable";

const Currencies = () => {
     // EditProfile Drawer
  const [openAddExpertTraderDrawer, setAddExpertTraderDrawer] = useState(false);

  const handleOpenAddExpertTraderDrawer = () => {
    setAddExpertTraderDrawer(true);
  };

  const handleCloseAddExpertTraderDrawer = () => {
    setAddExpertTraderDrawer(false);
  };

  // End EditProfile Drawer
  return (
    <>
    <Box m={"20px"} height={"90vh"} overflowY={"hidden"} pb={5}>
      <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
        <Header
          title={"Currencies"}
          subtitle={"List of all Available Currencies"}
        />

        <Button variant="contained" onClick={handleOpenAddExpertTraderDrawer}>ADD NEW CURRENCY</Button>
      </Stack>

      <Paper sx={{p: 2}}>
        <CurrenciesTable />
      </Paper>
    </Box>


    <AddExpertTrader
        open={openAddExpertTraderDrawer}
        handleClose={handleCloseAddExpertTraderDrawer}
        handleOpen={handleOpenAddExpertTraderDrawer}
        // profile={profile}
        // setProfile={setProfile}
      />
    </>
  );
};

export default Currencies;
