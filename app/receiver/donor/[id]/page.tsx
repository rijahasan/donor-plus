"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Droplet, MapPin, Phone, Mail, MessageSquare } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useState } from "react"

// Helper function to determine blood type compatibility
const getCompatibleBloodTypes = (receiverBloodType: string): string[] => {
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

export default function DonorProfilePage({ params }: { params: { id: string } }) {
    const router = useRouter()
    const [message, setMessage] = useState("")
    const donorId = Number.parseInt(params.id)

    // Mock donor data - in a real app, this would be fetched from an API
    const donor = {
        id: donorId,
        name: "John Doe",
        avatar: "JD",
        bloodType: "O-",
        location: "New York",
        distance: "2.5 miles",
        available: true,
        phone: "+1 (555) 123-4567",
        email: "john.doe@example.com",
        donationHistory: [
            { date: "January 15, 2023", location: "New York Blood Center" },
            { date: "October 3, 2022", location: "Red Cross Blood Drive" },
            { date: "May 22, 2022", location: "Memorial Hospital" },
        ],
    }

    const handleSendMessage = () => {
        if (!message.trim()) return

        // In a real app, this would send the message to the backend
        console.log("Sending message to donor:", donorId, message)
        alert("Message sent successfully!")
        setMessage("")
    }

    const handleGoBack = () => {
        router.back()
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
    const canDonateTo = []
    if (donor.bloodType === "O-") {
        canDonateTo.push("A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-")
    } else if (donor.bloodType === "O+") {
        canDonateTo.push("A+", "B+", "AB+", "O+")
    } else if (donor.bloodType === "A-") {
        canDonateTo.push("A+", "A-", "AB+", "AB-")
    } else if (donor.bloodType === "A+") {
        canDonateTo.push("A+", "AB+")
    } else if (donor.bloodType === "B-") {
        canDonateTo.push("B+", "B-", "AB+", "AB-")
    } else if (donor.bloodType === "B+") {
        canDonateTo.push("B+", "AB+")
    } else if (donor.bloodType === "AB-") {
        canDonateTo.push("AB+", "AB-")
    } else if (donor.bloodType === "AB+") {
        canDonateTo.push("AB+")
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
                                <Avatar className="h-16 w-16">
                                    <AvatarFallback className="text-lg">{donor.avatar}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-2xl">{donor.name}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                        <MapPin className="h-4 w-4 mr-1" />
                                        {donor.location} • {donor.distance}
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

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Contact Information</h3>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{donor.phone}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                                        <span>{donor.email}</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-3">Donation History</h3>
                                <div className="space-y-2">
                                    {donor.donationHistory.map((donation, index) => (
                                        <div key={index} className="p-3 border rounded-md">
                                            <p className="font-medium">{donation.date}</p>
                                            <p className="text-sm text-muted-foreground">{donation.location}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Blood Type Compatibility</CardTitle>
                            <CardDescription>This donor can donate to:</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {canDonateTo.map((type) => (
                                    <Badge key={type} variant="outline" className="text-sm">
                                        <Droplet className="h-3 w-3 mr-1 text-red-500" />
                                        {type}
                                    </Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Send Message</CardTitle>
                            <CardDescription>Contact this donor directly</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Textarea
                                placeholder="Type your message here..."
                                className="min-h-[120px]"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" onClick={handleSendMessage} disabled={!donor.available}>
                                <MessageSquare className="mr-2 h-4 w-4" />
                                Send Message
                            </Button>
                            {!donor.available && <p className="text-sm text-red-500 mt-2">This donor is currently unavailable</p>}
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </div>
    )
}
