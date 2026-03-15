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

    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * shaft.length;
      positions.push(x);

      let T = 0;
      for (const torque of torques) {
        if (torque.position <= x) {
          T += torque.magnitude;
        }
      }
      internalTorques.push(T);
    }

    const maxT = Math.max(...internalTorques.map(Math.abs));
    const maxShearStress = (maxT * r) / J / 1e6; // Convert to MPa
    const yieldExceeded = maxShearStress > shaft.yieldStrength;
    const safetyFactor = maxShearStress > 0 ? shaft.yieldStrength / maxShearStress : Infinity;
    
    const totalTorque = torques.reduce((sum, t) => sum + t.magnitude, 0);
    const angleOfTwist = (totalTorque * (shaft.length / 1000)) / (shaft.shearModulus * 1e9 * J) * (180 / Math.PI);

    return {
      positions,
      internalTorques,
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
