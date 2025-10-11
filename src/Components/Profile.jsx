import {
  FaTachometerAlt,
  FaBox,
  FaClipboardList,
  FaBell,
  FaSignOutAlt,
  FaSearch,
  FaBars,
  FaTimes,
  FaUser,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

function ProfileManagement() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [employees, setEmployees] = useState([]);
  const [weekDays, setWeekDays] = useState([]);

  const getWeekDates = (dateStr) => {
    const date = dateStr ? new Date(dateStr) : new Date();
    const day = date.getDay();
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((day + 6) % 7));

    const days = [];
    for (let i = 0; i < 5; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d.toISOString().split("T")[0]);
    }
    return days;
  };

  useEffect(() => {
    const fetchWeeklyAttendance = async () => {
      const week = getWeekDates(selectedDate);
      setWeekDays(week);

      try {
        const weeklyData = await Promise.all(
          week.map(async (date) => {
            const res = await axios.get(
              `http://localhost:8080/api/attendance?date=${date}`
            );
            return { date, employees: res.data };
          })
        );

        const employeeMap = new Map();

        weeklyData.forEach(({ date, employees }) => {
          employees.forEach((emp) => {
            if (!employeeMap.has(emp.id)) {
              employeeMap.set(emp.id, {
                id: emp.id,
                name: `${emp.firstName} ${emp.lastName}`,
                position: emp.position || "Staff",
                statusByDate: {},
              });
            }
            employeeMap.get(emp.id).statusByDate[date] = emp.attendanceStatus;
          });
        });

        const usersWithWeekStatus = Array.from(employeeMap.values()).map(
          (user) => {
            const statusArr = week.map((day) => {
              return user.statusByDate[day] || "ABSENT";
            });

            return {
              id: user.id,
              name: user.name,
              position: user.position,
              status: statusArr,
            };
          }
        );

        setEmployees(usersWithWeekStatus);
      } catch (error) {
        console.error("Error fetching weekly attendance:", error);
      }
    };

    fetchWeeklyAttendance();

    const interval = setInterval(fetchWeeklyAttendance, 5000);
    return () => clearInterval(interval);
  }, [selectedDate]);

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Select Date";

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
              className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
              <FaBell /> Notifications
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

      <main className="flex-1 bg-gray-500 text-black overflow-y-auto">
        <header className="h-16 bg-black text-white px-10 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Profile Management</h1>
          <div></div>
          <div className="relative w-80">
            <input
              type="text"
              placeholder="Search an employee..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-blue-400 text-white bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white" />
          </div>
        </header>

        <section className="p-6">
          {/* Date Picker */}
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

          {/* Legend */}
          <div className="mt-[-1rem] mb-4 border border-white rounded-lg p-3 inline-flex items-center gap-6 bg-gray-600 shadow-md w-auto">
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-green-500 inline-block border border-white"></span>
              <span className="text-sm text-white">On-Time</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-yellow-400 inline-block border border-white"></span>
              <span className="text-sm text-white">Late</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-blue-500 inline-block border border-white"></span>
              <span className="text-sm text-white">Excused</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 rounded-full bg-red-500 inline-block border border-white"></span>
              <span className="text-sm text-white">Absent</span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-lg shadow-lg bg-white">
            <table className="min-w-full table-fixed border border-gray-300 bg-gray-100">
              <thead className="bg-gray-800 text-white">
                <tr>
                  <th className="w-16 px-4 py-3 border-b text-left font-bold">
                    #
                  </th>
                  <th className="px-6 py-3 border-b text-left font-bold">
                    Employee Name
                  </th>
                  <th className="px-6 py-3 border-b text-left font-bold">
                    Position
                  </th>
                  {weekDays.map((day) => (
                    <th
                      key={day}
                      className="px-4 py-3 border-b text-center font-bold">
                      {new Date(day).toLocaleDateString("en-US", {
                        weekday: "short",
                      })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr
                    key={emp.id}
                    className={`border-t transition-colors duration-200 hover:bg-gray-400 ${
                      index % 2 !== 0 ? "bg-gray-200" : "bg-white"
                    }`}>
                    <td className="px-4 py-3 border-b">{index + 1}</td>
                    <td className="px-6 py-3 border-b">{emp.name}</td>
                    <td className="px-6 py-3 border-b">{emp.position}</td>
                    {emp.status.map((status, idx) => (
                      <td key={idx} className="px-2 py-3 border-b text-center">
                        <span
                          className={`h-4 w-4 inline-block rounded-full ${
                            {
                              ON_TIME: "bg-green-500",
                              LATE: "bg-yellow-400",
                              EXCUSED: "bg-blue-500",
                              ABSENT: "bg-red-500",
                            }[status] || "bg-gray-500"
                          }`}
                          title={status}></span>
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
