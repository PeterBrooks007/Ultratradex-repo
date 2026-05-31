// src/TradingViewWidget.jsx
import { useEffect, useRef, memo } from "react";
import { useTheme } from "@mui/material";

function MarketNewsWidgets() {
  const containerRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.type = "text/javascript";
    script.async = true;

    const config = {
      feedMode: "all_symbols",
      isTransparent: true,
      displayMode: "regular",
      width: "100%",
      height: "100%",
      colorTheme: theme.palette.mode === "light" ? "light" : "dark",
      locale: "en",

      support_host: "https://www.tradingview.com",
    };

    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);

    return () => {
      // Cleanup the widget
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [theme.palette.mode]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: "100%", width: "100%" }}
      ></div>
      <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(MarketNewsWidgets);
