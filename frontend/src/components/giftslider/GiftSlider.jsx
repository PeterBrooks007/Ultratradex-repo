import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import "./GiftSlider.css";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import happyClientImg from "../../assets/happyClientImg.png"
import giftbox from "../../assets/giftbox.png"
import happyTraderimg from "../../assets/happyTraderimg.png"
import UseWindowSize from "../../hooks/UseWindowSize";

const GiftSlider = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const size = UseWindowSize()

  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);

  return (
    <section className="embla">
      <div className="embla__viewport" ref={emblaRef}>
        <div className="embla__container">
          <div
            className="embla__slide"
            style={{ paddingLeft: "5px", paddingRight: "8px" }}
          >
            <Box
              className="embla__slide__content"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]} !important`
              }
            >
              <Box flex={"0 0 70%"} border={"2px solid transparent"}>
              <Typography fontWeight={500}>Earn up to</Typography>
              <Typography variant="h5" fontWeight={500} fontSize={size.width < 400 ? "22px" : "25px"}>$5,000 bonus</Typography>
              <Typography fontWeight={500}>on $2,000 deposit</Typography>
              </Box>

              <Box flex={"0 0 30%"} border={"2px solid transparent"} display={"flex"} justifyContent={"flex-end"}>
              <img src={happyClientImg} alt="happyclient" width={100} />
              </Box>
            </Box>
          </div>
          <div
            className="embla__slide"
            style={{ paddingLeft: "5px", paddingRight: "8px" }}
          >
            <Box
              className="embla__slide__content"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]} !important`
              }
            >
              
              <Box flex={"0 0 70%"} border={"2px solid transparent"}>
              <Typography fontWeight={500}>Earn up to</Typography>
              <Typography variant="h5" fontWeight={500} fontSize={size.width < 400 ? "22px" : "25px"}>10% reward</Typography>
              <Typography fontWeight={500} fontSize={size.width < 400 ? "14px" : "16px"}>on every successful refers</Typography>
              </Box>

              <Box flex={"0 0 30%"} border={"2px solid transparent"} display={"flex"} justifyContent={"flex-end"}>
              <img src={giftbox} alt="giftbox" width={100} />
              </Box>
            </Box>
          </div>
          <div
            className="embla__slide"
            style={{ paddingLeft: "5px", paddingRight: "8px" }}
          >
            <Box
              className="embla__slide__content"
              backgroundColor={`${colors.dashboardbackground[100]}`}
              boxShadow={
                theme.palette.mode === "light" && `${theme.shadows[2]} !important`
              }
            >
             
              <Box flex={"0 0 70%"} border={"2px solid transparent"}>
              <Typography fontWeight={500}>Trade at least</Typography>
              <Typography variant="h5" fontWeight={500} fontSize={size.width < 400 ? "22px" : "25px"}>10 times a month </Typography>
              <Typography fontWeight={500}> to get an extra bonus</Typography>
              </Box>

              <Box flex={"0 0 30%"} border={"2px solid transparent"} display={"flex"} justifyContent={"flex-end"} >
              <img src={happyTraderimg} alt="happyTraderimg" width={130}  />
              </Box>
            </Box>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftSlider;

{
  /* <section className="embla">
//       <div className="embla__viewport" ref={emblaRef}>
//         <div className="embla__container">
//           <div className="embla__slide">
//             Make a minimum deposit of $5,000 and get $2,000 bonus
//           </div>
//           <div className="embla__slide">
//             Earn 5% reward on every successful refers
//           </div>
//           <div className="embla__slide">
//             Trade at least 10 times a month to get an extra bonus
//           </div>
//         </div>
//       </div>
//     </section> */
}
