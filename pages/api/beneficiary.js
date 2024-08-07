import prisma from "client";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { updateUserLastModified } from "@/global/update-user-last-modified";
import { read } from "xlsx-js-style";

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (!session) {
    res.status(401).json({ message: "You must be logged in." })
    return
  }
  await updateUserLastModified(prisma, 'beneficiary', req.method, session.user.email);
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

export const readBeneficiaryMrn = async (mrn) => {
  try {
    const beneficiary = await prisma.beneficiary.findUnique({
      where: {
        mrn: mrn,
        deleted: false,
      },
      include: {
        hospital: true,
        Computer_Training: true,
        Mobile_Training: true,
        Orientation_Mobility_Training: true,
        Vision_Enhancement: true,
        Comprehensive_Low_Vision_Evaluation: true,
        Counselling_Education: true,
        Low_Vision_Evaluation: true,
        Training: true,
      },
    });
    return beneficiary;
  } catch (error) {
    console.log(error);
    return { error: "Couldn't read from db" };
  }
}

export const readBeneficiaryOtherParam = async (otherParam) => {
  try {
    const hospitalList = await prisma.hospital.findMany({
      where: {
        name: {
          contains: otherParam,
        },
      },
    });
    var hospitalId = [];
    if (hospitalList != null && hospitalList.length > 0) {
      hospitalList.forEach((hospital) => {
        hospitalId.push(hospital.id);
      });
    }
    const beneficiary = await prisma.beneficiary.findMany({
      where: {
        OR: [
          {
            beneficiaryName: {
              contains: otherParam,
            },
          },
          {
            hospitalId: { in: hospitalId },
          },
          {
            mrn: {
              contains: otherParam,
            },
          },
          {
            phoneNumber: {
              contains: otherParam,
            },
          },
        ],
        deleted: false,
      },
      include: {
        hospital: true,
        Computer_Training: true,
        Mobile_Training: true,
        Orientation_Mobility_Training: true,
        Vision_Enhancement: true,
        Comprehensive_Low_Vision_Evaluation: true,
        Counselling_Education: true,
        Low_Vision_Evaluation: true,
        Training: true,
      },
    });
    return beneficiary;
  } catch (error) {
    console.log(error);
    return { error: "Couldn't read from db" };
  }
}

async function readData(req, res) {
  try {
    var beneficiary;
    if (req.query.otherParam != null) {
      beneficiary = await readBeneficiaryOtherParam(req.query.otherParam);
    } else if (req.query.mrn != null) {
      beneficiary = await readBeneficiaryMrn(req.query.mrn);
    } else if (req.query.beneficiaryName != '') {
      beneficiary = await prisma.beneficiary.findMany({
        where: {
          beneficiaryName: {
            contains: req.query.beneficiaryName,
          },
          deleted: false,
        },
        include: {
          hospital: true,
          Computer_Training: true,
          Mobile_Training: true,
          Orientation_Mobility_Training: true,
          Vision_Enhancement: true,
          Comprehensive_Low_Vision_Evaluation: true,
          Counselling_Education: true,
          Low_Vision_Evaluation: true,
          Training: true,
        },
      });
    } else {
      beneficiary = [];
    }
    return res.status(200).json(beneficiary, { success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}

async function addData(req, res) {
  const body = req.body;
  if (
    (await prisma.beneficiary.findUnique({
      where: {
        mrn: body.mrn,
      },
    })) != null
  ) {
    return res.status(500).json({
      error: "Error adding user mrn " + body.mrn + " already in db",
      success: false,
    });
  }
  const create = {
    data: {
      mrn: body.mrn,
      beneficiaryName: body.beneficiaryName,
      hospitalId: body.hospitalId,
      dateOfBirth: body.dateOfBirth,
      gender: body.gender,
      phoneNumber: body.phoneNumber,
      education: body.education,
      occupation: body.occupation,
      districts: body.districts,
      state: body.state,
      diagnosis: body.diagnosis,
      vision: body.vision,
      mDVI: body.mDVI,
      extraInformation: body.extraInformation,
      consent: body.consent,
      deleted: false,
    },
    include: {
      hospital: true,
      Computer_Training: true,
      Mobile_Training: true,
      Orientation_Mobility_Training: true,
      Training: true,
    },
  };
  try {
    const beneficiary = await prisma.beneficiary.create(create);
    return res.status(200).json(beneficiary, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    return res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}

async function updateData(req, res) {
  if (req.body.mrn) {
    try {
      const { mrn, ...data } = req.body;
      if (data.dateOfBirth != undefined){
        data.dateOfBirth = (new Date(data.dateOfBirth)).toISOString();
      }
      const updatedUser = await prisma.beneficiary.update({
        where: { mrn },
        data,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Failed to update user data." });
    }
  } else if (req.body.hospitalId) {
    try {
      const { hospitalId, ...data } = req.body;
      const updatedUser = await prisma.beneficiary.updateMany({
        where: { hospitalId },
        data,
      });
      res.status(200).json(updatedUser);
      // return updatedUser;
    } catch (error) {
      console.log(error);
      res.status(400).json({ error: "Failed to update user data." });
    }
  }
}

export async function findAllBeneficiary(isAdmin, hospitalIds) {
  let beneficiaries;
  if (isAdmin) {
    beneficiaries = prisma.beneficiary.findMany({
      include: {
        hospital: true,
        Vision_Enhancement: true,
        Counselling_Education: true,
        Comprehensive_Low_Vision_Evaluation: true,
        Low_Vision_Evaluation: true,
        Training: true,
        Computer_Training: true,
        Mobile_Training: true,
        Orientation_Mobility_Training: true,
      },
      where: {
        deleted: false,
      },
    });
  } else {
    beneficiaries = prisma.beneficiary.findMany({
      include: {
        hospital: true,
        Vision_Enhancement: true,
        Counselling_Education: true,
        Comprehensive_Low_Vision_Evaluation: true,
        Low_Vision_Evaluation: true,
        Training: true,
        Computer_Training: true,
        Mobile_Training: true,
        Orientation_Mobility_Training: true,
      },
      where: {
        deleted: false,
        hospitalId: {in: hospitalIds}
      },
    });
  }

  return beneficiaries;
}

export async function findAllBeneficiaryForHospitalId(hospitalId) {
  try {
    const beneficiary = await prisma.beneficiary.findMany({
      where: {
        hospitalId: hospitalId,
        deleted: false,
      },
      include: {
        hospital: true,
        Computer_Training: true,
        Mobile_Training: true,
        Orientation_Mobility_Training: true,
        Vision_Enhancement: true,
        Comprehensive_Low_Vision_Evaluation: true,
        Counselling_Education: true,
        Low_Vision_Evaluation: true,
        Training: true,
      },
    });

    return beneficiary;
  } catch (error) {
    console.log(error);
    return { error: "Couldn't read from db" };
  }
}
