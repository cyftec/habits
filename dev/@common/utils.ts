export const getNewHabitId = () => new Date().getTime();

export const getUrlParams = () => {
  if (!location) return [];
  return location.href.split("?")[1].split("&");
};
