import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Signup from "./Pages/Register";
import LandingPage from "./Components/Landingpage";
import Dashboard from "./Components/Dashboard";
import Inventory from "./Components/Inventory";
import Orders from "./Components/Orders";
import Notifications from "./Components/Notifications";
import Profile from "./Components/Profile";
import RiderHomepage from "./Components/RiderHomepage";
import HRHomepage from "./Components/HRHomepage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/riderhomepage" element={<RiderHomepage />} />
        <Route path="/hrhomepage" element={<HRHomepage />} />
      </Routes>
    </Router>
  );
}

export default App;
