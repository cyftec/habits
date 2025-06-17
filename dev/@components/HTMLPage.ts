import { signal } from "@cyftech/signal";
import { Child, component, m } from "@mufw/maya";

type HTMLPageProps = {
  cssClasses?: string;
  body: Child;
  onMount?: () => void;
  onUnMount?: () => void;
};

const stylesheetLinkRel = signal<"preload" | "stylesheet">("preload");

export const HTMLPage = component<HTMLPageProps>(
  ({ cssClasses, body, onMount, onUnMount }) => {
    return m.Html({
      lang: "en",
      children: [
        m.Head({
          onmount: () => (stylesheetLinkRel.value = "stylesheet"),
          children: [
            m.Title("Habits (by Cyfer)"),
            m.Link({
              rel: "icon",
              type: "image/x-icon",
              href: "/assets/images/favicon.ico",
            }),
            m.Meta({
              "http-equiv": "Content-Security-Policy",
              content: `
                default-src 'self';
                script-src 'self';
                style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://unpkg.com;
                font-src https://fonts.gstatic.com;
                object-src 'none';
                base-uri 'none';
              `,
            }),
            m.Meta({ charset: "UTF-8" }),
            m.Meta({
              "http-equiv": "X-UA-Compatible",
              content: "IE=edge",
            }),
            m.Meta({
              name: "viewport",
              content: "width=device-width, initial-scale=1.0",
            }),
            m.Link({
              rel: stylesheetLinkRel,
              href: "https://unpkg.com/tachyons@4.12.0/css/tachyons.min.css",
              as: "style",
            }),
            m.Link({
              rel: stylesheetLinkRel,
              href: "https://fonts.googleapis.com/css2?family=Livvic:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,900&display=swap",
              as: "style",
            }),
            m.Link({
              rel: stylesheetLinkRel,
              href: "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200",
              as: "style",
            }),
            m.Link({
              rel: stylesheetLinkRel,
              href: "/assets/styles.css",
              as: "style",
            }),
            m.Link({
              rel: "manifest",
              href: "/manifest.json",
            }),
          ],
        }),
        m.Body({
          tabindex: "-1",
          class: cssClasses,
          onmount: onMount,
          onunmount: onUnMount,
          children: [m.Script({ src: "main.js", defer: true }), body],
        }),
      ],
    });
  }
);
