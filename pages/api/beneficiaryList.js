import prisma from "client";

export default async function handler(req, res) {
    if (req.method == "GET") {
        return await fetchData(req, res);
    } else {
        return res
        .status(405)
        .json({ message: "Method not allowed", success: false });
    }
}

async function fetchData(req, res) {
    try {
        // get user information
        const user = await prisma.user.findUnique({
            where: {
              id: parseInt(req.query.id),
            },
            include: {
              hospitalRole: true,
              admin: true,
            },
        });

        const roles = await prisma.hospitalRole.findMany();
        let hospitalIds = [];
        const isAdmin = user.admin != null;
        if (!isAdmin) {
            for (const role of roles) {
              if (role.userId === user.id) {
                hospitalIds.push(role.hospitalId);
              }
            }
        }

        // get beneficiary list from the user information
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const date = startDate && endDate ? { 
            lte: new Date(req.query.endDate),
            gte: new Date(req.query.startDate),
        } : undefined;
        const beneficiaryListFromAPI = await prisma.beneficiary.findMany({
            select: {
                mrn: true,
                beneficiaryName: true,
                hospitalId: true,
                dateOfBirth: true,
                gender: true,
                phoneNumber: true,
                education: true,
                occupation: true,
                districts: true,
                state: true,
                diagnosis: true,
                vision: true,
                mDVI: true,
                extraInformation: true,
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
                hospitalId: isAdmin ? undefined : { in: hospitalIds },
                Training: {
                    every: { date }
                }
            },
        });

        const beneficiaryList = beneficiaryListFromAPI.map((beneficiary) => ({
            mrn: beneficiary.mrn,
            beneficiaryName: beneficiary.beneficiaryName,
            hospitalId: beneficiary.hospitalId,
            dateOfBirth: beneficiary.dateOfBirth,
            gender: beneficiary.gender,
            phoneNumber: beneficiary.phoneNumber,
            education: beneficiary.education,
            occupation: beneficiary.occupation,
            districts: beneficiary.districts,
            state: beneficiary.state,
            diagnosis: beneficiary.diagnosis,
            vision: beneficiary.vision,
            mDVI: beneficiary.mDVI,
            extraInformation: beneficiary.extraInformation,
            hospital: beneficiary.hospital,
            visionEnhancement: beneficiary.Vision_Enhancement,
            counsellingEducation: beneficiary.Counselling_Education,
            comprehensiveLowVisionEvaluation:
            beneficiary.Comprehensive_Low_Vision_Evaluation,
            lowVisionEvaluation: beneficiary.Low_Vision_Evaluation,
            training: beneficiary.Training,
            computerTraining: beneficiary.Computer_Training,
            mobileTraining: beneficiary.Mobile_Training,
            orientationMobilityTraining: beneficiary.Orientation_Mobility_Training,
        }));

        return res.status(200).json(beneficiaryList, { success: true });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error reading from database", success: false });
    }
}
