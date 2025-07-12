"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation";
import { ArrowLeft, Droplet, MapPin, Phone, Mail, MessageSquare, SendIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DonationHistoryEntry {
  date: string
  location: string
}

interface Donor {
  firstName?: "string",          // string
  lastName?: "string",           // string
  email?: "string",              // string
  bloodType?: "string",          // string
  age?: "number",                // string (or number if preferred)
  weight?: "number",             // string (or number if preferred)
  recentSurgery: "string",      // string
  surgeryDetails?: "string",     // string
  recentIllness?: "string",      // string
  illnessDetails?: "string",     // string
  onMedication?: "string",       // string
  medicationDetails?: "string",  // string
  chronicDisease?: "string",     // string
  diseaseDetails?: "string",     // string
  lastDonation?: "date",       // string (date)
  location?: Object
  available?: true,          // string (can be "true" or "false")
  phone?: "string"              // string (optional)
}

export default function DonorProfilePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const receiver_email = searchParams?.get("receiver_email") || ""
  const email = searchParams?.get("email") || ""
  const [message, setMessage] = useState("")
  const [donor, setDonor] = useState<Donor | null>(null)
  const [loading, setLoading] = useState(true)
  const today = new Date().toISOString();


  useEffect(() => {
    const fetchDonor = async () => {
      try {
        const encoded = encodeURIComponent(email)
        const res = await fetch(`/api/donors?email=${encoded}`)

        const data = await res.json()
        console.log("✅ Fetched donors:", data) // Debug log


        setDonor(data)
      } catch (error) {
        console.error("❌ Error fetching donor:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDonor()
  }, [email])

  // const handleSendMessage = () => {
  //   if (!message.trim() || !donor) return
  //   // post donor.email, receiver_email, and message to api/request
  //   console.log("Sending request to donor:", donor.email, message)
  //   alert("Request sent successfully!")
  //   setMessage("")
  // }
  const handleSendMessage = async () => {
    if (!message.trim() || !donor) return

    try {
      // Send request to the API with donor's email, receiver's email, and message
      const response = await fetch('/api/notifyDonor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          donorEmail: donor.email,
          receiverEmail: receiver_email,  // Replace with actual receiver email
          message,
          date: today,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        alert("Request sent and donor notified successfully!")
        setMessage("")
      } else {
        alert(`Error: ${data.message}`)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      alert("Something went wrong. Please try again.")
    }
  }

  const handleGoBack = () => {
    router.back()
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Loading donor information...</p>
      </div>
    )
  }

  if (!donor) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>Donor not found</p>
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20 rounded-full bg-gray-400 flex items-center justify-center">
                  <AvatarFallback className="text-xl text-white bg-mr-3">
                    {donor?.firstName?.[0]?.toUpperCase() ?? ''}
                    {donor?.lastName?.[0]?.toUpperCase() ?? ''}
                  </AvatarFallback>
                </Avatar>




                <div>
                  <CardTitle className="text-2xl">{donor.firstName} {donor.lastName}</CardTitle>
                  <CardDescription className="flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {typeof donor.location === "string"
                      ? donor.location || "Unknown Location"
                      : donor.location?.lat && donor.location?.lng
                        ? `Lat: ${donor.location.lat}, Lng: ${donor.location.lng}`
                        : "Unknown Location"
                    }
                  </CardDescription>
                </div>
                <Badge className={`ml-auto ${donor.available ? "bg-green-500" : "bg-gray-400"}`}>
                  {donor.available ? "Available" : "Unavailable"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center p-4 border rounded-lg">
                  <Droplet className="h-8 w-8 mr-3 text-red-500" />
                  <div>
                    <p className="text-sm text-muted-foreground">Blood Type</p>
                    <p className="text-xl font-bold">{donor.bloodType}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col items-start p-6 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Age</p>
                  <p className="text-xl font-bold">{donor.age}</p>
                </div>
                <div className="flex flex-col items-start p-6 border rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Weight</p>
                  <p className="text-xl font-bold">{donor.weight}</p>
                </div>
              </div>



              <div>
                <h3 className="text-lg font-semibold mb-4">Medical Information</h3>
                <div className="space-y-3">
                  {donor.recentSurgery && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Recent Surgery:</span>
                      <span>{donor.recentSurgery}</span>
                    </div>
                  )}
                  {donor.surgeryDetails && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Surgery Details:</span>
                      <span>{donor.surgeryDetails}</span>
                    </div>
                  )}
                  {donor.recentIllness && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Recent Illness:</span>
                      <span>{donor.recentIllness}</span>
                    </div>
                  )}
                  {donor.illnessDetails && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Illness Details:</span>
                      <span>{donor.illnessDetails}</span>
                    </div>
                  )}
                  {donor.onMedication && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">On Medication:</span>
                      <span>{donor.onMedication}</span>
                    </div>
                  )}
                  {donor.medicationDetails && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Medication Details:</span>
                      <span>{donor.medicationDetails}</span>
                    </div>
                  )}
                  {donor.chronicDisease && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Chronic Disease:</span>
                      <span>{donor.chronicDisease}</span>
                    </div>
                  )}
                  {donor.diseaseDetails && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Disease Details:</span>
                      <span>{donor.diseaseDetails}</span>
                    </div>
                  )}
                  {donor.lastDonation && (
                    <div className="flex items-start space-x-2">
                      <span className="font-medium w-48">Last Donation:</span>
                      <span>{new Date(donor.lastDonation).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {donor.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{donor.email}</span>
                    </div>
                  )}
                  <span className="text-sm text-gray-500">
                    Contact {donor.firstName} through their email right away!
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Please send details with request to ensure availability</CardTitle>
              <CardDescription>If {donor.firstName} is available, you will receive their phone number soon!</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add your details for prompt response."
                className="min-h-[120px]"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={handleSendMessage} disabled={!donor.available}>
                <SendIcon className="mr-2 h-4 w-4" />
                Send Request
              </Button>
              {!donor.available && (
                <p className="text-sm text-red-500 mt-2">This donor is currently unavailable</p>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div >
  );
}