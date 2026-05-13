import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const publicBlogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
  };
}>();

publicBlogRouter.get("/", async (c) => {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());
  
    try {
      const posts = await prisma.post.findMany({
        where: {
            published: true, // Only show published blogs
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          author: {
            select: {
              name: true,
            },
          },
        },
        take: 6,
        orderBy: {
            createdAt: 'desc'
        }
      });

      return c.json({ post: posts });
    } catch (e) {
      console.error("Featured Blog Error:", e);
      return c.json({ error: "Internal Server Error" }, 500);
    }
});