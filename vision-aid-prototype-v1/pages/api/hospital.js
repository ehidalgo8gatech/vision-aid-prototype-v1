import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return await addData(req, res);
  } else if (req.method == 'GET') {
    return await readData(req, res);
  } else {
    return res.status(405).json({ message: 'Method not allowed', success: false });
  }
}

async function readData(req, res) {
  try {
    var hospital
    if (req.query.name != null) {
      hospital = await prisma.hospital.findUnique({
        where: {
          name: req.query.name,
        },
        include: {
          hospitalRole: true,
        },
      })
    } else if (req.query.id != null) {
      hospital = await prisma.hospital.findUnique({
        where: {
          id: req.query.id,
        },
        include: {
          hospitalRole: true,
        },
      })
    } else {
      return findAllHospital()
    }
    return res.status(200).json(hospital, { success: true });
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: "Error reading from database", success: false });
  }
}

export async function findAllHospital() {
  return prisma.hospital.findMany({
    include: {
      hospitalRole: true,
    },
  })
}

export async function summaryHelper(hospital) {
  //prisma map dates to strings
  const mobileTraining = await prisma.mobile_Training.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const computerTraining = await prisma.computer_Training.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const orientationMobilityTraining = await prisma.orientation_Mobility_Training.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const visionEnhancement = await prisma.vision_Enhancement.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const counsellingEducation = await prisma.counselling_Education.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const comprehensiveLowVisionEvaluation = await prisma.comprehensive_Low_Vision_Evaluation.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const lowVisionEvaluation = await prisma.Low_Vision_Evaluation.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });

  const beneficiary = await prisma.beneficiary.findMany({
    where: {
      hospitalId: hospital.id
    }
  });

  const training = await prisma.Training.findMany({
    where: {
      beneficiary: {
        hospitalId: hospital.id
      }
    }
  });


  const hospitalResult = {
    id: hospital.id,
    name: hospital.name,
    mobileTraining: mobileTraining,
    computerTraining: computerTraining,
    orientationMobilityTraining: orientationMobilityTraining,
    visionEnhancement: visionEnhancement,
    counsellingEducation: counsellingEducation,
    comprehensiveLowVisionEvaluation: comprehensiveLowVisionEvaluation,
    lowVisionEvaluation: lowVisionEvaluation,
    beneficiary: beneficiary,
    training: training,
  };

  return hospitalResult;
}

export async function getSummaryForHospitalFromID(hospitalId){
  const hospital = await prisma.hospital.findUnique({
    where: {
      id: hospitalId,
    },
    include: {
      hospitalRole: true,
    },
  })
  return await summaryHelper(hospital);
}

export async function getSummaryForAllHospitals() {
  const hospitals = await prisma.hospital.findMany();
  const result = [];
  for (const hospital of hospitals) {
    const hospitalResult = await summaryHelper(hospital);
    result.push(hospitalResult);
  }
  return result;
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
    const newEntry = await prisma.hospital.create(create)
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.log('Request error ' + error);
    return res.status(500).json({ error: 'Error adding user' + error, success: false });
  }
}
