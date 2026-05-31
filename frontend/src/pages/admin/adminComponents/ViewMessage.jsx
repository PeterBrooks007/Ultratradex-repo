import {
  Avatar,
  Box,
  Button,
  ClickAwayListener,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowBendUpLeft,
  ArrowLeft,
  DotsThreeVertical,
  EnvelopeSimple,
  Headset,
  Star,
  Trash,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { timeAgo } from "../../../utils";
import { useDispatch, useSelector } from "react-redux";
import { tokens } from "../../../theme";
import { adminDeleteMail, adminStarredMail, SETSTARREDMAILQUICKFEEDBACKVIEWMESSAGEADMIN } from "../../../redux/features/mailbox/mailboxSlice";
import ComposeComponenet from "./ComposeComponenet";

const ViewMessage = ({ openEdit, setOpenEdit, from }) => {
  // const [open, setOpen] = useState(false);

  const { selectedMail } = useSelector((state) => state.mailbox);

  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openComposeMessage, setOpenComposeMessage] = useState(false);
  const [composeMessageType, setComposeMessageType] = useState("reply");

  const [ setCurrentSection] = useState(
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

  const handleAdminStarredMail = () => {
    const selectmessageData = [
      { messageId: selectedMail?._id, userId: selectedMail?.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: from,
    };
    // console.log("new data", messageData)

    dispatch(adminStarredMail({ messageData: messageData })); // Send selectedMails
  };

  const selectmessageData = [
    { messageId: selectedMail?._id, userId: selectedMail?.userId._id },
  ];
  
  const messageData = {
    messageData: selectmessageData,
    from: from,
  };

  const handleDeleteSelectedMails = () => {
    dispatch(adminDeleteMail({ messageData }));
    setOpenEdit(false);
    // setSelectedMails([]); // Clear selection after deletion
    // console.log("selectedMails", selectedMails);
  };




  return (
    <>
      <Box
        backgroundColor="background.paper"
        position={"absolute"}
        // borderLeft={{ xs: "none", md: "1px solid grey" }}
        top={0}
        right={0}
        bottom={0}
        sx={{
          width: {
            xs: openEdit ? "100%" : "0",
            md: openEdit ? "calc(100% - 250px)" : "0",
          },
          transition: "width 0.2s ease-in-out",
          // boxShadow: "0px 0px 10px rgba(0,0,0,0.3)",
          overflow: "auto",
          zIndex: "1000",
        }}
      >
        <Box p={1}>
          <Stack
            direction={"row"}
            spacing={2}
            alignItems={"center"}
            position={"sticky"}
            top={0}
            backgroundColor={
              theme.palette.mode === "light"
                ? "#f2f2f2"
                : colors.dashboardbackground[100]
            }
            borderTop={{ xs: "0.5px solid grey", md: "none" }}
            m={-1}
            zIndex={"1000"}
            p={0.5}
            borderBottom={"0.5px solid grey"}
          >
            <IconButton onClick={() => setOpenEdit(false)}>
              <ArrowLeft />
            </IconButton>
            <Typography>
              {selectedMail?.userId?.firstname +
                " " +
                selectedMail?.userId?.lastname}
            </Typography>
          </Stack>

          <Stack
            mt={1}
            borderBottom={"0.5px solid grey"}
            // borderTop={"1px solid grey"}
            direction={"row"}
            spacing={1}
            p={"8px 8px"}
            justifyContent={"space-between"}
            alignItems={"center"}
            //   onClick={() => setOpenEdit(true)}
          >
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <Trash size={28} onClick={() => {
                setOpenEdit(false);
                handleDeleteSelectedMails();
              }} style={{display: window.location.hash === "#starred" && "none"}} />
              <EnvelopeSimple size={28} />
              {/* <Folder size={28} /> */}
            </Stack>
            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              <IconButton
                onClick={async (e) => {
                  e.stopPropagation(); // Prevent click event from bubbling up
                  dispatch(SETSTARREDMAILQUICKFEEDBACKVIEWMESSAGEADMIN());
                  await handleAdminStarredMail();
                  // setOpenEdit(false);
                }}
              >
                {selectedMail?.isStarred === true ? (
                  <Star size={28} weight="fill" color="gold" />
                ) : (
                  <Star size={28} />
                )}
              </IconButton>
              <DotsThreeVertical size={28} />
            </Stack>
          </Stack>

          <Stack>
            <Stack
              backgroundColor="green"
              m={{ xs: "20px 8px", md: 5 }}
              p={2}
              borderRadius={"10px"}
              color={"white"}
            >
              <Stack
                direction={"row"}
                alignItems={"flex-start"}
                spacing={1.5}
                //   onClick={() => setOpenEdit(true)}
              >
                <Avatar sx={{ bgcolor: "orange" }}>
                  <Headset weight="bold" />
                </Avatar>
                <Stack
                  justifyContent={"space-between"}
                  width={"100%"}
                  spacing={0.5}
                >
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    <Typography fontWeight={600}>
                      From: {selectedMail?.from}
                    </Typography>
                    <Typography variant="body1">
                      {timeAgo(new Date(selectedMail?.createdAt).getTime())}
                    </Typography>
                  </Stack>
                  <Stack
                    direction={"row"}
                    justifyContent={"space-between"}
                    width={"100%"}
                  >
                    <Typography variant="body1">
                      {selectedMail?.subject}
                    </Typography>
                    <Tooltip
                      title={
                        selectedMail?.isStarred === true
                          ? "Starred"
                          : "Not Starred"
                      }
                      arrow
                    >
                      <IconButton>
                        {selectedMail?.isStarred === true ? (
                          <Star size={24} weight="fill" color="gold" />
                        ) : (
                          <Star size={24} />
                        )}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Stack>
              </Stack>
              <Divider sx={{ mt: 1, mx: "-15px" }} />

              <Stack spacing={2} mt={2}>
                {selectedMail?.content}
              </Stack>
            </Stack>

            <Button
              startIcon={<ArrowBendUpLeft size={18} />}
              sx={{
                m: { xs: 1, md: 5 },
                mt: -5,
                width: 100,
                borderRadius: "20px",
              }}
              variant="contained"
              onClick={() => {
                setOpenComposeMessage(true);
                setComposeMessageType("reply");
              }}
            >
              Reply
            </Button>
          </Stack>
        </Box>
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

    </>
  );
};

export default ViewMessage;
