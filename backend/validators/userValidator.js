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


//Validation middleware for adminUpdateUser input
const adminUpdateUserValidator = [
  // body('userData')
  //   .notEmpty().withMessage('Please fill in the required fields'),

  body('firstname')
    // .notEmpty().withMessage('First name is required')
    .isString().withMessage("Firstname must be a string")
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 50 }).withMessage('First name cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('First name contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('First name cannot be empty or contain HTML entities')) : value;
    }),

  body('lastname')
    // .notEmpty().withMessage('Last name is required')
    .isString().withMessage("Lastname must be a string")
  //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
    .isLength({ max: 50 }).withMessage('Last name cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('Lastname contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('Lastname cannot be empty or contain HTML entities')) : value;
    }),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isString().withMessage("Email must be a string")
    .isEmail().withMessage('Email is not valid')
    .isLength({ max: 100 }).withMessage('Email cannot exceed 100 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('Email contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('Email cannot be empty or contain HTML entities')) : value;
    }),

  body('phone')
    .notEmpty().withMessage('phone is required')
    .isString().withMessage("phone must be a string")
    .isLength({ max: 50 }).withMessage('phone cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
      if (sanitizedValue !== decodedValue) {
        throw new Error('phone contains invalid or malicious content');
      }
  
      return value.trim() === '' ? 
        Promise.reject(new Error('phone cannot be empty or contain HTML entities')) : value;
    }),
  // Validation for address.address
    body('address.address')
    .notEmpty().withMessage('Address is required')
    .isString().withMessage("Address must be a string")
    .isLength({ max: 500 }).withMessage('Address cannot exceed 500 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);
      if (sanitizedValue !== decodedValue) {
        throw new Error('Address contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('Address cannot be empty or contain HTML entities')) : value;
    }),

  // Validation for address.state
  body('address.state')
    .notEmpty().withMessage('State is required')
    .isString().withMessage("State must be a string")
    .isLength({ max: 50 }).withMessage('State cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);
      if (sanitizedValue !== decodedValue) {
        throw new Error('State contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('State cannot be empty or contain HTML entities')) : value;
    }),

  // Validation for address.country
  body('address.country')
    .notEmpty().withMessage('Country is required')
    .isString().withMessage("Country must be a string")
    .isLength({ max: 50 }).withMessage('Country cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);
      if (sanitizedValue !== decodedValue) {
        throw new Error('Country contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('Country cannot be empty or contain HTML entities')) : value;
    }),

  body('balance')
  .isFloat().withMessage('Trade Balance must be a valid number')
  .notEmpty().withMessage('Trade Balance is required'),

  body('demoBalance')
  .isFloat().withMessage('Demo Balance must be a valid number')
  .notEmpty().withMessage('Demo Balance is required'),

  body('earnedTotal')
  .isFloat().withMessage('Earned Total must be a valid number')
  .notEmpty().withMessage('Earned Total is required'),

  body('totalDeposit')
  .isFloat().withMessage('Total Deposit must be a valid number')
  .notEmpty().withMessage('Total Deposit is required'),

  body('referralBonus')
  .isFloat().withMessage('referral Bonus must be a valid number')
  .notEmpty().withMessage('referral Bonus is required'),

  body('totalWithdrew')
  .isFloat().withMessage('total Withdrew must be a valid number')
  .notEmpty().withMessage('total Withdrew is required'),

  body('package')
  .notEmpty().withMessage('package is required')
  .isString().withMessage("package must be a string")
  .isLength({ max: 50 }).withMessage('package cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('package contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('package cannot be empty or contain HTML entities')) : value;
  }),

  body('pin')
  .isFloat().withMessage('pin must be a valid number')
  .notEmpty().withMessage('pin is required'),


  body('role')
  .notEmpty().withMessage('role is required')
  .isString().withMessage("role must be a string")
  .isLength({ max: 50 }).withMessage('role cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('role contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('role cannot be empty or contain HTML entities')) : value;
  }),

  body('accounttype')
  .notEmpty().withMessage('accounttype is required')
  .isString().withMessage("accounttype must be a string")
  .isLength({ max: 50 }).withMessage('accounttype cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('accounttype contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('accounttype cannot be empty or contain HTML entities')) : value;
  }),

  body('pinRequired')
  .isBoolean().withMessage('pinRequired must be a either true or false')
  .notEmpty().withMessage('pinRequired is required'),


  
];



// Validation middleware for changePassword input
const changePasswordValidator = [

  body("currentPassword")
    .notEmpty()
    .withMessage("Current Password is required")
    .isString()
    .withMessage("Current Password must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ min: 6 }) // Set minimum length here
    .withMessage("Current Password must be at least 6 characters long")
    .isLength({ max: 50 })
    .withMessage("Current Password cannot exceed 50 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error("Current Password contains invalid or malicious content");
      }

      return value.trim() === ""
        ? Promise.reject(
            new Error("Current Password cannot be empty or contain HTML entities")
          )
        : value;
    }),


  body("newPassword")
    .notEmpty()
    .withMessage("New Password is required")
    .isString()
    .withMessage("New Password must be a string")
    // .isFloat({ min: 0, max: 99999 }).withMessage('Price must be between 0 and 99999') // Min and Max value check
    .isLength({ min: 6 }) // Set minimum length here
    .withMessage("New Password must be at least 6 characters long")
    .isLength({ max: 50 })
    .withMessage("New Password cannot exceed 50 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error("New Password contains invalid or malicious content");
      }

      return value.trim() === ""
        ? Promise.reject(
            new Error("New Password cannot be empty or contain HTML entities")
          )
        : value;
    }),

];

// Validation middleware for changePassword input
const twofaAuthenticationValidator = [

  body("isTwoFactorEnabled")
  .isBoolean()
  .withMessage("Two-factor enabled flag must be a boolean"),


];

// Validation middleware for adminFundTradeBalance input
const adminFundTradeBalanceValidator = [
  body('amount')
  .isFloat().withMessage('amount must be a valid number')
  .notEmpty().withMessage('amount is required'),


];


// Validation middleware for adminAddNewAssetWalletToUser input
const adminAddNewAssetWalletToUserValidator = [
  // body('userData')
  //   .notEmpty().withMessage('Please fill in the required fields'),

  body('userData.walletName')
    .notEmpty().withMessage('walletName is required')
    .isString().withMessage("walletName must be a string")
  //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 100 }).withMessage('walletName cannot exceed 100 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('walletName contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('walletName cannot be empty or contain HTML entities')) : value;
    }),

  body('userData.walletSymbol')
    .notEmpty().withMessage('walletSymbol is required')
    .isString().withMessage("walletSymbol must be a string")
  //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
    .isLength({ max: 50 }).withMessage('walletSymbol cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('walletSymbol contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('walletSymbol cannot be empty or contain HTML entities')) : value;
    }),

    body('userData.walletPhoto')
    .optional()  // Make the field optional
    .isString().withMessage("walletPhoto must be a string")
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      if (value) {  // Only run custom validation if walletPhoto exists
        const decodedValue = decodeEntities(value);
        const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
        if (sanitizedValue !== decodedValue) {
          throw new Error('walletPhoto contains invalid or malicious content');
        }
  
        // If value is empty after sanitization, reject the promise
        if (sanitizedValue.trim() === '') {
          return Promise.reject(new Error('walletPhoto cannot be empty or contain HTML entities'));
        }
      }
  
      return value; // Return sanitized value if validation passes
    }),
  

 
  
];



//Validation middleware for kycSetup input
const kycSetupValidator = [
  // body('userData')
  //   .notEmpty().withMessage('Please fill in the required fields'),

  body('userData.state')
    .notEmpty().withMessage('state is required')
    .isString().withMessage("state must be a string")
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 100 }).withMessage('First name cannot exceed 100 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('state contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('state cannot be empty or contain HTML entities')) : value;
    }),

  body('userData.address')
    .notEmpty().withMessage('address is required')
    .isString().withMessage("address must be a string")
  //   .isAlphanumeric().withMessage('Last name must contain only letters and numbers')
    .isLength({ max: 500 }).withMessage('Last name cannot exceed 500 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('address contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('address cannot be empty or contain HTML entities')) : value;
    }),

  body('userData.phone')
    .notEmpty().withMessage('phone is required')
    .isString().withMessage("phone must be a string")
    .isLength({ max: 50 }).withMessage('phone cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed
  
      if (sanitizedValue !== decodedValue) {
        throw new Error('phone contains invalid or malicious content');
      }
  
      return value.trim() === '' ? 
        Promise.reject(new Error('phone cannot be empty or contain HTML entities')) : value;
    }),

    body('userData.accounttype')
    .notEmpty().withMessage('accounttype is required')
    .isString().withMessage("accounttype must be a string")
    .isLength({ max: 50 }).withMessage('accounttype cannot exceed 50 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value);
      if (sanitizedValue !== decodedValue) {
        throw new Error('accounttype contains invalid or malicious content');
      }
      return value.trim() === '' ? 
        Promise.reject(new Error('accounttype cannot be empty or contain HTML entities')) : value;
    }),

  body('userData.package')
  .notEmpty().withMessage('package is required')
  .isString().withMessage("package must be a string")
  .isLength({ max: 50 }).withMessage('package cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('package contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('package cannot be empty or contain HTML entities')) : value;
  }),

  body('userData.country')
  .notEmpty()
  .withMessage('country is required')
  .isObject()
  .withMessage('country must be an object')
  .custom(value => {
    // Define validation rules for each property
    const validationRules = {
      code: { required: true, maxLength: 10 },
      label: { required: true, maxLength: 100 },
      phone: { required: true, maxLength: 15 },
    };

    // Iterate through the rules and validate each property
    for (const [key, rules] of Object.entries(validationRules)) {
      const propValue = value[key];

      if (rules.required && (!propValue || typeof propValue !== 'string')) {
        throw new Error(`country.${key} is required and must be a string`);
      }

      const sanitizedValue = purify.sanitize(propValue);
      if (sanitizedValue !== decodeEntities(propValue)) {
        throw new Error(`country.${key} contains invalid or malicious content`);
      }

      if (rules.maxLength && propValue.length > rules.maxLength) {
        throw new Error(`country.${key} cannot exceed ${rules.maxLength} characters`);
      }
    }

    return true; // Pass validation if all rules are met
  }),


  body('userData.currency')
  .notEmpty()
  .withMessage('currency is required')
  .isObject()
  .withMessage('currency must be an object')
  .custom(value => {
    // Define validation rules for each property
    const validationRules = {
      code: { required: true, maxLength: 10 },
      flag: { required: true, maxLength: 10 },
    };

    // Iterate through the rules and validate each property
    for (const [key, rules] of Object.entries(validationRules)) {
      const propValue = value[key];

      if (rules.required && (!propValue || typeof propValue !== 'string')) {
        throw new Error(`currency.${key} is required and must be a string`);
      }

      const sanitizedValue = purify.sanitize(propValue);
      if (sanitizedValue !== decodeEntities(propValue)) {
        throw new Error(`currency.${key} contains invalid or malicious content`);
      }

      if (rules.maxLength && propValue.length > rules.maxLength) {
        throw new Error(`currency.${key} cannot exceed ${rules.maxLength} characters`);
      }
    }

    return true; // Pass validation if all rules are met
  })

  
];




// Validation middleware for adminApproveId input
const adminApproveIdValidator = [
 
  body('status')
    .notEmpty().withMessage('status is required')
    .isString().withMessage("status must be a string")
  //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 20 }).withMessage('status cannot exceed 20 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('status contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('status cannot be empty or contain HTML entities')) : value;
    }),

 
  
];


// Validation middleware for adminChangeUserCurrency input
const adminChangeUserCurrencyValidator = [
 
  body('code')
    .notEmpty().withMessage('code is required')
    .isString().withMessage("code must be a string")
  //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 20 }).withMessage('code cannot exceed 20 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('code contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('code cannot be empty or contain HTML entities')) : value;
    }),

  body('flag')
    .notEmpty().withMessage('flag is required')
    .isString().withMessage("flag must be a string")
  //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
  //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ max: 20 }).withMessage('flag cannot exceed 20 characters')
    .customSanitizer(value => purify.sanitize(value))
    .custom(value => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error('flag contains invalid or malicious content');
      }

      return value.trim() === '' ? 
        Promise.reject(new Error('flag cannot be empty or contain HTML entities')) : value;
    }),
  
];



// Validation middleware for adminActivateDemoAccount input
const adminActivateDemoAccountValidator = [
 
  body('isDemoAccountActivated')
  .isBoolean().withMessage('isDemoAccountActivatedd must be a either true or false')
  .notEmpty().withMessage('isDemoAccountActivatedd is required'),

  body('demoBalance')
  .isFloat().withMessage('Demo Balance must be a valid number')
  .notEmpty().withMessage('Demo Balance is required'),
  
];


// Validation middleware for adminSetUserAutoTrade input
const adminSetUserAutoTradeValidator = [
 
  body('isAutoTradeActivated')
  .isBoolean().withMessage('isAutoTradeActivated must be a either true or false')
  .notEmpty().withMessage('isAutoTradeActivated is required'),

  body('type')
  .notEmpty().withMessage('type is required')
  .isString().withMessage("type must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 20 }).withMessage('type cannot exceed 20 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('type contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('type cannot be empty or contain HTML entities')) : value;
  }),

  body('winLoseValue')
  .notEmpty().withMessage('winLoseValue is required')
  .isString().withMessage("winLoseValue must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 20 }).withMessage('winLoseValue cannot exceed 20 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('winLoseValue contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('winLoseValue cannot be empty or contain HTML entities')) : value;
  }),
  
];


// Validation middleware for adminSetUserWithdrawalLock input
const adminSetUserWithdrawalLockValidator = [
 
  body('isWithdrawalLocked')
  .isBoolean().withMessage('isWithdrawalLocked must be a either true or false')
  .notEmpty().withMessage('isWithdrawalLocked is required'),

  body('lockCode')
  .isFloat().withMessage('lockCode must be a valid number')
  .notEmpty().withMessage('lockCode is required'),
  

  body('lockSubject')
  .notEmpty().withMessage('lockSubject is required')
  .isString().withMessage("lockSubject must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 50 }).withMessage('lockSubject cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('lockSubject contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('lockSubject cannot be empty or contain HTML entities')) : value;
  }),

  body('lockComment')
  .notEmpty().withMessage('lockComment is required')
  .isString().withMessage("lockComment must be a string")
//   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
//   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
  .isLength({ max: 200 }).withMessage('lockComment cannot exceed 200 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('lockComment contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('lockComment cannot be empty or contain HTML entities')) : value;
  }),
  
];


// Validation middleware for adminSendCustomizedMail input
const adminSendCustomizedMailValidator = [
 

  body('to')
  .notEmpty().withMessage('to is required')
  .isString().withMessage("to must be a string")
  .isLength({ max: 100 }).withMessage('to cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('to contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('to cannot be empty or contain HTML entities')) : value;
  }),

  body('fullName')
  .notEmpty().withMessage('fullName is required')
  .isString().withMessage("fullName must be a string")
  .isLength({ max: 50 }).withMessage('fullName cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('fullName contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('fullName cannot be empty or contain HTML entities')) : value;
  }),

  body('subject')
  .notEmpty().withMessage('subject is required')
  .isString().withMessage("subject must be a string")
  .isLength({ max: 50 }).withMessage('subject cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('subject contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('subject cannot be empty or contain HTML entities')) : value;
  }),

  body('teamName')
  .notEmpty().withMessage('teamName is required')
  .isString().withMessage("teamName must be a string")
  .isLength({ max: 50 }).withMessage('teamName cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('teamName contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('teamName cannot be empty or contain HTML entities')) : value;
  }),

  body('content')
  .notEmpty().withMessage('content is required')
  .isString().withMessage("content must be a string")
  .isLength({ max: 1000 }).withMessage('content cannot exceed 1000 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('content contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('content cannot be empty or contain HTML entities')) : value;
  }),

  body('footer')
  .notEmpty().withMessage('footer is required')
  .isString().withMessage("footer must be a string")
  .isLength({ max: 300 }).withMessage('footer cannot exceed 300 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('footer contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('footer cannot be empty or contain HTML entities')) : value;
  }),
 
  
];
// Validation middleware for adminAddGiftReward input
const adminAddGiftRewardValidator = [
 

  body('subject')
  .notEmpty().withMessage('to is required')
  .isString().withMessage("to must be a string")
  .isLength({ max: 50 }).withMessage('to cannot exceed 50 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('to contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('to cannot be empty or contain HTML entities')) : value;
  }),

  body('message')
  .notEmpty().withMessage('message is required')
  .isString().withMessage("message must be a string")
  .isLength({ max: 200 }).withMessage('message cannot exceed 200 characters')
  .customSanitizer(value => purify.sanitize(value))
  .custom(value => {
    const decodedValue = decodeEntities(value);
    const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

    if (sanitizedValue !== decodedValue) {
      throw new Error('message contains invalid or malicious content');
    }

    return value.trim() === '' ? 
      Promise.reject(new Error('message cannot be empty or contain HTML entities')) : value;
  }),

  body('amount')
  .isFloat().withMessage('amount must be a valid number')
  .notEmpty().withMessage('amount is required'),
  
 
  
];


// Validation middleware for changePin input
const changePinValidator = [

  body("currentPin")
    .notEmpty()
    .withMessage("Current Pin is required")
    .isString()
    .withMessage("Current Pin must be a string")
    //   .matches(/^[a-zA-Z0-9]+$/).withMessage('firstname must only contain letters Numbers')
    //   .isAlphanumeric().withMessage('First name must contain only letters and numbers and no white space.')
    .isLength({ min: 4 }) // Set minimum length here
    .withMessage("Current Pin must be at least 6 characters long")
    .isLength({ max: 4 })
    .withMessage("Current Pin cannot exceed 4 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error("Current Pin contains invalid or malicious content");
      }

      return value.trim() === ""
        ? Promise.reject(
            new Error("Current Pin cannot be empty or contain HTML entities")
          )
        : value;
    }),


  body("newPin")
    .notEmpty()
    .withMessage("New Pin is required")
    .isString()
    .withMessage("New Pin must be a string")
    // .isFloat({ min: 0, max: 99999 }).withMessage('Price must be between 0 and 99999') // Min and Max value check
    .isLength({ min: 4 }) // Set minimum length here
    .withMessage("New Pin must be at least 4 characters long")
    .isLength({ max: 4 })
    .withMessage("New Pin cannot exceed 4 characters")
    .customSanitizer((value) => purify.sanitize(value))
    .custom((value) => {
      const decodedValue = decodeEntities(value);
      const sanitizedValue = purify.sanitize(value); // Sanitize input again if needed

      if (sanitizedValue !== decodedValue) {
        throw new Error("New Pin contains invalid or malicious content");
      }

      return value.trim() === ""
        ? Promise.reject(
            new Error("New Pin cannot be empty or contain HTML entities")
          )
        : value;
    }),

];





// Export the validation middleware
module.exports = {adminUpdateUserValidator, changePasswordValidator, twofaAuthenticationValidator, adminFundTradeBalanceValidator, adminAddNewAssetWalletToUserValidator, adminApproveIdValidator, adminChangeUserCurrencyValidator, adminActivateDemoAccountValidator, adminSetUserAutoTradeValidator, adminSetUserWithdrawalLockValidator, adminSendCustomizedMailValidator, adminAddGiftRewardValidator, kycSetupValidator, changePinValidator };
