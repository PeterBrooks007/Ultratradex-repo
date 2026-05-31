const adminGeneralEmailTemplate = (name, introMessage) => {
    const email = {
        body: {
            name,
            intro: introMessage,
            action: {
                instructions: 'Go to admin dashboard',
                button: {
                    color: '#386904', // Optional action button color
                    text: 'Go to dashboard',
                    link: 'https://ultratradex.io/admin',
                },
            },
          
            // outro: 'You can view more details about the user in the admin dashboard',
            signature: 'Best Regards'

        }
    };
    return email;
  };
 
  
  module.exports = {
    adminGeneralEmailTemplate,
  };
  