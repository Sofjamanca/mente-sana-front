interface FloatingHeartProps {
  delay?: number;
  size?: string;
}

export const FloatingHeart = ({ delay = 0, size = '💖' }: FloatingHeartProps) => (
  <div 
    className="heart" 
    style={{ 
      animationDelay: `${delay}s`, 
      fontSize: Math.random() > 0.5 ? '1.5rem' : '1rem' 
    }}
  >
    {size}
  </div>
); 