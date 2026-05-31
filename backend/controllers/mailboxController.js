const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const { validationResult } = require("express-validator");
const Mailbox = require("../models/mailboxModel");

//addmail
const addmail = asyncHandler(async (req, res) => {
  const { userId, messages } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }

  await Mailbox.updateOne(
    { userId },
    { $push: { messages: messages } },
    { upsert: true } // Creates a new document if recipient doesn't exist
  );

  if (req.user.role === "admin") {
    const searchWord = "Support Team";

    // Find mailboxes where at least one message has the `to` field NOT containing the searchWord
    const allMailSent = await Mailbox.find({
      messages: {
        $elemMatch: { to: { $ne: searchWord } }, // Use $ne to check for 'not equal'
      },
    }).populate("userId", "_id firstname lastname email photo");

    // Flatten the messages into a single array
    const allMessages = allMailSent.flatMap((mailbox) => {
      return mailbox.messages
        .filter(
          (message) => !message.to.match(new RegExp(searchWord, "i")) // Exclude messages matching the searchWord
        )
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });

    const sortedMessages = allMessages.sort((a, b) => {
      // Sort by isRead status (false first) - convert boolean to number for sorting
      if (a.isRead === b.isRead) {
        // If both have the same isRead status, sort by createdAt date
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // Unread (isRead: false) messages come first
      return a.isRead ? 1 : -1;
    });

    return res.status(200).json({
      data: sortedMessages,
      message: "Message Sent Successfully",
      from: "support",
    });
  }

  const allUserMail = await Mailbox.find({ userId: req.user._id })
    .limit(1)
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  res.status(200).json({
    data: allUserMail,
    message: "Message Sent Successfully",
    from: "user",
  });
});

//getAllMail
const getAllMail = asyncHandler(async (req, res) => {
  const allMail = await Mailbox.find()
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");
  res.status(200).json(allMail);
});

//getAllMailInbox
const getAllMailInbox = asyncHandler(async (req, res) => {
  const searchWord = "Support Team";

  // Find mailboxes where at least one message has the `to` field containing "Finance Department"
  const allMailInbox = await Mailbox.find({
    messages: {
      $elemMatch: { to: { $regex: searchWord, $options: "i" } },
    },
  })
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // Flatten the messages into a single array
  const allMessages = allMailInbox.flatMap((mailbox) => {
    return mailbox.messages
      .filter((message) => message.to.match(new RegExp(searchWord, "i")))
      .map((message) => ({
        ...message.toObject(), // Convert Mongoose message subdocument to plain object
        userId: mailbox.userId, // Add userId to each message
      }));
  });

  const sortedMessages = allMessages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // console.log(filteredMailInbox);

  res.status(200).json(sortedMessages);
});

// getAllMailSent
const getAllMailSent = asyncHandler(async (req, res) => {
  const searchWord = "Support Team";

  // Find mailboxes where at least one message has the `to` field NOT containing the searchWord
  const allMailSent = await Mailbox.find({
    messages: {
      $elemMatch: { to: { $ne: searchWord } }, // Use $ne to check for 'not equal'
    },
  })
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // Flatten the messages into a single array
  const allMessages = allMailSent.flatMap((mailbox) => {
    return mailbox.messages
      .filter(
        (message) => !message.to.match(new RegExp(searchWord, "i")) // Exclude messages matching the searchWord
      )
      .map((message) => ({
        ...message.toObject(), // Convert Mongoose message subdocument to plain object
        userId: mailbox.userId, // Add userId to each message
      }));
  });

  const sortedMessages = allMessages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.status(200).json(sortedMessages); // Return the filtered messages
});

const getAllMailIsStarred = asyncHandler(async (req, res) => {
  // Find all mailboxes where at least one message is starred
  const allMailIsStarred = await Mailbox.find({
    messages: {
      $elemMatch: {
        isStarred: true, // Only starred messages
      },
    },
  })
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");

  // Flatten the messages into a single array and filter only starred messages
  const allMessages = allMailIsStarred.flatMap((mailbox) => {
    return mailbox.messages
      .filter((message) => message.isStarred === true) // Filter to include only starred messages
      .map((message) => ({
        ...message.toObject(), // Convert Mongoose message subdocument to plain object
        userId: mailbox.userId, // Add userId to each message
      }));
  });

  const sortedMessages = allMessages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  res.json(sortedMessages);
});

//getUserMails
const getUserMail = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const allUserMail = await Mailbox.find({ userId })
    .limit(1)
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");
  res.status(200).json(allUserMail);
});

//Admin Get All Users
const getAllUsers = asyncHandler(async (req, res) => {
  const AllUsers = await User.find().sort("-createdAt");
  res.status(200).json(AllUsers);
});

// Admin DeleteMail
const adminDeleteMail = asyncHandler(async (req, res) => {
  const { messageData } = req.body;

  // console.log(req.body)

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }


  if (
    !messageData ||
    !Array.isArray(messageData.messageData) ||
    messageData.messageData.length === 0
  ) {
    res.status(400);
    throw new Error("No message IDs provided yet");
  }

  // Extract all message IDs from the incoming request
  const messageIds = messageData.messageData.map(({ messageId }) => messageId);

  // Find mailboxes containing the messages
  const mailboxes = await Mailbox.find({ "messages._id": { $in: messageIds } });

  if (mailboxes.length === 0) {
    res.status(404);
    throw new Error("Messages not found or messages deleted. refresh list");
  }

  // Prepare delete operations
  const deleteOperations = mailboxes.map((mailbox) => {
    return Mailbox.updateOne(
      { _id: mailbox._id },
      { $pull: { messages: { _id: { $in: messageIds } } } }
    );
  });

  // Run all delete operations in parallel
  const results = await Promise.all(deleteOperations);

  // Check if any messages were deleted
  const deletedMessagesCount = results.reduce(
    (count, result) => count + result.modifiedCount,
    0
  );
  if (deletedMessagesCount === 0) {
    res.status(404);
    throw new Error("No messages found or deleted");
  }

  // Fetch remaining messages, and exclude "Support Team" messages in flatMap

  if (messageData.from === "userInboxComponent") {
    const allUserMail = await Mailbox.find({ userId: req.user._id })
      .limit(1)
      .sort("-createdAt")
      .populate("userId", "_id firstname lastname email photo");
    // Respond with the result
    return res.status(200).json({
      data: allUserMail,
      message: "Messages starred/unstarred successfully",
      // updatedMessages,
      from: "userInboxComponent",
    });
  }

  const allMailInbox = await Mailbox.find()
    .sort("-createdAt") // Sort by creation date
    .populate("userId", "_id firstname lastname email photo"); // Populate user info

  const searchWord = "Support Team";
  let allMessages;

  // Conditional handling based on the source of the request
  if (messageData.from === "sentComponent") {
    // Flatten the messages into a single array excluding "Support Team" messages
    allMessages = allMailInbox.flatMap((mailbox) => {
      return mailbox.messages
        .filter((message) => !message.to.match(new RegExp(searchWord, "i"))) // Exclude messages matching the searchWord
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });
  } else {
    // Flatten the messages into a single array including only "Support Team" messages
    allMessages = allMailInbox.flatMap((mailbox) => {
      return mailbox.messages
        .filter((message) => message.to.match(new RegExp(searchWord, "i"))) // Include messages matching the searchWord
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });
  }

  const sortedMessages = allMessages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Respond with the result
  res.status(200).json({
    data: sortedMessages,
    message: "Messages deleted successfully",
    // deletedMessages: deletedMessagesCount,
    from:
      messageData.from === "sentComponent" ? "sentComponent" : "inboxComponent",
  });
});

// Admin MarkMailAsRead
const adminMarkMailAsRead = asyncHandler(async (req, res) => {
  const { messageData } = req.body;

  if (
    !messageData ||
    !Array.isArray(messageData.messageData) ||
    messageData.messageData.length === 0
  ) {
    res.status(400);
    throw new Error("No message IDs provided yet");
  }

  // Extract message IDs from the messageData
  const messageIds = messageData.messageData.map(({ messageId }) => messageId);

  // Find mailboxes that contain any of the message IDs
  const mailboxes = await Mailbox.find({
    "messages._id": { $in: messageIds },
  });

  // If no mailboxes are found, return a 404 response
  if (!mailboxes || mailboxes.length === 0) {
    return res.status(404).json({ message: "No messages found." });
  }

  // Update each message individually to set isRead to true
  await Promise.all(
    mailboxes.map((mailbox) => {
      return Promise.all(
        messageIds.map((messageId) => {
          return Mailbox.updateOne(
            { _id: mailbox._id, "messages._id": messageId },
            { $set: { "messages.$.isRead": true } }
          );
        })
      );
    })
  );

  // Fetch updated messages
  const updatedMessages = mailboxes.flatMap((mailbox) =>
    mailbox.messages
      .filter((message) => messageIds.includes(message._id.toString()))
      .map((message) => ({
        ...message.toObject(),
        userId: mailbox.userId, // Attach userId from mailbox
      }))
  );

  // Check if any messages were marked as read
  if (updatedMessages.length === 0) {
    return res
      .status(404)
      .json({ message: "No messages were marked as read." });
  }

  // Fetch remaining messages, and exclude "Support Team" messages in flatMap
  const allMailInbox = await Mailbox.find()
    .sort("-createdAt") // Sort by creation date
    .populate("userId", "_id firstname lastname email photo"); // Populate user info

  if (messageData.from === "sentComponent") {
    const searchWord = "Support Team";

    // Flatten the messages into a single array
    const allMessages = allMailInbox.flatMap((mailbox) => {
      return mailbox.messages
        .filter(
          (message) => !message.to.match(new RegExp(searchWord, "i")) // Exclude messages matching the searchWord
        )
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });

    const sortedMessages = allMessages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      data: sortedMessages,
      message: "Messages marked as read successfully",
      // updatedMessages,
      from: "sentComponent",
    });
  }

  if (messageData.from === "userInboxComponent") {
    const allUserMail = await Mailbox.find({ userId: req.user._id })
      .limit(1)
      .sort("-createdAt")
      .populate("userId", "_id firstname lastname email photo");
    // Respond with the result
    return res.status(200).json({
      data: allUserMail,
      message: "Messages marked as read successfully",
      // updatedMessages,
      from: "userInboxComponent",
    });
  }

  const searchWord = "Support Team";

  // Flatten the messages into a single array
  const allMessages = allMailInbox.flatMap((mailbox) => {
    return mailbox.messages
      .filter((message) => message.to.match(new RegExp(searchWord, "i")))
      .map((message) => ({
        ...message.toObject(), // Convert Mongoose message subdocument to plain object
        userId: mailbox.userId, // Add userId to each message
      }));
  });

  const sortedMessages = allMessages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Respond with the result
  res.status(200).json({
    data: sortedMessages,
    message: "Messages marked as read successfully",
    updatedMessages,
    from: "inboxComponent",
  });
});

// Admin starredMail
const adminStarredMail = asyncHandler(async (req, res) => {
  const { messageData } = req.body;
  // console.log(req.body);

    const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // console.log(errors.array()); // Log all errors for debugging
    res.status(400);
    throw new Error(errors.array()[0].msg);
  }



  if (
    !messageData ||
    !Array.isArray(messageData.messageData) ||
    messageData.messageData.length === 0
  ) {
    res.status(400);
    throw new Error("No message IDs provided yet");
  }

  if (messageData.from === "userInboxComponent") {
    // Map through message objects and prepare toggle-starred operations
    const toggleStarredOperations = messageData.messageData.map(
      async ({ messageId }) => {
        // Find the mailbox containing the message ID
        const mailbox = await Mailbox.findOne({ "messages._id": messageId });
        if (!mailbox) return null; // Skip if no mailbox found for this message ID

        // Find the message within the mailbox
        const message = mailbox.messages.id(messageId);
        if (!message) return null;

        // Toggle the isUserStarred value
        const result = await Mailbox.updateOne(
          { "messages._id": messageId },
          { $set: { "messages.$.isUserStarred": !message.isUserStarred } }
        );

        // Return the result if the message was modified
        return result.modifiedCount
          ? { userId: mailbox.userId, messageId, isStarred: !message.isStarred }
          : null;
      }
    );

    // Run all toggle-starred operations in parallel
    const updatedMessages = (await Promise.all(toggleStarredOperations)).filter(
      Boolean
    );

    // Check if any messages were updated
    if (updatedMessages.length === 0) {
      res.status(404);
      throw new Error("No messages found or updated");
    }

    const allUserMail = await Mailbox.find({ userId: req.user._id })
      .limit(1)
      .sort("-createdAt")
      .populate("userId", "_id firstname lastname email photo");
    // Respond with the result
    return res.status(200).json({
      data: allUserMail,
      message: "Messages starred/unstarred successfully",
      // updatedMessages,
      from: "userInboxComponent",
    });
  }



  // Map through message objects and prepare toggle-starred operations
  const toggleStarredOperations = messageData.messageData.map(
    async ({ messageId }) => {
      // Find the mailbox containing the message ID
      const mailbox = await Mailbox.findOne({ "messages._id": messageId });
      if (!mailbox) return null; // Skip if no mailbox found for this message ID

      // Find the message within the mailbox
      const message = mailbox.messages.id(messageId);
      if (!message) return null;

      // Toggle the isStarred value
      const result = await Mailbox.updateOne(
        { "messages._id": messageId },
        { $set: { "messages.$.isStarred": !message.isStarred } }
      );

      // Return the result if the message was modified
      return result.modifiedCount
        ? { userId: mailbox.userId, messageId, isStarred: !message.isStarred }
        : null;
    }
  );

  // Run all toggle-starred operations in parallel
  const updatedMessages = (await Promise.all(toggleStarredOperations)).filter(
    Boolean
  );

  // Check if any messages were updated
  if (updatedMessages.length === 0) {
    res.status(404);
    throw new Error("No messages found or updated");
  }

  // Fetch all messages
  const allMail = await Mailbox.find()
    .sort("-createdAt") // Sort by creation date
    .populate("userId", "_id firstname lastname email photo"); // Populate user info

  // send back starred message also
  const allMessagesStarred = allMail.flatMap((mailbox) => {
    return mailbox.messages
      .filter((message) => message.isStarred === true) // Filter to include only starred messages
      .map((message) => ({
        ...message.toObject(), // Convert Mongoose message subdocument to plain object
        userId: mailbox.userId, // Add userId to each message
      }));
  });

  const sortedMessagesStarred = allMessagesStarred.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (messageData.from === "sentComponent") {
    const searchWord = "Support Team";

    // Flatten the messages into a single array
    const allMessages = allMail.flatMap((mailbox) => {
      return mailbox.messages
        .filter(
          (message) => !message.to.match(new RegExp(searchWord, "i")) // Exclude messages matching the searchWord
        )
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });

    const sortedMessages = allMessages.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      data: sortedMessages,
      messagesStarred: sortedMessagesStarred,
      message: "Messages starred/unstarred successfully",
      // updatedMessages,
      from: "sentComponent",
    });
  }

  if (messageData.from === "starredComponent") {
    const searchWord = "Support Team";

    const allMessagesInbox = allMail.flatMap((mailbox) => {
      return mailbox.messages
        .filter(
          (message) => message.to.match(new RegExp(searchWord, "i")) // Exclude messages matching the searchWord
        )
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });

    const sortedMessagesInbox = allMessagesInbox.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    const allMessagesSent = allMail.flatMap((mailbox) => {
      return mailbox.messages
        .filter(
          (message) => !message.to.match(new RegExp(searchWord, "i")) // Exclude messages matching the searchWord
        )
        .map((message) => ({
          ...message.toObject(), // Convert Mongoose message subdocument to plain object
          userId: mailbox.userId, // Add userId to each message
        }));
    });

    const sortedMessagesSent = allMessagesSent.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    return res.status(200).json({
      MessageStarred: sortedMessagesStarred,
      messagesInbox: sortedMessagesInbox,
      messagesSent: sortedMessagesSent,
      message: "Messages starred/unstarred successfully",
      // updatedMessages,
      from: "starredComponent",
    });
  }

  const searchWord = "Support Team";
  // Flatten the messages into a single array
  const allMessages = allMail.flatMap((mailbox) => {
    return mailbox.messages
      .filter((message) => message.to.match(new RegExp(searchWord, "i")))
      .map((message) => ({
        ...message.toObject(), // Convert Mongoose message subdocument to plain object
        userId: mailbox.userId, // Add userId to each message
      }));
  });

  const sortedMessages = allMessages.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  // Respond with the result
  res.status(200).json({
    data: sortedMessages,
    messagesStarred: sortedMessagesStarred,
    message: "Messages starred/unstarred successfully",
    // updatedMessages,
    from: "inboxComponent",
  });
});

// User Delete Mail
const userDeleteMail = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { userData } = req.body; // Array of message IDs to delete

  // Delete messages with IDs in the userData array
  const deletedMail = await Mailbox.updateOne(
    { userId: userId },
    { $pull: { messages: { _id: { $in: userData } } } }
  );

  if (!deletedMail) {
    res.status(404);
    throw new Error("Mail not found or no messages deleted");
  }

  const allUserMail = await Mailbox.find({ userId })
    .limit(1)
    .sort("-createdAt")
    .populate("userId", "_id firstname lastname email photo");
  res.status(200).json(allUserMail);
});

module.exports = {
  addmail,
  getAllMail,
  getAllMailInbox,
  getAllMailSent,
  getUserMail,
  getAllUsers,
  adminDeleteMail,
  adminMarkMailAsRead,
  adminStarredMail,
  getAllMailIsStarred,

  userDeleteMail,
};
