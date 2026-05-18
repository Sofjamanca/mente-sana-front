import { useState, useEffect, useId, useRef } from "react";

export interface MoodInfo {
  value: number;
  label: string;
  tone: "blue" | "coral" | "yellow" | "mint";
}

export const moodScale: MoodInfo[] = [
  { value: 1, label: "Triste",  tone: "blue"   },
  { value: 2, label: "Enojado", tone: "coral"  },
  { value: 3, label: "Neutral", tone: "coral"  },
  { value: 4, label: "Bien",    tone: "yellow" },
  { value: 5, label: "Feliz",   tone: "mint"   },
];

export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const getMoodByValue = (value: number): MoodInfo => {
  const normalizedValue = clamp(Math.round(value), 1, 5);
  return moodScale.find((m) => m.value === normalizedValue) ?? moodScale[2];
};

interface MoodFaceProfile {
  fill: string;
  mouth: [
    number, number, number, number, number, number, number,
    number, number, number, number, number, number, number,
  ];
  dotsOpacity: number;
  sadCurvesOpacity: number;
  happyCurvesOpacity: number;
  leftDotX: number;
  rightDotX: number;
  dotY: number;
}

const moodFaceProfiles: Record<number, MoodFaceProfile> = {
  1: {
    fill: "#009eef",
    mouth: [91.94, 188.29, 100.08, 170.07, 118.34, 158.48, 138, 159, 156.57, 159.48, 173.38, 170.68, 181.24, 187.76],
    dotsOpacity: 0,
    sadCurvesOpacity: 1,
    happyCurvesOpacity: 0,
    leftDotX: 86.94,
    rightDotX: 183.88,
    dotY: 110.59,
  },
  2: {
    fill: "#e54833",
    mouth: [92.41, 188.67, 100.55, 170.46, 118.81, 158.86, 138.47, 159.38, 157.04, 159.86, 173.85, 171.06, 181.71, 188.14],
    dotsOpacity: 1,
    sadCurvesOpacity: 0,
    happyCurvesOpacity: 0,
    leftDotX: 88.12,
    rightDotX: 185.06,
    dotY: 110.59,
  },
  3: {
    fill: "#ff855d",
    mouth: [91.94, 180.18, 106.35, 180, 119.77, 179.65, 135.18, 179.65, 150.53, 179.65, 165.89, 179.65, 181.24, 179.65],
    dotsOpacity: 1,
    sadCurvesOpacity: 0,
    happyCurvesOpacity: 0,
    leftDotX: 88.12,
    rightDotX: 185.06,
    dotY: 110.59,
  },
  4: {
    fill: "#ffbc5a",
    mouth: [91.94, 159.71, 99.8, 176.79, 116.61, 187.99, 135.18, 188.47, 154.84, 188.99, 173.1, 177.99, 181.24, 159.76],
    dotsOpacity: 1,
    sadCurvesOpacity: 0,
    happyCurvesOpacity: 0,
    leftDotX: 88.12,
    rightDotX: 185.06,
    dotY: 112.6,
  },
  5: {
    fill: "#00c696",
    mouth: [91.94, 159.5, 99.8, 176.58, 116.61, 187.78, 135.18, 188.26, 154.84, 188.78, 173.1, 177.19, 181.24, 158.97],
    dotsOpacity: 0,
    sadCurvesOpacity: 0,
    happyCurvesOpacity: 1,
    leftDotX: 86.94,
    rightDotX: 183.88,
    dotY: 112.6,
  },
};

const hexToRgb = (hex: string) => {
  const normalized = hex.replace("#", "");
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
};

const mixHex = (from: string, to: string, t: number) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  return `rgb(${Math.round(lerp(a.r, b.r, t))}, ${Math.round(lerp(a.g, b.g, t))}, ${Math.round(lerp(a.b, b.b, t))})`;
};

const darkenHex = (hex: string, amount: number) => {
  const rgb = hexToRgb(hex);
  return `rgb(${Math.round(rgb.r * (1 - amount))}, ${Math.round(rgb.g * (1 - amount))}, ${Math.round(rgb.b * (1 - amount))})`;
};

const mixProfile = (value: number) => {
  const clamped = clamp(value, 1, 5);
  const fromIndex = Math.floor(clamped);
  const toIndex = Math.ceil(clamped);
  const t = clamped - fromIndex;
  const from = moodFaceProfiles[fromIndex];
  const to = moodFaceProfiles[toIndex];
  const mouth = from.mouth.map((point, index) => lerp(point, to.mouth[index], t));
  const fill = mixHex(from.fill, to.fill, t);
  const shade = mixHex(darkenHex(from.fill, 0.26), darkenHex(to.fill, 0.26), t);

  return {
    fill,
    shade,
    mouth: `M${mouth[0]} ${mouth[1]} C${mouth[2]} ${mouth[3]} ${mouth[4]} ${mouth[5]} ${mouth[6]} ${mouth[7]} C${mouth[8]} ${mouth[9]} ${mouth[10]} ${mouth[11]} ${mouth[12]} ${mouth[13]}`,
    dotsOpacity: lerp(from.dotsOpacity, to.dotsOpacity, t),
    sadCurvesOpacity: lerp(from.sadCurvesOpacity, to.sadCurvesOpacity, t),
    happyCurvesOpacity: lerp(from.happyCurvesOpacity, to.happyCurvesOpacity, t),
    leftDotX: lerp(from.leftDotX, to.leftDotX, t),
    rightDotX: lerp(from.rightDotX, to.rightDotX, t),
    dotY: lerp(from.dotY, to.dotY, t),
  };
};

export const useAnimatedValue = (target: number, duration = 480) => {
  const [value, setValue] = useState(target);
  const valueRef = useRef(target);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const from = valueRef.current;
    if (from === target) return;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const next = from + (target - from) * eased;
      valueRef.current = next;
      setValue(next);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        rafRef.current = null;
      }
    };

    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return value;
};

interface MoodFaceProps {
  value: number;
  tone: string;
  idle?: boolean;
  interactive?: boolean;
  className?: string;
}

export const MoodFace = ({
  value,
  tone,
  idle = false,
  interactive = false,
  className,
}: MoodFaceProps) => {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "_");
  const profile = mixProfile(value);
  const gradientId = `${uid}-mood-face-shade`;
  const idleMood = clamp(Math.round(value), 1, 5);

  return (
    <svg
      viewBox="0 0 273.18 273.18"
      width="100%"
      height="100%"
      aria-hidden="true"
      className={`ds-mood-face-svg tone-${tone} idle-${idleMood} ${idle ? "is-idle" : ""} ${interactive ? "is-interactive" : ""} ${className ?? ""}`}
      style={{ overflow: "visible" }}
    >
      <defs>
        <radialGradient id={gradientId} cx="34%" cy="28%" r="78%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.34" />
          <stop offset="42%" stopColor="#ffffff" stopOpacity="0.08" />
          <stop offset="66%" stopColor={profile.fill} stopOpacity="0" />
          <stop offset="100%" stopColor={profile.shade} stopOpacity="0.38" />
        </radialGradient>
      </defs>
      <g className="ds-mood-face-svg__head">
        <circle
          cx="136.59"
          cy="136.59"
          r="136.59"
          fill={profile.fill}
          className="ds-mood-face-svg__base"
        />
        <circle
          cx="136.59"
          cy="136.59"
          r="136.59"
          fill={`url(#${gradientId})`}
          className="ds-mood-face-svg__shade"
        />
        <g
          fill="none"
          stroke="#000"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ds-mood-face-svg__features"
        >
          <g opacity={profile.dotsOpacity} className="ds-mood-face-svg__part ds-mood-face-svg__eyes ds-mood-face-svg__eyes--dots">
            <circle cx={profile.leftDotX} cy={profile.dotY} r="16.24" fill="#000" stroke="none" className="ds-mood-face-svg__dot" />
            <circle cx={profile.rightDotX} cy={profile.dotY} r="16.24" fill="#000" stroke="none" className="ds-mood-face-svg__dot" />
          </g>

          <g opacity={profile.sadCurvesOpacity} className="ds-mood-face-svg__part ds-mood-face-svg__eyes ds-mood-face-svg__eyes--sad" strokeWidth="11">
            <path d="M165.95 88.46 C165.95 88.46 164.54 109.99 196.54 109.4" />
            <path d="M107.23 88.46 C107.23 88.46 108.64 109.99 76.64 109.4" />
          </g>

          <g opacity={profile.happyCurvesOpacity} className="ds-mood-face-svg__part ds-mood-face-svg__eyes ds-mood-face-svg__eyes--happy" strokeWidth="11">
            <path d="M69.5 109.41 C69.5 109.41 78.02 89.59 106.26 104.64" />
            <path d="M199.62 109.41 C199.62 109.41 191.1 89.59 162.86 104.64" />
          </g>

          <path
            d={profile.mouth}
            strokeWidth="11"
            className="ds-mood-face-svg__mouth"
          />
        </g>
      </g>
    </svg>
  );
};
