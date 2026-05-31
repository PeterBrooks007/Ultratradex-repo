// src/TradingViewWidget.jsx
import { useEffect, useRef, memo } from 'react';
import { useMediaQuery, useTheme } from "@mui/material";
import { tokens } from '../../theme';

function TradingViewWidget({tradingpage}) {
  const containerRef = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const isMobile = useMediaQuery("(max-width: 900px)");




  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    
    const config = {
      autosize: true,
      symbol: "BITSTAMP:BTCUSD",
      interval: "D",
      timezone: "Etc/UTC",
      theme: theme.palette.mode === "light" ? "light" : "dark",
      style: "1",
      locale: "en",
      backgroundColor: colors.dashboardbackground[100],
      gridColor: tradingpage === "true" ? theme.palette.mode === "light" ? "rgba(47,49,58,0.08)" : "rgba(47,49,58,0.6)" : colors.dashboardbackground[100],
      hide_side_toolbar: isMobile ? false : true,
      hide_top_toolbar: false,
      withdateranges: true,
      allow_symbol_change: true,
      calendar: false,
      
      support_host: "https://www.tradingview.com"
    };

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
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      {/* <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
}

export default memo(TradingViewWidget);
