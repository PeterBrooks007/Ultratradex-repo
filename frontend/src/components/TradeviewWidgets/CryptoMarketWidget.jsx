// src/TradingViewScreenerWidget.jsx
import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@mui/material';
import { tokens } from '../../theme';

const CryptoMarketWidget = () => {
  const containerRef = useRef();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);


  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      width: "100%",
      height: "100%",
      defaultColumn: "overview",
      screener_type: "crypto_mkt",
      displayCurrency: "USD",
      colorTheme: theme.palette.mode === "light" ? "light" : "dark",
      locale: "en",
      isTransparent: "true"

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
    <div className="tradingview-widget-container" style={{ height: '100%', width: '100%' }} ref={containerRef}>
      <div className="tradingview-widget-container__widget" style={{ height: '100%', width: '100%' }}></div>
      <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div>
    </div>
  );
};

export default memo(CryptoMarketWidget);
