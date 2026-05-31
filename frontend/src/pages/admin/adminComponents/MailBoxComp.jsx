import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  PaperPlaneRight,
  Tray,
  FileText,
  Star,
  WarningCircle,
  Trash,
  CaretLeft,
} from "@phosphor-icons/react";
import UseWindowSize from "../../../hooks/UseWindowSize";
import { useTheme } from "@emotion/react";
import { tokens } from "../../../theme";
import {
  IconButton,
  Typography,
  ClickAwayListener,
  Chip,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import InboxComponent from "./InboxComponent";
import SentComponent from "./SentComponent";
import ComposeComponenet from "./ComposeComponenet";
import StarredComponent from "./StarredComponent";
import DraftComponent from "./DraftComponent";
import SpamComponent from "./SpamComponent";
import TrashComponent from "./TrashComponent";

export default function CustomDrawer() {
  const [open, setOpen] = useState(false);

  const [openEdit, setOpenEdit] = useState(false);

  const [openComposeMessage, setOpenComposeMessage] = useState(false);
  const [composeMessageType, setComposeMessageType] = useState("reply");

  const { allMailInbox } = useSelector((state) => state.mailbox);

  const size = UseWindowSize();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [currentSection, setCurrentSection] = useState(
    window.location.hash || "#inbox"
  );

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentSection(window.location.hash || "#inbox"); // Fallback to '#inbox' if hash is empty
    };

    // Listen for hash changes
    window.addEventListener("hashchange", handleHashChange);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  const toggleDrawer = () => {
    setOpen(!open);
  };


  const unreadMessageCount = allMailInbox.filter((mail) => mail.isRead === false).length;

  const Menu = (
    <List
      sx={{
        width: "100%",
        height: "100%",
        bgcolor:   theme.palette.mode === "light"
          ? "white"
          : colors.dashboardbackground[100],
        zIndex: "1000",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <Box p={2} position={"relative"}>
        <Button
          size="large"
          variant="contained"
          fullWidth
          onClick={() => {
            setOpen(false);
            setOpenEdit(false);
            setOpenComposeMessage(true);
            setComposeMessageType("compose");
          }}
        >
          Compose
        </Button>
      </Box>
      <ListItemButton
        sx={{ borderLeft: currentSection === "#inbox" && "2px solid #009a4c" }}
        onClick={() => {
          window.location.hash = "#inbox";
          setOpen(false);
          setOpenEdit(false);
        }}
      >
        <ListItemIcon >
          <Tray size={24}  />
        </ListItemIcon>
        <ListItemText primary="Inbox" />
        <Typography> <Chip size="small" label={`${unreadMessageCount} New`} sx={{color: "springgreen", fontWeight: "bold", backgroundColor: "rgba(0, 255, 127, 0.1)"}} /></Typography>
      </ListItemButton>

      <ListItemButton
      sx={{ borderLeft: currentSection === "#sent" && "2px solid #009a4c" }}
        onClick={() => {
          window.location.hash = "#sent";
          setOpen(false);
          setOpenEdit(false);
        }}
      >
        <ListItemIcon>
          <PaperPlaneRight size={24} />
        </ListItemIcon>
        <ListItemText primary="Sent" />
      </ListItemButton>

      <ListItemButton
        onClick={() => {
          window.location.hash = "#draft";
          setOpen(false);
          setOpenEdit(false);
        }}
        sx={{
          borderLeft: currentSection === "#draft" && "2px solid #009a4c",
        }}
      >
        <ListItemIcon>
          <FileText size={24} />
        </ListItemIcon>
        <ListItemText primary="Draft" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          window.location.hash = "#starred";
          setOpen(false);
          setOpenEdit(false);
        }}
        sx={{
          borderLeft: currentSection === "#starred" && "2px solid #009a4c",
        }}
      >
        <ListItemIcon>
          <Star size={24} />
        </ListItemIcon>
        <ListItemText primary="Starred" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          window.location.hash = "#spam";
          setOpen(false);
          setOpenEdit(false);
        }}
      >
        <ListItemIcon>
          <WarningCircle size={24} />
        </ListItemIcon>
        <ListItemText primary="Spam" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          window.location.hash = "#trash";
          setOpen(false);
          setOpenEdit(false);
        }}
      >
        <ListItemIcon>
          <Trash size={24} />
        </ListItemIcon>
        <ListItemText primary="Trash" />
      </ListItemButton>
    </List>
  );

  return (
    <>
      <Box
        width={"100%"}
        height={{ xs: size.height, md: "100%" }}
        border={{ xs: "none", md: "1px solid grey" }}
        borderRadius={{ xs: "none", md: "15px" }}
        display={"flex"}
        position={"relative"}
        overflow={"hidden"}
      >
       
        
        <Box
          onClick={() => setOpen(false)}
          backgroundColor="rgba(0, 0, 0, 0.5)"
          position={{ xs: "absolute", md: "absolute" }}
          top={0}
          left={0}
          bottom={0}
          sx={{
            width: { xs: open ? "100%" : "0", md: "none" },
            transition: "width 0.3s ease-in-out",
            boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
            // display:{xs: "flex" , md: "none"}
          }}
          zIndex={1}
        >

           <IconButton
          size="small"
          sx={{
            border: "2px solid white",
            position: "absolute",
            zIndex: 9999,
            ml: "256px",
            mt: "10px",
            color: "white",
            display: {xs: "flex", md: "none"}
          }}
          onClick={() => setOpen(false)}
        >
          <CaretLeft weight="fill" />{" "}
        </IconButton>


        </Box>

        <Box
          // backgroundColor="white"
          bgcolor="background.paper"
          position={{ xs: "absolute", md: "relative" }}
          top={0}
          left={0}
          bottom={0}
          sx={{
            width: { xs: open ? "250px" : "0", md: "250px" },
            transition: "width 0.3s ease-in-out",
            // boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
            overflow: "hidden",
          }}
          borderTop={{xs:"0.5px solid grey", md: "none"}}
          borderRight={ {xs: "none", md: "0.5px solid grey"}}
        >
          {Menu}
        </Box>

        {openComposeMessage && (
          <ClickAwayListener
            onClickAway={() => {
              // console.log("Clicked away");
              setOpenComposeMessage(false);
            }}
          >
            <Box>
              <ComposeComponenet
                openComposeMessage={openComposeMessage}
                setOpenComposeMessage={setOpenComposeMessage}
                composeMessageType={composeMessageType}
              />
            </Box>
          </ClickAwayListener>
        )}

      

        <Box
          flex={"1"}
          backgroundColor={
            theme.palette.mode === "light"
              ? "white"
              : colors.dashboardbackground[100]
          }
          height={"100%"}
          borderTop={{ xs: "0.5px solid grey", md: "none" }}
        >
        

          {/* {currentSection === "#inbox" && ( */}
          <Box
           px={{xs: 2, md: 0}}
            pt={1}
            display={currentSection === "#inbox" ? "block" : "none"}
            
          >
            <InboxComponent openEdit={openEdit} setOpenEdit={setOpenEdit} toggleDrawer={toggleDrawer} />
          </Box>
          {/* )} */}

          {currentSection === "#sent" && (
            <Box
             px={{xs: 2, md: 0}}
              pt={1}
              display={currentSection === "#sent" ? "block" : "none"}
              overflow={"hidden"}
              
            >
              <SentComponent openEdit={openEdit} setOpenEdit={setOpenEdit} toggleDrawer={toggleDrawer} />
            </Box>
           )}

           {currentSection === "#starred" && (
           <Box
             px={{xs: 2, md: 0}}
              pt={1}
              display={currentSection === "#starred" ? "block" : "none"}
              overflow={"hidden"}
              
            >
              <StarredComponent openEdit={openEdit} setOpenEdit={setOpenEdit} toggleDrawer={toggleDrawer} />
            </Box>
           )} 

          {currentSection === "#draft" && (
            <Box
             px={{xs: 2, md: 0}}
              pt={1}
              display={currentSection === "#draft" ? "block" : "none"}
              overflow={"hidden"}
              
            >
              <DraftComponent openEdit={openEdit} setOpenEdit={setOpenEdit} toggleDrawer={toggleDrawer} />
            </Box>
          )} 

          {currentSection === "#spam" && (
            <Box
             px={{xs: 2, md: 0}}
              pt={1}
              display={currentSection === "#spam" ? "block" : "none"}
              overflow={"hidden"}
              
            >
              <SpamComponent openEdit={openEdit} setOpenEdit={setOpenEdit} toggleDrawer={toggleDrawer} />
            </Box>
          )} 

          {currentSection === "#trash" && (
            <Box
             px={{xs: 2, md: 0}}
              pt={1}
              display={currentSection === "#trash" ? "block" : "none"}
              overflow={"hidden"}
              
            >
              <TrashComponent openEdit={openEdit} setOpenEdit={setOpenEdit} toggleDrawer={toggleDrawer} />
            </Box>
          )} 

        </Box>
      </Box>
    </>
  );
}
