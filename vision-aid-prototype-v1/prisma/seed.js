const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const seth = await prisma.user.create({
    data: {
      email: "sethlevine111@gmail.com",
      role: {
        create:{
          dataEntry: true,
          admin: true,
          manager: true
        }
      },
    },
    include: {
      role: true,
    },
  })
  console.log({ seth })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })