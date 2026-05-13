import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import * as dotenv from 'dotenv';

declare const process: { exit(code?: number): void };

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL, 
    },
  },
});

const TECH_CONTENT = [
  {
    title: "Why Simplicity Wins in Modern Software Development",
    content: "In today's fast-moving tech world, it's tempting to believe that more complexity means more power. New frameworks, advanced architectures, and endless tools promise to make development faster and smarter. But in reality, the most effective software often comes from one principle: simplicity. Simple code is easier to understand, teams benefit from clearer logic, and onboarding becomes faster. Over-engineered systems can become fragile and difficult to scale. What starts as a clever solution can quickly turn into technical debt."
  },
  {
    title: "Building Scalable Systems with Cloudflare Workers",
    content: "Serverless computing at the edge has changed the game. By moving logic closer to the user, we reduce latency and improve global performance. Using the Edge Runtime allows for instant cold starts and massive scalability without managing infrastructure. In this post, we explore how to leverage Hono and Prisma Accelerate to build a high-performance backend that runs globally in milliseconds."
  },
  {
    title: "Mastering the Arch Linux Workflow",
    content: "Arch Linux is more than just a rolling release distribution; it's a philosophy of simplicity and total control. From the installation process to managing the AUR, Arch forces you to understand how your system works. For developers, this environment provides a clean slate to build a customized development machine that isn't bogged down by bloatware. We dive into tiling window managers and package management best practices."
  },
  {
    title: "The Rise of Agentic AI in 2026",
    content: "We are moving beyond simple chatbots. Agentic AI refers to systems that can plan, reason, and execute tasks independently. These agents don't just answer questions; they interact with APIs, manage schedules, and debug code. Understanding how to integrate LLMs into autonomous workflows is becoming a critical skill for full-stack engineers."
  },
  {
    title: "PostgreSQL vs NoSQL: Making the Right Choice",
    content: "The debate between relational and non-relational databases is often misunderstood. PostgreSQL has evolved to handle JSONB and massive scale, making it a viable choice even for data types traditionally reserved for NoSQL. When building platforms like Inscribe, the relational integrity of Postgres ensures that users, posts, and likes stay consistent without complex application-level logic."
  }
];

async function main() {
  console.log("Cleaning Database...");
  // Ordered delete to avoid foreign key errors
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  console.log("Generating 12 Realistic Users...");
  const users = await Promise.all(
    Array.from({ length: 12 }).map(() => 
      prisma.user.create({
        data: {
          email: faker.internet.email().toLowerCase(),
          name: faker.person.fullName(),
          password: "hashed_password_placeholder", 
        }
      })
    )
  );

  console.log("Creating Professional Tags...");
  const tagNames = ['Engineering', 'Architecture', 'AI', 'OpenSource', 'Database', 'Career', 'Productivity'];
  const tags = await Promise.all(
    tagNames.map(name => prisma.tag.create({ data: { name } }))
  );

  console.log("Generating 20 Curated Blogs...");
  for (let i = 0; i < 20; i++) {
    const author = users[Math.floor(Math.random() * users.length)];
    const contentTemplate = TECH_CONTENT[i % TECH_CONTENT.length];
    const postTags = faker.helpers.arrayElements(tags, { min: 1, max: 2 });

    const post = await prisma.post.create({
      data: {
        title: contentTemplate.title + (i > 5 ? `: Part ${Math.floor(i/5)}` : ""),
        content: contentTemplate.content + "\n\n" + faker.lorem.paragraphs(2),
        authorId: author.id,
        published: true,
        tags: {
          connect: postTags.map(t => ({ id: t.id }))
        }
      }
    });

    // Random Likes (5-15 per post)
    const likers = faker.helpers.arrayElements(users, { min: 5, max: 12 });
    await Promise.all(likers.map(liker => 
      prisma.like.create({ data: { userId: liker.id, postId: post.id } })
    ));

    // Random Comments
    await prisma.comment.create({
      data: {
        content: "Great insights! This really cleared up my doubts about the architecture.",
        authorId: users[Math.floor(Math.random() * users.length)].id,
        postId: post.id
      }
    });
  }

  console.log("Database Seeded with Real Content! 🚀");
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());