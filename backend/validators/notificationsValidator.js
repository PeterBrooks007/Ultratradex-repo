const { body, validationResult } = require("express-validator");
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");

// Create a DOMPurify instance using jsdom
const window = new JSDOM("").window;
const purify = DOMPurify(window);

// Helper function to decode HTML entities
function decodeEntities(encodedString) {
  const textarea = window.document.createElement("textarea");
  textarea.innerHTML = encodedString;
  return textarea.value;
}

// Validation middleware for addTrade input with messages array
const addNotificationValidator = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .withMessage("userId must be a string")
    .isLength({ max: 254 })
    .withMessage("userId cannot exceed 254 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("userId contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("userId cannot be empty or contain HTML entities")
          )
        : value;
    }),

 

  body("notificationData.title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .isLength({ max: 40 })
    .withMessage("title cannot exceed 40 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error(
          "title contains invalid or malicious content"
        );
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error(
              "title cannot be empty or contain HTML entities"
            )
          )
        : value;
    }),

  body("notificationData.message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message must be a string")
    .isLength({ max: 60 })
    .withMessage("message cannot exceed 60 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("Message contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("Message cannot be empty or contain HTML entities")
          )
        : value;
    }),
];

const adminUpdateUserNotificationValidator = [
  body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .withMessage("userId must be a string")
    .isLength({ max: 254 })
    .withMessage("userId cannot exceed 254 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("userId contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("userId cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("notificationData.notificationId")
    .notEmpty()
    .withMessage("notificationId is required")
    .isString()
    .withMessage("notificationId must be a string")
    .isLength({ max: 254 })
    .withMessage("notificationId cannot exceed 254 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("notificationId contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("notificationId cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("notificationData.title")
    .notEmpty()
    .withMessage("title is required")
    .isString()
    .withMessage("title must be a string")
    .isLength({ max: 40 })
    .withMessage("title cannot exceed 40 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error(
          "title contains invalid or malicious content"
        );
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error(
              "title cannot be empty or contain HTML entities"
            )
          )
        : value;
    }),

  body("notificationData.message")
    .notEmpty()
    .withMessage("message is required")
    .isString()
    .withMessage("message must be a string")
    .isLength({ max: 60 })
    .withMessage("message cannot exceed 60 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("Message contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("Message cannot be empty or contain HTML entities")
          )
        : value;
    }),

];

// Export the validation middleware
module.exports = {
  addNotificationValidator,
  adminUpdateUserNotificationValidator,
};
