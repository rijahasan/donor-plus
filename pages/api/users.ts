
import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs'; // Add bcrypt for password hashing

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("📩 API request method:", req.method);

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donor-app");
    const collection = db.collection("users");

    if (req.method === 'GET') {
      const users = await collection.find({}).toArray();
      return res.status(200).json(users);
    }

    else if (req.method === 'POST') {
      const { firstName, lastName, email, password, phone, bloodType, userType, available, urgency } = req.body;

      // Validation (basic example)
      if (!firstName || !lastName || !email || !password || !phone || !bloodType || !userType) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if the email already exists
      try {
        const existingUser = await collection.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email is already registered" });
        }
      }
      finally {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user object
        const newUser = {
          firstName,
          lastName,
          email,
          password: hashedPassword,
          phone,
          bloodType,
          userType, // Donor or Receiver
          available: userType === "donor" ? (available === "yes" ? 1 : 0) : null, // Send 1 or 0 for donor availability
          urgency: userType === "receiver" ? (urgency === "urgent" ? 1 : 0) : null, // Send 1 or 0 for urgency
        };

        // Insert the new user into the database
        const result = await collection.insertOne(newUser);
        return res.status(201).json(result);
      }


    }
    else {
      res.status(405).json({ message: 'Method Not Allowed' });

    }
    // Hash the password
  } catch (error: any) {
    console.error('❌ MongoDB error:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error?.message || 'Unknown error' });
  }
};
