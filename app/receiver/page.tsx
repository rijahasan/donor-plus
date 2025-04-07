"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Droplet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function ReceiverPage() {
    const router = useRouter()
    const [bloodType, setBloodType] = useState("")

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (!bloodType) return

        // Navigate to results page with blood type parameter
        router.push(`/receiver/results?bloodType=${encodeURIComponent(bloodType)}`)
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Find Blood Donors</h1>

            <Card className="mb-8 max-w-md mx-auto">
                <CardHeader>
                    <CardTitle>Search for Blood Donors</CardTitle>
                    <CardDescription>Find donors based on blood type compatibility</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSearch} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="bloodType" className="text-sm font-medium block">
                                Your Blood Type
                            </label>
                            <Select value={bloodType} onValueChange={setBloodType} required>
                                <SelectTrigger id="bloodType">
                                    <SelectValue placeholder="Select blood type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A+">A+</SelectItem>
                                    <SelectItem value="A-">A-</SelectItem>
                                    <SelectItem value="B+">B+</SelectItem>
                                    <SelectItem value="B-">B-</SelectItem>
                                    <SelectItem value="AB+">AB+</SelectItem>
                                    <SelectItem value="AB-">AB-</SelectItem>
                                    <SelectItem value="O+">O+</SelectItem>
                                    <SelectItem value="O-">O-</SelectItem>
                                </SelectContent>
                            </Select>
                            <p className="text-sm text-muted-foreground mt-2">We'll find donors who can donate to your blood type</p>
                        </div>

                        <Button type="submit" className="w-full" disabled={!bloodType}>
                            <Search className="mr-2 h-4 w-4" />
                            Find Donors
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="max-w-md mx-auto mt-8 text-center">
                <h2 className="text-xl font-semibold mb-2">Blood Type Compatibility</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Not all blood types are compatible. Here's a quick guide to which blood types can donate to you:
                </p>

                <div className="grid grid-cols-2 gap-4 text-left">
                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are A+
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: A+, A-, O+, O-</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are A-
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: A-, O-</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are B+
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: B+, B-, O+, O-</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are B-
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: B-, O-</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are AB+
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: All blood types</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are AB-
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: A-, B-, AB-, O-</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are O+
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: O+, O-</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="py-3">
                            <CardTitle className="text-base flex items-center">
                                <Droplet className="h-4 w-4 mr-2 text-red-500" />
                                If you are O-
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="py-2">
                            <p className="text-sm">Can receive from: O- only</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
