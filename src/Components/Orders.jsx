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
  FaUser,
} from "react-icons/fa";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Orders() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [orders, setOrders] = useState([]);
  const [orderCount, setOrderCount] = useState(0);
  const today = new Date().toISOString().split("T")[0];
  const latestOrderIdRef = useRef(0);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US")
    : "All Dates";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders");

        const filtered = res.data.filter((order) => {
          const orderDate = order.order_date.split("T")[0];
          return selectedDate
            ? orderDate === selectedDate
            : orderDate === today;
        });

        const transformed = filtered.map((order) => ({
          orderNo: order.orderId,
          item: order.item?.itemName || "N/A",
          customer: order.customer_name,
          quantity: order.quantity,
          price: `₱${order.total_price}`,
          address: order.address,
          payment: order.payment_type,
          date: order.order_date,
          status: order.status || "Pending",
        }));

        const newOrders = transformed.filter(
          (order) => order.orderNo > latestOrderIdRef.current
        );
        if (newOrders.length > 0) {
          setOrderCount((prev) => prev + newOrders.length);
          latestOrderIdRef.current = Math.max(
            ...transformed.map((o) => o.orderNo)
          );
        }

        setOrders(transformed);
      } catch (err) {
        console.error(err);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const filteredOrders = orders.filter((order) => {
    const matchesStatus =
      selectedStatus === "All" || order.status === selectedStatus;
    const matchesSearch =
      searchQuery === "" ||
      order.item.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = selectedDate === "" || order.date === selectedDate;

    return matchesStatus && matchesSearch && matchesDate;
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
              <FaClipboardList /> Orders ({orderCount})
            </Link>
            <Link
              to="/notifications"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
              <FaBell /> Notifications
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded"
            >
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
              <option value="All" className="text-black">
                All
              </option>
              <option value="Delivered" className="text-black">
                Delivered
              </option>
              <option value="Pending" className="text-black">
                Pending
              </option>
              <option value="Cancelled" className="text-black">
                Cancelled
              </option>
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
                  <div className="p-3 text-center truncate">
                    {order.customer}
                  </div>
                  <div className="p-3 text-center">{order.quantity}</div>
                  <div className="p-3 text-center">{order.price}</div>
                  <div className="p-3 text-center truncate">
                    {order.address}
                  </div>
                  <div className="p-3 text-center">{order.payment}</div>
                  <div className="p-3 text-center">{order.date}</div>
                  <div className="p-3 text-center">
                    <span
                      className={`px-3 py-1 rounded-full font-medium text-xs
                            ${
                              order.status.toLowerCase() === "cancelled"
                                ? "bg-red-500 text-white"
                                : ""
                            }
                            ${
                              order.status.toLowerCase() === "pending"
                                ? "bg-yellow-300 text-black"
                                : ""
                            }
                            ${
                              order.status.toLowerCase() === "delivered"
                                ? "bg-green-500 text-white"
                                : ""
                            }
                            ${
                              order.status.toLowerCase() === "shipped"
                                ? "bg-blue-500 text-white"
                                : ""
                            }
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
