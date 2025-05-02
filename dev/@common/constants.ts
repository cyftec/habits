import {
  WeekdayFrequency,
  LocalSettings,
  MilestonesData,
  MonthStatus,
} from "./types";

export const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const GOLDEN_RATIO = 1.6181;

export const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const satisfies string[];

export const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const satisfies string[];

export const EMPTY_MONTH: MonthStatus = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];

export const BASE_COLORS = [
  `#e87b52`,
  `#F5E06F`,
  `#A3BA64`,
  `#7095C9`,
  `#A59EE3`,
  `#D89DBF`,
] as const satisfies string[];

export const BASE_WEEKDAY_FREQUENCY: WeekdayFrequency = [1, 1, 1, 1, 1, 1, 1];

export const BASE_LEVELS = ["Not done", "Done"] as const satisfies string[];

export const BASE_MILESTONES: MilestonesData = [70, 60, 45];

export const INITIAL_SETTINGS: LocalSettings = {
  id: "local-settings",
  habitsPage: {
    tabIndex: 0,
    sortOptionIndex: 0,
  },
};

export const HOMEPAGE_OVERVIEW_TABS = [
  { label: "This month", months: 1 },
  { label: "2 months", months: 2 },
  { label: "5 months", months: 5 },
] as const;

export const HOMEPAGE_SORT_OPTIONS = [
  {
    icon: "calendar_month",
    decending: true,
    label: "Date created (Newest first)",
  },
  {
    icon: "calendar_month",
    decending: false,
    label: "Date created (Oldest first)",
  },
  {
    icon: "task_alt",
    decending: true,
    label: "Completion (Highest first)",
  },
  {
    icon: "task_alt",
    decending: false,
    label: "Completion (Lowest first)",
  },
] as const satisfies object[];

export const ROUTES = {
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
