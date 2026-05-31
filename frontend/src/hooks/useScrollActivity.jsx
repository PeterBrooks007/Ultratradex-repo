import { useState, useEffect } from 'react';

const useScrollActivity = (timeout = 1000) => {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    let scrollTimeout;

    const handleScroll = () => {
      setIsScrolling(true);
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, timeout);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [timeout]);

  return isScrolling;
};

export default useScrollActivity;



// import { useState, useEffect } from 'react';

// const useScrollActivity = (timeout = 1000) => {
//   const [isScrolling, setIsScrolling] = useState(false);

//   useEffect(() => {
//     let scrollableElement = document.querySelector('.scrollable-element');
//     let scrollTimeout;

//     const handleScroll = () => {
//       setIsScrolling(true);
//       clearTimeout(scrollTimeout);

//       scrollTimeout = setTimeout(() => {
//         setIsScrolling(false);
//       }, timeout);
//     };

//     if (scrollableElement) {
//       scrollableElement.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (scrollableElement) {
//         scrollableElement.removeEventListener('scroll', handleScroll);
//       }
//       clearTimeout(scrollTimeout);
//     };
//   }, [timeout]);

//   return isScrolling;
// };

// export default useScrollActivity;






// import { useState, useEffect } from 'react';

// const useScrollActivity = (timeout = 3000, threshold = 20) => {
//   const [isScrolling, setIsScrolling] = useState(false);

//   useEffect(() => {
//     const scrollableElement = document.querySelector('.scrollable-element');
//     let scrollTimeout;

//     const handleScroll = () => {
//       const scrollTop = scrollableElement.scrollTop;
//       const scrollHeight = scrollableElement.scrollHeight;
//       const clientHeight = scrollableElement.clientHeight;

//       // Check if within the threshold of reaching the bottom
//       if (scrollHeight - scrollTop - clientHeight <= threshold) {
//         setIsScrolling(true);
//       } else {
//         setIsScrolling(false);
//       }

//       clearTimeout(scrollTimeout);

//       scrollTimeout = setTimeout(() => {
//         setIsScrolling(false);
//       }, timeout);
//     };

//     if (scrollableElement) {
//       scrollableElement.addEventListener('scroll', handleScroll);
//     }

//     return () => {
//       if (scrollableElement) {
//         scrollableElement.removeEventListener('scroll', handleScroll);
//       }
//       clearTimeout(scrollTimeout);
//     };
//   }, [timeout, threshold]);

//   return isScrolling;
// };

// export default useScrollActivity;
