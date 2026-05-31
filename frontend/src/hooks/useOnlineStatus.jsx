import { useState, useEffect } from "react";
import { toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineToastId, setOfflineToastId] = useState(null);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);

      if (offlineToastId) {
        // Dismiss the offline toast before showing the online toast
        toast.dismiss(offlineToastId);
        setOfflineToastId(null);
        // Show the online toast
        toast.success("You are back online!", {
          position: "bottom-center",
          autoClose: 5000,
          closeButton: null, // The closeButton defined on ToastContainer will be used
          transition: Slide,
          delay: 500, // Apply slide transition
        });
      }
    };

    const handleOffline = () => {
      toast.dismiss();
      setIsOnline(false);
      if (offlineToastId === null) {
        // Prevent multiple offline toasts
        const id = toast.error("You are offline!", {
          position: "bottom-center",
          autoClose: false,
          transition: Slide, // Apply slide transition
          delay: 500, // Apply slide transition
        });
        setOfflineToastId(id);
      }
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Initial state
    if (!navigator.onLine && offlineToastId === null) {
      handleOffline();
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [offlineToastId]);

  return isOnline;
};

export default useOnlineStatus;
