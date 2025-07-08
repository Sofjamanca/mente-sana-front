import React from 'react';

interface ParticleBackgroundProps {
  particleCount?: number;
  animationDuration?: number;
  theme?: 'light' | 'dark';
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  particleCount = 25,
  animationDuration = 20,
  theme = 'light'
}) => {
  const particles = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    delay: (i * animationDuration) / particleCount,
    size: Math.random() * 3 + 2, // Entre 2px y 5px
    startDistance: Math.random() * 5 + 35, // Empiezan muy cerca del icono (35-40px)
    endDistance: Math.random() * 80 + 100, // Terminan más lejos (100-180px)
    opacity: Math.random() * 0.6 + 0.4, // Entre 0.4 y 1.0
    angle: Math.random() * 360, // Ángulo aleatorio
    rotationSpeed: Math.random() * 3 + 0.5, // Velocidad de rotación variable (0.5 a 3.5 giros)
  }));

  return (
    <div className="particle-background">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`particle ${theme}`}
          style={{
            '--delay': `${particle.delay}s`,
            '--duration': `${animationDuration}s`,
            '--size': `${particle.size}px`,
            '--start-distance': `${particle.startDistance}px`,
            '--end-distance': `${particle.endDistance}px`,
            '--opacity': particle.opacity,
            '--start-angle': `${particle.angle}deg`,
            '--rotation-speed': particle.rotationSpeed,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}; 