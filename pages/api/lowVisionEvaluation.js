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
  await updateUserLastModified(prisma, 'lowVisionEvaluation', req.method, session.user.email);
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
    const updatedUser = await prisma.low_Vision_Evaluation.update({
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
    const comp_eval = await prisma.low_Vision_Evaluation.delete({
      where: { id: body.id },
    });
    return res.status(200).json(comp_eval, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error deleting Low Vision Evaluation Data" + error, success: false });
  }
}

async function addData(req, res) {
  const body = req.body;
  const create = {
    data: {
      beneficiaryId: body.beneficiaryId,
      mdvi: body.mdvi,
      diagnosis: body.diagnosis,
      date: body.date,
      sessionNumber: body.sessionNumber,
      distanceVisualAcuityRE: body.distanceVisualAcuityRE,
      distanceVisualAcuityLE: body.distanceVisualAcuityLE,
      distanceBinocularVisionBE: body.distanceBinocularVisionBE,
      nearVisualAcuityRE: body.nearVisualAcuityRE,
      nearVisualAcuityLE: body.nearVisualAcuityLE,
      nearBinocularVisionBE: body.nearBinocularVisionBE,
      recommendationSpectacle: body.recommendationSpectacle,
      recommendationOptical: body.recommendationOptical,
      recommendationNonOptical: body.recommendationNonOptical,
      recommendationElectronic: body.recommendationElectronic,
      extraInformation: body.extraInformation,
    },
    include: {
      beneficiary: true,
    },
  };
  try {
    if (body.id != null) {
      const update = {
        where: {
          id: body.id,
        },
        data: {
          mdvi: body.mdvi,
          diagnosis: body.diagnosis,
          date: body.date,
          sessionNumber: body.sessionNumber,
          distanceVisualAcuityRE: body.distanceVisualAcuityRE,
          distanceVisualAcuityLE: body.distanceVisualAcuityLE,
          distanceBinocularVisionBE: body.distanceBinocularVisionBE,
          nearVisualAcuityRE: body.nearVisualAcuityRE,
          nearVisualAcuityLE: body.nearVisualAcuityLE,
          nearBinocularVisionBE: body.nearBinocularVisionBE,
          recommendationSpectacle: body.recommendationSpectacle,
          recommendationOptical: body.recommendationOptical,
          recommendationNonOptical: body.recommendationNonOptical,
          recommendationElectronic: body.recommendationElectronic,
          extraInformation: body.extraInformation,
        },
        include: {
          beneficiary: true,
        },
      };
      const comp_eval = await prisma.low_Vision_Evaluation.update(update);
      return res.status(200).json(comp_eval, { success: true });
    }
    const comp_eval = await prisma.low_Vision_Evaluation.create(create);
    return res.status(200).json(comp_eval, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}
