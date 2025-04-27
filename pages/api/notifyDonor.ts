// /pages/api/notifyDonor.ts


import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }

    const { donorEmail, receiverEmail, message } = req.body

    if (!donorEmail || !receiverEmail || !message) {
        return res.status(400).json({ message: 'Missing required fields: donorEmail, receiverEmail, or message' })
    }

    try {
        const client = await clientPromise
        console.log("✅ MongoDB client obtained")
        const database = client.db("donor-app")
        const donorsCollection = database.collection('donors')  // Replace with your collection name

        // Find donor by email
        const donor = await donorsCollection.findOne({ email: donorEmail })

        if (!donor) {
            return res.status(404).json({ message: 'Donor not found' })
        }

        // Update the 'notifiedBy' field in the donor's record as an object with email and message
        const updatedDonor = await donorsCollection.updateOne(
            { email: donorEmail },
            {
                $addToSet: {
                    notifiedBy: {
                        email: receiverEmail,
                        message: message,
                    },
                },
            }
        )

        if (updatedDonor.modifiedCount > 0) {
            // Optionally, you can log the message or take any other actions (e.g., send an email to the donor)
            console.log('Donor notified successfully')

            return res.status(200).json({ message: 'Request sent and donor notified successfully' })
        } else {
            return res.status(500).json({ message: 'Failed to update donor record' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ message: 'Internal server error' })
    }
}
export default handler