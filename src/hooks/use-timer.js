import { useEffect, useRef, useState } from "react";

export function useTimer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0);

  useEffect(() => {
    if (isPlaying) {
      startTimeRef.current = Date.now() - elapsedRef.current;
      const intervalId = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        setTime(elapsedTime);
      }, 10);

      return () => {
        clearInterval(intervalId);
        elapsedRef.current = Date.now() - startTimeRef.current;
      };
    } else {
      clearInterval(startTimeRef.current);
    }
  }, [isPlaying]);

  function restartTimer() {
    setTime(0);
    setIsPlaying(false);
    elapsedRef.current = 0;
  }

  function pauseTimer() {
    setIsPlaying(false);
  }

  function startTimer() {
    setIsPlaying(true);
  }

  return { time, isPlaying, startTimer, pauseTimer, restartTimer };
}
