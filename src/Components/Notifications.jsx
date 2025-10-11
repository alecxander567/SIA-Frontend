import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaCalendarAlt,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaDollarSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Notifications() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState("");
  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "All Date";

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/orders");
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  const visibleOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDate = !selectedDate || order.order_date === selectedDate;

    const matchesStatus = order.status === "Delivered";

    return matchesSearch && matchesDate && matchesStatus;
  });

  const deliveredCount = orders.filter(
    (order) =>
      order.status === "Delivered" &&
      (!selectedDate || order.order_date === selectedDate)
  ).length;

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/api/users/logout");
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
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-black p-6 flex flex-col justify-between transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static md:flex`}>
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
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
              <FaTachometerAlt /> Dashboard
            </Link>
            <Link
              to="/inventory"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
              <FaBox /> Inventory
            </Link>
            <Link
              to="/orders"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
              <FaClipboardList /> Orders
            </Link>
            <Link
              to="/notifications"
              className="flex items-center justify-between hover:bg-gray-700 px-3 py-2 rounded">
              <div className="flex items-center gap-3">
                <FaBell /> Notifications
              </div>
              {deliveredCount > 0 && (
                <span className="bg-red-500 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                  {deliveredCount}
                </span>
              )}
            </Link>
            <Link
              to="/profile"
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
              <FaUser /> Profile Management
            </Link>
          </nav>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded text-white">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 bg-gray-800 text-white overflow-y-auto min-h-screen">
        <header className="h-16 bg-black text-white px-10 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Notifications</h1>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
        </header>

        <div className="px-10 py-4 flex justify-end">
          <div className="relative">
            <button
              className="flex items-center gap-2 border border-white text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition"
              onClick={() => {
                const input = document.getElementById("real-date-input");
                if (input) input.showPicker?.();
                input?.focus();
              }}>
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

        <div className="px-8 py-6">
          <div className="bg-white rounded-lg divide-y divide-gray-200 shadow text-black">
            {visibleOrders.length > 0 ? (
              visibleOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="flex flex-col gap-3 px-6 py-4 border-b last:border-b-0 hover:bg-gray-50 transition shadow-sm rounded-lg">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <FaBox className="text-blue-500" />
                      <h2 className="font-semibold text-lg">
                        {order.orderName}
                      </h2>
                    </div>
                    <span
                      className={`flex items-center gap-1 font-semibold ${
                        order.status === "Delivered"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}>
                      {order.status === "Delivered" ? (
                        <FaCheckCircle className="text-green-600" />
                      ) : (
                        <FaTimesCircle className="text-red-600" />
                      )}
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-gray-600">
                    <FaUser className="text-purple-500" />
                    <span>{order.customer_name}</span>
                  </div>

                  <div className="flex items-center gap-6 text-gray-700 text-sm">
                    <span className="flex items-center gap-1">
                      <FaDollarSign className="text-green-500" /> $
                      {order.total_price}
                    </span>
                    <span className="flex items-center gap-1">
                      <FaBox className="text-yellow-500" /> Qty:{" "}
                      {order.quantity}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500">
                No delivered orders found.
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Notifications;
