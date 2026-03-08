// src/components/ScrollToTop.jsx
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname, hash } = useLocation(); // Extracts the current pathname

  useEffect(() => {
    if (!hash) {
      // Scrolls the window to the top whenever the pathname changes
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth", // Optional: use 'instant' for no animation
      });
    }
  }, [pathname]); // The effect runs again whenever 'pathname' changes

  return null; // This component doesn't render anything
};

export default ScrollToTop;
