"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, Search, MapPin, Filter, ChevronLeft } from "lucide-react"

export default function MapPage() {
    const [selectedLocation, setSelectedLocation] = useState<string | null>(null)

    return (
        <div className="min-h-screen flex flex-col">
            <header className="bg-white border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <Droplet className="h-6 w-6 text-red-600" />
                        <span className="font-bold text-xl">Donor+</span>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="ghost" size="sm">
                            <ChevronLeft className="h-4 w-4 mr-1" />
                            Back to Dashboard
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-3 h-full">
                    {/* Sidebar */}
                    <div className="p-4 bg-white border-r">
                        <div className="mb-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                                <Input placeholder="Search locations..." className="pl-8" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-medium">Blood Donation Centers</h3>
                            <Button variant="outline" size="sm">
                                <Filter className="h-3 w-3 mr-1" />
                                Filter
                            </Button>
                        </div>

                        <Tabs defaultValue="centers">
                            <TabsList className="w-full mb-4">
                                <TabsTrigger value="centers" className="flex-1">
                                    Centers
                                </TabsTrigger>
                                <TabsTrigger value="donors" className="flex-1">
                                    Donors
                                </TabsTrigger>
                                <TabsTrigger value="requests" className="flex-1">
                                    Requests
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="centers" className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto">
                                {/* Center 1 */}
                                <Card
                                    className={`cursor-pointer ${selectedLocation === "center1" ? "border-red-600" : ""}`}
                                    onClick={() => setSelectedLocation("center1")}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">General Hospital Blood Bank</h4>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> 2.5 miles away
                                                </p>
                                                <div className="flex gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Open Now
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        All Blood Types
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Center 2 */}
                                <Card
                                    className={`cursor-pointer ${selectedLocation === "center2" ? "border-red-600" : ""}`}
                                    onClick={() => setSelectedLocation("center2")}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">City Medical Center</h4>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> 4.1 miles away
                                                </p>
                                                <div className="flex gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Open Now
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        O+, A+, B+ Needed
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Center 3 */}
                                <Card
                                    className={`cursor-pointer ${selectedLocation === "center3" ? "border-red-600" : ""}`}
                                    onClick={() => setSelectedLocation("center3")}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">Memorial Hospital</h4>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> 5.7 miles away
                                                </p>
                                                <div className="flex gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Closes 6PM
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        Urgent: O-
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Center 4 */}
                                <Card
                                    className={`cursor-pointer ${selectedLocation === "center4" ? "border-red-600" : ""}`}
                                    onClick={() => setSelectedLocation("center4")}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">Community Blood Center</h4>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> 6.3 miles away
                                                </p>
                                                <div className="flex gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Open Now
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        All Types Welcome
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Center 5 */}
                                <Card
                                    className={`cursor-pointer ${selectedLocation === "center5" ? "border-red-600" : ""}`}
                                    onClick={() => setSelectedLocation("center5")}
                                >
                                    <CardContent className="p-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium">Regional Medical Center</h4>
                                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                                    <MapPin className="h-3 w-3 mr-1" /> 8.2 miles away
                                                </p>
                                                <div className="flex gap-1 mt-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        Closes 8PM
                                                    </Badge>
                                                    <Badge variant="outline" className="text-xs">
                                                        AB+, AB- Needed
                                                    </Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>

                            <TabsContent value="donors">
                                <div className="text-center py-8 text-gray-500">
                                    <p>No donors currently available in your area.</p>
                                    <Button variant="outline" className="mt-2">
                                        Refresh
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="requests">
                                <div className="text-center py-8 text-gray-500">
                                    <p>No active blood requests in your area.</p>
                                    <Button variant="outline" className="mt-2">
                                        Refresh
                                    </Button>
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>

                    {/* Map Area */}
                    <div className="col-span-2 bg-gray-200 relative">
                        {/* This would be replaced with an actual map integration */}
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center p-6 bg-white rounded-lg shadow-md">
                                <MapPin className="h-12 w-12 text-red-600 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">Map Integration</h3>
                                <p className="text-gray-600 mb-4">
                                    This area would integrate with Google Maps API to show nearby donation centers, available donors, and
                                    blood requests.
                                </p>
                                <p className="text-sm text-gray-500">
                                    The map would display pins for each location with color coding for different types.
                                </p>
                            </div>
                        </div>

                        {/* Location Detail Popup (shows when a location is selected) */}
                        {selectedLocation && (
                            <div className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-lg shadow-lg">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg">General Hospital Blood Bank</h3>
                                        <p className="text-sm text-gray-500 flex items-center mt-1">
                                            <MapPin className="h-3 w-3 mr-1" /> 123 Medical Center Dr, San Francisco, CA
                                        </p>
                                        <div className="flex gap-2 mt-2">
                                            <Badge variant="outline">Open: 8AM-6PM</Badge>
                                            <Badge variant="outline" className="text-green-600 border-green-600">
                                                Accepting All Types
                                            </Badge>
                                        </div>
                                        <p className="text-sm mt-2">Currently needs: O+, AB-, B+</p>
                                    </div>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={() => setSelectedLocation(null)}>
                                        Schedule Donation
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

