import { phase } from "@mufw/maya/utils";

const ROUTES = {
  HOME: {
    id: "home-page",
    href: "/",
  },
  HABITS: {
    id: "habits-page",
    href: "/habits/",
    NEW: {
      id: "new-habit-page",
      href: "/habits/new/",
    },
    HABIT: {
      id: "habit-page",
      href: "/habits/habit/",
      EDIT: {
        id: "edit-habit-page",
        href: "/habits/habit/edit/",
      },
    },
  },
  SETTINGS: {
    id: "settings-page",
    href: "/",
  },
};

export const goToHref = (href: string) => (location.href = href);
export const goToHomePage = () => (location.href = ROUTES.HOME.href);
export const goToHabitsPage = () => (location.href = ROUTES.HABITS.href);
export const goToNewHabitsPage = () => (location.href = ROUTES.HABITS.NEW.href);
export const goToHabitPage = (habitId: number) =>
  (location.href = `${ROUTES.HABITS.HABIT.href}?id=${habitId}`);
export const goToHabitEditPage = (habitId: number) =>
  (location.href = `${ROUTES.HABITS.HABIT.EDIT.href}?id=${habitId}`);
export const goToSettingsPage = () => (location.href = ROUTES.SETTINGS.href);

export const getQueryParamValue = (queryParamKey: string) => {
  if (!phase.currentIs("run")) return "";
  const urlString = window.location.search;
  const urlParams = new URLSearchParams(urlString);
  return urlParams.get(queryParamKey) || "";
};
