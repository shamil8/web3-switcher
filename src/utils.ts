/** Convert minutes to milliseconds */
export const minutesToMilliSec = (minutes: number): number => minutes * 60 * 1000;

export const sleep = (ms: number)
  // eslint-disable-next-line no-promise-executor-return
  : Promise<void> => new Promise((res) => setTimeout(res, ms));
