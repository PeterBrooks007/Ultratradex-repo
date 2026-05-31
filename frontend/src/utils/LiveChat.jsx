import { useEffect } from "react";

const LiveChat = () => {
  useEffect(() => {
    // Smartsupp Live Chat script
    const smartsuppScript = document.createElement('script');
    smartsuppScript.type = 'text/javascript';
    smartsuppScript.innerHTML = `
      var _smartsupp = _smartsupp || {};
      _smartsupp.key = '57a317dc6626809a924b4dc0c51ce8f694b2019e';
      window.smartsupp||(function(d) {
        var s,c,o=smartsupp=function(){ o._.push(arguments)};o._=[];
        s=d.getElementsByTagName('script')[0];c=d.createElement('script');
        c.type='text/javascript';c.charset='utf-8';c.async=true;
        c.src='https://www.smartsuppchat.com/loader.js?';s.parentNode.insertBefore(c,s);
      })(document);
    `;
    document.body.appendChild(smartsuppScript);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(smartsuppScript);
    };
  }, []);

  return null; // This component does not render anything
};

export default LiveChat;
