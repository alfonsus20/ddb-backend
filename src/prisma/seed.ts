import { prisma } from "../utils/db";
import bcryptjs from "bcryptjs";

async function main() {
  const hashedPassword = await bcryptjs.hash("passwordAdmin", 12);
  await prisma.user.create({
    data: {
      name: "Admin",
      email: "admin@gmail.com",
      majority: "Teknik Informatika",
      entryYear: 2019,
      password: hashedPassword,
    },
  });
}

main()
  .catch((e) => {
    console.log(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
