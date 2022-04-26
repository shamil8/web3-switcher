/** Convert minutes to milliseconds */
export const minutesToMilliSec = (minutes: number): number => minutes * 60 * 1000;

export const sleep = (ms: number)
  : Promise<void> => new Promise((res) => { setTimeout(res, ms); });
