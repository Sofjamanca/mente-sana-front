import React from 'react';
import { Card, Typography, Space } from 'antd';
import { HeartOutlined, StarOutlined, BulbOutlined } from '@ant-design/icons';

const { Text, Paragraph } = Typography;

const motivationalQuotes = [
  {
    text: "Cada día es una nueva oportunidad para cuidar tu mente. Pequeños pasos llevan a grandes cambios.",
    author: "MenteSana",
    icon: <HeartOutlined style={{ color: '#ff4d4f' }} />
  },
  {
    text: "Tu racha de días registrados es un testimonio de tu compromiso contigo mismo. ¡Sigue así!",
    author: "MenteSana",
    icon: <StarOutlined style={{ color: '#faad14' }} />
  },
  {
    text: "La salud mental se construye día a día. Cada registro es un paso hacia tu bienestar.",
    author: "MenteSana",
    icon: <BulbOutlined style={{ color: '#1890ff' }} />
  },
  {
    text: "No hay prisa en el camino del autocuidado. Lo importante es que sigas caminando.",
    author: "MenteSana",
    icon: <HeartOutlined style={{ color: '#52c41a' }} />
  },
  {
    text: "Tu mente es como un jardín: necesita atención diaria para florecer. ¡Riega tu bienestar cada día!",
    author: "MenteSana",
    icon: <StarOutlined style={{ color: '#722ed1' }} />
  },
  {
    text: "Cada emoción que registras es válida. No hay sentimientos correctos o incorrectos.",
    author: "MenteSana",
    icon: <BulbOutlined style={{ color: '#13c2c2' }} />
  },
  {
    text: "La consistencia es más poderosa que la perfección. Un día a la vez construye una vida saludable.",
    author: "MenteSana",
    icon: <HeartOutlined style={{ color: '#eb2f96' }} />
  },
  {
    text: "Tu bienestar mental es una inversión, no un gasto. Cada día que te registras es una inversión en ti.",
    author: "MenteSana",
    icon: <StarOutlined style={{ color: '#fa8c16' }} />
  },
  {
    text: "Recuerda: eres más fuerte de lo que crees. Cada día que continúas es una prueba de tu fortaleza.",
    author: "MenteSana",
    icon: <BulbOutlined style={{ color: '#a0d911' }} />
  },
  {
    text: "La salud mental es un viaje, no un destino. Disfruta el proceso de conocerte cada día.",
    author: "MenteSana",
    icon: <HeartOutlined style={{ color: '#f5222d' }} />
  }
];

const MotivationalQuote: React.FC = () => {
  // Seleccionar una frase aleatoria cada vez que se renderiza el componente
  const randomQuote = React.useMemo(() => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  }, []);

  return (
    <Card 
      className="motivational-quote"
      style={{ 
        textAlign: 'center',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        border: '1px solid #e2e8f0',
        borderRadius: '16px',
        marginBottom: '24px'
      }}
    >
      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>
          {randomQuote.icon}
        </div>
        
        <Paragraph 
          style={{ 
            fontSize: '18px', 
            lineHeight: '1.6',
            color: '#1f2937',
            margin: '0 0 16px 0',
            fontStyle: 'italic'
          }}
        >
          "{randomQuote.text}"
        </Paragraph>
        
        <Text 
          style={{ 
            color: '#6b7280',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          — {randomQuote.author}
        </Text>
      </Space>
    </Card>
  );
};

export default MotivationalQuote;
