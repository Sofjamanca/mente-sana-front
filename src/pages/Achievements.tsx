import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  LockKeyhole,
  Sparkles,
  Trophy,
} from "lucide-react";
import "../styles/Achievements.css";

type AchievementStatus = "LOCKED" | "IN_PROGRESS" | "UNLOCKED";
type Achievement = {
  key: string;
  title: string;
  description: string;
  category: string;
  icon: string;
  tone: string;
  target: number;
  current: number;
  status: AchievementStatus;
  unlockedAt: string | null;
};

type FilterKey = "all" | "constancia" | "autoconocimiento" | "bienestar" | "exploracion";

const landingAsset = (name: string) => `/landing/${name}`;
const badgeAsset = (name: string) => `/badges/${name}`;

const categoryLabel: Record<FilterKey, string> = {
  all: "Todos",
  constancia: "Constancia",
  autoconocimiento: "Autoconocimiento",
  bienestar: "Bienestar activo",
  exploracion: "Exploracion",
};

const categoryKeyMap: Record<string, FilterKey> = {
  constancia: "constancia",
  autoconocimiento: "autoconocimiento",
  bienestar: "bienestar",
  "bienestar activo": "bienestar",
  exploracion: "exploracion",
};

const categoryTone: Record<FilterKey, string> = {
  all: "purple",
  constancia: "coral",
  autoconocimiento: "pink",
  bienestar: "mint",
  exploracion: "sky",
};

const normalizeText = (value: string) =>
  (value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const keyToFilter: Record<string, FilterKey> = {
  first_step: "constancia",
  present_3_days: "constancia",
  streak_7: "constancia",
  steady_pulse: "constancia",
  emotional_explorer: "autoconocimiento",
  know_myself: "autoconocimiento",
  calm_kit: "bienestar",
  curious_mind: "exploracion",
};

const resolveFilterForAchievement = (achievement: Achievement): FilterKey => {
  if (keyToFilter[achievement.key]) return keyToFilter[achievement.key];
  const normalized = normalizeText(achievement.category);
  return categoryKeyMap[normalized] || "constancia";
};

const subtitleByKey: Record<string, string> = {
  first_step: "Completa tu primer check-in.",
  present_3_days: "Realiza check-in 3 días seguidos.",
  emotional_explorer: "Completa 10 check-ins.",
  streak_7: "Mantén tu racha durante 7 días seguidos.",
  know_myself: "Escribe en tu diario 7 días diferentes.",
  calm_kit: "Usa 5 herramientas de respiración o meditación.",
  curious_mind: "Lee 3 artículos o recursos de la biblioteca.",
  steady_pulse: "Registra tu estado de ánimo durante 4 semanas seguidas.",
};

const progressPercent = (achievement: Achievement) => {
  if (!achievement.target || achievement.target <= 0) return 0;
  return Math.min(100, Math.round((achievement.current / achievement.target) * 100));
};

const Achievements = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/achievements", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) return;
      const data = await response.json();
      setAchievements(data.achievements || []);
    };

    fetchAchievements();
  }, []);

  const unlockedCount = achievements.filter((item) => item.status === "UNLOCKED").length;
  const inProgressCount = achievements.filter((item) => item.status === "IN_PROGRESS").length;
  const lockedCount = achievements.filter((item) => item.status === "LOCKED").length;
  const totalCount = achievements.length;
  const overallProgress = totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  const nextAchievement = useMemo(() => {
    return (
      achievements
        .filter((item) => item.status !== "UNLOCKED")
        .sort((a, b) => progressPercent(b) - progressPercent(a))[0] || null
    );
  }, [achievements]);

  return (
    <div className="achievements-page">
      <section className="achievements-hero dash-card">
        <div className="achievements-hero__copy">
          <span className="achievements-eyebrow">
            <Sparkles size={14} aria-hidden="true" />
            Tu progreso personal
          </span>
          <h1>
            Mis <em>logros.</em>
          </h1>
          <p>
            Medallas pensadas para reconocer constancia, autoconocimiento y pequeños pasos de cuidado diario.
          </p>
          <div className="achievements-hero__actions" aria-label="Resumen de estados">
            <span><CheckCircle2 size={16} /> {unlockedCount} desbloqueados</span>
            <span><Trophy size={16} /> {inProgressCount} en progreso</span>
            <span><LockKeyhole size={16} /> {lockedCount} por descubrir</span>
          </div>
        </div>

        <div className="achievements-hero__visual" aria-hidden="true">
          <img className="achievements-hero__star" src={landingAsset("star.png")} alt="" />
          <div className="achievements-progress-orb" style={{ "--progress": `${overallProgress}%` } as React.CSSProperties}>
            <span>{overallProgress}%</span>
            <small>completo</small>
          </div>
          <img className="achievements-hero__mascot" src={landingAsset("mascota3.png")} alt="" />
        </div>

        <article className="achievements-next-card">
          <div className="achievements-next-card__badge">
            <img src={badgeAsset(nextAchievement?.icon || "badge_9.png")} alt="" aria-hidden="true" />
          </div>
          <div>
            <span>Proximo logro</span>
            <strong>{nextAchievement?.title || "Todo al día"}</strong>
            <p>
              {nextAchievement
                ? subtitleByKey[nextAchievement.key] || nextAchievement.description
                : "Ya desbloqueaste todos los logros disponibles."}
            </p>
          </div>
          {nextAchievement ? (
            <div
              className="achievements-next-card__track"
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={nextAchievement.target}
              aria-valuenow={nextAchievement.current}
              aria-label={`Progreso hacia ${nextAchievement.title}`}
            >
              <i style={{ width: `${progressPercent(nextAchievement)}%` }} />
            </div>
          ) : null}
        </article>
      </section>

      <section className="achievements-grid">
        {achievements.map((achievement) => {
          const pct = progressPercent(achievement);
          const completed = achievement.status === "UNLOCKED";
          const blocked = achievement.status === "LOCKED";
          const filterKey = resolveFilterForAchievement(achievement);

          return (
            <article
              className={`achievement-card dash-card tone-${categoryTone[filterKey]} ${completed ? "is-unlocked" : blocked ? "is-locked" : "is-progress"}`}
              key={achievement.key}
            >
              <div className="achievement-card__topline">
                <span>{categoryLabel[filterKey]}</span>
                <strong>{pct}%</strong>
              </div>
              <div className="achievement-card__icon-wrap">
                <img src={badgeAsset(achievement.icon || "badge_1.png")} alt="" aria-hidden="true" />
              </div>
              <h3>{achievement.title}</h3>
              <p>{subtitleByKey[achievement.key] || achievement.description}</p>
              <div
                className="achievement-card__progress"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={achievement.target}
                aria-valuenow={achievement.current}
                aria-label={`Progreso de ${achievement.title}`}
              >
                <i><b style={{ width: `${pct}%` }} /></i>
                <span>{achievement.current}/{achievement.target}</span>
              </div>
              <div className={`achievement-card__status ${completed ? "done" : blocked ? "locked" : "progress"}`}>
                {completed ? "Completado" : blocked ? "Bloqueado" : "En progreso"}
              </div>
            </article>
          );
        })}
        {achievements.length === 0 ? (
          <article className="achievement-card achievement-card--empty dash-card">
            <Sparkles size={28} aria-hidden="true" />
            <h3>Sin resultados</h3>
            <p>Todavia no hay logros disponibles.</p>
          </article>
        ) : null}
      </section>

      <section className="achievements-footer-row dash-card">
        <div className="achievements-footer-mascot">
          <img src={landingAsset("mascota_cta.png")} alt="" aria-hidden="true" />
          <div>
            <h4>Cada acción cuenta</h4>
            <p>Tus logros no miden perfección. Registran pequeños hábitos que pueden sostenerte mejor.</p>
          </div>
        </div>
        <button
          type="button"
          className="achievements-footer-cta"
          onClick={() => {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          Ver todos <span aria-hidden="true">{'->'}</span>
        </button>
      </section>
    </div>
  );
};

export default Achievements;

