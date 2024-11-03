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
  };
}>();

app.use("/*", cors());

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/featured-blog", publicBlogRouter);
app.route("/api/v1/comments", commentRouter);

export default app;
