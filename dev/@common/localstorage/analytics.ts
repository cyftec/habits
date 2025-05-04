import { phase } from "@mufw/maya/utils";
import { INITIAL_ANALYTICS } from "../constants";
import { Analytics } from "../types";
import { parseObjectJsonString } from "../utils";

const LS_ANALYTICS_KEY = "analytics";
const LS_ANALYTICS_ID_KEY = "id";
const LS_ANALYTICS_ID_VALUE = "analytics";

export const updateAnalytics = (analytics: Analytics) => {
  localStorage.setItem(LS_ANALYTICS_KEY, JSON.stringify(analytics));
};

export const fetchAnalytics = (): Analytics => {
  if (!phase.currentIs("run")) {
    console.log(`return initial analytics`);
    return INITIAL_ANALYTICS;
  }

  const getAnalyticsFromStore = () => {
    const analyticsString = localStorage.getItem(LS_ANALYTICS_KEY);
    const analyticsObject = parseObjectJsonString<Analytics>(
      analyticsString,
      LS_ANALYTICS_ID_KEY,
      LS_ANALYTICS_ID_VALUE
    );
    return analyticsObject;
  };

  const analyticsObject = getAnalyticsFromStore();
  if (!analyticsObject) {
    console.log(`NO ANALYTICS FOUND`);
    updateAnalytics(INITIAL_ANALYTICS);
  }
  const analytics = getAnalyticsFromStore();
  console.log(analytics);

  if (!analytics) throw `Error fetching analytics`;

  return analytics;
};
