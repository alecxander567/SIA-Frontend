import React from "react";
import { FaArrowLeft, FaUser, FaEnvelope, FaBriefcase, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from "axios";
import { useState } from "react";

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        position: "",
        email: "",
        password: ""
    });
    const [successMessage, setSuccessMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const response = await axios.post("http://localhost:8080/api/employees/signup", formData);
        if (response.status === 200) {
            setSuccessMessage(response.data.message); 
            setFormData({
            firstName: "",
            lastName: "",
            position: "",
            email: "",
            password: ""
            });
        }
        } catch (error) {
        alert("Sign up failed: " + error.response?.data?.message || "Server error");
        }
    };

    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4 relative">
            <div className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-xl w-full max-w-2xl relative">
                <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
                <FaUser className="text-black" />
                Sign Up
                </h2>
                {successMessage && (
                <div className="mb-4 p-3 rounded bg-green-100 text-green-800 border border-green-400">
                    {successMessage}
                </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                <a
                    href="/"
                    className="absolute top-4 right-4 p-2 border border-black rounded-full text-black hover:bg-black hover:text-white transition"
                    title="Back to Home"
                >
                    <FaArrowLeft />
                </a>
                <div className="flex gap-4">
                    <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                        <FaUser />
                        First Name
                    </label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black"
                        placeholder="Enter first name"
                        required
                    />
                    </div>
                    <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                        <FaUser />
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black"
                        placeholder="Enter last name"
                        required
                    />
                    </div>
                </div>
                <div className="flex gap-4">
                    <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                        <FaEnvelope />
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black"
                        placeholder="example@email.com"
                        required
                    />
                    </div>
                    <div className="w-1/2">
                    <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                        <FaBriefcase />
                        Position
                    </label>
                    <input
                        type="text"
                        name="position"
                        value={formData.position}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black"
                        placeholder="e.g. Manager"
                        required
                    />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
                        <FaLock />
                        Password
                    </label>
                    <div className="relative">
                        <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black"
                        placeholder="8-16 characters"
                        required
                        />
                        <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-2 flex items-center text-black"
                        tabIndex={-1}
                        >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition"
                >
                    Sign Up
                </button>
                </form>

                {/* Log In Link */}
                <p className="mt-6 text-center text-sm text-black">
                Already have an account?{" "}
                <a href="/login" className="text-blue-600 hover:underline font-medium">
                    Log in
                </a>
                </p>
            </div>
        </div>
    );
}

export default Register;