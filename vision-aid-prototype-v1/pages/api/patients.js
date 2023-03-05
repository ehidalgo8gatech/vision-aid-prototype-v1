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
    if (req.query.hospitalId != null) {
      const patients = await prisma.Beneficiary.findMany(
          {
            where: {
              hospitalId: req.query.hospitalId,
            },
          }
      );
      return res.status(200).json(patients, {success: true});
    }
    const patients = await prisma.Beneficiary.findMany();
    return res.status(200).json(patients, {success: true});
  } catch(error) {
    console.log(error)
    return res.status(500).json({error: "Error reading from database", success: false});
  }
}

async function addData(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.Beneficiary.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        mrn: body.mrn,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        phoneNumber: body.phoneNumber,
        Education: body.Education,
        Occupation: body.Occupation,
        Districts: body.Districts,
        State: body.State,
        Diagnosis: body.Diagnosis
      }
    })
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ error: 'Error adding patient information', success: false });
  }
}
