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
        } else {
            return findAllHospital()
        }
        return res.status(200).json(hospital, {success: true});
    } catch (error) {
        console.log(error)
        return res.status(500).json({error: "Error reading from database", success: false});
    }
}

export async function findAllHospital() {
    return prisma.hospital.findMany({
        include: {
            hospitalRole: true,
        },
    })
}

export async function getSummaryForAllHospitals() {
  const hospitals = await prisma.hospital.findMany();

  const result = [];

  for (const hospital of hospitals) {
    const mobileTrainingCount = await prisma.mobile_Training.count({
      where: {
        beneficiary: {
          hospitalId: hospital.id
        }
      }
    });

    const computerTrainingCount = await prisma.computer_Training.count({
      where: {
        beneficiary: {
          hospitalId: hospital.id
        }
      }
    });

    const orientationMobilityTrainingCount = await prisma.orientation_Mobility_Training.count({
      where: {
        beneficiary: {
          hospitalId: hospital.id
        }
      }
    });

    const visionEnhancementCount = await prisma.vision_Enhancement.count({
      where: {
        beneficiary: {
          hospitalId: hospital.id
        }
      }
    });

    const counsellingEducationCount = await prisma.counselling_Education.count({
      where: {
        beneficiary: {
          hospitalId: hospital.id
        }
      }
    });

    const comprehensiveLowVisionEvaluationCount = await prisma.comprehensive_Low_Vision_Evaluation.count({
      where: {
        beneficiary: {
          hospitalId: hospital.id
        }
      }
    });

    const beneficiaryCount = await prisma.beneficiary.count({
      where: {
        hospitalId: hospital.id
      }
    });

    const totalTrainingCount =
      mobileTrainingCount +
      computerTrainingCount +
      orientationMobilityTrainingCount +
      visionEnhancementCount +
      counsellingEducationCount +
      comprehensiveLowVisionEvaluationCount;

    const hospitalResult = {
      id: hospital.id,
      name: hospital.name,
      mobileTraining: mobileTrainingCount,
      computerTraining: computerTrainingCount,
      orientationMobilityTraining: orientationMobilityTrainingCount,
      visionEnhancement: visionEnhancementCount,
      counsellingEducation: counsellingEducationCount,
      comprehensiveLowVisionEvaluation: comprehensiveLowVisionEvaluationCount,
      totalTraining: totalTrainingCount,
      beneficiary: beneficiaryCount
    };

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
        return res.status(200).json(newEntry, {success: true});
    } catch (error) {
        console.log('Request error ' + error);
        return res.status(500).json({error: 'Error adding user' + error, success: false});
    }
}
