import prisma from "client";

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await addData(req, res);
  } else if (req.method == "GET") {
    return await readData(req, res);
  } else if (req.method == "PATCH") {
    return await updateData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function updateData(req, res) {
  try {
    const { id, ...data } = req.body;
    const updatedUser = await prisma.vision_Enhancement.update({
      where: { id },
      data,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update user data." });
  }
}

async function readData(req, res) {
  try {
    var training;
    if (req.query.beneficiaryId != null) {
      training = await prisma.vision_Enhancement.findMany({
        where: {
          beneficiaryId: {
            contains: req.query.beneficiaryId,
          },
        },
        include: {
          beneficiary: true,
        },
      });
    } else {
      training = await prisma.vision_Enhancement.findMany({
        include: {
          beneficiary: true,
        },
      });
    }
    return res.status(200).json(training, { success: true });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ error: "Error reading data" + error, success: false });
  }
}

async function addData(req, res) {
  const body = req.body;
  const create = {
    data: {
      beneficiaryId: body.beneficiaryId,
      date: body.date,
      sessionNumber: body.sessionNumber,
      Diagnosis: body.Diagnosis,
      MDVI: body.MDVI,
      extraInformation: body.extraInformation,
    },
    include: {
      beneficiary: true,
    },
  };
  try {
    const training = await prisma.vision_Enhancement.create(create);
    return res.status(200).json(training, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
