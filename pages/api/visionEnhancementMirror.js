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
  let visionEnhancementMirror = await readVisionEnhancementMirror(
    await prisma.hospital.findFirst({
      where: {
        name: body.hospitalNameOverride,
      },
    })
  );
  const update = {
    where: {
      id: visionEnhancementMirror.id,
    },
    data: {
      extraInformationRequired: body.extraInformationRequired,
    },
  };
  try {
    const vision_Enhancement_Mirror =
      await prisma.vision_Enhancement_Mirror.update(update);
    return res.status(200).json(vision_Enhancement_Mirror, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}

export async function readVisionEnhancementMirror(hospital) {
  if (hospital != null && hospital.name != null) {
    const bm = await prisma.vision_Enhancement_Mirror.findFirst({
      where: {
        hospitalName: hospital.name,
      },
    });
    if (bm != null) return bm;
    return prisma.vision_Enhancement_Mirror.create({
      data: {
        id: Math.ceil(Math.random() * (2000000000 - 2) + 2),
        hospitalName: hospital.name,
        date: true,
        sessionNumber: true,
        extraInformationRequired: "[]",
      },
    });
  }
  return prisma.vision_Enhancement_Mirror.findFirst({});
}
