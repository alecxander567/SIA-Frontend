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
  const user = JSON.parse(localStorage.getItem("user"));
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [todayDate, setTodayDate] = useState(null);
  const [attendanceDate, setAttendanceDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [employeesWithAttendance, setEmployeesWithAttendance] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);

  const [stats, setStats] = useState([
    { label: "Total Users", value: 0, icon: Users, color: "text-blue-500" },
    { label: "On Time", value: 0, icon: Clock, color: "text-green-500" },
    { label: "Late", value: 0, icon: Hourglass, color: "text-yellow-500" },
    { label: "Absent", value: 0, icon: XCircle, color: "text-red-500" },
  ]);

  const [selectedType, setSelectedType] = useState("OnTime");

  const gradientMap = {
    OnTime: "url(#onTimeGradient)",
    Late: "url(#lateGradient)",
    Absent: "url(#absentGradient)",
    Excused: "url(#excusedGradient)",
  };

  useEffect(() => {
    axios
      .get("https://sharp-candies-hang.loca.lt/attendance")
      .then((response) => {
        const rawData = response.data;
        const summary = {};

        rawData.forEach((user) => {
          const userName = user.name;

          if (!summary[userName]) {
            summary[userName] = {
              user: userName,
              fullName: userName,
              OnTime: 0,
              Late: 0,
              Absent: 0,
              Excused: 0,
            };
          }

          user.attendance.forEach((record) => {
            const status = record.status.toUpperCase();

            if (
              status === "ON TIME" ||
              status === "ONTIME" ||
              status === "ON_TIME"
            ) {
              summary[userName].OnTime += 1;
            } else if (status === "LATE") {
              summary[userName].Late += 1;
            } else if (status === "ABSENT") {
              summary[userName].Absent += 1;
            } else if (status === "EXCUSED") {
              summary[userName].Excused += 1;
            }
          });
        });

        setAttendanceData(Object.values(summary));
      })
      .catch((error) =>
        console.error("Error fetching attendance data:", error)
      );
  }, []);

  useEffect(() => {
    const fetchEmployeesWithAttendance = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/api/attendance?date=${attendanceDate}`
        );
        setEmployeesWithAttendance(res.data);

        const totalUsers = res.data.length;
        const onTime = res.data.filter(
          (u) => u.attendanceStatus === "ON_TIME"
        ).length;
        const late = res.data.filter(
          (u) => u.attendanceStatus === "LATE"
        ).length;
        const excused = res.data.filter(
          (u) => u.attendanceStatus === "EXCUSED"
        ).length;
        const absent = res.data.filter(
          (u) => u.attendanceStatus === "ABSENT"
        ).length;

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
        console.error("Error fetching attendance:", err);
        setAlertMessage("Error fetching attendance data");
        setAlertType("error");
        setTimeout(() => setAlertMessage(""), 3000);
      }
    };

    fetchEmployeesWithAttendance();
    const interval = setInterval(fetchEmployeesWithAttendance, 5000);
    return () => clearInterval(interval);
  }, [attendanceDate]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setHrName({
        firstName: storedUser.firstName,
        lastName: storedUser.lastName,
      });
    }
  }, []);

  useEffect(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const currentDate = today.getDate();

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();

    const tempDays = [];
    for (let i = 0; i < firstDay; i++) tempDays.push(null);
    for (let i = 1; i <= lastDate; i++) tempDays.push(i);

    setDays(tempDays);
    setMonth(today.toLocaleString("default", { month: "long" }));
    setYear(currentYear);
    setTodayDate(currentDate);
  }, []);

  const handleTimeIn = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/timein/${user.id}`
      );

      const { message, status, timeIn } = res.data;

      setAlertMessage(`${message} - Time: ${timeIn} (${status})`);
      setAlertType("success");
      setTimeout(() => setAlertMessage(""), 3000);

      const refreshRes = await axios.get(
        `http://localhost:8080/api/attendance?date=${attendanceDate}`
      );
      setEmployeesWithAttendance(refreshRes.data);
    } catch (err) {
      console.error("Time In Error:", err);
      setAlertMessage(
        err.response?.data?.message || "Failed to record Time In"
      );
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleTimeOut = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/timeout/${user.id}`
      );

      const { message, timeOut } = res.data;

      setAlertMessage(`${message} - Time: ${timeOut}`);
      setAlertType("success");
      setTimeout(() => setAlertMessage(""), 3000);

      const refreshRes = await axios.get(
        `http://localhost:8080/api/attendance?date=${attendanceDate}`
      );
      setEmployeesWithAttendance(refreshRes.data);
    } catch (err) {
      console.error("Time Out Error:", err);
      setAlertMessage(
        err.response?.data?.message || "Failed to record Time Out"
      );
      setAlertType("error");
      setTimeout(() => setAlertMessage(""), 3000);
    }
  };

  const handleExcuse = async (userId) => {
    try {
      const res = await axios.post(
        `http://localhost:8080/api/users/${userId}/excuse`
      );

      setAlertMessage(`Employee excused successfully`);
      setAlertType("success");
      setTimeout(() => setAlertMessage(""), 3000);

      const refreshRes = await axios.get(
        `http://localhost:8080/api/attendance?date=${attendanceDate}`
      );
      setEmployeesWithAttendance(refreshRes.data);
    } catch (err) {
      console.error("Error in handleExcuse:", err);
      setAlertMessage(err.response?.data?.message || "Error excusing employee");
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
            Welcome, {hrName?.firstName || ""} {hrName?.lastName || ""}
          </p>
          <h1 className="text-2xl font-bold">HR Dashboard</h1>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleTimeIn}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded text-white transition">
            Time In
          </button>

          <button
            onClick={handleTimeOut}
            className="bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white transition">
            Time Out
          </button>

          {alertMessage && (
            <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
              <div
                className={`p-4 rounded shadow-lg pointer-events-auto text-lg ${
                  alertType === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}>
                {alertMessage}
              </div>
            </div>
          )}

          <button
            onClick={() => {
              localStorage.removeItem("user");
              window.location.href = "http://localhost:5173";
            }}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white transition">
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-4 p-5 bg-white shadow-lg rounded-xl transition-transform hover:scale-105">
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
            {days.map((day, index) => {
              const isToday = day === todayDate;
              return (
                <div
                  key={index}
                  className={`p-3 text-center rounded-lg cursor-pointer transition
                    ${day ? "bg-blue-50 text-blue-700 hover:bg-blue-200" : ""}
                    ${isToday ? "bg-blue-500 text-white hover:bg-blue-600" : ""}
                  `}>
                  {day || ""}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-2xl p-4">
        <h2 className="text-lg font-semibold mb-4">Attendance by User</h2>

        <div className="mb-4">
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}>
            <option value="OnTime">On Time</option>
            <option value="Late">Late</option>
            <option value="Absent">Absent</option>
            <option value="Excused">Excused</option>
          </select>
        </div>

        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={attendanceData}
            margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="onTimeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
              <linearGradient id="lateGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#facc15" />
                <stop offset="100%" stopColor="#eab308" />
              </linearGradient>
              <linearGradient id="absentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f87171" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>
              <linearGradient id="excusedGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="user"
              tickFormatter={(name) =>
                name.length > 10 ? name.slice(0, 10) + "..." : name
              }
            />
            <YAxis allowDecimals={false} />
            <Tooltip
              formatter={(value, name, props) => [
                value,
                props.payload.fullName,
              ]}
              labelFormatter={(label) => label}
            />
            <Bar
              dataKey={selectedType}
              fill={gradientMap[selectedType]}
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Employee Attendance</h2>
          <input
            type="date"
            value={attendanceDate}
            onChange={(e) => setAttendanceDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="min-w-full bg-white shadow-lg rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
            <thead className="bg-gray-900">
              <tr>
                {["ID", "Name", "Department", "Status", "Action"].map(
                  (header) => (
                    <th
                      key={header}
                      className="text-left p-3 text-white uppercase text-sm tracking-wider">
                      {header}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody>
              {employeesWithAttendance.map((emp, idx) => {
                let statusBg = "";
                let statusText = "text-white";

                const status = emp.attendanceStatus;

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
                  case "EXCUSED":
                    statusBg = "bg-gray-600";
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
                    } transition hover:bg-gray-100`}>
                    <td className="p-3 text-gray-700">{idx + 1}</td>
                    <td className="p-3 font-medium text-gray-800">
                      {emp.firstName} {emp.lastName}
                    </td>
                    <td className="p-3 text-gray-600">{emp.position}</td>
                    <td className="p-3">
                      <span
                        className={`px-3 py-1 text-sm font-semibold ${statusBg} ${statusText} rounded-full shadow-sm min-w-[60px] text-center inline-block`}>
                        {status}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        className="px-4 py-2 bg-yellow-600 text-white text-base font-medium rounded hover:bg-yellow-800 transition whitespace-nowrap"
                        onClick={() => handleExcuse(emp.id)}>
                        Excuse
                      </button>
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
