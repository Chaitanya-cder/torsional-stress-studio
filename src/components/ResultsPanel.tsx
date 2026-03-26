import { AnalysisResult, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Activity, Shield, RotateCw, Cog } from 'lucide-react';

interface Props {
  analysis: AnalysisResult;
  shaft: ShaftConfig;
}

export default function ResultsPanel({ analysis, shaft }: Props) {
  const { maxShearStress, yieldExceeded, safetyFactor, polarMoment, angleOfTwist } = analysis;

  const metrics = [
    {
      label: 'Max Torsional Shear Stress',
      value: `${maxShearStress.toFixed(2)} MPa`,
      icon: Activity,
      status: yieldExceeded ? 'danger' : 'safe',
    },
    {
      label: 'Safety Factor',
      value: safetyFactor === Infinity ? '∞' : `${safetyFactor.toFixed(2)}`,
      icon: Shield,
      status: safetyFactor < 1 ? 'danger' : safetyFactor < 2 ? 'warning' : 'safe',
    },
    {
      label: 'Polar Moment J',
      value: `${polarMoment.toExponential(4)} m⁴`,
      icon: Cog,
      status: 'neutral' as const,
    },
    {
      label: 'Angle of Twist',
      value: `${angleOfTwist.toFixed(4)}°`,
      icon: RotateCw,
      status: 'neutral' as const,
    },
  ];

  const statusColors = {
    safe: 'border-safe/30 bg-safe/5',
    danger: 'border-danger/30 bg-danger/5',
    warning: 'border-warning/30 bg-warning/5',
    neutral: 'border-border bg-secondary/30',
  };

  const textColors = {
    safe: 'text-safe',
    danger: 'text-danger',
    warning: 'text-warning',
    neutral: 'text-foreground',
  };

  const iconColors = {
    safe: 'text-safe',
    danger: 'text-danger',
    warning: 'text-warning',
    neutral: 'text-muted-foreground',
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {metrics.map(m => {
        const Icon = m.icon;
        return (
          <div
            key={m.label}
            className={`rounded-lg border p-3 transition-all ${statusColors[m.status]}`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <Icon className={`h-3.5 w-3.5 ${iconColors[m.status]}`} />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</span>
            </div>
            <p className={`font-mono text-lg font-bold ${textColors[m.status]}`}>
              {m.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
