import { useMediaQuery, useTheme } from "@mui/material";

import Homedesktop from "./HomeDesktop";
import HomeMobile from "./HomeMobile";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return <>{isMobile ? <HomeMobile /> : <Homedesktop />}</>;
};

export default Home;
