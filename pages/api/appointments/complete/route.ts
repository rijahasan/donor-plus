import clientPromise from "../../../../lib/mongodb"
import { ObjectId } from "mongodb"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
    try {
        const { appointmentId, donorEmail, status } = await req.json()

        if (!appointmentId || !donorEmail || !status) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 })
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

        // Convert appointmentId to ObjectId - using the string constructor which is not deprecated
        const objId = new ObjectId(String(appointmentId))

        // Update the donation status
        const result = await donationsCollection.updateOne({ _id: objId, donorEmail }, { $set: { status: status } })

        if (result.modifiedCount === 0) {
            return NextResponse.json({ error: "Donation not found or not updated" }, { status: 404 })
        }

        return NextResponse.json({ message: "Donation status updated" })
    } catch (e: any) {
        console.error(e)
        return NextResponse.json({ error: e.message }, { status: 500 })
    }
}
