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

async function readData(req, res) {
  try {
    return res
      .status(200)
      .json(getBenMirror(req.query.hospital), { success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}

async function addData(req, res) {
  const body = req.body;
  let beneficiaryMirror = await readBeneficiaryMirror(
    await prisma.hospital.findFirst({
      where: {
        name: body.hospitalNameOverride,
      },
    })
  );
  const update = {
    where: {
      id: beneficiaryMirror.id,
    },
    data: {
      phoneNumberRequired: body.phoneNumberRequired,
      educationRequired: body.educationRequired,
      occupationRequired: body.occupationRequired,
      districtsRequired: body.districtsRequired,
      stateRequired: body.stateRequired,
      diagnosisRequired: body.diagnosisRequired,
      visionRequired: body.visionRequired,
      mDVIRequired: body.mDVIRequired,
      extraInformationRequired: body.extraInformationRequired,
    },
  };
  try {
    const beneficiary_Mirror = await prisma.beneficiary_Mirror.update(update);
    return res.status(200).json(beneficiary_Mirror, { success: true });
  } catch (error) {
    console.log("Request error " + error);
    res
      .status(500)
      .json({ error: "Error adding user" + error, success: false });
  }
}

export async function readBeneficiaryMirror(hospital) {
  if (hospital != null && hospital.name != null) {
    const bm = await prisma.beneficiary_Mirror.findFirst({
      where: {
        hospitalName: hospital.name,
      },
    });
    if (bm != null) return bm;
    return prisma.beneficiary_Mirror.create({
      data: {
        id: Math.ceil(Math.random() * (2000000000 - 2) + 2),
        hospitalName: hospital.name,
        phoneNumberRequired: true,
        educationRequired: true,
        occupationRequired: true,
        districtsRequired: true,
        stateRequired: true,
        diagnosisRequired: true,
        visionRequired: true,
        mDVIRequired: true,
        extraInformationRequired: "[]",
      },
    });
  }
  return prisma.beneficiary_Mirror.findFirst({});
}

export async function getBenMirror(hospitalName) {
  const bm = await prisma.beneficiary_Mirror.findFirst({
    where: {
      hospitalName: hospitalName,
    },
  });
  console.log(bm);
  if (bm != null) return bm;
  return prisma.beneficiary_Mirror.findFirst({});
}
