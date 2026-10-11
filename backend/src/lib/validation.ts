import { z } from "zod";

const title = z.string().trim().min(1).max(100);
const content = z.string().min(1).max(100_000);
const tags = z.array(z.string().trim().min(1).max(30)).max(5).optional();

export const createPostSchema = z.object({
  title,
  content,
  tags,
});

export const updatePostSchema = z.object({
  id: z.string().uuid(),
  title,
  content,
  tags,
});

export const deleteAccountSchema = z.object({
  password: z.string().min(1).max(200),
});
