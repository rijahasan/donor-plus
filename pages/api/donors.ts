import type { NextApiRequest, NextApiResponse } from "next"
import clientPromise from "../../lib/mongodb"

// Helper function to determine blood type compatibility
const getCompatibleDonorTypes = (receiverBloodType: string): string[] => {
  switch (receiverBloodType) {
    case "A+":
      return ["A+", "A-", "O+", "O-"]
    case "A-":
      return ["A-", "O-"]
    case "B+":
      return ["B+", "B-", "O+", "O-"]
    case "B-":
      return ["B-", "O-"]
    case "AB+":
      return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
    case "AB-":
      return ["A-", "B-", "AB-", "O-"]
    case "O+":
      return ["O+", "O-"]
    case "O-":
      return ["O-"]
    default:
      return []
  }
}

// Haversine function to calculate the distance between two coordinates
const haversineDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
  const R = 3958.8 // Radius of Earth in miles
  const dLat = (lat2 - lat1) * (Math.PI / 180)
  const dLon = (lon2 - lon1) * (Math.PI / 180)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c // Distance in miles
}

const registerDonor = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log("📩 API request method:", req.method)

    // Establish MongoDB connection
    let client
    try {
      client = await clientPromise
      console.log("✅ MongoDB connection established")
    } catch (connError) {
      console.error("❌ MongoDB connection error:", connError)
      return res.status(500).json({ message: "Database connection error", error: String(connError) })
    }

    const db = client.db("donor-app")
    const donorsCollection = db.collection("donors")

    // Handle POST - Register a new donor
    if (req.method === "POST") {
      const donorData = req.body
      const existingDonor = await donorsCollection.findOne({ email: donorData.email })
      if (existingDonor) {
        return res.status(400).json({ message: "Email already registered" })
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
        location: donorData.location || null,
        available: donorData.available || "false",
        notifiedby: "", // hardcoded entry
      }

      const result = await donorsCollection.insertOne(donor)
      return res.status(201).json({ message: "Donor registered successfully", result })
    }

    // Handle GET - Fetch donors
    if (req.method === "GET") {
      const { email, bloodType, id, lat, lon, lng, radius } = req.query

      console.log("🔎 GET query params:", req.query)

      if (email) {
        // Fetch a donor by email
        const donor = await donorsCollection.findOne({ email: email as string })
        if (!donor) {
          return res.status(404).json({ message: "Donor not found" })
        }
        return res.status(200).json(donor)
      }

      if (bloodType) {
        // Use either lon or lng parameter (client is sending lng)
        const longitude = lon || lng

        if (!lat || !longitude || !radius) {
          return res.status(400).json({
            message: "Missing required fields: lat, lon/lng, or radius",
            received: { lat, longitude, radius },
          })
        }

        const latitude = Number.parseFloat(lat as string)
        const longitudeValue = Number.parseFloat(longitude as string)
        const searchRadius = Number.parseFloat(radius as string) // Radius in miles

        if (isNaN(latitude) || isNaN(longitudeValue) || isNaN(searchRadius)) {
          return res.status(400).json({
            message: "Invalid latitude, longitude, or radius",
            parsed: { latitude, longitudeValue, searchRadius },
          })
        }

        // Get compatible blood types
        const compatibleDonorTypes = getCompatibleDonorTypes(bloodType as string)
        console.log("🩸 Compatible blood types:", compatibleDonorTypes)

        try {
          // First, let's check if we can get ANY donors from the collection
          const testQuery = await donorsCollection.find({}).limit(1).toArray()
          console.log("🧪 Test query result:", JSON.stringify(testQuery))

          // Create a query that matches any format of "available" field
          const query = {
            bloodType: { $in: compatibleDonorTypes },
            $or: [
              { available: true },
              { available: "true" },
              { available: "yes" },
              { available: 1 },
              { available: "1" },
            ],
          }

          console.log("🔍 MongoDB query:", JSON.stringify(query))

          // Execute the query and convert to array
          let compatibleDonors
          try {
            compatibleDonors = await donorsCollection.find(query).toArray()
            console.log("📊 Query result type:", typeof compatibleDonors)
            console.log("📊 Is array?", Array.isArray(compatibleDonors))
            console.log("📊 Query result length:", compatibleDonors ? compatibleDonors.length : "N/A")
            console.log("📊 First few results:", JSON.stringify(compatibleDonors?.slice(0, 2)))
          } catch (queryError) {
            console.error("❌ MongoDB query error:", queryError)
            return res.status(500).json({ message: "Database query error", error: String(queryError) })
          }

          // Safety check - ensure we have an array
          if (!compatibleDonors || !Array.isArray(compatibleDonors)) {
            console.error("❌ Query did not return an array:", compatibleDonors)
            // Return an empty array instead of failing
            return res.status(200).json([])
          }

          // Process donors to include distance information
          const donorsWithDistance = []

          try {
            for (const donor of compatibleDonors) {
              // Skip donors with missing or invalid location data
              if (!donor || !donor.location || !donor.location.lat || !donor.location.lng) {
                console.log(`⚠️ Donor ${donor?.email || "unknown"} has missing location data:`, donor?.location)
                continue
              }

              // Parse coordinates as numbers
              const donorLat = Number.parseFloat(donor.location.lat)
              const donorLng = Number.parseFloat(donor.location.lng)

              // Skip if coordinates are not valid numbers
              if (isNaN(donorLat) || isNaN(donorLng)) {
                console.log(`⚠️ Donor ${donor.email} has invalid coordinates: ${donorLat}, ${donorLng}`)
                continue
              }

              // Calculate distance
              const distance = haversineDistance(latitude, longitudeValue, donorLat, donorLng)
              console.log(`📍 Donor ${donor.email} is ${distance.toFixed(2)} miles away`)

              // Include donor if within radius
              if (distance <= searchRadius) {
                // Create a new object with all donor properties plus distance
                const donorWithDistance = {
                  ...donor,
                  distance: {
                    value: Number.parseFloat(distance.toFixed(2)),
                    unit: "miles",
                  },
                }
                donorsWithDistance.push(donorWithDistance)
              }
            }
          } catch (filterError) {
            console.error("❌ Error during distance calculation:", filterError)
            // If distance calculation fails, return the unfiltered results
            return res.status(200).json(compatibleDonors)
          }

          // Sort donors by distance (closest first)
          donorsWithDistance.sort((a, b) => a.distance.value - b.distance.value)

          console.log(`📊 Found ${donorsWithDistance.length} donors within ${searchRadius} miles`)

          res.setHeader("Cache-Control", "no-store, must-revalidate")
          return res.status(200).json(donorsWithDistance)
        } catch (error) {
          console.error("❌ Unexpected error during donor search:", error)
          return res.status(500).json({
            message: "Error searching for donors",
            error: error instanceof Error ? error.message : String(error),
          })
        }
      }

      if (id) {
        try {
          // Fetch a donor by ID
          const { ObjectId } = await import("mongodb") // Lazy import ObjectId
          const donor = await donorsCollection.findOne({ _id: new ObjectId(id as string) })
          if (!donor) {
            return res.status(404).json({ message: "Donor not found" })
          }
          return res.status(200).json(donor)
        } catch (error) {
          console.error("❌ Error fetching donor by ID:", error)
          return res.status(400).json({ message: "Invalid donor ID format" })
        }
      }

      // Default: return all donors
      const allDonors = await donorsCollection.find({}).toArray()
      return res.status(200).json(allDonors)
    }

    // Method Not Allowed
    res.status(405).json({ message: "Method Not Allowed" })
  } catch (error: unknown) {
    console.error("❌ Unhandled error in API route:", error)
    res.status(500).json({
      message: "Internal Server Error",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}

export default registerDonor
