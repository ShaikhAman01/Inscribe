import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"; // Optional, but better than raw SHA-256

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create users
  const users = await prisma.user.createMany({
    data: [
      {
        email: "alice@example.com",
        name: "Alice Johnson",
        password: await hash("password123"),
      },
      {
        email: "bob@example.com",
        name: "Bob Smith",
        password: await hash("securepass"),
      },
      {
        email: "charlie@example.com",
        name: "Charlie Adams",
        password: await hash("mypassword"),
      },
      {
        email: "johndoe@example.com",
        name: "johndoe",
        password: await hash("hiddenuser"),
      },
    ],
  });

  console.log("✅ Users created");

  // Fetch users for relationships
  const alice = await prisma.user.findUnique({ where: { email: "alice@example.com" } });
  const bob = await prisma.user.findUnique({ where: { email: "bob@example.com" } });
  const charlie = await prisma.user.findUnique({ where: { email: "charlie@example.com" } });

  // Create posts
  const posts = await prisma.post.createMany({
    data: [
      {
        title: "The Future of AI in 2025",
        content: "Artificial Intelligence continues to evolve at a rapid pace...",
        published: true,
        authorId: alice!.id,
      },
      {
        title: "How to Stay Productive Working From Home",
        content: "Remote work is becoming the new normal, but it comes with challenges...",
        published: true,
        authorId: bob!.id,
      },
      {
        title: "A Beginner's Guide to Web3",
        content: "Web3 promises a decentralized internet, but what does that really mean?",
        published: true,
        authorId: charlie!.id,
      },
      {
        title: "The Hidden User Post",
        content: "This is from johndoe and should be excluded from featured blogs.",
        published: true,
        authorId: (await prisma.user.findUnique({ where: { email: "johndoe@example.com" } }))!.id,
      },
    ],
  });

  console.log("✅ Posts created");

  // Get posts for comments
  const post1 = await prisma.post.findFirst({ where: { title: "The Future of AI in 2025" } });
  const post2 = await prisma.post.findFirst({ where: { title: "How to Stay Productive Working From Home" } });

  // Create comments
  await prisma.comment.createMany({
    data: [
      {
        content: "Great insights! I think AI will change healthcare the most.",
        postId: post1!.id,
        authorId: bob!.id,
      },
      {
        content: "I prefer working in the office, but hybrid is fine.",
        postId: post2!.id,
        authorId: alice!.id,
      },
      {
        content: "Interesting take! I’d like to know your sources.",
        postId: post1!.id,
        authorId: charlie!.id,
      },
    ],
  });

  console.log("Comments created");
}

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

main()
  .then(async () => {
    console.log("🌟 Seeding completed successfully!");
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed", e);
    await prisma.$disconnect();
    process.exit(1);
  });
