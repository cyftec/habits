export const vibrateOnTap = (fn: ((...args: any[]) => any) | undefined) => {
  return (...args: any) => {
    if (!!window.navigator?.vibrate) {
      window.navigator.vibrate(3);
    }
    return fn && fn(...args);
  };
};
