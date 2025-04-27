// /api/match.ts
import clientPromise from '../../lib/mongodb';
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") return res.status(405).end("Method not allowed");

    const { donorEmail, receiverEmail, bloodType } = req.body;
    if (!donorEmail || !receiverEmail || !bloodType) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donor-app");
    const donationsCollection = db.collection("donations");

    const newMatch = {
        donorEmail,
        receiverEmail,
        bloodType,
        dateOfMatch: new Date()
    };

    await donationsCollection.insertOne(newMatch);

    return res.status(201).json({ message: "Match recorded successfully", match: newMatch });
}
