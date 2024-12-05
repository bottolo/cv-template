import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { logger } from "hono/logger";
import { notionRoute } from "./routes/notion/notion.ts";

const app = new Hono();

app.use("*", logger());

const apiRoutes = app.basePath("/api").route("/notion", notionRoute);
app.use("*", serveStatic({ root: "./frontend/dist" }));
app.use("*", serveStatic({ path: "./frontend/dist/index.html" }));

export default app;
export type ApiRoutes = typeof apiRoutes;
