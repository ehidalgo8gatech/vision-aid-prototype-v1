const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const hospital = await prisma.hospital.create({
        data: {
            name: "SethHospital",
        },
        include: {
            hospitalRole: true,
        },
    })
    await prisma.user.create({
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
    await prisma.user.create({
        data: {
            email: "visionaidp11ad@gmail.com",
            admin: {
                create: {}
            },
        },
        include: {
            admin: true,
            hospitalRole: true
        },
    })
    const manager = await prisma.user.create({
        data: {
            email: "visionaidp11manager@gmail.com",
        },
        include: {
            admin: true,
            hospitalRole: true
        },
    })
    const tech = await prisma.user.create({
        data: {
            email: "visionaidp11tech@gmail.com",
        },
        include: {
            admin: true,
            hospitalRole: true
        },
    })
    await prisma.hospitalRole.create({
        data: {
            hospitalId: hospital.id,
            userId: manager.id,
            admin: true
        },
    })
    await prisma.hospitalRole.create({
        data: {
            hospitalId: hospital.id,
            userId: tech.id,
            admin: false
        },
    })
    await prisma.beneficiary_Mirror.create({
        data: {
            id: 1,
            phoneNumberRequired: true,
            educationRequired: true,
            occupationRequired: true,
            districtsRequired: true,
            stateRequired: true,
            diagnosisRequired: true,
            visionRequired: true,
            mDVIRequired: true,
            extraInformationRequired: "[{\"name\": \"extraField\", \"type\": \"text\", \"require\": \"true\"}]"
        },
    })
    await prisma.computer_Training_Mirror.create({
        data: {
            id: 1,
            date: true,
            sessionNumber: true,
            extraInformationRequired: "[]"
        },
    })
    await prisma.mobile_Training_Mirror.create({
        data: {
            id: 1,
            date: true,
            sessionNumber: true,
            extraInformationRequired: "[]"
        },
    })
    await prisma.orientation_Mobility_Training_Mirror.create({
        data: {
            id: 1,
            date: true,
            sessionNumber: true,
            extraInformationRequired: "[]"
        },
    })
    await prisma.vision_Enhancement_Mirror.create({
        data: {
            id: 1,
            date: true,
            sessionNumber: true,
            extraInformationRequired: "[]"
        },
    })
    await prisma.counselling_Education_Mirror.create({
        data: {
            id: 1,
            date: true,
            sessionNumber: true,
            typeCounselling: true,
            extraInformationRequired: "[]"
        },
    })
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