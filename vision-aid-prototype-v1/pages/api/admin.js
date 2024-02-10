import prisma from 'client';

export default async function handler(req, res) {
    if (req.method === 'POST') {
        return await addData(req, res);
    }
}

async function addData(req, res) {
    const body = req.body;
    const create = {
        data: {
            userId: body.userId,
        }
    }
    console.log("Request body " + JSON.stringify(body) + " create value " + JSON.stringify(create))

    try {
        const newEntry = await prisma.admin.create(create)
        return res.status(200).json(newEntry, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}