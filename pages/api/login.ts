import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '../../lib/mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'; // Use JWT to generate a token

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === 'POST') {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
      }

      const client = await clientPromise;
      const db = client.db("donor-app");
      const collection = db.collection("users");

      // Find the user by email
      const user = await collection.findOne({ email });

      if (!user) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // Compare the entered password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password);

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid email or password." });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, userType: user.userType },
        process.env.JWT_SECRET, // Secret key for JWT
        { expiresIn: '1h' } // Token expiration time
      );

      // Return the token and userType
      return res.status(200).json({ token, userType: user.userType });
    } else {
      res.status(405).json({ message: "Method Not Allowed" });
    }
  } catch (error: any) {
    console.error('❌ Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error?.message || 'Unknown error' });
  }
};
