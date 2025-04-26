// "use client"
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { MapPin, Calendar, Clock } from "lucide-react";
// import { Switch } from "@/components/ui/switch";


// export default function DashboardPage() {
//   const [donor, setDonor] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [showUpdateForm, setShowUpdateForm] = useState(false)
//   const router = useRouter();
//   const [medication, setmedication] = useState(donor?.onmedication === "yes");

//   useEffect(() => {
//     const fetchDonorInfo = async () => {
//       try {
//         // Get the saved email (still from localStorage)
//         const donorData = localStorage.getItem("donor");
//         const donorObject = donorData ? JSON.parse(donorData) : null;

//         // if (!donorObject?.email) {
//         //   router.push("/login");
//         //   return;
//         // }

//         const response = await fetch("/api/donor-info", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             email: donorObject.email, // <- pass email in headers
//           },
//         });

//         // if (!response.ok) {
//         //   router.push("/login");
//         //   return;
//         // }

//         const data = await response.json();
//         setDonor(data);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching donor info:", error);
//         router.push("/login");
//       }
//     };

//     fetchDonorInfo();
//   }, [router]);
//   async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     const formData = new FormData(e.currentTarget)

//     const updatedUser = {
//       ...donor,
//       weight: Number(formData.get('weight')),
//       height: Number(formData.get('height')),
//       recentSurgery: formData.get('recentSurgery') === "true",
//       surgeryDetails: formData.get('surgeryDetails'),
//       recentIllness: formData.get('recentIllness') === "true",
//       illnessDetails: formData.get('illnessDetails'),
//       onMedication: formData.get('onMedication') === "true",
//       medicationDetails: formData.get('medicationDetails'),
//       chronicDiseases: formData.get('chronicDiseases') === "true",
//       diseaseDetails: formData.get('diseaseDetails')
//     }

//     try {
//       const res = await fetch("/api/donor-info", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(updatedUser),
//       })

//       if (res.ok) {
//         setDonor(updatedUser)
//         setShowUpdateForm(false) // hide the form after saving
//       } else {
//         console.error("Failed to update")
//       }
//     } catch (error) {
//       console.error("Error updating user", error)
//     }
//   }
//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <h1 className="font-bold text-xl text-red-600">Donor+</h1>
//           <div className="flex items-center space-x-4">
//             <Avatar className="h-12 w-12">
//               <AvatarImage src="/api/placeholder.svg?height=96&width=96" alt="User" />
//               <AvatarFallback className="text-2xl">{donor?.firstName?.[0]}</AvatarFallback>
//             </Avatar>
//             <div className="hidden md:block">
//               <p className="text-sm font-medium">{donor?.firstName} {donor?.lastName}</p>
//               <p className="text-xs text-gray-500">{donor?.bloodType} Donor</p>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="flex-1 p-6">
//         <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
//           {/* Sidebar */}
//           <div className="lg:col-span-1 space-y-6">
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Donor Profile</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex flex-col items-center mb-6">
//                   <Avatar className="h-24 w-24 mb-4">
//                     <AvatarImage src="/api/placeholder.svg?height=96&width=96" alt="User" />
//                     <AvatarFallback className="text-2xl">{donor?.firstName?.[0]}</AvatarFallback>
//                   </Avatar>
//                   <h3 className="text-xl font-semibold">{donor?.firstName} {donor?.lastName}</h3>
//                   <div className="flex items-center space-x-2 mt-1">
//                     <Badge className="bg-red-600">{donor?.bloodType}</Badge>
//                     <Badge variant="outline">Donor</Badge>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Availability Toggle */}
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">Available to donate</span>
//                     <Switch
//                       checked={donor?.available}
//                       onCheckedChange={async (value) => {
//                         const updatedDonor = { ...donor, available: value };
//                         setDonor(updatedDonor);
//                         localStorage.setItem("donor", JSON.stringify(updatedDonor));

//                         // Send to server (PATCH)
//                         const response = await fetch("/api/donor-info", {
//                           method: "PATCH",
//                           headers: { "Content-Type": "application/json" },
//                           body: JSON.stringify({
//                             email: donor.email,      // Email of the donor
//                             available: value         // New availability
//                           }),
//                         });

//                         const result = await response.json();
//                         if (response.ok) {
//                           console.log("Donor updated successfully:", result);
//                         } else {
//                           console.error("Error updating donor:", result);
//                         }
//                       }}

//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-medium">Age</span>
//                     <span className="text-sm text-gray-500">{donor?.age || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Weight</span>
//                     <span className="text-sm text-gray-500">{donor?.weight || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Last Donation</span>
//                     <span className="text-sm text-gray-500">{donor?.lastDonationDate || "N/A"}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>


//             {/* Health Information */}
//             {/* <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Health Information</CardTitle>
//                 <CardDescription>Your health details for donation</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Blood Type</span>
//                     <span className="font-medium">{donor?.bloodType}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Weight</span>
//                     <span className="font-medium">{donor?.weight || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Height</span>
//                     <span className="font-medium">{donor?.height || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Recent Surgery</span>
//                     <span className="font-medium">{donor?.recentSurgery || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Illness Details</span>
//                     <span className="font-medium">{donor?.illnessDetails || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Medication Details</span>
//                     <span className="font-medium">{donor?.medicationDetails || "N/A"}</span>
//                   </div>
//                   <div className="pt-2">
//                     <Button variant="outline" size="sm" className="w-full">
//                       Update Health Info
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card> */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Health Information</CardTitle>
//                 <CardDescription>Your health details for donation</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Blood Type</span>
//                     <span className="font-medium">{donor.bloodType}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Weight</span>
//                     <span className="font-medium">{donor?.weight} kg</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Height</span>
//                     <span className="font-medium">{donor?.height} cm</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Last Checkup</span>
//                     <span className="font-medium">{donor?.lastCheckupDate}</span>
//                   </div>

//                   {/* New Health Questions */}
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Surgery (last 6 months)</span>
//                     <span className="font-medium">{donor?.hadSurgery ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Illness (last 3 months)</span>
//                     <span className="font-medium">{donor?.beenIll ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Taking Medication</span>
//                     <span className="font-medium">{donor?.takingMedication ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Chronic Diseases</span>
//                     <span className="font-medium">{donor?.chronicDiseases ? "Yes" : "No"}</span>
//                   </div>

//                   <Button
//                     variant="default"
//                     onClick={() => setShowUpdateForm(true)}
//                     className="mb-4"
//                   >
//                     Update Health Info
//                   </Button>
//                   {showUpdateForm && (
//                     <form onSubmit={handleUpdate} className="space-y-4 mt-4">


//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Blood Type</label>
//                         <input
//                           type="text"
//                           name="bloodType"
//                           defaultValue={donor?.bloodType}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Age</label>
//                         <input
//                           type="number"
//                           name="age"
//                           defaultValue={donor?.age}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Weight (kg)</label>
//                         <input
//                           type="number"
//                           name="weight"
//                           defaultValue={donor?.weight}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Recent Surgery</label>
//                         <input
//                           type="text"
//                           name="recentSurgery"
//                           defaultValue={donor?.recentSurgery}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Surgery Details</label>
//                         <input
//                           type="text"
//                           name="surgeryDetails"
//                           defaultValue={donor?.surgeryDetails}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Recent Illness</label>
//                         <input
//                           type="text"
//                           name="recentIllness"
//                           defaultValue={donor?.recentIllness}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Illness Details</label>
//                         <input
//                           type="text"
//                           name="illnessDetails"
//                           defaultValue={donor?.illnessDetails}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500 mb-1">On Medication</label>
//                         <Switch
//                           checked={donor?.onmedication}
//                           onChange={setmedication}
//                           className={`${medication ? "bg-blue-600" : "bg-gray-200"
//                             } relative inline-flex items-center h-6 rounded-full w-11`}
//                         >
//                           <span
//                             className={`${medication ? "translate-x-6" : "translate-x-1"
//                               } inline-block w-4 h-4 transform bg-white rounded-full`}
//                           />
//                         </Switch>
//                       </div>


//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Medication Details</label>
//                         <input
//                           type="text"
//                           name="medicationDetails"
//                           defaultValue={donor?.medicationDetails}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Chronic Disease</label>
//                         <input
//                           type="text"
//                           name="chronicDisease"
//                           defaultValue={donor?.chronicDisease}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Disease Details</label>
//                         <input
//                           type="text"
//                           name="diseaseDetails"
//                           defaultValue={donor?.diseaseDetails}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Last Donation Date</label>
//                         <input
//                           type="date"
//                           name="lastDonation"
//                           defaultValue={donor?.lastDonation?.split("T")[0]} // in case MongoDB returns ISOString
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <Button type="submit" variant="default">
//                         Save Changes
//                       </Button>
//                     </form>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Donation History */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Donation History</CardTitle>
//                 <CardDescription>Your past blood donations</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {/* Donation Record */}
//                   <div className="flex items-center justify-between border-b pb-4">
//                     <div>
//                       <h4 className="font-medium">General Hospital</h4>
//                       <p className="text-sm text-gray-500">March 15, 2024</p>
//                       <Badge variant="outline" className="mt-1">
//                         {donor?.bloodType} Blood
//                       </Badge>
//                     </div>
//                     <div className="text-right">
//                       <p className="text-sm font-medium">450ml</p>
//                       <p className="text-xs text-gray-500">Certificate #12345</p>
//                     </div>
//                   </div>

//                   <div className="text-center pt-2">
//                     <Button variant="outline">View All History</Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Upcoming Appointments */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Upcoming Appointments</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center py-6">
//                   <p className="text-gray-500 mb-4">You have no upcoming donation appointments.</p>
//                   <Button className="bg-red-600 hover:bg-red-700">Schedule Donation</Button>
//                 </div>
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function DashboardPage() {
  const [donor, setDonor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const bloodTypeLabels: Record<string, string> = {
    "a_positive": "A+",
    "a_negative": "A-",
    "b_positive": "B+",
    "b_negative": "B-",
    "ab_positive": "AB+",
    "ab_negative": "AB-",
    "o_positive": "O+",
    "o_negative": "O-",
    "unknown": "I don't know",
  };

  useEffect(() => {
    const fetchDonorInfo = async () => {
      try {
        // Get the auth token from localStorage
        const token = localStorage.getItem("authToken")
        const email = localStorage.getItem("email")

        if (!token || !email) {
          console.error("No authentication token or email found")
          router.push("/login")
          return
        }

        // Add timestamp and cache control to prevent 304 responses
        const response = await fetch(`/api/donor-info?email=${encodeURIComponent(email)}&t=${Date.now()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Pragma: "no-cache",
          },
        })

        if (!response.ok) {
          if (response.status === 401) {
            // Token expired or invalid
            localStorage.removeItem("authToken")
            localStorage.removeItem("email")
            router.push("/login")
            return
          }
          throw new Error(`Failed to fetch donor info: ${response.status}`)
        }

        const data = await response.json()

        // Verify the email matches to ensure we have the correct donor
        if (data.email !== email) {
          console.error("Email mismatch in donor data")
          router.push("/login")
          return
        }

        setDonor(data)
      } catch (error) {
        console.error("Error fetching donor info:", error)

        toast.error("Failed to load your profile. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

      } finally {
        setLoading(false)
      }
    }

    fetchDonorInfo()
  }, [router])

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsUpdating(true)

    try {
      const formData = new FormData(e.currentTarget)
      const token = localStorage.getItem("authToken")

      if (!token) {
        router.push("/login")
        return
      }

      const updatedUser = {
        email: donor.email,
        weight: Number(formData.get("weight")),
        age: Number(formData.get("age")),
        bloodType: formData.get("bloodType"),
        recentSurgery: formData.get("recentSurgery"),
        surgeryDetails: formData.get("surgeryDetails"),
        recentIllness: formData.get("recentIllness"),
        illnessDetails: formData.get("illnessDetails"),
        onMedication: formData.get("onMedication"),
        medicationDetails: formData.get("medicationDetails"),
        chronicDisease: formData.get("chronicDisease"),
        diseaseDetails: formData.get("diseaseDetails"),
        lastDonation: formData.get("lastDonation"),
      }

      const res = await fetch("/api/donor-info", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedUser),
      })

      if (res.ok) {
        // Refetch the donor data to ensure we have the latest
        const refreshResponse = await fetch(
          `/api/donor-info?email=${encodeURIComponent(donor.email)}&t=${Date.now()}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "Cache-Control": "no-cache, no-store, must-revalidate",
            },
          },
        )

        if (refreshResponse.ok) {
          const refreshedData = await refreshResponse.json()
          setDonor(refreshedData)
        }
        console.log("Calling toast.success...");
        toast.success("Your health information has been updated.", {
          // position: "top-right",
          // autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setShowUpdateForm(false)



      } else {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update")
      }
    } catch (error) {
      console.error("Error updating user", error)
      toast.error("There was a problem updating your information.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsUpdating(false)
    }
  }

  async function handleAvailabilityChange(value: boolean) {
    try {
      const token = localStorage.getItem("authToken")

      if (!token) {
        router.push("/login")
        return
      }

      // Optimistically update UI
      setDonor((prev: any) => ({ ...prev, available: value }))

      const response = await fetch("/api/donor-info", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: donor?.email,
          available: value,
        }),
      })

      if (!response.ok) {
        // Revert the change if the API call fails
        setDonor((prev: any) => ({ ...prev, available: !value }))
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to update availability")
      }


      const message = value
        ? {
          title: "You're now available",
          description: "You'll be notified of donation requests.",
        }
        : {
          title: "You're now unavailable",
          description: "You won't receive donation requests.",
        };

      toast.success(message.description, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error updating availability:", error)
      toast.error("There was a problem updating your availability.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-xl text-red-600">Donor+</h1>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              {/* <AvatarImage src="/api/placeholder.svg?height=96&width=96" alt="User" /> */}
              <AvatarFallback className="text-2xl">{donor?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">
                {donor?.firstName} {donor?.lastName}
              </p>
              <p className="text-xs text-gray-500">{bloodTypeLabels[donor?.bloodType]} Donor</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Donor Profile</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center mb-6">
                  <Avatar className="h-24 w-24 mb-4">
                    {/* <AvatarImage src="/api/placeholder.svg?height=96&width=96" alt="User" /> */}
                    <AvatarFallback className="text-2xl">{donor?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {donor?.firstName} {donor?.lastName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-red-600">{bloodTypeLabels[donor?.bloodType]}</Badge>
                    <Badge variant="outline">Donor</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Availability Toggle */}
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Available to donate</span>
                    <Switch
                      checked={donor?.available === 1 || donor?.available === true || donor?.available === "yes"}
                      onCheckedChange={handleAvailabilityChange}
                    />
                  </div>

                  <div className="flex justify-between">
                    <span className="font-medium">Age</span>
                    <span className="text-sm text-gray-500">{donor?.age || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight</span>
                    <span className="text-sm text-gray-500">{donor?.weight ? `${donor.weight} kg` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Donation</span>
                    <span className="text-sm text-gray-500">
                      {donor?.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "N/A"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Health Information</CardTitle>
                <CardDescription>Your health details for donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Blood Type</span>
                    <span className="font-medium">{bloodTypeLabels[donor?.bloodType]}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="font-medium">{donor?.weight ? `${donor.weight} kg` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Recent Surgery</span>
                    <span className="font-medium">{donor?.recentSurgery === "yes" ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Recent Illness</span>
                    <span className="font-medium">{donor?.recentIllness === "yes" ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Taking Medication</span>
                    <span className="font-medium">{donor?.onMedication === "yes" ? "Yes" : "No"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Chronic Diseases</span>
                    <span className="font-medium">{donor?.chronicDisease === "yes" ? "Yes" : "No"}</span>
                  </div>

                  <Button variant="default" onClick={() => setShowUpdateForm(true)} className="w-full mt-4">
                    Update Health Info
                  </Button>

                  {showUpdateForm && (
                    <form onSubmit={handleUpdate} className="space-y-4 mt-4">
                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Blood Type</label>
                        <select name="bloodType" defaultValue={donor?.bloodType} className="border rounded p-2">
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Age</label>
                        <input type="number" name="age" defaultValue={donor?.age} className="border rounded p-2" />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          defaultValue={donor?.weight}
                          className="border rounded p-2"
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Recent Surgery</label>
                        <select name="recentSurgery" defaultValue={donor?.recentSurgery} className="border rounded p-2">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Surgery Details</label>
                        <textarea
                          name="surgeryDetails"
                          defaultValue={donor?.surgeryDetails}
                          className="border rounded p-2"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Recent Illness</label>
                        <select name="recentIllness" defaultValue={donor?.recentIllness} className="border rounded p-2">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Illness Details</label>
                        <textarea
                          name="illnessDetails"
                          defaultValue={donor?.illnessDetails}
                          className="border rounded p-2"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">On Medication</label>
                        <select name="onMedication" defaultValue={donor?.onMedication} className="border rounded p-2">
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Medication Details</label>
                        <textarea
                          name="medicationDetails"
                          defaultValue={donor?.medicationDetails}
                          className="border rounded p-2"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Chronic Disease</label>
                        <select
                          name="chronicDisease"
                          defaultValue={donor?.chronicDisease}
                          className="border rounded p-2"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Disease Details</label>
                        <textarea
                          name="diseaseDetails"
                          defaultValue={donor?.diseaseDetails}
                          className="border rounded p-2"
                          rows={2}
                        />
                      </div>

                      <div className="flex flex-col">
                        <label className="text-sm text-gray-500">Last Donation Date</label>
                        <input
                          type="date"
                          name="lastDonation"
                          defaultValue={donor?.lastDonation?.split("T")[0]}
                          className="border rounded p-2"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button type="submit" variant="default" disabled={isUpdating} className="flex-1">
                          {isUpdating ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            "Save Changes"
                          )}
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowUpdateForm(false)}
                          disabled={isUpdating}
                          className="flex-1"
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Donation History */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Donation History</CardTitle>
                <CardDescription>Your past blood donations</CardDescription>
              </CardHeader>
              <CardContent>
                {donor.donationHistory && donor.donationHistory.length > 0 ? (
                  <div className="space-y-4">
                    {donor.donationHistory.map((donation: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h4 className="font-medium">{donation.location || "General Hospital"}</h4>
                          <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                          <Badge variant="outline" className="mt-1">
                            {donor?.bloodType} Blood
                          </Badge>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{donation.amount || "450ml"}</p>
                          <p className="text-xs text-gray-500">Certificate #{donation.certificateId || "N/A"}</p>
                        </div>
                      </div>
                    ))}
                    <div className="text-center pt-2">
                      <Button variant="outline">View All History</Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No donation history available.</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                {donor.appointments && donor.appointments.length > 0 ? (
                  <div className="space-y-4">
                    {donor.appointments.map((appointment: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4">
                        <div>
                          <h4 className="font-medium">{appointment.location}</h4>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(appointment.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <Clock className="h-4 w-4 mr-1" />
                            {appointment.time}
                          </div>
                        </div>
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500 mb-4">You have no upcoming donation appointments.</p>
                    <Button className="bg-red-600 hover:bg-red-700">Schedule Donation</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
