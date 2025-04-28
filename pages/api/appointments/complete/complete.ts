import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"

const handleMarkAsDone = async (req: NextApiRequest, res: NextApiResponse) => {
    const { method } = req

    // Set cache control headers
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

        try {
            // Verify JWT token (uncomment in production)
            // jwt.verify(token, process.env.JWT_SECRET || "fallback-secret-key");
        } catch (error) {
            return res.status(401).json({ message: "Invalid or expired token" })
        }

        if (method === "PATCH") {
            const { appointmentId, donorEmail, status } = req.body

            // Log received data for debugging
            console.log("Received data:", { appointmentId, donorEmail, status })

            // Validate input fields
            if (!appointmentId) {
                return res.status(400).json({ error: "Missing appointmentId" })
            }
            if (!donorEmail) {
                return res.status(400).json({ error: "Missing donorEmail" })
            }
            if (!status) {
                return res.status(400).json({ error: "Missing status" })
            }

            // Validate ObjectId format
            if (!ObjectId.isValid(appointmentId)) {
                return res.status(400).json({
                    error: "Invalid appointmentId format",
                    receivedId: appointmentId,
                })
            }

            const client = await clientPromise
            const db = client.db("donor-app")
            const donationsCollection = db.collection("donations")

            // Convert appointmentId to ObjectId
            const objId = new ObjectId(appointmentId)

            // Update the donation status
            const result = await donationsCollection.updateOne({ _id: objId, donorEmail }, { $set: { status: status } })

            if (result.matchedCount === 0) {
                return res.status(404).json({
                    error: "Appointment not found or not authorized",
                    details: {
                        id: appointmentId,
                        email: donorEmail,
                    },
                })
            }

            return res.status(200).json({
                message: "Appointment status updated successfully",
                status: status,
            })
        } else {
            return res.status(405).json({ message: "Method Not Allowed" })
        }
    } catch (error: any) {
        console.error("Error updating appointment status:", error)
        return res.status(500).json({
            error: "Failed to update appointment status",
            message: error.message || "Unknown error",
        })
    }
}

export default handleMarkAsDone
