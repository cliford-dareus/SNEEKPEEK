export function getElaspeTime(startTime: Date) {
  const timeInms = Date.now() - new Date(startTime)?.getTime();

  const s = Math.floor(timeInms / 1000);
  const m = Math.floor(timeInms / (1000 * 60));
  const h = Math.floor(timeInms / (1000 * 60 * 60));
  const d = Math.floor(timeInms / (1000 * 60 * 60 * 24));

  if (h >= 24) {
    return d + " days";
  } else if (m >= 60) {
    return h + " hours";
  } else if (s >= 60) {
    return m + " minutes";
  } else {
    return s + " seconds";
  }
}
