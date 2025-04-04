// pages/api/donors.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';  // Adjust path if necessary

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    
    console.log("📩 API request method:", req.method);

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donorplus");  // You can also do: client.db("donorplus");
    const collection = db.collection("donors"); // Specify your collection

    if (req.method === 'GET') {
      // Fetch all donors
      const donors = await collection.find({}).toArray();
      return res.status(200).json(donors);
    }

    if (req.method === 'POST') {
      // Insert a new donor
      const newDonor = req.body;  // The donor data sent in the request body
      const result = await collection.insertOne(newDonor);
      return res.status(201).json(result);
    }

    // Handle unsupported HTTP methods
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('❌ MongoDB error:', error);
    res.status(500).json({
      message: 'Internal Server Error',
      error: error?.message || 'Unknown error'
    });
  }
  
};
