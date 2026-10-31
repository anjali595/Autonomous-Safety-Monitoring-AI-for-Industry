import { useState, useEffect, useRef, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import ShaderBackground from '../components/ui/ShaderBackground';
import WorksWheel from '../components/ui/WorksWheel';

function LineIcon({ name, className = '' }) {
  return <i className={`lni lni-${name} ${className}`.trim()} aria-hidden="true" />;
}

/* ─── Stat Card ─── */
const StatCard = memo(function StatCard({ value, suffix, label, delay }) {
  const ref = useRef(null);
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const step = value / 125;
          const tick = () => {
            start += step;
            if (start >= value) { setCount(value); return; }
            setCount(Math.floor(start));
            requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-center stat-pop" style={{ animationDelay: `${delay}ms` }}>
      <div className="text-fluid-h2 font-bold text-white mb-1 tracking-tight font-display">
        {count}<span className="text-blue-400">{suffix}</span>
      </div>
      <div className="text-fluid-small text-gray-500 font-medium tracking-widest uppercase">{label}</div>
    </div>
  );
});

/* ─── Platform Feature Pill ─── */
const FeaturePill = memo(function FeaturePill({ icon: iconName, text }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.1] transition-all duration-300 group feature-pill">
      <LineIcon name={iconName} className="text-sm sm:text-base text-emerald-400/80 flex-shrink-0 group-hover:text-emerald-400 transition-colors" />
      <span className="text-fluid-small text-gray-400 font-medium group-hover:text-gray-300 transition-colors">{text}</span>
    </div>
  );
});

/* ═══════════════════════════════════════════════════════════════ */
export default function Home({ onLogin, darkMode, setDarkMode }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          setScrolled(window.scrollY > 50);
          ticking = false;
        });
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handler = () => { if (window.innerWidth >= 1024) setMobileMenuOpen(false); };
    window.addEventListener('resize', handler, { passive: true });
    return () => window.removeEventListener('resize', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  const navItems = ['Capabilities', 'Platform', 'Team'];

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const capabilities = [
    { icon: 'dashboard-square-1', title: 'Real-Time Monitoring', desc: 'Continuously track environmental conditions across every zone — temperature, gas levels, humidity, and smoke — from a single unified dashboard.', gradient: 'from-blue-500 to-cyan-500' },
    { icon: 'cloud-iot-2', title: 'AI Risk Intelligence', desc: 'Our machine-learning engine fuses multi-sensor data streams to compute composite risk scores and predict incidents before they happen.', gradient: 'from-violet-500 to-purple-600' },
    { icon: 'alarm-1', title: 'Smart Alert Engine', desc: 'A severity-classified, multi-tier notification system that automatically escalates unresolved alerts through your chain of command.', gradient: 'from-amber-500 to-orange-500' },
    { icon: 'shield-2-check', title: 'Incident Lifecycle', desc: 'Track every incident from first detection to final resolution. Full audit trails, role-based assignments, and root cause documentation.', gradient: 'from-emerald-500 to-teal-500' },
    { icon: 'bar-chart-4', title: 'Deep Analytics', desc: 'Historical trends, zone-level heatmaps, response-time benchmarks, and predictive patterns that drive tangible safety improvements.', gradient: 'from-pink-500 to-rose-500' },
    { icon: 'globe-1', title: 'Multi-Site Control', desc: 'A unified operations center for geographically distributed plants with per-site isolation and cross-facility comparison views.', gradient: 'from-sky-500 to-indigo-500' },
  ];

  const platformFeatures = [
    { icon: 'gauge-1', text: 'Composite Risk Scoring' },
    { icon: 'cloud-iot-2', text: 'IoT Sensor Fusion' },
    { icon: 'bell-1', text: 'Escalation Workflows' },
    { icon: 'trend-up-1', text: 'Predictive Analytics' },
    { icon: 'locked-1', text: 'Role-Based Access' },
    { icon: 'database-2', text: 'Edge Computing Ready' },
  ];

  const chartBars = [30, 45, 35, 60, 50, 40, 55, 38, 42, 35, 48, 34];

  return (
    <div className={`home-page home-page--${darkMode ? 'dark' : 'light'} min-h-screen min-h-dvh bg-black`} data-theme={darkMode ? 'dark' : 'light'}>

      {/* ═══════════════ NAVBAR ═══════════════ */}
      <nav className={`home-nav fixed top-0 left-0 right-0 z-50 nav-animate ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img src="/logo.png" alt="IndustrialGuard AI" className="w-8 h-8 sm:w-10 sm:h-10 lg:w-11 lg:h-11 object-contain" />
              <div>
                <h1 className="text-base sm:text-lg lg:text-xl font-bold text-white tracking-tight leading-none font-display">IndustrialGuard</h1>
                <p className="text-[8px] sm:text-[10px] lg:text-xs text-blue-400 font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase">AI Platform</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-6 xl:gap-8">
              {navItems.map(item => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="text-sm text-gray-400 hover:text-white transition-colors duration-300 font-medium relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300" />
                </button>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setDarkMode((current) => !current)}
                className="home-theme-toggle w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.08] transition-colors duration-200"
                aria-label={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
                aria-pressed={!darkMode}
                title={`Switch to ${darkMode ? 'light' : 'dark'} theme`}
              >
                <LineIcon name={darkMode ? 'sun-1' : 'moon-half-right-5'} className="text-base sm:text-lg" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="home-signin-button hidden sm:flex px-4 sm:px-5 py-2 sm:py-2.5 bg-white text-black text-xs sm:text-sm font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 items-center gap-2"
              >
                <LineIcon name="locked-1" className="text-sm" />
                Sign In
              </button>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                <LineIcon name={mobileMenuOpen ? 'xmark' : 'menu-hamburger-1'} className="text-lg" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="home-mobile-menu lg:hidden mobile-menu-open bg-black/95 backdrop-blur-xl border-t border-white/[0.06]">
            <div className="px-4 sm:px-6 py-4 space-y-1">
              {navItems.map(item => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="w-full text-left py-3 px-3 text-base text-gray-300 hover:text-white hover:bg-white/[0.04] rounded-xl transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
              <div className="pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                  className="home-signin-button w-full py-3 px-3 bg-white text-black font-semibold rounded-xl text-base flex items-center justify-center gap-2"
                >
                  <LineIcon name="locked-1" className="text-base" /> Sign In
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════ HERO SECTION ═══════════════ */}
      <section className="home-hero relative min-h-screen min-h-dvh flex items-center justify-center overflow-hidden">
        <ShaderBackground style={{ opacity: 0.9 }} />

        <div className="home-hero-shade home-hero-shade--vertical absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black z-[1] pointer-events-none" />
        <div className="home-hero-shade home-hero-shade--horizontal absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/30 z-[1] pointer-events-none" />

        <div className="relative z-10 max-w-5xl 2xl:max-w-6xl mx-auto px-4 sm:px-6 text-center hero-content">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/[0.04] border border-white/[0.08] mb-6 sm:mb-8 hero-badge">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-xs sm:text-sm text-gray-300 font-medium">AI-Powered Industrial Safety Platform</span>
          </div>

          {/* Hero Heading */}
          <h1 className="text-fluid-hero font-black text-white mb-4 sm:mb-6 font-display">
            <span className="block">Industrial</span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 gradient-shimmer">
              Safety Redefined
            </span>
          </h1>

          <p className="text-fluid-body text-gray-400 max-w-xl sm:max-w-2xl mx-auto mb-8 sm:mb-10 leading-relaxed font-light px-2">
            Monitor, predict, and prevent industrial hazards with AI-driven intelligence.
            Transform your safety operations from reactive to proactive.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate('/login')}
              className="home-primary-action w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-black font-bold rounded-2xl shadow-2xl shadow-white/10 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-3 text-base sm:text-lg group"
            >
              Access Dashboard
              <LineIcon name="arrow-right" className="text-base sm:text-lg group-hover:translate-x-1 transition-transform duration-200" />
            </button>

            <button
              onClick={() => scrollToSection('capabilities')}
              className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white/[0.04] border border-white/[0.1] hover:bg-white/[0.08] text-white font-semibold rounded-2xl transition-colors duration-200 flex items-center justify-center gap-3 text-base sm:text-lg"
            >
              Learn More
              <LineIcon name="chevron-down" className="text-base sm:text-lg" />
            </button>
          </div>
        </div>

        {/* Scroll indicator — centered */}
        <div className="absolute inset-x-0 bottom-6 sm:bottom-8 z-20 flex items-center justify-center scroll-bounce">
          <button
            onClick={() => scrollToSection('capabilities')}
            className="flex flex-col items-center gap-2 text-center cursor-pointer group"
          >
            <span className="text-[10px] sm:text-xs text-gray-400/80 tracking-[0.25em] uppercase font-medium group-hover:text-gray-300 transition-colors">Scroll to explore</span>
            <LineIcon name="chevron-down" className="text-base text-gray-500 group-hover:text-gray-300 transition-colors" />
          </button>
        </div>
      </section>

      {/* ═══════════════ TRUST BAR ═══════════════ */}
      <section className="relative bg-black border-y border-white/[0.04]">
        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 lg:gap-4">
            <StatCard value={99} suffix="%" label="Uptime Guarantee" delay={0} />
            <StatCard value={500} suffix="+" label="Sensors Supported" delay={100} />
            <StatCard value={50} suffix="ms" label="Alert Latency" delay={200} />
            <StatCard value={24} suffix="/7" label="Always Watching" delay={300} />
          </div>
        </div>
      </section>

      {/* ═══════════════ CAPABILITIES SECTION ═══════════════ */}
      <section id="capabilities" className="relative bg-black py-16 sm:py-24 lg:py-36">
        <div className="home-capability-pattern absolute inset-0 opacity-[0.015] pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-2xl mb-10 sm:mb-16 lg:mb-20 section-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-500/20 bg-blue-500/[0.06] mb-4 sm:mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              <span className="text-[10px] sm:text-xs text-blue-400 font-semibold tracking-wider uppercase">Capabilities</span>
            </div>
            <h2 className="text-fluid-h2 font-black text-white mb-3 sm:mb-5 leading-tight font-display">
              One platform for<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">complete safety oversight</span>
            </h2>
            <p className="text-fluid-body text-gray-500 leading-relaxed">
              Designed for Safety Officers, Shift Supervisors, and Plant Managers
              who need reliable, real-time intelligence at their fingertips.
            </p>
          </div>

          <WorksWheel items={capabilities} label="Capabilities" />
        </div>
      </section>

      {/* ═══════════════ PLATFORM SECTION ═══════════════ */}
      <section id="platform" className="relative bg-black py-16 sm:py-24 lg:py-36 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] rounded-full bg-blue-600/[0.04] blur-[120px] sm:blur-[180px] pointer-events-none" />

        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-24 items-center">
            {/* Left — Content */}
            <div className="section-reveal">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] mb-4 sm:mb-6">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[10px] sm:text-xs text-emerald-400 font-semibold tracking-wider uppercase">Architecture</span>
              </div>

              <h2 className="text-fluid-h2 font-black text-white mb-4 sm:mb-6 leading-tight font-display">
                Engineered for<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">mission-critical</span> ops
              </h2>

              <p className="text-fluid-body text-gray-500 mb-8 sm:mb-10 leading-relaxed">
                IndustrialGuard combines edge computing, sensor fusion, and advanced ML
                to deliver a safety intelligence layer that operates at the speed your environment demands.
              </p>

              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                {platformFeatures.map((feat) => (
                  <FeaturePill key={feat.text} {...feat} />
                ))}
              </div>
            </div>

            {/* Right — Dashboard preview */}
            <div className="relative section-reveal" style={{ animationDelay: '200ms' }}>
              <div className="home-preview-window relative bg-[#0a0a0a] border border-white/[0.06] rounded-2xl overflow-hidden">
                <div className="home-preview-chrome flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3.5 border-b border-white/[0.06] bg-[#0d0d0d]">
                  <div className="flex gap-1.5">
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/10" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/10" />
                    <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/10" />
                  </div>
                  <span className="ml-2 sm:ml-3 text-[10px] sm:text-xs text-gray-600 font-mono">dashboard.industrialguard.ai</span>
                </div>

                <div className="p-3 sm:p-5 space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    {[
                      { label: 'Risk Score', value: '34', color: 'text-emerald-400', dot: 'bg-emerald-400' },
                      { label: 'Active Alerts', value: '3', color: 'text-amber-400', dot: 'bg-amber-400' },
                      { label: 'Sensors', value: '12', color: 'text-blue-400', dot: 'bg-blue-400' },
                    ].map(item => (
                      <div key={item.label} className="home-preview-metric bg-white/[0.02] rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-white/[0.04]">
                        <div className="flex items-center gap-1 sm:gap-1.5 mb-1 sm:mb-2">
                          <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${item.dot}`} />
                          <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase tracking-wider">{item.label}</p>
                        </div>
                        <p className={`text-lg sm:text-2xl font-bold font-display ${item.color}`}>{item.value}</p>
                      </div>
                    ))}
                  </div>

                  <div className="home-preview-trend bg-white/[0.02] rounded-lg sm:rounded-xl p-2.5 sm:p-4 border border-white/[0.04]">
                    <div className="flex items-center justify-between mb-2 sm:mb-4">
                      <p className="text-[8px] sm:text-[10px] text-gray-600 uppercase tracking-wider">Risk Trend — 24h</p>
                      <p className="text-[8px] sm:text-[10px] text-emerald-400 font-medium">↓ 12%</p>
                    </div>
                    <div className="flex items-end gap-0.5 sm:gap-1 h-12 sm:h-16">
                      {chartBars.map((h, i) => (
                        <div
                          key={i}
                          className={`flex-1 rounded-sm chart-bar ${h > 50 ? 'bg-amber-500/50' : 'bg-blue-500/30'}`}
                          style={{ '--bar-height': `${h}%`, animationDelay: `${i * 40}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="home-preview-alert flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3.5 rounded-lg sm:rounded-xl bg-amber-500/[0.06] border border-amber-500/10">
                    <LineIcon name="alarm-1" className="text-sm sm:text-base text-amber-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] sm:text-xs text-amber-200 font-medium truncate">Elevated Gas Level — Zone B</p>
                      <p className="text-[8px] sm:text-[10px] text-amber-400/60">42 ppm • 8 seconds ago</p>
                    </div>
                    <LineIcon name="arrow-right" className="text-xs sm:text-sm text-amber-400/60 flex-shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════ TEAM SECTION ═══════════════ */}
      <section id="team" className="relative bg-black py-16 sm:py-24 lg:py-36 border-t border-white/[0.04]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-16 section-reveal">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-purple-500/20 bg-purple-500/[0.06] mb-4 sm:mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              <span className="text-[10px] sm:text-xs text-purple-400 font-semibold tracking-wider uppercase">Project</span>
            </div>
            <h2 className="text-fluid-h2 font-black text-white mb-3 sm:mb-5 font-display">
              Built with <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">purpose</span>
            </h2>
            <p className="text-fluid-body text-gray-500 max-w-2xl mx-auto leading-relaxed px-2">
              A B.Tech CSE mini-project from GLA University demonstrating how
              AI-driven monitoring transforms industrial safety operations.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-md sm:max-w-lg mx-auto mb-10 sm:mb-16">
            {[
              { name: 'Anjali Kumari', role: 'Full-Stack Developer & AI/ML Lead' },
              { name: 'Abhay Singh', role: 'Frontend Developer & UX Designer' },
            ].map((member, i) => (
              <div
                key={member.name}
                className="home-team-card bg-white/[0.02] border border-white/[0.06] rounded-xl sm:rounded-2xl p-4 sm:p-6 text-center hover:border-white/[0.12] transition-colors duration-300 section-reveal"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/[0.08] flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <span className="text-sm sm:text-lg font-bold text-white font-display">{member.name[0]}</span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-white mb-0.5 sm:mb-1 font-display">{member.name}</h3>
                <p className="text-[10px] sm:text-xs text-gray-500 leading-tight">{member.role}</p>
                <p className="text-[9px] sm:text-[10px] text-gray-600 mt-1.5 sm:mt-2">Team 125 — GLA University</p>
              </div>
            ))}
          </div>

          <div className="text-center section-reveal" style={{ animationDelay: '200ms' }}>
            <button
              onClick={() => navigate('/login')}
              className="home-primary-action w-full sm:w-auto px-8 sm:px-10 py-3.5 sm:py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-colors duration-200 inline-flex items-center justify-center gap-3 text-base sm:text-lg group"
            >
              Launch Dashboard
              <LineIcon name="arrow-angular-top-right" className="text-base sm:text-lg group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative bg-black border-t border-white/[0.04]">
        <div className="max-w-7xl 2xl:max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img src="/logo.png" alt="IndustrialGuard AI" className="w-5 h-5 sm:w-7 sm:h-7 object-contain opacity-40" />
              <span className="text-[10px] sm:text-xs text-gray-600">© 2026 IndustrialGuard AI — B.Tech CSE, GLA University</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-6">
              <span className="text-[9px] sm:text-[10px] text-gray-700 font-mono">React + Vite + Tailwind</span>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] sm:text-[10px] text-emerald-500/70">Demo Mode</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
