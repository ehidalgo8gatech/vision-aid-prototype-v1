import prisma from "client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { updateUserLastModified } from "@/global/update-user-last-modified";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." })
    return
  }
  await updateUserLastModified(prisma, 'counsellingEducation', req.method, session.user.email);
  if (req.method === "POST") {
    return await addData(req, res);
  } else if (req.method == "DELETE") {
    return await deleteData(req, res);
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
    const updatedUser = await prisma.counselling_Education.update({
      where: { id },
      data,
    });
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Failed to update user data." });
  }
}

async function readData(req, res) {}

async function deleteData(req, res) {
  const body = req.body;
  try {
    const comp_eval = await prisma.counselling_Education.delete({
      where: { id: body.id },
    });
    return res.status(200).json(comp_eval, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error deleting Counseling data" + error, success: false });
  }
}

async function addData(req, res) {
  const body = req.body;
  const create = {
    data: {
      beneficiaryId: body.beneficiaryId,
      date: body.date,
      sessionNumber: body.sessionNumber,
      vision: body.vision,
      typeCounselling: body.typeCounselling,
      MDVI: body.MDVI,
      type: body.type,
      extraInformation: body.extraInformation,
    },
    include: {
      beneficiary: true,
    },
  };
  try {
    const counselling = await prisma.counselling_Education.create(create);
    return res.status(200).json(counselling, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
