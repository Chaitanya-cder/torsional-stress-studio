import { useState, useMemo } from 'react';

export interface TorqueLoad {
  id: string;
  position: number; // distance along shaft in mm
  magnitude: number; // torque in N·m
}

export interface ShaftConfig {
  length: number; // mm
  diameter: number; // mm
  shearModulus: number; // GPa
  yieldStrength: number; // MPa
}

export interface AnalysisResult {
  positions: number[];
  internalTorques: number[];
  shearStresses: number[];
  maxShearStress: number;
  polarMoment: number;
  yieldExceeded: boolean;
  safetyFactor: number;
  angleOfTwist: number;
}

const DEFAULT_SHAFT: ShaftConfig = {
  length: 0,
  diameter: 0,
  shearModulus: 0,
  yieldStrength: 0,
};

export function useShaftAnalysis() {
  const [shaft, setShaft] = useState<ShaftConfig>(DEFAULT_SHAFT);
  const [torques, setTorques] = useState<TorqueLoad[]>([]);

  const analysis = useMemo((): AnalysisResult => {
    const d = shaft.diameter / 1000; // convert mm to m
    const r = d / 2;
    const J = (Math.PI * Math.pow(d, 4)) / 32;
    const numPoints = 200;
    const positions: number[] = [];
    const internalTorques: number[] = [];

    // Assume fixed support at x=0: reaction = -sum(all applied torques)
    const totalTorque = torques.reduce((s, t) => s + t.magnitude, 0);

    for (let i = 0; i <= numPoints; i++) {
      const x = shaft.length > 0 ? (i / numPoints) * shaft.length : 0;
      positions.push(x);

      // Internal torque = reaction + sum of applied torques at positions <= x
      let T = -totalTorque;
      for (const torque of torques) {
        if (torque.position <= x) {
          T += torque.magnitude;
        }
      }
      internalTorques.push(T);
    }

    const shearStresses = J > 0
      ? internalTorques.map(T_val => Math.abs(T_val) * r / J / 1e6)
      : internalTorques.map(() => 0);
    const maxT = Math.max(...internalTorques.map(Math.abs), 0);
    const maxShearStress = J > 0 ? (maxT * r) / J / 1e6 : 0; // MPa
    const yieldExceeded = shaft.yieldStrength > 0 && maxShearStress > shaft.yieldStrength;
    const safetyFactor = maxShearStress > 0 ? shaft.yieldStrength / maxShearStress : Infinity;

    // Angle of twist: piecewise integration φ = Σ T_i * ΔL_i / (G * J)
    let angleOfTwist = 0;
    if (J > 0 && shaft.shearModulus > 0 && shaft.length > 0) {
      // Sort torque positions to define segments
      const sortedTorques = [...torques].sort((a, b) => a.position - b.position);
      const breakpoints = [0, ...sortedTorques.map(t => t.position), shaft.length];
      // Remove duplicates and sort
      const uniqueBreaks = [...new Set(breakpoints)].sort((a, b) => a - b);

      for (let i = 0; i < uniqueBreaks.length - 1; i++) {
        const segStart = uniqueBreaks[i];
        const segEnd = uniqueBreaks[i + 1];
        const segLen = (segEnd - segStart) / 1000; // convert mm to m

        // Internal torque in this segment = reaction + sum of torques at or before segStart
        let T_seg = -totalTorque;
        for (const t of torques) {
          if (t.position <= segStart) {
            T_seg += t.magnitude;
          }
        }

        angleOfTwist += (T_seg * segLen) / (shaft.shearModulus * 1e9 * J);
      }
      angleOfTwist = -angleOfTwist * (180 / Math.PI); // negate so positive torque → positive twist
    }

    return {
      positions,
      internalTorques,
      shearStresses,
      maxShearStress,
      polarMoment: J,
      yieldExceeded,
      safetyFactor,
      angleOfTwist,
    };
  }, [shaft, torques]);

  const addTorque = () => {
    setTorques(prev => [
      ...prev,
      { id: Date.now().toString(), position: shaft.length / 2, magnitude: 100 },
    ]);
  };

  const removeTorque = (id: string) => {
    setTorques(prev => prev.filter(t => t.id !== id));
  };

  const updateTorque = (id: string, field: keyof TorqueLoad, value: number) => {
    setTorques(prev =>
      prev.map(t => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  return { shaft, setShaft, torques, addTorque, removeTorque, updateTorque, analysis };
}
