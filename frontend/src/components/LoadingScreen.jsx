import * as React from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function LoadingScreen() {
  
  const [open] = React.useState(true);
  return (
    <div>
      {/* <Button onClick={handleOpen}>Show backdrop</Button> */}
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1, backgroundColor: "black" }}
        open={open}
      >
        <CircularProgress color="inherit" />
        {/* loading... */}
      </Backdrop>
    </div>
  );
}