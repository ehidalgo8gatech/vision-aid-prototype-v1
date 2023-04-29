import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export async function getCounsellingType() {
    var trainings = []
    const  ct = await prisma.counselling_Type.findMany({})
    ct.forEach(t => {
        trainings.push(t.value)
    })
    return trainings
}

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await addData(req, res);
    } else if (req.method == 'GET') {
        return await readData(req, res);
    } else if (req.method == 'PATCH') {
        return await updateData(req, res);
    } else {
        return res.status(405).json({message: 'Method not allowed', success: false});
    }
}

async function updateData(req, res) {

}

async function readData(req, res) {

}

async function addData(req, res) {
    const body = req.body;
    const create = {
        data: {
            value: body.value,
        },
    }
    try {
        const training = await prisma.counselling_Type.create(create)
        return res.status(200).json(training, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}