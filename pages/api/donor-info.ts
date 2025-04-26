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

