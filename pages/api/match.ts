// /api/match.ts
import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";

// adds to donations and updates donors collection
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method not allowed");

    const { donorEmail, receiverEmail, bloodType, message, accepted_date, status } = req.body;
    if (!donorEmail || !receiverEmail || !bloodType) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donor-app");
    const donationsCollection = db.collection("donations");
    const donorsCollection = db.collection("donors");

    // Insert into donations
    const newMatch = {
        donorEmail,
        receiverEmail,
        bloodType,
        dateOfMatch: accepted_date || new Date(),
        message: message || "",
        status: status || "In process",
    };

    const result = await donationsCollection.insertOne(newMatch);

    console.log("✅ New donation match recorded:", result.insertedId);

    const donor = await donorsCollection.findOne({ email: donorEmail });

    if (Array.isArray(donor?.notifiedBy)) {
        // Perform the $pull to remove the receiver's email object from the array
        // console.log("✅ IT IS AN ARRAY:", result.insertedId);
        const updateResult = await donorsCollection.updateOne(
            { email: donorEmail },
            { $pull: { notifiedBy: { email: receiverEmail } } as any }
        );
    } else {
        // Optionally, handle the case where notifiedBy is not an array or is missing
        console.log('The notifiedBy field is either missing or not an array.');
    }


    // console.log("✅ Updated donor notifiedby array:", updateResult.modifiedCount);

    return res.status(201).json({
        message: "Match recorded successfully and notifiedby updated",
        match: { ...newMatch, _id: result.insertedId },
    });
}
