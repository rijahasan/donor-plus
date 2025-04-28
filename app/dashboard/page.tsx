
// "use client"

// import type React from "react"

// import { useState, useEffect } from "react"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Avatar, AvatarFallback } from "@/components/ui/avatar"
// import { Calendar, Loader2 } from "lucide-react"
// import { Switch } from "@/components/ui/switch"
// import { toast } from "react-toastify"
// import type { ObjectId } from "mongodb"
// // The CSS import is now in layout.tsx

// export default function DashboardPage() {
//   const [donor, setDonor] = useState<any>(null)
//   const [loading, setLoading] = useState(true)
//   const [showUpdateForm, setShowUpdateForm] = useState(false)
//   const [isUpdating, setIsUpdating] = useState(false)
//   const router = useRouter()
//   const bloodTypeLabels: Record<string, string> = {
//     a_positive: "A+",
//     a_negative: "A-",
//     b_positive: "B+",
//     b_negative: "B-",
//     ab_positive: "AB+",
//     ab_negative: "AB-",
//     o_positive: "O+",
//     o_negative: "O-",
//     unknown: "I don't know",
//   }
//   const today = new Date().toISOString()

//   // useEffect(() => {
//   //   async function fetchNotifications() {
//   //     try {
//   //       const res = await fetch(`/api/notifications?email=${donor.email}`);
//   //       const data = await res.json();
//   //       console.log("Fetched notifications:", data.notifications); // Check data here
//   //       setNotifications(data.notifications);
//   //     } catch (error) {
//   //       console.error("Failed to fetch notifications:", error);
//   //     }
//   //   }

//   //   if (donor?.email) {
//   //     fetchNotifications();
//   //   }
//   // }, [donor?.email]);
//   interface Appointment {
//     id: ObjectId
//     receiverEmail: string
//     bloodType: string
//     date: string
//     status: string
//     message: string
//   }

//   interface Notification {
//     email: string
//     firstName: string
//     lastName: string
//     bloodType: string
//     message: string
//   }

//   const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
//   const [notifications, setNotifications] = useState<Notification[]>([])

//   useEffect(() => {
//     async function fetchNotifications() {
//       try {
//         const res = await fetch(`/api/notifications?email=${donor.email}`)
//         const data = await res.json()
//         console.log("Fetched notifications:", data.notifications) // Check data here
//         setNotifications(data.notifications)
//       } catch (error) {
//         console.error("Failed to fetch notifications:", error)
//       }
//     }

//     if (donor?.email) {
//       fetchNotifications()
//     }
//   }, [donor?.email])

//   useEffect(() => {
//     async function fetchUpcomingAppointments() {
//       try {
//         if (!donor?.email) return;

//         const res = await fetch(`/api/appointments?email=${encodeURIComponent(donor.email)}`);

//         if (!res.ok) {
//           console.error(`Server responded with status: ${res.status}`);
//           const text = await res.text();
//           console.error("Response text:", text);
//           return;
//         }

//         const data = await res.json();
//         console.log("Fetched appointments:", data.appointments);
//         setUpcomingAppointments(data.appointments || []);

//       } catch (error) {
//         console.error("Failed to fetch appointments:", error);
//       }
//     }

//     if (donor?.email) {
//       fetchUpcomingAppointments();
//     }
//   }, [donor?.email]);

//   // {
//   //   notifications.length > 0 ? (
//   //     <div className="space-y-4">
//   //       {notifications.map((notif: any, index: number) => (
//   //         <div key={index} className="flex items-center justify-between border-b pb-4">
//   //           <div>
//   //             <h4 className="font-medium">{notif.firstName} {notif.lastName}</h4>
//   //             <p className="text-sm text-gray-500">{notif.email}</p>
//   //             <Badge variant="outline" className="mt-1">{notif.bloodType}</Badge>
//   //           </div>
//   //           <Button
//   //             size="sm"
//   //             variant="default"
//   //             onClick={() => handleAcceptRequest(notif.email, notif.bloodType)}
//   //           >
//   //             Accept Request
//   //           </Button>
//   //         </div>
//   //       ))}
//   //     </div>
//   //   ) : (
//   //   <div className="text-center py-6">
//   //     <p className="text-gray-500">No current requests.</p>
//   //   </div>
//   // )
//   // }

//   useEffect(() => {
//     const fetchDonorInfo = async () => {
//       try {
//         // Get the auth token from localStorage
//         const token = localStorage.getItem("authToken")
//         const email = localStorage.getItem("email")

//         if (!token || !email) {
//           console.error("No authentication token or email found")
//           router.push("/login")
//           return
//         }

//         // Add timestamp and cache control to prevent 304 responses
//         const response = await fetch(`/api/donor-info?email=${encodeURIComponent(email)}&t=${Date.now()}`, {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//             "Cache-Control": "no-cache, no-store, must-revalidate",
//             Pragma: "no-cache",
//           },
//         })

//         if (!response.ok) {
//           if (response.status === 401) {
//             // Token expired or invalid
//             localStorage.removeItem("authToken")
//             localStorage.removeItem("email")
//             router.push("/login")
//             return
//           }
//           throw new Error(`Failed to fetch donor info: ${response.status}`)
//         }

//         const data = await response.json()

//         // Verify the email matches to ensure we have the correct donor
//         if (data.email !== email) {
//           console.error("Email mismatch in donor data")
//           router.push("/login")
//           return
//         }

//         setDonor(data)
//       } catch (error) {
//         console.error("Error fetching donor info:", error)

//         toast.error("Failed to load your profile. Please try again.", {
//           position: "top-right",
//           autoClose: 5000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         })
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchDonorInfo()
//   }, [router])

//   async function handleUpdate(e: React.FormEvent<HTMLFormElement>) {
//     e.preventDefault()
//     setIsUpdating(true)

//     try {
//       const formData = new FormData(e.currentTarget)
//       const token = localStorage.getItem("authToken")

//       if (!token) {
//         router.push("/login")
//         return
//       }

//       const updatedUser = {
//         email: donor.email,
//         weight: Number(formData.get("weight")),
//         age: Number(formData.get("age")),
//         bloodType: formData.get("bloodType"),
//         recentSurgery: formData.get("recentSurgery"),
//         surgeryDetails: formData.get("surgeryDetails"),
//         recentIllness: formData.get("recentIllness"),
//         illnessDetails: formData.get("illnessDetails"),
//         onMedication: formData.get("onMedication"),
//         medicationDetails: formData.get("medicationDetails"),
//         chronicDisease: formData.get("chronicDisease"),
//         diseaseDetails: formData.get("diseaseDetails"),
//         lastDonation: formData.get("lastDonation"),
//       }

//       const res = await fetch("/api/donor-info", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(updatedUser),
//       })

//       if (res.ok) {
//         // Refetch the donor data to ensure we have the latest
//         const refreshResponse = await fetch(
//           `/api/donor-info?email=${encodeURIComponent(donor.email)}&t=${Date.now()}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//               "Cache-Control": "no-cache, no-store, must-revalidate",
//             },
//           },
//         )

//         if (refreshResponse.ok) {
//           const refreshedData = await refreshResponse.json()
//           setDonor(refreshedData)
//         }
//         console.log("Calling toast.success...")
//         toast.success("Your health information has been updated.", {
//           // position: "top-right",
//           // autoClose: 5000,
//           hideProgressBar: true,
//           closeOnClick: true,
//           pauseOnHover: true,
//           draggable: true,
//           progress: undefined,
//         })
//         setShowUpdateForm(false)
//       } else {
//         const errorData = await res.json()
//         throw new Error(errorData.message || "Failed to update")
//       }
//     } catch (error) {
//       console.error("Error updating user", error)
//       toast.error("There was a problem updating your information.", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       })
//     } finally {
//       setIsUpdating(false)
//     }
//   }
//   // async function handleAcceptRequest(receiverEmail: string, bloodType: string, message: string) {
//   //   try {
//   //     const res = await fetch("/api/match", {
//   //       method: "POST",
//   //       headers: { "Content-Type": "application/json" },
//   //       body: JSON.stringify({
//   //         donorEmail: donor.email,
//   //         receiverEmail,
//   //         bloodType,
//   //         message,
//   //         date: today,
//   //         status: "Accepted"   //means that its not completed yet

//   //       })
//   //     });

//   //     const data = await res.json();
//   //     if (res.ok) {
//   //       alert("Match successfully recorded!");

//   //       // Now notify the receiver too
//   //       const notifyRes = await fetch('/api/notifyReceiver', {
//   //         method: 'POST',
//   //         headers: { 'Content-Type': 'application/json' },
//   //         body: JSON.stringify({
//   //           receiverEmail: receiverEmail,    // notification receiver
//   //           donorInfo: {
//   //             firstName: donor.firstName,
//   //             lastName: donor.lastName,
//   //             email: donor.email,
//   //             bloodType: donor.bloodType,
//   //             phone: donor.phone
//   //           },
//   //         }),
//   //       });

//   //       if (notifyRes.ok) {
//   //         console.log("✅ Receiver notified!");
//   //       } else {
//   //         console.error("Failed to notify receiver");
//   //       }
//   //     }
//   //   }
//   //   catch (error) {
//   //     console.error("Error accepting request:", error);
//   //     alert("Something went wrong");
//   //   }
//   // }
//   async function handleAcceptRequest(receiverEmail: string, bloodType: string, message: string) {
//     try {
//       const res = await fetch("/api/match", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           donorEmail: donor.email,
//           receiverEmail,
//           bloodType,
//           message,
//           accepted_date: today,
//           status: "In process", // Changed from "Accepted" to "In process"
//         }),
//       })

//       const data = await res.json()
//       if (res.ok && data.match && data.match._id) {
//         toast.success("Match successfully recorded!")

//         // Add to upcoming appointments locally
//         const newAppointment = {
//           id: data.match._id || Date.now().toString(),
//           receiverEmail,
//           bloodType,
//           date: today,
//           status: "In process",
//         }

//         setUpcomingAppointments((prevAppointments: any[]) => [...prevAppointments, newAppointment])

//         // Remove from notifications locally
//         setNotifications((prevNotifications: any[]) =>
//           prevNotifications.filter((notif: any) => notif.email !== receiverEmail),
//         )

//         // Now notify the receiver too
//         const notifyRes = await fetch("/api/notifyReceiver", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             receiverEmail: receiverEmail, // notification receiver
//             donorInfo: {
//               firstName: donor.firstName,
//               lastName: donor.lastName,
//               email: donor.email,
//               bloodType: donor.bloodType,
//               phone: donor.phone,
//             },
//           }),
//         })

//         if (notifyRes.ok) {
//           console.log("✅ Receiver notified!")
//         } else {
//           // const errorData = await res.json()
//           console.error("Failed to notify receiver: ",)
//         }
//       }
//     } catch (error) {
//       console.error("Error accepting request:", error)
//       toast.error("Something went wrong")
//     }
//   }

//   async function handleMarkAsDone(appointmentId: string) {
//     try {
//       // Log the appointment ID for debugging
//       console.log("Marking appointment as done, ID:", appointmentId)

//       const token = localStorage.getItem("authToken")
//       if (!token) {
//         toast.error("Authentication required. Please log in again.")
//         return
//       }

//       // Ensure we have a valid ID
//       if (!appointmentId) {
//         toast.error("Invalid appointment ID")
//         return
//       }

//       // Ensure appointmentId is a string
//       const idString = String(appointmentId)

//       // Prepare the request payload
//       const payload = {
//         appointmentId: idString,
//         donorEmail: donor.email,
//         status: "Completed",
//       }

//       console.log("Sending payload:", payload)

//       const res = await fetch("/api/appointments/complete", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       })

//       const data = await res.json()

//       if (res.ok) {
//         toast.success("Appointment marked as completed!")
//         console.log("✅ Appointment completed successfully")

//         // Find the completed appointment
//         const completedAppointment = upcomingAppointments.find((apt) => {
//           const aptId = apt.id?.toString()
//           return aptId === idString
//         })

//         // Update the local state - handle different ID formats
//         setUpcomingAppointments((prevAppointments) =>
//           prevAppointments.map((apt) => {
//             // Check for different ID formats and normalize them
//             const aptId = apt.id?.toString()
//             const targetId = idString

//             return aptId === targetId ? { ...apt, status: "Completed" } : apt
//           }),
//         )

//         // Add the completed appointment to donation history
//         if (completedAppointment) {
//           const today = new Date()
//           const newDonationRecord = {
//             location: "Donor+ Match",
//             date: today.toISOString(),
//             amount: "450ml",
//             certificateId: idString.substring(0, 6).toUpperCase(),
//             receiverEmail: completedAppointment.receiverEmail,
//             bloodType: completedAppointment.bloodType || donor.bloodType,
//           }

//           // Update donor state with new donation history
//           setDonor((prevDonor: { donationHistory: any }) => ({
//             ...prevDonor,
//             donationHistory: [newDonationRecord, ...(prevDonor.donationHistory || [])],
//             lastDonation: today.toISOString(),
//           }))
//         }
//       } else {
//         console.error("Failed to update appointment status:", data)
//         toast.error(data.error || "Failed to update appointment status")
//       }
//     } catch (error: any) {
//       console.error("Error completing appointment:", error)
//       toast.error(error.message || "Something went wrong while completing the appointment")
//     }
//   }

//   async function handleAvailabilityChange(value: boolean) {
//     try {
//       const token = localStorage.getItem("authToken")

//       if (!token) {
//         router.push("/login")
//         return
//       }

//       // Optimistically update UI
//       setDonor((prev: any) => ({ ...prev, available: value }))

//       const response = await fetch("/api/donor-info", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           email: donor?.email,
//           available: value,
//         }),
//       })

//       if (!response.ok) {
//         // Revert the change if the API call fails
//         setDonor((prev: any) => ({ ...prev, available: !value }))
//         const errorData = await response.json()
//         throw new Error(errorData.message || "Failed to update availability")
//       }

//       const message = value
//         ? {
//           title: "You're now available",
//           description: "You'll be notified of donation requests.",
//         }
//         : {
//           title: "You're now unavailable",
//           description: "You won't receive donation requests.",
//         }

//       toast.success(message.description, {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       })
//     } catch (error) {
//       console.error("Error updating availability:", error)
//       toast.error("There was a problem updating your availability.", {
//         position: "top-right",
//         autoClose: 5000,
//         hideProgressBar: true,
//         closeOnClick: true,
//         pauseOnHover: true,
//         draggable: true,
//         progress: undefined,
//       })
//     }
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="flex flex-col items-center space-y-4">
//           <Loader2 className="h-12 w-12 text-red-600 animate-spin" />
//           <p className="text-lg font-medium">Loading your dashboard...</p>
//         </div>
//       </div>
//     )
//   }
//   const displayBloodType = bloodTypeLabels[donor.bloodType] || donor.bloodType

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-50">
//       {/* Header */}
//       <header className="bg-white border-b sticky top-0 z-10">
//         <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//           <h1 className="font-bold text-xl text-red-600">Donor+</h1>
//           <div className="flex items-center space-x-4">
//             <Avatar className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
//               <AvatarFallback className="text-xl text-white bg-mr-3">
//                 {donor?.firstName?.[0]?.toUpperCase() ?? ''}
//                 {donor?.lastName?.[0]?.toUpperCase() ?? ''}
//               </AvatarFallback>
//             </Avatar>
//             <div className="hidden md:block">
//               <p className="text-sm font-medium">
//                 {donor?.firstName} {donor?.lastName}
//               </p>
//               <p className="text-xs text-gray-500">{displayBloodType} Donor</p>
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
//                   <Avatar className="h-20 w-20 rounded-full bg-gray-400 flex items-center justify-center">
//                     <AvatarFallback className="text-xl text-white bg-mr-3">
//                       {donor?.firstName?.[0]?.toUpperCase() ?? ''}
//                       {donor?.lastName?.[0]?.toUpperCase() ?? ''}
//                     </AvatarFallback>
//                   </Avatar>
//                   <h3 className="text-xl font-semibold">
//                     {donor?.firstName} {donor?.lastName}
//                   </h3>
//                   <div className="flex items-center space-x-2 mt-1">
//                     <Badge className="bg-red-600">{displayBloodType}</Badge>
//                     <Badge variant="outline">Donor</Badge>
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {/* Availability Toggle */}
//                   <div className="flex items-center justify-between">
//                     <span className="font-medium">Available to donate</span>
//                     <Switch
//                       checked={donor?.available === 1 || donor?.available === true || donor?.available === "yes"}
//                       onCheckedChange={handleAvailabilityChange}
//                     />
//                   </div>

//                   <div className="flex justify-between">
//                     <span className="font-medium">Age</span>
//                     <span className="text-sm text-gray-500">{donor?.age || "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Weight</span>
//                     <span className="text-sm text-gray-500">{donor?.weight ? `${donor.weight} kg` : "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="font-medium">Last Donation</span>
//                     <span className="text-sm text-gray-500">
//                       {donor?.lastDonation ? new Date(donor.lastDonation).toLocaleDateString() : "N/A"}
//                     </span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Health Information</CardTitle>
//                 <CardDescription>Your health details for donation</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-3">
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Blood Type</span>
//                     <span className="font-medium">{displayBloodType}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Weight</span>
//                     <span className="font-medium">{donor?.weight ? `${donor.weight} kg` : "N/A"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Recent Surgery</span>
//                     <span className="font-medium">{donor?.recentSurgery === "yes" ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Recent Illness</span>
//                     <span className="font-medium">{donor?.recentIllness === "yes" ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Taking Medication</span>
//                     <span className="font-medium">{donor?.onMedication === "yes" ? "Yes" : "No"}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-sm text-gray-500">Chronic Diseases</span>
//                     <span className="font-medium">{donor?.chronicDisease === "yes" ? "Yes" : "No"}</span>
//                   </div>

//                   <Button variant="default" onClick={() => setShowUpdateForm(true)} className="w-full mt-4">
//                     Update Health Info
//                   </Button>

//                   {showUpdateForm && (
//                     <form onSubmit={handleUpdate} className="space-y-4 mt-4">
//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Blood Type</label>
//                         <select name="bloodType" defaultValue={displayBloodType} className="border rounded p-2">
//                           <option value="A+">A+</option>
//                           <option value="A-">A-</option>
//                           <option value="B+">B+</option>
//                           <option value="B-">B-</option>
//                           <option value="AB+">AB+</option>
//                           <option value="AB-">AB-</option>
//                           <option value="O+">O+</option>
//                           <option value="O-">O-</option>
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Age</label>
//                         <input type="number" name="age" defaultValue={donor?.age} className="border rounded p-2" />
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
//                         <select name="recentSurgery" defaultValue={donor?.recentSurgery} className="border rounded p-2">
//                           <option value="yes">Yes</option>
//                           <option value="no">No</option>
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Surgery Details</label>
//                         <textarea
//                           name="surgeryDetails"
//                           defaultValue={donor?.surgeryDetails}
//                           className="border rounded p-2"
//                           rows={2}
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Recent Illness</label>
//                         <select name="recentIllness" defaultValue={donor?.recentIllness} className="border rounded p-2">
//                           <option value="yes">Yes</option>
//                           <option value="no">No</option>
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Illness Details</label>
//                         <textarea
//                           name="illnessDetails"
//                           defaultValue={donor?.illnessDetails}
//                           className="border rounded p-2"
//                           rows={2}
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">On Medication</label>
//                         <select name="onMedication" defaultValue={donor?.onMedication} className="border rounded p-2">
//                           <option value="yes">Yes</option>
//                           <option value="no">No</option>
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Medication Details</label>
//                         <textarea
//                           name="medicationDetails"
//                           defaultValue={donor?.medicationDetails}
//                           className="border rounded p-2"
//                           rows={2}
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Chronic Disease</label>
//                         <select
//                           name="chronicDisease"
//                           defaultValue={donor?.chronicDisease}
//                           className="border rounded p-2"
//                         >
//                           <option value="yes">Yes</option>
//                           <option value="no">No</option>
//                         </select>
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Disease Details</label>
//                         <textarea
//                           name="diseaseDetails"
//                           defaultValue={donor?.diseaseDetails}
//                           className="border rounded p-2"
//                           rows={2}
//                         />
//                       </div>

//                       <div className="flex flex-col">
//                         <label className="text-sm text-gray-500">Last Donation Date</label>
//                         <input
//                           type="date"
//                           name="lastDonation"
//                           defaultValue={donor?.lastDonation?.split("T")[0]}
//                           className="border rounded p-2"
//                         />
//                       </div>

//                       <div className="flex gap-2">
//                         <Button type="submit" variant="default" disabled={isUpdating} className="flex-1">
//                           {isUpdating ? (
//                             <>
//                               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                               Saving...
//                             </>
//                           ) : (
//                             "Save Changes"
//                           )}
//                         </Button>
//                         <Button
//                           type="button"
//                           variant="outline"
//                           onClick={() => setShowUpdateForm(false)}
//                           disabled={isUpdating}
//                           className="flex-1"
//                         >
//                           Cancel
//                         </Button>
//                       </div>
//                     </form>
//                   )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           {/* Main Content */}
//           <div className="lg:col-span-2 space-y-6">
//             {/* Donation History */}
//             {/* Upcoming Appointments */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Upcoming Appointments</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 {upcomingAppointments && upcomingAppointments.filter((apt) => apt.status !== "Completed").length > 0 ? (
//                   <div className="space-y-4">
//                     {upcomingAppointments
//                       .filter((appointment) => appointment.status !== "Completed")
//                       .map((appointment: any, index: number) => (
//                         <div key={index} className="flex items-center justify-between border-b pb-4">
//                           <div>
//                             <h4 className="font-medium">{appointment.receiverEmail}</h4>
//                             <div className="flex items-center text-sm text-gray-500 mt-1">
//                               <Calendar className="h-4 w-4 mr-1" />
//                               {new Date(appointment.dateOfMatch || appointment.date).toLocaleDateString()}
//                             </div>
//                             <Badge variant="default" className="bg-yellow-100 text-yellow-800">
//                               {appointment.status}
//                             </Badge>
//                           </div>
//                           <Button
//                             size="sm"
//                             variant="default"
//                             onClick={() => {
//                               // Get the ID in a consistent way
//                               const id = appointment.id?.toString() || appointment._id?.toString()
//                               if (id) {
//                                 handleMarkAsDone(id)
//                               } else {
//                                 toast.error("Cannot complete appointment: Missing ID")
//                               }
//                             }}
//                           >
//                             Mark as Done
//                           </Button>
//                         </div>
//                       ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-6">
//                     <p className="text-gray-500 mb-4">You have no upcoming donation appointments.</p>
//                     <Button className="bg-red-600 hover:bg-red-700">Schedule Donation</Button>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>            {/* Requests from Recipients */}
//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Requests</CardTitle>
//                 <CardDescription>People who notified you for help</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {notifications?.length > 0 ? (
//                   <div className="space-y-4">
//                     {notifications.map((notif: any, index: number) => (
//                       <div key={index} className="flex items-center justify-between border-b pb-4">
//                         <div className="space-y-1">
//                           {/* Full name */}
//                           <h4 className="font-medium">
//                             {notif.user?.firstName} {notif.user?.lastName}
//                           </h4>

//                           {/* Email */}
//                           <p className="text-sm text-gray-500">{notif.email}</p>

//                           {/* Blood type with badge */}
//                           <Badge variant="outline" className="mt-1">
//                             {bloodTypeLabels[notif.user?.bloodType] || notif.user?.bloodType}
//                           </Badge>

//                           {/* Message */}
//                           <div className="text-sm mt-2">
//                             <strong>Message:</strong> {notif.message || "No message provided"}
//                           </div>

//                           {/* Request Date */}
//                           <p className="text-xs text-gray-400">
//                             Request Date:{" "}
//                             {notif.date
//                               ? new Date(notif.date).toLocaleDateString("en-GB", {
//                                 day: "2-digit",
//                                 month: "short",
//                                 year: "numeric",
//                               })
//                               : "Unknown"}
//                           </p>
//                         </div>

//                         {/* Accept request button */}
//                         <Button
//                           size="sm"
//                           variant="default"
//                           onClick={() =>
//                             handleAcceptRequest(
//                               notif.email,
//                               notif.user?.bloodType,
//                               notif.message || "No message provided",
//                             )
//                           }
//                         >
//                           Accept Request
//                         </Button>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-6">
//                     <p className="text-gray-500">No current requests.</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>


//             <Card>
//               <CardHeader className="pb-2">
//                 <CardTitle>Donation History</CardTitle>
//                 <CardDescription>Your past blood donations</CardDescription>
//               </CardHeader>
//               <CardContent>
//                 {(donor.donationHistory && donor.donationHistory.length > 0) ||
//                   (upcomingAppointments && upcomingAppointments.some((apt) => apt.status === "Completed")) ? (
//                   <div className="space-y-4">
//                     {/* Show donation history */}
//                     {donor.donationHistory &&
//                       donor.donationHistory.map((donation: any, index: number) => (
//                         <div key={`history-${index}`} className="flex items-center justify-between border-b pb-4">
//                           <div>
//                             <h4 className="font-medium">{donation.location || "General Hospital"}</h4>
//                             <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
//                             <Badge variant="outline" className="mt-1">
//                               {displayBloodType} Blood
//                             </Badge>
//                             {donation.receiverEmail && (
//                               <p className="text-xs text-gray-500 mt-1">Recipient: {donation.receiverEmail}</p>
//                             )}
//                           </div>
//                           <div className="text-right">
//                             <p className="text-sm font-medium">{donation.amount || "450ml"}</p>
//                             <p className="text-xs text-gray-500">Certificate #{donation.certificateId || "N/A"}</p>
//                           </div>
//                         </div>
//                       ))}

//                     {/* Show completed appointments that aren't yet in donation history */}
//                     {upcomingAppointments &&
//                       upcomingAppointments
//                         .filter((apt) => apt.status === "Completed")
//                         .filter((apt) => {
//                           // Only show completed appointments that aren't already in donation history
//                           // This prevents duplicates if the page is refreshed
//                           if (!donor.donationHistory) return true
//                           return !donor.donationHistory.some(
//                             (donation: any) =>
//                               donation.certificateId === apt.id?.toString().substring(0, 6).toUpperCase(),
//                           )
//                         })
//                         .map((apt: any, index: number) => (
//                           <div key={`completed-${index}`} className="flex items-center justify-between border-b pb-4">
//                             <div>
//                               <h4 className="font-medium">Donor+ Match</h4>
//                               <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
//                               <Badge variant="outline" className="mt-1">
//                                 {displayBloodType} Blood
//                               </Badge>
//                               <p className="text-xs text-gray-500 mt-1">Recipient: {apt.receiverEmail}</p>
//                             </div>
//                             <div className="text-right">
//                               <p className="text-sm font-medium">450ml</p>
//                               <p className="text-xs text-gray-500">
//                                 Certificate #{apt.id?.toString().substring(0, 6).toUpperCase() || "N/A"}
//                               </p>
//                             </div>
//                           </div>
//                         ))}

//                     <div className="text-center pt-2">
//                       <Button variant="outline">View All History</Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="text-center py-6">
//                     <p className="text-gray-500">No donation history available.</p>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Calendar, Loader2 } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { toast } from "react-toastify"
import type { ObjectId } from "mongodb"
// The CSS import is now in layout.tsx

export default function DashboardPage() {
  const [donor, setDonor] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()
  const bloodTypeLabels: Record<string, string> = {
    a_positive: "A+",
    a_negative: "A-",
    b_positive: "B+",
    b_negative: "B-",
    ab_positive: "AB+",
    ab_negative: "AB-",
    o_positive: "O+",
    o_negative: "O-",
    unknown: "I don't know",
  }
  const today = new Date().toISOString()

  // useEffect(() => {
  //   async function fetchNotifications() {
  //     try {
  //       const res = await fetch(`/api/notifications?email=${donor.email}`);
  //       const data = await res.json();
  //       console.log("Fetched notifications:", data.notifications); // Check data here
  //       setNotifications(data.notifications);
  //     } catch (error) {
  //       console.error("Failed to fetch notifications:", error);
  //     }
  //   }

  //   if (donor?.email) {
  //     fetchNotifications();
  //   }
  // }, [donor?.email]);
  interface Appointment {
    id: ObjectId
    receiverEmail: string
    bloodType: string
    date: string
    status: string
    message: string
  }

  interface Notification {
    email: string
    firstName: string
    lastName: string
    bloodType: string
    message: string
  }

  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch(`/api/notifications?email=${donor.email}`)
        const data = await res.json()
        console.log("Fetched notifications:", data.notifications) // Check data here
        setNotifications(data.notifications)
      } catch (error) {
        console.error("Failed to fetch notifications:",)
      }
    }

    if (donor?.email) {
      fetchNotifications()
    }
  }, [donor?.email])

  useEffect(() => {
    async function fetchUpcomingAppointments() {
      try {
        if (!donor?.email) return

        const res = await fetch(`/api/appointments?email=${donor.email}`)
        const data = await res.json()
        console.log("Fetched appointments:", data.appointments)
        setUpcomingAppointments(data.appointments || [])
      } catch (error) {
        console.error("Failed to fetch appointments:",)
      }
    }

    if (donor?.email) {
      fetchUpcomingAppointments()
    }
  }, [donor?.email])
  // {
  //   notifications.length > 0 ? (
  //     <div className="space-y-4">
  //       {notifications.map((notif: any, index: number) => (
  //         <div key={index} className="flex items-center justify-between border-b pb-4">
  //           <div>
  //             <h4 className="font-medium">{notif.firstName} {notif.lastName}</h4>
  //             <p className="text-sm text-gray-500">{notif.email}</p>
  //             <Badge variant="outline" className="mt-1">{notif.bloodType}</Badge>
  //           </div>
  //           <Button
  //             size="sm"
  //             variant="default"
  //             onClick={() => handleAcceptRequest(notif.email, notif.bloodType)}
  //           >
  //             Accept Request
  //           </Button>
  //         </div>
  //       ))}
  //     </div>
  //   ) : (
  //   <div className="text-center py-6">
  //     <p className="text-gray-500">No current requests.</p>
  //   </div>
  // )
  // }

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
        console.error("Error fetching donor info:",)

        toast.error("Failed to load your profile. Please try again.", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
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
        console.log("Calling toast.success...")
        toast.success("Your health information has been updated.", {
          // position: "top-right",
          // autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        })
        setShowUpdateForm(false)
      } else {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to update")
      }
    } catch (error) {
      console.error("Error updating user",)
      toast.error("There was a problem updating your information.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } finally {
      setIsUpdating(false)
    }
  }
  // async function handleAcceptRequest(receiverEmail: string, bloodType: string, message: string) {
  //   try {
  //     const res = await fetch("/api/match", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({
  //         donorEmail: donor.email,
  //         receiverEmail,
  //         bloodType,
  //         message,
  //         date: today,
  //         status: "Accepted"   //means that its not completed yet

  //       })
  //     });

  //     const data = await res.json();
  //     if (res.ok) {
  //       alert("Match successfully recorded!");

  //       // Now notify the receiver too
  //       const notifyRes = await fetch('/api/notifyReceiver', {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({
  //           receiverEmail: receiverEmail,    // notification receiver
  //           donorInfo: {
  //             firstName: donor.firstName,
  //             lastName: donor.lastName,
  //             email: donor.email,
  //             bloodType: donor.bloodType,
  //             phone: donor.phone
  //           },
  //         }),
  //       });

  //       if (notifyRes.ok) {
  //         console.log("✅ Receiver notified!");
  //       } else {
  //         console.error("Failed to notify receiver");
  //       }
  //     }
  //   }
  //   catch (error) {
  //     console.error("Error accepting request:", error);
  //     alert("Something went wrong");
  //   }
  // }
  async function handleAcceptRequest(receiverEmail: string, bloodType: string, message: string) {
    try {
      const res = await fetch("/api/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          donorEmail: donor.email,
          receiverEmail,
          bloodType,
          message,
          accepted_date: today,
          status: "In process", // Changed from "Accepted" to "In process"
        }),
      })

      const data = await res.json()
      if (res.ok && data.match && data.match._id) {
        toast.success("Match successfully recorded!")

        // Add to upcoming appointments locally
        const newAppointment = {
          id: data.match._id || Date.now().toString(),
          receiverEmail,
          bloodType,
          date: today,
          status: "In process",
        }

        setUpcomingAppointments((prevAppointments: any[]) => [...prevAppointments, newAppointment])

        // Remove from notifications locally
        setNotifications((prevNotifications: any[]) =>
          prevNotifications.filter((notif: any) => notif.email !== receiverEmail),
        )

        // Now notify the receiver too
        const notifyRes = await fetch("/api/notifyReceiver", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            receiverEmail: receiverEmail, // notification receiver
            donorInfo: {
              firstName: donor.firstName,
              lastName: donor.lastName,
              email: donor.email,
              bloodType: donor.bloodType,
              phone: donor.phone,
              date: today
            },
          }),
        })

        if (notifyRes.ok) {
          if ("already" in notifyRes.json()) {
            console.log("Receiver already notified!")
          }
          else {
            console.log("✅ Receiver notified!")
          }
        } else {
          console.error("Failed to notify receiver: ")
        }
      }
    } catch (error) {
      console.error("Error accepting request:",)
      toast.error("Something went wrong")
    }
  }

  // async function handleMarkAsDone(appointmentId: String) {
  //   try {
  //     const token = localStorage.getItem("authToken")
  //     const apt = {
  //       appointmentId: appointmentId,
  //       donorEmail: donor.email,
  //       status: "Completed",
  //     }
  //     const res = await fetch("/api/appointments/complete", {
  //       method: "PATCH",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`
  //       },
  //       body: JSON.stringify(apt),
  //     })
  //     if (res.ok) {
  //       toast.success("Appointment marked as completed!");
  //       console.log("✅ Receiver notified successfully");

  //       // Corrected: Match using _id converted to string
  //       setUpcomingAppointments((prevAppointments: any[]) =>
  //         prevAppointments.map((apt: any) =>
  //           apt._id.toString() === appointmentId
  //             ? { ...apt, status: "Completed" }
  //             : apt
  //         )
  //       );
  //     } else {
  //       const errorData = await res.json();
  //       console.error("Failed to update appointment status:", errorData);
  //     }
  //   } catch (error) {
  //     console.error("Error completing appointment:",);
  //     toast.error("Something went wrong");
  //   }
  // }
  async function handleMarkAsDone(appointmentId: string) {
    try {
      // Log the appointment ID for debugging
      console.log("Marking appointment as done, ID:", appointmentId)

      const token = localStorage.getItem("authToken")
      if (!token) {
        toast.error("Authentication required. Please log in again.")
        return
      }

      // Ensure we have a valid ID
      if (!appointmentId) {
        toast.error("Invalid appointment ID")
        return
      }

      // Ensure appointmentId is a string
      const idString = String(appointmentId)

      // Prepare the request payload
      const payload = {
        appointmentId: idString,
        donorEmail: donor.email,
        status: "Completed",
      }

      console.log("Sending payload:", payload)

      const res = await fetch("/api/appointments/complete", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Appointment marked as completed!")
        console.log("✅ Appointment completed successfully")

        // Find the completed appointment
        const completedAppointment = upcomingAppointments.find((apt) => {
          const aptId = apt.id?.toString()
          return aptId === idString
        })

        // Update the local state - handle different ID formats
        setUpcomingAppointments((prevAppointments) =>
          prevAppointments.map((apt) => {
            // Check for different ID formats and normalize them
            const aptId = apt.id?.toString()
            const targetId = idString

            return aptId === targetId ? { ...apt, status: "Completed" } : apt
          }),
        )

        // Add the completed appointment to donation history
        if (completedAppointment) {
          const today = new Date()
          const newDonationRecord = {
            location: "Donor+ Match",
            date: today.toISOString(),
            amount: "450ml",
            certificateId: idString.substring(0, 6).toUpperCase(),
            receiverEmail: completedAppointment.receiverEmail,
            bloodType: completedAppointment.bloodType || donor.bloodType,
          }

          // Update donor state with new donation history
          setDonor((prevDonor: { donationHistory: any }) => ({
            ...prevDonor,
            donationHistory: [newDonationRecord, ...(prevDonor.donationHistory || [])],
            lastDonation: today.toISOString(),
          }))
        }
      } else {
        console.error("Failed to update appointment status:", data)
        toast.error(data.error || "Failed to update appointment status")
      }
    } catch (error: any) {
      console.error("Error completing appointment:",)
      toast.error(error.message || "Something went wrong while completing the appointment")
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
        }

      toast.success(message.description, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
    } catch (error) {
      console.error("Error updating availability:",)
      toast.error("There was a problem updating your availability.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      })
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
  const displayBloodType = bloodTypeLabels[donor.bloodType] || donor.bloodType

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-xl text-red-600">Donor+</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Avatar className="h-10 w-10 rounded-full bg-gray-400 flex items-center justify-center">
                <AvatarFallback className="text-xl text-white bg-mr-3">
                  {donor?.firstName?.[0]?.toUpperCase() ?? ''}
                  {donor?.lastName?.[0]?.toUpperCase() ?? ''}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block ml-2">
                <p className="text-sm font-medium">
                  {donor?.firstName} {donor?.lastName}
                </p>
                <p className="text-xs text-gray-500">{displayBloodType} Donor</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                localStorage.removeItem("authToken")
                localStorage.removeItem("email")
                toast.success("Logged out successfully")
                router.push("/login")
              }}
              className="text-red-600 hover:text-red-800 hover:bg-red-50"
            >
              Logout
            </Button>
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
                  <Avatar className="h-20 w-20 rounded-full bg-gray-400 flex items-center justify-center">
                    <AvatarFallback className="text-xl text-white bg-mr-3">
                      {donor?.firstName?.[0]?.toUpperCase() ?? ''}
                      {donor?.lastName?.[0]?.toUpperCase() ?? ''}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">
                    {donor?.firstName} {donor?.lastName}
                  </h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-red-600">{displayBloodType}</Badge>
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
                    <span className="font-medium">{displayBloodType}</span>
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
                        <select name="bloodType" defaultValue={displayBloodType} className="border rounded p-2">
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
                {(donor.donationHistory && donor.donationHistory.length > 0) ||
                  (upcomingAppointments && upcomingAppointments.some((apt) => apt.status === "Completed")) ? (
                  <div className="space-y-4">
                    {/* Show donation history */}
                    {donor.donationHistory &&
                      donor.donationHistory.map((donation: any, index: number) => (
                        <div key={`history-${index}`} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h4 className="font-medium">{donation.location || "General Hospital"}</h4>
                            <p className="text-sm text-gray-500">{new Date(donation.date).toLocaleDateString()}</p>
                            <Badge variant="outline" className="mt-1">
                              {displayBloodType} Blood
                            </Badge>
                            {donation.receiverEmail && (
                              <p className="text-xs text-gray-500 mt-1">Recipient: {donation.receiverEmail}</p>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{donation.amount || "450ml"}</p>
                            <p className="text-xs text-gray-500">Certificate #{donation.certificateId || "N/A"}</p>
                          </div>
                        </div>
                      ))}

                    {/* Show completed appointments that aren't yet in donation history */}
                    {upcomingAppointments &&
                      upcomingAppointments
                        .filter((apt) => apt.status === "Completed")
                        .filter((apt) => {
                          // Only show completed appointments that aren't already in donation history
                          // This prevents duplicates if the page is refreshed
                          if (!donor.donationHistory) return true
                          return !donor.donationHistory.some(
                            (donation: any) =>
                              donation.certificateId === apt.id?.toString().substring(0, 6).toUpperCase(),
                          )
                        })
                        .map((apt: any, index: number) => (
                          <div key={`completed-${index}`} className="flex items-center justify-between border-b pb-4">
                            <div>
                              <h4 className="font-medium">Donor+ Match</h4>
                              <p className="text-sm text-gray-500">{new Date().toLocaleDateString()}</p>
                              <Badge variant="outline" className="mt-1">
                                {displayBloodType} Blood
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">Recipient: {apt.receiverEmail}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-medium">450ml</p>
                              <p className="text-xs text-gray-500">
                                Certificate #{apt.id?.toString().substring(0, 6).toUpperCase() || "N/A"}
                              </p>
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
            {/* Requests from Recipients */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Requests</CardTitle>
                <CardDescription>People who notified you for help</CardDescription>
              </CardHeader>
              <CardContent>
                {notifications?.length > 0 ? (
                  <div className="space-y-4">
                    {notifications.map((notif: any, index: number) => (
                      <div key={index} className="flex items-center justify-between border-b pb-4">
                        <div className="space-y-1">
                          {/* Full name */}
                          <h4 className="font-medium">
                            {notif.user?.firstName} {notif.user?.lastName}
                          </h4>

                          {/* Email */}
                          <p className="text-sm text-gray-500">{notif.email}</p>

                          {/* Blood type with badge */}
                          <Badge variant="outline" className="mt-1">
                            {bloodTypeLabels[notif.user?.bloodType] || notif.user?.bloodType}
                          </Badge>

                          {/* Message */}
                          <div className="text-sm mt-2">
                            <strong>Message:</strong> {notif.message || "No message provided"}
                          </div>

                          {/* Request Date */}
                          <p className="text-xs text-gray-400">
                            Request Date:{" "}
                            {notif.date
                              ? new Date(notif.date).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                              : "Unknown"}
                          </p>
                        </div>

                        {/* Accept request button */}
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            handleAcceptRequest(
                              notif.email,
                              notif.user?.bloodType,
                              notif.message || "No message provided",
                            )
                          }
                        >
                          Accept Request
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-gray-500">No current requests.</p>
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
                {upcomingAppointments && upcomingAppointments.filter((apt) => apt.status !== "Completed").length > 0 ? (
                  <div className="space-y-4">
                    {upcomingAppointments
                      .filter((appointment) => appointment.status !== "Completed")
                      .map((appointment: any, index: number) => (
                        <div key={index} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <h4 className="font-medium">{appointment.receiverEmail}</h4>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(appointment.dateOfMatch || appointment.date).toLocaleDateString()}
                            </div>
                            <Badge variant="default" className="bg-yellow-100 text-yellow-800">
                              {appointment.status}
                            </Badge>
                          </div>
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => {
                              // Get the ID in a consistent way
                              const id = appointment.id?.toString() || appointment._id?.toString()
                              if (id) {
                                handleMarkAsDone(id)
                              } else {
                                toast.error("Cannot complete appointment: Missing ID")
                              }
                            }}
                          >
                            Mark as Done
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
