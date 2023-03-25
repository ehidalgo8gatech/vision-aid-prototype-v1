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
    let beneficiaryMirror = await readBeneficiaryMirror()
    const body = req.body;
    const update = {
        where: {
            id: beneficiaryMirror.id,
        },
        data: {
            phoneNumberRequired: body.phoneNumberRequired,
            educationRequired: body.educationRequired,
            occupationRequired: body.occupationRequired,
            districtsRequired: body.districtsRequired,
            stateRequired: body.stateRequired,
            diagnosisRequired: body.diagnosisRequired,
            visionRequired: body.visionRequired,
            mDVIRequired: body.mDVIRequired,
            extraInformationRequired: body.extraInformationRequired
        },
    }
    try {
        const beneficiary_Mirror = await prisma.beneficiary_Mirror.update(update)
        return res.status(200).json(beneficiary_Mirror, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}

export async function readBeneficiaryMirror() {
    return prisma.beneficiary_Mirror.findFirst({});
}