import { ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2, CircleDot, Ruler, Gauge } from 'lucide-react';

interface Props {
  shaft: ShaftConfig;
  onChange: (shaft: ShaftConfig) => void;
}

const materials = [
  { name: 'Mild Steel', G: 79, yield: 240 },
  { name: 'Stainless Steel', G: 77, yield: 370 },
  { name: 'Aluminum 6061', G: 26, yield: 207 },
  { name: 'Titanium Ti-6Al-4V', G: 44, yield: 550 },
];

export default function ShaftConfigPanel({ shaft, onChange }: Props) {
  const update = (field: keyof ShaftConfig, value: string) => {
    const num = parseFloat(value);
    if (!isNaN(num) && num > 0) {
      onChange({ ...shaft, [field]: num });
    }
  };

  const selectMaterial = (idx: number) => {
    const m = materials[idx];
    onChange({ ...shaft, shearModulus: m.G, yieldStrength: m.yield });
  };

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
            value={shaft.length}
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
            value={shaft.diameter}
            onChange={e => update('diameter', e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Material Preset</Label>
        <div className="grid grid-cols-2 gap-1.5">
          {materials.map((m, i) => {
            const isActive = shaft.shearModulus === m.G && shaft.yieldStrength === m.yield;
            return (
              <button
                key={m.name}
                onClick={() => selectMaterial(i)}
                className={`text-xs px-2.5 py-2 rounded-md border transition-all text-left ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:border-muted-foreground/50'
                }`}
              >
                {m.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Gauge className="h-3 w-3" /> G (GPa)
          </Label>
          <Input
            type="number"
            value={shaft.shearModulus}
            onChange={e => update('shearModulus', e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">τ_yield (MPa)</Label>
          <Input
            type="number"
            value={shaft.yieldStrength}
            onChange={e => update('yieldStrength', e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>
      </div>
    </div>
  );
}
