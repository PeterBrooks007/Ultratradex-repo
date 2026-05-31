const sendCustomizeEmailTemplate = (name, introMessage) => {
    const email = {
        body: {
            name,
            intro: introMessage,
           
            signature: 'Best Regards'
        }
    };
    return email;
  };
 
  
  module.exports = {
    sendCustomizeEmailTemplate,
  };
  