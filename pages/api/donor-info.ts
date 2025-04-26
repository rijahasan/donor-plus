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
// import { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "../../lib/mongodb";

// const getDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { email } = req.headers;

//   try {
//     const client = await clientPromise;
//     const db = client.db("donor-app");
//     const donorsCollection = db.collection("donors");

//     const donor = await donorsCollection.findOne({ email });

//     if (!donor) {
//       return res.status(404).json({ message: "Donor not found" });
//     }

//     // Exclude the password (if stored in the donor collection) from the response
//     const { password, ...donorInfo } = donor;

//     return res.status(200).json(donorInfo);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching donor data", error: error.message });
//   }
// };

// export default getDonorInfo;

// import { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "../../lib/mongodb";

// const handleDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { method } = req;
//   const { email, available } = req.body;  // destructure the request body

//   try {
//     const client = await clientPromise;
//     const db = client.db("donor-app");
//     const donorsCollection = db.collection("donors");

//     if (method === "GET") {
//       // Handle GET request: Fetch donor data
//       const donor = await donorsCollection.findOne({ email });

//       if (!donor) {
//         return res.status(404).json({ message: "Donor not found" });
//       }

//       // Exclude password from response
//       const { password, ...donorInfo } = donor;

//       return res.status(200).json(donorInfo);
//     }

//     if (method === "PATCH") {
//       // Handle PATCH request: Update donor availability
//       const updatedDonor = await donorsCollection.updateOne(
//         { email },
//         { $set: { available } }  // Update the 'available' field
//       );

//       if (updatedDonor.modifiedCount === 0) {
//         return res.status(400).json({ message: "No donor was updated" });
//       }

//       return res.status(200).json({ message: "Donor updated successfully" });
//     }

//     // If method is not GET or PATCH
//     res.status(405).json({ message: "Method Not Allowed" });
//   } catch (error) {
//     res.status(500).json({ message: "Error processing request", error: error.message });
//   }
// };

// export default handleDonorInfo;

// import type { NextApiRequest, NextApiResponse } from "next"
// import clientPromise from "../../lib/mongodb"
// import jwt from "jsonwebtoken"

// const handleDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { method } = req

//   try {
//     // Authentication check
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Authentication required" })
//     }

//     const token = authHeader.split(" ")[1]
//     let decodedToken

//     try {
//       decodedToken = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key")
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid or expired token" })
//     }

//     const client = await clientPromise
//     const db = client.db("donor-app")
//     const donorsCollection = db.collection("donors")

//     if (method === "GET") {
//       // Get email from query parameters for GET requests
//       const email = req.query.email as string

//       if (!email) {
//         return res.status(400).json({ message: "Email parameter is required" })
//       }

//       // Verify the requester has permission to access this donor's data
//       if (typeof decodedToken === "object" && decodedToken.email !== email && decodedToken.userType !== "admin") {
//         return res.status(403).json({ message: "You don't have permission to access this data" })
//       }

//       // Handle GET request: Fetch donor data
//       const donor = await donorsCollection.findOne({ email })

//       if (!donor) {
//         return res.status(404).json({ message: "Donor not found" })
//       }

//       // Exclude password from response if it exists
//       const { password, ...donorInfo } = donor

//       return res.status(200).json(donorInfo)
//     }

//     if (method === "PATCH") {
//       // For PATCH requests, get data from request body
//       const { email, available } = req.body

//       if (!email) {
//         return res.status(400).json({ message: "Email is required" })
//       }

//       // Verify the requester has permission to modify this donor's data
//       if (typeof decodedToken === "object" && decodedToken.email !== email && decodedToken.userType !== "admin") {
//         return res.status(403).json({ message: "You don't have permission to modify this data" })
//       }

//       // Handle PATCH request: Update donor availability
//       const updatedDonor = await donorsCollection.updateOne(
//         { email },
//         { $set: { available } }, // Update the 'available' field
//       )

//       if (updatedDonor.matchedCount === 0) {
//         return res.status(404).json({ message: "Donor not found" })
//       }

//       if (updatedDonor.modifiedCount === 0) {
//         return res.status(200).json({ message: "No changes were made" })
//       }

//       return res.status(200).json({ message: "Donor updated successfully" })
//     }

//     // If method is not GET or PATCH
//     res.status(405).json({ message: "Method Not Allowed" })
//   } catch (error: any) {
//     console.error("Error in donor-info API:", error)
//     res.status(500).json({
//       message: "Error processing request",
//       error: error?.message || "Unknown error",
//     })
//   }
// }

// export default handleDonorInfo

// import type { NextApiRequest, NextApiResponse } from "next"
// import clientPromise from "../../lib/mongodb"
// import jwt from "jsonwebtoken"

// const handleDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
//   const { method } = req

//   res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
//   res.setHeader("Pragma", "no-cache")
//   res.setHeader("Expires", "0")

//   try {
//     // Authentication check
//     const authHeader = req.headers.authorization
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "Authentication required" })
//     }

//     const token = authHeader.split(" ")[1]
//     let decodedToken

//     try {
//       decodedToken = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key")
//     } catch (error) {
//       return res.status(401).json({ message: "Invalid or expired token" })
//     }

//     const client = await clientPromise
//     const db = client.db("donor-app")
//     const donorsCollection = db.collection("donors")

//     if (method === "GET") {
//       // Get email from query parameters for GET requests
//       const email = req.query.email as string

//       if (!email) {
//         return res.status(400).json({ message: "Email parameter is required" })
//       }

//       // Verify the requester has permission to access this donor's data
//       if (typeof decodedToken === "object" && decodedToken.email !== email && decodedToken.userType !== "admin") {
//         return res.status(403).json({ message: "You don't have permission to access this data" })
//       }

//       // Handle GET request: Fetch donor data
//       const donor = await donorsCollection.findOne({ email })

//       if (!donor) {
//         return res.status(404).json({ message: "Donor not found" })
//       }

//       // Exclude password from response if it exists
//       const { password, ...donorInfo } = donor

//       return res.status(200).json(donorInfo)
//     }

//     if (method === "PATCH") {
//       // For PATCH requests, get data from request body
//       const { email, available } = req.body

//       if (!email) {
//         return res.status(400).json({ message: "Email is required" })
//       }

//       // Verify the requester has permission to modify this donor's data
//       if (typeof decodedToken === "object" && decodedToken.email !== email && decodedToken.userType !== "admin") {
//         return res.status(403).json({ message: "You don't have permission to modify this data" })
//       }

//       // Handle PATCH request: Update donor availability
//       const updatedDonor = await donorsCollection.updateOne(
//         { email },
//         { $set: { available } }, // Update the 'available' field
//       )

//       if (updatedDonor.matchedCount === 0) {
//         return res.status(404).json({ message: "Donor not found" })
//       }

//       if (updatedDonor.modifiedCount === 0) {
//         return res.status(200).json({ message: "No changes were made" })
//       }

//       return res.status(200).json({ message: "Donor updated successfully" })
//     }

//     // If method is not GET or PATCH
//     res.status(405).json({ message: "Method Not Allowed" })
//   } catch (error: any) {
//     console.error("Error in donor-info API:", error)
//     res.status(500).json({
//       message: "Error processing request",
//       error: error?.message || "Unknown error",
//     })
//   }
// }

// export default handleDonorInfo
import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"
import jwt from "jsonwebtoken"

const handleDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req

  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
  res.setHeader("Pragma", "no-cache")
  res.setHeader("Expires", "0")

  try {
    // Authentication check
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" })
    }

    const token = authHeader.split(" ")[1]
    let decodedToken

    try {
      decodedToken = jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key")
    } catch (error) {
      return res.status(401).json({ message: "Invalid or expired token" })
    }

    const client = await clientPromise
    const db = client.db("donor-app")
    const donorsCollection = db.collection("donors")

    if (method === "GET") {
      // Get email from query parameters for GET requests
      const email = req.query.email as string

      if (!email) {
        return res.status(400).json({ message: "Email parameter is required" })
      }

      // Verify the requester has permission to access this donor's data
      if (typeof decodedToken === "object" && decodedToken.email !== email && decodedToken.userType !== "admin") {
        return res.status(403).json({ message: "You don't have permission to access this data" })
      }

      // Handle GET request: Fetch donor data
      const donor = await donorsCollection.findOne({ email })

      if (!donor) {
        return res.status(404).json({ message: "Donor not found" })
      }

      // Exclude password from response if it exists
      const { password, ...donorInfo } = donor

      return res.status(200).json(donorInfo)
    }

    // if (method === "PATCH") {
    //   // For PATCH requests, get data from request body
    //   const { email, available } = req.body

    //   if (!email) {
    //     return res.status(400).json({ message: "Email is required" })
    //   }

    //   // Verify the requester has permission to modify this donor's data
    //   if (typeof decodedToken === "object" && decodedToken.email !== email) {
    //     return res.status(403).json({ message: "You don't have permission to modify this data" })
    //   }

    //   // Handle PATCH request: Update donor availability
    //   const updatedDonor = await donorsCollection.updateOne(
    //     { email },
    //     { $set: { available } }, // Update the 'available' field
    //   )

    //   if (updatedDonor.matchedCount === 0) {
    //     return res.status(404).json({ message: "Donor not found" })
    //   }

    //   if (updatedDonor.modifiedCount === 0) {
    //     return res.status(200).json({ message: "No changes were made" })
    //   }

    //   return res.status(200).json({ message: "Donor updated successfully" })
    // }
    if (method === "PATCH") {
      // For PATCH requests, get data from request body
      const {
        email,
        available, // Add available field here
        weight,
        age,
        bloodType,
        recentSurgery,
        surgeryDetails,
        recentIllness,
        illnessDetails,
        onMedication,
        medicationDetails,
        chronicDisease,
        diseaseDetails,
        lastDonation
      } = req.body;

      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }

      // Verify the requester has permission to modify this donor's data
      if (typeof decodedToken === "object" && decodedToken.email !== email) {
        return res.status(403).json({ message: "You don't have permission to modify this data" });
      }

      // Prepare the update data, including the 'available' field
      const updateData: Record<string, any> = {
        weight,
        age,
        bloodType,
        recentSurgery,
        surgeryDetails,
        recentIllness,
        illnessDetails,
        onMedication,
        medicationDetails,
        chronicDisease,
        diseaseDetails,
        lastDonation,
        available, // Include availability status in the update
      };

      // Remove undefined fields to avoid updating with null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null) {
          delete updateData[key];
        }
      });

      // Handle PATCH request: Update donor data
      const updatedDonor = await donorsCollection.updateOne(
        { email },
        { $set: updateData } // Update the 'available' field and other data
      );

      if (updatedDonor.matchedCount === 0) {
        return res.status(404).json({ message: "Donor not found" });
      }

      if (updatedDonor.modifiedCount === 0) {
        return res.status(200).json({ message: "No changes were made" });
      }

      return res.status(200).json({ message: "Donor updated successfully" });
    }

    // If method is not GET or PATCH
    res.status(405).json({ message: "Method Not Allowed" })
  } catch (error: any) {
    console.error("Error in donor-info API:", error)
    res.status(500).json({
      message: "Error processing request",
      error: error?.message || "Unknown error",
    })
  }
}

export default handleDonorInfo
