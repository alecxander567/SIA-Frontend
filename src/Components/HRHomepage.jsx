import { Users, Clock, XCircle, Hourglass } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useState, useEffect } from "react";
import axios from "axios";

function Homepage() {
  const [days, setDays] = useState([]);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState(0);
  const [hrName, setHrName] = useState({ firstName: "", lastName: "" });
  const [attendance, setAttendance] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");

  const [stats, setStats] = useState([
    { label: "Total Users", value: 0, icon: Users, color: "text-blue-500" },
    { label: "On Time", value: 0, icon: Clock, color: "text-green-500" },
    { label: "Late", value: 0, icon: Hourglass, color: "text-yellow-500" },
    { label: "Absent", value: 0, icon: XCircle, color: "text-red-500" },
  ]);

  // Dummy weekly attendance chart
  const attendanceData = [
    { day: "Mon", Present: 80, Absent: 10 },
    { day: "Tue", Present: 75, Absent: 15 },
    { day: "Wed", Present: 90, Absent: 5 },
    { day: "Thu", Present: 85, Absent: 10 },
    { day: "Fri", Present: 70, Absent: 20 },
  ];

  // Generate calendar
  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const tempDays = [];
    for (let i = 0; i < firstDay; i++) tempDays.push(null);
    for (let i = 1; i <= lastDate; i++) tempDays.push(i);

    setDays(tempDays);
    setMonth(today.toLocaleString("default", { month: "long" }));
    setYear(currentYear);
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users");
        const users = res.data;

        const totalUsers = users.length;
        const onTime = users.filter(
          (u) => u.attendanceStatus === "ON_TIME"
        ).length;
        const late = users.filter((u) => u.attendanceStatus === "LATE").length;
        const absent = users.filter((u) => !u.attendanceStatus).length;

        setStats([
          {
            label: "Total Users",
            value: totalUsers,
            icon: Users,
            color: "text-blue-500",
          },
          {
            label: "On Time",
            value: onTime,
            icon: Clock,
            color: "text-green-500",
          },
          {
            label: "Late",
            value: late,
            icon: Hourglass,
            color: "text-yellow-500",
          },
          {
            label: "Absent",
            value: absent,
            icon: XCircle,
            color: "text-red-500",
          },
        ]);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
    const interval = setInterval(fetchUsers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/users");
        setAttendance(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchAttendance();
  }, []);

  const handleTimeIn = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/${user.id}/attendance`
      );

      const userAttendance = Array.isArray(res.data) ? res.data[0] : res.data;

      setAlertMessage(
        `Time In recorded: ${userAttendance.timeIn} (${userAttendance.attendanceStatus})`
      );
      setAlertType("success");

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
    } catch (err) {
      setAlertMessage(err.response?.data?.message || "Error recording Time In");
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleTimeOut = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/${user.id}/timeout`
      );

      const userAttendance = Array.isArray(res.data) ? res.data[0] : res.data;

      setAlertMessage(`Time Out recorded: ${userAttendance.timeOut}`);
      setAlertType("success");

      setAttendance((prev) =>
        prev.map((emp) =>
          emp.id === user.id ? { ...emp, timeOut: userAttendance.timeOut } : emp
        )
      );

      setTimeout(() => setAlertMessage(""), 3000);
    } catch (err) {
      setAlertMessage(
        err.response?.data?.message || "Error recording Time Out"
      );
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      {/* Navbar */}
      <div className="flex items-center justify-between bg-white shadow rounded-2xl px-6 py-4">
        <div>
          <p className="text-gray-700 text-sm">
            Welcome, {hrName.firstName} {hrName.lastName}
          </p>
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTimeIn}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white transition"
          >
            Time In
          </button>

          <button
            onClick={handleTimeOut}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white transition"
          >
            Time Out
          </button>

          {alertMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div
                className={`p-4 rounded shadow-lg pointer-events-auto text-lg ${
                  alertType === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {alertMessage}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "http://localhost:5173";
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-white shadow-lg rounded-xl transition-transform hover:scale-105"
              >
                <Icon className={`w-12 h-12 ${stat.color}`} />
                <div>
                  <p className="text-gray-500 text-base font-medium">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar */}
        <div className="p-5 bg-white shadow-lg rounded-2xl">
          <h2 className="text-lg font-semibold mb-2">
            {month} {year}
          </h2>
          <div className="grid grid-cols-7 gap-2 mb-2 text-gray-500 font-medium text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className="text-center">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {days.map((day, index) => (
              <div
                key={index}
                className={`p-3 text-center rounded-lg cursor-pointer transition ${
                  day ? "bg-blue-50 text-blue-700 hover:bg-blue-200" : ""
                }`}
              >
                {day || ""}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance Bar Chart */}
      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4">Weekly Attendance</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={attendanceData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="Present" fill="#34D399" />
            <Bar dataKey="Absent" fill="#F87171" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Employee Table */}
      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Employee List</h2>
          <input
            type="date"
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse rounded-lg mt-4">
            <thead className="bg-black">
              <tr>
                {["ID", "Name", "Department", "Status"].map((header) => (
                  <th
                    key={header}
                    className="text-left p-3 text-white uppercase text-sm"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {attendance.map((emp, idx) => {
                let statusBg = "";
                let statusText = "text-white";

                const status = emp.attendanceStatus || "ABSENT";

                switch (status) {
                  case "ON_TIME":
                    statusBg = "bg-green-500";
                    break;
                  case "LATE":
                    statusBg = "bg-yellow-400";
                    statusText = "text-black";
                    break;
                  case "ABSENT":
                    statusBg = "bg-red-500";
                    break;
                  default:
                    statusBg = "bg-gray-200";
                    statusText = "text-gray-800";
                }

                return (
                  <tr
                    key={emp.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-gray-100 transition`}
                  >
                    <td className="p-3">{idx + 1}</td> {/* Sequential number */}
                    <td className="p-3 font-medium">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="p-3">{emp.position}</td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 text-sm font-semibold ${statusBg} ${statusText} rounded-full`}
                      >
                        {status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
