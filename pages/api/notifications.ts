// import clientPromise from '../../lib/mongodb';
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//     if (req.method !== "GET") return res.status(405).end("Method not allowed");

//     const { email } = req.query;
//     if (!email) return res.status(400).json({ message: "Email parameter is required" });

//     const client = await clientPromise;
//     console.log("✅ MongoDB client obtained");

//     const db = client.db("donor-app");
//     const donorsCollection = db.collection("donors");
//     const usersCollection = db.collection("users");

//     // Find the donor by email
//     const donor = await donorsCollection.findOne({ email });
//     if (!donor) return res.status(404).json({ message: "Donor not found" });

//     // Check if there are no notifications yet
//     if (!donor.notifiedBy || donor.notifiedBy.length === 0) {
//         return res.status(200).json({ notifications: [] });
//     }

//     // Get the list of emails that have notified the donor
//     const notifiedEmails = donor.notifiedBy.map((notification: { email: string }) => notification.email);

//     // Fetch users who have notified the donor
//     const users = await usersCollection.find({ email: { $in: notifiedEmails } }).toArray();

//     // Return the list of users who have notified the donor
//     return res.status(200).json({ notifications: users });
// }

import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") return res.status(405).end("Method not allowed");

    const { email } = req.query;
    if (!email) return res.status(400).json({ message: "Email parameter is required" });

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donor-app");
    const donorsCollection = db.collection("donors");
    const usersCollection = db.collection("users");

    // Find the donor by email
    const donor = await donorsCollection.findOne({ email });
    if (!donor) return res.status(404).json({ message: "Donor not found" });

    if (!donor.notifiedBy || donor.notifiedBy.length === 0) {
        return res.status(200).json({ notifications: [] });
    }

    // Get the full notifications (including email, message, date)
    const notifications = donor.notifiedBy;

    // Get the list of emails
    const notifiedEmails = notifications.map((notification: { email: string }) => notification.email);

    // Fetch user profiles for those emails
    const users = await usersCollection.find({ email: { $in: notifiedEmails } }).toArray();

    // Merge user info with message and date
    const enrichedNotifications = notifications.map((notification: { email: string, message: string, date: string }) => {
        const user = users.find((u) => u.email === notification.email);
        return {
            ...notification,    // includes email, message, date
            user: user || null,  // optional: add user profile if available
        };
    });

    return res.status(200).json({ notifications: enrichedNotifications });
}
