import { useShaftAnalysis } from '@/hooks/useShaftAnalysis';
import ShaftConfigPanel from '@/components/ShaftConfigPanel';
import TorqueTable from '@/components/TorqueTable';
import TorqueDiagram from '@/components/TorqueDiagram';
import StressHeatmap from '@/components/StressHeatmap';
import ShaftSchematic from '@/components/ShaftSchematic';
import ResultsPanel from '@/components/ResultsPanel';
import { Separator } from '@/components/ui/separator';
import { Cog } from 'lucide-react';

const Index = () => {
  const { shaft, setShaft, torques, addTorque, removeTorque, updateTorque, analysis } = useShaftAnalysis();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Cog className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Torsional Shear Stress Analysis</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Solid Circular Shaft · τ = Tρ/J</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${analysis.yieldExceeded ? 'bg-danger animate-pulse-glow' : 'bg-safe'}`} />
          <span className={`text-xs font-mono ${analysis.yieldExceeded ? 'text-danger' : 'text-safe'}`}>
            {analysis.yieldExceeded ? 'YIELD EXCEEDED' : 'WITHIN LIMITS'}
          </span>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Sidebar */}
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-5 space-y-5 lg:min-h-[calc(100vh-53px)] lg:overflow-y-auto">
          <ShaftConfigPanel shaft={shaft} onChange={setShaft} />
          <Separator />
          <TorqueTable
            torques={torques}
            shaft={shaft}
            onAdd={addTorque}
            onRemove={removeTorque}
            onUpdate={updateTorque}
          />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-5 space-y-5 overflow-x-hidden">
          {/* Results bar */}
          <ResultsPanel analysis={analysis} shaft={shaft} />

          {/* Shaft schematic */}
          <div className="rounded-lg border border-border p-4 surface-raised">
            <ShaftSchematic shaft={shaft} torques={torques} />
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-5">
            <div className="rounded-lg border border-border p-4 surface-raised h-[320px]">
              <TorqueDiagram analysis={analysis} shaft={shaft} />
            </div>
            <div className="rounded-lg border border-border p-4 surface-raised flex items-center justify-center">
              <StressHeatmap analysis={analysis} shaft={shaft} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
