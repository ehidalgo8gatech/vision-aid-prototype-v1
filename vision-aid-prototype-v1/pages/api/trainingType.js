import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();
export async function getTrainingTypes(){
    var trainings = []
     const tt = await prisma.training_Type.findMany({})
         tt.forEach(t => {
        trainings.push(t.value)
    })
    return trainings
}

export async function getCounsellingType() {
    var trainings = []
    const  ct = await prisma.counselling_Type.findMany({})
        ct.forEach(t => {
        trainings.push(t.value)
    })
    return trainings
}