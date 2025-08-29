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
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Blogs from "./pages/Blogs";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const AppContent = () => {
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
      {!hideSidebarAndFooter ? (
        <Layout>
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
              <Route 
                path="/contacts" 
                element={
                  <ProtectedRoute>
                    <Contacts />
                  </ProtectedRoute>
                } 
              />
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
                  <ProtectedRoute>
                    <AdminPanel />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blogs" 
                element={
                  <ProtectedRoute>
                    <BlogsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events" 
                element={
                  <ProtectedRoute>
                    <EventsManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users" 
                element={
                  <ProtectedRoute>
                    <UsersManagement />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users/:id" 
                element={
                  <ProtectedRoute>
                    <UserDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/users/create" 
                element={
                  <ProtectedRoute>
                    <CreateUser />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blogs/create" 
                element={
                  <ProtectedRoute>
                    <CreatePost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/blogs/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditPost />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/create" 
                element={
                  <ProtectedRoute>
                    <CreateEvent />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/events/edit/:id" 
                element={
                  <ProtectedRoute>
                    <EditEvent />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </div>
        </Layout>
      ) : (
        <div className={`main-content ${theme} full-width`}>
          <div className="content">
            <Routes>
              <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
              <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
              <Route path="/" element={<Landing />} />
              <Route path="/about-us-guest" element={<AboutUs />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

const App = () => {
  return (
    <UserProvider>
      <Router>
        <AppContent />
      </Router>
    </UserProvider>
  );
};

export default App;
