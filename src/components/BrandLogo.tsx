import "../styles/BrandLogo.css";

const LOGO_PATH =
  "M137.61,56.45s8.84-14.26,.73-24.89c-8.82-11.55-21.68-8.52-21.68-8.52,0,0,1.09-20.77-26.41-22.89-25.23-1.94-29.82,15.36-29.82,15.36,0,0-18.82-9.65-33.41,4.47-14.59,14.11-7.53,27.76-7.53,27.76,0,0-21.76,1.97-19.3,29.88,2.47,28,38.12,24.94,38.12,24.94,0,0,14.59,9.89,35.3,9.18,20.7-.7,40.47-9.18,40.47-9.18,0,0,34.01,6.37,36.94-20.94,2.23-20.82-13.41-25.17-13.41-25.17Zm-89.04,.35c0-5.36,4.35-9.71,9.71-9.71s9.71,4.35,9.71,9.71-4.35,9.71-9.71,9.71-9.71-4.35-9.71-9.71Zm37.88,14.82c-.17,.26-4.08,6.42-11.29,6.42s-11.02-6.18-11.18-6.44c-.57-.95-.27-2.18,.68-2.75,.94-.57,2.17-.26,2.74,.68,.13,.21,2.85,4.51,7.76,4.51s7.87-4.49,7.89-4.53c.59-.94,1.82-1.23,2.76-.64,.94,.58,1.22,1.82,.64,2.75Zm6.51-5.11c-5.36,0-9.71-4.35-9.71-9.71s4.35-9.71,9.71-9.71,9.7,4.35,9.7,9.71-4.34,9.71-9.7,9.71Z";

export type BrandLogoProps = {
  /** Color del icono y del texto (p. ej. `#fff8f2`, `var(--color-ink)`). Si se omite, aplica el estilo por defecto (p. ej. desde `.lp-footer .lp-logo`). */
  color?: string;
  className?: string;
  href?: string;
  /** Si es false, renderiza un `div` (útil dentro de otro enlace, como el brand del dashboard). */
  withLink?: boolean;
  "aria-label"?: string;
};

export function BrandLogo({
  color,
  className = "",
  href = "/",
  withLink = true,
  "aria-label": ariaLabel = "Mentesana, inicio",
}: BrandLogoProps) {
  const style = color ? { color } : undefined;
  const cls = ["lp-logo", className].filter(Boolean).join(" ");

  const mark = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 151.24 111.78"
      className="lp-logo__icon"
      aria-hidden
      focusable="false"
    >
      <path fill="currentColor" d={LOGO_PATH} />
    </svg>
  );

  const inner = (
    <>
      {mark}
      <span className="lp-logo__text">Mentesana</span>
    </>
  );

  if (withLink) {
    return (
      <a href={href} className={cls} style={style} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }

  return (
    <div className={cls} style={style}>
      {inner}
    </div>
  );
}
