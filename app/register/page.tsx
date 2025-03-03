"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, ArrowLeft } from "lucide-react"

export default function RegisterPage() {
    const searchParams = useSearchParams()
    const defaultType = searchParams.get("type") || "donor"
    const [userType, setUserType] = useState(defaultType)

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b py-3 px-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <ArrowLeft className="h-5 w-5" />
                        <span className="text-sm">Back to Home</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <div className="flex justify-center mb-4">
                            <Droplet className="h-10 w-10 text-red-600" />
                        </div>
                        <CardTitle className="text-2xl">Create an Account</CardTitle>
                        <CardDescription>Join Donor+ to start saving lives</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue={userType} onValueChange={setUserType} className="mb-6">
                            <TabsList className="grid grid-cols-2 mb-4">
                                <TabsTrigger value="donor">I want to donate</TabsTrigger>
                                <TabsTrigger value="receiver">I need blood</TabsTrigger>
                            </TabsList>

                            <form>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input id="firstName" placeholder="John" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input id="lastName" placeholder="Doe" required />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="john.doe@example.com" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="bloodType">Blood Type</Label>
                                        <Select>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select blood type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="a_positive">A+</SelectItem>
                                                <SelectItem value="a_negative">A-</SelectItem>
                                                <SelectItem value="b_positive">B+</SelectItem>
                                                <SelectItem value="b_negative">B-</SelectItem>
                                                <SelectItem value="ab_positive">AB+</SelectItem>
                                                <SelectItem value="ab_negative">AB-</SelectItem>
                                                <SelectItem value="o_positive">O+</SelectItem>
                                                <SelectItem value="o_negative">O-</SelectItem>
                                                <SelectItem value="unknown">I don't know</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    {userType === "donor" && (
                                        <div className="space-y-2">
                                            <Label>Are you available to donate now?</Label>
                                            <RadioGroup defaultValue="no" className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="yes" id="available-yes" />
                                                    <Label htmlFor="available-yes">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="no" id="available-no" />
                                                    <Label htmlFor="available-no">No</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}

                                    {userType === "receiver" && (
                                        <div className="space-y-2">
                                            <Label>Urgency Level</Label>
                                            <RadioGroup defaultValue="normal" className="flex gap-4">
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="urgent" id="urgency-urgent" />
                                                    <Label htmlFor="urgency-urgent">Urgent</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="normal" id="urgency-normal" />
                                                    <Label htmlFor="urgency-normal">Normal</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}
                                </div>
                            </form>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-red-600 hover:bg-red-700">Create Account</Button>
                    </CardFooter>
                    <div className="text-center pb-6">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link href="/login" className="text-red-600 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </Card>
            </main>
        </div>
    )
}

