import { useMemo } from 'react';
import { AnalysisResult, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import { LengthUnit } from '@/lib/units';

interface Props {
  analysis: AnalysisResult;
  shaft: ShaftConfig;
  lengthUnit: LengthUnit;
}

export default function ShearStressDiagram({ analysis, shaft, lengthUnit }: Props) {
  const maxT = Math.max(...analysis.internalTorques.map(Math.abs), 0);
  const r = shaft.diameter / 2000; // radius in meters
  const J = analysis.polarMoment;

  const data = useMemo(() => {
    const numPoints = 50;
    const radiusMm = shaft.diameter / 2;
    const points = [];

    for (let i = 0; i <= numPoints; i++) {
      const rho = (i / numPoints) * radiusMm; // mm from center
      const rhoM = rho / 1000; // meters
      const tau = J > 0 ? (maxT * rhoM) / J / 1e6 : 0; // MPa
      points.push({
        ρ: Math.round(rho * 1000) / 1000,
        τ: Math.round(tau * 100) / 100,
      });
    }
    return points;
  }, [shaft, maxT, J]);

  const maxStress = J > 0 ? (maxT * r) / J / 1e6 : 0;
  const yieldLine = shaft.yieldStrength;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Torsional Shear Stress Diagram (τ = Tρ/J)
        </h3>
      </div>

      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(240 5% 12%)"
              vertical={false}
            />
            <XAxis
              dataKey="ρ"
              stroke="hsl(240 5% 35%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(240 5% 55%)' }}
              label={{ value: 'ρ — Radial Distance (mm)', position: 'bottom', offset: 5, style: { fontSize: 10, fill: 'hsl(240 5% 55%)' } }}
            />
            <YAxis
              stroke="hsl(240 5% 35%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(240 5% 55%)' }}
              label={{ value: 'τ (MPa)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 10, fill: 'hsl(240 5% 55%)' } }}
              domain={[0, Math.max(maxStress, yieldLine, 1) * 1.2]}
            />
            {yieldLine > 0 && (
              <ReferenceLine
                y={yieldLine}
                stroke="hsl(347 77% 50%)"
                strokeDasharray="6 3"
                strokeWidth={1.5}
                label={{ value: `τ_yield = ${yieldLine} MPa`, position: 'right', fill: 'hsl(347 77% 50%)', fontSize: 9, fontFamily: 'JetBrains Mono' }}
              />
            )}
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(240 10% 5.5%)',
                border: '1px solid hsl(240 5% 18%)',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              labelFormatter={(v) => `ρ = ${v} mm`}
              formatter={(v: number) => [`${v.toFixed(2)} MPa`, 'τ']}
            />
            <Line
              type="linear"
              dataKey="τ"
              stroke="hsl(38 92% 50%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(38 92% 50%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}