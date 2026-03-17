import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Cog, BarChart3, Shield, Layers, Zap, ArrowRight } from 'lucide-react';

const FadeInSection = ({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const features = [
  {
    icon: Layers,
    title: 'Analyze Multi-Point Loading',
    description:
      'Calculate complex variation in internal torque for shafts subjected to numerous different point torque loads applied at precise, user-defined locations along the entire length of the component.',
  },
  {
    icon: Shield,
    title: 'Integrate Variable Material Properties',
    description:
      'Directly input and test various material specifications, including Shear Modulus (G) and yield strength (τ_yield), to ensure structural integrity and calculate precise Safety Factors.',
  },
  {
    icon: BarChart3,
    title: 'Generate Comprehensive Visualizations',
    description:
      'Instantly create detailed internal torque diagrams and dynamic, correct shear stress distribution graphs using rigorous circular shaft torsion theory. Visualize real-world mechanical performance at a glance.',
  },
  {
    icon: Zap,
    title: 'Optimize Performance and Safety',
    description:
      'Accurately determine critical parameters like Maximum Torsional Shear Stress (τ_max), Polar Moment of Inertia (J), and the total Angle of Twist (φ), all automatically checked against predefined safety limits.',
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 backdrop-blur-xl bg-background/70">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center">
              <Cog className="h-4 w-4 text-primary" />
            </div>
            <span className="text-sm font-bold tracking-tight">TorsionLab</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/analysis')}
            className="border-primary/30 text-primary hover:bg-primary/10"
          >
            Open Analyzer
            <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center pt-14">
        {/* Grid background */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        {/* Radial gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)/0.08)_0%,_transparent_70%)]" />

        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-secondary/50 text-muted-foreground text-xs font-mono mb-8">
              <Activity className="h-3 w-3 text-primary" />
              Solid Circular Shaft · τ = Tρ/J
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-6">
              Welcome to the{' '}
              <span className="text-primary">Torsional Engineering</span>{' '}
              Laboratory
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              A sophisticated computational environment for precise analytical modeling and visualization of torsional shear stress distributions across solid circular shafts.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              onClick={() => navigate('/analysis')}
              className="relative inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-primary text-primary-foreground font-semibold text-sm tracking-wide shadow-[0_0_30px_-5px_hsl(var(--primary)/0.4)] transition-shadow"
              whileHover={{
                scale: 1.06,
                boxShadow: '0 0 50px -5px hsl(160 84% 39% / 0.6)',
              }}
              whileTap={{ scale: 0.97 }}
              animate={{
                boxShadow: [
                  '0 0 25px -5px hsl(160 84% 39% / 0.3)',
                  '0 0 40px -5px hsl(160 84% 39% / 0.5)',
                  '0 0 25px -5px hsl(160 84% 39% / 0.3)',
                ],
              }}
              transition={{
                boxShadow: { duration: 2.5, repeat: Infinity, ease: 'easeInOut' },
              }}
            >
              Start Analysis
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          </motion.div>

          {/* Decorative stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-16 grid grid-cols-3 gap-6 max-w-md mx-auto"
          >
            {[
              { label: 'Stress Analysis', value: 'τ = Tρ/J' },
              { label: 'Safety Factor', value: 'τ_y / τ_max' },
              { label: 'Angle of Twist', value: 'TL/GJ' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="font-mono text-primary text-sm font-semibold">{stat.value}</p>
                <p className="text-muted-foreground text-[10px] uppercase tracking-widest mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative py-24 lg:py-32">
        <div className="max-w-5xl mx-auto px-6">
          <FadeInSection className="text-center mb-16">
            <p className="text-primary text-xs font-mono uppercase tracking-[0.2em] mb-3">About the Platform</p>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-6">
              Advanced Mechanical Design<br className="hidden sm:block" /> & Analysis Platform
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Our sophisticated computational environment is dedicated to the precise analytical modeling and visualization of torsional shear stress distributions across solid circular shafts. We have engineered a generalized computational framework that provides unparalleled accuracy and flexible configuration options.
            </p>
          </FadeInSection>

          <FadeInSection delay={0.15} className="text-center mb-16">
            <p className="text-muted-foreground text-sm">
              Our tool empowers <span className="text-foreground font-medium">engineers</span>,{' '}
              <span className="text-foreground font-medium">designers</span>, and{' '}
              <span className="text-foreground font-medium">students</span> to seamlessly:
            </p>
          </FadeInSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {features.map((feature, i) => (
              <FadeInSection key={feature.title} delay={0.1 * i}>
                <div className="group rounded-xl border border-border p-6 surface-raised hover:border-primary/30 transition-colors duration-300 h-full">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 border-t border-border">
        <FadeInSection className="text-center px-6">
          <h3 className="text-2xl font-bold mb-4">Ready to begin your analysis?</h3>
          <p className="text-muted-foreground text-sm mb-8 max-w-md mx-auto">
            Configure your shaft parameters, apply torque loads, and visualize stress distributions in seconds.
          </p>
          <Button
            size="lg"
            onClick={() => navigate('/analysis')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 glow-safe"
          >
            Launch Analyzer
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </FadeInSection>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-6 text-center">
        <p className="text-muted-foreground text-xs font-mono">
          TorsionLab · Torsional Shear Stress Analysis · τ = Tρ/J
        </p>
      </footer>
    </div>
  );
};

export default Home;
