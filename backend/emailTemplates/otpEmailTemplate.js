const otpEmailTemplate = (name, otp) => {
    const email = {
        body: {
            name,
            intro: 'Welcome to ultratradex trading platform! We\'re very excited to have you on board. <br><br> To enhance the security of your account, we kindly request you to complete the email verification process. This simple step not only safeguards your account against unauthorized access but also ensures you receive critical notifications regarding your trades and account activities',
            action: {
                instructions: 'Here is your OTP verification code:',
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
    otpEmailTemplate,
  };
  