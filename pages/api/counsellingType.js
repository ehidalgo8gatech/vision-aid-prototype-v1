import prisma from "client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { updateUserLastModified } from "@/global/update-user-last-modified";

export async function getCounsellingType() {
  var trainings = [];
  const ct = await prisma.counselling_Type.findMany({});
  for (const t of ct) {
    if (t.value == "Other") {
      continue;
    }
    trainings.push(t.value);
  }
  trainings.push("Other");
  return trainings;
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." })
    return
  }
  await updateUserLastModified(prisma, 'cousellingType', req.method, session.user.email);
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
  var counseling = await prisma.counselling_Type.findMany({
    where: {
      value: req.body.value,
    },
    orderBy: {
      id: "desc",
    },
    take: 1,
  });
  counseling = await prisma.counselling_Type.delete({
    where: {
      id: counseling[0].id,
    },
  });
  return res.status(200).json(counseling, { success: true });
}

async function updateData(req, res) {}

async function readData(req, res) {
  const counseling = await prisma.counselling_Type.findMany({});
  return res.status(200).json(counseling, { success: true });
}

export const readCounsellingType = async () => {
  const counseling = await prisma.counselling_Type.findMany({});
  return counseling;
};

async function addData(req, res) {
  const body = req.body;
  const create = {
    data: {
      value: body.value,
    },
  };
  try {
    const training = await prisma.counselling_Type.create(create);
    return res.status(200).json(training, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
