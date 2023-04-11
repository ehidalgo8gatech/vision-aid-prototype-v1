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
        const hospitalRole = getHospitalRoleByUserId(req.query.userId, res)
        return res.status(200).json(hospitalRole, {success: true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error reading from database " + error, success: false});
    }
}

export async function getHospitalRoleByUserId(userId) {
    return prisma.hospitalRole.findUnique({
        where: {
            userId: userId,
        },
        include: {
            hospital: true,
            user: true,
        },
    })
}

async function addData(req, res) {
    const body = req.body;
    const hospitalRole = await prisma.hospitalRole.findUnique({
        where: {
            userId: req.body.userId
        }})
    const update = {
        where: {
            id: hospitalRole == null ? null : hospitalRole.id
        },
        data: {
            admin: req.body.admin,
        },
    }
    const create = {
        data: {
            userId: body.userId,
            hospitalId: body.hospitalId,
            admin: body.admin,
        },
    }

    try {
        var newEntry
        if (hospitalRole != null) {
            newEntry = await prisma.hospitalRole.update(update)
        } else {
            newEntry = await prisma.hospitalRole.create(create)
        }
        return res.status(200).json(newEntry, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}
