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
import EditProfile from "./components/EditProfile";
import Layout from "./components/Layout";
import UserDashboardShell from "./components/UserDashboardShell";
import Landing from "./pages/Landing";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import ParentGuides from "./pages/ParentGuides";
import Achievements from "./pages/Achievements";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

const AppContent = () => {
  const location = useLocation();
  const isPublicContentRoute =
    ["/login", "/register", "/", "/about-us-guest", "/blogs", "/para-padres", "/achievements"].includes(location.pathname) ||
    location.pathname.startsWith("/blogs/");
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

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    const scrollContainers = [
      ".layout-container .main-content",
      ".layout-container .page-content",
      ".dashboard-screen",
      ".dash-main",
    ];

    scrollContainers.forEach((selector) => {
      const element = document.querySelector(selector);
      if (element instanceof HTMLElement) {
        element.scrollTop = 0;
      }
    });
  }, [location.pathname]);

  return (
    <div className={`app-container ${theme}`}>
      {!isPublicContentRoute ? (
        <Layout>
          <div className="content">
            <Routes>
              <Route 
                path="/home" 
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/contacts" 
                element={
                  <ProtectedRoute>
                    <UserDashboardShell activeLabel="Ajustes">
                      <Contacts />
                    </UserDashboardShell>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/upcoming" 
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/events/past" 
                element={
                  <ProtectedRoute>
                    <Events />
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
                    <UserDashboardShell activeLabel="Resumen">
                      <DailySummary />
                    </UserDashboardShell>
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
                    <UserDashboardShell activeLabel="Perfil">
                      <EditProfile />
                    </UserDashboardShell>
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
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/para-padres" element={<ParentGuides />} />
              <Route
                path="/achievements"
                element={
                  <ProtectedRoute>
                    <UserDashboardShell activeLabel="Mis logros">
                      <Achievements />
                    </UserDashboardShell>
                  </ProtectedRoute>
                }
              />
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
