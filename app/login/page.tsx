"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError("Email and password are required.");
            return;
        }

        // Send login request to the backend
        try {
            const response = await fetch("/api/login", {  // API endpoint
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                // Save the JWT token in localStorage for persistent authentication
                localStorage.setItem("authToken", data.token);

                // Redirect to respective screen based on userType
                if (data.userType === "donor") {
                    router.push("/dashboard"); // Redirect to donor dashboard
                } else if (data.userType === "receiver") {
                    router.push("/receiver"); // Redirect to receiver dashboard
                }
            } else {
                const data = await response.json();
                setError(data.message || "Invalid email or password");
            }
        } catch (err) {
            setError("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white border-b py-3 px-4">
                <div className="container mx-auto flex items-center">
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="text-sm">Back to Home</span>
                    </Link>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 py-12">
                <Card className="w-full max-w-md">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Welcome Back</CardTitle>
                        <CardDescription>Login to your Donor+ account</CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="john.doe@example.com"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link href="/forgot-password" className="text-sm text-red-600 hover:underline">
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error && <p className="text-red-600 text-center">{error}</p>}

                            <div className="flex justify-center mt-4">
                                <Button
                                    type="submit"
                                    size="lg"
                                    variant="outline"
                                    className="w-full text-red-600 hover:bg-red-700 shadow-lg"
                                >
                                    Login
                                </Button>
                            </div>
                        </form>
                    </CardContent>

                    <CardFooter className="flex flex-col">
                        <p className="text-sm text-gray-500">
                            Don't have an account?{" "}
                            <Link href="/register" className="text-red-600 hover:underline">
                                Register
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </main>
        </div>
    );
}
