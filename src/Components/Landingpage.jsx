import { Wrench, PackageCheck, PlayCircle } from "lucide-react";
import { FaFacebookF, FaTwitter, FaInstagram, FaPhoneAlt, FaEnvelope, FaBars, FaTimes } from "react-icons/fa";
import '../index.css'
import { Link } from 'react-router-dom';
import { useState } from "react";

function Landingpage() {
    const [isOpen, setIsOpen] = useState(false);
    
    return(
        <div className="flex flex-col min-h-screen">
            <main className="flex-grow">
                <nav className="bg-white shadow-md px-4 sm:px-6 md:px-8 py-2 flex items-center justify-between relative z-50">
                    {/* Logo */}
                    <div className="flex items-center space-x-3">
                        <img
                        src="/logo.jpg"
                        alt="Logo"
                        className="w-12 h-12 rounded-full object-cover"
                        />
                        <h1 className="text-xl sm:text-2xl font-bold text-black">
                        N-Tech Hardware
                        </h1>
                    </div>

                    {/* Desktop Links */}
                    <div className="hidden md:flex space-x-6 text-black font-medium">
                        <a href="#home" className="hover:text-gray-600">Home</a>
                        <a href="#products" className="hover:text-gray-600">Products</a>
                        <a href="#services" className="hover:text-gray-600">Services</a>
                        <a href="#about" className="hover:text-gray-600">About Us</a>
                        <a href="#contacts" className="hover:text-gray-600">Contacts</a>
                    </div>

                    {/* Desktop Buttons */}
                    <div className="hidden md:flex space-x-3">
                        <Link to="/login">
                        <button className="px-6 py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition">
                            Log In
                        </button>
                        </Link>
                        <Link to="/signup">
                        <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition">
                            Register
                        </button>
                        </Link>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="md:hidden text-black text-2xl"
                    >
                        {isOpen ? <FaTimes /> : <FaBars />}
                    </button>

                    {/* Mobile Dropdown Menu with animation */}
                        <div
                            className={`absolute top-full left-0 w-full bg-white shadow-md overflow-hidden transition-all duration-300 ease-in-out md:hidden ${
                            isOpen ? "max-h-[500px] opacity-100 py-6" : "max-h-0 opacity-0 py-0"
                            }`}
                        >
                            <div className="flex flex-col items-center space-y-4 text-black font-medium">
                            <a href="#home" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Home</a>
                            <a href="#products" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Products</a>
                            <a href="#services" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Services</a>
                            <a href="#about" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>About Us</a>
                            <a href="#contacts" className="hover:text-gray-600" onClick={() => setIsOpen(false)}>Contacts</a>
                            <Link to="/login">
                                <button className="px-6 py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition w-40">
                                Log In
                                </button>
                            </Link>
                            <Link to="/signup">
                                <button className="px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition w-40">
                                Register
                                </button>
                            </Link>
                            </div>
                        </div>
                    </nav>

                    <section
                        className="bg-gradient-to-r from-black via-black to-gray-100 text-white px-4 sm:px-6 md:px-10 lg:px-20 pt-20 pb-10 min-h-screen flex items-center justify-center"
                        id="home"
                        >
                        <div className="flex flex-col md:flex-row w-full items-center md:items-start justify-between gap-10">
                            <div className="max-w-xl text-center md:text-left flex flex-col items-center md:items-start">
                            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                                Welcome to N-Tech Hardware
                            </h2>
                            <p className="text-base sm:text-lg mb-8">
                                Your one-stop shop for hardware needs
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to="/signup">
                                <button className="bg-white text-gray-900 px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                                    Register account
                                </button>
                                </Link>
                                <Link to="/login">
                                <button className="bg-transparent border border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-gray-900 transition">
                                    Log in account
                                </button>
                                </Link>
                            </div>
                            </div>

                            {/* Image hidden on small screens */}
                            <div className="hidden md:block">
                            <img
                                src="/grinder.png"
                                alt="Hardware Showcase"
                                className="max-w-[500px] h-auto rounded-lg object-cover"
                            />
                            </div>
                        </div>
                    </section>

                    <section className="py-10 px-10 bg-white" id="products">
                        <h3 className="text-5xl font-bold text-center mb-10 text-black">Our Products</h3>
                        <hr></hr>
                        <div className="grid md:grid-cols-3 gap-10 text-center">
                            {[{
                                src: "/grill.png",
                                alt: "Cordless Drill",
                                title: "Cordless Drill",
                                desc: "High-performance drill with long battery life.",
                                price: "₱2,499.00"
                            }, {
                                src: "/angle.png",
                                alt: "Angle Grinder",
                                title: "Angle Grinder",
                                desc: "Durable grinder ideal for metal and concrete work.",
                                price: "₱3,199.00"
                            }, {
                                src: "/hammer.png",
                                alt: "Hammer Drill",
                                title: "Hammer Drill",
                                desc: "Powerful tool for heavy-duty construction work.",
                                price: "₱4,499.00"
                            }].map((product, idx) => (
                                <div key={idx} className="shadow-lg p-6 rounded-lg flex flex-col justify-between h-full">
                                    <div>
                                        <img
                                            src={product.src}
                                            alt={product.alt}
                                            className="w-full h-64 mb-4 rounded"
                                        />
                                        <h4 className="text-xl font-semibold mb-2">{product.title}</h4>
                                        <p className="mb-2">{product.desc}</p>
                                        <span className="block font-bold text-lg mb-3">{product.price}</span>
                                    </div>
                                    <button className="mt-4 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition">
                                        View Details
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section className="py-5 px-10 bg-gray-50" id="services">
                        <h3 className="text-5xl font-bold text-center mb-10">Our Services</h3>
                        <div className="grid md:grid-cols-3 gap-10 text-center">
                            <div className="shadow-lg p-6 rounded-lg bg-white">
                                <div className="flex justify-center mb-4">
                                    <Wrench className="w-10 h-10 text-blue-600" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2">Tool Repair</h4>
                                <p>Expert repair services for all kinds of power tools with quick turnaround time.</p>
                            </div>
                            <div className="shadow-lg p-6 rounded-lg bg-white">
                                <div className="flex justify-center mb-4">
                                    <PackageCheck className="w-10 h-10 text-green-600" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2">Free Delivery</h4>
                                <p>Enjoy free and fast delivery for all your orders—straight to your doorstep.</p>
                            </div>
                            <div className="shadow-lg p-6 rounded-lg bg-white">
                                <div className="flex justify-center mb-4">
                                    <PlayCircle className="w-10 h-10 text-yellow-500" />
                                </div>
                                <h4 className="text-xl font-semibold mb-2">Product Demos</h4>
                                <p>Schedule a live demo to experience the performance of our top tools before purchase.</p>
                            </div>

                        </div>
                    </section>

                    <section className="py-16 px-10 bg-white" id="about">
                        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                            <div>
                            <h3 className="text-5xl font-bold mb-6">About Us</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                At <span className="font-semibold text-black-600">N-Tech Hardware</span>, we are passionate about providing high-quality hardware tools and services to meet your every need.
                                Whether you're a DIY enthusiast or a professional contractor, our wide selection of reliable tools and expert repair support ensures you can get the job done right.
                                We are committed to excellent customer service, timely delivery, and innovative solutions to make your projects easier and more efficient.
                            </p>
                            </div>
                            <div className="flex justify-center">
                            <img
                                src="/plumber.png"
                                alt="About ToolHaven"
                                className="w-[350px] h-auto rounded-lg shadow-md object-cover"
                            />
                            </div>
                        </div>
                    </section>
            </main>

           <footer className="bg-black text-white py-10 px-6" id="contacts">
            <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
                <div className="text-center md:text-left space-y-2">
                <h4 className="text-xl font-semibold mb-3">Contact Us</h4>
                <p className="flex items-center justify-center md:justify-start gap-2">
                    <FaPhoneAlt /> +63 912 345 6789
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                    <FaPhoneAlt /> +63 987 654 3210
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2 pt-2">
                    <FaEnvelope /> support@toolhaven.com
                </p>
                </div>
                <div className="text-center md:text-left space-y-2">
                <h4 className="text-xl font-semibold mb-3">Follow Us</h4>
                <div className="flex justify-center md:justify-start gap-4 text-2xl">
                    <a href="#" className="hover:text-blue-500"><FaFacebookF /></a>
                    <a href="#" className="hover:text-sky-400"><FaTwitter /></a>
                    <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
                </div>
                </div>
                <div className="flex items-center justify-center md:justify-end text-center md:text-right">
                <p>&copy; {new Date().getFullYear()} N-Tech Hardware. All rights reserved.</p>
                </div>

            </div>
        </footer>
    </div>
    );
}

export default Landingpage;