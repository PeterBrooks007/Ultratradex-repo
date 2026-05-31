import {
  Avatar,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  IconButton,
  InputBase,
  Stack,
  TablePagination,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import {
  ArrowsClockwise,

  EnvelopeSimple,
  Headset,
  ListBullets,
  MagnifyingGlass,
  Star,
  TextIndent,
  TrashSimple,
  XCircle,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { shortenText, timeAgo } from "../../../utils";
import { tokens } from "../../../theme";
import UseWindowSize from "../../../hooks/UseWindowSize";
import {
  adminDeleteMail,
  adminMarkMailAsRead,
  adminMarkMailAsReadOnView,
  adminStarredMail,
  getUserMail,
  SETSELECTEDMAIL,
} from "../../../redux/features/mailbox/mailboxSlice";

import { FixedSizeList as List } from "react-window";

const SpamComponent = ({ setOpenEdit, toggleDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const size = UseWindowSize();

  const {isSemiLoading, isLoading, allMails } = useSelector((state) => state.mailbox);
  const { user } = useSelector((state) => state.auth);


  const [selectedMails, setSelectedMails] = useState([]);

  // console.log(selectedMails)

  const [messages, setMessages] = useState([]);

    // console.log(messages)

    useEffect(() => {
      if (!isLoading && allMails.length !== 0) {
        const allMessages = allMails.reduce((accumulator, mailbox) => {
          // Filter messages where `to` is not "peterbrooks@gmail.com" and map over each to include userId
          const messagesWithUserId = mailbox.messages
            .filter((message) => message.folder === "spam")
            .map((message) => ({
              ...message,
              userId: mailbox.userId, // Add userId to each message
            }));
  
          return accumulator.concat(messagesWithUserId);
        }, []);
  
        // Sort messages by createdAt or any other property
        allMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  
        setMessages(allMessages);
      }
    }, [allMails, isLoading, user?.email]); // Only run when `allMails` or `isLoading` changes
  

  const handleSelectMail = (message) => {
    const { _id: messageId, userId } = message;
    const alreadySelected = selectedMails.find(
      (mail) => mail.messageId === messageId
    );

    if (alreadySelected) {
      // Remove from selection if already selected
      setSelectedMails(
        selectedMails.filter((mail) => mail.messageId !== messageId)
      );
    } else {
      // Add to selection
      setSelectedMails([...selectedMails, { messageId, userId: userId._id }]);
    }
  };

  const messageData = {
    messageData: selectedMails,
    from: "userInboxComponent",
  };

  const handleDeleteSelectedMails = () => {
    dispatch(adminDeleteMail({ messageData })); // Send selectedMails with both messageId and userId
    setSelectedMails([]); // Clear selection after deletion
    // console.log("selectedMails", selectedMails);
  };

  const handleMarkasreadSelectedMails = () => {
    dispatch(adminMarkMailAsRead({ messageData })); // Send selectedMails with both messageId and userId
    setSelectedMails([]); // Clear selection after deletion
    // console.log("selectedMails", selectedMails);
  };

  const handleMarkasreadOnView = (selectedMail) => {
    const selectmessageData = [
      { messageId: selectedMail._id, userId: selectedMail.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: "userInboxComponent",
    };
    // console.log("new data", messageData)

    dispatch(adminMarkMailAsReadOnView({ messageData: messageData })); // Send selectedMails
  };

  const handleAdminStarredMail = (selectedMail) => {
    const selectmessageData = [
      { messageId: selectedMail._id, userId: selectedMail.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: "userInboxComponent",
    };
    // console.log("new data", messageData)

    dispatch(adminStarredMail({ messageData: messageData })); // Send selectedMails
  };

  const isAllSelected = selectedMails.length === messages.length;

  // console.log(isAllSelected);

  // Handle master checkbox selection
  const handleSelectAllMails = (e) => {
    if (e.target.checked) {
      // If checked, add all mail IDs with userId to selectedMails
      const allMailData = messages.map((mail) => ({
        messageId: mail._id,
        userId: mail.userId._id,
      }));
      setSelectedMails(allMailData);
      // console.log(allMailData)
    } else {
      // If unchecked, clear selectedMails
      setSelectedMails([]);
    }
  };


    //start of search mail
  const [allMailInboxList, setAllMailSentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllMailInbox = Array.isArray(allMailInboxList)
    ? messages.filter(
        (mailSent) =>
          mailSent.to.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
          String(mailSent.from)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          String(mailSent.subject)
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim()) ||
          mailSent.content
            .toLowerCase()
            .includes(searchTerm.toLowerCase().trim())
      )
    : [];

  useEffect(() => {
    if (messages.length !== 0) {
      setAllMailSentList(messages);
    }
  }, [messages]);
    //end of search mail


    //start of pagination
   // Define state for pagination
   const [page, setPage] = useState(0);
   const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page
 
   // Handle page change
   const handleChangePage = (event, newPage) => {
     setPage(newPage);
   };
 
   // Handle rows per page change
   const handleChangeRowsPerPage = (event) => {
     setRowsPerPage(parseInt(event.target.value, 10)); // Set rows per page
     setPage(0); // Reset to first page
   };
 
   // Calculate the current data slice
   const paginatedMailInbox = filteredAllMailInbox.slice(
     page * rowsPerPage,
     page * rowsPerPage + rowsPerPage
   );
   //end of pagination







  // Define the row component for each mail item
  const MobileMailRow = ({ index, style, data }) => {
    const message = data[index];
    // console.log("Rendering message:", index);
    return (
      <Stack
        key={message?._id}
        direction="row"
        alignItems="flex-start"
        spacing={1.5}
        style={style} // apply styles from react-window
        onClick={() => {
          setOpenEdit(true);
          dispatch(SETSELECTEDMAIL(message));
          handleMarkasreadOnView(message);
        }}
        // border={"2px solid green"}
      >
        <Avatar sx={{ bgcolor: "orange" }}>
          <Headset weight="bold" size={28} />
        </Avatar>
        <Stack justifyContent="space-between" width="100%" spacing={0.5}>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Typography fontWeight={message?.isRead === false && 700}>
              {shortenText(message?.to, size.width < 355 ? 10 : size.width > 380 ? 18 : 18)}
            </Typography>
            <Typography
              variant="body2"
              
            >
              {timeAgo(new Date(message?.createdAt).getTime())}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-between"
            width="100%"
            alignItems="flex-start"
          >
            <Stack>
              <Stack direction="row" spacing={0.5}>
                <Typography
                  variant="body1"
                  
                >
                  {shortenText(message?.subject, 30)}
                </Typography>
                
              </Stack>
              <Typography
                
                variant="subtitle2"
                sx={{ hyphens: "auto", wordBreak: "break-word" }}
              >
                {shortenText(
                  message?.content,
                  size.width < 355 ? 20 : size.width > 380 ? 35 : 28
                )}
              </Typography>
            </Stack>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleAdminStarredMail(message);
              }}
            >
              {message.isStarred ? (
                <Star size={24} weight="fill" color="gold" />
              ) : (
                <Star size={24} />
              )}
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
    );
  };

  return (
    <>
      <Stack
        height={"50px"}
        backgroundColor={
          theme.palette.mode === "light"
            ? "white"
            : colors.dashboardforeground[100]
        }
        border={
          theme.palette.mode === "light"
            ? "0.5px solid grey"
            : "0.5px solid grey"
        }
        // boxShadow={"0px 0px 10px rgba(0,0,0,0.3)"}
        // m={1.5}
        borderRadius={"10px"}
        alignItems={"center"}
        justifyContent={"space-between"}
        direction={"row"}
        p={1}
        mb={2}
        mt={1}
        mx={{ xs: 0, md: 2 }}
      >
        <TextIndent
          size={30}
          weight="regular"
          onClick={toggleDrawer}
          style={{ display: size.width > 899 && "none" }}
        />

        <Box
          display={"flex"}
          // backgroundColor={colors.primary[400]}
          borderRadius={"3px"}
          flex={1}
          backgroundColor={"transparent"}
        >
          <InputBase
            sx={{ ml: 2, flex: 1 }}
            placeholder="Search in emails"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <IconButton
            size="small"
            type="button"
            sx={{ p: 1, border: "0.5px solid grey" }}
          >
            <MagnifyingGlass />
          </IconButton>
        </Box>
      </Stack>

      <Stack
        ml={{ xs: 0.5, md: 2 }}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"100%"}
        >
          <Typography color={"grey"} variant="body2">
            SPAM MESSAGES ({messages.length})
          </Typography>

          <IconButton
            size={`${size.width < 600 ? "small" : "normal"}`}
            onClick={() => {
              dispatch(getUserMail());
            }}
            sx={{ mr: { xs: 0, md: 2 } }}
          >
            {isLoading || isSemiLoading ? (
              <CircularProgress size={size.width > 899 ? 20 : 16} />
            ) : (
              <ArrowsClockwise
                style={{ display: size.width > 899 && "none" }}
              />
            )}
          </IconButton>
        </Stack>
      </Stack>

      {/* Mobile view */}

      {size.width < 899 &&
        (isLoading ? (
          ""
        ) : (
          <Stack mt={2} spacing={0} display={{ xs: "flex", md: "none" }}>
            {filteredAllMailInbox && filteredAllMailInbox.length > 0 ? (
              <List
                height={size.height - 210} // adjust height as needed
                itemCount={filteredAllMailInbox.length}
                itemSize={100} // adjust based on the estimated item height
                width="100%"
                itemData={filteredAllMailInbox}
              >
                {MobileMailRow}
              </List>
            ) : (
              <Stack mt={4} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No spam Messages</Typography>
            </Stack>
            )}
          </Stack>
        ))}

      {/* Desktop view */}

      {isLoading ? (
        ""
      ) : (
        <Stack mt={2} display={{ xs: "none", md: "flex" }}>
          <Stack
            borderBottom={"0.5px solid grey"}
            borderTop={"0.5px solid grey"}
            direction={"row"}
            spacing={1}
            p={"8px 8px"}
            justifyContent={"space-between"}
            // onClick={() => setOpenEdit(true)}
          >
            <Stack direction={"row"} spacing={1}>
              <Tooltip title="Select" arrow>
                <Checkbox
                  checked={isAllSelected}
                  onChange={handleSelectAllMails}
                />
              </Tooltip>

              <Tooltip title="Delete" arrow>
                <IconButton
                  disabled={selectedMails.length === 0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSelectedMails();
                  }}
                >
                  <TrashSimple size={24} />
                </IconButton>
              </Tooltip>

              {/* <Tooltip title="Mark as read" arrow>
                <IconButton
                  disabled={selectedMails.length === 0 && "none"}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMarkasreadSelectedMails();
                  }}
                >
                  <EnvelopeSimpleOpen size={24} />
                </IconButton>
              </Tooltip> */}

              <Tooltip title="Refresh" arrow>
                <IconButton
                  onClick={() => {
                    dispatch(getUserMail());
                  }}
                  // disabled={selectedMails.length === 0 && "none"}
                >
                  <ArrowsClockwise size={24} />
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack direction={"row"} spacing={2}>
              {/* <Stack
                direction={"row"}
                justifyContent={"center"}
                alignItems={"center"}
                spacing={2}
              >
                <Button startIcon={<ListBullets />} variant="outlined">
                  All{" "}
                </Button>
                <Button startIcon={<EnvelopeSimple />} variant="outlined">
                  Unread
                </Button>
              </Stack> */}

              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredAllMailInbox.length} // Total count of items
                rowsPerPage={rowsPerPage} // Rows per page
                page={page} // Current page
                onPageChange={handleChangePage} // Handle page change
                onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
              />
            </Stack>
          </Stack>

          <Stack height={size.height - 160} overflow={"auto"} pb={"200px"}>
            {paginatedMailInbox.length !== 0
              ? paginatedMailInbox.map((message, index) => (
                  <Stack
                    key={message?._id}
                    borderBottom={
                      index !== paginatedMailInbox.length - 1
                        ? "0.5px solid grey"
                        : "none"
                    }
                    direction={"row"}
                    spacing={4}
                    p={"8px 8px"}
                    justifyContent={"space-between"}
                    alignItems={"center"}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                    onClick={() => {
                      setOpenEdit(true);
                      // console.log("clicked")
                      dispatch(SETSELECTEDMAIL(message));
                      handleMarkasreadOnView(message);
                    }}
                  >
                    <Stack direction={"row"} spacing={0} alignItems={"center"}>
                      <Checkbox
                        checked={selectedMails.some(
                          (mail) => mail.messageId === message?._id
                        )}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => handleSelectMail(message)}
                      />
                      <Tooltip
                        title={
                          message.isStarred === true ? "Starred" : "Not Starred"
                        }
                        arrow
                      >
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent click event from bubbling up
                            handleAdminStarredMail(message);
                          }}
                        >
                          {message.isStarred === true ? (
                            <Star size={24} weight="fill" color="gold" />
                          ) : (
                            <Star size={24} />
                          )}
                        </IconButton>
                      </Tooltip>

                      <Avatar sx={{ bgcolor: "orange" }}>
                        <Headset weight="bold" />
                      </Avatar>
                      <Typography
                        variant="body1"
                        pl={2}
                        fontWeight={message?.isRead === false && 700}
                      >
                        To: {message?.to}
                      </Typography>
                    </Stack>

                    <Box>
                      <Stack
                        direction={"row"}
                        alignItems={"center"}
                        spacing={1}
                      >
                        
                        <Typography
                          variant="body1"
                          
                        >
                          {shortenText(
                            message?.content,
                            size.width < 1400 ? 45 : 70
                          )}
                        </Typography>
                      </Stack>
                    </Box>

                    <Stack direction={"row"}>
                      <Typography
                        variant="body1"
                        
                      >
                        {timeAgo(new Date(message?.createdAt).getTime())}
                      </Typography>
                    </Stack>
                  </Stack>
                ))
              :  <Stack mt={4} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No spam Messages</Typography>
            </Stack>
                }
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default SpamComponent;
