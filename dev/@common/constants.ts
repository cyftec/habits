import { MonthStatus } from "./types";

export const DAY_IN_MS = 1000 * 60 * 60 * 24;
export const GOLDEN_RATIO = 1.6181;

export const HOMEPAGE_OVERVIEW_TABS = [
  { label: "Recent", months: 2 },
  { label: "Long", months: 6 },
] as const;

export const STATUS_VIEW_TYPES = [
  "Monthly",
  "Weekly",
] as const satisfies string[];

export const EMPTY_MONTH: MonthStatus = [
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
  -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1,
];

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

export const BASE_COLORS = [
  "#339933",
  "#00ccff",
  "#0000ff",
  "#9900cc",
  "#ff66ff",
  "#ff0000",
  "#ff9900",
  "#cccc00",
  "#99cc00",
] as const satisfies string[];

export const BASE_LEVELS = ["Not done", "Done"] as const satisfies string[];
