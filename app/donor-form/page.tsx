"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ArrowLeft } from "lucide-react"
import LocationPicker from "@/components/ui/LocationPicker"

export default function DonorEligibilityForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<{
    firstName: string;
    lastName: string;
    email: string;
    bloodType: string;
    age: string;
    weight: string;
    recentSurgery: string;
    surgeryDetails: string;
    recentIllness: string;
    illnessDetails: string;
    onMedication: string;
    medicationDetails: string;
    chronicDisease: string;
    diseaseDetails: string;
    lastDonation: string;
    location: { lat: number | null; lng: number | null };
    available: string; 
  }>({
    firstName: "",
    lastName: "",
    email: "",
    bloodType: "",
    age: "",
    weight: "",
    recentSurgery: "no",
    surgeryDetails: "",
    recentIllness: "no",
    illnessDetails: "",
    onMedication: "no",
    medicationDetails: "",
    chronicDisease: "no",
    diseaseDetails: "",
    lastDonation: "",
    location: { lat: null, lng: null }, // ✅ added this correctly typed
    available: "", 
  });
  
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })

    // Clear error for this field when user changes input
    if (errors[field]) {
      const newErrors = { ...errors }
      delete newErrors[field]
      setErrors(newErrors)
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }

    // Blood type validation
    if (!formData.bloodType) {
      newErrors.bloodType = "Blood type is required"
    }

    // Age validation (18-55)
    const age = Number.parseInt(formData.age)
    if (!formData.age || isNaN(age)) {
      newErrors.age = "Please enter your age"
    } else if (age < 18) {
      newErrors.age = "You must be at least 18 years old to donate blood"
    } else if (age > 55) {
      newErrors.age = "The maximum age for blood donation is 55 years"
    }

    // Weight validation (minimum 55kg)
    const weight = Number.parseInt(formData.weight)
    if (!formData.weight || isNaN(weight)) {
      newErrors.weight = "Please enter your weight"
    } else if (weight < 55) {
      newErrors.weight = "You must weigh at least 55kg to donate blood"
    }

    // Last donation validation (optional)
    if (formData.lastDonation) {
      const lastDonationDate = new Date(formData.lastDonation)
      const threeMonthsAgo = new Date()
      threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3)

      if (lastDonationDate > new Date()) {
        newErrors.lastDonation = "Last donation date cannot be in the future"
      } else if (lastDonationDate > threeMonthsAgo) {
        newErrors.lastDonation = "You must wait at least 3 months between donations"
      }
    }

    // Medical conditions validation
    if (formData.recentSurgery === "yes") {
      newErrors.recentSurgery = "Recent surgery may disqualify you from donating blood"
    }

    if (formData.recentIllness === "yes") {
      newErrors.recentIllness = "Recent illness may disqualify you from donating blood"
    }

    if (formData.onMedication === "yes") {
      newErrors.onMedication = "Certain medications may disqualify you from donating blood"
    }

    if (formData.chronicDisease === "yes") {
      newErrors.chronicDisease = "Certain chronic diseases may disqualify you from donating blood"
    }

    if (formData.recentSurgery === "yes" && !formData.surgeryDetails.trim()) {
      newErrors.surgeryDetails = "Please provide details about your recent surgery"
    }

    if (formData.recentIllness === "yes" && !formData.illnessDetails.trim()) {
      newErrors.illnessDetails = "Please provide details about your recent illness"
    }

    if (formData.onMedication === "yes" && !formData.medicationDetails.trim()) {
      newErrors.medicationDetails = "Please provide details about your medications"
    }

    if (formData.chronicDisease === "yes" && !formData.diseaseDetails.trim()) {
      newErrors.diseaseDetails = "Please provide details about your chronic disease(s)"
    }
    if (!formData.available.trim()) {
      newErrors.available = "Please specify your availability"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  
    if (validateForm()) {
      console.log("Form submitted successfully", formData); // ✅ Confirm location is in here
  
      try {
        const response = await fetch("/api/donors", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData), // ✅ use full formData (includes location now)
        });
  
        if (!response.ok) {
          throw new Error("Failed to submit the form");
        }
  
        const result = await response.json();
        console.log(result.message);
  
        router.push("/login");
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    } else {
      const firstErrorField = document.querySelector("[data-error='true']");
      if (firstErrorField) {
        firstErrorField.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  };
  
  const goBack = () => {
    router.push("/register")
  }

  return (
    <div className="container max-w-2xl py-6">
      <Button variant="ghost" onClick={goBack} className="mb-4 flex items-center gap-2">
        <ArrowLeft size={16} />
        Back to Register
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Donor Eligibility Check</CardTitle>
          <CardDescription>Please complete this form to check if you're eligible to donate blood.</CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div data-error={!!errors.firstName}>
                  <Label htmlFor="firstName" className="text-base">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>}
                </div>

                <div data-error={!!errors.lastName}>
                  <Label htmlFor="lastName" className="text-base">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    className={errors.lastName ? "border-red-500" : ""}
                  />
                  {errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>}
                </div>
              </div>
              <div data-error={!!errors.email}>
                <Label htmlFor="email" className="text-base">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div data-error={!!errors.bloodType}>
                <Label htmlFor="bloodType" className="text-base">
                  Blood Type <span className="text-red-500">*</span>
                </Label>
                <select
                  id="bloodType"
                  value={formData.bloodType}
                  onChange={(e) => handleInputChange("bloodType", e.target.value)}
                  className={`w-full h-10 px-3 py-2 border rounded-md ${
                    errors.bloodType ? "border-red-500" : "border-input"
                  }`}
                >
                  <option value="">Select your blood type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                {errors.bloodType && <p className="mt-1 text-sm text-red-500">{errors.bloodType}</p>}
              </div>
            </div>
              
                      <div data-error={!!errors.available}>
            <Label htmlFor="available" className="text-base">
              Are you available for donation? <span className="text-red-500">*</span>
            </Label>
            <select
              id="available"
              value={formData.available}
              onChange={(e) => handleInputChange("available", e.target.value)}
              className={`w-full h-10 px-3 py-2 border rounded-md ${
                errors.available ? "border-red-500" : "border-input"
              }`}
            >
              <option value="">Select availability</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
            {errors.available && <p className="mt-1 text-sm text-red-500">{errors.available}</p>}
          </div>



            <div className="space-y-4">
              <div data-error={!!errors.age}>
                <Label htmlFor="age" className="text-base">
                  Age <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className={errors.age ? "border-red-500" : ""}
                />
                {errors.age && <p className="mt-1 text-sm text-red-500">{errors.age}</p>}
              </div>

              <div data-error={!!errors.weight}>
                <Label htmlFor="weight" className="text-base">
                  Weight (kg) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight in kg"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                  className={errors.weight ? "border-red-500" : ""}
                />
                {errors.weight && <p className="mt-1 text-sm text-red-500">{errors.weight}</p>}
              </div>

              <div data-error={!!errors.lastDonation}>
                <Label htmlFor="lastDonation" className="text-base">
                  Date of Last Blood Donation (if applicable)
                </Label>
                <Input
                  id="lastDonation"
                  type="date"
                  value={formData.lastDonation}
                  onChange={(e) => handleInputChange("lastDonation", e.target.value)}
                  className={errors.lastDonation ? "border-red-500" : ""}
                />
                {errors.lastDonation && <p className="mt-1 text-sm text-red-500">{errors.lastDonation}</p>}
              </div>

              <div data-error={!!errors.recentSurgery || !!errors.surgeryDetails}>
                <Label className="text-base">
                  Have you had surgery in the last 6 months? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.recentSurgery}
                  onValueChange={(value) => handleInputChange("recentSurgery", value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="surgery-yes" />
                    <Label htmlFor="surgery-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="surgery-no" />
                    <Label htmlFor="surgery-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.recentSurgery && <p className="mt-1 text-sm text-red-500">{errors.recentSurgery}</p>}

                {formData.recentSurgery === "yes" && (
                  <div className="mt-2">
                    <Label htmlFor="surgeryDetails" className="text-base">
                      Please specify what surgery you had <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="surgeryDetails"
                      placeholder="Provide details about your surgery"
                      value={formData.surgeryDetails}
                      onChange={(e) => handleInputChange("surgeryDetails", e.target.value)}
                      className={`w-full min-h-[80px] px-3 py-2 border rounded-md ${
                        errors.surgeryDetails ? "border-red-500" : "border-input"
                      }`}
                    />
                    {errors.surgeryDetails && <p className="mt-1 text-sm text-red-500">{errors.surgeryDetails}</p>}
                  </div>
                )}
              </div>

              <div data-error={!!errors.recentIllness || !!errors.illnessDetails}>
                <Label className="text-base">
                  Have you been ill in the last 3 months? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.recentIllness}
                  onValueChange={(value) => handleInputChange("recentIllness", value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="illness-yes" />
                    <Label htmlFor="illness-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="illness-no" />
                    <Label htmlFor="illness-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.recentIllness && <p className="mt-1 text-sm text-red-500">{errors.recentIllness}</p>}

                {formData.recentIllness === "yes" && (
                  <div className="mt-2">
                    <Label htmlFor="illnessDetails" className="text-base">
                      Please specify what illness you had <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="illnessDetails"
                      placeholder="Provide details about your illness"
                      value={formData.illnessDetails}
                      onChange={(e) => handleInputChange("illnessDetails", e.target.value)}
                      className={`w-full min-h-[80px] px-3 py-2 border rounded-md ${
                        errors.illnessDetails ? "border-red-500" : "border-input"
                      }`}
                    />
                    {errors.illnessDetails && <p className="mt-1 text-sm text-red-500">{errors.illnessDetails}</p>}
                  </div>
                )}
              </div>

              <div data-error={!!errors.onMedication || !!errors.medicationDetails}>
                <Label className="text-base">
                  Are you currently taking any medication? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.onMedication}
                  onValueChange={(value) => handleInputChange("onMedication", value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="medication-yes" />
                    <Label htmlFor="medication-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="medication-no" />
                    <Label htmlFor="medication-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.onMedication && <p className="mt-1 text-sm text-red-500">{errors.onMedication}</p>}

                {formData.onMedication === "yes" && (
                  <div className="mt-2">
                    <Label htmlFor="medicationDetails" className="text-base">
                      Please list all medications you are taking <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="medicationDetails"
                      placeholder="List all medications and their dosages"
                      value={formData.medicationDetails}
                      onChange={(e) => handleInputChange("medicationDetails", e.target.value)}
                      className={`w-full min-h-[80px] px-3 py-2 border rounded-md ${
                        errors.medicationDetails ? "border-red-500" : "border-input"
                      }`}
                    />
                    {errors.medicationDetails && (
                      <p className="mt-1 text-sm text-red-500">{errors.medicationDetails}</p>
                    )}
                  </div>
                )}
              </div>

              <div data-error={!!errors.chronicDisease || !!errors.diseaseDetails}>
                <Label className="text-base">
                  Do you have any chronic diseases? <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={formData.chronicDisease}
                  onValueChange={(value) => handleInputChange("chronicDisease", value)}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="chronic-yes" />
                    <Label htmlFor="chronic-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="chronic-no" />
                    <Label htmlFor="chronic-no">No</Label>
                  </div>
                </RadioGroup>
                {errors.chronicDisease && <p className="mt-1 text-sm text-red-500">{errors.chronicDisease}</p>}

                {formData.chronicDisease === "yes" && (
                  <div className="mt-2">
                    <Label htmlFor="diseaseDetails" className="text-base">
                      Please specify your chronic disease(s) <span className="text-red-500">*</span>
                    </Label>
                    <textarea
                      id="diseaseDetails"
                      placeholder="List all chronic diseases you have"
                      value={formData.diseaseDetails}
                      onChange={(e) => handleInputChange("diseaseDetails", e.target.value)}
                      className={`w-full min-h-[80px] px-3 py-2 border rounded-md ${
                        errors.diseaseDetails ? "border-red-500" : "border-input"
                      }`}
                    />
                    {errors.diseaseDetails && <p className="mt-1 text-sm text-red-500">{errors.diseaseDetails}</p>}
                  </div>
                )}
              </div>
            </div>
            <LocationPicker
  onChange={(coords) => {
    console.log("Selected location:", coords);
    setFormData((prev) => ({
      ...prev,
      location: coords
    }));
  }}
/>

          </CardContent>

          <CardFooter>
            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Check Eligibility & Continue
            </Button>
          </CardFooter>
        </form>
      </Card>

      {formSubmitted && Object.keys(errors).length > 0 && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600 font-medium">Please correct the errors above to continue.</p>
        </div>
      )}
    </div>
  )
}
