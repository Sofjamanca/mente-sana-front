import { useEffect, useState } from "react";
import { Shuffle } from "lucide-react";
import "../styles/ms-activities.css";

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

export default function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [gameStats, setGameStats] = useState<GameStats>({
    moves: 0,
    matches: 0,
    startTime: null,
    endTime: null,
  });
  const [isGameComplete, setIsGameComplete] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy");

  const mentalHealthEmojis = [
    "🧠", "💚", "🌟", "😊", "🧘‍♀️", "🌈", "💛", "🌸",
    "🦋", "🍃", "☀️", "💜", "🌺", "🕊️", "🍀", "✨",
    "🌻", "🧘‍♂️", "💙", "🌙", "🌊", "🎨", "📚", "🎵",
  ];

  const getDifficultySettings = () => {
    switch (difficulty) {
      case "easy":
        return { pairs: 6, gridCols: 4 };
      case "medium":
        return { pairs: 8, gridCols: 4 };
      case "hard":
        return { pairs: 12, gridCols: 6 };
      default:
        return { pairs: 6, gridCols: 4 };
    }
  };

  const initializeGame = () => {
    const { pairs } = getDifficultySettings();
    const selectedEmojis = mentalHealthEmojis.slice(0, pairs);
    const gameCards: Card[] = [];

    selectedEmojis.forEach((emoji, index) => {
      gameCards.push({ id: index * 2, emoji, isFlipped: false, isMatched: false });
      gameCards.push({ id: index * 2 + 1, emoji, isFlipped: false, isMatched: false });
    });

    for (let i = gameCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
    }

    gameCards.forEach((card, index) => {
      card.id = index;
    });

    setCards(gameCards);
    setFlippedCards([]);
    setGameStats({
      moves: 0,
      matches: 0,
      startTime: new Date(),
      endTime: null,
    });
    setIsGameComplete(false);
  };

  useEffect(() => {
    initializeGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reinicio al cambiar dificultad
  }, [difficulty]);

  const handleCardClick = (cardId: number) => {
    if (isGameComplete) return;

    const card = cards.find((c) => c.id === cardId);
    if (!card || card.isFlipped || card.isMatched || flippedCards.length >= 2) return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    setCards((prev) => prev.map((c) => (c.id === cardId ? { ...c, isFlipped: true } : c)));

    if (newFlippedCards.length === 2) {
      const [firstId, secondId] = newFlippedCards;
      const firstCard = cards.find((c) => c.id === firstId);
      const secondCard = cards.find((c) => c.id === secondId);

      setGameStats((prev) => ({ ...prev, moves: prev.moves + 1 }));

      setTimeout(() => {
        if (firstCard?.emoji === secondCard?.emoji) {
          setCards((prev) =>
            prev.map((c) => (c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c))
          );
          setGameStats((prev) => {
            const nextMatches = prev.matches + 1;
            const { pairs } = getDifficultySettings();
            if (nextMatches === pairs) {
              setIsGameComplete(true);
              return { ...prev, matches: nextMatches, endTime: new Date() };
            }
            return { ...prev, matches: nextMatches };
          });
        } else {
          setCards((prev) =>
            prev.map((c) =>
              c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
            )
          );
        }
        setFlippedCards([]);
      }, 700);
    }
  };

  const getElapsedTime = () => {
    if (!gameStats.startTime) return "0:00";
    const endTime = gameStats.endTime || new Date();
    const diff = Math.floor((endTime.getTime() - gameStats.startTime.getTime()) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const difficultyLabel = () => {
    switch (difficulty) {
      case "easy":
        return "Fácil";
      case "medium":
        return "Media";
      case "hard":
        return "Difícil";
      default:
        return "";
    }
  };

  const { gridCols, pairs } = getDifficultySettings();

  return (
    <div className="ms-mem">
      <div className="ms-mem__panel">
        <h3 className="ms-mem__title">Juego de memoria</h3>

        <div className="ms-mem__stats">
          <span className="ms-mem-chip">⏱ {getElapsedTime()}</span>
          <span className="ms-mem-chip ms-mem-chip--accent">Movimientos: {gameStats.moves}</span>
          <span className="ms-mem-chip">Nivel: {difficultyLabel()}</span>
          <span className="ms-mem-chip ms-mem-chip--mint">
            Pares: {gameStats.matches}/{pairs}
          </span>
        </div>

        {isGameComplete && (
          <div className="ms-mem-win">
            ¡Bien! Lo completaste en {getElapsedTime()} con {gameStats.moves} movimientos.
          </div>
        )}
      </div>

      <div className="ms-mem-diff" role="group" aria-label="Dificultad">
        {(["easy", "medium", "hard"] as const).map((level) => (
          <button
            key={level}
            type="button"
            className={difficulty === level ? "is-active" : ""}
            onClick={() => setDifficulty(level)}
            aria-pressed={difficulty === level}
          >
            {level === "easy" && "Fácil · 3×4"}
            {level === "medium" && "Media · 4×4"}
            {level === "hard" && "Difícil · 4×6"}
          </button>
        ))}
      </div>

      <div
        className="ms-mem-grid"
        style={{
          gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
        }}
      >
        {cards.map((card) => {
          const showFace = card.isFlipped || card.isMatched;
          const cls = [
            "ms-mem-card",
            card.isMatched ? "is-matched" : "",
            showFace && !card.isMatched ? "is-open" : "",
            !showFace ? "is-back" : "",
            isGameComplete ? "is-disabled" : "",
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <button
              key={card.id}
              type="button"
              className={cls}
              onClick={() => handleCardClick(card.id)}
              disabled={card.isMatched || isGameComplete}
              aria-label={card.isMatched ? "Pareja encontrada" : showFace ? card.emoji : "Carta boca abajo"}
            >
              {showFace ? card.emoji : "?"}
            </button>
          );
        })}
      </div>

      <div className="ms-mem-actions">
        <button type="button" className="ms-btn ms-btn--primary" onClick={initializeGame}>
          <Shuffle size={18} strokeWidth={2.2} aria-hidden />
          Nuevo juego
        </button>
      </div>

      <p className="ms-mem-help">
        <strong>Objetivo:</strong> encontrá todos los pares. Tocá dos cartas por turno. Si coinciden, quedan
        descubiertas.
      </p>
    </div>
  );
}
