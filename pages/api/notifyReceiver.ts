// // /pages/api/notifyReceiver.ts

// import { NextApiRequest, NextApiResponse } from "next";
// import clientPromise from "../../lib/mongodb";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") return res.status(405).end("Method not allowed");

//   const { receiverEmail, donorInfo } = req.body;

//   if (!receiverEmail || !donorInfo) {
//     return res.status(400).json({ message: "Missing receiverEmail or donorInfo" });
//   }

//   try {
//     const client = await clientPromise;
//     const db = client.db("donor-app");
//     const usersCollection = db.collection("users");

//     // Add donor info inside the receiver's document under a field like 'matchedDonors'
//     const updatedUser = await usersCollection.updateOne(
//       { email: receiverEmail },
//       {
//         $addToSet: {
//           matchedDonors: donorInfo,  // { firstName, lastName, email, bloodType, etc. }
//         },
//       }
//     );

//     if (updatedUser.modifiedCount > 0) {
//       console.log("✅ Receiver notified successfully");
//       return res.status(200).json({ message: "Receiver notified successfully" });
//     } else {
//       return res.status(404).json({ message: "Receiver not found or already notified" });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.status(500).json({ message: "Internal Server Error" });
//   }
// }
// /pages/api/notifyReceiver.ts

import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from "../../lib/mongodb";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const client = await clientPromise;
    const db = client.db("donor-app");
    const usersCollection = db.collection("users");

    if (req.method === "POST") {
        const { receiverEmail, donorInfo, date } = req.body;

        if (!receiverEmail || !donorInfo) {
            return res.status(400).json({ message: "Missing receiverEmail or donorInfo" });
        }

        try {
            // Check if the receiver is already notified
            // const receiver = await usersCollection.findOne({ email: receiverEmail });

            // if (receiver && receiver.matchedDonors.some((donor: { email: any; }) => donor.email === donorInfo.email)) {
            //     // If the donorInfo is already in the matchedDonors array
            //     return res.status(400).json({ message: "User already notified" });
            // }

            // Proceed with adding the donorInfo to the matchedDonors array
            const updatedUser = await usersCollection.updateOne(
                { email: receiverEmail },
                {
                    $addToSet: {
                        matchedDonors: donorInfo,
                    },
                }
            );

            if (updatedUser.modifiedCount > 0) {
                console.log("✅ Receiver notified successfully");
                return res.status(200).json({ message: "Receiver notified successfully" });
            } else {
                return res.status(200).json({ message: "Receiver already notified" });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }


    else if (req.method === "GET") {
        const { email } = req.query;

        if (!email || typeof email !== "string") {
            return res.status(400).json({ message: "Missing or invalid email query parameter" });
        }

        try {
            const user = await usersCollection.findOne({ email });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            const matchedDonors = user.matchedDonors || [];

            // Enrich matchedDonors with phone numbers
            const enrichedDonors = await Promise.all(
                matchedDonors.map(async (donor: any) => {
                    if (!donor.email) return donor; // If donor doesn't have email, just return as is

                    const donorUser = await usersCollection.findOne({ email: donor.email });
                    return {
                        ...donor,
                        phone: donorUser?.phone || null, // add phone field
                    };
                })
            );

            return res.status(200).json({ matchedDonors: enrichedDonors });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal Server Error" });
        }
    }
}
