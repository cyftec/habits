import { WebAppManifest } from "web-app-manifest";

const assetsPath = "/assets";
const imagesPath = `${assetsPath}/images`;

const manifest: WebAppManifest = {
  short_name: "Habits",
  name: "Habits (by Cyfer)",
  icons: [
    {
      src: `${imagesPath}/192_logo.png`,
      sizes: "192x192",
      type: "image/png",
    },
    {
      src: `${imagesPath}/512_logo.png`,
      sizes: "512x512",
      type: "image/png",
    },
  ],
  screenshots: [
    {
      src: `${imagesPath}/screenshot.png`,
      sizes: "640x320",
      type: "image/png",
    },
  ],
  start_url: "/index.html",
  id: "/index.html",
  display: "standalone",
  orientation: "portrait",
  theme_color: "#e87b52",
  background_color: "#f3cbbc",
};

export default manifest;
