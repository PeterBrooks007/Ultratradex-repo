import { useEffect, useRef, memo } from "react";
import { useTheme } from "@mui/material";

function Watchlistmarketdata({ tradingpage }) {
  const containerRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
    script.type = "text/javascript";
    script.async = true;

    const config = {
      width: "100%", // Changed to number
      height: "100%", // Changed to number
      symbolsGroups: [
        {
          name: "CRYPTO",
          originalName: "Forex",
          symbols: [
            {
              name: "BITSTAMP:BTCUSD",
            },
            {
              name: "BINANCE:BTCUSDT",
            },
          ],
        },
        {
          name: "STOCKS",
          symbols: [
            {
              name: "NASDAQ:AAPL",
            },
            {
              name: "NASDAQ:TSLA",
            },
          ],
        },
        {
          name: "FOREX", // Corrected the typo from "nam" to "name"
          symbols: [
            // Corrected the typo from "symbol" to "symbols"
            {
              name: "FX:EURUSD", // Corrected the typo from "nam" to "name"
            },
            {
              name: "FX:GBPUSD", // Corrected the typo from "nam" to "name"
            },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme: theme.palette.mode === "light" ? "light" : "dark",
      locale: "en",
      backgroundColor: "#131722",
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

export default memo(Watchlistmarketdata);
