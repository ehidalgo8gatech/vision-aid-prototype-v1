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
            typeCounselling: body.typeCounselling,
            MDVI: body.MDVI,
            extraInformation: body.extraInformation,
        },
        include: {
            beneficiary: true
        },
    }
    try {
        const counselling = await prisma.counselling_Education.create(create)
        return res.status(200).json(counselling, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}