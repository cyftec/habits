export const goToHref = (href: string) => (location.href = href);
export const goToHomePage = () => (location.href = `/`);
export const goToHabitsPage = () => (location.href = `/habits/`);
export const goToNewHabitsPage = () => (location.href = `/habits/new/`);
export const goToHabitPage = (habitId: number) =>
  (location.href = `/habits/habit/?id=${habitId}`);
export const goToHabitEditPage = (habitId: number) =>
  (location.href = `/habits/habit/edit/?id=${habitId}`);
export const goToSettingsPage = () => (location.href = `/settings/`);
