const twoFaOtpEmailTemplate = (name, otp) => {
    const email = {
        body: {
            name,
            intro: 'Here is Your one-time password for accessing your account <br><br> This OTP is valid for 15 minutes. Please enter this code on the verification page to complete the login process. <br><br> For your security, please do not share this code with anyone ',
            action: {
                instructions: 'OTP verification code:',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: `<span style="font-size: 30px; font-weight: bold;">${otp}</span>`,
                }
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
            signature: 'Best Regards'

        }
    };
    return email;
  };
  
// const otpEmailTemplate = (name, cartItems) => {
//     const email = {
//       body: {
//         name,
//         intro: "Your order has been placed successfully",
//         table: {
//           data: cartItems.map((item) => {
//             return {
//               product: item.name,
//               price: item.price,
//               Quantity: item.cartQuantity,
//               total: item.price * item.cartQuantity,
//             };
//           }),
//           columns: {
//             customWidth: {
//               product: "40%",
//             },
//           },
//         },
//         action: {
//           instructions:
//             "You can check the status of your order and more in your dasboard",
//           button: {
//             color: "#386904", // Optional action button color
//             text: "Go to dashboard",
//             link: "https://ultratradex.io",
//           },
//         },
//         outro: "We thank you for your purchase",
//       },
//     };
//     return email;
//   };
  
  module.exports = {
    twoFaOtpEmailTemplate,
  };
  