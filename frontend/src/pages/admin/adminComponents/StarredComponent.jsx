import {
  Avatar,
  Box,
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
  adminMarkMailAsReadOnView,
  adminStarredMail,
  getAllMailIsStarred,
  SETSELECTEDMAIL,
} from "../../../redux/features/mailbox/mailboxSlice";

import { FixedSizeList as List } from "react-window";
import ViewMessage from "./ViewMessage";

const SentComponent = ({ toggleDrawer }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch();
  const size = UseWindowSize();

  const [openEdit, setOpenEdit] = useState(false);


  const {isSemiLoading, isLoading, allMailStarred } = useSelector((state) => state.mailbox);

  const [selectedMails, setSelectedMails] = useState([]);

  useEffect(() => {
    if (allMailStarred.length === 0) {
      dispatch(getAllMailIsStarred());
    }
  }, [dispatch]);

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

  const handleDeleteSelectedMails = () => {
    const messageData = {
      messageData: selectedMails,
      from: "starredComponent",
    };

    dispatch(adminDeleteMail({ messageData })); // Send selectedMails with both messageId and userId
    setSelectedMails([]); // Clear selection after deletion
    // console.log("selectedMails", selectedMails);
  };



  const handleMarkasreadOnView = (selectedMail) => {
    const selectmessageData = [
      { messageId: selectedMail._id, userId: selectedMail.userId._id },
    ];

    const messageData = {
      messageData: selectmessageData,
      from: "inboxComponent",
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
      from: "starredComponent",
    };
    // console.log("new data", messageData)

    dispatch(adminStarredMail({ messageData: messageData })); // Send selectedMails
  };

  const isAllSelected = selectedMails.length === allMailStarred.length;

  // Handle master checkbox selection
  const handleSelectAllMails = (e) => {
    if (e.target.checked) {
      // If checked, add all mail IDs with userId to selectedMails
      const allMailData = allMailStarred.map((mail) => ({
        messageId: mail._id,
        userId: mail.userId._id,
      }));
      setSelectedMails(allMailData);
    } else {
      // If unchecked, clear selectedMails
      setSelectedMails([]);
    }
  };

  //start of search mail
  const [allMailSentList, setAllMailSentList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAllMailSent = Array.isArray(allMailSentList)
    ? allMailStarred.filter(
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
    if (allMailStarred.length !== 0) {
      setAllMailSentList(allMailStarred);
    }
  }, [allMailStarred]);

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
   const paginatedMailSent = filteredAllMailSent.slice(
     page * rowsPerPage,
     page * rowsPerPage + rowsPerPage
   );
   //end of pagination




  // Define the row component for each mail item
  const MobileMailRow = ({ index, style, data }) => {
    const message = data[index];
    console.log("Rendering message:", index);
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
      >
        <Avatar src={message?.userId?.photo} alt={message?.userId?.firstname} />
        <Stack justifyContent="space-between" width="100%" spacing={0.5}>
          <Stack direction="row" justifyContent="space-between" width="100%">
            <Typography>
              {message?.userId?.firstname} {message?.userId?.lastname}
            </Typography>
            <Typography variant="body2" >
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
                <Typography variant="body1" >
                  {shortenText(
                    message?.subject,
                    size.width < 355 ? 20 : size.width > 380 ? 35 : 28
                  )}
                </Typography>
              </Stack>
              <Typography
                variant="subtitle2"
                sx={{ hyphens: "auto", wordBreak: "break-word" }}
                
              >
                {shortenText(message?.content, size.width < 355 ? 20 : 28)}
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

<ViewMessage openEdit={openEdit} setOpenEdit={setOpenEdit} from="starredComponent" />



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
            STARRED MESSAGES ({allMailStarred.length})
          </Typography>

          <IconButton
            size={`${size.width < 600 ? "small" : "normal"}`}
            onClick={() => {
              dispatch(getAllMailIsStarred());
            }}
            sx={{ mr: { xs: 0, md: 2 } }}
          >
            {isLoading || isSemiLoading ? (
              <CircularProgress size={size.width > 899 ? 20 :16} />
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
          <Stack mt={2} spacing={3} display={{ xs: "flex", md: "none" }}>
            {filteredAllMailSent && filteredAllMailSent.length > 0 ? (
              <List
                height={size.height - 210} // adjust height as needed
                itemCount={filteredAllMailSent.length}
                itemSize={100} // adjust based on the estimated item height
                width="100%"
                itemData={filteredAllMailSent}
              >
                {MobileMailRow}
              </List>
            ) : (
              <Stack mt={4} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No starred Messages</Typography>
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
            borderBottom={"1px solid grey"}
            borderTop={"1px solid grey"}
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
                  disabled
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteSelectedMails();
                  }}
                  
                >
                  <TrashSimple size={24} />
                </IconButton>
              </Tooltip>

           

              <Tooltip title="Refresh" arrow>
                <IconButton
                  onClick={() => {
                    dispatch(getAllMailIsStarred());
                  }}
                  // disabled={selectedMails.length === 0 && "none"}
                >
                  <ArrowsClockwise size={24} />
                </IconButton>
              </Tooltip>
            </Stack>

            <Stack direction={"row"} spacing={2}>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={filteredAllMailSent.length} // Total count of items
            rowsPerPage={rowsPerPage} // Rows per page
            page={page} // Current page
            onPageChange={handleChangePage} // Handle page change
            onRowsPerPageChange={handleChangeRowsPerPage} // Handle rows per page change
          />
            </Stack>
          </Stack>

          <Stack height={size.height - 160} overflow={"auto"} pb={"200px"}>
            {paginatedMailSent.length !== 0
              ? paginatedMailSent.map((message, index) => (
                  <>
                    <Stack
                      key={message?._id}
                      borderBottom={
                        index !== paginatedMailSent.length - 1
                          ? "1px solid grey"
                          : "none"
                      }
                      direction={"row"}
                      spacing={4}
                      p={"8px 8px"}
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      sx={{ cursor: "pointer" }}
                      onClick={() => {
                        dispatch(SETSELECTEDMAIL(message));
                        setOpenEdit(true);
                        handleMarkasreadOnView(message);

                      }}
                    >
                      <Stack
                        direction={"row"}
                        spacing={0}
                        alignItems={"center"}
                      >
                        <Checkbox
                          checked={selectedMails.some(
                            (mail) => mail.messageId === message?._id
                          )}
                          onClick={(e) => e.stopPropagation()}
                          onChange={() => handleSelectMail(message)}
                        />

                        <Tooltip
                          title={
                            message.isStarred === true
                              ? "Starred"
                              : "Not Starred"
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

                        <Avatar
                          src={message?.userId?.photo}
                          alt={message?.userId?.firstname}
                        />
                        <Typography variant="body1" pl={2} >
                          From: {message?.from }
                        </Typography>
                      </Stack>

                      <Box>
                        <Typography variant="body1">
                          {shortenText(
                            message?.content,
                            size.width < 1400 ? 45 : 70
                          )}
                        </Typography>
                      </Box>

                      <Stack direction={"row"}>
                        <Typography variant="body1">
                          {timeAgo(new Date(message?.createdAt).getTime())}
                        </Typography>
                      </Stack>
                    </Stack>
                  </>
                ))
              : <Stack mt={4} justifyContent={"center"} alignItems={"center"}>
              <XCircle size={70} />
              <Typography variant="h5">No starred Messages</Typography>
            </Stack>}
          </Stack>
        </Stack>
      )}
    </>
  );
};

export default SentComponent;
