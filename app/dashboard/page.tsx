"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Droplet, Bell, MapPin, Calendar, Clock, MessageSquare, Search, Filter } from "lucide-react"

export default function DashboardPage() {
  const [isAvailable, setIsAvailable] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Droplet className="h-6 w-6 text-red-600" />
            <span className="font-bold text-xl">Donor+</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Avatar>
                <AvatarImage src="/api/placeholder.svg?height=32&width=32" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="hidden md:block">
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-gray-500">O+ Donor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 bg-gray-50 p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                      <AvatarFallback className="text-2xl">JD</AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold">John Doe</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge className="bg-red-600">O+</Badge>
                      <Badge variant="outline">Donor</Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-2 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> San Francisco, CA
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="font-medium">Available to donate</span>
                        <span className="text-sm text-gray-500">Let others know you can donate</span>
                      </div>
                      <Switch checked={isAvailable} onCheckedChange={setIsAvailable} />
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Quick Stats</h4>
                      <div className="grid grid-cols-2 gap-2 text-center">
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-2xl font-bold text-red-600">5</p>
                          <p className="text-xs text-gray-500">Donations</p>
                        </div>
                        <div className="bg-gray-50 p-2 rounded">
                          <p className="text-2xl font-bold text-red-600">3</p>
                          <p className="text-xs text-gray-500">Lives Saved</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">Last Donation</h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>March 15, 2024</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>45 days ago</span>
                      </div>
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
                      <span className="font-medium">O+</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Weight</span>
                      <span className="font-medium">75 kg</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Height</span>
                      <span className="font-medium">180 cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Last Checkup</span>
                      <span className="font-medium">Jan 10, 2024</span>
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
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>Nearby Requests</CardTitle>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Search className="h-4 w-4 mr-2" />
                        Search
                      </Button>
                    </div>
                  </div>
                  <CardDescription>People who need your blood type</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="nearby">
                    <TabsList className="mb-4">
                      <TabsTrigger value="nearby">Nearby</TabsTrigger>
                      <TabsTrigger value="urgent">Urgent</TabsTrigger>
                      <TabsTrigger value="all">All Requests</TabsTrigger>
                    </TabsList>

                    <TabsContent value="nearby" className="space-y-4">
                      {/* Request Card 1 */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Badge className="bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold">
                                O+
                              </Badge>
                              <div>
                                <h4 className="font-semibold">General Hospital</h4>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" /> 2.5 miles away
                                </p>
                                <div className="flex items-center mt-2">
                                  <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                    Urgent
                                  </Badge>
                                  <span className="text-xs text-gray-500 ml-2">Posted 2 hours ago</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Respond
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Request Card 2 */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Badge className="bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold">
                                O-
                              </Badge>
                              <div>
                                <h4 className="font-semibold">City Medical Center</h4>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" /> 4.1 miles away
                                </p>
                                <div className="flex items-center mt-2">
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Standard
                                  </Badge>
                                  <span className="text-xs text-gray-500 ml-2">Posted 5 hours ago</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Respond
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Request Card 3 */}
                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-4">
                              <Badge className="bg-red-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-bold">
                                O+
                              </Badge>
                              <div>
                                <h4 className="font-semibold">Memorial Hospital</h4>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                  <MapPin className="h-3 w-3 mr-1" /> 5.7 miles away
                                </p>
                                <div className="flex items-center mt-2">
                                  <Badge variant="outline" className="text-green-600 border-green-600">
                                    Standard
                                  </Badge>
                                  <span className="text-xs text-gray-500 ml-2">Posted 8 hours ago</span>
                                </div>
                              </div>
                            </div>
                            <Button size="sm" className="bg-red-600 hover:bg-red-700">
                              Respond
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="text-center pt-2">
                        <Button variant="outline">View More</Button>
                      </div>
                    </TabsContent>

                    <TabsContent value="urgent">
                      <div className="text-center py-8 text-gray-500">
                        <p>No urgent requests matching your blood type at the moment.</p>
                      </div>
                    </TabsContent>

                    <TabsContent value="all">
                      <div className="text-center py-8 text-gray-500">
                        <p>Loading all blood requests...</p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Donation History</CardTitle>
                  <CardDescription>Your past blood donations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Donation Record 1 */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">General Hospital</h4>
                        <p className="text-sm text-gray-500">March 15, 2024</p>
                        <Badge variant="outline" className="mt-1">
                          O+ Blood
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">450ml</p>
                        <p className="text-xs text-gray-500">Certificate #12345</p>
                      </div>
                    </div>

                    {/* Donation Record 2 */}
                    <div className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h4 className="font-medium">City Medical Center</h4>
                        <p className="text-sm text-gray-500">January 10, 2024</p>
                        <Badge variant="outline" className="mt-1">
                          O+ Blood
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">450ml</p>
                        <p className="text-xs text-gray-500">Certificate #12089</p>
                      </div>
                    </div>

                    {/* Donation Record 3 */}
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Memorial Hospital</h4>
                        <p className="text-sm text-gray-500">October 5, 2023</p>
                        <Badge variant="outline" className="mt-1">
                          O+ Blood
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">450ml</p>
                        <p className="text-xs text-gray-500">Certificate #11756</p>
                      </div>
                    </div>

                    <div className="text-center pt-2">
                      <Button variant="outline">View All History</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

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
        </div>
      </main>
    </div>
  )
}

