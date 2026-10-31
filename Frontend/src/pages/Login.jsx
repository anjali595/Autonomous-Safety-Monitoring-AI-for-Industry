import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, ArrowRight, Lock, Mail,
  ChevronLeft
} from 'lucide-react';
import AuthFactoryPanel from '../components/ui/AuthFactoryPanel';

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none login-grid-fade">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={`h-${i}`} className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.03] to-transparent" style={{ top: `${(i + 1) * 8}%` }} />
      ))}
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={`v-${i}`} className="absolute top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" style={{ left: `${(i + 1) * 8}%` }} />
      ))}
    </div>
  );
}

function FloatingOrbs() {
  return (
    <>
      <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full blur-[120px] sm:blur-[200px] pointer-events-none orb-float-1"
        style={{ background: 'radial-gradient(circle, rgba(59,108,242,0.08), transparent)', top: '10%', right: '-10%' }} />
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full blur-[100px] sm:blur-[160px] pointer-events-none orb-float-2"
        style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06), transparent)', bottom: '5%', left: '-5%' }} />
    </>
  );
}

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    if (onLogin) onLogin();
    navigate('/');
  };

  return (
    <div className="min-h-screen min-h-dvh bg-black flex flex-col lg:flex-row relative overflow-hidden">
      <GridBackground />
      <FloatingOrbs />

      <AuthFactoryPanel />

      {/* ─── Right Panel: Login Form ─── */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6 py-8 sm:py-12 lg:px-12">
        <div className="w-full max-w-[400px] login-fade-in" style={{ animationDelay: '0.3s' }}>
          {/* Mobile header */}
          <div className="lg:hidden mb-8 sm:mb-10">
            <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-5 sm:mb-6 block">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-sm font-medium">Back</span>
            </Link>
            <div className="flex items-center gap-2.5 sm:gap-3">
              <img src="/logo.png" alt="IndustrialGuard AI" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
              <div>
                <h1 className="text-base sm:text-lg font-bold text-white font-display">IndustrialGuard</h1>
                <p className="text-[8px] sm:text-[10px] text-blue-400 font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase">AI Platform</p>
              </div>
            </div>
          </div>

          <div className="mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2 font-display">Sign in</h2>
            <p className="text-xs sm:text-sm text-gray-500">Enter your credentials to access your dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="login-email">Email</label>
              <div className="relative">
                <Mail className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-600'}`} />
                <input
                  id="login-email" type="email" value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                  placeholder="name@company.com"
                  className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-colors duration-200 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="login-password">Password</label>
              <div className="relative">
                <Lock className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-600'}`} />
                <input
                  id="login-password" type={showPassword ? 'text' : 'password'} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  className="w-full pl-10 sm:pl-11 pr-11 sm:pr-12 py-3 sm:py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-colors duration-200 text-sm"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors p-1"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div className="w-4 h-4 rounded border border-white/[0.1] bg-white/[0.03] flex items-center justify-center group-hover:border-white/[0.2] transition-colors">
                  <input type="checkbox" className="sr-only" />
                </div>
                <span className="text-[10px] sm:text-xs text-gray-500 group-hover:text-gray-400 transition-colors">Remember me</span>
              </label>
              <button type="button" className="text-[10px] sm:text-xs text-blue-400/80 hover:text-blue-400 transition-colors font-medium">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 sm:py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm">
              {loading ? (
                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.05]">
            <p className="text-xs sm:text-sm text-gray-500 text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white font-medium hover:text-blue-400 transition-colors">Sign up</Link>
            </p>
          </div>

          <p className="mt-4 sm:mt-6 text-center text-[9px] sm:text-[10px] text-gray-700 login-fade-in" style={{ animationDelay: '1s' }}>
            Demo — Click Sign In to enter the dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
