import prisma from 'client';
import { getServerSession } from 'next-auth';
import { authOptions } from './auth/[...nextauth]';
import { updateUserLastModified } from '@/global/update-user-last-modified';

export default async function handler(req, res) {
    const session = await getServerSession(req, res, authOptions)
  
    if (!session) {
      res.status(401).json({ message: "You must be logged in." })
      return
    }
    await updateUserLastModified(prisma, 'admin', req.method, session.user.email);
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