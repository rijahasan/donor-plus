"use client"
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Calendar, Clock } from "lucide-react";

export default function DashboardPage() {
  const [donor, setDonor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const donorData = localStorage.getItem("donor");

    if (donorData) {
      setDonor(JSON.parse(donorData));  // Retrieve donor info from localStorage
      setLoading(false);
    } else {
      router.push("/login"); // If no donor data, redirect to login
    }
  }, [router]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="font-bold text-xl text-red-600">Donor+</h1>
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src="/api/placeholder.svg?height=96&width=96" alt="User" />
              <AvatarFallback className="text-2xl">{donor?.firstName?.[0]}</AvatarFallback>
            </Avatar>
            <div className="hidden md:block">
              <p className="text-sm font-medium">{donor?.firstName} {donor?.lastName}</p>
              <p className="text-xs text-gray-500">{donor?.bloodType} Donor</p>
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
                    <AvatarImage src="/api/placeholder.svg?height=96&width=96" alt="User" />
                    <AvatarFallback className="text-2xl">{donor?.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold">{donor?.firstName} {donor?.lastName}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge className="bg-red-600">{donor?.bloodType}</Badge>
                    <Badge variant="outline">Donor</Badge>
                  </div>
                  {/* <p className="text-sm text-gray-500 mt-2 flex items-center"> */}
                    {/* <MapPin className="h-3 w-3 mr-1" /> {donor?.location || "N/A"} */}
                  {/* </p> */}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Available to donate</span>
                    <span className="text-sm text-gray-500">{donor?.available || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Age</span>
                    <span className="text-sm text-gray-500">{donor?.age || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Weight</span>
                    <span className="text-sm text-gray-500">{donor?.weight || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Last Donation</span>
                    <span className="text-sm text-gray-500">{donor?.lastDonationDate || "N/A"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Health Information */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Health Information</CardTitle>
                <CardDescription>Your health details for donation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Blood Type</span>
                    <span className="font-medium">{donor?.bloodType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Weight</span>
                    <span className="font-medium">{donor?.weight || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Height</span>
                    <span className="font-medium">{donor?.height || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Recent Surgery</span>
                    <span className="font-medium">{donor?.recentSurgery || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Illness Details</span>
                    <span className="font-medium">{donor?.illnessDetails || "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Medication Details</span>
                    <span className="font-medium">{donor?.medicationDetails || "N/A"}</span>
                  </div>
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Update Health Info
                    </Button>
                  </div>
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
                <div className="space-y-4">
                  {/* Donation Record */}
                  <div className="flex items-center justify-between border-b pb-4">
                    <div>
                      <h4 className="font-medium">General Hospital</h4>
                      <p className="text-sm text-gray-500">March 15, 2024</p>
                      <Badge variant="outline" className="mt-1">
                        {donor?.bloodType} Blood
                      </Badge>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">450ml</p>
                      <p className="text-xs text-gray-500">Certificate #12345</p>
                    </div>
                  </div>

                  <div className="text-center pt-2">
                    <Button variant="outline">View All History</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Appointments */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Upcoming Appointments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4">You have no upcoming donation appointments.</p>
                  <Button className="bg-red-600 hover:bg-red-700">Schedule Donation</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
