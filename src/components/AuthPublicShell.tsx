import type { ReactNode } from "react";
import { BrandLogo } from "./BrandLogo";
import "../styles/Landing.css";
import "../styles/AuthPublic.css";

export type AuthPublicShellProps = {
  children: ReactNode;
  /** Botón principal del header (Crear cuenta / Iniciar sesión) */
  headerCta: { href: string; label: string };
  layout?: "login" | "register";
};

export function AuthPublicShell({
  children,
  headerCta,
  layout = "login",
}: AuthPublicShellProps) {
  return (
    <main className={`lp auth-public auth-public--${layout}`}>
      <header className="lp-header">
        <div className="lp-header__inner">
          <BrandLogo />
          <div className="auth-public__header-spacer" aria-hidden />
          <a className="lp-btn lp-btn--primary lp-btn--compact" href={headerCta.href}>
            {headerCta.label}
          </a>
        </div>
      </header>

      <div className="auth-public__stage">
        <div className="lp-hero__bg" aria-hidden="true">
          <span className="lp-hero__blob lp-hero__blob--pink" />
          <span className="lp-hero__blob lp-hero__blob--purple" />
        </div>

        <div className={`auth-public__content auth-public__content--${layout}`}>
          {layout === "login" ? (
            <>
              <div className="auth-public__intro">
                <img
                  className="auth-public__mascot"
                  src="/landing/hero_mascota.png"
                  alt=""
                  width={340}
                  height={340}
                />
                <p className="auth-public__intro-copy">
                  Registrá cómo te sentís, recibí mensajes con IA y mirá tu progreso con claridad. Sin juicios, a tu ritmo.
                </p>
              </div>
              <div className="auth-public__panel-wrap">{children}</div>
            </>
          ) : (
            <div className="auth-public__panel-wrap auth-public__panel-wrap--wide">{children}</div>
          )}
        </div>
      </div>
    </main>
  );
}
