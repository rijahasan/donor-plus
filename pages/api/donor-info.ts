// // import { NextApiRequest, NextApiResponse } from "next";
// // import clientPromise from "../../lib/mongodb";
// // import jwt from "jsonwebtoken";  // Importing jsonwebtoken to decode the JWT
// // import { ObjectId } from "mongodb";

// // const donorInfoHandler = async (req: NextApiRequest, res: NextApiResponse) => {
// //   console.log("Received request for /api/donor-info");

// //   // Check for the HTTP method
// //   if (req.method === "GET") {
// //     try {
// //       // Extract the token from the Authorization header
// //       const token = req.headers.authorization?.split(" ")[1];
// //       console.log(token);  // Log the token for debugging

// //       if (!token) {
// //         return res.status(401).json({ message: "Authorization token is missing" });
// //       }

// //       // Decode the token and extract the donor's ID
// //       let decodedToken;
// //       try {
// //         decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);  // Verify and decode the token
// //       } catch (error) {
// //         console.error("Token verification failed:", error);
// //         return res.status(401).json({ message: "Invalid or expired token" });
// //       }

// //       const donorIdFromToken = (decodedToken as { id: string }).id;  // Extract the donor ID from the decoded token

// //       const client = await clientPromise;  // MongoDB client connection
// //       const db = client.db("donor-app");
// //       const donorsCollection = db.collection("donors");

// //       // Fetch the donor info from the database using the decoded donor ID
// //       const donor = await donorsCollection.findOne({ _id: new ObjectId(donorIdFromToken) });

// //       if (!donor) {
// //         return res.status(404).json({ message: "Donor not found" });
// //       }

// //       // Return the donor's information
// //       return res.status(200).json(donor);
// //     } catch (error) {
// //       console.error("Error fetching donor data:", error);
// //       return res.status(500).json({ message: "Internal Server Error", error: error.message });
// //     }
// //   } else {
// //     // If the method is not GET, return 405 Method Not Allowed
// //     res.status(405).json({ message: "Method Not Allowed" });
// //   }
// // };

// // export default donorInfoHandler;


// // pages/api/donor-info.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "../../lib/mongodb";
// import jwt from "jsonwebtoken";  // Importing jsonwebtoken to decode the JWT
// import { ObjectId } from "mongodb";

// const getDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
//   try {
//     const client = await clientPromise;
//     const db = client.db("donor-app");
//     const donorsCollection = db.collection("donors");

//     if (req.method === "GET") {
//       // Extract email from the Authorization token (if user is logged in)
//       const token = req.headers.authorization?.split(" ")[1];
//       if (!token) {
//         return res.status(401).json({ message: "Authorization token is missing" });
//       }

//       // Decoding the token (assuming it's a JWT)
//       const decodedToken = jwt.verify(token, process.env.JWT_SECRET as string);
//       const email = decodedToken?.email;  // Assuming the JWT contains the email of the donor

//       if (!email) {
//         return res.status(400).json({ message: "Email not found in token" });
//       }

//       // Find donor based on the email
//       const donor = await donorsCollection.findOne({ email });

//       if (!donor) {
//         return res.status(404).json({ message: "Donor not found" });
//       }

//       return res.status(200).json(donor);  // Return donor information
//     }

//     res.status(405).json({ message: "Method Not Allowed" });
//   } catch (error) {
//     console.error("Error:", error);
//     res.status(500).json({ message: "Internal Server Error", error: error.message });
//   }
// };

// export default getDonorInfo;

// pages/api/donor-info.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const getDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { email } = req.headers;

  try {
    const client = await clientPromise;
    const db = client.db("donor-app");
    const donorsCollection = db.collection("donors");

    const donor = await donorsCollection.findOne({ email });

    if (!donor) {
      return res.status(404).json({ message: "Donor not found" });
    }

    // Exclude the password (if stored in the donor collection) from the response
    const { password, ...donorInfo } = donor;

    return res.status(200).json(donorInfo);
  } catch (error) {
    res.status(500).json({ message: "Error fetching donor data", error: error.message });
  }
};

export default getDonorInfo;

