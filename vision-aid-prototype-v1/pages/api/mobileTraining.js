import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await addData(req, res);
    } else if (req.method == 'GET') {
        return await readData(req, res);
    } else {
        return res.status(405).json({message: 'Method not allowed', success: false});
    }
}

async function readData(req, res) {

}

async function addData(req, res) {
    const body = req.body;
    const create = {
        data: {
            beneficiaryId: body.beneficiaryId,
            date: body.date,
            sessionNumber: body.sessionNumber,
            visionType: body.visionType,
            typeOfCounselling: body.typeOfCounselling,
            extraInformation: body.extraInformation,
        },
        include: {
            beneficiary: true
        },
    }
    try {
        const training = await prisma.mobile_Training.create(create)
        return res.status(200).json(training, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}