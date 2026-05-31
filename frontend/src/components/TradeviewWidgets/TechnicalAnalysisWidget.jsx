// src/TradingViewWidget.jsx
import { useEffect, useRef, memo,  } from 'react';
import { useTheme } from "@mui/material";

function TechnicalAnalysisWidget() {
  const containerRef = useRef();
  const theme = useTheme();




  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;

    
    const config = {
      interval: "1m",
      width : "100%",
      isTransparent: true,
      height: "100%",
      symbol: "BITSTAMP:BTCUSD",
      showIntervalTabs: true,
      displayMode: "single",
      locale: "en",
      colorTheme: theme.palette.mode === "light" ? "light" : "dark",

      support_host: "https://www.tradingview.com"
    }

    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);

    return () => {
      // Cleanup the widget
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme.palette.mode]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: "200px", width: "200xs" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "200px", width: "200px" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(TechnicalAnalysisWidget);
