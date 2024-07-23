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
    await updateUserLastModified(prisma, 'beneficiaryList', req.method, session.user.email);
    if (req.method !== "GET") {
        return res
        .status(405)
        .json({ message: "Method not allowed", success: false });
    }
    if (typeof req.query.id !== "string" || isNaN(parseInt(req.query.id))) {
        return res.status(404).json({ message: "ID is required and must be a number", success: false})
    }

    return await fetchData(req, res);
}

async function fetchData(req, res) {
    try {

        // get beneficiary list from the user information
        const startDate = req.query.startDate;
        const endDate = req.query.endDate;
        const date = startDate && endDate ? { 
            lte: new Date(req.query.endDate),
            gte: new Date(req.query.startDate),

        } : undefined;
        const id = parseInt(req.query.id);
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
                deleted: false, hospitalId: { equals: id },
                OR: [{
                    Vision_Enhancement: { every: { date } },
                    NOT: [{ Vision_Enhancement: { every: { date: null }}}]
                }, {
                    Counselling_Education: { every: { date } },
                    NOT: [{ Counselling_Education: { every: { date: null }}}]
                }, {
                    Comprehensive_Low_Vision_Evaluation: { every: { date } },
                    NOT: [{ Comprehensive_Low_Vision_Evaluation: { every: { date: null }}}]
                }, {
                    Low_Vision_Evaluation: { every: { date } },
                    NOT: [{ Low_Vision_Evaluation: { every: { date: null }}}]
                }, {
                    Training: { every: { date } },
                    NOT: [{ Training: { every: { date: null }}}]
                }, {
                    Computer_Training: { every: { date } },
                    NOT: [{ Computer_Training: { every: { date: null }}}]
                }, {
                    Mobile_Training: { every: { date } },
                    NOT: [{ Mobile_Training: { every: { date: null }}}]
                }, {
                    Orientation_Mobility_Training: { every: { date } },
                    NOT: [{ Orientation_Mobility_Training: { every: { date: null }}}]
                }]
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

        const allDates = beneficiaryList.map((ben) => {
            return { [ben.beneficiaryName]: [...ben.visionEnhancement.map(({ date }) => date),
                                             ...ben.counsellingEducation.map(({ date }) => date),
                                             ...ben.comprehensiveLowVisionEvaluation.map(({ date }) => date),
                                             ...ben.lowVisionEvaluation.map(({ date }) => date),
                                             ...ben.training.map(({ date }) => date),
                                             ...ben.computerTraining.map(({ date }) => date),
                                             ...ben.mobileTraining.map(({ date }) => date),
                                             ...ben.orientationMobilityTraining.map(({ date }) => date)
                                            ]};
        });

        console.log('All dates: ', allDates);

        return res.status(200).json(beneficiaryList, { success: true });
    } catch (error) {
        console.log(error);
        return res
            .status(500)
            .json({ error: "Error reading from database", success: false });
    }
}
