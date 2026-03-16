import { ShaftConfig, TorqueLoad } from '@/hooks/useShaftAnalysis';
import { Box } from 'lucide-react';
import { LengthUnit, convertFromMm } from '@/lib/units';

interface Props {
  shaft: ShaftConfig;
  torques: TorqueLoad[];
  lengthUnit: LengthUnit;
}

export default function ShaftSchematic({ shaft, torques, lengthUnit }: Props) {
  const svgWidth = 500;
  const svgHeight = 160;
  const shaftY = svgHeight / 2;
  const shaftH = 36;
  const margin = 50;
  const shaftLeft = margin;
  const shaftRight = svgWidth - margin;
  const shaftLen = shaftRight - shaftLeft;

  const posToX = (pos: number) => shaft.length > 0 ? shaftLeft + (pos / shaft.length) * shaftLen : shaftLeft;
  const fmt = (mm: number) => parseFloat(convertFromMm(mm, lengthUnit).toPrecision(6));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Box className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Shaft Schematic
        </h3>
      </div>

      <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full" style={{ maxHeight: 180 }}>
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="hsl(240 5% 10%)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="shaftGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(240 5% 22%)" />
            <stop offset="50%" stopColor="hsl(240 5% 16%)" />
            <stop offset="100%" stopColor="hsl(240 5% 10%)" />
          </linearGradient>
        </defs>

        <rect width={svgWidth} height={svgHeight} fill="url(#grid)" rx="4" />

        <rect
          x={shaftLeft}
          y={shaftY - shaftH / 2}
          width={shaftLen}
          height={shaftH}
          rx={3}
          fill="url(#shaftGrad)"
          stroke="hsl(240 5% 25%)"
          strokeWidth={1}
        />

        <line
          x1={shaftLeft - 10}
          y1={shaftY}
          x2={shaftRight + 10}
          y2={shaftY}
          stroke="hsl(240 5% 30%)"
          strokeWidth={0.5}
          strokeDasharray="4 3"
        />

        <line x1={shaftLeft} y1={shaftY + shaftH / 2 + 16} x2={shaftRight} y2={shaftY + shaftH / 2 + 16} stroke="hsl(240 5% 35%)" strokeWidth={0.5} />
        <line x1={shaftLeft} y1={shaftY + shaftH / 2 + 10} x2={shaftLeft} y2={shaftY + shaftH / 2 + 22} stroke="hsl(240 5% 35%)" strokeWidth={0.5} />
        <line x1={shaftRight} y1={shaftY + shaftH / 2 + 10} x2={shaftRight} y2={shaftY + shaftH / 2 + 22} stroke="hsl(240 5% 35%)" strokeWidth={0.5} />
        <text x={(shaftLeft + shaftRight) / 2} y={shaftY + shaftH / 2 + 28} textAnchor="middle" fill="hsl(240 5% 55%)" fontSize="9" fontFamily="JetBrains Mono">
          L = {fmt(shaft.length)} {lengthUnit}
        </text>

        <text x={shaftLeft - 5} y={shaftY + 4} textAnchor="end" fill="hsl(240 5% 55%)" fontSize="8" fontFamily="JetBrains Mono">
          ∅{fmt(shaft.diameter)}
        </text>

        {torques.map(t => {
          const x = posToX(t.position);
          const dir = t.magnitude >= 0 ? 1 : -1;
          const color = t.magnitude >= 0 ? 'hsl(160 84% 39%)' : 'hsl(347 77% 50%)';
          const arrowR = 22;

          return (
            <g key={t.id}>
              <path
                d={`M ${x + dir * arrowR} ${shaftY - arrowR * 0.6} A ${arrowR} ${arrowR * 0.6} 0 0 ${dir > 0 ? 1 : 0} ${x + dir * arrowR} ${shaftY + arrowR * 0.6}`}
                fill="none"
                stroke={color}
                strokeWidth={2}
              />
              <polygon
                points={
                  dir > 0
                    ? `${x + arrowR - 4},${shaftY + arrowR * 0.6 - 5} ${x + arrowR},${shaftY + arrowR * 0.6} ${x + arrowR + 4},${shaftY + arrowR * 0.6 - 5}`
                    : `${x - arrowR - 4},${shaftY - arrowR * 0.6 + 5} ${x - arrowR},${shaftY - arrowR * 0.6} ${x - arrowR + 4},${shaftY - arrowR * 0.6 + 5}`
                }
                fill={color}
              />
              <text x={x} y={shaftY - shaftH / 2 - 8} textAnchor="middle" fill={color} fontSize="9" fontFamily="JetBrains Mono" fontWeight="600">
                {t.magnitude > 0 ? '+' : ''}{t.magnitude} N·m
              </text>
              <line x1={x} y1={shaftY - shaftH / 2} x2={x} y2={shaftY + shaftH / 2} stroke={color} strokeWidth={1} strokeDasharray="2 2" />
            </g>
          );
        })}

        <g>
          <rect x={shaftLeft - 8} y={shaftY - shaftH / 2 - 6} width={8} height={shaftH + 12} fill="hsl(240 5% 12%)" stroke="hsl(240 5% 25%)" strokeWidth={1} />
          {[0, 1, 2, 3, 4].map(i => (
            <line
              key={i}
              x1={shaftLeft - 14}
              y1={shaftY - shaftH / 2 - 4 + i * ((shaftH + 8) / 4)}
              x2={shaftLeft - 8}
              y2={shaftY - shaftH / 2 + 2 + i * ((shaftH + 8) / 4)}
              stroke="hsl(240 5% 30%)"
              strokeWidth={1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
