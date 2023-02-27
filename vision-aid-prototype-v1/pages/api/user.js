import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await addData(req, res);
  } else if (req.method == 'GET'){
    return await readData(req, res);
  }
  else {
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }
}

async function readData(req, res){
  try{
    const user = await prisma.user.findUnique({
      where: {
        email: req.query.email,
      },
      include: {
          role: true,
      },
    })
    return res.status(200).json(user, {success: true});
  } catch(error) {
    console.log(error)
    return res.status(500).json({error: "Error reading from database", success: false});
  }
}

async function addData(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.user.create({
      data: {
              email: body.email,
              role: {
                create:{
                  dataEntry: body.dataEntry,
                  admin: body.admin,
                  manager: body.manager
                }
              },
            },
      include: {
        role: true,
      },
    })
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.log('Request error ' + error);
    res.status(500).json({ error: 'Error adding user', success: false });
  }
}
