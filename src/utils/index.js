export function formatTime(time) {
  const mm = Math.floor(time / 60000)
    .toString()
    .padStart(2, "0"); // Minutes
  const ss = Math.floor((time % 60000) / 1000)
    .toString()
    .padStart(2, "0"); // Seconds
  const msms = Math.floor((time % 1000) / 10)
    .toString()
    .padStart(2, "0"); // Milliseconds

  return { mm, ss, msms };
}
