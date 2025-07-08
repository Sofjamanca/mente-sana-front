import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { UserProvider, useUser } from "./contexts/UserContext";
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
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import UsersManagement from "./pages/UsersManagement";
import UserDetail from "./pages/UserDetail";
import CreateUser from "./pages/CreateUser";
import Footer from "./components/Footer";
import EditProfile from "./components/EditProfile";
import Sidebar from "./components/Sidebar";
import Landing from "./pages/Landing";
import Blogs from "./pages/Blogs";
import ProtectedRoute from "./components/ProtectedRoute";

const Layout = () => {
  const location = useLocation();
  const hideSidebarAndFooter = ["/login", "/register", "/", "/about-us-guest"].includes(location.pathname);
  const { theme } = useUser();

  useEffect(() => {
    // Limpiar localStorage antiguo si existe
    const oldTheme = localStorage.getItem("theme");
    if (oldTheme && !localStorage.getItem("userTheme")) {
      localStorage.setItem("userTheme", oldTheme);
      localStorage.removeItem("theme");
    }
    
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}>
      {!hideSidebarAndFooter && <Sidebar theme={theme} />}
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
            <Route 
              path="/admin/blogs/create" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <CreatePost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/blogs/edit/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditPost />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events/create" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/events/edit/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <EditEvent />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <UsersManagement />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/create" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <CreateUser />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin/users/:id" 
              element={
                <ProtectedRoute adminOnly={true}>
                  <UserDetail />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Landing />} />
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
