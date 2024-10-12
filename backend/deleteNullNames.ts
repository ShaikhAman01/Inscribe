import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const deleteEmptyNames = async () => {
  try {
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        name: null, // Adjust if you're looking for empty strings instead of NULL
      },
    });
    console.log(`Deleted ${deletedUsers.count} users with empty names.`);
  } catch (error) {
    console.error('Error deleting users with empty names:', error);
  } finally {
    await prisma.$disconnect();
  }
};

deleteEmptyNames();
