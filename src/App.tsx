import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Events from "./pages/Events";
import DailySummary from "./pages/DailySummary";
import AboutUs from "./pages/AboutUs";
import Footer from "./components/Footer";
import Sidebar from "./components/Sidebar";

const Layout = () => {
  const location = useLocation();
  const hideSidebarAndFooter = ["/login", "/register"].includes(location.pathname);

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
            <Route path="/" element={<Home theme={theme} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/events/:id" element={<Events />} />
            <Route path="/daily-summary" element={<DailySummary />} />
            <Route path="/about-us" element={<AboutUs />} />
          </Routes>
        </div>
        {!hideSidebarAndFooter && <Footer theme={theme} />}
      </div>
    </div>
  );
};


const App = () => {
  return (
    <Router>
      <Layout />
    </Router>
  );
};

export default App;
