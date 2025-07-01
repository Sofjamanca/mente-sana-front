import { useEffect, useState } from "react";
import "../styles/MoodChart.css";

type MoodEntry = {
    date: string;
    mood: number;
};

type MoodDescription = {
    emoji: string;
    description: string;
    color: string;
    gradientColor: string;
};

const moodMap: Record<number, MoodDescription> = {
    1: {
        emoji: "😢",
        description: "Muy triste",
        color: "#ff4757",
        gradientColor: "linear-gradient(135deg, #ef4444, #dc2626)"
    },
    2: {
        emoji: "😔",
        description: "Triste",
        color: "#ff6b7a",
        gradientColor: "linear-gradient(135deg, #f87171, #ef4444)"
    },
    3: {
        emoji: "😐",
        description: "Regular",
        color: "#ffa502",
        gradientColor: "linear-gradient(135deg, #fb923c, #ea580c)"
    },
    4: {
        emoji: "🙂",
        description: "Bien",
        color: "#ffed4e",
        gradientColor: "linear-gradient(135deg, #facc15, #eab308)"
    },
    5: {
        emoji: "😊",
        description: "Muy bien",
        color: "#7bed9f",
        gradientColor: "linear-gradient(135deg, #4ade80, #16a34a)"
    },
    6: {
        emoji: "😍",
        description: "Fantástico",
        color: "#ff9ff3",
        gradientColor: "linear-gradient(135deg, #f472b6, #ec4899)"
    },
    7: {
        emoji: "🥳",
        description: "Increíble",
        color: "#54a0ff",
        gradientColor: "linear-gradient(135deg, #60a5fa, #3b82f6)"
    },
};

const getDayName = (dateStr: string) => {
    const days = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const date = new Date(dateStr + 'T00:00:00');
    return days[date.getDay()];
};

export const MoodChart = () => {
    const [data, setData] = useState<MoodEntry[]>([]);
    const [selectedMood, setSelectedMood] = useState<MoodEntry | null>(null);

    useEffect(() => {
        const fetchMoodData = async () => {
            const endDate = new Date();
            const startDate = new Date();
            startDate.setDate(endDate.getDate() - 6);

            const format = (date: Date) => date.toISOString().split("T")[0];

            try {
                const response = await fetch(
                    `/api/daily-entries?startDate=${format(startDate)}&endDate=${format(endDate)}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${localStorage.getItem("token")}`,
                        },
                    }
                );

                const result = await response.json();
                const formatted = result.map((entry: { date: string; mood: number | string }): MoodEntry => ({
                    date: entry.date.split("T")[0],
                    mood: parseInt(entry.mood.toString()),
                }));

                setData(formatted.reverse());
            } catch (error) {
                console.error("Error al obtener los datos:", error);
            }
        };

        fetchMoodData();
    }, []);

    const averageMood = data.length > 0
        ? Math.round(data.reduce((sum, entry) => sum + entry.mood, 0) / data.length)
        : 0;

    const averageMoodData = moodMap[averageMood];

    return (
        <>
            <div className="mood-chart-main">
                <div className="mood-header">
                    <h2 className="mood-title">Estado de Ánimo Semanal</h2>
                    <div className="mood-average">
                        <div className="mood-average-emoji">{averageMoodData?.emoji}</div>
                        <div className="mood-average-info">
                            <p className="mood-average-desc">Promedio: {averageMoodData?.description}</p>
                            <p className="mood-average-period">Últimos 7 días</p>
                        </div>
                    </div>
                </div>

                <div className="mood-circle-container">
                    <div className="mood-circle">
                        {data.map((entry, index) => {
                            const angle = (index * 360) / data.length - 90;
                            const radius = 120;
                            const x = Math.cos((angle * Math.PI) / 180) * radius;
                            const y = Math.sin((angle * Math.PI) / 180) * radius;
                            const mood = moodMap[entry.mood];

                            return (
                                <div
                                    key={entry.date}
                                    className="mood-day-item"
                                    style={{
                                        left: '50%',
                                        top: '50%',
                                        transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                                    }}
                                    onClick={() => setSelectedMood(entry)}
                                >
                                    <div
                                        className="mood-day-circle"
                                        style={{ background: mood.gradientColor }}
                                    >
                                        <span className="mood-day-emoji">{mood.emoji}</span>
                                    </div>
                                    <div className="mood-day-info">
                                        <p className="mood-day-name">{getDayName(entry.date)}</p>
                                        <p className="mood-day-date">{entry.date.split('-')[2]}</p>
                                    </div>
                                </div>
                            );
                        })}

                        <div className="mood-center">
                            <div className="mood-center-text">
                                <p>Esta</p>
                                <p>Semana</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mood-progress-section">
                    <div className="mood-progress-labels">
                        <span>😢 Muy triste</span>
                        <span>🥳 Increíble</span>
                    </div>
                    <div className="mood-progress-bar">
                        <div
                            className="mood-progress-fill"
                            style={{ width: `${(averageMood / 7) * 100}%` }}
                        />
                    </div>
                    <p className="mood-progress-text">
                        Nivel promedio: {averageMood}/7
                    </p>
                </div>

                <div className="mood-cards-grid">
                    {data.map((entry) => {
                        const mood = moodMap[entry.mood];
                        return (
                            <div
                                key={entry.date}
                                className={`mood-card ${selectedMood?.date === entry.date ? 'mood-card-selected' : ''}`}
                                style={{ backgroundColor: mood.color + '33' }}
                                onClick={() => setSelectedMood(entry)}
                            >
                                <div className="mood-card-emoji">{mood.emoji}</div>
                                <p className="mood-card-day">{getDayName(entry.date)}</p>
                                <p className="mood-card-date">{entry.date.split('-')[2]}</p>
                            </div>
                        );
                    })}
                </div>

                {selectedMood && (
                    <div className="mood-modal-overlay" onClick={() => setSelectedMood(null)}>
                        <div className="mood-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="mood-modal-content">
                                <div className="mood-modal-emoji">{moodMap[selectedMood.mood].emoji}</div>
                                <h3 className="mood-modal-title">
                                    {getDayName(selectedMood.date)} {selectedMood.date.split('-')[2]}
                                </h3>
                                <p className="mood-modal-description">
                                    {moodMap[selectedMood.mood].description}
                                </p>
                                <div
                                    className="mood-modal-bar"
                                    style={{ backgroundColor: moodMap[selectedMood.mood].color }}
                                />
                                <button
                                    className="mood-modal-button"
                                    onClick={() => setSelectedMood(null)}
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};