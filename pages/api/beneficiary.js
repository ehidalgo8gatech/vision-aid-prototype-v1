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

async function readData(req, res) {
  try {
    var beneficiary;
    if (req.query.otherParam != null) {
      const hospitalList = await prisma.hospital.findMany({
        where: {
          name: {
            contains: req.query.otherParam,
          },
        },
      });
      var hospitalId = [];
      if (hospitalList != null && hospitalList.length > 0) {
        hospitalList.forEach((hospital) => {
          hospitalId.push(hospital.id);
        });
      }
      beneficiary = await prisma.beneficiary.findMany({
        where: {
          OR: [
            {
              beneficiaryName: {
                contains: req.query.otherParam,
              },
            },
            {
              hospitalId: { in: hospitalId },
            },
            {
              mrn: {
                contains: req.query.otherParam,
              },
            },
            {
              phoneNumber: {
                contains: req.query.otherParam,
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
    } else if (req.query.mrn != null) {
      beneficiary = await prisma.beneficiary.findUnique({
        where: {
          mrn: req.query.mrn,
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
    } else if (req.query.beneficiaryName != null) {
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
      beneficiary = await prisma.beneficiary.findMany({
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
        where: {
          deleted: false,
        },
      });
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
