const NewUserEmailTemplate = (name, userData) => {
    const email = {
        body: {
            name,
            intro: "A new user has been registered on ultratradex trading platform",
            table: {
              data: [
                  {
                      name: userData?.firstname+" "+userData?.lastname,
                      email: userData?.email,
                      // phone: userData?.phone,
                      // country: userData?.address?.country
                  },
                  
              ],
              columns: {
                  // Optionally, customize the column widths
                  customWidth: {
                    email: '40%',
                    // price: '15%'
                  },
                  // Optionally, change column text alignment
                  customAlignment: {
                    name: 'left'
                  }
              }
          },
            action: {
                instructions: 'You can view more details about the user in the admin dashboard',
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
    NewUserEmailTemplate,
  };
  