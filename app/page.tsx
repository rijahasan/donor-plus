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
                        <p className="text-gray-300">Email: sa07424@st.habib.edu.pk</p>
                        <p className="text-gray-300">Phone: (123) 456-7890</p>
                    </div>
                </div>
                <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
                    <p>&copy; {new Date().getFullYear()} Donor+. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}


// import Link from "next/link"
// import { Button } from "@/components/ui/button"
// import { MapPin, Droplet, Users, Bell } from "lucide-react"

// export default function Home() {
//     return (
//         <div className="flex flex-col min-h-screen">
//             <header className="bg-white border-b sticky top-0 z-10">
//                 <div className="container mx-auto px-4 py-3 flex items-center justify-between">
//                     <Link href="/" className="flex items-center space-x-2">
//                         <Droplet className="h-6 w-6 text-red-600" />
//                         <span className="font-bold text-xl">Donor+</span>
//                     </Link>
//                     <div className="flex items-center space-x-4">
//                         <Link href="/login">
//                             <Button variant="ghost">Login</Button>
//                         </Link>
//                         <Link href="/register">
//                             <Button variant="default" className="bg-red-600 hover:bg-red-700">
//                                 Register
//                             </Button>
//                         </Link>
//                     </div>
//                 </div>
//             </header>

//             <main className="flex-1">
//                 {/* Hero Section */}
//                 <section className="bg-gradient-to-r from-red-500 to-red-600 text-white py-16">
//                     <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
//                         <div className="md:w-1/2 mb-8 md:mb-0">
//                             <h1 className="text-4xl md:text-5xl font-bold mb-4">Donate Blood, Save Lives</h1>
//                             <p className="text-xl mb-6">
//                                 Connect with blood receivers in real-time and make a difference in someone's life.
//                             </p>
//                             <div className="flex flex-col sm:flex-row gap-4">
//                                 <Link href="/register?type=donor">
//                                     <Button size="lg" className="bg-white text-red-600 hover:bg-gray-100">
//                                         Become a Donor
//                                     </Button>
//                                 </Link>
//                                 <Link href="/register?type=receiver">
//                                     <Button size="lg" variant="outline" className="border-white text-white hover:bg-red-700">
//                                         Need Blood?
//                                     </Button>
//                                 </Link>
//                             </div>
//                         </div>
//                         <div className="md:w-1/2 flex justify-center">
//                             <div className="relative w-full max-w-md p-6">
//                                 {/* Simple, modern blood donation illustration */}
//                                 <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
//                                     <div className="relative aspect-video">
//                                         {/* Background gradient */}
//                                         <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-red-100"></div>

//                                         {/* Blood drops */}
//                                         <div className="absolute top-1/4 left-1/4 w-16 h-16">
//                                             <div
//                                                 className="absolute w-full h-full rounded-full bg-red-500 opacity-90 animate-bounce"
//                                                 style={{ animationDuration: "4s" }}
//                                             ></div>
//                                             <div
//                                                 className="absolute w-full h-full rounded-tl-full rounded-tr-full rounded-br-full rotate-45 bg-red-500 opacity-90 animate-bounce"
//                                                 style={{ animationDuration: "4s" }}
//                                             ></div>
//                                         </div>

//                                         <div className="absolute bottom-1/4 right-1/4 w-12 h-12">
//                                             <div
//                                                 className="absolute w-full h-full rounded-full bg-red-400 opacity-80 animate-bounce"
//                                                 style={{ animationDuration: "3s", animationDelay: "1s" }}
//                                             ></div>
//                                             <div
//                                                 className="absolute w-full h-full rounded-tl-full rounded-tr-full rounded-br-full rotate-45 bg-red-400 opacity-80 animate-bounce"
//                                                 style={{ animationDuration: "3s", animationDelay: "1s" }}
//                                             ></div>
//                                         </div>

//                                         {/* Connection lines */}
//                                         <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 225" aria-hidden="true">
//                                             <path
//                                                 d="M100,80 C150,120 250,120 300,80"
//                                                 stroke="#ef4444"
//                                                 strokeWidth="2"
//                                                 strokeDasharray="6 4"
//                                                 fill="none"
//                                                 className="animate-pulse"
//                                             />
//                                             <path
//                                                 d="M100,140 C150,100 250,100 300,140"
//                                                 stroke="#ef4444"
//                                                 strokeWidth="2"
//                                                 strokeDasharray="6 4"
//                                                 fill="none"
//                                                 className="animate-pulse"
//                                                 style={{ animationDelay: "1s" }}
//                                             />
//                                         </svg>

//                                         {/* Blood type badges */}
//                                         <div className="absolute top-1/3 left-1/2 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md border border-red-100">
//                                             <span className="text-red-600 font-bold">A+</span>
//                                         </div>
//                                         <div className="absolute top-2/3 left-1/3 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md border border-red-100">
//                                             <span className="text-red-600 font-bold">B-</span>
//                                         </div>
//                                         <div className="absolute top-1/4 right-1/4 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md border border-red-100">
//                                             <span className="text-red-600 font-bold">O+</span>
//                                         </div>
//                                         <div className="absolute bottom-1/4 right-1/6 bg-white rounded-full h-10 w-10 flex items-center justify-center shadow-md border border-red-100">
//                                             <span className="text-red-600 font-bold">AB</span>
//                                         </div>
//                                     </div>

//                                     {/* Caption
//                                     <div className="p-4 bg-white text-center">
//                                         <p className="text-gray-600 text-sm">One donation can save up to three lives</p>
//                                         <div className="mt-2 flex justify-center gap-2">
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                 Fast
//                                             </span>
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                 Secure
//                                             </span>
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                 Life-saving
//                                             </span>
//                                         </div>
//                                     </div> */}
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Features Section */}
//                 <section className="py-16 bg-gray-50">
//                     <div className="container mx-auto px-4">
//                         <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
//                         <div className="grid md:grid-cols-3 gap-8">
//                             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                                 <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <Users className="h-8 w-8 text-red-600" />
//                                 </div>
//                                 <h3 className="text-xl font-semibold mb-2">Register</h3>
//                                 <p className="text-gray-600">
//                                     Create your profile as a donor or receiver with your blood type and health information.
//                                 </p>
//                             </div>
//                             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                                 <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <MapPin className="h-8 w-8 text-red-600" />
//                                 </div>
//                                 <h3 className="text-xl font-semibold mb-2">Connect</h3>
//                                 <p className="text-gray-600">
//                                     Find donors or receivers near your location using our advanced mapping system.
//                                 </p>
//                             </div>
//                             <div className="bg-white p-6 rounded-lg shadow-md text-center">
//                                 <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <Bell className="h-8 w-8 text-red-600" />
//                                 </div>
//                                 <h3 className="text-xl font-semibold mb-2">Respond</h3>
//                                 <p className="text-gray-600">
//                                     Get real-time notifications when someone needs your blood type in your area.
//                                 </p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>

//                 {/* Stats Section */}
//                 <section className="py-16 bg-white">
//                     <div className="container mx-auto px-4">
//                         <div className="grid md:grid-cols-3 gap-8 text-center">
//                             <div>
//                                 <p className="text-4xl font-bold text-red-600 mb-2">5,000+</p>
//                                 <p className="text-xl text-gray-600">Registered Donors</p>
//                             </div>
//                             <div>
//                                 <p className="text-4xl font-bold text-red-600 mb-2">3,200+</p>
//                                 <p className="text-xl text-gray-600">Successful Donations</p>
//                             </div>
//                             <div>
//                                 <p className="text-4xl font-bold text-red-600 mb-2">1,500+</p>
//                                 <p className="text-xl text-gray-600">Lives Saved</p>
//                             </div>
//                         </div>
//                     </div>
//                 </section>
//             </main>

//             <footer className="bg-gray-800 text-white py-8">
//                 <div className="container mx-auto px-4">
//                     <div className="grid md:grid-cols-3 gap-8">
//                         <div>
//                             <h3 className="text-xl font-semibold mb-4">Donor+</h3>
//                             <p className="text-gray-300">Connecting blood donors with receivers in real-time to save lives.</p>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
//                             <ul className="space-y-2 text-gray-300">
//                                 <li>
//                                     <Link href="/about" className="hover:text-red-400">
//                                         About Us
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/contact" className="hover:text-red-400">
//                                         Contact
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/faq" className="hover:text-red-400">
//                                         FAQ
//                                     </Link>
//                                 </li>
//                                 <li>
//                                     <Link href="/privacy" className="hover:text-red-400">
//                                         Privacy Policy
//                                     </Link>
//                                 </li>
//                             </ul>
//                         </div>
//                         <div>
//                             <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
//                             <p className="text-gray-300 mb-2">Email: info@donorplus.com</p>
//                             <p className="text-gray-300">Phone: (123) 456-7890</p>
//                         </div>
//                     </div>
//                     <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-300">
//                         <p>&copy; {new Date().getFullYear()} Donor+. All rights reserved.</p>
//                     </div>
//                 </div>
//             </footer>
//         </div>
//     )
// }

