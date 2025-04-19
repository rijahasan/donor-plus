
// pages/api/donors.ts
import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

// Helper function to determine blood type compatibility
const getCompatibleDonorTypes = (receiverBloodType: string): string[] => {
  switch (receiverBloodType) {
    case "A+": return ["A+", "A-", "O+", "O-"];
    case "A-": return ["A-", "O-"];
    case "B+": return ["B+", "B-", "O+", "O-"];
    case "B-": return ["B-", "O-"];
    case "AB+": return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
    case "AB-": return ["A-", "B-", "AB-", "O-"];
    case "O+": return ["O+", "O-"];
    case "O-": return ["O-"];
    default: return [];
  }
};

const registerDonor = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("📩 API request method:", req.method);

    const client = await clientPromise;
    console.log("✅ MongoDB client obtained");

    const db = client.db("donor-app");
    const donorsCollection = db.collection("donors");

    // Handle POST - Register a new donor
    if (req.method === "POST") {
      const donorData = req.body;


      const existingDonor = await donorsCollection.findOne({ email: donorData.email });
      if (existingDonor) {
        return res.status(400).json({ message: "Email already registered" });
      }
      
      const donor = {
        firstName: donorData.firstName,
        lastName: donorData.lastName,
        email: donorData.email,
        bloodType: donorData.bloodType,
        age: donorData.age,
        weight: donorData.weight,
        recentSurgery: donorData.recentSurgery,
        surgeryDetails: donorData.surgeryDetails,
        recentIllness: donorData.recentIllness,
        illnessDetails: donorData.illnessDetails,
        onMedication: donorData.onMedication,
        medicationDetails: donorData.medicationDetails,
        chronicDisease: donorData.chronicDisease,
        diseaseDetails: donorData.diseaseDetails,
        lastDonation: donorData.lastDonation,
        location: donorData.location || null,  // ✅ add location safely
      };
      
      const result = await donorsCollection.insertOne(donor);
      return res.status(201).json({ message: "Donor registered successfully", result });
    }

    // Handle GET - Fetch compatible donors based on blood type
    if (req.method === "GET") {
      const receiverBloodType = req.query.bloodType as string;
      console.log("Received Blood Type:", receiverBloodType);  // Add this to log the received blood type

      if (!receiverBloodType) {
        return res.status(400).json({ message: "Blood type is required" });
      }

      const compatibleDonorTypes = getCompatibleDonorTypes(receiverBloodType);

      // Fetch compatible donors from the database
      const compatibleDonors = await donorsCollection
        .find({ bloodType: { $in: compatibleDonorTypes } })
        .toArray();

      if (compatibleDonors.length === 0) {
        return res.status(200).json({ message: "No compatible donors found" });
      }

      // Separate available and unavailable donors
      const availableDonors = compatibleDonors.filter((donor) => donor.available);
      const unavailableDonors = compatibleDonors.filter((donor) => !donor.available);

      // Combine available and unavailable donors
      const sortedDonors = [...availableDonors, ...unavailableDonors];

      // Optionally prevent caching of the response
      res.setHeader("Cache-Control", "no-store, must-revalidate");
      res.setHeader("Pragma", "no-cache");
      res.setHeader("Expires", "0");
      
      // Return the sorted list of donors
      return res.status(200).json(sortedDonors);
    }

    // Method Not Allowed for unsupported HTTP methods
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("❌ MongoDB error:", error.message);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    } else {
      console.error("❌ MongoDB error:", error);
      res.status(500).json({ message: "Internal Server Error", error: "Unknown error" });
    }
  }
};

export default registerDonor;

