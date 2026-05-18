import { LogOut } from "lucide-react";

export type DashboardSidebarAccountProps = {
  userName: string;
  onLogout: () => void;
};

function getInitial(name: string) {
  const t = name.trim();
  if (!t) return "?";
  return t.slice(0, 1).toLocaleUpperCase();
}

export function DashboardSidebarAccount({ userName, onLogout }: DashboardSidebarAccountProps) {
  const label = userName.trim() || "Mi cuenta";
  const initial = getInitial(userName);

  return (
    <div className="dash-sidebar-account">
      <div className="dash-sidebar-account__panel">
        <div className="dash-sidebar-account__identity">
          <div className="dash-sidebar-account__avatar" aria-hidden>
            {initial}
          </div>
          <div className="dash-sidebar-account__meta">
            <p className="dash-sidebar-account__name" title={label}>
              {label}
            </p>
          </div>
        </div>
      </div>
      <button
        type="button"
        className="dash-sidebar-account__logout"
        onClick={onLogout}
        aria-label="Cerrar sesión"
      >
        <LogOut size={17} strokeWidth={2} aria-hidden />
        <span className="dash-sidebar-account__logout-label">Cerrar sesión</span>
      </button>
    </div>
  );
}
