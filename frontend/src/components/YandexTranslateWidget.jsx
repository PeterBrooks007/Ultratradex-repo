import React, { useEffect } from "react";

const YandexTranslateWidget = () => {
  useEffect(() => {
    // Function to load the Yandex script
    const loadYandexScript = () => {
      const script = document.createElement("script");
      script.id = "yandex-translate-widget-script";
      script.src =
        "https://translate.yandex.net/website-widget/v1/widget.js?widgetId=ytWidget&pageLang=en&widgetTheme=light&autoMode=false";
      script.type = "text/javascript";
      script.async = true;
      document.body.appendChild(script);
    };

    // Check if the script already exists
    if (!document.getElementById("yandex-translate-widget-script")) {
      loadYandexScript();
    }

    // Cleanup function to remove the script when the component unmounts
    return () => {
      const existingScript = document.getElementById("yandex-translate-widget-script");
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []); // Empty dependency array ensures this effect runs once per mount/unmount

  return <div id="ytWidget"></div>;
};

export default YandexTranslateWidget;
