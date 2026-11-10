import type { Garment, Tone } from "@/lib/products";

const shapes: Record<Garment, string> = {
  tee: "M70 30 L40 42 L12 78 L38 100 L52 86 L52 215 L148 215 L148 86 L162 100 L188 78 L160 42 L130 30 Q100 52 70 30 Z",
  hoodie:
    "M72 42 Q100 6 128 42 L164 58 L190 192 L162 198 L150 112 L150 222 L50 222 L50 112 L38 198 L10 192 L36 58 Z",
  pants: "M58 18 L142 18 L158 226 L112 226 L100 82 L88 226 L42 226 Z",
  cap: "M38 142 Q38 74 100 74 Q162 74 162 142 L194 152 Q200 166 184 166 L38 160 Z",
};

const palette: Record<Tone, { tile: string; fill: string; mark: string }> = {
  ink: { tile: "bg-chalk", fill: "#111111", mark: "#e6e8e8" },
  paper: { tile: "bg-coal", fill: "#e6e8e8", mark: "#111111" },
  ash: { tile: "bg-chalk", fill: "#7d8080", mark: "#111111" },
};

const markPosition: Record<Garment, { x: number; y: number; size: number }> = {
  tee: { x: 100, y: 96, size: 26 },
  hoodie: { x: 100, y: 110, size: 26 },
  pants: { x: 74, y: 50, size: 14 },
  cap: { x: 100, y: 112, size: 26 },
};

type Props = { garment: Garment; tone: Tone; className?: string };

/** Stand-in product picture: a flat garment shape with the Ø mark. Swapped for real photos later. */
export function GarmentArt({ garment, tone, className }: Props) {
  const colors = palette[tone];
  const mark = markPosition[garment];
  const half = mark.size / 2;

  return (
    <div className={`${colors.tile} ${className ?? ""}`}>
      <svg viewBox="0 0 200 240" className="h-full w-full" aria-hidden="true">
        <path d={shapes[garment]} fill={colors.fill} />
        <g
          transform={`translate(${mark.x - half} ${mark.y - half}) scale(${mark.size / 100})`}
          stroke={colors.mark}
          fill="none"
        >
          <circle cx="50" cy="50" r="27" strokeWidth="15" />
          <line x1="15.4" y1="84.6" x2="84.6" y2="15.4" strokeWidth="13" />
        </g>
      </svg>
    </div>
  );
}
