import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { UserProvider } from "./contexts/UserContext";
import Contacts from "./pages/Contacts";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Events from "./pages/Events";
import DailySummary from "./pages/DailySummary";
import AboutUs from "./pages/AboutUs";
import AdminPanel from "./pages/AdminPanel";
import BlogsManagement from "./pages/BlogsManagement";
import EventsManagement from "./pages/EventsManagement";
import Footer from "./components/Footer";
import EditProfile from "./components/EditProfile";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Blogs from "./pages/Blogs";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => {
  const location = useLocation();
  const hideSidebarAndFooter = ["/login", "/register", "/", "/about-us-guest"].includes(location.pathname);

  const [theme, setTheme] = useState<"dark" | "light">(() => {
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeChange = (newTheme: "dark" | "light") => {
    setTheme(newTheme);
  };

  return (
    <div className={`app-container ${theme}`}>
      {!hideSidebarAndFooter && <Sidebar theme={theme} onThemeChange={handleThemeChange} />}
      <div className={`main-content ${theme} ${hideSidebarAndFooter ? "full-width" : ""}`}>
        <div className="content">
          <Routes>
            <Route 
              path="/home" 
              element={
                <ProtectedRoute>
                  <Home theme={theme} />
                </ProtectedRoute>
              } 
            />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/contacts" 
              element={
                <ProtectedRoute>
                  <Contacts />
                </ProtectedRoute>
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/events/:id" 
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/daily-summary" 
              element={
                <ProtectedRoute>
                  <DailySummary />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/blogs" 
              element={
                <ProtectedRoute>
                  <Blogs />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/about-us" 
              element={
                <ProtectedRoute>
                  <AboutUs />
                </ProtectedRoute>
              } 
            />
            <Route path="/about-us-guest" element={<AboutUs />} />
            <Route 
              path="/profile/edit" 
              element={
                <ProtectedRoute>
                  <EditProfile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <AdminPanel />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <BlogsManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <EventsManagement />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Landing theme={theme} />} />
          </Routes>
        </div>
        {!hideSidebarAndFooter && <Footer theme={theme} />}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Layout />
      </Router>
    </UserProvider>
  );
};

export default App;
