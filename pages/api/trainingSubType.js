import prisma from "client";

export async function getTrainingSubTypes() {
  let ttOther = await prisma.training_Sub_Type.findMany({
    include: {
      trainingType: true,
    },
    where: {
      value: "Other",
    },
  });
  const ttNotOther = await prisma.training_Sub_Type.findMany({
    include: {
      trainingType: true,
    },
    where: {
      NOT: {
        value: "Other",
      },
    },
  });
  ttOther.forEach((o) => {
    ttNotOther.push(o);
  });
  return ttNotOther;
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    return await addData(req, res);
  } else if (req.method == "GET") {
    return await readData(req, res);
  } else if (req.method == "PATCH") {
    return await updateData(req, res);
  } else if (req.method == "DELETE") {
    return await deleteData(req, res);
  } else {
    return res
      .status(405)
      .json({ message: "Method not allowed", success: false });
  }
}

async function deleteData(req, res) {
  const training = await prisma.training_Sub_Type.delete({
    where: {
      id: req.body.id,
    },
  });
  return res.status(200).json(training, { success: true });
}

async function updateData(req, res) {}

async function readData(req, res) {
  const training = await prisma.training_Sub_Type.findMany({
    include: {
      trainingType: true,
    },
  });
  return res.status(200).json(training, { success: true });
}

async function addData(req, res) {
  const body = req.body;
  const trainingType = await prisma.training_Type.findFirst({
    where: {
      value: body.trainingTypeId,
    },
  });
  const create = {
    data: {
      value: body.value,
      trainingTypeId: trainingType.id,
    },
  };
  try {
    const training = await prisma.training_Sub_Type.create(create);
    return res.status(200).json(training, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
