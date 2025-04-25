import { effect, signal } from "@cyftech/signal";
import { LocalSettings } from "../types";
import { INITIAL_SETTINGS } from "../constants";

const initializeSettings = () => {
  localStorage.setItem("settings", JSON.stringify(INITIAL_SETTINGS));
};

const fetchSettings = () => {
  if (!globalThis.localStorage) return INITIAL_SETTINGS;
  const settingsString = localStorage.getItem("settings") || "";
  const settingsObject = JSON.parse(settingsString) as LocalSettings;
  const validSettings =
    typeof settingsObject === "object" &&
    settingsObject["id"] === "local-settings";

  if (!validSettings) initializeSettings();
  const settings = JSON.parse(
    localStorage.getItem("settings") as string
  ) as LocalSettings;

  return settings;
};

export const localSettings = signal(fetchSettings());

effect(() => {
  if (globalThis.localStorage)
    localStorage.setItem("settings", JSON.stringify(localSettings.value));
});
