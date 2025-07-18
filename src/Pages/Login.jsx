import { FaLock, FaEnvelope, FaArrowLeft, FaEye, FaEyeSlash } from "react-icons/fa";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState(false); 
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

     const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        const res = await axios.post("http://localhost:8080/api/employees/login", formData);
        if (res.status === 200) {
            navigate("/dashboard");
        }
        } catch (err) {
        setErrorMessage(err.response?.data?.message || "Login failed");
        }
    };

    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-200 px-4">
      <div className="bg-white/30 backdrop-blur-md border border-white/40 p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-black flex items-center gap-2">
          <FaLock className="text-black" />
          Log In
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <a
            href="/"
            className="absolute top-6 right-6 p-2 border border-black rounded-full hover:bg-black hover:text-white transition"
            aria-label="Back to Landing Page"
          >
            <FaArrowLeft className="text-black" />
          </a>

          <div>
            <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
              <FaEnvelope className="text-black" />
              Email
            </label>
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black placeholder-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
              placeholder="example@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-black flex items-center gap-2">
              <FaLock className="text-black" />
              Password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"} // 👁️ toggle type
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md bg-white/60 backdrop-blur-sm text-black placeholder-gray-700 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="8-16 characters"
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

          {errorMessage && (
            <p className="text-red-600 text-sm text-center">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full bg-black text-white py-2 rounded-full hover:bg-gray-800 transition"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-black">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
    );
}

export default Login;
