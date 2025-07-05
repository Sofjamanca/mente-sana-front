import { useEffect, useState } from "react";

type Card = {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
};

type GameStats = {
  moves: number;
  matches: number;
  startTime: Date | null;
  endTime: Date | null;
};

export default function JuegoMemoria() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    startTime: null,
    endTime: null
  });
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');

  // Emojis temáticos de bienestar mental
  const mentalHealthEmojis = [
    '🧠', '💚', '🌟', '😊', '🧘‍♀️', '🌈', '💛', '🌸',
    '🦋', '🍃', '☀️', '💜', '🌺', '🕊️', '🍀', '✨',
    '🌻', '🧘‍♂️', '💙', '🌙', '🌊', '🎨', '📚', '🎵'
  ];

  const getDifficultySettings = () => {
    switch (difficulty) {
      case 'easy': return { pairs: 6, gridCols: 4 }; // 3x4 = 12 cartas
      case 'medium': return { pairs: 8, gridCols: 4 }; // 4x4 = 16 cartas  
      case 'hard': return { pairs: 12, gridCols: 6 }; // 4x6 = 24 cartas
      default: return { pairs: 6, gridCols: 4 };
    }
  };

  const initializeGame = () => {
    const { pairs } = getDifficultySettings();
    const selectedEmojis = mentalHealthEmojis.slice(0, pairs);
    
    // Crear pares de cartas
    const gameCards: Card[] = [];
    selectedEmojis.forEach((emoji, index) => {
      // Primer carta del par
      gameCards.push({
        id: index * 2,
        emoji,
        isFlipped: false,
        isMatched: false
      });
      // Segunda carta del par
      gameCards.push({
        id: index * 2 + 1,
        emoji,
        isFlipped: false,
        isMatched: false
      });
    });

    // Mezclar cartas (Fisher-Yates shuffle)
    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    // Reasignar IDs después del mezclado
    gameCards.forEach((card, index) => {
      card.id = index;
    });

    setCards(gameCards);
    setFlippedCards([]);
    setGameStats({
      moves: 0,
      matches: 0,
      startTime: new Date(),
      endTime: null
    });
    setIsGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
  }, [difficulty]);

  const handleCardClick = (cardId: number) => {
    if (isGameComplete) return;
    
    const card = cards.find(c => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    // Voltear la carta
    setCards(prev => prev.map(c => 
      c.id === cardId ? { ...c, isFlipped: true } : c
    ));

    // Si se voltearon 2 cartas, verificar si coinciden
    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find(c => c.id === firstId);
      const secondCard = cards.find(c => c.id === secondId);

      setGameStats(prev => ({ ...prev, moves: prev.moves + 1 }));

      setTimeout(() => {
        if (firstCard?.emoji === secondCard?.emoji) {
          // ¡Coincidencia!
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true }
              : c
          ));
          setGameStats(prev => ({ ...prev, matches: prev.matches + 1 }));
          
          // Verificar si el juego está completo
          const newMatches = gameStats.matches + 1;
          const { pairs } = getDifficultySettings();
          if (newMatches === pairs) {
            setIsGameComplete(true);
            setGameStats(prev => ({ ...prev, endTime: new Date() }));
          }
        } else {
          // No coinciden, voltear de vuelta
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false }
              : c
          ));
        }
        setFlippedCards([]);
      }, 1000);
    }
  };

  const getElapsedTime = () => {
    if (!gameStats.startTime) return '0:00';
    const endTime = gameStats.endTime || new Date();
    const diff = Math.floor((endTime.getTime() - gameStats.startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = () => {
    switch (difficulty) {
      case 'easy': return { bg: '#10b981', text: 'Fácil' };
      case 'medium': return { bg: '#f59e0b', text: 'Medio' };
      case 'hard': return { bg: '#ef4444', text: 'Difícil' };
      default: return { bg: '#10b981', text: 'Fácil' };
    }
  };

  const { gridCols } = getDifficultySettings();
  const difficultyInfo = getDifficultyColor();

  return (
    <div style={{
      background: 'linear-gradient(135deg, #fef7ff 0%, #fdf2f8 50%, #fbcfe8 100%)',
      borderRadius: '24px',
      padding: '1.5rem',
      margin: '1rem',
      boxShadow: '0 15px 40px rgba(236, 72, 153, 0.15)',
      border: '2px solid #fbcfe8',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '1.5rem',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '16px',
        padding: '1rem',
        backdropFilter: 'blur(10px)'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #be185d, #ec4899)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: '0 0 0.5rem 0'
        }}>
          🧠 Juego de Memoria - Mente Sana
        </h2>
        
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1rem',
          flexWrap: 'wrap'
        }}>
          <span style={{
            background: 'linear-gradient(135deg, #ec4899, #be185d)',
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            ⏱️ {getElapsedTime()}
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #f472b6, #ec4899)',
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            🔄 {gameStats.moves} movimientos
          </span>
          <span style={{
            background: difficultyInfo.bg,
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            🎯 {difficultyInfo.text}
          </span>
          <span style={{
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            padding: '0.4rem 0.8rem',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            ✨ {gameStats.matches}/{getDifficultySettings().pairs} pares
          </span>
        </div>

        {isGameComplete && (
          <div style={{
            padding: '1rem',
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            borderRadius: '16px',
            marginBottom: '1rem',
            animation: 'bounce 0.5s ease-in-out'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉🧠✨</div>
            <p style={{ margin: '0', fontWeight: '700', fontSize: '1.1rem' }}>
              ¡Excelente memoria! Completaste en {getElapsedTime()} con {gameStats.moves} movimientos
            </p>
          </div>
        )}
      </div>

      {/* Controles de dificultad */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '0.5rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap'
      }}>
        {(['easy', 'medium', 'hard'] as const).map((level) => (
          <button
            key={level}
            onClick={() => setDifficulty(level)}
            style={{
              padding: '0.5rem 1rem',
              background: difficulty === level 
                ? 'linear-gradient(135deg, #ec4899, #be185d)' 
                : 'rgba(255, 255, 255, 0.8)',
              color: difficulty === level ? 'white' : '#be185d',
              border: difficulty === level ? 'none' : '2px solid #f472b6',
              borderRadius: '20px',
              fontSize: '0.8rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (difficulty !== level) {
                e.currentTarget.style.background = 'linear-gradient(135deg, #f472b6, #ec4899)';
                e.currentTarget.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (difficulty !== level) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)';
                e.currentTarget.style.color = '#be185d';
              }
            }}
          >
            {level === 'easy' && '😊 Fácil (3x4)'}
            {level === 'medium' && '🤔 Medio (4x4)'}
            {level === 'hard' && '🧠 Difícil (4x6)'}
          </button>
        ))}
      </div>

      {/* Grid de cartas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridCols}, 1fr)`,
        gap: '0.5rem',
        maxWidth: `${gridCols * 70 + (gridCols - 1) * 8}px`,
        margin: '0 auto 1.5rem auto',
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '16px',
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)'
      }}>
        {cards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '12px',
              cursor: card.isMatched || isGameComplete ? 'default' : 'pointer',
              transition: 'all 0.3s ease',
              transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(180deg)',
              transformStyle: 'preserve-3d',
              position: 'relative',
              background: card.isMatched 
                ? 'linear-gradient(135deg, #10b981, #059669)'
                : card.isFlipped 
                  ? 'linear-gradient(135deg, #fbbf24, #f59e0b)'
                  : 'linear-gradient(135deg, #ec4899, #be185d)',
              boxShadow: card.isMatched 
                ? '0 8px 20px rgba(16, 185, 129, 0.3)'
                : '0 4px 12px rgba(236, 72, 153, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'white',
              border: '2px solid white'
            }}
            onMouseEnter={(e) => {
              if (!card.isMatched && !isGameComplete) {
                e.currentTarget.style.transform = card.isFlipped 
                  ? 'rotateY(0deg) scale(1.05)' 
                  : 'rotateY(180deg) scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (!card.isMatched && !isGameComplete) {
                e.currentTarget.style.transform = card.isFlipped 
                  ? 'rotateY(0deg) scale(1)' 
                  : 'rotateY(180deg) scale(1)';
              }
            }}
          >
            {card.isFlipped || card.isMatched ? card.emoji : '?'}
          </div>
        ))}
      </div>

      {/* Botón de nuevo juego */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <button
          onClick={initializeGame}
          style={{
            padding: '0.8rem 1.5rem',
            background: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(139, 92, 246, 0.3)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(139, 92, 246, 0.3)';
          }}
        >
          🎲 Nuevo Juego
        </button>
      </div>

      {/* Instrucciones */}
      <div style={{
        padding: '1rem',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '12px',
        fontSize: '0.85rem',
        color: '#1e40af',
        textAlign: 'center',
        lineHeight: 1.5
      }}>
        <strong>🎯 Objetivo:</strong> Encuentra todos los pares de emojis idénticos. 
        <strong> 💡 Cómo jugar:</strong> Haz clic en dos cartas para voltearlas. Si coinciden, se quedarán abiertas. 
        <strong> 🏆 Meta:</strong> ¡Completa todos los pares en el menor tiempo y movimientos posibles!
      </div>

      <style>{`
        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% { transform: translateY(0); }
          40%, 43% { transform: translateY(-8px); }
          70% { transform: translateY(-4px); }
          90% { transform: translateY(-2px); }
        }
      `}</style>
    </div>
  );
}