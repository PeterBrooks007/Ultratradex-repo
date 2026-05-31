// src/MiniSymbolOverviewWidget.jsx
import { useEffect, useRef, memo } from 'react';
import { useTheme } from '@mui/material';

function MiniSymbolOverviewWidget({symbol}) {
  const containerRef = useRef();
  const theme = useTheme();

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js';
    script.type = 'text/javascript';
    script.async = true;

    const config = {
      symbol: symbol,
      width: '48%',
      height: '200',
      locale: 'en',
      dateRange: '12M',
      // Set color theme based on MUI theme
      colorTheme: theme.palette.mode === 'light' ? 'light' : 'dark',
      isTransparent: false,
      autosize: false,
      largeChartUrl: '',
    };

    script.innerHTML = JSON.stringify(config);

    containerRef.current.appendChild(script);

    return () => {
      // Clean up the widget on component unmount
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [theme.palette.mode]);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ height: '200px', width: '48%' }}
    >
      <div
        className="tradingview-widget-container__widget"
        style={{ height: '200px', width: '48%' }}
      ></div>
      {/* <div className="tradingview-widget-copyright">
        <a
          href="https://www.tradingview.com/"
          rel="noopener nofollow"
          target="_blank"
        >
          <span className="blue-text">Track all markets on TradingView</span>
        </a>
      </div> */}
    </div>
  );
}

export default memo(MiniSymbolOverviewWidget);
