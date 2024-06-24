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
  let counsellingEducationMirror = await readCounsellingEducationMirror(
    await prisma.hospital.findFirst({
      where: {
        name: body.hospitalNameOverride,
      },
    })
  );
  const update = {
    where: {
      id: counsellingEducationMirror.id,
    },
    data: {
      extraInformationRequired: body.extraInformationRequired,
      typeCounselling: body.typeCounselling,
    },
  };
  try {
    const counselling_Education_Mirror =
      await prisma.counselling_Education_Mirror.update(update);
    return res
      .status(200)
      .json(counselling_Education_Mirror, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}

export async function readCounsellingEducationMirror(hospital) {
  if (hospital != null && hospital.name != null) {
    const bm = await prisma.counselling_Education_Mirror.findFirst({
      where: {
        hospitalName: hospital.name,
      },
    });
    if (bm != null) return bm;
    return prisma.counselling_Education_Mirror.create({
      data: {
        id: Math.ceil(Math.random() * (2000000000 - 2) + 2),
        hospitalName: hospital.name,
        date: true,
        sessionNumber: true,
        typeCounselling: true,
        extraInformationRequired: "[]",
      },
    });
  }
  return prisma.counselling_Education_Mirror.findFirst({});
}
