import { useMemo } from 'react';
import { AnalysisResult, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { LengthUnit, convertFromMm } from '@/lib/units';

interface Props {
  analysis: AnalysisResult;
  shaft: ShaftConfig;
  lengthUnit: LengthUnit;
}

export default function TorqueDiagram({ analysis, shaft, lengthUnit }: Props) {
  const data = useMemo(() => {
    return analysis.positions.map((x, i) => ({
      x: Math.round(convertFromMm(x, lengthUnit) * 1000) / 1000,
      T: Math.round(analysis.internalTorques[i] * 100) / 100,
    }));
  }, [analysis, lengthUnit]);

  const maxAbsT = Math.max(...analysis.internalTorques.map(Math.abs), 1);

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Internal Torque Diagram
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
              label={{ value: 'T (N·m)', angle: -90, position: 'insideLeft', offset: -5, style: { fontSize: 10, fill: 'hsl(240 5% 55%)' } }}
              domain={[-maxAbsT * 1.2, maxAbsT * 1.2]}
            />
            <ReferenceLine y={0} stroke="hsl(240 5% 25%)" strokeWidth={1} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(240 10% 5.5%)',
                border: '1px solid hsl(240 5% 18%)',
                borderRadius: '6px',
                fontSize: '12px',
                fontFamily: 'JetBrains Mono',
              }}
              labelFormatter={(v) => `x = ${v} ${lengthUnit}`}
              formatter={(v: number) => [`${v.toFixed(1)} N·m`, 'Torque']}
            />
            <Line
              type="stepAfter"
              dataKey="T"
              stroke="hsl(160 84% 39%)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'hsl(160 84% 39%)' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
