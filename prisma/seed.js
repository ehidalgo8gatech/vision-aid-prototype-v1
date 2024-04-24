const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient()
const cr_date = new Date();

async function main() {
    const hospital = await prisma.hospital.create({
        data: {
            name: "SethHospital",
        },
        include: {
            hospitalRole: true,
        },
    })
    const hospital2 = await prisma.hospital.create({
        data: {
            name: "SuryatejHospital",
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
    await prisma.comprehensive_Low_Vision_Evaluation_Mirror.create({
        data: {
            id: 1,
            extraInformationRequired: "[]"
        },
    })
    await prisma.training_Type.create({
        data: {
            id: 1,
            value: "Other"
        },
    })
    await prisma.training_Type.create({
        data: {
            id: 2,
            value: "Computer"
        },
    })
    await prisma.training_Type.create({
        data: {
            id: 3,
            value: "Orientation & Mobility Training"
        },
    })
    await prisma.training_Type.create({
        data: {
            id: 4,
            value: "Mobile"
        },
    })
    await prisma.counselling_Type.create({
        data: {
            id: 1,
            value: "Other"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 1,
            trainingTypeId: 1,
            value: "Other"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 2,
            trainingTypeId: 2,
            value: "Other"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 3,
            trainingTypeId: 3,
            value: "Other"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 4,
            trainingTypeId: 4,
            value: "Other"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 5,
            trainingTypeId: 1,
            value: "Braille training"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 6,
            trainingTypeId: 2,
            value: "Certificate course in Computer Applications – CCA"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 7,
            trainingTypeId: 3,
            value: "Training for Eye-hand coordination"
        },
    })
    await prisma.training_Sub_Type.create({
        data: {
            id: 8,
            trainingTypeId: 4,
            value: "Certificate course in Mobile technology - MT"
        },
    })
    await prisma.landing_Page.create({
        data: {
          id: 1,
          title: "post-1",
          content: "This is some content",
          creationDate: new Date(),
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
