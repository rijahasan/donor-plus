// // import { NextApiRequest, NextApiResponse } from 'next';
// // import clientPromise from '../../lib/mongodb';
// // import bcrypt from 'bcryptjs';
// // import jwt from 'jsonwebtoken'; // Use JWT to generate a token

// // export default async (req: NextApiRequest, res: NextApiResponse) => {
// //   try {
// //     if (req.method === 'POST') {
// //       const { email, password } = req.body;

// //       if (!email || !password) {
// //         return res.status(400).json({ message: "Email and password are required." });
// //       }

// //       const client = await clientPromise;
// //       const db = client.db("donor-app");
// //       const collection = db.collection("users");

// //       // Find the user by email
// //       const user = await collection.findOne({ email });

// //       if (!user) {
// //         return res.status(400).json({ message: "Invalid email or password." });
// //       }

// //       // Compare the entered password with the stored hashed password
// //       const isPasswordCorrect = await bcrypt.compare(password, user.password);

// //       if (!isPasswordCorrect) {
// //         return res.status(400).json({ message: "Invalid email or password." });
// //       }
// //       let donorData = null;
// //       if (user.userType === 'donor') {
// //         const donorsCollection = db.collection("donors");
// //         donorData = await donorsCollection.findOne({ email }); // Fetch donor information by email
// //       }

// //       // Generate a JWT token
// //       const token = jwt.sign(
// //         { userId: user._id, userType: user.userType },
// //         process.env.JWT_SECRET, // Secret key for JWT
// //         { expiresIn: '1h' } // Token expiration time
// //       );

// //       // Return the token and userType
// //       return res.status(200).json({ token, userType: user.userType });
// //     } else {
// //       res.status(405).json({ message: "Method Not Allowed" });
// //     }
// //   } catch (error: any) {
// //     console.error('❌ Error during login:', error);
// //     res.status(500).json({ message: 'Internal Server Error', error: error?.message || 'Unknown error' });
// //   }
// // };

// import type { NextApiRequest, NextApiResponse } from "next"
// import clientPromise from "../../lib/mongodb"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

// export default async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     if (req.method === "POST") {
//       const { email, password } = req.body

//       if (!email || !password) {
//         return res.status(400).json({ message: "Email and password are required." })
//       }

//       const client = await clientPromise
//       const db = client.db("donor-app")
//       const collection = db.collection("users")

//       // Find the user by email
//       const user = await collection.findOne({ email })

//       if (!user) {
//         return res.status(400).json({ message: "Invalid email or password." })
//       }

//       // Compare the entered password with the stored hashed password
//       const isPasswordCorrect = await bcrypt.compare(password, user.password)

//       if (!isPasswordCorrect) {
//         return res.status(400).json({ message: "Invalid email or password." })
//       }

//       // Generate a JWT token
//       const token = jwt.sign(
//         { userId: user._id, email: user.email, userType: user.userType },
//         process.env.JWT_SECRET || "fallback-secret-key", // Secret key for JWT with fallback
//         { expiresIn: "1h" }, // Token expiration time
//       )

//       // Prepare response data
//       const responseData: any = {
//         token,
//         userType: user.userType,
//         email: user.email,
//         firstName: user.firstName,
//         lastName: user.lastName,
//       }

//       // If user is a donor, include donor information directly in the response
//       if (user.userType === "donor") {
//         const donorsCollection = db.collection("donors")
//         const donorData = await donorsCollection.findOne({ email })

//         if (donorData) {
//           responseData.donorInfo = donorData
//         } else {
//           console.warn(`No donor record found for email: ${email}`)
//         }
//       }

//       // Return the token, userType, and donor info if applicable
//       return res.status(200).json(responseData)
//     } else {
//       res.status(405).json({ message: "Method Not Allowed" })
//     }
//   } catch (error: any) {
//     console.error("❌ Error during login:", error)
//     res.status(500).json({ message: "Internal Server Error", error: error?.message || "Unknown error" })
//   }
// }

import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method === "POST") {
      const { email, password } = req.body

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." })
      }

      const client = await clientPromise
      const db = client.db("donor-app")
      const collection = db.collection("users")

      // Find the user by email
      const user = await collection.findOne({ email })

      if (!user) {
        return res.status(400).json({ message: "Invalid email." })
      }

      // Compare the entered password with the stored hashed password
      const isPasswordCorrect = await bcrypt.compare(password, user.password)

      if (!isPasswordCorrect) {
        return res.status(400).json({ message: "Invalid password." })
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email, userType: user.userType },
        process.env.JWT_SECRET || "fallback-secret-key", // Secret key for JWT with fallback
        { expiresIn: "1h" }, // Token expiration time
      )

      // Prepare response data
      const responseData: any = {
        token,
        userType: user.userType,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      }

      // If user is a donor, include donor information directly in the response
      if (user.userType === "donor") {
        const donorsCollection = db.collection("donors")
        const donorData = await donorsCollection.findOne({ email })

        if (donorData) {
          responseData.donorInfo = donorData
        } else {
          console.warn(`No donor record found for email: ${email}`)
        }
      }

      // Return the token, userType, and donor info if applicable
      return res.status(200).json(responseData)
    } else {
      res.status(405).json({ message: "Method Not Allowed" })
    }
  } catch (error: any) {
    console.error("❌ Error during login:", error)
    res.status(500).json({ message: "Internal Server Error", error: error?.message || "Unknown error" })
  }
}
