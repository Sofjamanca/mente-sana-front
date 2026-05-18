import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  ChevronRight,
  Flame,
  LineChart,
  Lock,
  Plus,
  Send,
  Sparkles,
  Target,
  Trophy,
  WandSparkles,
  X,
} from "lucide-react";
import {
  MoodFace,
  moodScale,
  getMoodByValue,
  useAnimatedValue,
} from "../components/MoodFace";
import GuidedMeditation from "../components/GuidedMeditation";
import MemoryGameModal from "../components/MemoryGameModal";
import AnxietyPatterns from "../components/AnxietyPatterns";
import MotivationalQuote from "../components/MotivationalQuote";
import AiMessageContent from "../components/AiMessageContent";
import UserDashboardShell from "../components/UserDashboardShell";
import { CheckinWeekToggle } from "../components/CheckinWeekToggle";
import {
  buildWeekDaysForAnchor,
  formatLocalDate,
  getMondayBasedDayIndex,
} from "../utils/checkinWeek";
import { TEEN_RESOURCES } from "../data/teenResources";
import { useUser } from "../contexts/UserContext";
import "../styles/Home.css";

type Entry = {
  id: string;
  entryDate?: string;
  date: string;
  mood: number;
  energy: number;
  sleepHours: number;
  notes: string;
  aiMessage: string | null;
  aiMessageData?: {
    title?: string;
    summary?: string;
    steps?: string[];
    closing?: string;
  } | null;
};

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

type AchievementHighlights = {
  latestUnlocked: Achievement | null;
  inProgress: Achievement[];
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const toDateKeys = (entries: Entry[]) =>
  [...new Set(entries.map((entry) => entry.date).filter(Boolean))];

const parseDateKey = (dateKey: string) => {
  const [year, month, day] = dateKey.split("-").map((part) => Number(part));
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const computeCurrentStreak = (entries: Entry[]) => {
  if (!entries.length) return 0;
  const dates = new Set(toDateKeys(entries));
  let count = 0;
  const cursor = new Date();

  while (dates.has(formatLocalDate(cursor))) {
    count += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  return count;
};

const computeBestStreak = (entries: Entry[]) => {
  const uniqueDates = toDateKeys(entries).sort();
  if (!uniqueDates.length) return 0;

  let best = 1;
  let current = 1;
  let previous = parseDateKey(uniqueDates[0]);
  if (!previous) return 0;

  for (let index = 1; index < uniqueDates.length; index += 1) {
    const currentDate = parseDateKey(uniqueDates[index]);
    if (!currentDate) continue;

    const diffDays = Math.round((currentDate.getTime() - previous.getTime()) / MS_PER_DAY);
    if (diffDays === 1) {
      current += 1;
    } else {
      current = 1;
    }

    if (current > best) {
      best = current;
    }
    previous = currentDate;
  }

  return best;
};

const asset = (name: string) => `/landing/${name}`;
const elementAsset = (name: string) => `/elementos/${name}`;
const badgeAsset = (name: string) => `/badges/${name}`;

type ToolActivity =
  | "breathing"
  | "memory"
  | "patterns"
  | "sounds"
  | "journal";

interface Tool {
  title: string;
  copy: string;
  image: string;
  tone: string;
  duration: string;
  activity: ToolActivity;
}

const tools: Tool[] = [
  {
    title: "Respiración 4-7-8",
    copy: "Calma tu sistema nervioso paso a paso.",
    image: "hot.png",
    tone: "purple",
    duration: "5 min",
    activity: "breathing",
  },
  {
    title: "Juego de memoria",
    copy: "Distrae la mente con un ejercicio cognitivo.",
    image: "badge_smile.png",
    tone: "mint",
    duration: "10 min",
    activity: "memory",
  },
  {
    title: "Patrones de ansiedad",
    copy: "Identificá qué dispara tus emociones.",
    image: "alert.png",
    tone: "coral",
    duration: "15 min",
    activity: "patterns",
  },
  {
    title: "Sonidos relajantes",
    copy: "Olas, lluvia y ambientes para acompañarte.",
    image: "heart_alt.png",
    tone: "pink",
    duration: "",
    activity: "sounds",
  },
];

const resourceVisuals = [
  { image: "mascota_explorar.png", tone: "green" },
  { image: "mascota2.png", tone: "lavender" },
  { image: "mascota_coral.png", tone: "peach" },
] as const;

const achievementMetaByKey: Record<string, { label: string; tone: string }> = {
  first_step: { label: "Constancia", tone: "coral" },
  present_3_days: { label: "Constancia", tone: "coral" },
  streak_7: { label: "Constancia", tone: "coral" },
  steady_pulse: { label: "Constancia", tone: "coral" },
  emotional_explorer: { label: "Autoconocimiento", tone: "pink" },
  know_myself: { label: "Autoconocimiento", tone: "pink" },
  calm_kit: { label: "Bienestar", tone: "mint" },
  curious_mind: { label: "Exploracion", tone: "sky" },
};

const achievementSubtitleByKey: Record<string, string> = {
  first_step: "Completa tu primer check-in.",
  present_3_days: "Realiza check-in 3 días seguidos.",
  emotional_explorer: "Completa 10 check-ins.",
  streak_7: "Mantén tu racha durante 7 días seguidos.",
  know_myself: "Escribe en tu diario 7 días diferentes.",
  calm_kit: "Usa 5 herramientas de respiracion o meditacion.",
  curious_mind: "Lee 3 articulos o recursos de la biblioteca.",
  steady_pulse: "Registra tu estado de ánimo durante 4 semanas seguidas.",
};

const getAchievementMeta = (achievement: Achievement) =>
  achievementMetaByKey[achievement.key] || {
    label: achievement.category || "Logro",
    tone: "purple",
  };

const getAchievementProgress = (achievement: Achievement) => {
  if (!achievement.target || achievement.target <= 0) return 0;
  return Math.min(100, Math.round((achievement.current / achievement.target) * 100));
};

const getHomeAchievementPreview = (achievements: Achievement[]) => {
  const completed = achievements.find((achievement) => achievement.status === "UNLOCKED");
  const inProgress = achievements
    .filter((achievement) => achievement.status === "IN_PROGRESS")
    .sort((a, b) => getAchievementProgress(b) - getAchievementProgress(a))
    .slice(0, 2);
  const locked = achievements.find((achievement) => achievement.status === "LOCKED");
  const selectedKeys = new Set([completed, ...inProgress, locked].filter(Boolean).map((item) => item!.key));
  const fallback = achievements.filter((achievement) => !selectedKeys.has(achievement.key));

  return ([completed, ...inProgress, locked, ...fallback].filter(Boolean) as Achievement[]).slice(0, 4);
};

const resolveUnlockedAchievement = (
  unlocked: unknown,
  currentAchievements: Achievement[]
): Achievement | null => {
  if (!unlocked) return null;

  if (typeof unlocked === "string") {
    return currentAchievements.find((achievement) => achievement.key === unlocked || achievement.title === unlocked) || null;
  }

  if (typeof unlocked === "object" && "title" in unlocked) {
    return unlocked as Achievement;
  }

  return null;
};

const resources = TEEN_RESOURCES.slice(0, 6).map((resource, index) => {
  const visual = resourceVisuals[index % resourceVisuals.length];
  return {
    id: resource.id,
    kind: "Articulo",
    title: resource.title,
    meta: `${resource.readTime} de lectura`,
    image: visual.image,
    tone: visual.tone,
  };
});

const progressStats = [
  { label: "Check-ins", value: "18", detail: "este mes", tone: "purple", icon: CalendarDays },
  { label: "Estabilidad", value: "72%", detail: "+8% vs semana anterior", tone: "mint", icon: LineChart },
  { label: "Herramientas", value: "9", detail: "practicas completadas", tone: "coral", icon: Sparkles },
  { label: "Objetivos", value: "4/5", detail: "en curso", tone: "yellow", icon: Target },
];

const progressHabits = [
  ["Sueno", "7.2 h", "72%"],
  ["Calma", "6.8/10", "68%"],
  ["Energia", "7.6/10", "76%"],
  ["Ansiedad baja", "5 días", "71%"],
];

const progressCalendar = [
  "mint", "mint", "yellow", "purple", "mint", "coral", "mint",
  "yellow", "mint", "mint", "blue", "purple", "mint", "mint",
  "coral", "yellow", "mint", "mint", "purple", "mint", "blue",
  "mint", "mint", "yellow", "coral", "mint", "mint", "purple",
];




const ProgressView = ({
  streak,
  bestStreak,
  achievements,
}: {
  streak: number;
  bestStreak: number;
  achievements: Achievement[];
}) => (
  <div className="progress-view">
    <section className="progress-hero dash-card">
      <div className="progress-hero-copy">
        <span>Progreso emocional</span>
        <h1>Tu constancia ya esta formando un mapa claro de bienestar.</h1>
        <p>
          Tu progreso se actualiza con tus check-ins, herramientas y recursos.
        </p>
        <div className="progress-hero-actions">
          <button><Plus size={18} /> Agregar registro</button>
          <button className="soft"><CalendarDays size={18} /> Ver resumen</button>
        </div>
      </div>

      <div className="progress-hero-meter" aria-label="Racha actual">
        <div className="meter-ring">
          <span>{streak}</span>
          <small>días</small>
        </div>
        <strong>Racha activa</strong>
        <p>
          {bestStreak > 0 ? `Tu mejor racha fue de ${bestStreak} dia${bestStreak === 1 ? "" : "s"}.` : "Todavia no tenes rachas registradas."}
        </p>
        <img src={asset("mascota_cta.png")} alt="" />
      </div>
    </section>

    <section className="progress-stat-grid">
      {progressStats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article key={stat.label} className={`progress-stat dash-card ${stat.tone}`}>
            <span><Icon size={22} /></span>
            <div>
              <small>{stat.label}</small>
              <strong>{stat.value}</strong>
              <p>{stat.detail}</p>
            </div>
          </article>
        );
      })}
    </section>

    <section className="progress-main-grid">
      <article className="progress-chart-panel dash-card">
        <div className="section-title-row">
          <div>
            <h3>Evolucion de bienestar</h3>
            <p>Promedio combinado de ánimo, energía, sueño y calma.</p>
          </div>
          <button>30 días</button>
        </div>
        <div className="progress-chart">
          {[34, 46, 41, 58, 52, 66, 62, 76, 71, 82, 78, 86].map((height, index) => (
            <span key={index} style={{ height: `${height}%` }}>
              <i />
            </span>
          ))}
        </div>
        <div className="progress-chart-labels">
          <span>Semana 1</span>
          <span>Semana 2</span>
          <span>Semana 3</span>
          <span>Semana 4</span>
        </div>
      </article>

      <article className="progress-milestones dash-card">
        <div className="card-heading icon-heading">
          <Trophy size={24} />
          <div>
            <h3>Logros en curso</h3>
            <p>Metas que sostienen tu avance.</p>
          </div>
        </div>
        <div className="milestone-list">
          {achievements
            .filter((achievement) => achievement.status !== "LOCKED")
            .slice(0, 4)
            .map((item) => {
              const pct = Math.round((item.current / item.target) * 100);
              return (
            <div className="milestone-item" key={item.title}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.description}</p>
              </div>
              <span>{pct}%</span>
              <i><b style={{ width: `${pct}%` }} /></i>
            </div>
              );
            })}
        </div>
      </article>
    </section>

    <section className="progress-bottom-grid">
      <article className="progress-habits dash-card">
        <div className="card-heading icon-heading">
          <Target size={22} />
          <div>
            <h3>Habitos clave</h3>
            <p>Señales que más impactan tu bienestar.</p>
          </div>
        </div>
        {progressHabits.map(([label, value, width]) => (
          <div className="progress-habit-row" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <i><b style={{ width }} /></i>
          </div>
        ))}
      </article>

      <article className="progress-calendar-card dash-card">
        <div className="card-heading icon-heading">
          <CalendarDays size={22} />
          <div>
            <h3>Calendario de ánimo</h3>
            <p>Lectura rápida de los últimos 28 días.</p>
          </div>
        </div>
        <div className="progress-calendar-grid">
          {progressCalendar.map((tone, index) => (
            <span key={`${tone}-${index}`} className={tone}>{index + 1}</span>
          ))}
        </div>
      </article>

      <article className="progress-insight dash-card">
        <div className="card-heading icon-heading">
          <WandSparkles size={22} />
          <div>
            <h3>Insight principal</h3>
            <p>Patron detectado en tus registros.</p>
          </div>
        </div>
        <div className="progress-insight-body">
          <LineChart size={44} />
          <strong>Tu estado mejora cuando registras antes de dormir.</strong>
          <p>
            En los días con check-in nocturno, el promedio de calma subió 18%.
            Conviene mantener ese momento como rutina.
          </p>
        </div>
      </article>
    </section>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const { userProfile } = useUser();
  const userFirstName = useMemo(() => {
    const n = userProfile?.name?.trim();
    if (!n) return null;
    return n.split(/\s+/)[0] ?? null;
  }, [userProfile?.name]);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeView, setActiveView] = useState("Hoy");
  const [moodValue, setMoodValue] = useState<number | null>(null);
  const [noteText, setNoteText] = useState("");
  const [checkinSent, setCheckinSent] = useState(false);
  const [selectedCheckinIndex, setSelectedCheckinIndex] = useState(() =>
    getMondayBasedDayIndex(new Date())
  );
  const [suppressEntrySyncDate, setSuppressEntrySyncDate] = useState<string | null>(null);
  const [checkinError, setCheckinError] = useState("");
  const [checkinSaving, setCheckinSaving] = useState(false);
  const [openActivity, setOpenActivity] = useState<ToolActivity | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementHighlights, setAchievementHighlights] = useState<AchievementHighlights>({
    latestUnlocked: null,
    inProgress: [],
  });
  const [achievementPopup, setAchievementPopup] = useState<Achievement | null>(null);

  const todayDateStr = formatLocalDate(new Date());

  const weekSlots = useMemo(() => {
    const base = buildWeekDaysForAnchor(new Date());
    return base.map((slot) => {
      const entry = entries.find((e) => e.date === slot.dateStr);
      return { ...slot, mood: entry ? Number(entry.mood) : null };
    });
  }, [entries]);

  const selectedDateStr = weekSlots[selectedCheckinIndex]?.dateStr ?? "";
  const selectedDayFull = weekSlots[selectedCheckinIndex]?.full ?? "";
  const isCheckinDayToday = selectedDateStr === todayDateStr;
  const selectedEntry = entries.find((entry) => entry.date === selectedDateStr);
  const selectedAiMessage =
    selectedEntry?.aiMessage?.trim() ||
    "Tu registro quedó guardado. Si querés, mañana podés volver a contar cómo te sentiste para seguir viendo tu evolución.";
  const selectedAiMessageData = selectedEntry?.aiMessageData || null;

  useEffect(() => {
    const today = formatLocalDate(new Date());
    const sel = weekSlots[selectedCheckinIndex]?.dateStr;
    if (sel && sel > today) {
      const idx = weekSlots.findIndex((d) => d.dateStr === today);
      if (idx >= 0) setSelectedCheckinIndex(idx);
    }
  }, [weekSlots, selectedCheckinIndex]);

  useEffect(() => {
    if (!selectedDateStr) return;
    if (suppressEntrySyncDate === selectedDateStr) return;

    const entry = entries.find((e) => e.date === selectedDateStr);
    if (entry) {
      setMoodValue(Number(entry.mood));
      setNoteText(entry.notes || "");
      setCheckinSent(true);
    } else {
      setMoodValue(null);
      setNoteText("");
      setCheckinSent(false);
    }
  }, [selectedDateStr, entries, suppressEntrySyncDate]);

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
    setAchievementHighlights(
      data.highlights || {
        latestUnlocked: null,
        inProgress: [],
      }
    );
  };

  const registerAchievementEvent = async (
    payload: { eventType: string; toolType?: string; resourceId?: number }
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/achievements/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) return;
      const data = await response.json();
      setAchievements(data.achievements || []);
      setAchievementHighlights(
        data.highlights || {
          latestUnlocked: null,
          inProgress: [],
        }
      );
      if (Array.isArray(data.unlockedNow) && data.unlockedNow.length > 0) {
        setAchievementPopup(resolveUnlockedAchievement(data.unlockedNow[0], data.achievements || achievements));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenActivity = (activity: ToolActivity) => {
    setOpenActivity(activity);
    if (activity === "breathing" || activity === "memory" || activity === "patterns") {
      registerAchievementEvent({ eventType: "tool_completed", toolType: activity });
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDashboardNav = (label: string) => {
    setActiveView(label);

    switch (label) {
      case "Hoy":
        window.scrollTo({ top: 0, behavior: "smooth" });
        break;
      case "Check-in":
        scrollToSection("home-checkin");
        break;
      case "Resumen":
        navigate("/daily-summary");
        break;
      case "Herramientas":
        scrollToSection("home-tools");
        break;
      case "Mis logros":
        navigate("/achievements");
        break;
      case "Recursos":
        scrollToSection("home-resources");
        break;
      case "Números útiles":
        navigate("/contacts");
        break;
      case "Mi Perfil":
        navigate("/profile/edit");
        break;
      default:
        break;
    }
  };

  const handleCloseActivity = () => {
    setOpenActivity(null);
  };

  const animatedMood = useAnimatedValue(moodValue ?? 4, 480);
  const previewMood = getMoodByValue(moodValue ?? 4);
  const selectedMoodData = moodValue ? getMoodByValue(moodValue) : null;
  const sliderPercent = (((moodValue ?? 4) - 1) / 4) * 100;

  const handleSelectCheckinDay = (index: number) => {
    const dayStr = weekSlots[index]?.dateStr;
    if (!dayStr || dayStr > todayDateStr) return;
    setSuppressEntrySyncDate(null);
    setCheckinError("");
    setSelectedCheckinIndex(index);
  };

  const handleSendCheckin = async () => {
    if (!moodValue || !selectedDateStr) return;
    setCheckinSaving(true);
    setCheckinError("");
    try {
      const token = localStorage.getItem("token");
      const moodToSave = Math.round(moodValue);
      const existing = entries.find((e) => e.date === selectedDateStr);

      const response = existing
        ? await fetch(`/api/daily-entries/${existing.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ mood: moodToSave, notes: noteText }),
          })
        : await fetch("/api/daily-entries", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              mood: moodToSave,
              notes: noteText,
              date: selectedDateStr,
            }),
          });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setCheckinError(
          typeof data.message === "string" ? data.message : "No se pudo guardar el check-in."
        );
        return;
      }

      const saved = await response.json();
      const date = saved.entryDate || (saved.date || selectedDateStr).split("T")[0];
      setEntries((prev) => {
        const filtered = prev.filter((e) => e.date !== date);
        return [
          ...filtered,
          {
            id: saved.id,
            entryDate: saved.entryDate || date,
            date,
            mood: Number(saved.mood),
            energy: Number(saved.energy ?? 0),
            sleepHours: Number(saved.sleepHours ?? 0),
            notes: saved.notes ?? noteText,
            aiMessage: saved.aiMessage ?? null,
            aiMessageData: saved.aiMessageData || null,
          },
        ];
      });
      setSuppressEntrySyncDate(null);
      setCheckinSent(true);
      if (Array.isArray(saved.unlockedAchievements) && saved.unlockedAchievements.length > 0) {
        setAchievementPopup(resolveUnlockedAchievement(saved.unlockedAchievements[0], achievements));
      }
      await fetchAchievements();
    } catch (e) {
      console.error(e);
      setCheckinError("Error de conexión al guardar.");
    } finally {
      setCheckinSaving(false);
    }
  };

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          "/api/daily-entries",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const list = await response.json();
          setEntries(
            list.map((entry: Entry) => ({
              ...entry,
              date: entry.entryDate || (entry.date || "").split("T")[0],
              mood: Number(entry.mood),
            }))
          );
        }
      } catch (error) {
        console.error("Error cargando dashboard:", error);
      }
    };

    fetchEntries();
    fetchAchievements();
  }, []);

  useEffect(() => {
    if (!achievementPopup) return;
    const timer = window.setTimeout(() => setAchievementPopup(null), 7000);
    return () => window.clearTimeout(timer);
  }, [achievementPopup]);

  const streak = useMemo(() => {
    return computeCurrentStreak(entries);
  }, [entries]);

  const bestStreak = useMemo(() => computeBestStreak(entries), [entries]);

  const explorerAchievement = useMemo(() => {
    const fallback = { goal: 10, current: 0, pct: 0 };
    const explorer = achievements.find((achievement) => achievement.key === "emotional_explorer");
    if (!explorer) return fallback;
    const current = Math.min(explorer.current, explorer.target);
    return {
      goal: explorer.target,
      current,
      pct: Math.round((current / explorer.target) * 100),
    };
  }, [achievements]);

  const lastAchievementBadge = useMemo(() => {
    const latest = achievementHighlights.latestUnlocked;
    if (latest) {
      const completed =
        latest.status === "UNLOCKED" &&
        (latest.target <= 0 || latest.current >= latest.target);
      if (completed) return { label: "Completado" as const, variant: "completed" as const };
      if (latest.status === "UNLOCKED") return { label: "Desbloqueado" as const, variant: "unlocked" as const };
      return null;
    }
    if (explorerAchievement.current >= explorerAchievement.goal) {
      return { label: "Completado" as const, variant: "completed" as const };
    }
    return null;
  }, [achievementHighlights.latestUnlocked, explorerAchievement]);

  const sidebarFooter = (
    <>
      

      <div className="dash-sidebar-note">
        <Sparkles size={28} />
        <strong>Esta bien ir paso a paso.</strong>
        <p>Pequeños avances, grandes cambios.</p>
        <img src={asset("hero_mascota.png")} alt="" />
      </div>
    </>
  );

  return (
    <UserDashboardShell
      activeLabel={activeView}
      onSidebarNav={handleDashboardNav}
      sidebarFooter={sidebarFooter}
    >

        {activeView === "Progreso" ? (
          <ProgressView streak={streak} bestStreak={bestStreak} achievements={achievements} />
        ) : (
          <>
        <section className="dash-hero-row" id="home-checkin">
          <div className="checkin-flow">
          {!checkinSent ? (
            <article className="dash-card checkin-card" key="checkin-form">
              <div className="checkin-head">
                <h2>
                  {isCheckinDayToday ? (
                    <>
                      ¿Cómo te <em>sentís</em> hoy?
                    </>
                  ) : (
                    <>
                      ¿Cómo te <em>sentiste</em> el {selectedDayFull.toLowerCase()}?
                    </>
                  )}
                </h2>
                <CheckinWeekToggle
                  days={weekSlots}
                  selectedIndex={selectedCheckinIndex}
                  onSelect={handleSelectCheckinDay}
                  variant="home"
                />
              </div>

              <div className="checkin-step">
                <span className="checkin-step-label">
                  <i>1</i>{" "}
                  {isCheckinDayToday
                    ? "Deslizá para elegir cómo te sentís"
                    : "Deslizá para elegir cómo te sentiste"}
                </span>

                <div className={`checkin-mood-hero tone-${previewMood.tone} ${moodValue ? "is-selected" : "is-empty"}`}>
                  <div className="checkin-mood-hero__face">
                    <MoodFace value={animatedMood} tone={previewMood.tone} interactive />
                  </div>
                  <strong
                    className="checkin-mood-hero__label"
                    key={moodValue ? previewMood.label : "empty"}
                  >
                    {moodValue ? previewMood.label : "Despalza la barra"}
                  </strong>
                </div>

                <div
                  className={`checkin-slider-wrap tone-${previewMood.tone}`}
                  style={{ ["--slider-fill" as string]: `${sliderPercent}%` }}
                >
                  <input
                    type="range"
                    min={1}
                    max={5}
                    step={1}
                    value={moodValue ?? 4}
                    onChange={(e) => setMoodValue(Number(e.target.value))}
                    className="checkin-slider"
                    aria-label="Estado de ánimo"
                  />
                  <div className="checkin-slider-ticks" aria-hidden="true">
                    {moodScale.map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        className={`checkin-slider-tick tone-${m.tone} ${moodValue === m.value ? "is-active" : ""}`}
                        onClick={() => setMoodValue(m.value)}
                        title={m.label}
                        aria-label={m.label}
                      >
                        <MoodFace value={m.value} tone={m.tone} idle />
                      </button>
                    ))}
                  </div>
                  <div className="checkin-slider-labels" aria-hidden="true">
                    <span>Triste</span>
                    <span>Neutral</span>
                    <span>Feliz</span>
                  </div>
                </div>
              </div>

              <div className="checkin-step">
                <span className="checkin-step-label">
                  <i>2</i> Contame qué pasa <small>(opcional)</small>
                </span>
                <textarea
                  className="checkin-textarea"
                  placeholder="Hoy me siento... porque..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={4}
                />
                <small className="checkin-textarea-hint">
                  {noteText.length > 0
                    ? `${noteText.length} caracteres`
                    : "Escribir te ayuda a entender mejor lo que estás sintiendo."}
                </small>
              </div>

              <div className="checkin-footer">
                {checkinError ? (
                  <p className="checkin-error" role="alert">
                    {checkinError}
                  </p>
                ) : null}
                <p><Lock size={16} strokeWidth={2.2} aria-hidden /> Tu check-in es privado y solo vos podés verlo.</p>
                <button
                  className="btn-primary checkin-submit"
                  type="button"
                  onClick={handleSendCheckin}
                  disabled={!moodValue || checkinSaving}
                >
                  {checkinSaving ? "Guardando..." : "Guardar Registro"}
                  {!checkinSaving && <Send size={16} strokeWidth={2.2} aria-hidden />}
                </button>
              </div>
            </article>
          ) : (
            <article className="dash-card message-card checkin-response" key="checkin-response">
              <div className="checkin-head">
                <h2>
                  Hola{userFirstName ? <>, <em>{userFirstName}</em></> : null}.
                </h2>
                <CheckinWeekToggle
                  days={weekSlots}
                  selectedIndex={selectedCheckinIndex}
                  onSelect={handleSelectCheckinDay}
                  variant="home"
                />
              </div>
              <div
                className={[
                  "checkin-response-bubble",
                  selectedMoodData ? `checkin-response-bubble--tone-${selectedMoodData.tone}` : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="checkin-response-bubble__grid">
                  <div className="checkin-response-bubble__copy">
                    {selectedMoodData && moodValue ? (
                      <div
                        className={`checkin-response-bubble__mood tone-${selectedMoodData.tone}`}
                        aria-label={`Emoción registrada: ${selectedMoodData.label}`}
                      >
                        <span className="checkin-response-bubble__mood-face">
                          <MoodFace
                            value={Math.round(moodValue)}
                            tone={selectedMoodData.tone}
                            idle
                          />
                        </span>
                        <strong className="checkin-response-bubble__mood-label">
                          {isCheckinDayToday
                            ? `Hoy me siento ${selectedMoodData.label}`
                            : `Me senti ${selectedMoodData.label}`}
                        </strong>
                      </div>
                    ) : null}
                    <div className="checkin-response-bubble__scroll-wrap">
                      <div
                        className="checkin-response-bubble__scroll"
                        tabIndex={0}
                        aria-label="Mensaje del check-in"
                      >
                      <AiMessageContent
                        className="checkin-response-bubble__body"
                        plainMessage={selectedAiMessage}
                        uiMessage={selectedAiMessageData}
                      />
                    </div>
                    </div>
                    <p
                      className="checkin-response-bubble__disclaimer"
                      role="note"
                    >
                      Este mensaje se generó con inteligencia artificial a partir de lo que
                      compartiste. No sustituye el acompañamiento de un profesional de la salud
                      mental: si algo te preocupa mucho o te sentís muy mal, es importante que
                      consultes con alguien especializado o de confianza.
                    </p>
                  </div>
                  <div className="checkin-response-bubble__visual" aria-hidden="true">
                    <img
                      className="checkin-response-bubble__mascot"
                      src={asset("landing_component2.png")}
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </article>
          )}
          </div>

        <aside className="dash-hero-side">
          <article className="dash-card progress-card">
            <div className="card-heading icon-heading flame-heading">
              <Flame size={25} />
              <div>
                <h2>Racha y progreso</h2>
              </div>
            </div>
            <div className="streak-big">
              <span>Días seguidos</span>
              <strong>{streak} {streak === 1 ? "dia" : "dias"}</strong>
              <img
                className="streak-big__icon"
                src={elementAsset("racha.png")}
                alt=""
                width={58}
                height={58}
                decoding="async"
                aria-hidden
              />
            </div>

            <div className="week-moods">
              <div className="week-moods__head">
                <span>Tu semana</span>
                <small>Lun → Dom</small>
              </div>
              <div className="week-moods__grid">
                {weekSlots.map((day, index) => {
                  const isToday = day.dateStr === todayDateStr;
                  const isFuture = day.dateStr > todayDateStr;
                  const moodForDay = day.mood;
                  const moodTone = moodForDay ? getMoodByValue(moodForDay).tone : null;
                  const isSelected = index === selectedCheckinIndex;

                  const classes = [
                    "week-mood",
                    isToday ? "is-today" : "",
                    !moodForDay ? "is-empty" : "",
                    isSelected ? "is-selected" : "",
                    isFuture ? "is-future" : "",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <button
                      type="button"
                      key={day.dateStr}
                      className={classes}
                      title={isFuture ? "No podés registrar días futuros" : day.full}
                      disabled={isFuture}
                      onClick={() => handleSelectCheckinDay(index)}
                    >
                      <span className="week-mood__label">{day.label}</span>
                      {moodForDay ? (
                        <span className={`week-mood__face tone-${moodTone ?? ""}`} aria-hidden="true">
                          <MoodFace value={moodForDay} tone={moodTone ?? "coral"} idle />
                        </span>
                      ) : (
                        <span className="week-mood__placeholder" aria-hidden="true">
                          {isToday ? "·" : ""}
                        </span>
                      )}
                      {isToday && <span className="week-mood__badge">Hoy</span>}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="card-heading icon-heading last-achievement-heading">
              <Trophy size={25} />
              <div>
                <h2 id="home-last-achievement-heading">Último logro</h2>
              </div>
            </div>

            <div
              className="achievement-panel"
              role="region"
              aria-labelledby="home-last-achievement-heading"
            >
              <div className="achievement-panel__visual" aria-hidden="true">
                <img
                  src={badgeAsset(achievementHighlights.latestUnlocked?.icon || "badge_9.png")}
                  alt=""
                />
              </div>
              <div className="achievement-panel__content">
                <div className="achievement-panel__title-row">
                  <strong className="achievement-panel__title">
                    {achievementHighlights.latestUnlocked?.title || "Explorador"}
                  </strong>
                  {lastAchievementBadge ? (
                    <span
                      className={`achievement-panel__status-badge achievement-panel__status-badge--${lastAchievementBadge.variant}`}
                    >
                      {lastAchievementBadge.label}
                    </span>
                  ) : null}
                </div>
                <p className="achievement-panel__hint">
                  {achievementHighlights.latestUnlocked
                    ? (
                        achievementHighlights.latestUnlocked.description?.trim() ||
                        achievementSubtitleByKey[achievementHighlights.latestUnlocked.key] ||
                        ""
                      )
                    : explorerAchievement.current >= explorerAchievement.goal
                      ? "Completaste 10 días con check-in. ¡Sigue explorando!"
                      : `Completá ${explorerAchievement.goal} días con check-in para desbloquearlo.`}
                </p>
              </div>
            </div>
          </article>

          {!checkinSent ? (
            <article className="dash-card home-quote-card">
              <div className="card-heading icon-heading">
                <div />
              </div>
              <MotivationalQuote />
            </article>
          ) : null}
        </aside>
        </section>

        <section className="dash-mid-grid" id="home-tools">
          <article className="dash-card today-tools">
            <div className="card-heading icon-heading">
              <CalendarDays size={22} />
              <div>
                <h2>Para ti hoy</h2>
                <p>Actividades para acompañarte</p>
              </div>
            </div>
            <div className="tool-list" role="list">
              {tools.map((tool) => {
                const isComingSoon = tool.activity === "sounds" || tool.activity === "journal";
                return (
                  <button
                    key={tool.title}
                    type="button"
                    className="tool-row"
                    onClick={() => !isComingSoon && handleOpenActivity(tool.activity)}
                    disabled={isComingSoon}
                  >
                    <span className={`tool-icon ${tool.tone}`} aria-hidden>
                      <img src={elementAsset(tool.image)} alt="" />
                    </span>
                    <span className="tool-text">
                      <span className="tool-title">{tool.title}</span>
                      <span className="tool-desc">{tool.copy}</span>
                    </span>
                    <span className="tool-meta">
                      <span className="tool-duration">{tool.duration}</span>
                      <span className="tool-action">
                        {isComingSoon ? (
                          <span className="tool-soon">Pronto</span>
                        ) : (
                          <ChevronRight size={18} strokeWidth={2.2} aria-hidden />
                        )}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
            <a className="text-action-link">Ver todas las herramientas <ChevronRight size={15} /></a>
          </article>

          <article className="dash-card week-card">
            <div className="card-heading icon-heading">
              <Trophy size={22} />
              <div>
                <h2>Mis logros</h2>
                <p>Medallas que podes desbloquear</p>
              </div>
            </div>
            <div className="achievements-row">
              {getHomeAchievementPreview(achievements)
                .map((achievement) => {
                  const pct = getAchievementProgress(achievement);
                  const meta = getAchievementMeta(achievement);
                  const isLocked = achievement.status === "LOCKED";
                  const isCompleted = achievement.status === "UNLOCKED";
                  return (
                    <article
                      className={`achievement-chip-card tone-${meta.tone} ${
                        isCompleted ? "is-completed" : isLocked ? "is-locked" : "is-progress"
                      }`}
                      key={achievement.key}
                    >
                      <img
                        src={badgeAsset(achievement.icon || "badge_1.png")}
                        alt=""
                        aria-hidden="true"
                      />
                      <div className="achievement-chip-card__copy">
                        <strong className="achievement-chip-card__title">{achievement.title}</strong>
                        <p>{achievementSubtitleByKey[achievement.key] || achievement.description}</p>
                      </div>
                      <div className="achievement-chip-card__progress">
                        <i aria-hidden="true">
                        <b style={{ width: `${pct}%` }} />
                        </i>
                        <span>{achievement.current}/{achievement.target}</span>
                      </div>
                    </article>
                  );
                })}
            </div>
            <button
              type="button"
              className="text-action-link achievements-view-all"
              onClick={() => navigate("/achievements")}
            >
              Ver mis logros <ChevronRight size={16} />
            </button>
          </article>

        </section>

        <section className="dash-card resources-card" id="home-resources">
          <div className="section-title-row">
            <div className="card-heading icon-heading">
              <BookOpen size={24} />
              <div>
                <h2>Recursos recomendados para ti</h2>
                <p>Contenido seleccionado según tus últimas entradas.</p>
              </div>
            </div>
            <button
              type="button"
              className="text-action-link"
              onClick={() => navigate("/blogs")}
            >
              Ver todos los recursos <ChevronRight size={16} />
            </button>
          </div>
          <div className="resource-row">
            {resources.map((resource) => (
              <button
                key={resource.id}
                type="button"
                className={`dash-resource dash-resource-btn ${resource.tone}`}
                onClick={() => {
                  registerAchievementEvent({
                    eventType: "resource_viewed",
                    resourceId: resource.id,
                  });
                  navigate(`/blogs/${resource.id}`);
                }}
              >
                <div>
                  <span>{resource.kind}</span>
                  <h3>{resource.title}</h3>
                  <small>{resource.meta}</small>
                </div>
                <img src={asset(resource.image)} alt="" />
              </button>
            ))}
          </div>
        </section>



          </>
        )}

      <GuidedMeditation
        visible={openActivity === "breathing"}
        onClose={handleCloseActivity}
      />
      <MemoryGameModal
        visible={openActivity === "memory"}
        onClose={handleCloseActivity}
      />
      <AnxietyPatterns
        visible={openActivity === "patterns"}
        onClose={handleCloseActivity}
      />
      {achievementPopup ? (
        <div className="achievement-popup" role="dialog" aria-modal="false" aria-labelledby="achievement-popup-title">
          <button
            type="button"
            className="achievement-popup__close"
            aria-label="Cerrar logro desbloqueado"
            onClick={() => setAchievementPopup(null)}
          >
            <X size={16} strokeWidth={2.4} />
          </button>
          <div className="achievement-popup__burst" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <div className="achievement-popup__badge">
            <img src={badgeAsset(achievementPopup.icon || "badge_1.png")} alt="" aria-hidden="true" />
          </div>
          <div className="achievement-popup__copy">
            <span>Bien hecho</span>
            <h2 id="achievement-popup-title">Logro desbloqueado</h2>
            <strong>{achievementPopup.title}</strong>
            <p>{achievementSubtitleByKey[achievementPopup.key] || achievementPopup.description}</p>
          </div>
          <button
            type="button"
            className="achievement-popup__cta"
            onClick={() => {
              setAchievementPopup(null);
              navigate("/achievements");
            }}
          >
            Ver mis logros <ChevronRight size={16} />
          </button>
        </div>
      ) : null}
    </UserDashboardShell>
  );
};

export default Home;
