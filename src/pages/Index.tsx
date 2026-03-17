import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShaftAnalysis } from '@/hooks/useShaftAnalysis';
import ShaftConfigPanel from '@/components/ShaftConfigPanel';
import TorqueTable from '@/components/TorqueTable';
import TorqueDiagram from '@/components/TorqueDiagram';
import ShearStressDiagram from '@/components/ShearStressDiagram';
import StressHeatmap from '@/components/StressHeatmap';
import ShaftSchematic from '@/components/ShaftSchematic';
import ResultsPanel from '@/components/ResultsPanel';
import CalculationsPanel from '@/components/CalculationsPanel';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Cog, ArrowLeft } from 'lucide-react';
import { LengthUnit } from '@/lib/units';
import { LengthUnit } from '@/lib/units';

const Index = () => {
  const { shaft, setShaft, torques, addTorque, removeTorque, updateTorque, analysis } = useShaftAnalysis();
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('mm');
  const [diameterUnit, setDiameterUnit] = useState<LengthUnit>('mm');

  return (
    <div className="min-h-screen bg-background">
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
        <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-border p-5 space-y-5 lg:min-h-[calc(100vh-53px)] lg:overflow-y-auto">
          <ShaftConfigPanel
            shaft={shaft}
            onChange={setShaft}
            lengthUnit={lengthUnit}
            onLengthUnitChange={setLengthUnit}
            diameterUnit={diameterUnit}
            onDiameterUnitChange={setDiameterUnit}
          />
          <Separator />
          <TorqueTable
            torques={torques}
            shaft={shaft}
            onAdd={addTorque}
            onRemove={removeTorque}
            onUpdate={updateTorque}
            lengthUnit={lengthUnit}
          />
        </aside>

        <main className="flex-1 p-5 space-y-5 overflow-x-hidden">
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="analysis">Analysis</TabsTrigger>
              <TabsTrigger value="calculations">Calculations</TabsTrigger>
            </TabsList>

            <TabsContent value="analysis" className="space-y-5">
              <ResultsPanel analysis={analysis} shaft={shaft} />

              <div className="rounded-lg border border-border p-4 surface-raised">
                <ShaftSchematic shaft={shaft} torques={torques} lengthUnit={lengthUnit} />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="rounded-lg border border-border p-4 surface-raised h-[320px]">
                  <TorqueDiagram analysis={analysis} shaft={shaft} lengthUnit={lengthUnit} />
                </div>
                <div className="rounded-lg border border-border p-4 surface-raised h-[320px]">
                  <ShearStressDiagram analysis={analysis} shaft={shaft} lengthUnit={lengthUnit} />
                </div>
              </div>

              <div className="rounded-lg border border-border p-4 surface-raised flex items-center justify-center">
                <StressHeatmap analysis={analysis} shaft={shaft} />
              </div>
            </TabsContent>

            <TabsContent value="calculations">
              <CalculationsPanel
                analysis={analysis}
                shaft={shaft}
                torques={torques}
                lengthUnit={lengthUnit}
                diameterUnit={diameterUnit}
              />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Index;
