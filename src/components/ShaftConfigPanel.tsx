import { useState } from 'react';
import { ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2, CircleDot, Ruler, Gauge } from 'lucide-react';

interface Props {
  shaft: ShaftConfig;
  onChange: (shaft: ShaftConfig) => void;
}

const gUnits = [
  { label: 'GPa', toGPa: 1 },
  { label: 'MPa', toGPa: 1e-3 },
  { label: 'psi', toGPa: 6.89476e-6 },
  { label: 'ksi', toGPa: 6.89476e-3 },
];

export default function ShaftConfigPanel({ shaft, onChange }: Props) {
  const [gUnitIdx, setGUnitIdx] = useState(0);

  const update = (field: keyof ShaftConfig, value: string) => {
    if (value === '') {
      onChange({ ...shaft, [field]: 0 });
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onChange({ ...shaft, [field]: num });
    }
  };

  const handleGChange = (value: string) => {
    if (value === '') {
      onChange({ ...shaft, shearModulus: 0 });
      return;
    }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) {
      onChange({ ...shaft, shearModulus: num * gUnits[gUnitIdx].toGPa });
    }
  };

  const displayG = shaft.shearModulus > 0
    ? parseFloat((shaft.shearModulus / gUnits[gUnitIdx].toGPa).toPrecision(10))
    : '';

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Shaft Configuration
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Ruler className="h-3 w-3" /> Length (mm)
          </Label>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={shaft.length || ''}
            onChange={e => update('length', e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CircleDot className="h-3 w-3" /> Diameter (mm)
          </Label>
          <Input
            type="number"
            placeholder="e.g. 50"
            value={shaft.diameter || ''}
            onChange={e => update('diameter', e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Gauge className="h-3 w-3" /> Shear Modulus (G)
        </Label>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="e.g. 79"
            value={displayG}
            onChange={e => handleGChange(e.target.value)}
            className="font-mono text-sm bg-background border-border flex-1"
          />
          <div className="flex rounded-md border border-border overflow-hidden">
            {gUnits.map((u, i) => (
              <button
                key={u.label}
                onClick={() => setGUnitIdx(i)}
                className={`text-[10px] px-2 py-1 transition-colors ${
                  i === gUnitIdx
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {u.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">τ_yield (MPa)</Label>
        <Input
          type="number"
          placeholder="e.g. 240"
          value={shaft.yieldStrength || ''}
          onChange={e => update('yieldStrength', e.target.value)}
          className="font-mono text-sm bg-background border-border"
        />
      </div>
    </div>
  );
}
