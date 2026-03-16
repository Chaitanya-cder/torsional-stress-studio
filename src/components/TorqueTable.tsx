import { useState } from 'react';
import { TorqueLoad, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RotateCcw } from 'lucide-react';
import { LengthUnit, convertFromMm, convertToMm } from '@/lib/units';

interface Props {
  torques: TorqueLoad[];
  shaft: ShaftConfig;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof TorqueLoad, value: number) => void;
  lengthUnit: LengthUnit;
}

export default function TorqueTable({ torques, shaft, onAdd, onRemove, onUpdate, lengthUnit }: Props) {
  // Track string values per torque for decimal support
  const [posStrs, setPosStrs] = useState<Record<string, string>>({});
  const [magStrs, setMagStrs] = useState<Record<string, string>>({});

  const handlePositionChange = (id: string, value: string) => {
    setPosStrs(prev => ({ ...prev, [id]: value }));
    if (value === '' || value === '.') return;
    const num = parseFloat(value);
    if (!isNaN(num)) onUpdate(id, 'position', convertToMm(num, lengthUnit));
  };

  const handleMagnitudeChange = (id: string, value: string) => {
    setMagStrs(prev => ({ ...prev, [id]: value }));
    if (value === '' || value === '.') return;
    const num = parseFloat(value);
    if (!isNaN(num)) onUpdate(id, 'magnitude', num);
  };

  const getPositionDisplay = (t: TorqueLoad) => {
    if (posStrs[t.id] !== undefined) return posStrs[t.id];
    return parseFloat(convertFromMm(t.position, lengthUnit).toPrecision(10)).toString();
  };

  const getMagnitudeDisplay = (t: TorqueLoad) => {
    if (magStrs[t.id] !== undefined) return magStrs[t.id];
    return t.magnitude.toString();
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Applied Torques
          </h3>
        </div>
        <Button size="sm" onClick={onAdd} className="h-7 text-xs gap-1">
          <Plus className="h-3 w-3" /> Add
        </Button>
      </div>

      <div className="space-y-1.5">
        <div className="grid grid-cols-[1fr_1fr_32px] gap-2 px-1">
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Position ({lengthUnit})</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Torque (N·m)</span>
          <span />
        </div>

        {torques.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No torques applied</p>
        )}

        {torques.map(t => (
          <div key={t.id} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
            <input
              type="text"
              inputMode="decimal"
              value={getPositionDisplay(t)}
              onChange={e => handlePositionChange(t.id, e.target.value)}
              className="flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono"
            />
            <input
              type="text"
              inputMode="decimal"
              value={getMagnitudeDisplay(t)}
              onChange={e => handleMagnitudeChange(t.id, e.target.value)}
              className={`flex h-8 w-full rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 font-mono ${
                t.magnitude >= 0 ? 'text-safe' : 'text-danger'
              }`}
            />
            <button
              onClick={() => onRemove(t.id)}
              className="h-8 w-8 flex items-center justify-center rounded-md text-muted-foreground hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
