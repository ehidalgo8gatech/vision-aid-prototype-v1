const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const seth = await prisma.user.create({
        data: {
            email: "sethlevine111@gmail.com",
            admin: {
                create: {}
            },
        },
        include: {
            admin: true,
            hospitalRole: true
        },
    })
    const sethHospital = await prisma.hospital.create({
        data: {
            name: "SethHospital",
        },
        include: {
            hospitalRole: true,
        },
    })
    console.log(JSON.stringify(seth) + " " + JSON.stringify(sethHospital))
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