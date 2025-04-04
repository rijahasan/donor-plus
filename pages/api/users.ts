// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("📩 API request method:", req.method);

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donorplus");
    const collection = db.collection("users");

    if (req.method === 'GET') {
      const users = await collection.find({}).toArray();
      return res.status(200).json(users);
    }

    if (req.method === 'POST') {
      const newUser = req.body;
      const result = await collection.insertOne(newUser);
      return res.status(201).json(result);
    }

    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (error: any) {
    console.error('❌ MongoDB error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error?.message || 'Unknown error' });
  }
};
