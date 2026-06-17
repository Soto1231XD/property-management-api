import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const seedUser = {
  name: 'Jenny Rivera',
  email: 'admtamivar30@gmail.com',
  password: '%Jzf2IC@0h2/',
};

async function main() {
  const hashedPassword = await bcrypt.hash(seedUser.password, 10);

  await prisma.user.upsert({
    where: {
      email: seedUser.email,
    },
    update: {
      name: seedUser.name,
      password: hashedPassword,
    },
    create: {
      name: seedUser.name,
      email: seedUser.email,
      password: hashedPassword,
    },
  });

  console.log(`Seed user ready: ${seedUser.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
