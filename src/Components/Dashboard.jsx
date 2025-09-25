import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaChartBar,
  FaBell,
  FaSignOutAlt,
  FaSearch,
  FaChartLine,
  FaFire,
  FaCog,
  FaBars,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { Users, DollarSign, Package, AlertCircle } from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [data, setData] = useState([]);
  const [topItems, setTopItems] = useState([]);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);
  const [financeData, setFinanceData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const monthMap = {
    January: "01",
    February: "02",
    March: "03",
    April: "04",
    May: "05",
    June: "06",
    July: "07",
    August: "08",
    September: "09",
    October: "10",
    November: "11",
    December: "12",
  };
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const [timeInClicked, setTimeInClicked] = useState(false);
  const [timeOutClicked, setTimeOutClicked] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("success");

  const handleTimeIn = async () => {
    setTimeInClicked(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/${userId}/attendance`
      );
      const userAttendance = Array.isArray(res.data) ? res.data[0] : res.data;

      setAlertMessage(
        `Time In recorded: ${userAttendance.timeIn} (${userAttendance.status})`
      );

      setAttendance((prev) =>
        prev.map((emp) =>
          emp.id === user.id
            ? {
                ...emp,
                timeIn: userAttendance.timeIn,
                attendanceStatus: userAttendance.attendanceStatus, 
              }
            : emp
        )
      );

      setTimeout(() => setAlertMessage(""), 3000);
      setAlertType("success");
    } catch (err) {
      setAlertMessage(
        err.response?.data?.message || "Failed to record Time In"
      );
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    } finally {
      setTimeInClicked(false);
    }
  };

  const handleTimeOut = async () => {
    setTimeOutClicked(true);
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/${userId}/timeout`
      );
      const userAttendance = Array.isArray(res.data) ? res.data[0] : res.data;

      setAttendance((prev) =>
        prev.map((emp) =>
          emp.id === user.id ? { ...emp, timeOut: userAttendance.timeOut } : emp
        )
      );

      setTimeout(() => setAlertMessage(""), 3000);
      setAlertMessage(`Time Out: ${userAttendance.timeOut}`);
      setAlertType("success");
    } catch (err) {
      setAlertMessage(
        err.response?.data?.message || "Failed to record Time Out"
      );
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    } finally {
      setTimeOutClicked(false);
    }
  };

  useEffect(() => {
    axios
      .get("https://tasty-masks-serve.loca.lt/Sales-Overview")
      .then((res) => {
        console.log("API Data:", res.data);

        const sold = Number(res.data?.sold_items ?? 0);
        const remaining = Number(res.data?.remaining_items ?? 0);

        setData([
          { name: "Sold Items", value: sold },
          { name: "Remaining Items", value: remaining },
        ]);
      })
      .catch((err) => {
        console.error("Error fetching sales overview:", err);
      });
  }, []);

  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const res = await axios.get("https://tasty-masks-serve.loca.lt/");
        const formatted = res.data.map((entry) => ({
          name: entry.item.itemName,
          value: parseFloat(entry.item.percentage),
        }));
        setTopItems(formatted);
      } catch (error) {
        console.error("Error fetching top sold items:", error);
      }
    };

    fetchTopItems();
  }, []);

  useEffect(() => {
    const fetchTotalOrders = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders");
        setTotalOrders(res.data.length);
      } catch (err) {
        console.error("Error fetching total orders:", err);
      }
    };

    fetchTotalOrders();

    const interval = setInterval(fetchTotalOrders, 5000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/orders");

        const revenue = res.data.reduce(
          (sum, order) => sum + order.total_price,
          0
        );
        setTotalRevenue(revenue);
      } catch (err) {
        console.error("Error fetching total revenue:", err);
      }
    };

    fetchRevenue();

    const interval = setInterval(fetchRevenue, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/items");
        setTotalProducts(res.data.length);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    fetchProducts();

    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchOutOfStock = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/items");
        const outOfStockCount = res.data.filter(
          (item) => item.quantity === 0
        ).length;
        setOutOfStock(outOfStockCount);
      } catch (err) {
        console.error("Error fetching out-of-stock items:", err);
      }
    };

    fetchOutOfStock();

    const interval = setInterval(fetchOutOfStock, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetch("https://tasty-masks-serve.loca.lt/profitexpenses")
      .then((res) => res.json())
      .then((data) => {
        const combinedData = data.months.map((month, index) => ({
          month: `2025-${monthMap[month]}`,
          label: month,
          profit: data.profit[index],
          expense: data.expenses[index],
        }));

        setFinanceData(combinedData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  const filteredData = selectedMonth
    ? financeData.filter((item) => item.month <= selectedMonth)
    : financeData;

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

      <main className="flex-1 bg-gray-100 text-black overflow-y-auto md:ml-0">
        <header className="h-16 bg-black text-white px-4 md:px-10 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Dashboard</h1>

          <div className="flex space-x-4">
            <button
              onClick={handleTimeIn}
              disabled={timeInClicked}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white transition disabled:opacity-50"
            >
              Time In
            </button>

            <button
              onClick={handleTimeOut}
              disabled={timeOutClicked}
              className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white transition disabled:opacity-50"
            >
              Time Out
            </button>

            {alertMessage && (
              <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div
                  className={`p-4 rounded shadow-lg pointer-events-auto text-xl ${
                    alertType === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {alertMessage}
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Dashboard Stats Cards */}
        <div className="p-4 md:p-6 lg:p-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
              <Package className="text-blue-500 flex-shrink-0" size={36} />
              <div className="flex flex-col justify-between h-full min-w-0">
                <p className="text-sm text-gray-600 font-semibold">
                  Total Orders
                </p>
                <p className="text-2xl font-bold text-black">{totalOrders}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
              <DollarSign className="text-green-500 flex-shrink-0" size={36} />
              <div className="flex flex-col justify-between h-full min-w-0">
                <p className="text-sm text-gray-600 font-semibold">
                  Total Revenue
                </p>
                <p className="text-2xl font-bold text-black">
                  ₱{totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
              <Package className="text-purple-500 flex-shrink-0" size={36} />
              <div className="flex flex-col justify-between h-full min-w-0">
                <p className="text-sm text-gray-600 font-semibold">
                  Total Products
                </p>
                <p className="text-2xl font-bold text-black">{totalProducts}</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-4 flex items-center gap-4">
              <AlertCircle className="text-red-500 flex-shrink-0" size={36} />
              <div className="flex flex-col justify-between h-full min-w-0">
                <p className="text-sm text-gray-600 font-semibold">
                  Out of Stock
                </p>
                <p className="text-2xl font-bold text-black">{outOfStock}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="px-4 md:px-6 lg:px-10 pb-6 lg:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Overview Pie Chart */}
            <div className="bg-white p-6 rounded-xl shadow-lg text-black">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <FaChartLine className="text-gray-700" />
                Sales Overview
              </h2>
              <div className="flex justify-center">
                {data.length > 0 ? (
                  <div className="w-full max-w-sm">
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <defs>
                          <linearGradient
                            id="gradient-0"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#ff0000" />
                            <stop offset="100%" stopColor="#ffa500" />
                          </linearGradient>
                          <linearGradient
                            id="gradient-1"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#ff4500" />
                            <stop offset="100%" stopColor="#ffd700" />
                          </linearGradient>
                        </defs>

                        <Pie
                          data={data}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          dataKey="value"
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {data.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={
                                entry.name === "Sold Items"
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
                            color: "#000",
                          }}
                          itemStyle={{ color: "#000" }}
                          labelStyle={{ color: "#000" }}
                        />
                        <Legend
                          content={({ payload }) => (
                            <ul
                              style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexWrap: "wrap",
                                gap: "10px",
                                justifyContent: "center",
                              }}
                            >
                              {payload.map((entry, index) => {
                                const fill =
                                  entry.value === "Sold Items"
                                    ? "#e0e0e0"
                                    : `url(#gradient-0)`;

                                return (
                                  <li
                                    key={`legend-${index}`}
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "6px",
                                    }}
                                  >
                                    <svg width="14" height="14">
                                      <rect
                                        width="14"
                                        height="14"
                                        fill={fill}
                                      />
                                    </svg>
                                    <span
                                      style={{
                                        color: "#000",
                                        fontSize: "12px",
                                      }}
                                    >
                                      {entry.value}
                                    </span>
                                  </li>
                                );
                              })}
                            </ul>
                          )}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <p>Loading sales data...</p>
                )}
              </div>
            </div>

            {/* Top 5 Sold Items */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <FaFire className="text-orange-500" />
                Top 5 Sold Items
              </h2>
              {topItems.length > 0 ? (
                <div className="space-y-4">
                  {topItems.map((item, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-black truncate pr-2">
                          {item.name}
                        </span>
                        <span className="text-sm text-gray-500 flex-shrink-0">
                          {item.value}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                          className="h-2.5 rounded-full transition-all duration-300"
                          style={{
                            width: `${item.value}%`,
                            backgroundImage:
                              "linear-gradient(to right, #ff0000, #ffa500)",
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Loading top items...</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-4 md:px-6 lg:px-10 pb-6 lg:pb-10">
          <div className="bg-white p-6 rounded-xl shadow-lg text-black">
            {/* Title with month picker on the right */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FaChartLine className="text-blue-600" />
                Expense vs Profit
              </h2>

              {/* Month Picker */}
              <div className="flex items-center gap-2">
                <label htmlFor="monthPicker" className="font-medium">
                  Select Month:
                </label>
                <input
                  type="month"
                  id="monthPicker"
                  className="border border-gray-300 rounded px-2 py-1"
                  onChange={(e) => setSelectedMonth(e.target.value)}
                />
              </div>
            </div>

            {/* Chart container with gradient background */}
            <div className="w-full h-64 md:h-80 bg-gradient-to-r from-green-100 via-white to-red-100 rounded-md p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={filteredData}>
                  <XAxis
                    dataKey="label"
                    stroke="#000"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="#000" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #ccc",
                      color: "#000",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#000" }}
                    labelStyle={{ color: "#000" }}
                  />
                  <Legend wrapperStyle={{ color: "#000" }} />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#28a745"
                    strokeWidth={3}
                    dot={{ fill: "#28a745", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#28a745", strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="#dc3545"
                    strokeWidth={3}
                    dot={{ fill: "#dc3545", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: "#dc3545", strokeWidth: 2 }}
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
