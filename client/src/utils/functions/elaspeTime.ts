export function getElaspeTime(startTime: any) {
  let timeInms = Date.now() - new Date(startTime)?.getTime();

  let s = Math.floor(timeInms / 1000);
  let m = Math.floor(timeInms / (1000 * 60));
  let h = Math.floor(timeInms / (1000 * 60 * 60));
  let d = Math.floor(timeInms / (1000 * 60 * 60 * 24));

  if (h >= 24) {
    return d + "days";
  } else if (m >= 60) {
    return h + "hours";
  } else if (s >= 60) {
    return m + "minutes";
  } else {
    return s + "seconds";
  }
}
