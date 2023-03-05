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
        const user = await prisma.hospital.findUnique({
            where: {
                name: req.query.name,
            },
            include: {
                hospitalRole: true,
            },
        })
        return res.status(200).json(user, {success: true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error reading from database", success: false});
    }
}

async function addData(req, res) {
    const body = req.body;
    const create = {
        data: {
            name: body.name,
        },
        include: {
            hospitalRole: true,
        }
    }
    console.log("Request body " + JSON.stringify(body) + " create value " + JSON.stringify(create))

    try {
        const newEntry = await prisma.user.create(create)
        return res.status(200).json(newEntry, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}
