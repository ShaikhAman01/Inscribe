import { Hono } from "hono";
import { userRouter } from "./routes/user";
import { blogRouter } from "./routes/blog";
import { cors } from "hono/cors";
import { commentRouter } from "./routes/comment";
import { publicBlogRouter } from "./routes/publicBlog";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    ALLOWED_ORIGINS: string;
    PREVIEW_ORIGIN_PATTERN?: string;
  };
}>();

const isAllowedOrigin = (origin: string, allowed: string, previewPattern?: string) =>
  allowed.split(",").includes(origin) || (Boolean(previewPattern) && new RegExp(previewPattern!).test(origin));

app.use("/*", (c, next) =>
  cors({
    origin: (origin) =>
      isAllowedOrigin(origin, c.env.ALLOWED_ORIGINS ?? "", c.env.PREVIEW_ORIGIN_PATTERN) ? origin : null,
    allowHeaders: ["Content-Type", "Authorization"],
  })(c, next)
);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/featured-blog", publicBlogRouter);
app.route("/api/v1/comments", commentRouter);

export default app;
