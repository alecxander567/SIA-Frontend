import { FaTachometerAlt, FaBox, FaClipboardList, FaChartBar, FaBell, FaSignOutAlt, FaSearch, FaChartLine, FaFire, FaCog,  FaBars, FaTimes, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Link } from 'react-router-dom';

function ProfileManagement() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState("");

    const formattedDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "Select Date";

    const handleLogout = async () => {
        try {
            await axios.post("http://localhost:8080/api/employees/logout");
            localStorage.removeItem("user");
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return(
        <div className="flex h-screen bg-gray-900 text-white">
            <button
                className="md:hidden fixed top-4 left-4 z-50 text-white bg-black p-2 rounded"
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <FaTimes /> : <FaBars />}
            </button>

            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-black p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-40 ${
                isOpen ? "translate-x-0" : "-translate-x-full"
                } md:translate-x-0 md:static md:flex`}
            >
                <div>
                <div className="mb-4">
                    <img
                    src="/logo.jpg"
                    alt="Logo"
                    className="w-16 h-16 rounded-full object-cover mx-auto"
                    />
                </div>
                <h2 className="text-2xl font-bold text-center mb-6 text-white">
                    N-Tech Hardware
                </h2>

                <nav  className="space-y-4 text-white">
                    <Link to="/dashboard" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                        <FaTachometerAlt /> Dashboard
                    </Link>
                    <Link to="/inventory" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                        <FaBox /> Inventory
                    </Link>
                    <Link to="/orders" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                        <FaClipboardList /> Orders
                    </Link>
                    <Link to="/notifications" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                        <FaBell /> Notifications
                    </Link>
                    <Link to="/profile" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                        <FaUser /> Profile Management
                    </Link>
                </nav>
                </div>

                <div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded text-white"
                >
                    <FaSignOutAlt /> Logout
                </button>
                </div>
            </aside>

           <main className="flex-1 bg-gray-500 text-black overflow-y-auto">
                <header className="h-16 bg-black text-white px-10 flex items-center justify-between">
                    <h1 className="text-lg font-semibold">Profile Management</h1>
                    <div></div>
                    <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="bg-white text-black p-2 px-4 rounded-md hover:bg-gray-200">
                        <FaSearch />
                    </button>
                    </div>
                </header>

                {/* Table Section */}
                <section className="p-6">

                    <div className="px-10 py-4 flex justify-end">
                        <div className="relative">
                            <button
                            className="flex items-center gap-2 border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
                            onClick={() => {
                                const input = document.getElementById("real-date-input");
                                if (input) input.showPicker?.(); 
                                input?.focus();
                            }}
                            >
                            <FaCalendarAlt />
                            {formattedDate}
                            </button>

                            {/* Hidden native input */}
                            <input
                            id="real-date-input"
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="absolute top-0 left-0 opacity-0 pointer-events-none"
                            />
                        </div>
                    </div>

                    {/* Legend */}
                    <div className="mt-[-1rem] mb-4 border border-white rounded-lg p-3 inline-flex items-center gap-6 bg-gray-600 shadow-md w-auto">
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-green-500 inline-block border border-white"></span>
                        <span className="text-sm text-white">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-yellow-400 inline-block border border-white"></span>
                        <span className="text-sm text-white">Late</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-4 w-4 rounded-full bg-red-500 inline-block border border-white"></span>
                        <span className="text-sm text-white">Absent</span>
                    </div>
                    </div>

                    <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
                    <table className="min-w-full table-fixed border border-gray-300 bg-gray-100">
                        <thead className="bg-gray-800 text-white">
                            <tr>
                            <th className="w-16 px-4 py-3 border-b text-left font-bold" rowSpan={2}>#</th>
                            <th className="px-6 py-3 border-b text-left font-bold" rowSpan={2}>Employee Name</th>
                            <th className="px-6 py-3 border-b text-left font-bold" rowSpan={2}>Employee Position</th>
                            <th className="px-6 py-3 border-b text-center font-bold" colSpan={5}>Attendance Status</th>
                            </tr>
                            <tr>
                            {["Mon", "Tue", "Wed", "Thu", "Fri"].map((day, index) => (
                                <th key={index} className="px-2 py-2 border-b text-center text-xs font-semibold">{day}</th>
                            ))}
                            </tr>
                        </thead>
                            <tbody>
                                {[
                                { name: "John Doe", position: "Staff", status: ["green", "green", "green", "green", "green"] },
                                { name: "Jane Smith", position: "Rider", status: ["green", "gray", "green", "gray", "green"] },
                                { name: "Alex Garcia", position: "Maintenance", status: ["yellow", "green", "green", "gray", "green"] },
                                { name: "Maria Lopez", position: "Cashier", status: ["green", "green", "green", "green", "gray"] },
                                { name: "Chris Reyes", position: "Staff", status: ["green", "green", "gray", "gray", "gray"] },
                                { name: "Lara Santos", position: "Rider", status: ["green", "green", "green", "green", "green"] },
                                { name: "Marco Tan", position: "Maintenance", status: ["gray", "green", "green", "yellow", "green"] },
                                { name: "Ella Cruz", position: "Cashier", status: ["green", "gray", "green", "green", "green"] },
                                { name: "Dino Rivas", position: "Staff", status: ["green", "green", "gray", "green", "green"] },
                                { name: "Nina Valdez", position: "Rider", status: ["yellow", "gray", "green", "green", "green"] },
                                ].map((employee, index) => (
                                <tr
                                    key={index}
                                    className={`border-t transition-colors duration-200 hover:bg-gray-400 ${index % 2 !== 0 ? "bg-gray-200" : "bg-white"}`}
                                >
                                    <td className="px-4 py-3 border-b">{index + 1}</td>
                                    <td className="px-6 py-3 border-b">{employee.name}</td>
                                    <td className="px-6 py-3 border-b">{employee.position}</td>
                                    {employee.status.map((color, i) => (
                                    <td key={i} className="px-2 py-3 border-b text-center">
                                        <span
                                        className={`h-4 w-4 inline-block rounded-full ${
                                            {
                                            green: "bg-green-500",
                                            gray: "bg-red-500",
                                            yellow: "bg-yellow-400",
                                            }[color]
                                        }`}
                                        title={["Mon", "Tue", "Wed", "Thu", "Fri"][i]}
                                        ></span>
                                    </td>
                                    ))}
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ProfileManagement;