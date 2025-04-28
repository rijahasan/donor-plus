import { NextResponse } from "next/server"
import clientPromise from "../../../lib/mongodb"
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const email = searchParams.get("email")

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 })
        }

        const client = await clientPromise
        const db = client.db("donor-app")
        const donationsCollection = db.collection("donations")

        // Find all donations where this person is the donor and status is "In process" or "Completed"
        const appointments = await donationsCollection
            .find({
                donorEmail: email,
                status: { $in: ["In process", "Completed"] },
            })
            .toArray()

        return NextResponse.json({ appointments })
    } catch (error: any) {
        console.error("Error fetching appointments:", error)
        return NextResponse.json(
            {
                error: "Failed to fetch appointments",
                message: error.message,
            },
            { status: 500 },
        )
    }
}
