import { Hono } from "hono";

const app = new Hono();

app.post("/api/v1/signup", (c) => {
  return c.text("Signup route");
});
app.post("/api/v1/signin", (c) => {
  return c.text("Signin route");
});

app.post("/api/v1/blog", (c) => {
  return c.text(" Blog route to create");
});
app.put("/api/v1/blog", (c) => {
  return c.text(" Blog route to edit");
});

app.get("/api/v1/blog/:id", (c) => {
  const id = c.req.param("id");
  console.log(id);
  return c.text("Get blog route");
});

app.get("/api/v1/blog/bulkx", (c) => {
  return c.text("Get all the blogs");
});

export default app;
