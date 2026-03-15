import { TorqueLoad, ShaftConfig } from '@/hooks/useShaftAnalysis';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, RotateCcw } from 'lucide-react';

interface Props {
  torques: TorqueLoad[];
  shaft: ShaftConfig;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onUpdate: (id: string, field: keyof TorqueLoad, value: number) => void;
}

export default function TorqueTable({ torques, shaft, onAdd, onRemove, onUpdate }: Props) {
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
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Position (mm)</span>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Torque (N·m)</span>
          <span />
        </div>

        {torques.length === 0 && (
          <p className="text-xs text-muted-foreground text-center py-4">No torques applied</p>
        )}

        {torques.map(t => (
          <div key={t.id} className="grid grid-cols-[1fr_1fr_32px] gap-2 items-center">
            <Input
              type="number"
              value={t.position}
              min={0}
              max={shaft.length}
              onChange={e => onUpdate(t.id, 'position', parseFloat(e.target.value) || 0)}
              className="font-mono text-sm h-8 bg-background"
            />
            <Input
              type="number"
              value={t.magnitude}
              onChange={e => onUpdate(t.id, 'magnitude', parseFloat(e.target.value) || 0)}
              className={`font-mono text-sm h-8 bg-background ${
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
