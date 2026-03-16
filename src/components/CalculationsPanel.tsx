import { AnalysisResult, ShaftConfig, TorqueLoad } from '@/hooks/useShaftAnalysis';
import { Calculator } from 'lucide-react';
import { LengthUnit, convertFromMm } from '@/lib/units';

interface Props {
  analysis: AnalysisResult;
  shaft: ShaftConfig;
  torques: TorqueLoad[];
  lengthUnit: LengthUnit;
  diameterUnit: LengthUnit;
}

export default function CalculationsPanel({ analysis, shaft, torques, lengthUnit, diameterUnit }: Props) {
  const d_m = shaft.diameter / 1000;
  const r_m = d_m / 2;
  const L_m = shaft.length / 1000;
  const displayD = convertFromMm(shaft.diameter, diameterUnit);
  const displayL = convertFromMm(shaft.length, lengthUnit);

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="border border-border rounded-lg p-4 space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-primary">{title}</h4>
      {children}
    </div>
  );

  const Step = ({ label, formula, result }: { label: string; formula: string; result: string }) => (
    <div className="space-y-0.5 py-1.5 border-b border-border/50 last:border-0">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-mono text-xs text-foreground/80">{formula}</p>
      <p className="font-mono text-sm font-semibold text-foreground">{result}</p>
    </div>
  );

  const maxT = Math.max(...analysis.internalTorques.map(Math.abs), 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Calculator className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Step-by-Step Calculations
        </h3>
      </div>

      <Section title="1. Given Data">
        <Step
          label="Shaft Length (L)"
          formula={`L = ${displayL.toPrecision(6)} ${lengthUnit} = ${L_m.toPrecision(6)} m`}
          result=""
        />
        <Step
          label="Shaft Diameter (d)"
          formula={`d = ${displayD.toPrecision(6)} ${diameterUnit} = ${d_m.toPrecision(6)} m`}
          result={`r = d/2 = ${r_m.toPrecision(6)} m`}
        />
        <Step
          label="Shear Modulus (G)"
          formula={`G = ${shaft.shearModulus.toPrecision(6)} GPa = ${(shaft.shearModulus * 1e9).toExponential(4)} Pa`}
          result=""
        />
        <Step
          label="Yield Shear Strength (τ_yield)"
          formula={`τ_yield = ${shaft.yieldStrength} MPa`}
          result=""
        />
        {torques.length > 0 && (
          <div className="space-y-0.5 py-1.5">
            <p className="text-xs text-muted-foreground">Applied Torques</p>
            {torques.map((t, i) => (
              <p key={t.id} className="font-mono text-xs text-foreground/80">
                T{i + 1} = {t.magnitude} N·m at x = {convertFromMm(t.position, lengthUnit).toPrecision(4)} {lengthUnit}
              </p>
            ))}
          </div>
        )}
      </Section>

      <Section title="2. Polar Moment of Inertia (J)">
        <Step
          label="Formula"
          formula="J = πd⁴ / 32"
          result=""
        />
        <Step
          label="Substitution"
          formula={`J = π × (${d_m.toPrecision(6)})⁴ / 32`}
          result={`J = ${analysis.polarMoment.toExponential(4)} m⁴ = ${(analysis.polarMoment * 1e12).toFixed(4)} mm⁴`}
        />
      </Section>

      <Section title="3. Internal Torque Analysis">
        <Step
          label="Method"
          formula="Using method of sections: sum of all torques to the left of the cut"
          result=""
        />
        {torques.length > 0 ? (
          <>
            <Step
              label="Maximum Internal Torque"
              formula={`T_max = ${maxT.toFixed(2)} N·m`}
              result={`|T_max| = ${maxT.toFixed(2)} N·m`}
            />
          </>
        ) : (
          <p className="text-xs text-muted-foreground italic">Add torque loads to see internal torque calculations</p>
        )}
      </Section>

      <Section title="4. Maximum Torsional Shear Stress (τ_max)">
        <Step
          label="Formula"
          formula="τ_max = T_max × r / J = T_max × (d/2) / J"
          result=""
        />
        {maxT > 0 ? (
          <>
            <Step
              label="Substitution"
              formula={`τ_max = ${maxT.toFixed(2)} × ${r_m.toPrecision(4)} / ${analysis.polarMoment.toExponential(4)}`}
              result={`τ_max = ${analysis.maxShearStress.toFixed(4)} MPa`}
            />
            <Step
              label="Yield Check"
              formula={`τ_max ${analysis.yieldExceeded ? '>' : '≤'} τ_yield → ${analysis.maxShearStress.toFixed(2)} ${analysis.yieldExceeded ? '>' : '≤'} ${shaft.yieldStrength} MPa`}
              result={analysis.yieldExceeded ? '⚠ YIELD EXCEEDED — UNSAFE' : '✓ WITHIN SAFE LIMITS'}
            />
          </>
        ) : (
          <p className="text-xs text-muted-foreground italic">Add torque loads to see stress calculations</p>
        )}
      </Section>

      <Section title="5. Safety Factor (n)">
        <Step
          label="Formula"
          formula="n = τ_yield / τ_max"
          result=""
        />
        {analysis.maxShearStress > 0 ? (
          <Step
            label="Result"
            formula={`n = ${shaft.yieldStrength} / ${analysis.maxShearStress.toFixed(4)}`}
            result={`n = ${analysis.safetyFactor === Infinity ? '∞' : analysis.safetyFactor.toFixed(4)}`}
          />
        ) : (
          <p className="text-xs text-muted-foreground italic">n = ∞ (no load applied)</p>
        )}
      </Section>

      <Section title="6. Angle of Twist (φ)">
        <Step
          label="Formula"
          formula="φ = TL / (GJ) [radians] → converted to degrees"
          result=""
        />
        {torques.length > 0 ? (
          <Step
            label="Result"
            formula={`φ = (${torques.reduce((s, t) => s + t.magnitude, 0).toFixed(2)} × ${L_m.toPrecision(4)}) / (${(shaft.shearModulus * 1e9).toExponential(3)} × ${analysis.polarMoment.toExponential(4)})`}
            result={`φ = ${analysis.angleOfTwist.toFixed(6)}°`}
          />
        ) : (
          <p className="text-xs text-muted-foreground italic">Add torque loads to see twist calculations</p>
        )}
      </Section>
    </div>
  );
}
