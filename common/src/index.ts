import z from "zod";

export const signupInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
  name: z.string(),
});

export const signinInput = z.object({
  username: z.string().email(),
  password: z.string().min(6),
});

export const createBlogInput = z.object({
  title: z.string().max(100),
  content: z.string(),
});

export const updateBlogInput = z.object({
  title: z.string().max(100),
  content: z.string(),
  id: z.string(),
});

export const createCommentInput = z.object({
  content: z.string().min(1).max(1000),
  postId: z.string().uuid(),
});

export type SignupInput = z.infer<typeof signupInput>;
export type SigninInput = z.infer<typeof signinInput>;
export type CreateBlogInput = z.infer<typeof createBlogInput>;
export type UpdateBlogInput = z.infer<typeof updateBlogInput>;
export type createCommentInput = z.infer<typeof createCommentInput>
