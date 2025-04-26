"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Droplet,
  MapPin,
  Phone,
  Mail,
  HandHeart
} from "lucide-react"
import {
  Card, CardHeader, CardTitle, CardDescription,
  CardContent, CardFooter
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Donor {
  _id: string
  firstName: string
  lastName: string
  email: string
  bloodType: string
  age: number
  weight: number
  recentSurgery: string
  surgeryDetails: string
  recentIllness: string
  illnessDetails: string
  onMedication: string
  medicationDetails: string
  chronicDisease: string
  diseaseDetails: string
  lastDonation: string | null
  location: { lat: number; lng: number }
  available: string // "yes" or "no"
  donationHistory?: { date: string; location: string }[]
}

export default function DonorProfile({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [donor, setDonor] = useState<Donor | null>(null)

  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const res = await fetch(`/api/donors/${params.id}`)
        const data = await res.json()
        setDonor(data)
      } catch (err) {
        console.error("❌ Error fetching donor:", err)
      }
    }

    fetchDonor()
  }, [params.id])

  const handleGoBack = () => router.back()
  const handleRequestBlood = () => {
    alert("🩸 Blood request sent successfully!")
  }

  if (!donor) return <div className="p-8">Loading...</div>

  const fullName = `${donor.firstName} ${donor.lastName}`
  const isAvailable = donor.available === "yes"
  const locationText = `${donor.location.lat}, ${donor.location.lng}`

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={handleGoBack} className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Search
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main profile info */}
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback>{donor.firstName[0]}{donor.lastName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-2xl">{fullName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {locationText}
                  </CardDescription>
                </div>
                <Badge className={`ml-auto ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}>
                  {isAvailable ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoBox label="Blood Type" value={donor.bloodType} icon={<Droplet className="text-red-500 h-6 w-6" />} />
                <InfoBox label="Age" value={`${donor.age} years`} />
                <InfoBox label="Weight" value={`${donor.weight} kg`} />
                <InfoBox label="Email" value={donor.email} icon={<Mail className="h-4 w-4" />} />
                <InfoBox label="Last Donation" value={donor.lastDonation ?? "N/A"} />
              </div>

              {/* Medical Info */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <InfoBox label="Recent Surgery" value={donor.recentSurgery} />
                  <InfoBox label="Surgery Details" value={donor.surgeryDetails || "N/A"} />
                  <InfoBox label="Recent Illness" value={donor.recentIllness} />
                  <InfoBox label="Illness Details" value={donor.illnessDetails || "N/A"} />
                  <InfoBox label="On Medication" value={donor.onMedication} />
                  <InfoBox label="Medication Details" value={donor.medicationDetails || "N/A"} />
                  <InfoBox label="Chronic Disease" value={donor.chronicDisease} />
                  <InfoBox label="Disease Details" value={donor.diseaseDetails || "N/A"} />
                </div>
              </div>

              {/* Donation History */}
              {donor.donationHistory?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Donation History</h3>
                  <div className="space-y-2">
                    {donor.donationHistory.map((entry, index) => (
                      <div key={index} className="p-3 border rounded-md">
                        <p className="font-medium">{entry.date}</p>
                        <p className="text-sm text-muted-foreground">{entry.location}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request Blood</CardTitle>
              <CardDescription>Send a blood request to this donor.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button className="w-full" onClick={handleRequestBlood} disabled={!isAvailable}>
                <HandHeart className="mr-2 h-4 w-4" />
                Request for Blood
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Reusable info box
const InfoBox = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
  <div className="flex items-center p-4 border rounded-lg">
    {icon && <div className="mr-3">{icon}</div>}
    <div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  </div>
)
