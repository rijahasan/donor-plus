"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Droplet } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Donor {
  _id: string;
  firstName: string;
  lastName: string;
  bloodType: string;
  location: { lat: number; lng: number } | null; // location can be null now
  available: boolean;
}

// Blood compatibility logic
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

export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)
  const [receiverLocation, setReceiverLocation] = useState<{ lat: number; lng: number } | null>(null);


  const receiverBloodType = searchParams?.get("bloodType") || ""

  useEffect(() => {
    if (!receiverBloodType) return

    const fetchDonors = async () => {
      try {
        const encoded = encodeURIComponent(receiverBloodType)
        const res = await fetch(`/api/donors?bloodType=${encoded}`)
        const data = await res.json()
        console.log("✅ Fetched donors:", data) // Debug log
        setDonors(data)
      } catch (error) {
        console.error("Error fetching donors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [receiverBloodType])

  const compatibleTypes = getCompatibleDonorTypes(receiverBloodType)
  const compatibleDonors = donors.filter((donor) => compatibleTypes.includes(donor.bloodType))
  const availableDonors = compatibleDonors.filter((donor) => donor.available)
  const unavailableDonors = compatibleDonors.filter((donor) => !donor.available)

  const handleViewDonor = (id: string) => {
    console.log("🔍 Navigating to donor:", id)
    router.push(`/receiver/donor/${id}`)
  }

  const handleGoBack = () => {
    router.push("/receiver")
  }

  if (!receiverBloodType) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>No blood type specified</p>
        <Button onClick={handleGoBack} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Search
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleGoBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Donors for {receiverBloodType} Blood Type</h1>
        <p className="text-muted-foreground">
          Showing donors who can donate to {receiverBloodType} blood type recipients
        </p>
      </div>

      {/* Available Donors */}
      {availableDonors.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Available Donors ({availableDonors.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {availableDonors.map((donor) => {
              const fullName = `${donor.firstName} ${donor.lastName}`

              // Check if location exists before trying to access lat/lng
              const location = donor.location ? `${donor.location.lat}, ${donor.location.lng}` : "Location not available";

              return (
                <Card key={donor._id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{fullName}</CardTitle>
                      <Badge className="bg-green-500">Available</Badge>
                    </div>
                    <CardDescription>{location}</CardDescription>  {/* Display location safely */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <Droplet className="h-5 w-5 mr-2 text-red-500" />
                      <span className="font-medium">{donor.bloodType} blood type</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleViewDonor(donor._id)}>
                      View Donor Profile
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {/* Unavailable Donors */}
      {availableDonors.length === 0 && unavailableDonors.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            No available donors found. Showing unavailable donors instead.
          </p>
        </div>
      )}

      {unavailableDonors.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Unavailable Donors ({unavailableDonors.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unavailableDonors.map((donor) => {
              const fullName = `${donor.firstName} ${donor.lastName}`

              // Check if location exists before trying to access lat/lng
              const location = donor.location ? `${donor.location.lat}, ${donor.location.lng}` : "Location not available";

              return (
                <Card key={donor._id} className="opacity-70">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle>{fullName}</CardTitle>
                      <Badge className="bg-gray-400">Unavailable</Badge>
                    </div>
                    <CardDescription>{location}</CardDescription>  {/* Display location safely */}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      <Droplet className="h-5 w-5 mr-2 text-red-500" />
                      <span className="font-medium">{donor.bloodType} blood type</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" onClick={() => handleViewDonor(donor._id)}>
                      View Donor Profile
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        </>
      )}

      {compatibleDonors.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            No compatible donors found for {receiverBloodType} blood type.
          </p>
          <Button onClick={handleGoBack} className="mt-4">
            Back to Search
          </Button>
        </div>
      )}
    </div>
  )
}
