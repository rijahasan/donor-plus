"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Droplet } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LocationPicker from "@/components/ui/LocationPicker"

export default function ReceiverPage() {
  const router = useRouter()
  const [bloodType, setBloodType] = useState("")
  const [location, setLocation] = useState("")
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!bloodType || !coords) return
  
    router.push(`/receiver/results?bloodType=${encodeURIComponent(bloodType)}&lat=${coords.lat}&lng=${coords.lng}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 relative z-0">
      <h1 className="text-3xl font-bold mb-6">Find Blood Donors</h1>

      <Card className="mb-8 max-w-md mx-auto z-10">
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
              <div className="relative z-20">
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
              </div>
              
              <label htmlFor="location" className="text-sm font-medium block mt-4">
                Your Location
              </label>

              <div className="map-container z-0">
                <LocationPicker onChange={(coords) => {
                  console.log('Selected coordinates:', coords); // Log the coordinates
                  setCoords(coords);
                }} />
              </div>

              <p className="text-sm text-muted-foreground mt-2">
                Click on the map to set your location. We'll use it to find nearby donors.
              </p>

              <p className="text-sm text-muted-foreground mt-2">We'll find donors who can donate to your blood type</p>
            </div>

            <Button type="submit" className="w-full" disabled={!bloodType || !coords}>
              <Search className="mr-2 h-4 w-4" />
              Find Donors
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Add any additional content here */}
    </div>
  )
}
