"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, Loader2, Phone, User, Droplet, LogOut } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import dynamic from "next/dynamic"
import { toast } from "react-toastify"
import { Calendar } from "lucide-react";


const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false })

interface Donor {
  date: string
  firstName: string
  lastName: string
  email: string
  phone: string
  bloodType: string
}

export default function ReceiverPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const receiver_email = searchParams?.get("email") || ""

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [phone, setPhone] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
  const [radius, setRadius] = useState<number>(10)
  const [loading, setLoading] = useState(false)

  const [matchedDonors, setMatchedDonors] = useState<Donor[]>([])
  const [loadingMatched, setLoadingMatched] = useState(true)
  // localStorage.setItem("authToken", loginData.token)
  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("email")
    toast.success("Logged out successfully")
    router.push("/login")
  }

  useEffect(() => {
    const fetchReceiverInfo = async () => {
      if (!receiver_email) return
      try {
        const res = await fetch(`/api/users?email=${encodeURIComponent(receiver_email)}`)
        if (!res.ok) {
          throw new Error("Failed to fetch receiver information")
        }
        const data = await res.json()
        console.log("Receiver info fetched:", data)

        setFirstName(data.firstName || "")
        setLastName(data.lastName || "")
        setPhone(data.phone || "")
        setBloodType(data.bloodType || "")
      } catch (error) {
        console.error("❌ Error fetching receiver info:",)
      }
    }

    fetchReceiverInfo()
  }, [receiver_email])

  useEffect(() => {
    const fetchMatchedDonors = async () => {
      if (!receiver_email) return
      try {
        const res = await fetch(`/api/notifyReceiver?email=${encodeURIComponent(receiver_email)}`)
        if (!res.ok) {
          throw new Error("Failed to fetch matched donors")
        }
        const data = await res.json()
        setMatchedDonors(data.matchedDonors || [])
      } catch (error) {
        console.error("❌ Error fetching matched donors:",)
      } finally {
        setLoadingMatched(false)
      }
    }

    fetchMatchedDonors()
  }, [receiver_email])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!bloodType || !coords) return

    try {
      setLoading(true)
      router.push(
        `/receiver/results?receiver_email=${encodeURIComponent(receiver_email)}&bloodType=${encodeURIComponent(bloodType)}&lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`,
      )
    } catch (error) {
      console.error("❌ Error during search:",)
    } finally {
      setLoading(false)
    }
  }

  const selectedTab = searchParams?.get("tab") || "find-donors"

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with logout button */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-red-600">Donor+ Receiver Portal</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 flex items-center"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue={selectedTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="find-donors">Find Donors</TabsTrigger>
            <TabsTrigger value="matched-donors">Matched Donors</TabsTrigger>
          </TabsList>

          {/* Find Donors Form */}
          <TabsContent value="find-donors">
            <Card className="mb-8 max-w-md mx-auto z-10">
              <CardHeader>
                <CardTitle>Receiver Information</CardTitle>
                <CardDescription>We fetched your information from our system.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSearch} className="space-y-6">
                  {/* First Name */}
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="text-sm font-medium block">
                      First Name
                    </label>
                    <input
                      id="firstName"
                      type="text"
                      value={firstName}
                      disabled
                      className="input bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Last Name */}
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="text-sm font-medium block">
                      Last Name
                    </label>
                    <input
                      id="lastName"
                      type="text"
                      value={lastName}
                      disabled
                      className="input bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium block">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="text"
                      value={phone}
                      disabled
                      className="input bg-gray-100 cursor-not-allowed"
                    />
                  </div>

                  {/* Blood Type */}
                  <div className="space-y-2 relative z-20">
                    <label htmlFor="bloodType" className="text-sm font-medium block">
                      Please select the blood type you need donation for
                    </label>
                    <Select value={bloodType} onValueChange={setBloodType} required>
                      <SelectTrigger id="bloodType">
                        <SelectValue placeholder="Select blood type" />
                      </SelectTrigger>
                      <SelectContent>
                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Location */}
                  <div className="space-y-2 relative z-0">
                    <label htmlFor="location" className="text-sm font-medium block mt-4">
                      Specify Rough Location
                    </label>
                    <div className="map-container relative z-0">
                      <LocationPicker onChange={(coords) => setCoords(coords)} />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">Click on the map to set your location.</p>
                  </div>
                  {/* Radius */}
                  <div className="space-y-2 mt-4">
                    <label htmlFor="radius" className="text-sm font-medium block">
                      Search Radius (in miles)
                    </label>
                    <input
                      type="number"
                      id="radius"
                      value={radius}
                      onChange={(e) => setRadius(Number.parseInt(e.target.value))}
                      className="input"
                      min={1}
                      step={1}
                      required
                    />
                    <p className="text-sm text-muted-foreground mt-2">Set the radius for searching donors.</p>
                  </div>

                  <Button type="submit" className="w-full" disabled={!bloodType || !coords || loading}>
                    <Search className="mr-2 h-4 w-4" />
                    {loading ? "Searching..." : "Find Donors"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Matched Donors Tab */}
          <TabsContent value="matched-donors">
            {loadingMatched ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin w-10 h-10 text-primary" />
              </div>
            ) : matchedDonors.length === 0 ? (
              <div className="text-center text-muted-foreground mt-10">
                <p>No matched donors found yet. Please check back later.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchedDonors.map((donor, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <CardTitle>
                        <User className="inline mr-2" />
                        {donor.firstName} {donor.lastName}
                      </CardTitle>
                      <CardDescription>{donor.email}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4" />
                        <span>{donor.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Droplet className="w-4 h-4" />
                        <span>{donor.bloodType}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{donor?.date ? new Date(donor?.date).toLocaleDateString() : "N/A"}</span>

                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Search, Loader2, Phone, User, Droplet } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import dynamic from "next/dynamic";

// const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false });

// interface Donor {
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   bloodType: string;
// }

// export default function ReceiverPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const receiver_email = searchParams?.get("email") || "";

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [bloodType, setBloodType] = useState("");
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [radius, setRadius] = useState<number>(10);
//   const [loading, setLoading] = useState(false);

//   const [matchedDonors, setMatchedDonors] = useState<Donor[]>([]);
//   const [loadingMatched, setLoadingMatched] = useState(true);

//   useEffect(() => {
//     const fetchReceiverInfo = async () => {
//       if (!receiver_email) return;
//       try {
//         const res = await fetch(`/api/users?email=${encodeURIComponent(receiver_email)}`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch receiver information");
//         }
//         const data = await res.json();
//         console.log("Receiver info fetched:", data);

//         setFirstName(data.firstName || "");
//         setLastName(data.lastName || "");
//         setPhone(data.phone || "");
//         setBloodType(data.bloodType || "");
//       } catch (error) {
//         console.error("❌ Error fetching receiver info:", error);
//       }
//     };

//     fetchReceiverInfo();
//   }, [receiver_email]);

//   useEffect(() => {
//     const fetchMatchedDonors = async () => {
//       if (!receiver_email) return;
//       try {
//         const res = await fetch(`/api/notifyReceiver?email=${encodeURIComponent(receiver_email)}`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch matched donors");
//         }
//         const data = await res.json();
//         setMatchedDonors(data.matchedDonors || []);
//       } catch (error) {
//         console.error("❌ Error fetching matched donors:", error);
//       } finally {
//         setLoadingMatched(false);
//       }
//     };

//     fetchMatchedDonors();
//   }, [receiver_email]);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!bloodType || !coords) return;

//     try {
//       setLoading(true);
//       router.push(`/receiver/results?receiver_email=${encodeURIComponent(receiver_email)}&bloodType=${encodeURIComponent(bloodType)}&lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
//     } catch (error) {
//       console.error("❌ Error during search:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const selectedTab = searchParams?.get("tab") || "find-donors";

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Receiver Portal</h1>

//       <Tabs defaultValue={selectedTab} className="w-full">
//         <TabsList className="grid w-full grid-cols-2 mb-6">
//           <TabsTrigger value="find-donors">Find Donors</TabsTrigger>
//           <TabsTrigger value="matched-donors">Matched Donors</TabsTrigger>
//         </TabsList>

//         {/* Find Donors Form */}
//         <TabsContent value="find-donors">
//           <Card className="mb-8 max-w-md mx-auto z-10">
//             <CardHeader>
//               <CardTitle>Receiver Information</CardTitle>
//               <CardDescription>We fetched your information from our system.</CardDescription>
//             </CardHeader>
//             <CardContent>
//               <form onSubmit={handleSearch} className="space-y-6">
//                 {/* First Name */}
//                 <div className="space-y-2">
//                   <label htmlFor="firstName" className="text-sm font-medium block">
//                     First Name
//                   </label>
//                   <input
//                     id="firstName"
//                     type="text"
//                     value={firstName}
//                     disabled
//                     className="input bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Last Name */}
//                 <div className="space-y-2">
//                   <label htmlFor="lastName" className="text-sm font-medium block">
//                     Last Name
//                   </label>
//                   <input
//                     id="lastName"
//                     type="text"
//                     value={lastName}
//                     disabled
//                     className="input bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Phone */}
//                 <div className="space-y-2">
//                   <label htmlFor="phone" className="text-sm font-medium block">
//                     Phone Number
//                   </label>
//                   <input
//                     id="phone"
//                     type="text"
//                     value={phone}
//                     disabled
//                     className="input bg-gray-100 cursor-not-allowed"
//                   />
//                 </div>

//                 {/* Blood Type */}
//                 <div className="space-y-2 relative z-20">
//                   <label htmlFor="bloodType" className="text-sm font-medium block">
//                     Please select the blood type you need donation for
//                   </label>
//                   <Select value={bloodType} onValueChange={setBloodType} required>
//                     <SelectTrigger id="bloodType">
//                       <SelectValue placeholder="Select blood type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((type) => (
//                         <SelectItem key={type} value={type}>
//                           {type}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                 </div>

//                 {/* Location */}
//                 <div className="space-y-2 relative z-0">
//                   <label htmlFor="location" className="text-sm font-medium block mt-4">
//                     Specify Rough Location
//                   </label>
//                   <div className="map-container relative z-0">
//                     <LocationPicker onChange={(coords) => setCoords(coords)} />
//                   </div>
//                   <p className="text-sm text-muted-foreground mt-2">Click on the map to set your location.</p>
//                 </div>
//                 {/* Radius */}
//                 <div className="space-y-2 mt-4">
//                   <label htmlFor="radius" className="text-sm font-medium block">
//                     Search Radius (in miles)
//                   </label>
//                   <input
//                     type="number"
//                     id="radius"
//                     value={radius}
//                     onChange={(e) => setRadius(parseInt(e.target.value))}
//                     className="input"
//                     min={1}
//                     step={1}
//                     required
//                   />
//                   <p className="text-sm text-muted-foreground mt-2">Set the radius for searching donors.</p>
//                 </div>

//                 <Button type="submit" className="w-full" disabled={!bloodType || !coords || loading}>
//                   <Search className="mr-2 h-4 w-4" />
//                   {loading ? "Searching..." : "Find Donors"}
//                 </Button>
//               </form>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         {/* Matched Donors Tab */}
//         <TabsContent value="matched-donors">
//           {loadingMatched ? (
//             <div className="flex justify-center items-center h-64">
//               <Loader2 className="animate-spin w-10 h-10 text-primary" />
//             </div>
//           ) : matchedDonors.length === 0 ? (
//             <div className="text-center text-muted-foreground mt-10">
//               <p>No matched donors found yet. Please check back later.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {matchedDonors.map((donor, index) => (
//                 <Card key={index} className="hover:shadow-lg transition-shadow">
//                   <CardHeader>
//                     <CardTitle>
//                       <User className="inline mr-2" />
//                       {donor.firstName} {donor.lastName}
//                     </CardTitle>
//                     <CardDescription>{donor.email}</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="flex items-center space-x-2">
//                       <Phone className="w-4 h-4" />
//                       <span>{donor.phone}</span>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Droplet className="w-4 h-4" />
//                       <span>{donor.bloodType}</span>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </TabsContent>
//       </Tabs>
//     </div>
//   );
// }


// "use client";

// import type React from "react";
// import { useState, useEffect } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Search } from "lucide-react";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import dynamic from "next/dynamic";

// const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false });

// export default function ReceiverPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const receiver_email = searchParams?.get("email") || "";

//   const [firstName, setFirstName] = useState("");
//   const [lastName, setLastName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [bloodType, setBloodType] = useState("");
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
//   const [radius, setRadius] = useState<number>(10);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const fetchReceiverInfo = async () => {
//       if (!receiver_email) return;
//       try {
//         const res = await fetch(`/api/users?email=${encodeURIComponent(receiver_email)}`);
//         if (!res.ok) {
//           throw new Error("Failed to fetch receiver information");
//         }
//         const data = await res.json();
//         console.log("Receiver info fetched:", data);

//         setFirstName(data.firstName || "");
//         setLastName(data.lastName || "");
//         setPhone(data.phone || "");
//         setBloodType(data.bloodType || "");
//       } catch (error) {
//         console.error("❌ Error fetching receiver info:", error);
//       }
//     };

//     fetchReceiverInfo();
//   }, [receiver_email]);

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!bloodType || !coords) return;

//     try {
//       setLoading(true);

//       router.push(`/receiver/results?receiver_email=${encodeURIComponent(receiver_email)}&bloodType=${encodeURIComponent(bloodType)}&lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`);
//     } catch (error) {
//       console.error("❌ Error during search:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 relative z-0">
//       <h1 className="text-3xl font-bold mb-6">Find Blood Donors</h1>

//       <Card className="mb-8 max-w-md mx-auto z-10">
//         <CardHeader>
//           <CardTitle>Receiver Information</CardTitle>
//           <CardDescription>We fetched your information from our system.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSearch} className="space-y-6">
//             {/* First Name */}
//             <div className="space-y-2">
//               <label htmlFor="firstName" className="text-sm font-medium block">
//                 First Name
//               </label>
//               <input
//                 id="firstName"
//                 type="text"
//                 value={firstName}
//                 disabled
//                 className="input bg-gray-100 cursor-not-allowed"
//               />
//             </div>

//             {/* Last Name */}
//             <div className="space-y-2">
//               <label htmlFor="lastName" className="text-sm font-medium block">
//                 Last Name
//               </label>
//               <input
//                 id="lastName"
//                 type="text"
//                 value={lastName}
//                 disabled
//                 className="input bg-gray-100 cursor-not-allowed"
//               />
//             </div>

//             {/* Phone */}
//             <div className="space-y-2">
//               <label htmlFor="phone" className="text-sm font-medium block">
//                 Phone Number
//               </label>
//               <input
//                 id="phone"
//                 type="text"
//                 value={phone}
//                 disabled
//                 className="input bg-gray-100 cursor-not-allowed"
//               />
//             </div>

//             {/* Blood Type */}
//             <div className="space-y-2">
//               <label htmlFor="bloodType" className="text-sm font-medium block">
//                 Your Blood Type
//               </label>
//               <Select value={bloodType} onValueChange={setBloodType} required>
//                 <SelectTrigger id="bloodType">
//                   <SelectValue placeholder="Select blood type" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="A+">A+</SelectItem>
//                   <SelectItem value="A-">A-</SelectItem>
//                   <SelectItem value="B+">B+</SelectItem>
//                   <SelectItem value="B-">B-</SelectItem>
//                   <SelectItem value="AB+">AB+</SelectItem>
//                   <SelectItem value="AB-">AB-</SelectItem>
//                   <SelectItem value="O+">O+</SelectItem>
//                   <SelectItem value="O-">O-</SelectItem>
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Location */}
//             <div className="space-y-2">
//               <label htmlFor="location" className="text-sm font-medium block mt-4">
//                 Your Location
//               </label>
//               <div className="map-container z-0">
//                 <LocationPicker onChange={(coords) => setCoords(coords)} />
//               </div>
//               <p className="text-sm text-muted-foreground mt-2">Click on the map to set your location.</p>
//             </div>

//             {/* Radius */}
//             <div className="space-y-2 mt-4">
//               <label htmlFor="radius" className="text-sm font-medium block">
//                 Search Radius (in miles)
//               </label>
//               <input
//                 type="number"
//                 id="radius"
//                 value={radius}
//                 onChange={(e) => setRadius(parseInt(e.target.value))}
//                 className="input"
//                 min={1}
//                 step={1}
//                 required
//               />
//               <p className="text-sm text-muted-foreground mt-2">Set the radius for searching donors.</p>
//             </div>

//             <Button type="submit" className="w-full" disabled={!bloodType || !coords || loading}>
//               <Search className="mr-2 h-4 w-4" />
//               {loading ? "Searching..." : "Find Donors"}
//             </Button>
//           </form>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }






// "use client"

// import type React from "react"
// import { useEffect, useState } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Search, Droplet } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import dynamic from "next/dynamic"

// const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false })


// export default function ReceiverPage() {
//   const router = useRouter()
//   const [bloodType, setBloodType] = useState("")
//   const [location, setLocation] = useState("")
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
//   const [radius, setRadius] = useState<number>(10) // Default radius is 10 miles
//   const searchParams = useSearchParams()
//   const receiver_email = searchParams?.get("email") || ""
//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!bloodType || !coords) return

//     router.push(`/receiver/results?receiver_email=${encodeURIComponent(receiver_email)}&bloodType=${encodeURIComponent(bloodType)}&lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`)
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 relative z-0">
//       <h1 className="text-3xl font-bold mb-6">Find Blood Donors</h1>

//       <Card className="mb-8 max-w-md mx-auto z-10">
//         <CardHeader>
//           <CardTitle>Search for Blood Donors</CardTitle>
//           <CardDescription>Find donors based on blood type compatibility</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSearch} className="space-y-6">
//             <div className="space-y-2">
//               <label htmlFor="bloodType" className="text-sm font-medium block">
//                 Your Blood Type
//               </label>
//               <div className="relative z-20">
//                 <Select value={bloodType} onValueChange={setBloodType} required>
//                   <SelectTrigger id="bloodType">
//                     <SelectValue placeholder="Select blood type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="A+">A+</SelectItem>
//                     <SelectItem value="A-">A-</SelectItem>
//                     <SelectItem value="B+">B+</SelectItem>
//                     <SelectItem value="B-">B-</SelectItem>
//                     <SelectItem value="AB+">AB+</SelectItem>
//                     <SelectItem value="AB-">AB-</SelectItem>
//                     <SelectItem value="O+">O+</SelectItem>
//                     <SelectItem value="O-">O-</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <label htmlFor="location" className="text-sm font-medium block mt-4">
//                 Your Location
//               </label>

//               <div className="map-container z-0">
//                 <LocationPicker onChange={(coords) => {
//                   console.log('Selected coordinates:', coords); // Log the coordinates
//                   setCoords(coords);
//                 }} />
//               </div>

//               <p className="text-sm text-muted-foreground mt-2">
//                 Click on the map to set your location. We'll use it to find nearby donors.
//               </p>

//               <p className="text-sm text-muted-foreground mt-2">We'll find donors who can donate to your blood type</p>
//             </div>
//             <div className="space-y-2 mt-4">
//               <label htmlFor="radius" className="text-sm font-medium block">
//                 Search Radius (in miles)
//               </label>
//               <input
//                 type="number"
//                 id="radius"
//                 value={radius}
//                 onChange={(e) => setRadius(parseInt(e.target.value))}
//                 className="input"
//                 min={1}
//                 step={1}
//                 required
//               />
//               <p className="text-sm text-muted-foreground mt-2">Set the radius for searching donors.</p>
//             </div>

//             <Button type="submit" className="w-full" disabled={!bloodType || !coords}>
//               <Search className="mr-2 h-4 w-4" />
//               Find Donors
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Add any additional content here */}
//     </div>
//   )
// }

// import type React from "react"
// import { useState } from "react"
// import { useRouter } from "next/navigation"
// import { Search } from "lucide-react"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import dynamic from "next/dynamic"

// const LocationPicker = dynamic(() => import("@/components/ui/LocationPicker"), { ssr: false })

// export default function ReceiverPage() {
//   const router = useRouter()
//   const [bloodType, setBloodType] = useState("")
//   const [location, setLocation] = useState("")
//   const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)
//   const [radius, setRadius] = useState<number>(10) // Default radius is 10 miles

//   const handleSearch = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!bloodType || !coords) return

//     // Push the search query to the results page with blood type, coordinates and radius
//     router.push(`/receiver/results?bloodType=${encodeURIComponent(bloodType)}&lat=${coords.lat}&lng=${coords.lng}&radius=${radius}`)
//   }

//   return (
//     <div className="container mx-auto px-4 py-8 relative z-0">
//       <h1 className="text-3xl font-bold mb-6">Find Blood Donors</h1>

//       <Card className="mb-8 max-w-md mx-auto z-10">
//         <CardHeader>
//           <CardTitle>Search for Blood Donors</CardTitle>
//           <CardDescription>Find donors based on blood type compatibility</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <form onSubmit={handleSearch} className="space-y-6">
//             <div className="space-y-2">
//               <label htmlFor="bloodType" className="text-sm font-medium block">
//                 Your Blood Type
//               </label>
//               <div className="relative z-20">
//                 <Select value={bloodType} onValueChange={setBloodType} required>
//                   <SelectTrigger id="bloodType">
//                     <SelectValue placeholder="Select blood type" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="A+">A+</SelectItem>
//                     <SelectItem value="A-">A-</SelectItem>
//                     <SelectItem value="B+">B+</SelectItem>
//                     <SelectItem value="B-">B-</SelectItem>
//                     <SelectItem value="AB+">AB+</SelectItem>
//                     <SelectItem value="AB-">AB-</SelectItem>
//                     <SelectItem value="O+">O+</SelectItem>
//                     <SelectItem value="O-">O-</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <label htmlFor="location" className="text-sm font-medium block mt-4">
//                 Your Location
//               </label>

//               <div className="map-container z-0">
//                 <LocationPicker onChange={(coords) => {
//                   console.log('Selected coordinates:', coords); // Log the coordinates
//                   setCoords(coords);
//                 }} />
//               </div>

//               <p className="text-sm text-muted-foreground mt-2">
//                 Click on the map to set your location. We'll use it to find nearby donors.
//               </p>

//               <p className="text-sm text-muted-foreground mt-2">We'll find donors who can donate to your blood type</p>
//             </div>

//             <div className="space-y-2 mt-4">
//               <label htmlFor="radius" className="text-sm font-medium block">
//                 Search Radius (in miles)
//               </label>
//               <input
//                 type="number"
//                 id="radius"
//                 value={radius}
//                 onChange={(e) => setRadius(parseInt(e.target.value))}
//                 className="input"
//                 min={1}
//                 step={1}
//                 required
//               />
//               <p className="text-sm text-muted-foreground mt-2">Set the radius for searching donors.</p>
//             </div>

//             <Button type="submit" className="w-full" disabled={!bloodType || !coords}>
//               <Search className="mr-2 h-4 w-4" />
//               Find Donors
//             </Button>
//           </form>
//         </CardContent>
//       </Card>

//       {/* Add any additional content here */}
//     </div>
//   )
// }


