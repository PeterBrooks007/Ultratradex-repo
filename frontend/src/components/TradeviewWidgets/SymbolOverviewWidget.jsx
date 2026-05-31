// src/TradingViewWidget.jsx
import { useEffect, useRef, memo } from 'react';
import { useMediaQuery, useTheme } from "@mui/material";
import { tokens } from '../../theme';

function SymbolOverviewWidget() {
  const containerRef = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const isMobile = useMediaQuery("(max-width: 900px)");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
    script.type = "text/javascript";
    script.async = true;

    const config = {
      symbols: [
        ["BITSTAMP:BTCUSD|1M"],
        ["BITSTAMP:ETHUSD|1M"],
        ["COINBASE:SOLUSD|1M"],
        ["CRYPTOCAP:USDT.D|1M"]
      ],
      chartOnly: false,
      width: "100%",
      height: "100%",
      locale: "en",
      colorTheme: theme.palette.mode === "light" ? "light" : "dark",
      autosize: true,
      showVolume: false,
      showMA: false,
      hideDateRanges: false,
      hideMarketStatus: false,
      hideSymbolLogo: false,
      scalePosition: "right",
      scaleMode: "Normal",
      fontFamily: "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
      fontSize: "10",
      noTimeScale: false,
      valuesTracking: "1",
      changeMode: "price-and-percent",
      chartType: "area",
      maLineColor: "#2962FF",
      maLineWidth: 1,
      maLength: 9,
      headerFontSize: "medium",
      lineWidth: 2,
      lineType: 0,
      dateRanges: [
        "1d|1",
        "1m|30",
        "3m|60",
        "12m|1D",
        "60m|1W",
        "all|1M",
      ],
      backgroundColor: colors.dashboardforeground[100],

      // gridColor:
      //   tradingpage === "true"
      //     ? theme.palette.mode === "light"
      //       ? "rgba(47,49,58,0.08)"
      //       : "rgba(47,49,58,0.6)"
      //     : colors.dashboardbackground[100],
    };

    script.innerHTML = JSON.stringify(config);
    containerRef.current.appendChild(script);

    return () => {
      // Cleanup widget
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme.palette.mode, colors, isMobile]);

  return (
    <div className="tradingview-widget-container" ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
}

export default memo(SymbolOverviewWidget);
