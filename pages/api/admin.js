import { authenticate } from '@/middleware/auth';
import prisma from 'client';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        return await addData(req, res);
    }
}

const withAuth = (handler) => {
  return async (req, res) => {
    await authenticate(req, res, () => {
      handler(req, res);
    });
  };
};

export default withAuth(handler);

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