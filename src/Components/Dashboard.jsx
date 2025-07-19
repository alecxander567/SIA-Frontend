import { FaTachometerAlt, FaBox, FaClipboardList, FaChartBar, FaBell, FaSignOutAlt, FaSearch, FaChartLine, FaFire, FaCog,  FaBars, FaTimes } from "react-icons/fa";
import { Users, DollarSign, Package, AlertCircle } from "lucide-react";
import { PieChart, Pie, Cell, Tooltip, Legend, LineChart, Line,XAxis,YAxis, ResponsiveContainer} from 'recharts';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";

function Dashboard() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const data = [
        { name: 'Sold Items', value: 320 },
        { name: 'Remaining Items', value: 80 },
    ];

    const topItems = [
        { name: 'Item A', value: 90 },
        { name: 'Item B', value: 85 },
        { name: 'Item C', value: 80 },
        { name: 'Item D', value: 75 },
        { name: 'Item E', value: 70 },
    ];

    const lineData = [
        { month: 'Jan', profit: 12000, expense: 8000 },
        { month: 'Feb', profit: 15000, expense: 9500 },
        { month: 'Mar', profit: 14000, expense: 9000 },
        { month: 'Apr', profit: 17000, expense: 11000 },
        { month: 'May', profit: 16000, expense: 10500 },
        { month: 'Jun', profit: 18000, expense: 11500 },
        { month: 'Jul', profit: 19000, expense: 12000 },
        { month: 'Aug', profit: 20000, expense: 13000 },
        { month: 'Sep', profit: 18500, expense: 12500 },
        { month: 'Oct', profit: 19500, expense: 12800 },
        { month: 'Nov', profit: 21000, expense: 13500 },
        { month: 'Dec', profit: 22000, expense: 14000 },
    ];

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

                <nav className="space-y-4 text-white">
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                    <FaTachometerAlt /> Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                    <FaBox /> Inventory
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                    <FaClipboardList /> Orders
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                    <FaChartBar /> Reports
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                    <FaBell /> Notifications
                    </a>
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                    <FaCog /> Settings
                    </a>
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

                <div className="p-10">
                    <div className="flex flex-wrap justify-center gap-6">
                        <div className="w-52 h-20 bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <Users className="text-blue-500" size={36} />
                            <div className="flex flex-col justify-between h-full">
                            <p className="text-sm text-black font-semibold">Total Customers</p>
                            <p className="text-2xl font-bold text-black">1,250</p>
                            </div>
                        </div>
                        <div className="w-52 h-20 bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <DollarSign className="text-green-500" size={36} />
                            <div className="flex flex-col justify-between h-full">
                            <p className="text-sm text-black font-semibold">Total Revenue</p>
                            <p className="text-2xl font-bold text-black">₱254,000</p>
                            </div>
                        </div>
                        <div className="w-52 h-20 bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <Package className="text-purple-500" size={36} />
                            <div className="flex flex-col justify-between h-full">
                            <p className="text-sm text-black font-semibold">Total Products</p>
                            <p className="text-2xl font-bold text-black">320</p>
                            </div>
                        </div>
                        <div className="w-52 h-20 bg-white rounded-lg shadow p-4 flex items-center gap-4">
                            <AlertCircle className="text-red-500" size={36} />
                            <div className="flex flex-col justify-between h-full">
                            <p className="text-sm text-black font-semibold">Out of Stock</p>
                            <p className="text-2xl font-bold text-black">8</p>
                            </div>
                        </div>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-6 px-10 pb-10">
                        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg text-black">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FaChartLine className="text-gray-700" />
                                Sales Overview
                            </h2>
                            <div className="flex justify-center">
                            <PieChart width={300} height={250}>
                                <defs>
                                <linearGradient id="gradient-0" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#ff0000" />
                                    <stop offset="100%" stopColor="#ffa500" />
                                </linearGradient>
                                <linearGradient id="gradient-1" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#ff4500" />
                                    <stop offset="100%" stopColor="#ffd700" />
                                </linearGradient>
                                <linearGradient id="gradient-2" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#e60000" />
                                    <stop offset="100%" stopColor="#ffb347" />
                                </linearGradient>
                                </defs>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={80}
                                    dataKey="value"
                                    label={({ name, percent, x, y }) => (
                                        <text
                                        x={x}
                                        y={y}
                                        fill="#000"
                                        textAnchor="middle"
                                        dominantBaseline="central"
                                        fontSize={12}
                                        >
                                        {`${name}: ${(percent * 100).toFixed(0)}%`}
                                        </text>
                                    )}
                                    labelLine={false}
                                    >
                                    {data.map((entry, index) => (
                                        <Cell
                                        key={`cell-${index}`}
                                        fill={
                                            entry.name === "Remaining Items"
                                            ? "#e0e0e0"
                                            : `url(#gradient-${index})`
                                        }
                                        />
                                    ))}
                                </Pie>

                                    <Tooltip
                                    contentStyle={{
                                        backgroundColor: "#fff",
                                        border: "1px solid #ccc",
                                        color: "#000"
                                    }}
                                    itemStyle={{ color: "#000" }}
                                    labelStyle={{ color: "#000" }}
                                />
                                <Legend
                                    wrapperStyle={{ color: "#000" }}
                                    formatter={(value) => <span style={{ color: "#000" }}>{value}</span>}
                                />
                            </PieChart>
                            </div>
                        </div>

                        {/* Top 10 Sold Items */}
                        <div className="w-full max-w-md bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                                <FaFire />
                                Top 5 Sold Items
                            </h2>
                        {topItems.map((item, index) => (
                            <div key={index} className="mb-4">
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-black">{item.name}</span>
                                <span className="text-sm text-gray-500">{item.value}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                className="h-2.5 rounded-full"
                                style={{
                                    width: `${item.value}%`,
                                    backgroundImage: 'linear-gradient(to right, #ff0000, #ffa500)',
                                }}
                                ></div>
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    <div className="w-full px-10 pb-10">
                    <div className="bg-white p-6 rounded-xl shadow-lg text-black">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <FaChartLine/>
                            Expense vs Profit
                        </h2>
                        
                        {/* Chart container with gradient background */}
                        <div className="w-full h-64 bg-gradient-to-r from-green-100 via-white to-red-100 rounded-md">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={lineData}>
                            <XAxis dataKey="month" stroke="#000" />
                            <YAxis stroke="#000" />
                            <Tooltip
                                contentStyle={{
                                backgroundColor: "#fff",
                                border: "1px solid #ccc",
                                color: "#000"
                                }}
                                itemStyle={{ color: "#000" }}
                                labelStyle={{ color: "#000" }}
                            />
                            <Legend wrapperStyle={{ color: "#000" }} />
                            <Line
                                type="monotone"
                                dataKey="profit"
                                stroke="#28a745"
                                strokeWidth={2}
                                dot={{ fill: "#28a745" }}
                            />
                            <Line
                                type="monotone"
                                dataKey="expense"
                                stroke="#dc3545"
                                strokeWidth={2}
                                dot={{ fill: "#dc3545" }}
                            />
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Dashboard;