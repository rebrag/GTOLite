// src/hooks/useWindowDimensions.ts
import { useState, useEffect } from "react";

const useWindowDimensions = () => {
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return { windowWidth };
};

export default useWindowDimensions;
