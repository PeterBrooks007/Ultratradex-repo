import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@mui/material';

const TickerTapeWidget = () => {
  const containerRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      symbols: [
        {
          proName: "FOREXCOM:SPXUSD",
          title: "S&P 500 Index"
        },
        {
          proName: "FOREXCOM:NSXUSD",
          title: "US 100 Cash CFD"
        },
        {
          proName: "FX_IDC:EURUSD",
          title: "EUR to USD"
        },
        {
          proName: "BITSTAMP:BTCUSD",
          title: "Bitcoin"
        },
        {
          proName: "BITSTAMP:ETHUSD",
          title: "Ethereum"
        }
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "",
      colorTheme: theme.palette.mode === "light" ? "light" : "dark",
      locale: "en"
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
      {/* <div className="tradingview-widget-copyright">
        <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
};

export default memo(TickerTapeWidget);
