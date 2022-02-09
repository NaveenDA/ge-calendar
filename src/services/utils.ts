/**
 * Utils methods
 * note: These are non-side-effecting methods, so it will give better results
 * in tree shaking
 * moreinfo: https://javascript.plainenglish.io/deep-dive-into-tree-shaking-ba2e648b8dcb?gi=614130580b5
 */
export const addLeadingZero = (num: number | string): string => {
  if (typeof num === "string") {
    num = parseInt(num, 10);
  }

  if (num < 10) {
    return "0" + num;
  } else {
    return num + "";
  }
};
