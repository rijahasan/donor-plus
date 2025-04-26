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

import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

const handleDonorInfo = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  const { email, available } = req.body;  // destructure the request body

  try {
    const client = await clientPromise;
    const db = client.db("donor-app");
    const donorsCollection = db.collection("donors");

    if (method === "GET") {
      // Handle GET request: Fetch donor data
      const donor = await donorsCollection.findOne({ email });

      if (!donor) {
        return res.status(404).json({ message: "Donor not found" });
      }

      // Exclude password from response
      const { password, ...donorInfo } = donor;

      return res.status(200).json(donorInfo);
    }

    if (method === "PATCH") {
      // Handle PATCH request: Update donor availability
      const updatedDonor = await donorsCollection.updateOne(
        { email },
        { $set: { available } }  // Update the 'available' field
      );

      if (updatedDonor.modifiedCount === 0) {
        return res.status(400).json({ message: "No donor was updated" });
      }

      return res.status(200).json({ message: "Donor updated successfully" });
    }

    // If method is not GET or PATCH
    res.status(405).json({ message: "Method Not Allowed" });
  } catch (error) {
    res.status(500).json({ message: "Error processing request", error: error.message });
  }
};

export default handleDonorInfo;
