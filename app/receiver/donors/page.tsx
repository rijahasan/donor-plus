// // "use client"
// // import { useEffect, useState } from "react"
// // import { useRouter } from "next/navigation"
// // import {
// //   ArrowLeft,
// //   Droplet,
// //   MapPin,
// //   Phone,
// //   Mail,
// //   HandHeart
// // } from "lucide-react"
// // import {
// //   Card, CardHeader, CardTitle, CardDescription,
// //   CardContent, CardFooter
// // } from "@/components/ui/card"
// // import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// // import { Badge } from "@/components/ui/badge"
// // import { Button } from "@/components/ui/button"

// // interface Donor {
// //   _id: string
// //   firstName: string
// //   lastName: string
// //   email: string
// //   bloodType: string
// //   age: number
// //   weight: number
// //   recentSurgery: string
// //   surgeryDetails: string
// //   recentIllness: string
// //   illnessDetails: string
// //   onMedication: string
// //   medicationDetails: string
// //   chronicDisease: string
// //   diseaseDetails: string
// //   lastDonation: string | null
// //   location: { lat: number; lng: number }
// //   available: string // "yes" or "no"
// //   donationHistory?: { date: string; location: string }[]
// // }

// // export default function DonorProfile({ params }: { params: { id: string } }) {
// //   const router = useRouter()
// //   const [donor, setDonor] = useState<Donor | null>(null)

// //   useEffect(() => {
// //     const fetchDonor = async () => {
// //       try {
// //         const res = await fetch(`/api/donors/${params.id}`)
// //         const data = await res.json()
// //         setDonor(data)
// //       } catch (err) {
// //         console.error("❌ Error fetching donor:", err)
// //       }
// //     }

// //     fetchDonor()
// //   }, [params.id])

// //   const handleGoBack = () => router.back()
// //   const handleRequestBlood = () => {
// //     alert("🩸 Blood request sent successfully!")

// //   }

// //   if (!donor) return <div className="p-8">Loading...</div>

// //   const fullName = `${donor.firstName} ${donor.lastName}`
// //   const isAvailable = donor.available === "yes"
// //   const locationText = `${donor.location.lat}, ${donor.location.lng}`

// //   return (
// //     <div className="container mx-auto px-4 py-8">
// //       <Button variant="ghost" onClick={handleGoBack} className="mb-6">
// //         <ArrowLeft className="mr-2 h-4 w-4" />
// //         Back to Search
// //       </Button>

// //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
// //         {/* Main profile info */}
// //         <div className="md:col-span-2">
// //           <Card>
// //             <CardHeader>
// //               <div className="flex items-center gap-4">
// //                 <Avatar className="h-16 w-16">
// //                   <AvatarFallback>{donor.firstName[0]}{donor.lastName[0]}</AvatarFallback>
// //                 </Avatar>
// //                 <div>
// //                   <CardTitle className="text-2xl">{fullName}</CardTitle>
// //                   <CardDescription className="flex items-center mt-1">
// //                     <MapPin className="h-4 w-4 mr-1" />
// //                     {locationText}
// //                   </CardDescription>
// //                 </div>
// //                 <Badge className={`ml-auto ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}>
// //                   {isAvailable ? "Available" : "Unavailable"}
// //                 </Badge>
// //               </div>
// //             </CardHeader>

// //             <CardContent className="space-y-6">
// //               {/* Basic Info */}
// //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                 <InfoBox label="Blood Type" value={donor.bloodType} icon={<Droplet className="text-red-500 h-6 w-6" />} />
// //                 <InfoBox label="Age" value={`${donor.age} years`} />
// //                 <InfoBox label="Weight" value={`${donor.weight} kg`} />
// //                 <InfoBox label="Email" value={donor.email} icon={<Mail className="h-4 w-4" />} />
// //                 <InfoBox label="Last Donation" value={donor.lastDonation ?? "N/A"} />
// //               </div>

// //               {/* Medical Info */}
// //               <div>
// //                 <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
// //                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //                   <InfoBox label="Recent Surgery" value={donor.recentSurgery} />
// //                   <InfoBox label="Surgery Details" value={donor.surgeryDetails || "N/A"} />
// //                   <InfoBox label="Recent Illness" value={donor.recentIllness} />
// //                   <InfoBox label="Illness Details" value={donor.illnessDetails || "N/A"} />
// //                   <InfoBox label="On Medication" value={donor.onMedication} />
// //                   <InfoBox label="Medication Details" value={donor.medicationDetails || "N/A"} />
// //                   <InfoBox label="Chronic Disease" value={donor.chronicDisease} />
// //                   <InfoBox label="Disease Details" value={donor.diseaseDetails || "N/A"} />
// //                 </div>
// //               </div>

// //               {/* Donation History */}
// //               {donor.donationHistory?.length > 0 && (
// //                 <div>
// //                   <h3 className="text-lg font-semibold mb-3">Donation History</h3>
// //                   <div className="space-y-2">
// //                     {donor.donationHistory.map((entry, index) => (
// //                       <div key={index} className="p-3 border rounded-md">
// //                         <p className="font-medium">{entry.date}</p>
// //                         <p className="text-sm text-muted-foreground">{entry.location}</p>
// //                       </div>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}
// //             </CardContent>
// //           </Card>
// //         </div>

// //         {/* Action Panel */}
// //         <div className="space-y-6">
// //           <Card>
// //             <CardHeader>
// //               <CardTitle>Request Blood</CardTitle>
// //               <CardDescription>Send a blood request to this donor.</CardDescription>
// //             </CardHeader>
// //             <CardFooter>
// //               <Button className="w-full" onClick={handleRequestBlood} disabled={!isAvailable}>
// //                 <HandHeart className="mr-2 h-4 w-4" />
// //                 Request for Blood
// //               </Button>
// //             </CardFooter>
// //           </Card>
// //         </div>
// //       </div>
// //     </div>
// //   )
// // }

// // // Reusable info box
// // const InfoBox = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
// //   <div className="flex items-center p-4 border rounded-lg">
// //     {icon && <div className="mr-3">{icon}</div>}
// //     <div>
// //       <p className="text-sm text-muted-foreground">{label}</p>
// //       <p className="text-base font-semibold">{value}</p>
// //     </div>
// //   </div>
// // )
// "use client"
// import { useEffect, useState } from "react"
// import { useRouter } from "next/navigation"
// import {
//   ArrowLeft,
//   Droplet,
//   MapPin,
//   Phone,
//   Mail,
//   HandHeart
// } from "lucide-react"
// import {
//   Card, CardHeader, CardTitle, CardDescription,
//   CardContent, CardFooter
// } from "@/components/ui/card"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"

// interface Donor {
//   _id: string
//   firstName: string
//   lastName: string
//   email: string
//   bloodType: string
//   age: number
//   weight: number
//   recentSurgery: string
//   surgeryDetails: string
//   recentIllness: string
//   illnessDetails: string
//   onMedication: string
//   medicationDetails: string
//   chronicDisease: string
//   diseaseDetails: string
//   lastDonation: string | null
//   location: { lat: number; lng: number }
//   available: string // "yes" or "no"
//   donationHistory?: { date: string; location: string }[]
// }

// export default function DonorProfile({ params }: { params: { id: string } }) {
//   const router = useRouter()
//   const [donor, setDonor] = useState<Donor | null>(null)

//   useEffect(() => {
//     const fetchDonor = async () => {
//       try {
//         const res = await fetch(`/api/donors/${params.id}`)
//         const data = await res.json()
//         setDonor(data)
//       } catch (err) {
//         console.error("❌ Error fetching donor:", err)
//       }
//     }

//     fetchDonor()
//   }, [params.id])

//   const handleGoBack = () => router.back()
//   const handleRequestBlood = () => {
//     alert("🩸 Blood request sent successfully!")
//   }

//   if (!donor) return <div className="p-8">Loading...</div>

//   const fullName = `${donor.firstName} ${donor.lastName}`
//   const isAvailable = donor.available === "yes"
//   const locationText = `${donor.location.lat}, ${donor.location.lng}`

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <Button variant="ghost" onClick={handleGoBack} className="mb-6">
//         <ArrowLeft className="mr-2 h-4 w-4" />
//         Back to Search
//       </Button>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Main profile info */}
//         <div className="md:col-span-2">
//           <Card>
//             <CardHeader>
//               <div className="flex items-center gap-4">
//                 <Avatar className="h-16 w-16">
//                   <AvatarFallback>{donor.firstName[0]}{donor.lastName[0]}</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <CardTitle className="text-2xl">{fullName}</CardTitle>
//                   <CardDescription className="flex items-center mt-1">
//                     <MapPin className="h-4 w-4 mr-1" />
//                     {locationText}
//                   </CardDescription>
//                 </div>
//                 <Badge className={`ml-auto ${isAvailable ? "bg-green-500" : "bg-gray-400"}`}>
//                   {isAvailable ? "Available" : "Unavailable"}
//                 </Badge>
//               </div>
//             </CardHeader>

//             <CardContent className="space-y-6">
//               {/* Basic Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <InfoBox label="Blood Type" value={donor.bloodType} icon={<Droplet className="text-red-500 h-6 w-6" />} />
//                 <InfoBox label="Age" value={`${donor.age} years`} />
//                 <InfoBox label="Weight" value={`${donor.weight} kg`} />
//                 <InfoBox label="Email" value={donor.email} icon={<Mail className="h-4 w-4" />} />
//                 <InfoBox label="Last Donation" value={donor.lastDonation ?? "N/A"} />
//               </div>

//               {/* Medical Info */}
//               <div>
//                 <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <InfoBox label="Recent Surgery" value={donor.recentSurgery} />
//                   <InfoBox label="Surgery Details" value={donor.surgeryDetails || "N/A"} />
//                   <InfoBox label="Recent Illness" value={donor.recentIllness} />
//                   <InfoBox label="Illness Details" value={donor.illnessDetails || "N/A"} />
//                   <InfoBox label="On Medication" value={donor.onMedication} />
//                   <InfoBox label="Medication Details" value={donor.medicationDetails || "N/A"} />
//                   <InfoBox label="Chronic Disease" value={donor.chronicDisease} />
//                   <InfoBox label="Disease Details" value={donor.diseaseDetails || "N/A"} />
//                 </div>
//               </div>

//               {/* Donation History */}
//               {donor.donationHistory?.length > 0 && (
//                 <div>
//                   <h3 className="text-lg font-semibold mb-3">Donation History</h3>
//                   <div className="space-y-2">
//                     {donor.donationHistory.map((entry, index) => (
//                       <div key={index} className="p-3 border rounded-md">
//                         <p className="font-medium">{entry.date}</p>
//                         <p className="text-sm text-muted-foreground">{entry.location}</p>
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               )}
//             </CardContent>
//           </Card>
//         </div>

//         {/* Action Panel */}
//         <div className="space-y-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Request Blood</CardTitle>
//               <CardDescription>Send a blood request to this donor.</CardDescription>
//             </CardHeader>
//             <CardFooter>
//               <Button className="w-full" onClick={handleRequestBlood} disabled={!isAvailable}>
//                 <HandHeart className="mr-2 h-4 w-4" />
//                 Request for Blood
//               </Button>
//             </CardFooter>
//           </Card>
//         </div>
//       </div>
//     </div>
//   )
// }

// // Reusable info box
// const InfoBox = ({ label, value, icon }: { label: string, value: string, icon?: React.ReactNode }) => (
//   <div className="flex items-center p-4 border rounded-lg">
//     {icon && <div className="mr-3">{icon}</div>}
//     <div>
//       <p className="text-sm text-muted-foreground">{label}</p>
//       <p className="text-base font-semibold">{value}</p>
//     </div>
//   </div>
// )
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

  // List of blood types this donor can donate to
  // const getCompatibleBloodTypes = (bloodType: string) => {
  //   switch (bloodType) {
  //     case "O-": return ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  //     case "O+": return ["A+", "B+", "AB+", "O+"]
  //     case "A-": return ["A+", "A-", "AB+", "AB-"]
  //     case "A+": return ["A+", "AB+"]
  //     case "B-": return ["B+", "B-", "AB+", "AB-"]
  //     case "B+": return ["B+", "AB+"]
  //     case "AB-": return ["AB+", "AB-"]
  //     case "AB+": return ["AB+"]
  //     default: return []
  //   }
  // }

  // const canDonateTo = getCompatibleBloodTypes(donor.bloodType)
  // const location = donor.location ? `${donor.location.lat}, ${donor.location.lng}` : "Location not available";

  //   return (
  //     <div className="container mx-auto px-4 py-8">
  //       <Button variant="ghost" onClick={handleGoBack} className="mb-6">
  //         <ArrowLeft className="mr-2 h-4 w-4" />
  //         Back to Search
  //       </Button>

  //       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  //         <div className="md:col-span-2">
  //           <Card>
  //             <CardHeader>
  //               <div className="flex items-center gap-4">
  //                 <Avatar className="h-16 w-16">
  //                   <AvatarFallback className="text-lg">
  //                     {donor.firstName}{donor.lastName}
  //                   </AvatarFallback>
  //                 </Avatar>
  //                 <div>
  //                   <CardTitle className="text-2xl">{donor.firstName} {donor.lastName}</CardTitle>
  //                   <CardDescription className="flex items-center mt-1">
  //                     <MapPin className="h-4 w-4 mr-1" />
  //                     {typeof donor.location === "string"
  //                       ? donor.location || "Unknown Location"
  //                       : donor.location?.lat && donor.location?.lng
  //                         ? `Lat: ${donor.location.lat}, Lng: ${donor.location.lng}`
  //                         : "Unknown Location"
  //                     }
  //                   </CardDescription>

  //                 </div>
  //                 <Badge className={`ml-auto ${donor.available ? "bg-green-500" : "bg-gray-400"}`}>
  //                   {donor.available ? "Available" : "Unavailable"}
  //                 </Badge>

  //               </div>
  //             </CardHeader>
  //             <CardContent className="space-y-6">
  //               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //                 <div className="flex items-center p-4 border rounded-lg">
  //                   <Droplet className="h-8 w-8 mr-3 text-red-500" />
  //                   <div>
  //                     <p className="text-sm text-muted-foreground">Blood Type</p>
  //                     <p className="text-xl font-bold">{donor.bloodType}</p>
  //                   </div>
  //                 </div>
  //               </div>

  //               <div>
  //                 <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
  //                 <div className="space-y-2">
  //                   {donor.phone && (
  //                     <div className="flex items-center">
  //                       <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
  //                       <span>{donor.phone}</span>
  //                     </div>
  //                   )}
  //                   <div className="flex items-center">
  //                     <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
  //                     <span>{donor.email}</span>
  //                   </div>
  //                 </div>
  //               </div>

  //               {/* Optional: Donation History */}
  //               {/* {donor.donationHistory && (
  //                 <div>
  //                   <h3 className="text-lg font-semibold mb-3">Donation History</h3>
  //                   <div className="space-y-2">
  //                     {donor.donationHistory.map((donation, index) => (
  //                       <div key={index} className="p-3 border rounded-md">
  //                         <p className="font-medium">{donation.date}</p>
  //                         <p className="text-sm text-muted-foreground">{donation.location}</p>
  //                       </div>
  //                     ))}
  //                   </div>
  //                 </div> */}
  //               {/* )} */}
  //             </CardContent>
  //           </Card>
  //         </div>

  //         <div className="space-y-6">

  //           <Card>
  //             <CardHeader>
  //               <CardTitle>Send Message</CardTitle>
  //               <CardDescription>Contact this donor directly</CardDescription>
  //             </CardHeader>
  //             <CardContent>
  //               <Textarea
  //                 placeholder="Type your message here..."
  //                 className="min-h-[120px]"
  //                 value={message}
  //                 onChange={(e) => setMessage(e.target.value)}
  //               />
  //             </CardContent>
  //             <CardFooter>
  //               <Button className="w-full" onClick={handleSendMessage} disabled={!donor.available}>
  //                 <MessageSquare className="mr-2 h-4 w-4" />
  //                 Send Message
  //               </Button>
  //               {!donor.available && (
  //                 <p className="text-sm text-red-500 mt-2">This donor is currently unavailable</p>
  //               )}
  //             </CardFooter>
  //           </Card>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }
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
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="text-lg">
                    {donor.firstName[0]}{donor.lastName[0]}
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
                <h3 className="text-lg font-semibold mb-3">Medical Information</h3>
                <div className="space-y-2">
                  {donor.recentSurgery && (
                    <div className="flex items-center">
                      <span className="font-medium">Recent Surgery: </span>
                      <span>{donor.recentSurgery}</span>
                    </div>
                  )}
                  {donor.surgeryDetails && (
                    <div className="flex items-center">
                      <span className="font-medium">Surgery Details:</span>
                      <span>{donor.surgeryDetails}</span>
                    </div>
                  )}
                  {donor.recentIllness && (
                    <div className="flex items-center">
                      <span className="font-medium">Recent Illness:</span>
                      <span>{donor.recentIllness}</span>
                    </div>
                  )}
                  {donor.illnessDetails && (
                    <div className="flex items-center">
                      <span className="font-medium">Illness Details:</span>
                      <span>{donor.illnessDetails}</span>
                    </div>
                  )}
                  {donor.onMedication && (
                    <div className="flex items-center">
                      <span className="font-medium">On Medication:</span>
                      <span>{donor.onMedication}</span>
                    </div>
                  )}
                  {donor.medicationDetails && (
                    <div className="flex items-center">
                      <span className="font-medium">Medication Details:</span>
                      <span>{donor.medicationDetails}</span>
                    </div>
                  )}
                  {donor.chronicDisease && (
                    <div className="flex items-center">
                      <span className="font-medium">Chronic Disease:</span>
                      <span>{donor.chronicDisease}</span>
                    </div>
                  )}
                  {donor.diseaseDetails && (
                    <div className="flex items-center">
                      <span className="font-medium">Disease Details:</span>
                      <span>{donor.diseaseDetails}</span>
                    </div>
                  )}
                  {donor.lastDonation && (
                    <div className="flex items-center">
                      <span className="font-medium">Last Donation:</span>
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
                  Contant {donor.firstName} through their email right away

                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Send request & a note</CardTitle>
              <CardDescription>If {donor.firstName} is available, you will receive their phone number soon!</CardDescription>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Add a message if you would like!"
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
    </div>
  );
}