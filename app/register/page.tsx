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
import { useRouter } from "next/navigation"

export default function RegisterPage() {
    const searchParams = useSearchParams()
    const defaultType = searchParams?.get("type") || "donor"
    const [userType, setUserType] = useState(defaultType)
    const router = useRouter()

    // State for form data and errors
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        bloodType: "",
        available: "no",
        urgency: "normal",
    })

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        phone: "",
        bloodType: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        })
    }


    const validateForm = (emailAlreadyRegistered = false) => {
        let isValid = true
        const newErrors = { ...errors }

        // Validate first name
        if (!formData.firstName) {
            newErrors.firstName = "First Name is required"
            isValid = false
        } else {
            newErrors.firstName = ""
        }

        // Validate last name
        if (!formData.lastName) {
            newErrors.lastName = "Last Name is required"
            isValid = false
        } else {
            newErrors.lastName = ""
        }

        // Validate email
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        if (!formData.email || !emailRegex.test(formData.email)) {
            newErrors.email = "Please enter a valid email address"
            isValid = false
        } else if (emailAlreadyRegistered) {
            newErrors.email = "Email is already registered"
            isValid = false
        } else {
            newErrors.email = ""
        }

        // Validate password
        if (!formData.password || formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long"
            isValid = false
        } else {
            newErrors.password = ""
        }

        // Validate phone number
        const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s./0-9]*$/
        if (!formData.phone || !phoneRegex.test(formData.phone)) {
            newErrors.phone = "Please enter a valid phone number"
            isValid = false
        } else {
            newErrors.phone = ""
        }

        // Validate blood type
        if (!formData.bloodType) {
            newErrors.bloodType = "Blood Type is required"
            isValid = false
        } else {
            newErrors.bloodType = ""
        }

        setErrors(newErrors)
        return isValid
    }

    const handleCreateAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        let emailAlreadyRegistered = false;

        // Validate form before submitting
        if (validateForm()) {
            // Construct the user data object from the form
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                bloodType: formData.bloodType,
                userType: userType, // Donor or Receiver
                available: formData.available === "yes" ? 1 : 0, // Send yes/no for donor availability
                urgency: formData.urgency === "urgent" ? 1 : 0, // Send urgent/normal for receiver urgency
            };
            if (userType === 'receiver') {

                try {
                    // Send the user data to the backend to store in the database
                    const response = await fetch('/api/users', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(userData),
                    });

                    const data = await response.json(); // Always parse JSON once

                    if (response.ok) {
                        // const result = await response.json();
                        console.log('Account created successfully:', data);
                        router.push("/login");
                        // router.push(`/receiver?email=${data.email}`)
                        // // Redirect to the appropriate page
                        // if (userType === "donor") {
                        //     router.push("/donor-form");
                        // } else {
                        //     router.push("/login");
                        // }
                    } else {
                        if (data.message?.includes("Email is already registered")) {
                            emailAlreadyRegistered = true;
                            validateForm(emailAlreadyRegistered); // Re-run validation to show email error
                        } else {
                            console.error('Unexpected error creating account:', data.message);
                            emailAlreadyRegistered = false;
                            validateForm(emailAlreadyRegistered); // Re-run validation to show email error
                            // You can also show a generic toast/error UI here if you want
                        }
                    }
                } catch (error) {
                    console.error('Network or unexpected error during registration:', error);
                    // Handle true network errors or unexpected crashes
                }
            }
            else {

                const query = new URLSearchParams(formData as Record<string, string>).toString();
                validateForm
                router.push(`/donor-form?${query}`);

                // Handle network or other errors

            }
        }
    }

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

                            <form onSubmit={handleCreateAccount}>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName">First Name</Label>
                                            <Input
                                                id="firstName"
                                                placeholder="John"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName}</p>}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lastName">Last Name</Label>
                                            <Input
                                                id="lastName"
                                                placeholder="Doe"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                            {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName}</p>}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="john.doe@example.com"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input
                                            id="password"
                                            type="password"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            type="tel"
                                            placeholder="+1 (555) 123-4567"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        {userType === 'donor' ? (
                                            <Label htmlFor="bloodType">Blood Type</Label>
                                        ) : (
                                            <Label htmlFor="bloodType">Blood Type Needed</Label>
                                        )}
                                        <Select
                                            value={formData.bloodType}
                                            onValueChange={(value) => setFormData({ ...formData, bloodType: value })}
                                        >
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
                                        {errors.bloodType && <p className="text-red-500 text-xs">{errors.bloodType}</p>}
                                    </div>

                                    {/* Dynamic sections for donor or receiver */}
                                    {userType === "donor" && (
                                        <div className="space-y-4"> {/* Add some space between this section and the elements above */}
                                            <Label>Are you available to donate now?</Label>
                                            <RadioGroup
                                                value={formData.available}
                                                onValueChange={(value) => {
                                                    setFormData({ ...formData, available: value });
                                                    console.log("Updated available:", value); // Log the updated value here
                                                }}
                                                className="flex gap-6"> {/* Increase gap between radio items */}
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="yes" id="available-yes" className="h-6 w-6" /> {/* Adjust size of radio button */}
                                                    <Label htmlFor="available-yes" className="cursor-pointer">Yes</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem value="no" id="available-no" className="h-6 w-6" /> {/* Adjust size of radio button */}
                                                    <Label htmlFor="available-no" className="cursor-pointer">No</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}


                                    {userType === "receiver" && (
                                        <div className="space-y-4"> {/* Increase vertical spacing between this and previous sections */}
                                            <Label>Urgency Level</Label>
                                            <RadioGroup defaultValue="normal" className="flex gap-6"> {/* Increase the gap between radio items */}
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="urgent"
                                                        id="urgency-urgent"
                                                        className="h-6 w-6" // Adjust size of the radio button for better interaction
                                                    />
                                                    <Label htmlFor="urgency-urgent" className="cursor-pointer">Urgent</Label>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value="normal"
                                                        id="urgency-normal"
                                                        className="h-6 w-6" // Adjust size of the radio button for better interaction
                                                    />
                                                    <Label htmlFor="urgency-normal" className="cursor-pointer">Normal</Label>
                                                </div>
                                            </RadioGroup>
                                        </div>
                                    )}

                                </div>

                                <CardFooter className="mt-4">  {/* mt-4 adds margin-top */}
                                    <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                                        Create Account
                                    </Button>
                                </CardFooter>
                            </form>
                        </Tabs>
                    </CardContent>
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
