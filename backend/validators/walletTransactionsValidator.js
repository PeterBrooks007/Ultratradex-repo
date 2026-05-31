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
const addTransactionValidator = [
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

  body("transactionData.typeOfTransaction")
    .notEmpty()
    .withMessage("typeOfTransaction is required")
    .isString()
    .withMessage("typeOfTransaction must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error(
          "typeOfTransaction contains invalid or malicious content"
        );
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error(
              "typeOfTransaction cannot be empty or contain HTML entities"
            )
          )
        : value;
    }),

  body("transactionData.method")
    .notEmpty()
    .withMessage("method: is required")
    .isString()
    .withMessage("method: must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("method: contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("method: cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.methodIcon")
    .notEmpty()
    .withMessage("method: is required")
    .isString()
    .withMessage("method: must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("method: contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("method: cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.symbol")
    .notEmpty()
    .withMessage("symbol is required")
    .isString()
    .withMessage("symbol must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("symbol contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("symbol cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.amount")
    .isFloat()
    .withMessage("amount must be a valid number")
    .notEmpty()
    .withMessage("amount is required"),

  body("transactionData.amountFiat")
    .isFloat()
    .withMessage("amountFiat must be a valid number")
    .notEmpty()
    .withMessage("amountFiat is required"),

  body("transactionData.walletAddress")
    .notEmpty()
    .withMessage("walletAddress is required")
    .isString()
    .withMessage("walletAddress must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("walletAddress contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("walletAddress cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 254 })
    .withMessage("description cannot exceed 254 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("description contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("description cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.status")
    .notEmpty()
    .withMessage("status is required")
    .isString()
    .withMessage("status must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("status contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("status cannot be empty or contain HTML entities")
          )
        : value;
    }),
];

const adminUpdateUserWalletTransactionValidator = [
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

  body("transactionData.transactionId")
    .notEmpty()
    .withMessage("transactionId is required")
    .isString()
    .withMessage("transactionId must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("transactionId contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("transactionId cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.typeOfTransaction")
    .notEmpty()
    .withMessage("typeOfTransaction is required")
    .isString()
    .withMessage("typeOfTransaction must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error(
          "typeOfTransaction contains invalid or malicious content"
        );
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error(
              "typeOfTransaction cannot be empty or contain HTML entities"
            )
          )
        : value;
    }),

  body("transactionData.walletAddress")
    .notEmpty()
    .withMessage("walletAddress is required")
    .isString()
    .withMessage("walletAddress must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("walletAddress contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("walletAddress cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.amount")
    .isFloat()
    .withMessage("amount must be a valid number")
    .notEmpty()
    .withMessage("amount is required"),

  body("transactionData.createdAt")
    .notEmpty()
    .withMessage("createdAt is required")
    .isISO8601()
    .withMessage("createdAt must be a valid ISO 8601 date")
    .toDate() // Converts the string to a JavaScript Date object
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("createdAt contains invalid or malicious content");
      }

      if (isNaN(new Date(value).getTime())) {
        throw new Error("createdAt must be a valid date");
      }

      return value.trim() === ""
        ? Promise.reject(
            new Error("createdAt cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.description")
    .notEmpty()
    .withMessage("description is required")
    .isString()
    .withMessage("description must be a string")
    .isLength({ max: 254 })
    .withMessage("description cannot exceed 254 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("description contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("description cannot be empty or contain HTML entities")
          )
        : value;
    }),

  body("transactionData.status")
    .notEmpty()
    .withMessage("status is required")
    .isString()
    .withMessage("status must be a string")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);

      if (sanitizedValue !== decodedValue) {
        throw new Error("status contains invalid or malicious content");
      }
      return value.trim() === ""
        ? Promise.reject(
            new Error("status cannot be empty or contain HTML entities")
          )
        : value;
    }),
];

// Export the validation middleware
module.exports = {
  addTransactionValidator,
  adminUpdateUserWalletTransactionValidator,
};
