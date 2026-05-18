import { CircleUserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { BrandLogo } from "./BrandLogo";

const PublicBlogNavbar = () => {
  const { userProfile, isAdmin } = useUser();
  const hasSession = Boolean(localStorage.getItem("token"));

  const actionHref = hasSession ? (isAdmin ? "/admin" : "/home") : "/login";
  const actionLabel = hasSession ? "Ir a mi panel" : "Iniciar sesion";

  return (
    <header className="blogs-topbar-wrap" aria-label="Navegacion principal">
      <div className="dash-topbar blogs-topbar">
        <div className="dash-topbar-leading">
          <span className="blogs-topbar-spacer" aria-hidden />
        </div>

        <div className="dash-topbar-center blogs-topbar-center">
          <BrandLogo href="/" color="var(--color-ink)" />
        </div>

        <div className="dash-topbar-trailing">
          <div className="dash-top-actions">
            <Link className={`blogs-topbar-action ${hasSession ? "logged" : ""}`} to={actionHref}>
              {hasSession ? <CircleUserRound size={18} /> : null}
              <span>
                {actionLabel}
                {hasSession && userProfile?.name ? `: ${userProfile.name.split(" ")[0]}` : ""}
              </span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default PublicBlogNavbar;
