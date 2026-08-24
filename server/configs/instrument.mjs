import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: "https://47997ed56a2145ab4e197adda005cec1@o4511955794788352.ingest.us.sentry.io/4511955801931776",
  sendDefaultPii: true,
});