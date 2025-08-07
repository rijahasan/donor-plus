import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin, Droplet, Users, Bell } from "lucide-react";

export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <header className="bg-white shadow-md sticky top-0 z-10">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Droplet className="h-8 w-8 text-red-600" />
                        <span className="font-bold text-2xl text-red-600">Donor+</span>
                    </Link>
                    <div className="flex items-center space-x-4">
                        <Link href="/login">
                            <Button variant="ghost">Login</Button>
                        </Link>
                        <Link href="/register">
                            <Button variant="default" className="bg-red-600 hover:bg-red-700 px-6 py-2 text-lg">Register</Button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <section className="bg-gradient-to-r from-red-500 to-red-700 text-white py-20 text-center">
                    <div className="container mx-auto px-6">
                        <h1 className="text-5xl font-extrabold mb-4">Donate Blood, Save Lives</h1>
                        <p className="text-xl mb-6 max-w-2xl mx-auto">Join a community of life-savers and connect with those in need in real-time.</p>
                        <div className="flex justify-center gap-4">
                            <Link href="/register?type=donor">
                                <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-red-700 shadow-lg">Become a Donor</Button>
                            </Link>
                            <Link href="/register?type=receiver">
                                <Button size="lg" variant="outline" className="bg-white text-red-600 hover:bg-red-700 shadow-lg">Need Blood?</Button>
                            </Link>
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { icon: Users, title: "Register", desc: "Create your profile as a donor or receiver with necessary health information." },
                                { icon: MapPin, title: "Connect", desc: "Find donors or receivers near your location using our advanced mapping system." },
                                { icon: Bell, title: "Respond", desc: "Get real-time notifications when someone needs your blood type." }
                            ].map(({ icon: Icon, title, desc }) => (
                                <div key={title} className="bg-gray-100 p-6 rounded-lg shadow-md transition-transform transform hover:scale-105">
                                    <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Icon className="h-8 w-8 text-red-600" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">{title}</h3>
                                    <p className="text-gray-600">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="py-16 bg-gray-50">
                    <div className="container mx-auto px-6">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            {[
                                { value: "5,000+", label: "Registered Donors" },
                                { value: "3,200+", label: "Successful Donations" },
                                { value: "1,500+", label: "Lives Saved" }
                            ].map(({ value, label }) => (
                                <div key={label} className="p-6 bg-white shadow-md rounded-lg">
                                    <p className="text-4xl font-bold text-red-600 mb-2">{value}</p>
                                    <p className="text-xl text-gray-600">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-gray-800 text-white py-8">
                <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Donor+</h3>
                        <p className="text-gray-300">Connecting blood donors with receivers in real-time to save lives.</p>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-gray-300">
                            {["About Us", "Contact", "FAQ", "Privacy Policy"].map(link => (
                                <li key={link}>
                                    <Link href={`/${link.toLowerCase().replace(/ /g, "")}`} className="hover:text-red-400">{link}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
                        <p className="text-gray-300">Email: info@donorplus.com</p>
                        <p className="text-gray-300">Phone: (021) 337-7890</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Donor+. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}