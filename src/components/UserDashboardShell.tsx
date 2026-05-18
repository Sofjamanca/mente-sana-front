import { ReactNode, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  CircleUserRound,
  Home as HomeIcon,
  LineChart,
  LogOut,
  Settings,
  Sparkles,
  MessageCircle,
  LayoutDashboard,
  UserCog,
  Menu,
  X,
  HelpCircleIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import "../styles/Home.css";
import { useUser } from "../contexts/UserContext";
import { BrandLogo } from "./BrandLogo";
import { DashboardSidebarAccount } from "./DashboardSidebarAccount";

type DashboardNavItem = {
  label: string;
  icon: LucideIcon;
  path: string;
};

const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: "Hoy", icon: HomeIcon, path: "/home" },
  { label: "Check-in", icon: CircleUserRound, path: "/home" },
  { label: "Herramientas", icon: Sparkles, path: "/home" },
  { label: "Mis logros", icon: LineChart, path: "/achievements" },
  { label: "Resumen", icon: CalendarDays, path: "/daily-summary" },
  { label: "Recursos", icon: BookOpen, path: "/blogs" },
  { label: "Perfil", icon: CircleUserRound, path: "/profile/edit" },
  { label: "Ayuda", icon: HelpCircleIcon, path: "/contacts" },
];

type TopNotification = {
  id: string;
  title: string;
  time: string;
  link: string;
  unread?: boolean;
};

interface UserDashboardShellProps {
  children: ReactNode;
  activeLabel?: string;
  /** Bloque opcional bajo el nav (p. ej. racha y nota en Home). */
  sidebarFooter?: ReactNode;
  /** Si está definido, el click en un ítem usa este handler (vista Home con scroll interno). Si no, navega a `path`. */
  onSidebarNav?: (label: string) => void;
}

const UserDashboardShell = ({
  children,
  activeLabel = "Resumen",
  sidebarFooter,
  onSidebarNav,
}: UserDashboardShellProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, isAdmin, userProfile, setUserProfile } = useUser();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  const notifications: TopNotification[] = [
    { id: "n1", title: "Tenes un nuevo mensaje de Mentesana", time: "Hace 8 min", link: "/daily-summary", unread: true },
    { id: "n2", title: "Ya está disponible tu resumen diario", time: "Hoy", link: "/daily-summary" },
    { id: "n3", title: "Actualiza tu perfil para mejorar recomendaciones", time: "Ayer", link: "/profile/edit" },
  ];

  useEffect(() => {
    const onResize = () => {
      const mobile = window.innerWidth <= 900;
      setIsMobileViewport(mobile);
      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (isMobileViewport && mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }

    document.body.style.overflow = "";
  }, [isMobileViewport, mobileSidebarOpen]);

  useEffect(() => {
    if (isMobileViewport) {
      setMobileSidebarOpen(false);
    }
  }, [location.pathname, isMobileViewport]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".dash-user-menu")) {
        setUserMenuOpen(false);
      }
      if (!target.closest(".dash-notifications")) {
        setNotificationsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMobileSidebar = () => {
    if (isMobileViewport) {
      setMobileSidebarOpen(false);
    }
  };

  const handleNavClick = (label: string, path: string) => {
    if (onSidebarNav) {
      onSidebarNav(label);
    } else {
      navigate(path);
    }
    closeMobileSidebar();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userRole");
    setUserProfile(null);
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    navigate("/login");
  };

  return (
    <div className={`dashboard-screen ${theme}`}>
      <aside className={`dash-sidebar ${mobileSidebarOpen ? "is-open" : ""}`}>
        <a className="dash-brand" href="/home">
          <BrandLogo withLink={false} color="#fff8f2" />
        </a>

        <nav className="dash-nav" aria-label="Dashboard">
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                type="button"
                className={activeLabel === item.label ? "active" : undefined}
                onClick={() => handleNavClick(item.label, item.path)}
              >
                <Icon size={21} strokeWidth={1.8} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="dash-sidebar-bottom">
          {sidebarFooter ? <div className="dash-sidebar-footer">{sidebarFooter}</div> : null}
          <DashboardSidebarAccount
            userName={userProfile?.name ?? ""}
            onLogout={handleLogout}
          />
        </div>
      </aside>

      {isMobileViewport && mobileSidebarOpen && (
        <button
          type="button"
          className="dash-sidebar-overlay"
          aria-label="Cerrar menu lateral"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-leading">
            <button
              type="button"
              className="dash-mobile-menu-btn"
              aria-label={mobileSidebarOpen ? "Cerrar menu" : "Abrir menu"}
              onClick={() => setMobileSidebarOpen((prev) => !prev)}
            >
              {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="dash-topbar-center">
            <a href="/home" className="dash-topbar-logo-wrap" aria-label="Mentesana, inicio">
              <BrandLogo withLink={false} color="var(--color-ink)" />
            </a>
          </div>

          <div className="dash-topbar-trailing">
            <div className="dash-top-actions">
              <div className="dash-notifications">
              <button
                className="bell-button"
                aria-label="Notificaciones"
                type="button"
                onClick={() => {
                  setNotificationsOpen((prev) => !prev);
                  setUserMenuOpen(false);
                }}
              >
                <Bell size={24} />
                <i />
              </button>
              {notificationsOpen && (
                <div className="dash-notifications-dropdown">
                  <div className="dash-notifications-head">
                    <strong>Notificaciones</strong>
                  </div>
                  <div className="dash-notifications-list">
                    {notifications.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className={`dash-notification-item ${item.unread ? "unread" : ""}`}
                        onClick={() => {
                          navigate(item.link);
                          setNotificationsOpen(false);
                        }}
                      >
                        <span>{item.title}</span>
                        <small>{item.time}</small>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="dash-user-menu">
              <button
                className="dash-avatar"
                aria-label="Abrir menu de usuario"
                type="button"
                onClick={() => {
                  setUserMenuOpen((prev) => !prev);
                  setNotificationsOpen(false);
                }}
              >
                <CircleUserRound size={30} strokeWidth={1.8} />
                <ChevronDown size={14} className={userMenuOpen ? "open" : ""} />
              </button>
              {userMenuOpen && (
                <div className="dash-user-dropdown">
                  <div className="dash-user-dropdown-head">
                    <strong>{userProfile?.name || "Mi cuenta"}</strong>
                    <span>{isAdmin ? "Administrador" : "Panel personal"}</span>
                  </div>
                  <button
                    className="dash-user-item"
                    type="button"
                    onClick={() => {
                      navigate(isAdmin ? "/admin" : "/home");
                      setUserMenuOpen(false);
                    }}
                  >
                    <LayoutDashboard size={16} />
                    <span>Dashboard</span>
                  </button>
                  <button
                    className="dash-user-item"
                    type="button"
                    onClick={() => {
                      navigate("/profile/edit");
                      setUserMenuOpen(false);
                    }}
                  >
                    <UserCog size={16} />
                    <span>Editar perfil</span>
                  </button>
                  <button type="button" className="dash-user-item danger" onClick={handleLogout}>
                    <LogOut size={16} />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              )}
            </div>
          </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
};

export default UserDashboardShell;
