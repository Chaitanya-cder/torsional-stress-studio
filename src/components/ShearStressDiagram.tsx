import { useMemo } from 'react';
import { AnalysisResult, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Activity } from 'lucide-react';
import { LengthUnit, convertFromMm } from '@/lib/units';

interface Props {
  analysis: AnalysisResult;
  shaft: ShaftConfig;
  lengthUnit: LengthUnit;
}

export default function ShearStressDiagram({ analysis, shaft, lengthUnit }: Props) {
  const data = useMemo(() => {
    return analysis.positions.map((x, i) => ({
      x: Math.round(convertFromMm(x, lengthUnit) * 1000) / 1000,
      τ: Math.round(analysis.shearStresses[i] * 100) / 100,
    }));
  }, [analysis, lengthUnit]);

  const maxStress = Math.max(...analysis.shearStresses, 1);
  const yieldLine = shaft.yieldStrength;

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <Activity className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Shear Stress Diagram
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
              dataKey="x"
              stroke="hsl(240 5% 35%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(240 5% 55%)' }}
              label={{ value: `Position (${lengthUnit})`, position: 'bottom', offset: 5, style: { fontSize: 10, fill: 'hsl(240 5% 55%)' } }}
            />
            <YAxis
              stroke="hsl(240 5% 35%)"
              tick={{ fontSize: 10, fontFamily: 'JetBrains Mono', fill: 'hsl(240 5% 55%)' }}
              label={{ value: 'τ (MPa)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 10, fill: 'hsl(240 5% 55%)' } }}
              domain={[0, Math.max(maxStress, yieldLine) * 1.2]}
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
              labelFormatter={(v) => `x = ${v} ${lengthUnit}`}
              formatter={(v: number) => [`${v.toFixed(2)} MPa`, 'τ']}
            />
            <Line
              type="stepAfter"
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
