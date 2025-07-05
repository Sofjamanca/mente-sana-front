import { useEffect, useState } from "react";

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
                // Datos de ejemplo para mostrar en caso de error
                const mockData: MoodEntry[] = [
                    { date: "2025-07-01", mood: 5 },
                    { date: "2025-07-02", mood: 6 },
                    { date: "2025-07-03", mood: 4 },
                    { date: "2025-07-04", mood: 7 },
                    { date: "2025-07-05", mood: 5 },
                    { date: "2025-07-06", mood: 6 },
                    { date: "2025-07-07", mood: 5 },
                ];
                setData(mockData);
            }
        };

        fetchMoodData();
    }, []);

    const averageMood = data.length > 0
        ? Math.round(data.reduce((sum, entry) => sum + entry.mood, 0) / data.length)
        : 5;

    const averageMoodData = moodMap[averageMood];

    const styles = {
        container: {
            width: '100%',
            padding: '0',
            background: 'transparent',
            borderRadius: '0',
            boxShadow: 'none',
        } as React.CSSProperties,
        
        header: {
            textAlign: 'center' as const,
            marginBottom: '1.5rem',
        },
        
        title: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#be185d',
            marginBottom: '0.75rem',
        },
        
        average: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            marginBottom: '1rem',
        },
        
        averageEmoji: {
            fontSize: '2rem',
        },
        
        averageDesc: {
            fontSize: '1rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0',
        },
        
        averagePeriod: {
            fontSize: '0.75rem',
            color: '#6b7280',
            margin: '0',
        },
        
        circleContainer: {
            position: 'relative' as const,
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '1.5rem',
            minHeight: '280px',
        },
        
        circle: {
            position: 'relative' as const,
            width: '260px',
            height: '260px',
        },
        
        dayItem: {
            position: 'absolute' as const,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
        },
        
        dayCircle: {
            width: '3rem',
            height: '3rem',
            borderRadius: '50%',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid white',
            transition: 'all 0.3s ease',
        },
        
        dayEmoji: {
            fontSize: '1.2rem',
        },
        
        dayInfo: {
            textAlign: 'center' as const,
            marginTop: '0.25rem',
        },
        
        dayName: {
            fontSize: '0.7rem',
            fontWeight: '600',
            color: '#4b5563',
            margin: '0',
        },
        
        dayDate: {
            fontSize: '0.65rem',
            color: '#6b7280',
            margin: '0',
        },
        
        center: {
            position: 'absolute' as const,
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '4rem',
            height: '4rem',
            background: 'white',
            borderRadius: '50%',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #f3f4f6',
        },
        
        centerText: {
            textAlign: 'center' as const,
            fontSize: '0.65rem',
            fontWeight: '700',
            color: '#4b5563',
            lineHeight: '1',
        },
        
        progressSection: {
            marginBottom: '1rem',
        },
        
        progressLabels: {
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '0.7rem',
            color: '#6b7280',
            marginBottom: '0.5rem',
        },
        
        progressBar: {
            height: '0.6rem',
            backgroundColor: '#e5e7eb',
            borderRadius: '9999px',
            overflow: 'hidden' as const,
        },
        
        progressFill: {
            height: '100%',
            background: 'linear-gradient(90deg, #f87171, #facc15, #60a5fa)',
            borderRadius: '9999px',
            transition: 'all 1s ease',
            width: `${(averageMood / 7) * 100}%`,
        },
        
        progressText: {
            textAlign: 'center' as const,
            fontSize: '0.75rem',
            color: '#4b5563',
            marginTop: '0.5rem',
        },
        
        cardsGrid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '0.25rem',
        },
        
        card: {
            padding: '0.5rem',
            borderRadius: '0.5rem',
            textAlign: 'center' as const,
            transition: 'all 0.3s ease',
            cursor: 'pointer',
        },
        
        cardEmoji: {
            fontSize: '1.1rem',
            marginBottom: '0.25rem',
        },
        
        cardDay: {
            fontSize: '0.65rem',
            fontWeight: '600',
            color: '#374151',
            margin: '0',
        },
        
        cardDate: {
            fontSize: '0.6rem',
            color: '#6b7280',
            margin: '0',
        },
        
        modalOverlay: {
            position: 'fixed' as const,
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
        },
        
        modal: {
            background: 'white',
            padding: '1.5rem',
            borderRadius: '1rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            maxWidth: '20rem',
            width: '100%',
            margin: '0 1rem',
        },
        
        modalContent: {
            textAlign: 'center' as const,
        },
        
        modalEmoji: {
            fontSize: '3rem',
            marginBottom: '1rem',
        },
        
        modalTitle: {
            fontSize: '1.25rem',
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: '0.5rem',
        },
        
        modalDescription: {
            fontSize: '1rem',
            color: '#4b5563',
            marginBottom: '1rem',
        },
        
        modalBar: {
            width: '100%',
            height: '0.5rem',
            borderRadius: '9999px',
            marginBottom: '1rem',
        },
        
        modalButton: {
            padding: '0.5rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2 style={styles.title}>Estado de Ánimo Semanal</h2>
                <div style={styles.average}>
                    <div style={styles.averageEmoji}>{averageMoodData?.emoji}</div>
                    <div>
                        <p style={styles.averageDesc}>Promedio: {averageMoodData?.description}</p>
                        <p style={styles.averagePeriod}>Últimos 7 días</p>
                    </div>
                </div>
            </div>

            <div style={styles.circleContainer}>
                <div style={styles.circle}>
                    {data.map((entry, index) => {
                        const angle = (index * 360) / data.length - 90;
                        const radius = 100;
                        const x = Math.cos((angle * Math.PI) / 180) * radius;
                        const y = Math.sin((angle * Math.PI) / 180) * radius;
                        const mood = moodMap[entry.mood];

                        return (
                            <div
                                key={entry.date}
                                style={{
                                    ...styles.dayItem,
                                    left: '50%',
                                    top: '50%',
                                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                                }}
                                onClick={() => setSelectedMood(entry)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1.1)`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(1)`;
                                }}
                            >
                                <div
                                    style={{
                                        ...styles.dayCircle,
                                        background: mood.gradientColor
                                    }}
                                >
                                    <span style={styles.dayEmoji}>{mood.emoji}</span>
                                </div>
                                <div style={styles.dayInfo}>
                                    <p style={styles.dayName}>{getDayName(entry.date)}</p>
                                    <p style={styles.dayDate}>{entry.date.split('-')[2]}</p>
                                </div>
                            </div>
                        );
                    })}

                    <div style={styles.center}>
                        <div style={styles.centerText}>
                            <div>Esta</div>
                            <div>Semana</div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={styles.progressSection}>
                <div style={styles.progressLabels}>
                    <span>😢 Muy triste</span>
                    <span>🥳 Increíble</span>
                </div>
                <div style={styles.progressBar}>
                    <div style={styles.progressFill} />
                </div>
                <p style={styles.progressText}>
                    Nivel promedio: {averageMood}/7
                </p>
            </div>

            <div style={styles.cardsGrid}>
                {data.map((entry) => {
                    const mood = moodMap[entry.mood];
                    const isSelected = selectedMood?.date === entry.date;
                    return (
                        <div
                            key={entry.date}
                            style={{
                                ...styles.card,
                                backgroundColor: mood.color + '33',
                                boxShadow: isSelected ? '0 0 0 3px #60a5fa, 0 6px 20px rgba(0, 0, 0, 0.15)' : 'none'
                            }}
                            onClick={() => setSelectedMood(entry)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                e.currentTarget.style.boxShadow = isSelected ? '0 0 0 3px #60a5fa, 0 6px 20px rgba(0, 0, 0, 0.15)' : 'none';
                            }}
                        >
                            <div style={styles.cardEmoji}>{mood.emoji}</div>
                            <p style={styles.cardDay}>{getDayName(entry.date)}</p>
                            <p style={styles.cardDate}>{entry.date.split('-')[2]}</p>
                        </div>
                    );
                })}
            </div>

            {selectedMood && (
                <div style={styles.modalOverlay} onClick={() => setSelectedMood(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.modalContent}>
                            <div style={styles.modalEmoji}>{moodMap[selectedMood.mood].emoji}</div>
                            <h3 style={styles.modalTitle}>
                                {getDayName(selectedMood.date)} {selectedMood.date.split('-')[2]}
                            </h3>
                            <p style={styles.modalDescription}>
                                {moodMap[selectedMood.mood].description}
                            </p>
                            <div
                                style={{
                                    ...styles.modalBar,
                                    backgroundColor: moodMap[selectedMood.mood].color
                                }}
                            />
                            <button
                                style={styles.modalButton}
                                onClick={() => setSelectedMood(null)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#2563eb';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#3b82f6';
                                }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};