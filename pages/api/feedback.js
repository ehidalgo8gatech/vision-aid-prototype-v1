
// feedback.js api
import prisma from "client";

export default async function handler(req, res) {
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
