import { useState } from 'react';
import { ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings2, CircleDot, Ruler, Gauge } from 'lucide-react';
import { LengthUnit, lengthUnits, convertToMm, convertFromMm } from '@/lib/units';

interface Props {
  shaft: ShaftConfig;
  onChange: (shaft: ShaftConfig) => void;
  lengthUnit: LengthUnit;
  onLengthUnitChange: (u: LengthUnit) => void;
}

const gUnits = [
  { label: 'GPa', toGPa: 1 },
  { label: 'MPa', toGPa: 1e-3 },
  { label: 'psi', toGPa: 6.89476e-6 },
  { label: 'ksi', toGPa: 6.89476e-3 },
];

export default function ShaftConfigPanel({ shaft, onChange, lengthUnit, onLengthUnitChange }: Props) {
  const [gUnitIdx, setGUnitIdx] = useState(0);

  const displayLength = shaft.length > 0 ? parseFloat(convertFromMm(shaft.length, lengthUnit).toPrecision(10)) : '';
  const displayDiameter = shaft.diameter > 0 ? parseFloat(convertFromMm(shaft.diameter, lengthUnit).toPrecision(10)) : '';

  const updateLength = (value: string) => {
    if (value === '') { onChange({ ...shaft, length: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, length: convertToMm(num, lengthUnit) });
  };

  const updateDiameter = (value: string) => {
    if (value === '') { onChange({ ...shaft, diameter: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, diameter: convertToMm(num, lengthUnit) });
  };

  const updateYield = (value: string) => {
    if (value === '') { onChange({ ...shaft, yieldStrength: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, yieldStrength: num });
  };

  const handleGChange = (value: string) => {
    if (value === '') { onChange({ ...shaft, shearModulus: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, shearModulus: num * gUnits[gUnitIdx].toGPa });
  };

  const displayG = shaft.shearModulus > 0
    ? parseFloat((shaft.shearModulus / gUnits[gUnitIdx].toGPa).toPrecision(10))
    : '';

  const UnitSwitcher = ({ units, current, onSelect }: { units: string[]; current: string; onSelect: (u: string) => void }) => (
    <div className="flex rounded-md border border-border overflow-hidden">
      {units.map(u => (
        <button
          key={u}
          onClick={() => onSelect(u)}
          className={`text-[10px] px-2 py-1 transition-colors ${
            u === current
              ? 'bg-primary text-primary-foreground'
              : 'bg-background text-muted-foreground hover:bg-muted'
          }`}
        >
          {u}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2 mb-4">
        <Settings2 className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Shaft Configuration
        </h3>
      </div>

      {/* Length unit selector */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">Length Unit</Label>
        <UnitSwitcher units={lengthUnits} current={lengthUnit} onSelect={(u) => onLengthUnitChange(u as LengthUnit)} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <Ruler className="h-3 w-3" /> Length ({lengthUnit})
          </Label>
          <Input
            type="number"
            placeholder="e.g. 1000"
            value={displayLength}
            onChange={e => updateLength(e.target.value)}
            className="font-mono text-sm bg-background border-border"
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
            <CircleDot className="h-3 w-3" /> Diameter ({lengthUnit})
          </Label>
          <Input
            type="number"
            placeholder="e.g. 50"
            value={displayDiameter}
            onChange={e => updateDiameter(e.target.value)}
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
          <UnitSwitcher units={gUnits.map(u => u.label)} current={gUnits[gUnitIdx].label} onSelect={(label) => setGUnitIdx(gUnits.findIndex(u => u.label === label))} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">τ_yield (MPa)</Label>
        <Input
          type="number"
          placeholder="e.g. 240"
          value={shaft.yieldStrength || ''}
          onChange={e => updateYield(e.target.value)}
          className="font-mono text-sm bg-background border-border"
        />
      </div>
    </div>
  );
}
