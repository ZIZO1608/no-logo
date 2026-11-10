import { useId } from "react";
import type { Garment, Tone } from "@/lib/products";

type Shape = {
  /** Filled pieces of cloth, back to front. */
  cloth: string[];
  /** Openings that sit in shadow: the inside of a hood, the underside of a brim. */
  hollow?: string[];
  /** Stitching, hems and seams, drawn as thin lines. */
  seams: string[];
  /** Soft creases where the cloth folds. */
  folds: string[];
  mark: { x: number; y: number; size: number };
};

const shapes: Record<Garment, Shape> = {
  tee: {
    cloth: [
      "M72 28 Q100 46 128 28 L162 40 Q170 43 175 50 L192 80 L166 98 L150 82 L150 212 Q100 220 50 212 L50 82 L34 98 L8 80 L25 50 Q30 43 38 40 Z",
    ],
    seams: [
      "M66 30 Q100 56 134 30",
      "M50 84 Q44 62 40 41",
      "M150 84 Q156 62 160 41",
      "M12 75 L38 93",
      "M188 75 L162 93",
      "M50 204 Q100 212 150 204",
    ],
    folds: ["M62 112 Q72 152 60 200", "M138 112 Q128 152 141 200", "M84 132 Q100 142 120 128"],
    mark: { x: 100, y: 96, size: 26 },
  },
  hoodie: {
    cloth: [
      "M60 62 L30 74 Q22 78 20 88 L8 190 L34 196 L48 118 L48 214 Q100 222 152 214 L152 118 L166 196 L192 190 L180 88 Q178 78 170 74 L140 62 Q100 80 60 62 Z",
      "M60 62 Q56 16 100 14 Q144 16 140 62 Q100 84 60 62 Z",
    ],
    hollow: ["M76 60 Q74 30 100 28 Q126 30 124 60 Q100 72 76 60 Z"],
    seams: [
      "M60 62 Q100 84 140 62",
      "M90 70 L88 104",
      "M110 70 L112 104",
      "M72 160 L128 160 L138 196 L62 196 Z",
      "M10 178 L36 184",
      "M190 178 L164 184",
      "M48 204 Q100 212 152 204",
    ],
    folds: ["M40 100 Q30 140 26 176", "M160 100 Q170 140 174 176", "M70 112 Q78 136 68 154"],
    mark: { x: 100, y: 130, size: 22 },
  },
  pants: {
    cloth: ["M56 16 L144 16 L148 40 L160 224 L112 228 L101 84 L99 84 L88 228 L40 224 L52 40 Z"],
    seams: [
      "M54 30 L146 30",
      "M100 30 L100 84",
      "M72 31 Q70 52 51 62",
      "M128 31 Q130 52 149 62",
      "M41 214 L88 218",
      "M159 214 L112 218",
      "M68 16 L68 30",
      "M132 16 L132 30",
    ],
    folds: ["M70 72 L64 220", "M130 72 L136 220", "M84 96 Q76 108 62 112"],
    mark: { x: 66, y: 84, size: 12 },
  },
  cap: {
    cloth: [
      "M38 140 Q32 66 100 64 Q168 66 162 140 Q100 128 38 140 Z",
      "M38 140 Q100 128 162 140 Q176 146 178 158 Q100 180 22 158 Q24 146 38 140 Z",
    ],
    seams: [
      "M100 64 Q70 80 66 134",
      "M100 64 Q130 80 134 134",
      "M38 140 Q100 128 162 140",
      "M32 152 Q100 172 168 152",
    ],
    folds: ["M52 128 Q46 96 62 80", "M148 128 Q154 96 138 80"],
    mark: { x: 100, y: 102, size: 24 },
  },
};

type Look = {
  tile: string;
  /** Studio light falling on the backdrop. */
  backdrop: string;
  fill: string;
  mark: string;
  /** Colour of stitching and of the grain: light on dark cloth, dark on light cloth. */
  detail: string;
  detailOpacity: number;
};

const looks: Record<Tone, Look> = {
  ink: {
    tile: "bg-chalk",
    backdrop: "radial-gradient(ellipse at 50% 38%, rgb(255 255 255 / 0.55), transparent 68%)",
    fill: "#161616",
    mark: "#e6e8e8",
    detail: "#ffffff",
    detailOpacity: 0.16,
  },
  paper: {
    tile: "bg-coal",
    backdrop: "radial-gradient(ellipse at 50% 38%, rgb(255 255 255 / 0.1), transparent 68%)",
    fill: "#e2e3e1",
    mark: "#111111",
    detail: "#000000",
    detailOpacity: 0.22,
  },
  ash: {
    tile: "bg-chalk",
    backdrop: "radial-gradient(ellipse at 50% 38%, rgb(255 255 255 / 0.55), transparent 68%)",
    fill: "#7f8282",
    mark: "#111111",
    detail: "#000000",
    detailOpacity: 0.26,
  },
};

type Props = { garment: Garment; tone: Tone; className?: string };

/**
 * Stand-in product picture: the garment laid flat under studio light, with shading, stitching,
 * cloth grain and the Ø mark. Drawn in code so it needs no files. Swapped for real photos later.
 */
export function GarmentArt({ garment, tone, className }: Props) {
  // Ids are shared across the page's SVGs, so each picture needs its own.
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const shape = shapes[garment];
  const look = looks[tone];
  const { mark } = shape;
  const half = mark.size / 2;
  const grainTint = look.detail === "#ffffff" ? 1 : 0;

  return (
    <div className={`${look.tile} ${className ?? ""}`} style={{ backgroundImage: look.backdrop }}>
      <svg viewBox="0 0 200 240" className="h-full w-full overflow-visible" aria-hidden="true">
        <defs>
          <clipPath id={`${id}-clip`}>
            {shape.cloth.map((path) => (
              <path key={path} d={path} />
            ))}
          </clipPath>
          {/* Roundness: the cloth falls away into shadow at both sides. */}
          <linearGradient id={`${id}-volume`} gradientUnits="userSpaceOnUse" x1="0" x2="200" y1="0" y2="0">
            <stop offset="0" stopColor="#000" stopOpacity="0.5" />
            <stop offset="0.3" stopColor="#000" stopOpacity="0" />
            <stop offset="0.5" stopColor="#fff" stopOpacity="0.12" />
            <stop offset="0.7" stopColor="#000" stopOpacity="0" />
            <stop offset="1" stopColor="#000" stopOpacity="0.5" />
          </linearGradient>
          {/* Light comes from the top of the picture. */}
          <linearGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="0" y2="240">
            <stop offset="0" stopColor="#fff" stopOpacity="0.1" />
            <stop offset="1" stopColor="#000" stopOpacity="0.28" />
          </linearGradient>
          <filter id={`${id}-grain`} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="7" />
            <feColorMatrix
              values={`0 0 0 0 ${grainTint}  0 0 0 0 ${grainTint}  0 0 0 0 ${grainTint}  0 0 0 -1.6 1.1`}
            />
          </filter>
          <filter id={`${id}-soft`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <filter id={`${id}-crease`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.4" />
          </filter>
        </defs>

        {/* Shadow on the backdrop under the garment. */}
        <g transform="translate(3 7)" opacity="0.38" filter={`url(#${id}-soft)`}>
          {shape.cloth.map((path) => (
            <path key={path} d={path} fill="#000" />
          ))}
        </g>

        {shape.cloth.map((path) => (
          <path key={path} d={path} fill={look.fill} />
        ))}

        <g clipPath={`url(#${id}-clip)`}>
          <rect width="200" height="240" fill={`url(#${id}-volume)`} />
          <rect width="200" height="240" fill={`url(#${id}-fall)`} />
          <g fill="none" stroke="#000" strokeWidth="7" strokeLinecap="round" opacity="0.22" filter={`url(#${id}-crease)`}>
            {shape.folds.map((path) => (
              <path key={path} d={path} />
            ))}
          </g>
          <rect width="200" height="240" filter={`url(#${id}-grain)`} opacity={grainTint ? 0.08 : 0.14} />
        </g>

        {shape.hollow?.map((path) => (
          <path key={path} d={path} fill="#000" opacity="0.55" />
        ))}

        <g
          fill="none"
          stroke={look.detail}
          strokeOpacity={look.detailOpacity}
          strokeWidth="1.1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {shape.seams.map((path) => (
            <path key={path} d={path} />
          ))}
        </g>

        <g
          transform={`translate(${mark.x - half} ${mark.y - half}) scale(${mark.size / 100})`}
          stroke={look.mark}
          fill="none"
        >
          <circle cx="50" cy="50" r="27" strokeWidth="15" />
          <line x1="15.4" y1="84.6" x2="84.6" y2="15.4" strokeWidth="13" />
        </g>
      </svg>
    </div>
  );
}
