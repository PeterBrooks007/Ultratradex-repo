import { useEffect, useState } from "react";
import { Menu, MenuItem, ProSidebar, SubMenu } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import {
  Avatar,
  Box,
  CircularProgress,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Link } from "react-router-dom";
import {

  Calendar,
  CellSignalFull,
  ChartBar,
  ChartLineUp,
  Cube,
  DownloadSimple,
  EnvelopeSimple,
  Gear,
  HandDeposit,
  House,
  Key,
  LockKey,
  Robot,
  Users,
  UsersFour,
  Wallet,
} from "@phosphor-icons/react";
import { tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";
import logo from "../../assets/favicon_logo.png";
import { useDispatch, useSelector } from "react-redux";
import { getAllAdminTotalCounts } from "../../redux/features/totalCounts/totalCountsSlice";

const Item = ({ title, to, icon, selected, setSelected, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isSmallScreen = useMediaQuery("(max-width:899px)");

  const handleMenuClick = () => {
    if (isSmallScreen) {
      setIsCollapsed(true);
    }
  };

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100], fontSize: "14px" }}
      onClick={() => {
        setSelected(title);
        handleMenuClick();
      }}
      icon={icon}
    >
      {title}
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch()

  const [selected, setSelected] = useState("Dashboard");
  const size = UseWindowSize();

  const { user } = useSelector(
    (state) => state.auth
  );


  const { unreadMessages, totalUsers , isLoading } = useSelector((state) => state.totalCounts);

    
  useEffect(() => {
    if(!totalUsers) {
      dispatch(getAllAdminTotalCounts());
    }
  }, [dispatch, totalUsers]);



  return (
    <>
      <Box
        width={"100%"}
        position={"absolute"}
        backgroundColor="rgba(0, 0, 0, 0.6)"
        height={"100%"}
        zIndex={2}
        // sx={{ display:{ xs: isCollapsed && "none", md: "none" }}}
        sx={{
          width: { xs: isCollapsed ? "0" : "100%", md: "none" },
          transition: "width 0.3s ease-in-out",
          boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
          overflow: "hidden",
          display:{ xs: isCollapsed && "none", md: "none" }
        }}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
       
      </Box>
      <Box
        sx={{
          "& .pro-sidebar-inner": {
            backgroundColor:
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100],
            height: "100vh",
            boxShadow:
              theme.palette.mode === "light"
                ? theme.shadows[5]
                : theme.shadows[5],
          },
          "& .pro-icon-wrapper": {
            backgroundColor: "transparent !important",
          },
          "& .pro-inner-item": {
            padding: "5px 35px 0px 10px !important",
            pb: isCollapsed && "20px !important",
          },
          "& .pro-inner-item:hover": {
            color: ` ${
              theme.palette.mode === "light"
                ? "green !important"
                : "springgreen !important"
            }`,
          },
          "& .pro-menu-item.active": {
            color: ` ${
              theme.palette.mode === "light"
                ? "green !important"
                : "springgreen"
            }`,
            backgroundColor:
              !isCollapsed &&
              ` ${
                theme.palette.mode === "light"
                  ? "rgba(0, 255, 122, 0.1)"
                  : "rgba(0, 255, 127, 0.1)"
              }`,
            borderRadius: "15px",
            pb: 0.5,
          },

          // "& .pro-sidebar.collapsed": {
          //   width:"0 !important",
          //   minWidth: "0 !important",
          //   transition: "width 0.3s ease-in-out"
          // },

          // "& .pro-sidebar.collapsed .pro-sidebar-inner": {
          //   width:"0 !important",
          //   overflow: "hidden",
          //   transition: "width 0.3s ease-in-out"
          // },
        }}
      >
        <ProSidebar
          collapsed={isCollapsed}
          width={isCollapsed ? "0px" : "250px"}
          collapsedWidth={size.width > 899 ? "80px" : "0px"}
        >
          <Menu iconShape="square">
            {/* LOGO AND MENU ICON */}

            <Box
              display="flex"
              justifyContent={isCollapsed ? "center" : "flex-start"}
              alignItems="center"
              width={"100%"}
              margin={isCollapsed ? "10px 0 10px 0px" : "10px 0 15px 32px"}
              color={colors.grey[100]}
              gap={1}
              // ml="15px"
            >
              <Box mr={isCollapsed && "20px"}>
                <img src={logo} width={32} alt="" />
              </Box>

              <Typography
                variant="h5"
                color={colors.grey[100]}
                sx={{ display: isCollapsed && "none" }}
              >
                UltraTradex
              </Typography>
              {/* <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <List size={28} />
                  </IconButton> */}
            </Box>

            <Divider sx={{ display: isCollapsed && "none" }} />

            {/* MENU ITEMS */}
            <Box padding={isCollapsed ? undefined : "5%"}>
              <Item
                title="Dashboard"
                to="/admin"
                icon={<House size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              <Typography
                color={colors.grey[300]}
                sx={{ m: "15px 0 0px 20px" }}
                display={isCollapsed && "none"}
              >
                Clients
              </Typography>

              <Item
                title="All Clients"
                to="all-users"
                icon={<Users size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              <Item
                title="My Calendar"
                to="calendar"
                icon={<Calendar size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              <Typography
                variant="body1"
                color={colors.grey[300]}
                sx={{ m: "15px 0 0px 20px" }}
                display={isCollapsed && "none"}
              >
                MailBox
              </Typography>

              <Stack
                className="pro-menu-item.active"
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Item
                  title={!isCollapsed && "MailBox"}
                  to="mailbox"
                  icon={<EnvelopeSimple size={28} />}
                  selected={selected}
                  setSelected={setSelected}
                  setIsCollapsed={setIsCollapsed}
                />
                <Typography
                  sx={{
                    mr: 1,
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? "rgba(0, 255, 122, 0.1)"
                        : "rgba(0, 255, 127, 0.1)",
                    color:
                      theme.palette.mode === "light" ? "green" : "springgreen",
                    p: "5px 12px",
                    borderRadius: "50%",
                  }}
                  display={isCollapsed && "none"}
                >
                  { isLoading ? <CircularProgress size={10} /> : unreadMessages}
                </Typography>
              </Stack>

              <Typography
                variant="body1"
                color={colors.grey[300]}
                sx={{ m: "15px 0 0px 20px" }}
                display={isCollapsed && "none"}
              >
                Settings
              </Typography>
              <Item
                title="Wallet Address"
                to="wallet-address"
                icon={<Wallet size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              <Item
                title="Expert Trader"
                to="expert-traders"
                icon={<UsersFour size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />
              <Item
                title="Trading Pairs"
                to="trade-settings"
                icon={<ChartBar size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              {/* <Item
                title="Currencies"
                to="currencies-settings"
                icon={<CurrencyCircleDollar size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              /> */}

              <SubMenu
                title={
                  <span
                    style={{
                      color: theme.palette.mode === "light" ? "black" : "white",
                    }}
                  >
                    More Settings
                  </span>
                }
                icon={
                  <Gear
                    size={28}
                    color={theme.palette.mode === "light" ? "black" : "white"}
                  />
                }
              >
                 <Item
                  title="Connect Wallet"
                  to="connect-wallet"
                  icon={<Wallet size={28} />}
                  selected={selected}
                  setSelected={setSelected}
                  setIsCollapsed={setIsCollapsed}
                />
                
                <Item
                  title="Trading Bots"
                  to="trading-bots"
                  icon={<Robot size={28} />}
                  selected={selected}
                  setSelected={setSelected}
                  setIsCollapsed={setIsCollapsed}
                />

                <Item
                  title="Trading Signals"
                  to="trading-signals"
                  icon={<ChartLineUp size={28} />}
                  selected={selected}
                  setSelected={setSelected}
                  setIsCollapsed={setIsCollapsed}
                />
                <Item
                  title="Nft Settings"
                  to="nfts"
                  icon={<Cube size={28} />}
                  selected={selected}
                  setSelected={setSelected}
                  setIsCollapsed={setIsCollapsed}
                />

               
              </SubMenu>

              <Typography
                variant="body1"
                color={colors.grey[300]}
                sx={{ m: "15px 0 0px 20px" }}
                display={isCollapsed && "none"}
              >
                Requests
              </Typography>

              <Item
                title="Deposit Request"
                to="deposit-request"
                icon={<HandDeposit size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              <Item
                title="Withdrawal Request"
                to="withdrawal-request"
                icon={<DownloadSimple size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />

              <Typography
                variant="body1"
                color={colors.grey[300]}
                sx={{ m: "15px 0 0px 20px" }}
                display={isCollapsed && "none"}
              >
                Security
              </Typography>

              <Item
                title="Change Password"
                to="change-password"
                icon={<Key size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />
              <Item
                title="2fa Authentication"
                to="2fa-authentication"
                icon={<LockKey size={28} />}
                selected={selected}
                setSelected={setSelected}
                setIsCollapsed={setIsCollapsed}
              />
            </Box>
          </Menu>

          {/* <Box display={"flex"} justifyContent={"center"} pr={isCollapsed && "20px"} onClick={() => setIsCollapsed(!isCollapsed)}> 
          <IconButton
            sx={{ backgroundColor: "grey", width: "40px", height: "40px" }}
          >
            <CaretRight color="white" />
          </IconButton>
        </Box> */}

          <Stack p={0} mt={2} justifyContent={"center"} alignItems={"center"}>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <Avatar
                src={user?.photo}
                sx={{ width: "50px", height: "50px" }}
              />
              <Stack display={isCollapsed && "none"}>
                <Typography>Admin Account</Typography>
                <Typography variant="caption">
                  {user?.email}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        </ProSidebar>
      </Box>
    </>
  );
};

export default Sidebar;
