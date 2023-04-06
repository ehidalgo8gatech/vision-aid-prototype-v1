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
    try {
        var beneficiary
        if (req.query.beneficiaryName != null) {
            beneficiary = await prisma.beneficiary.findMany({
                where: {
                    beneficiaryName: {
                        contains: req.query.beneficiaryName,
                    }
                },
                include: {
                    hospital: true
                }
            })
        } else if (req.query.mrn != null) {
            beneficiary = await prisma.beneficiary.findFirst({
                where: {
                    mrn: {
                        contains: req.query.mrn,
                    }
                },
                include: {
                    hospital: true
                }
            })
        } else {
            beneficiary = await prisma.beneficiary.findMany({
                include: {
                hospital: true
            }
            })
        }
        return res.status(200).json(beneficiary, {success: true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error reading from database", success: false});
    }
}

async function addData(req, res) {
    const body = req.body;
    const create = {
        data: {
            mrn: body.mrn,
            beneficiaryName: body.beneficiaryName,
            hospitalId: body.hospitalId,
            dateOfBirth: body.dateOfBirth,
            gender: body.gender,
            phoneNumber: body.phoneNumber,
            education: body.education,
            occupation: body.occupation,
            districts: body.districts,
            state: body.state,
            diagnosis: body.diagnosis,
            vision: body.vision,
            mDVI: body.mDVI,
            extraInformation: body.extraInformation
        },
        include: {
            hospital: true
        },
    }
    try {
        const beneficiary = await prisma.beneficiary.create(create)
        return res.status(200).json(beneficiary, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}