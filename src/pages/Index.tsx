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
import { Cog, ArrowLeft, Play } from 'lucide-react';
import { LengthUnit } from '@/lib/units';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const navigate = useNavigate();
  const { shaft, setShaft, torques, addTorque, removeTorque, updateTorque, analysis } = useShaftAnalysis();
  const [lengthUnit, setLengthUnit] = useState<LengthUnit>('mm');
  const [diameterUnit, setDiameterUnit] = useState<LengthUnit>('mm');
  const [showResults, setShowResults] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="h-8 w-8 rounded-md bg-secondary hover:bg-accent flex items-center justify-center transition-colors" title="Back to Home">
            <ArrowLeft className="h-4 w-4 text-muted-foreground" />
          </button>
          <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Cog className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight">Torsional Shear Stress Analysis</h1>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Solid Circular Shaft · τ = Tρ/J</p>
          </div>
        </div>
        {showResults && (
          <div className="flex items-center gap-2">
            <div className={`h-2 w-2 rounded-full ${analysis.yieldExceeded ? 'bg-danger animate-pulse-glow' : 'bg-safe'}`} />
            <span className={`text-xs font-mono ${analysis.yieldExceeded ? 'text-danger' : 'text-safe'}`}>
              {analysis.yieldExceeded ? 'YIELD EXCEEDED' : 'WITHIN LIMITS'}
            </span>
          </div>
        )}
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
          <AnimatePresence mode="wait">
            {!showResults ? (
              <motion.div
                key="begin-prompt"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, filter: 'blur(8px)' }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col items-center justify-center min-h-[60vh] gap-6"
              >
                <div className="relative">
                  <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                  <div className="relative h-24 w-24 rounded-full border border-border bg-secondary/50 flex items-center justify-center">
                    <Cog className="h-10 w-10 text-muted-foreground animate-[spin_8s_linear_infinite]" />
                  </div>
                </div>

                <div className="text-center space-y-2 max-w-md">
                  <h2 className="text-xl font-bold tracking-tight text-foreground">Configure Your Shaft</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Set up shaft properties and torque loads in the left panel, then hit <span className="text-primary font-medium">Begin Analysis</span> to compute results.
                  </p>
                </div>

                <motion.button
                  onClick={() => setShowResults(true)}
                  className="group relative mt-4 px-8 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm uppercase tracking-wider overflow-hidden transition-shadow hover:shadow-[0_0_24px_hsl(var(--primary)/0.4)]"
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Play className="h-4 w-4" />
                    Begin Analysis
                  </span>
                </motion.button>

                <div className="flex gap-6 mt-6">
                  {['τ = Tρ/J', 'n = τ_y/τ_max', 'φ = TL/GJ'].map((f, i) => (
                    <span key={i} className="font-mono text-xs text-muted-foreground/50">{f}</span>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="results"
                initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
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
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Index;
