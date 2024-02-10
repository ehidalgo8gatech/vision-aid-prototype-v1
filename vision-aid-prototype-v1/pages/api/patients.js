import prisma from "client";

export default async function handler(req, res) {
  const functionName = req.query.functionName;
  if (req.method === "POST") {
    if (functionName == "computer-training") {
      return await addDataComputerTraining(req, res);
    } else if (functionName == "addData") {
      return await addData(req, res);
    } else if (functionName == "mobile-training") {
      return await addDataMobileTraining(req, res);
    } else if (functionName == "orientation-mobility-training") {
      return await addDataOrientationMobilityTraining(req, res);
    } else if (functionName == "vision-enhancement") {
      return await addDataVisionEnhancement(req, res);
    } else if (functionName == "counselling-education") {
      return await addDataCounsellingEducation(req, res);
    } else if (functionName == "camps") {
      return await addDataCamps(req, res);
    } else if (functionName == "school-screenings") {
      return await addDataSchoolScreenings(req, res);
    }
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
    if (req.query.hospitalId != null) {
      const patients = await prisma.computer_Training.findMany({
        where: {
          hospitalId: parseInt(req.query.hospitalId),
        },
      });
      return res.status(200).json(patients, { success: true });
    }
    const patients = await prisma.computer_Training.findMany();
    return res.status(200).json(patients, { success: true });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ error: "Error reading from database", success: false });
  }
}

async function addData(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.beneficiary.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        mrn: body.mrn,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        phoneNumber: body.phoneNumber,
        Education: body.Education,
        Occupation: body.Occupation,
        Districts: body.Districts,
        State: body.State,
        Diagnosis: body.Diagnosis,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataComputerTraining(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.computer_Training.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        mrn: body.mrn,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        pNumber: body.phoneNumber,
        Education: body.Education,
        Occupation: body.Occupation,
        Districts: body.Districts,
        State: body.State,
        Diagnosis: body.Diagnosis,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataMobileTraining(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.mobile_Training.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        pNumber: body.phoneNumber,
        Education: body.Education,
        Occupation: body.Occupation,
        Districts: body.Districts,
        State: body.State,
        Vision: body.Vision,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataOrientationMobilityTraining(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.orientation_Mobility_Training.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        mrn: body.mrn,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        pNumber: body.phoneNumber,
        Education: body.Education,
        Occupation: body.Occupation,
        Districts: body.Districts,
        State: body.State,
        Diagnosis: body.Diagnosis,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataVisionEnhancement(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.vision_Enhancement.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        mrn: body.mrn,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        pNumber: body.phoneNumber,
        Districts: body.Districts,
        Diagnosis: body.Diagnosis,
        MDVI: body.MDVI,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataCounsellingEducation(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.counselling_Education.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        sessionNumber: body.sessionNumber,
        mrn: body.mrn,
        beneficiaryName: body.beneficiaryName,
        age: body.age,
        gender: body.gender,
        pNumber: body.phoneNumber,
        Districts: body.Districts,
        Diagnosis: body.Diagnosis,
        typeCounselling: body.typeCounselling,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataCamps(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.camps.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        schoolName: body.schoolName,
        studentName: body.studentName,
        age: body.age,
        gender: body.gender,
        Diagnosis: body.Diagnosis,
        visualAcuityRE: body.visualAcuityRE,
        visualAcuityLE: body.visualAcuityLE,
        unaidedNearVision: body.unaidedNearVision,
        refractionVALE: body.refractionVALE,
        LVA: body.LVA,
        LVANear: body.LVANear,
        nonOpticalAid: body.nonOpticalAid,
        actionNeeded: body.actionNeeded,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}

async function addDataSchoolScreenings(req, res) {
  const body = req.body;
  try {
    const newEntry = await prisma.school_Screening.create({
      data: {
        date: body.date,
        hospitalId: body.hospitalId,
        typeCamp: body.typeCamp,
        screeningPlace: body.screeningPlace,
        organiser: body.organiser,
        contactNumber: body.contactNumber,
        address: body.address,
        screenedTotal: body.screenedTotal,
        refractiveErrors: body.refractiveErrors,
        spectaclesDistributed: body.spectaclesDistributed,
        checked: body.checked,
        refer: body.refer,
        staff: body.staff,
        lowVision: body.lowVision,
      },
    });
    return res.status(200).json(newEntry, { success: true });
  } catch (error) {
    console.error("Request error", error);
    res
      .status(500)
      .json({ error: "Error adding patient information", success: false });
  }
}
