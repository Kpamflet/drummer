import { createCookieSessionStorage } from "@vercel/remix";

const { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    path: "/",
    name: "drumandbasscentre",
    secrets: ["drumandbasscentre"],
  }
});

export { getSession, commitSession, destroySession };