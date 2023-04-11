import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

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
                    hospital: true,
                    Computer_Training: true,
                    Mobile_Training: true,
                    Orientation_Mobility_Training: true
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
                    hospital: true,
                    Computer_Training: true,
                    Mobile_Training: true,
                    Orientation_Mobility_Training: true
                }
            })
        } else {
            beneficiary = await prisma.beneficiary.findMany({
                include: {
                hospital: true,
                    Computer_Training: true,
                    Mobile_Training: true,
                    Orientation_Mobility_Training: true
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
            hospital: true,
            Computer_Training: true,
            Mobile_Training: true,
            Orientation_Mobility_Training: true
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

async function updateData(req, res) {
    try {
        const { mrn, ...data } = req.body;
        const updatedUser = await prisma.beneficiary.update({
          where: { mrn },
          data,
        });
        res.status(200).json(updatedUser);
      } catch (error) {
        console.log(error);
        res.status(400).json({ error: 'Failed to update user data.' });
    }
}