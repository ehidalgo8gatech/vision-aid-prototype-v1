import prisma from "client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await addData(req, res);
  } else if (req.method == "GET") {
    return await readData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function readData(req, res) {}

async function addData(req, res) {
  const body = req.body;
  let comprehensiveLowVisionEvaluationMirror =
    await readComprehensiveLowVisionEvaluationMirror(
      await prisma.hospital.findFirst({
        where: {
          name: body.hospitalNameOverride,
        },
      })
    );
  const update = {
    where: {
      id: comprehensiveLowVisionEvaluationMirror.id,
    },
    data: {
      extraInformationRequired: body.extraInformationRequired,
    },
  };
  try {
    const comprehensive_low_vision_evaluation_mirror =
      await prisma.comprehensive_Low_Vision_Evaluation_Mirror.update(update);
    return res
      .status(200)
      .json(comprehensive_low_vision_evaluation_mirror, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}

export async function readComprehensiveLowVisionEvaluationMirror(hospital) {
  if (hospital != null && hospital.name != null) {
    const bm =
      await prisma.comprehensive_Low_Vision_Evaluation_Mirror.findFirst({
        where: {
          hospitalName: hospital.name,
        },
      });
    if (bm != null) return bm;
    return prisma.comprehensive_Low_Vision_Evaluation_Mirror.create({
      data: {
        id: Math.ceil(Math.random() * (2000000000 - 2) + 2),
        hospitalName: hospital.name,
        extraInformationRequired: "[]",
      },
    });
  }
  return prisma.comprehensive_Low_Vision_Evaluation_Mirror.findFirst({});
}
