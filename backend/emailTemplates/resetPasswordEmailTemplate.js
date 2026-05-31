const resetPasswordEmailTemplate = (name, resetPasswordLink) => {
    const email = {
        body: {
            name,
            intro: 'We received a request to reset your password for your account.',
            action: {
                instructions: 'To reset your password, click the link below, This link will expire in 1 hour.',
                button: {
                    color: '#22BC66', // Optional action button color
                    text: `<span style="font-size: 16px; font-weight: bold;">Reset Password</span>`,
                    link: `${resetPasswordLink}`
                }
            },
            outro: ` If the button above doesn’t work, please copy and paste the following link into your browser <br><br> 
             ${resetPasswordLink} 
             <br><br> If you didn’t make this request, please ignore this email.`,
            
            signature: 'Best Regards'

        }
    };
    return email;
  };
  
  
  module.exports = {
    resetPasswordEmailTemplate,
  };
  