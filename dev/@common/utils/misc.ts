export const vibrateOnTap = (fn: ((...args: any[]) => any) | undefined) => {
  return (...args: any) => {
    if (!!window.navigator?.vibrate) {
      window.navigator.vibrate(3);
    }
    return fn && fn(...args);
  };
};

export const parseObjectJsonString = <T extends Object>(
  objectJsonString: string | null | undefined,
  uniquePropKey: string,
  nonNullUniquePropValue?: any
): T | undefined => {
  const obj: T = JSON.parse(objectJsonString || "{}");
  const isObject = obj && typeof obj === "object";
  const uniquePropValue = obj[uniquePropKey];
  const matchesSignature = nonNullUniquePropValue
    ? uniquePropValue === nonNullUniquePropValue
    : !!uniquePropValue;

  if (!isObject || !matchesSignature) return;
  return obj;
};
