"use client"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { ArrowLeft, Droplet } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Donor {
  id: number;
  name: string;
  bloodType: string;
  location: string;
  distance: string;
  available: boolean;
}

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

export default function SearchResultsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Get blood type from search parameters
  const [donors, setDonors] = useState<Donor[]>([])  // State to hold donor data from DB
  const [loading, setLoading] = useState(true)
  const receiverBloodType = searchParams?.get("bloodType") || ""
  
  // const receiverBloodType = decodeURIComponent(searchParams?.get("bloodType") || "")
  console.log("Raw Blood Type:", receiverBloodType);  // Should log 'O+' correctly

  useEffect(() => {
    if (!receiverBloodType) return

    const fetchDonors = async () => {
      try {
        const encodedBloodType = encodeURIComponent(receiverBloodType);  // Encoding the blood type before passing it to the API
        console.log("Encoded Blood Type:", encodedBloodType);  // Check if it logs 'O%2B'

        const res = await fetch(`/api/donors?bloodType=${encodedBloodType}`);  // Pass the encoded value in the query string
        const data = await res.json();
        setDonors(data)
      } catch (error) {
        console.error("Error fetching donors:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonors()
  }, [receiverBloodType])

  // Get compatible donor blood types
  const compatibleDonorTypes = getCompatibleDonorTypes(receiverBloodType)
  console.log("Compatible Donor Types:", compatibleDonorTypes);

  // // Mock data for demonstration
  // const donors = [
  //   { id: 1, name: "John Doe", bloodType: "O-", location: "New York", distance: "2.5 miles", available: true },
  //   { id: 2, name: "Jane Smith", bloodType: "O+", location: "Boston", distance: "5 miles", available: true },
  //   { id: 3, name: "Robert Johnson", bloodType: "B+", location: "Chicago", distance: "3.2 miles", available: false },
  //   { id: 4, name: "Emily Davis", bloodType: "AB+", location: "San Francisco", distance: "1.8 miles", available: true },
  //   { id: 5, name: "Michael Wilson", bloodType: "A-", location: "Los Angeles", distance: "4.7 miles", available: true },
  //   { id: 6, name: "Sarah Brown", bloodType: "O+", location: "New York", distance: "3.1 miles", available: false },
  //   { id: 7, name: "David Miller", bloodType: "A+", location: "Chicago", distance: "2.9 miles", available: true },
  //   { id: 8, name: "Lisa Taylor", bloodType: "B-", location: "Boston", distance: "6.2 miles", available: true },
  // ]

  // Filter donors based on blood type compatibility
  const compatibleDonors = donors.filter((donor) => compatibleDonorTypes.includes(donor.bloodType))

  // Separate available and unavailable donors
  const availableDonors = compatibleDonors.filter((donor) => donor.available)
  const unavailableDonors = compatibleDonors.filter((donor) => !donor.available)

  // Combine the lists with available donors first
  const sortedDonors = [...availableDonors, ...unavailableDonors]

  const handleViewDonor = (id: number) => {
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

      {availableDonors.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Available Donors ({availableDonors.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {availableDonors.map((donor, index) => (
  <Card key={donor.id || index}> 
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{donor.name}</CardTitle>
                    <Badge className="bg-green-500">Available</Badge>
                  </div>
                  <CardDescription>
                    {donor.location} • {donor.distance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center mb-2">
                    <Droplet className="h-5 w-5 mr-2 text-red-500" />
                    <span className="font-medium">{donor.bloodType} blood type</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleViewDonor(donor.id)}>
                    View Donor Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      )}

      {availableDonors.length === 0 && unavailableDonors.length > 0 && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-800">
            No available donors found for {receiverBloodType} blood type. Showing unavailable donors instead.
          </p>
        </div>
      )}

      {unavailableDonors.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4">Unavailable Donors ({unavailableDonors.length})</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {unavailableDonors.map((donor) => (
              <Card key={donor.id} className="opacity-70">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle>{donor.name}</CardTitle>
                    <Badge className="bg-gray-400">Unavailable</Badge>
                  </div>
                  <CardDescription>
                    {donor.location} • {donor.distance}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex items-center mb-2">
                    <Droplet className="h-5 w-5 mr-2 text-red-500" />
                    <span className="font-medium">{donor.bloodType} blood type</span>
                  </div>
                  <div>{donor.location?.lat}, {donor.location?.lng}</div>  {/* Render lat and lng separately */}

                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full" onClick={() => handleViewDonor(donor.id)}>
                    View Donor Profile
                  </Button>
                </CardFooter>
              </Card>
            ))}
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

