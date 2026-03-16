import { useState } from 'react';
import { ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Label } from '@/components/ui/label';
import { Settings2, CircleDot, Ruler, Gauge } from 'lucide-react';
import { LengthUnit, lengthUnits, convertToMm, convertFromMm } from '@/lib/units';

interface Props {
  shaft: ShaftConfig;
  onChange: (shaft: ShaftConfig) => void;
  lengthUnit: LengthUnit;
  onLengthUnitChange: (u: LengthUnit) => void;
  diameterUnit: LengthUnit;
  onDiameterUnitChange: (u: LengthUnit) => void;
}

const gUnits = [
  { label: 'GPa', toGPa: 1 },
  { label: 'MPa', toGPa: 1e-3 },
  { label: 'psi', toGPa: 6.89476e-6 },
  { label: 'ksi', toGPa: 6.89476e-3 },
];

export default function ShaftConfigPanel({ shaft, onChange, lengthUnit, onLengthUnitChange, diameterUnit, onDiameterUnitChange }: Props) {
  const [gUnitIdx, setGUnitIdx] = useState(0);
  // Use string state for inputs to allow trailing zeros/decimals
  const [lengthStr, setLengthStr] = useState('');
  const [diameterStr, setDiameterStr] = useState('');
  const [gStr, setGStr] = useState('');
  const [yieldStr, setYieldStr] = useState('');

  const updateLength = (value: string) => {
    setLengthStr(value);
    if (value === '' || value === '.') { onChange({ ...shaft, length: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, length: convertToMm(num, lengthUnit) });
  };

  const updateDiameter = (value: string) => {
    setDiameterStr(value);
    if (value === '' || value === '.') { onChange({ ...shaft, diameter: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, diameter: convertToMm(num, diameterUnit) });
  };

  const updateYield = (value: string) => {
    setYieldStr(value);
    if (value === '' || value === '.') { onChange({ ...shaft, yieldStrength: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, yieldStrength: num });
  };

  const handleGChange = (value: string) => {
    setGStr(value);
    if (value === '' || value === '.') { onChange({ ...shaft, shearModulus: 0 }); return; }
    const num = parseFloat(value);
    if (!isNaN(num) && num >= 0) onChange({ ...shaft, shearModulus: num * gUnits[gUnitIdx].toGPa });
  };

  // When unit changes, update the string display
  const handleLengthUnitChange = (u: LengthUnit) => {
    if (shaft.length > 0) {
      setLengthStr(convertFromMm(shaft.length, u).toPrecision(10).replace(/\.?0+$/, ''));
    }
    onLengthUnitChange(u);
  };

  const handleDiameterUnitChange = (u: LengthUnit) => {
    if (shaft.diameter > 0) {
      setDiameterStr(convertFromMm(shaft.diameter, u).toPrecision(10).replace(/\.?0+$/, ''));
    }
    onDiameterUnitChange(u);
  };

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

      {/* Length */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Ruler className="h-3 w-3" /> Length
        </Label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 1000"
            value={lengthStr}
            onChange={e => updateLength(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono flex-1"
          />
          <UnitSwitcher units={lengthUnits} current={lengthUnit} onSelect={(u) => handleLengthUnitChange(u as LengthUnit)} />
        </div>
      </div>

      {/* Diameter */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <CircleDot className="h-3 w-3" /> Diameter
        </Label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 50"
            value={diameterStr}
            onChange={e => updateDiameter(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono flex-1"
          />
          <UnitSwitcher units={lengthUnits} current={diameterUnit} onSelect={(u) => handleDiameterUnitChange(u as LengthUnit)} />
        </div>
      </div>

      {/* Shear Modulus */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
          <Gauge className="h-3 w-3" /> Shear Modulus (G)
        </Label>
        <div className="flex gap-2">
          <input
            type="text"
            inputMode="decimal"
            placeholder="e.g. 79"
            value={gStr}
            onChange={e => handleGChange(e.target.value)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono flex-1"
          />
          <UnitSwitcher units={gUnits.map(u => u.label)} current={gUnits[gUnitIdx].label} onSelect={(label) => setGUnitIdx(gUnits.findIndex(u => u.label === label))} />
        </div>
      </div>

      {/* Yield Strength */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground">τ_yield (MPa)</Label>
        <input
          type="text"
          inputMode="decimal"
          placeholder="e.g. 240"
          value={yieldStr}
          onChange={e => updateYield(e.target.value)}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
        />
      </div>
    </div>
  );
}
