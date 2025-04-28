import { NextResponse } from "next/server"
import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { headers } from "next/headers"

export async function PATCH(request: Request) {
    try {
        // Get authorization header
        const headersList = headers()
        const authorization = (await headersList).get("authorization")

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Authentication required" }, { status: 401 })
        }

        // Parse request body
        const { appointmentId, donorEmail, status } = await request.json()

        // Log received data for debugging
        console.log("Received data:", { appointmentId, donorEmail, status })

        // Validate required fields
        if (!appointmentId) {
            return NextResponse.json({ error: "Missing appointmentId" }, { status: 400 })
        }

        if (!donorEmail) {
            return NextResponse.json({ error: "Missing donorEmail" }, { status: 400 })
        }

        if (!status) {
            return NextResponse.json({ error: "Missing status" }, { status: 400 })
        }

        // Validate ObjectId format
        if (!ObjectId.isValid(appointmentId)) {
            return NextResponse.json(
                {
                    error: "Invalid appointmentId format",
                    receivedId: appointmentId,
                },
                { status: 400 },
            )
        }

        // Connect to MongoDB
        const client = await clientPromise
        const db = client.db("donor-app")
        const donationsCollection = db.collection("donations")

        // Convert appointmentId to ObjectId
        const objId = new ObjectId(appointmentId)

        // Update the donation status
        const result = await donationsCollection.updateOne({ _id: objId, donorEmail }, { $set: { status: status } })

        if (result.matchedCount === 0) {
            return NextResponse.json(
                {
                    error: "Appointment not found or not authorized",
                    details: {
                        id: appointmentId,
                        email: donorEmail,
                    },
                },
                { status: 404 },
            )
        }

        return NextResponse.json({
            message: "Appointment status updated successfully",
            status: status,
        })
    } catch (error: any) {
        console.error("Error updating appointment status:", error)
        return NextResponse.json(
            {
                error: "Failed to update appointment status",
                message: error.message || "Unknown error",
            },
            { status: 500 },
        )
    }
}
