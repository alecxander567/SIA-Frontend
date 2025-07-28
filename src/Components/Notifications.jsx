import { FaTachometerAlt, FaBox, FaClipboardList, FaChartBar, FaBell, FaSignOutAlt, FaSearch, FaChartLine, FaFire, FaCog,  FaBars, FaTimes, FaUser, FaCalendarAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { Link } from 'react-router-dom';

function Notifications() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState(null);

    const [selectedDate, setSelectedDate] = useState("");
    const formattedDate = selectedDate
        ? new Date(selectedDate).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "All Date";

    const notifications = [
        {
            id: 1,
            sender: "Jane Doe",
            avatar: "https://randomuser.me/api/portraits/women/44.jpg",
            datetime: "July 28, 2025 • 10:30 AM",
            date: "2025-07-28",
            message: "Hey! Just checking in regarding the latest updates on the project.",
            unread: true,
        },
        {
            id: 2,
            sender: "John Smith",
            avatar: "https://randomuser.me/api/portraits/men/32.jpg",
            datetime: "July 27, 2025 • 3:45 PM",
            date: "2025-07-27",
            message: "Don't forget about tomorrow's meeting. Please bring the report.",
            unread: false,
        },
        {
            id: 3,
            sender: "Emily Johnson",
            avatar: "https://randomuser.me/api/portraits/women/68.jpg",
            datetime: "July 26, 2025 • 9:00 AM",
            date: "2025-07-26",
            message: "The design mockups have been updated. Please review the changes.",
            unread: true,
        },
        {
            id: 4,
            sender: "Michael Brown",
            avatar: "https://randomuser.me/api/portraits/men/45.jpg",
            datetime: "July 25, 2025 • 11:15 AM",
            date: "2025-07-25",
            message: "We need to reschedule the team sync-up to next week.",
            unread: false,
        },
        {
            id: 5,
            sender: "Sarah Williams",
            avatar: "https://randomuser.me/api/portraits/women/12.jpg",
            datetime: "July 24, 2025 • 2:30 PM",
            date: "2025-07-24",
            message: "Kindly complete the feedback form before Friday.",
            unread: true,
        },
        {
            id: 6,
            sender: "David Lee",
            avatar: "https://randomuser.me/api/portraits/men/29.jpg",
            datetime: "July 23, 2025 • 4:20 PM",
            date: "2025-07-23",
            message: "I've shared the updated spreadsheet. Let me know your thoughts.",
            unread: false,
        },
        {
            id: 7,
            sender: "Olivia Martinez",
            avatar: "https://randomuser.me/api/portraits/women/58.jpg",
            datetime: "July 22, 2025 • 8:10 AM",
            date: "2025-07-22",
            message: "Are we still on for the brainstorming session later today?",
            unread: true,
        },
        {
            id: 8,
            sender: "Daniel Garcia",
            avatar: "https://randomuser.me/api/portraits/men/61.jpg",
            datetime: "July 21, 2025 • 6:50 PM",
            date: "2025-07-21",
            message: "The bug you reported has been fixed. Please verify on your end.",
            unread: false,
        },
        {
            id: 9,
            sender: "Sophia Robinson",
            avatar: "https://randomuser.me/api/portraits/women/33.jpg",
            datetime: "July 20, 2025 • 1:00 PM",
            date: "2025-07-20",
            message: "Let’s meet tomorrow to finalize the feature list.",
            unread: true,
        },
        {
            id: 10,
            sender: "Chris Evans",
            avatar: "https://randomuser.me/api/portraits/men/70.jpg",
            datetime: "July 19, 2025 • 5:25 PM",
            date: "2025-07-19",
            message: "Reminder: Team building event this weekend. Hope you can join!",
            unread: false,
        },
    ];

    const visibleNotifications = notifications.filter((notif) => {
    const matchesDate = selectedDate === "" || notif.date === selectedDate;
    const matchesSearch =
        notif.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDate && matchesSearch;
    });

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
                    <a href="#" className="flex items-center gap-3 hover:bg-gray-700 px-3 py-2 rounded">
                        <FaUser /> Profile Management
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

            <main className="flex-1 bg-gray-500 text-black overflow-y-auto min-h-screen">
                {/* Header */}
                <header className="h-16 bg-black text-white px-10 flex items-center justify-between">
                    <h1 className="text-lg">Notifications</h1>
                    <div className="flex items-center gap-2">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="w-64 bg-gray-800 text-white px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="bg-white text-black p-2 px-4 rounded-md hover:bg-gray-200">
                        <FaSearch />
                    </button>
                    </div>
                </header>

                {/* Date Picker */}
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
                    <input
                        id="real-date-input"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="absolute top-0 left-0 opacity-0 pointer-events-none"
                    />
                    </div>
                </div>

                {/* Notifications */}
                <div className="px-8 py-6">
                <div className="bg-white rounded-lg divide-y divide-gray-200 shadow">
                    {visibleNotifications.length > 0 ? (
                visibleNotifications.map((notif) => (

                        <div
                        key={notif.id}
                        className="flex gap-4 px-10 py-8 items-start relative"
                        >
                        <img
                            src={notif.avatar}
                            alt={notif.sender}
                            className="w-10 h-10 rounded-full object-cover mt-1"
                        />
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start">
                            <div className="flex items-center gap-2">
                                <h2 className="font-semibold text-base text-black">
                                {notif.sender}
                                </h2>
                                <span className="text-sm text-gray-500">
                                {notif.datetime}
                                </span>
                                {notif.unread && (
                                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                                )}
                            </div>
                            </div>
                            <p className="text-sm text-gray-700 mt-2">{notif.message}</p>
                            <div className="flex justify-end gap-4 mt-4">
                            <button
                                onClick={() => {
                                    setSelectedNotification(notif);
                                    setShowModal(true);
                                }}
                                className="text-sm text-blue-600 hover:underline"
                                >
                                Open
                                </button>

                                <button
                                onClick={() => {
                                    const updated = notifications.map((n) =>
                                    n.id === notif.id ? { ...n, unread: false } : n
                                    );
                                    setNotifications(updated);
                                }}
                                className="text-sm text-green-600 hover:underline"
                                >
                                Mark as Read
                                </button>
                                </div>
                            </div>
                        </div>
                    ))
                    ) : (
                    <div className="text-center py-6 text-gray-500">
                        No notifications found.
                    </div>
                    )}
                </div>
                </div>

               {showModal && selectedNotification && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm pointer-events-none">
                    <div className="bg-white p-8 rounded-2xl w-[400px] shadow-2xl relative space-y-6 pointer-events-auto">
                    {/* Close Button */}
                    <button
                        onClick={() => setShowModal(false)}
                        className="absolute top-3 right-4 text-gray-500 hover:text-black text-2xl"
                    >
                        &times;
                    </button>

                    {/* Sender Profile Section */}
                    <div className="flex items-center gap-4">
                        <img
                        src={selectedNotification.avatar || "https://via.placeholder.com/50"}
                        alt="Sender"
                        className="w-14 h-14 rounded-full object-cover border"
                        />
                        <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            {selectedNotification.sender}
                        </h2>
                        <p className="text-sm text-gray-500">{selectedNotification.datetime}</p>
                        </div>
                    </div>

                    {/* Message Content */}
                    <div className="text-gray-700 text-base leading-relaxed">
                        {selectedNotification.message}
                    </div>
                    </div>
                </div>
                )}
            </main>
        </div>
    );
}

export default Notifications;