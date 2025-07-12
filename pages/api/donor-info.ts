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
      // if (typeof decodedToken === "object" && decodedToken.email === email) {
      //   return res.status(403).json({ message: "You don't have permission to access this data" })
      // }

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

      // // Verify the requester has permission to modify this donor's data
      // if (typeof decodedToken === "object" && decodedToken.email !== email) {
      //   return res.status(403).json({ message: "You don't have permission to modify this data" });
      // }

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
