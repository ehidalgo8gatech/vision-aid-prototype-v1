
// feedback.js api
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
  await updateUserLastModified(prisma, 'feedback', req.method, session.user.email);
  if (req.method === 'POST') {
    const { rating, comments, email } = req.body;

    try {
      const feedback = await prisma.feedback.create({
        data: {
          datetime_recorded: new Date(),
          rating: parseInt(rating),
          comment: comments,
          email: email || null, // Making email optional
        },
      });

      console.log('Feedback created:', feedback); // Log the created feedback

      res.status(200).json({ message: 'Feedback submitted successfully!' });
    } catch (error) {
      console.error('Error submitting feedback:', error);
      res.status(500).json({ error: 'An error occurred while submitting feedback.' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
