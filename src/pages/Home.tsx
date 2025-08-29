import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { MoodChart } from "../components/MoodChart";
import MotivationalQuote from "../components/MotivationalQuote";
import DailySummary from "./DailySummary";
import AnxietyReliefActivities from "../components/AnxietyReliefActivities";
import { useUser } from "../contexts/UserContext";
import { Button, Card, Row, Col, Statistic, Tag, Avatar, List, Typography, Space, Alert } from "antd";
import { 
  SettingOutlined, 
  PlusOutlined, 
  CalendarOutlined, 
  FireOutlined,
  HeartOutlined,
  SmileOutlined,
  MehOutlined,
  FrownOutlined,
  HistoryOutlined,
  BulbOutlined,
  ClockCircleOutlined
} from "@ant-design/icons";
import { useEffect, useMemo, useState } from "react";

const { Title, Text, Paragraph } = Typography;

interface HomeProps {
  theme: "dark" | "light";
}

type Entry = {
  id: string;
  date: string;
  mood: number;
  energy: number;
  sleepHours: number;
  notes: string;
  aiMessage: string | null;
};

// Nueva interfaz para Insights
interface UserInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'trend' | 'correlation' | 'improvement' | 'motivation' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  actionText?: string;
  actionUrl?: string;
  lastGenerated?: string;
}

const Home = ({ theme }: HomeProps) => {
  const navigate = useNavigate();
  const { isAdmin, userProfile } = useUser();
  const [entries, setEntries] = useState<Entry[]>([]);
  const [canCreate, setCanCreate] = useState(true);
  const [insights, setInsights] = useState<UserInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [insightsAvailable, setInsightsAvailable] = useState(false);
  
  // Estado para el diálogo de DailySummary
  const [dailySummaryVisible, setDailySummaryVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<Entry | null>(null);

  const handleClick = () => {
    navigate("/daily-summary");
  };

  const handleDayClick = async (date: string) => {
    try {
      // Verificar si ya existe una entrada para esa fecha
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/daily-entries/date/${date}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('🔍 DEBUG: Respuesta del servidor para fecha', date, ':', data);
        setSelectedDate(date);
        setSelectedEntry(data.hasEntry ? data.existingEntry : null);
        console.log('🔍 DEBUG: selectedEntry configurado como:', data.hasEntry ? data.existingEntry : null);
        setDailySummaryVisible(true);
      } else {
        // Si hay error, abrir diálogo para nueva entrada
        setSelectedDate(date);
        setSelectedEntry(null);
        setDailySummaryVisible(true);
      }
    } catch (error) {
      console.error('Error verificando entrada:', error);
      // En caso de error, abrir diálogo para nueva entrada
      setSelectedDate(date);
      setSelectedEntry(null);
      setDailySummaryVisible(true);
    }
  };

  const handleDailySummaryClose = () => {
    setDailySummaryVisible(false);
    setSelectedDate('');
    setSelectedEntry(null);
    // Refrescar los datos después de cerrar el diálogo
    fetchEntriesAndStatus();
  };

  const handleAdminClick = () => {
    navigate("/admin");
  };

  const fetchEntriesAndStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const now = new Date();
      const start = new Date();
      start.setDate(now.getDate() - 30);
      
      // Usar formato local para evitar problemas de zona horaria
      const format = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      const [statusRes, entriesRes] = await Promise.all([
        fetch("/api/daily-entries/can-create", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
        fetch(`/api/daily-entries?startDate=${format(start)}&endDate=${format(now)}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }),
      ]);

      if (statusRes.ok) {
        const status = await statusRes.json();
        setCanCreate(status.canCreate);
      }

      if (entriesRes.ok) {
        const list = await entriesRes.json();
        const mapped: Entry[] = list.map((e: { id: string; date: string; mood: number; energy: number; sleepHours: number; notes?: string | null; aiMessage?: string | null }) => ({
          id: e.id,
          date: (e.date || "").split("T")[0],
          mood: Number(e.mood),
          energy: Number(e.energy || 3),
          sleepHours: Number(e.sleepHours || 8),
          notes: e.notes || '',
          aiMessage: e.aiMessage,
        }));
        setEntries(mapped);
      }
    } catch (err) {
      console.error("Error cargando panel:", err);
    }
  };

  const fetchInsights = async () => {
    try {
      setLoadingInsights(true);
      const token = localStorage.getItem("token");
      
      const response = await fetch("/api/user/insights", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
        setInsightsAvailable(data.insights && data.insights.length > 0);
      } else if (response.status === 404) {
        // No hay insights disponibles aún
        setInsights([]);
        setInsightsAvailable(false);
      }
    } catch (err) {
      console.error("Error cargando insights:", err);
      setInsights([]);
      setInsightsAvailable(false);
    } finally {
      setLoadingInsights(false);
    }
  };

  useEffect(() => {
    fetchEntriesAndStatus();
    fetchInsights();
  }, []);

  // Estadísticas y métricas
  const last7 = useMemo(() => entries.slice(0, 7), [entries]);
  const averageMood = useMemo(() => {
    if (!last7.length) return 0;
    return Math.round(last7.reduce((sum, e) => sum + e.mood, 0) / last7.length);
  }, [last7]);
  
  const bestDay = useMemo(
    () => last7.reduce((a, b) => ((a && a.mood > b.mood) ? a : b), last7[0]),
    [last7]
  );
  
  const moodMap: Record<number, { emoji: string; description: string; color: string }> = {
    1: { emoji: "😢", description: "Muy triste", color: "#ff4757" },
    2: { emoji: "😔", description: "Triste", color: "#ff6b7a" },
    3: { emoji: "😐", description: "Regular", color: "#ffa502" },
    4: { emoji: "🙂", description: "Bien", color: "#ffed4e" },
    5: { emoji: "😊", description: "Muy bien", color: "#7bed9f" },
    6: { emoji: "😍", description: "Fantástico", color: "#ff9ff3" },
    7: { emoji: "🥳", description: "Increíble", color: "#54a0ff" },
  };
  
  const streak = useMemo(() => {
    if (!entries.length) return 0;
    let count = 0;
    const today = new Date();
    const cursor = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const dates = new Set(entries.map((e) => e.date));
    let checkDate = new Date(cursor);
    while (dates.has(checkDate.toISOString().split("T")[0])) {
      count += 1;
      checkDate = new Date(checkDate.getTime() - 24 * 60 * 60 * 1000);
    }
    return count;
  }, [entries]);

  const getMoodIcon = (mood: number) => {
    if (mood >= 6) return <SmileOutlined style={{ color: '#52c41a' }} />;
    if (mood >= 4) return <MehOutlined style={{ color: '#faad14' }} />;
    return <FrownOutlined style={{ color: '#ff4d4f' }} />;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Función para obtener entradas de los últimos 7 días
  const getLast7DaysEntries = () => {
    const days = [];
    const today = new Date();
    
    // Generar los últimos 7 días empezando desde hace 6 días hasta hoy
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - i)); // 6, 5, 4, 3, 2, 1, 0
      
      // Usar formato local para evitar problemas de zona horaria
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      const entry = entries.find(e => e.date === dateStr);
      const dayName = date.toLocaleDateString('es-ES', { weekday: 'short' });
      const isToday = i === 6; // El último día (i=6) es hoy
      
      days.push({
        date: dateStr,
        dayName,
        entry,
        isToday
      });
    }
    
    return days;
  };

  const last7DaysEntries = getLast7DaysEntries();

  return (
    <div className={`home ${theme}`}>
   
      {/* Header Personalizado */}
      <div className="dashboard-header">
        <Row align="middle" justify="space-between">
          <Col>
            <Title level={2} style={{ 
              margin: 0, 
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <HeartOutlined style={{ color: '#ff4d4f' }} />
              ¡Hola, {userProfile?.name}! 👋
            </Title>
            <Text style={{ 
              fontSize: '16px', 
              color: theme === 'dark' ? '#d1d5db' : '#6b7280' 
            }}>
              {new Date().toLocaleDateString('es-ES', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </Text>
          </Col>
          
          <Col>
            <Space>
              {canCreate ? (
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlusOutlined />}
                  onClick={handleClick}
                  className="primary-button"
                >
                  Registrar mi día
                </Button>
              ) : (
                <Tag color="success" style={{ fontSize: '14px', padding: '8px 16px' }}>
                  ✅ Día registrado
                </Tag>
              )}
              
              {isAdmin && (
                <Button 
                  type="default" 
                  icon={<SettingOutlined />}
                  onClick={handleAdminClick}
                  size="large"
                  className="admin-button"
                >
                  Admin
                </Button>
              )}
            </Space>
          </Col>
        </Row>
      </div>

      {/* Frase Motivacional */}
      <MotivationalQuote />
      
      {/* Estadísticas Destacadas */}
      <Row gutter={[16, 16]} className="stats-grid">
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Promedio 7 días"
              value={averageMood}
              suffix="/7"
              valueStyle={{ color: averageMood >= 5 ? '#52c41a' : averageMood >= 3 ? '#faad14' : '#ff4d4f' }}
              prefix={getMoodIcon(averageMood)}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Racha actual"
              value={streak}
              suffix="día(s)"
              valueStyle={{ color: '#1890ff' }}
              prefix={<FireOutlined style={{ color: '#ff6b35' }} />}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Mejor día"
              value={bestDay ? formatDate(bestDay.date) : '-'}
              valueStyle={{ color: '#52c41a', fontSize: '16px' }}
              prefix={bestDay ? moodMap[bestDay.mood].emoji : '-'}
            />
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={6}>
          <Card className="stat-card">
            <Statistic
              title="Total registros"
              value={entries.length}
              valueStyle={{ color: '#722ed1' }}
              prefix={<HistoryOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Panel Principal */}
      <Row gutter={[24, 24]} className="dashboard-main">
        {/* Gráfico de Estado de Ánimo */}
        <Col xs={24} lg={16}>
          <Card 
            title={
              <Space>
                <CalendarOutlined />
                <span>Tu Estado de Ánimo</span>
              </Space>
            }
            className="chart-card"
          >
            <MoodChart />
          </Card>
        </Col>
        
        {/* Insights Personalizados */}
        <Col xs={24} lg={8}>
          <Card 
            title={
              <Space>
                <BulbOutlined />
                <span>Insights Personalizados</span>
              </Space>
            }
            className="insights-card"
          >
            {loadingInsights ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div className="ant-spin-dot">
                  <i></i><i></i><i></i><i></i>
                </div>
              </div>
            ) : insightsAvailable ? (
              <List
                dataSource={insights}
                renderItem={(insight) => (
                  <List.Item className="insight-item">
                    <List.Item.Meta
                      avatar={
                        <Avatar 
                          className="insight-avatar"
                          style={{ 
                            background: insight.confidence > 0.7 ? '#52c41a' : insight.confidence > 0.4 ? '#faad14' : '#ff4d4f'
                          }}
                        >
                          {insight.confidence > 0.7 ? <SmileOutlined /> : insight.confidence > 0.4 ? <MehOutlined /> : <FrownOutlined />}
                        </Avatar>
                      }
                      title={
                        <div className="insight-title">
                          <Text strong>{insight.title}</Text>
                          <Tag color={insight.confidence > 0.7 ? 'success' : insight.confidence > 0.4 ? 'warning' : 'error'} className="insight-confidence-tag">
                            {Math.round(insight.confidence * 100)}%
                          </Tag>
                        </div>
                      }
                      description={
                        <div>
                          <Paragraph className="insight-description">
                            {insight.description}
                          </Paragraph>
                          {insight.actionable && insight.actionText && insight.actionUrl && (
                            <Alert
                              message={
                                <Space>
                                  <ClockCircleOutlined />
                                  {insight.actionText}
                                </Space>
                              }
                              type="info"
                              showIcon
                              style={{ marginTop: '10px' }}
                            />
                          )}
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <div className="empty-insights">
                <BulbOutlined style={{ fontSize: '48px', color: '#9ca3af' }} />
                <Title level={4} className="empty-insights-title">
                  No hay insights disponibles
                </Title>
                <Text className="empty-insights-description">
                  Registra tu estado de ánimo diario para generar insights personalizados.
                </Text>
                <Button 
                  type="primary" 
                  size="large" 
                  icon={<PlusOutlined />}
                  onClick={handleClick}
                  className="primary-button"
                >
                  Registrar mi día
                </Button>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Semana de Registros - Una sola fila con 7 días */}
      <Card 
        title={
          <Space>
            <HistoryOutlined />
            <span>Esta Semana</span>
          </Space>
        }
        className="weekly-entries-card"
      >
        <Row gutter={[8, 8]} justify="center">
          {last7DaysEntries.map((dayData) => (
            <Col xs={12} sm={8} md={6} lg={3} key={dayData.date}>
              <Card 
                size="small" 
                className={`day-entry-card ${dayData.isToday ? 'today-card' : ''}`}
                style={{ 
                  border: dayData.isToday ? '2px solid #1890ff' : '1px solid #d9d9d9',
                  background: dayData.isToday ? 'rgba(24, 144, 255, 0.05)' : 'transparent',
                  height: '100%'
                }}
                onClick={() => handleDayClick(dayData.date)}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{ 
                    marginBottom: '8px',
                    fontWeight: dayData.isToday ? 'bold' : 'normal',
                    color: dayData.isToday ? '#1890ff' : '#666',
                    fontSize: '14px'
                  }}>
                    {dayData.dayName}
                  </div>
                  
                  <div style={{ 
                    fontSize: '12px', 
                    color: '#999',
                    marginBottom: '12px'
                  }}>
                    {new Date(dayData.date).getDate()}/{new Date(dayData.date).getMonth() + 1}
                  </div>
                  
                  {dayData.entry ? (
                    <div>
                      <Avatar 
                        size={50} 
                        style={{ 
                          background: moodMap[dayData.entry.mood].color,
                          marginBottom: '8px'
                        }}
                      >
                        <span style={{ fontSize: '24px' }}>
                          {moodMap[dayData.entry.mood].emoji}
                        </span>
                      </Avatar>
                      
                      <div style={{ 
                        fontSize: '12px',
                        color: '#666',
                        marginBottom: '4px'
                      }}>
                        {moodMap[dayData.entry.mood].description}
                      </div>
                      
                      {dayData.entry.notes && (
                        <Text 
                          style={{ 
                            fontSize: '11px',
                            color: '#999',
                            display: 'block',
                            lineHeight: '1.2'
                          }}
                        >
                          {dayData.entry.notes.length > 25 
                            ? `${dayData.entry.notes.substring(0, 25)}...` 
                            : dayData.entry.notes
                          }
                        </Text>
                      )}
                    </div>
                  ) : (
                    <div style={{ 
                      padding: '20px 0',
                      color: '#ccc',
                      fontSize: '12px'
                    }}>
                      Sin registro
                    </div>
                  )}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
        
        {entries.length > 7 && (
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <Button type="link" onClick={handleClick} size="large">
              Ver todos los registros
            </Button>
          </div>
        )}
      </Card>

      {/* Actividades para Calmar la Ansiedad */}
      <AnxietyReliefActivities theme={theme} />

      {/* Diálogo de DailySummary */}
      <DailySummary
        isDialog={true}
        visible={dailySummaryVisible}
        onClose={handleDailySummaryClose}
        targetDate={selectedDate}
        existingEntry={selectedEntry}
      />
    </div>
  );
};

export default Home;
