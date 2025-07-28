import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
  FaSearch,
  FaCog,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUser
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); 

  const formattedDate = selectedDate
  ? new Date(selectedDate).toLocaleDateString("en-US")
  : "All Dates";


  const orders = [
    {
      orderNo: "1",
      item: "Hammer",
      customer: "Alex Reyes",
      quantity: 2,
      price: "₱350",
      address: "Toril, Davao City",
      payment: "Gcash",
      date: "2025-07-25",
      status: "Pending",
    },
    {
      orderNo: "2",
      item: "Screwdriver Set",
      customer: "Jenna Cruz",
      quantity: 1,
      price: "₱600",
      address: "Astorga, Davao Del Sur",
      payment: "Credit Card",
      date: "2025-07-19",
      status: "Delivered",
    },
    {
      orderNo: "3",
      item: "Cordless Drill",
      customer: "Leo Tan",
      quantity: 1,
      price: "₱3,500",
      address: "Davao City",
      payment: "Cash on Delivery",
      date: "2025-07-18",
      status: "Delivered",
    },
    {
      orderNo: "4",
      item: "Adjustable Wrench",
      customer: "Shayee",
      quantity: 3,
      price: "₱750",
      address: "Davao City",
      payment: "PayPal",
      date: "2025-07-18",
      status: "Cancelled",
    },
    {
      orderNo: "5",
      item: "Circular Saw",
      customer: "Ronald Cruz",
      quantity: 1,
      price: "₱6,000",
      address: "Bangkerohan, Davao City",
      payment: "Bank Transfer",
      date: "2025-07-17",
      status: "Delivered",
    },
    {
      orderNo: "6",
      item: "Tape Measure",
      customer: "Sara Lim",
      quantity: 4,
      price: "₱150",
      address: "Matina, Davao City",
      payment: "Gcash",
      date: "2025-07-21",
      status: "Pending",
    },
    {
      orderNo: "7",
      item: "Chisel Set",
      customer: "Benny Uy",
      quantity: 2,
      price: "₱950",
      address: "Carson, Toril, Davao City",
      payment: "Credit Card",
      date: "2025-07-20",
      status: "Delivered",
    },
    {
      orderNo: "8",
      item: "Handsaw",
      customer: "Aira Santos",
      quantity: 1,
      price: "₱500",
      address: "Marapangi, Toril, Davao City",
      payment: "Gcash",
      date: "2025-07-19",
      status: "Cancelled",
    },
    {
      orderNo: "9",
      item: "Ladder (6ft)",
      customer: "Jake Fernandez",
      quantity: 1,
      price: "₱2,200",
      address: "Bolton, Davao City",
      payment: "Cash on Delivery",
      date: "2025-07-22",
      status: "Pending",
    },
    {
      orderNo: "10",
      item: "Electric Sander",
      customer: "Nina Gutierrez",
      quantity: 2,
      price: "₱3,800",
      address: "Matina, Davao City",
      payment: "Credit Card",
      date: "2025-07-18",
      status: "Delivered",
    },
  ];

 const filteredOrders = orders.filter((order) => {
    const matchStatus = selectedStatus === "All" || order.status === selectedStatus;
    
    const matchDate = selectedDate === "" || order.date === selectedDate;

    const matchSearch =
      searchQuery === "" ||
      order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.address.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchDate && matchSearch;
  });

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/employees/logout");
      localStorage.removeItem("user");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
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
            <Link
              to="/dashboard"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link
              to="/inventory"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
              <FaBox /> Inventory
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
              <FaClipboardList /> Orders
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
              <FaBell /> Notifications
            </Link>
            <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
              <FaUser /> Profile Management
            </a>
            <a
              href="#"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
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
        {/* Header */}
        <header className="h-16 bg-black text-white px-10 flex items-center justify-between">
            <h1 className="text-lg">Order History</h1>
            <div></div>
            <div className="flex items-center gap-2">
            <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onKeyDown={(e) => {
                if (e.key === "Enter") {
                    handleSearch();
                }
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
                onClick={handleSearch}
                className="bg-white text-black p-2 px-4 rounded-md hover:bg-gray-200"
            >
                <FaSearch />
            </button>
            </div>
        </header>

        {/* Filter Dropdown and Date Picker */}
            <div className="flex justify-end px-10 py-4 gap-4">
                {/* Filter Dropdown */}
                <div className="relative inline-block">
                <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="border border-white text-white bg-transparent px-4 py-2 pr-10 rounded-full hover:bg-white hover:text-black transition cursor-pointer appearance-none w-full"
                >
                    <option value="All" className="text-black">All</option>
                    <option value="Delivered" className="text-black">Delivered</option>
                    <option value="Pending" className="text-black">Pending</option>
                    <option value="Cancelled" className="text-black">Cancelled</option>
                </select>
                <div className="pointer-events-none absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-sm">
                    ▼
                </div>
                </div>

                {/* Date Picker */}
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
                <input
                    id="real-date-input"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="absolute top-0 left-0 opacity-0 pointer-events-none"
                />
                </div>
            </div> 
            <div className="px-4 py-6">
              <div className="overflow-x-auto rounded-lg shadow">
                <div className="min-w-full">
                  {/* Header */}
                  <div className="grid grid-cols-9 bg-gray-900 text-white font-bold text-sm uppercase tracking-wide rounded-t-lg">
                    <div className="p-3 text-center">Order No.</div>
                    <div className="p-3 text-center">Item Name</div>
                    <div className="p-3 text-center">Name of Customer</div>
                    <div className="p-3 text-center">Quantity</div>
                    <div className="p-3 text-center">Price</div>
                    <div className="p-3 text-center">Address</div>
                    <div className="p-3 text-center">Payment</div>
                    <div className="p-3 text-center">Date</div>
                    <div className="p-3 text-center">Status</div>
                  </div>

                  {/* Data rows */}
                  {filteredOrders.map((order, index) => (
                    <div
                      key={index}
                      className={`grid grid-cols-9 items-center text-sm transition duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } hover:bg-gray-800 hover:text-white`}
                    >
                      <div className="p-3 text-center">{order.orderNo}</div>
                      <div className="p-3 text-center truncate">{order.item}</div>
                      <div className="p-3 text-center truncate">{order.customer}</div>
                      <div className="p-3 text-center">{order.quantity}</div>
                      <div className="p-3 text-center">{order.price}</div>
                      <div className="p-3 text-center truncate">{order.address}</div>
                      <div className="p-3 text-center">{order.payment}</div>
                      <div className="p-3 text-center">{order.date}</div>
                      <div className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full font-medium text-xs
                            ${order.status.toLowerCase() === "cancelled" ? "bg-red-500 text-white" : ""}
                            ${order.status.toLowerCase() === "pending" ? "bg-yellow-300 text-black" : ""}
                            ${order.status.toLowerCase() === "delivered" ? "bg-green-500 text-white" : ""}
                            ${order.status.toLowerCase() === "shipped" ? "bg-blue-500 text-white" : ""}
                          `}
                        >
                          {order.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
        </main>
    </div>
  );
}

export default Orders;
