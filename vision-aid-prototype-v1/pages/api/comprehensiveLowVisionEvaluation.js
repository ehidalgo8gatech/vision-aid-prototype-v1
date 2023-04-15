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
            distanceVisualAcuityRE: body.distanceVisualAcuityRE,
            distanceVisualAcuityLE: body.distanceVisualAcuityLE,
            nearVisualAcuityRE: body.nearVisualAcuityRE,
            nearVisualAcuityLE: body.nearVisualAcuityLE,
            recommendations: body.recommendations,
            extraInformation: body.extraInformation,
        },
        include: {
            beneficiary: true
        },
    }
    try {
        if (body.id != null) {
            const update = {
                where: {
                    id: body.id,
                },
                data: {
                    distanceVisualAcuityRE: body.distanceVisualAcuityRE,
                    distanceVisualAcuityLE: body.distanceVisualAcuityLE,
                    nearVisualAcuityRE: body.nearVisualAcuityRE,
                    nearVisualAcuityLE: body.nearVisualAcuityLE,
                    recommendations: body.recommendations,
                    extraInformation: body.extraInformation,
                },
                include: {
                    beneficiary: true
                },
            }
            const comp_eval = await prisma.comprehensive_Low_Vision_Evaluation.update(update)
            return res.status(200).json(comp_eval, {success: true});
        }
        const comp_eval = await prisma.comprehensive_Low_Vision_Evaluation.create(create)
        return res.status(200).json(comp_eval, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}