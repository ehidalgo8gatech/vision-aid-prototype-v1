import prisma from "client";

export async function getTrainingTypes() {
  var trainings = [];
  const tt = await prisma.training_Type.findMany({});
  for (const t of tt) {
    if (t.value == "Other") {
      continue;
    }
    trainings.push(t.value);
  }
  trainings.push("Other");
  return trainings;
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
  console.log(req.body.value);
  var training = await prisma.training_Type.findMany({
    where: {
      value: req.body.value,
    },
    orderBy: {
      id: "desc",
    },
    take: 1,
  });
  training = await prisma.training_Type.delete({
    where: {
      id: training[0].id,
    },
  });
  return res.status(200).json(training, { success: true });
}

async function updateData(req, res) {}

async function readData(req, res) {
  const training = await prisma.training_Type.findMany({});
  return res.status(200).json(training, { success: true });
}

async function addData(req, res) {
  const body = req.body;
  const create = {
    data: {
      value: body.value,
    },
  };
  try {
    const training = await prisma.training_Type.create(create);
    return res.status(200).json(training, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
