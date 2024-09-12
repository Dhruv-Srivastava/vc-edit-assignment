import { useEffect, useMemo, useRef, useState } from "react";

export function useTimer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(null); // To track when the timer started
  const elapsedRef = useRef(0); // To track the elapsed time between updates

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - elapsedRef.current; // Adjust start time to account for elapsed time
      const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        setTime(elapsedTime);
      }, 10); // Update every 10ms for higher accuracy

      return () => {
        clearInterval(intervalId);
        elapsedRef.current = Date.now() - startTimeRef.current; // Store elapsed time for future calculations
      };
    } else {
      clearInterval(startTimeRef.current);
    }
  }, [isPlaying]);

  function restartTimer() {
    setTime(0); // Reset time
    setIsPlaying(false); // Stop the timer if it's running
    elapsedRef.current = 0; // Reset elapsed time
  }

  function pauseTimer() {
    setIsPlaying(false); // Simply toggle playing, cleanup will handle interval
  }

  function startTimer() {
    setIsPlaying(true); // Start the timer
  }

  return { time, isPlaying, startTimer, pauseTimer, restartTimer };
}
