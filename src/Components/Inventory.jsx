import { FaTachometerAlt, FaBox, FaClipboardList, FaChartBar, FaBell, FaSignOutAlt, FaSearch, FaCog,  FaBars, FaTimes, FaChevronLeft, FaChevronRight, FaPlus, FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon } from "lucide-react"; 
import { Link } from 'react-router-dom';

  const InputField = ({ label, name, type = "text", value, onChange }) => (
    <div className="mb-4">
      <label className="block font-semibold">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );

function Inventory() {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [items, setItems] = useState([]);
    const [editMode, setEditMode] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [confirmDeleteId, setConfirmDeleteId] = useState(null);
    const [alertType, setAlertType] = useState(""); 
    const [alert, setAlert] = useState({ type: '', message: '' });
    const scrollRef = useRef(null);
    const [selectedCategory, setSelectedCategory] = useState("All Categories");
    const [searchQuery, setSearchQuery] = useState("");

    const scroll = (direction) => {
        if (scrollRef.current) {
        const { scrollLeft, clientWidth } = scrollRef.current;
        const scrollAmount = 200;
        scrollRef.current.scrollTo({
            left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
            behavior: "smooth",
        });
        }
    };

    const [formData, setFormData] = useState({
        itemName: "",
        price: "",
        category: "",
        quantity: "",
        picture: null, 
    });

    const fetchItems = async (category = "All Categories") => {
      try {
        const url =
          category === "All Categories"
            ? "http://localhost:8080/api/items"
            : `http://localhost:8080/api/items?category=${encodeURIComponent(category)}`;

        const response = await axios.get(url);
        setItems(response.data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    useEffect(() => {
      fetchItems(selectedCategory);
    }, [selectedCategory]);

    const handleChange = (e) => {
        const { name, value, type, files } = e.target;
        if (type === "file") {
        setFormData({ ...formData, [name]: files[0] });
        } else {
        setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      const multipartFormData = new FormData();
        multipartFormData.append("itemName", formData.itemName);
        multipartFormData.append("quantity", formData.quantity);
        multipartFormData.append("category", formData.category);
        multipartFormData.append("price", formData.price);
          if (formData.picture) {
            multipartFormData.append("image", formData.picture); 
        }

      try {
      if (editMode) {
        await axios.put(`http://localhost:8080/api/items/${formData.id}`, multipartFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setAlertMessage("Item updated successfully!");
        setAlertType("success");
      } else {
        await axios.post("http://localhost:8080/api/items", multipartFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        setAlertMessage("Item added successfully!");
        setAlertType("success");
      }

      setFormData({
        itemName: "",
        price: "",
        category: "",
        quantity: "",
        picture: null,
        id: null,
      });

      setEditMode(false);
      setShowModal(false);
      fetchItems();

      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 3000);
    } catch (err) {
      console.error("Error saving item:", err);
      setAlertMessage("Failed to save item.");
      setAlertType("error");

      setTimeout(() => {
        setAlertMessage("");
        setAlertType("");
      }, 3000);
    }
  };

  const handleEdit = (item) => {
      setFormData({
        ...item,
        picture: null, 
      });
      setEditMode(true);
      setShowModal(true);
  };

  const handleAddNew = () => {
    setFormData({
      itemName: "",
      price: "",
      category: "",
      quantity: "",
      picture: null,
      id: null, // important to prevent edit mode logic
    });
    setEditMode(false);
    setShowModal(true);
  };

  const confirmDelete = (id) => {
    setConfirmDeleteId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/items/${id}`);
      setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      setConfirmDeleteId(null);

      setAlert({ type: 'success', message: 'Item deleted successfully!' });
    } catch (error) {
      console.error("Failed to delete item:", error);
      setAlert({ type: 'error', message: 'Failed to delete item.' });
    }

    setTimeout(() => {
      setAlert({ type: '', message: '' });
    }, 3000);
  };

  const handleSearch = () => {
    fetchItemsBySearch(searchQuery);
  };

  const fetchItemsBySearch = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/items/search?name=${encodeURIComponent(query)}`
      );
      setItems(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
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
    
    return(
        <div className="flex h-screen bg-gray-900 text-white">        
            {alert.message && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                <div
                  className={`p-4 rounded shadow-lg text-center ${
                    alert.type === 'success'
                      ? 'bg-green-100 text-green-800 border border-green-400'
                      : 'bg-red-100 text-red-800 border border-red-400'
                  }`}
                >
                  {alert.message}
                </div>
              </div>
            )}
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
              {/* Header */}
              <header className="h-16 bg-black text-white px-10 flex items-center justify-between">
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

          {/* Category Scroll Bar */}
          <div className="bg-white shadow px-10 py-4 relative flex items-center">
            <button
              className="absolute left-0 z-10 bg-gray-300 hover:bg-black hover:text-white rounded-full p-2 ml-2"
              onClick={() => scroll("left")}
            >
              <FaChevronLeft />
            </button>
            <div
              ref={scrollRef}
              className="flex gap-4 text-sm font-semibold whitespace-nowrap overflow-x-auto scroll-smooth scrollbar-hide mx-10"
            >
              {["All Categories", "Tools", "Electronics Supplies", "Plumbing Supplies"].map((category) => (
                <div
                  key={category}
                  className={`cursor-pointer px-4 py-2 rounded-full transition ${
                    selectedCategory === category
                      ? "bg-black text-white"
                      : "bg-gray-200 hover:bg-black hover:text-white"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSearchQuery("");       
                    setItems([]);               
                    fetchItems(category);       
                  }}
                >
                  {category}
                </div>
              ))}
            </div>
            <button
              className="absolute right-0 z-10 bg-gray-300 hover:bg-black hover:text-white rounded-full p-2 mr-2"
              onClick={() => scroll("right")}
            >
              <FaChevronRight />
            </button>
          </div>

          {/* Main Content */}
          <div className="px-5 py-4 flex flex-col gap-6">
            {/* First row: Add button + first 3 items (or only Add button if empty) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <button
                onClick={handleAddNew}
                className="w-full min-h-[350px] flex flex-col items-center justify-center text-black border-4 border-dashed border-black bg-transparent hover:bg-black hover:text-white transition text-lg font-semibold rounded-[10px]"
              >
                <FaPlus size={28} className="mb-2" />
                Add New Item
              </button>

              {/* Only render items if present */}
              {items.length > 0 &&
                items.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="bg-white shadow rounded-[10px] p-3 flex flex-col justify-between min-h-[350px]"
                  >
                    {item.imagePath?.trim() ? (
                      <img
                        src={`http://localhost:8080/${item.imagePath.replace(/\\/g, "/")}`}
                        alt="Item"
                        onError={(e) => (e.target.src = "/fallback.jpg")}
                        className="w-full h-32 rounded-[10px] mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded-[10px] mb-2">
                        No Image
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold truncate">{item.itemName}</h3>
                      <p className="text-sm text-black-700">Price : ₱{item.price}</p>
                      <p className="text-sm text-black-500">Category: {item.category}</p>
                      <p className="text-sm text-black-500">Quantity: {item.quantity}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-gray-500 text-white text-md py-1.5 rounded-[5px] w-full hover:bg-gray-600"
                        onClick={() => setConfirmDeleteId(item.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-yellow-600 text-white text-md py-1.5 rounded-[5px] w-full hover:bg-yellow-700"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
            </div>

            {/* Remaining items - 4 per row */}
            {items.length > 3 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {items.slice(3).map((item, index) => (
                  <div
                    key={index + 3}
                    className="bg-white shadow rounded-[10px] p-3 flex flex-col justify-between min-h-[350px]"
                  >
                    {item.imagePath?.trim() ? (
                      <img
                        src={`http://localhost:8080/${item.imagePath.replace(/\\/g, "/")}`}
                        alt="Item"
                        onError={(e) => (e.target.src = "/fallback.jpg")}
                        className="w-full h-32 rounded-[10px] mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-gray-200 flex items-center justify-center text-gray-500 rounded-[10px] mb-2">
                        No Image
                      </div>
                    )}

                    <div className="flex flex-col gap-1">
                      <h3 className="text-base font-semibold truncate">{item.itemName}</h3>
                      <p className="text-sm text-black-700">Price : ₱{item.price}</p>
                      <p className="text-sm text-black-500">Category: {item.category}</p>
                      <p className="text-sm text-black-500">Quantity: {item.quantity}</p>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        className="bg-gray-500 text-white text-md py-1.5 rounded-[5px] w-full hover:bg-gray-600"
                        onClick={() => setConfirmDeleteId(item.id)}
                      >
                        Delete
                      </button>
                      <button
                        className="bg-yellow-600 text-white text-md py-1.5 rounded-[5px] w-full hover:bg-yellow-700"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty message shown *below* the grid for stable layout */}
            {items.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No items found in "{selectedCategory}" category.
              </div>
            )}

            <AnimatePresence>
              {confirmDeleteId !== null && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 flex items-center justify-center bg-opacity-40 z-50"
                >
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm text-center"
                  >
                    <p className="text-lg mb-4">Are you sure you want to delete this item?</p>
                    <div className="flex justify-center gap-4">
                      <button
                        onClick={() => handleDelete(confirmDeleteId)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>

            {alertMessage && (
              <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
                <div
                  className={`p-4 rounded shadow-lg text-center ${
                    alertType === "success"
                      ? "bg-green-100 text-green-800 border border-green-400"
                      : "bg-red-100 text-red-800 border border-red-400"
                  }`}
                >
                  {alertMessage}
                </div>
              </div>
            )}

            {/* Modal */}
            <AnimatePresence>
              {showModal && (
                <>
                  {/* Backdrop */}
                  <motion.div
                    className="fixed inset-0 bg-gray bg-opacity-50 z-40"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  />

                  {/* Modal Content */}
                  <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                        {editMode ? (
                          <>
                            <FaEdit className="text-black-500" />
                            Edit Item
                          </>
                        ) : (
                          <>
                            <FaPlus className="text-black-500" />
                            Add New Item
                          </>
                        )}
                      </h2>
                      <form onSubmit={handleSubmit} className="space-y-4">
                        <InputField label="Item Name" name="itemName" value={formData.itemName} onChange={handleChange} />
                        <InputField label="Price" name="price" type="number" value={formData.price} onChange={handleChange} />
                        <InputField label="Category" name="category" value={formData.category} onChange={handleChange} />
                        <InputField label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} />

                        <div className="mb-4">
                          <label className="block font-semibold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-black-500" />
                            Picture
                          </label>
                          <input
                            type="file"
                            name="picture"
                            onChange={handleChange}
                            className="w-full text-sm text-gray-500 mt-1"
                          />
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowModal(false)}
                            className="px-4 py-2 bg-gray-300 text-black rounded-[10px] hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 bg-black text-white rounded-[10px] hover:bg-gray-800 transition"
                          >
                            {editMode ? 'Update' : 'Save'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
       </main>
    </div>
  );
}

export default Inventory;