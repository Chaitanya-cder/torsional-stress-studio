import { useMemo, useRef, useEffect } from 'react';
import { AnalysisResult, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Target } from 'lucide-react';

interface Props {
  analysis: AnalysisResult;
  shaft: ShaftConfig;
}

export default function StressHeatmap({ analysis, shaft }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const maxT = Math.max(...analysis.internalTorques.map(Math.abs));
  const r = shaft.diameter / 2000; // radius in meters
  const J = analysis.polarMoment;
  const maxStress = (maxT * r) / J / 1e6;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const size = Math.min(canvas.parentElement?.clientWidth || 240, 240);
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(2, 2);
    ctx.clearRect(0, 0, size, size);

    const cx = size / 2;
    const cy = size / 2;
    const drawR = size / 2 - 16;

    // Draw concentric rings
    const rings = 40;
    for (let i = rings; i >= 0; i--) {
      const rho = (i / rings);
      const stress = rho * maxStress;
      const ratio = shaft.yieldStrength > 0 ? stress / shaft.yieldStrength : 0;
      
      let color: string;
      if (ratio <= 0.5) {
        // Green to yellow
        const t = ratio / 0.5;
        const h = 160 - t * 122; // 160 (emerald) -> 38 (amber)
        const s = 84 - t * 8;
        const l = 39 + t * 11;
        color = `hsl(${h} ${s}% ${l}%)`;
      } else if (ratio <= 1) {
        // Yellow to rose
        const t = (ratio - 0.5) / 0.5;
        const h = 38 - t * (38 - 347 + 360); // wrap around
        const hue = 38 - t * 51; // 38 -> -13 (347)
        const finalH = hue < 0 ? hue + 360 : hue;
        const s = 76 + t * 1;
        const l = 50;
        color = `hsl(${finalH} ${s}% ${l}%)`;
      } else {
        color = `hsl(347 77% ${50 + Math.min((ratio - 1) * 10, 15)}%)`;
      }

      ctx.beginPath();
      ctx.arc(cx, cy, rho * drawR, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }

    // Center dot
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fillStyle = 'hsl(240 10% 3.9%)';
    ctx.fill();

    // Radius lines
    for (let a = 0; a < 360; a += 45) {
      const rad = (a * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.cos(rad) * drawR, cy + Math.sin(rad) * drawR);
      ctx.strokeStyle = 'hsla(0 0% 100% / 0.08)';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Outer ring
    ctx.beginPath();
    ctx.arc(cx, cy, drawR, 0, Math.PI * 2);
    ctx.strokeStyle = 'hsla(0 0% 100% / 0.2)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Labels
    ctx.font = '9px JetBrains Mono';
    ctx.fillStyle = 'hsl(240 5% 55%)';
    ctx.textAlign = 'center';
    ctx.fillText('ρ = 0', cx, cy + 14);
    ctx.fillText(`ρ = ${(shaft.diameter / 2).toFixed(1)}mm`, cx, cy - drawR - 4);
  }, [analysis, shaft, maxStress, maxT, J, r]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-2">
        <Target className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Cross-Section Stress
        </h3>
      </div>

      <div className="relative">
        <canvas ref={canvasRef} />
      </div>

      <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-safe" />
          <span>0 MPa</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-warning" />
          <span>{(shaft.yieldStrength * 0.5).toFixed(0)}</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm bg-danger" />
          <span>≥ {shaft.yieldStrength} MPa</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <p className="font-mono text-xs">
          τ_max = <span className={maxStress > shaft.yieldStrength ? 'text-danger' : 'text-safe'}>
            {maxStress.toFixed(2)} MPa
          </span>
        </p>
      </div>
    </div>
  );
}
