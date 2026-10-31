import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Eye, EyeOff, ArrowRight, Lock, Mail, User,
  ChevronLeft, KeyRound,
  CheckCircle, XCircle
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
        style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.08), transparent)', top: '5%', left: '-10%' }} />
      <div className="absolute w-[250px] sm:w-[400px] h-[250px] sm:h-[400px] rounded-full blur-[100px] sm:blur-[160px] pointer-events-none orb-float-2"
        style={{ background: 'radial-gradient(circle, rgba(59,108,242,0.06), transparent)', bottom: '10%', right: '-5%' }} />
    </>
  );
}

const ACCESS_CODE = 'FUTURE2026';

export default function Signup({ onLogin }) {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const passwordMismatch = password && confirmPassword && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (accessCode.trim().toUpperCase() !== ACCESS_CODE) {
      setError('Invalid access code. Please contact your administrator.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSuccess(true);
    setTimeout(() => { navigate('/login'); }, 2000);
  };

  const inputBase = "w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-blue-500/40 focus:bg-white/[0.05] transition-colors duration-200 text-sm";
  const inputWithToggle = "w-full pl-10 sm:pl-11 pr-11 sm:pr-12 py-3 sm:py-3.5 bg-white/[0.03] border rounded-xl text-white placeholder-gray-600 focus:outline-none focus:bg-white/[0.05] transition-colors duration-200 text-sm";

  return (
    <div className="min-h-screen min-h-dvh bg-black flex flex-col lg:flex-row relative overflow-hidden">
      <GridBackground />
      <FloatingOrbs />

      <AuthFactoryPanel />

      {/* ─── Right Panel: Sign Up Form ─── */}
      <div className="flex-1 flex items-center justify-center relative z-10 px-4 sm:px-6 py-6 sm:py-10 lg:px-12 overflow-y-auto">
        {success ? (
          <div className="text-center login-fade-in">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4 sm:mb-6 success-pop">
              <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 font-display">Account Created!</h3>
            <p className="text-xs sm:text-sm text-gray-500 mb-4">Redirecting you to sign in...</p>
            <div className="w-6 h-6 sm:w-8 sm:h-8 border-2 border-white/10 border-t-emerald-400 rounded-full animate-spin mx-auto" />
          </div>
        ) : (
          <div className="w-full max-w-[400px] login-fade-in" style={{ animationDelay: '0.3s' }}>
            {/* Mobile header */}
            <div className="lg:hidden mb-6 sm:mb-8">
              <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors group mb-4 sm:mb-6 block">
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

            <div className="mb-5 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1 sm:mb-2 font-display">Create account</h2>
              <p className="text-xs sm:text-sm text-gray-500">Staff registration — access code required</p>
            </div>

            {error && (
              <div className="mb-4 sm:mb-5 login-fade-in">
                <div className="flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-red-500/[0.06] border border-red-500/10">
                  <XCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                  <p className="text-[10px] sm:text-xs text-red-300">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="signup-name">Full Name</label>
                <div className="relative">
                  <User className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${focusedField === 'name' ? 'text-blue-400' : 'text-gray-600'}`} />
                  <input id="signup-name" type="text" required value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    onFocus={() => setFocusedField('name')} onBlur={() => setFocusedField(null)}
                    placeholder="John Doe" className={inputBase} />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="signup-email">Email</label>
                <div className="relative">
                  <Mail className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${focusedField === 'email' ? 'text-blue-400' : 'text-gray-600'}`} />
                  <input id="signup-email" type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                    placeholder="name@company.com" className={inputBase} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="signup-password">Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${focusedField === 'password' ? 'text-blue-400' : 'text-gray-600'}`} />
                  <input id="signup-password" type={showPassword ? 'text' : 'password'} required value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                    placeholder="Min. 6 characters"
                    className={`${inputWithToggle} border-white/[0.06] focus:border-blue-500/40`} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors p-1">
                    {showPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="signup-confirm">Confirm Password</label>
                <div className="relative">
                  <Lock className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${
                    passwordsMatch ? 'text-emerald-400' : passwordMismatch ? 'text-red-400' : focusedField === 'confirm' ? 'text-blue-400' : 'text-gray-600'
                  }`} />
                  <input id="signup-confirm" type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                    onFocus={() => setFocusedField('confirm')} onBlur={() => setFocusedField(null)}
                    placeholder="Re-enter password"
                    className={`${inputWithToggle} ${
                      passwordsMatch ? 'border-emerald-500/30 focus:border-emerald-500/50'
                        : passwordMismatch ? 'border-red-500/30 focus:border-red-500/50'
                        : 'border-white/[0.06] focus:border-blue-500/40'
                    }`} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400 transition-colors p-1">
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                  </button>
                </div>
                {passwordsMatch && (
                  <p className="text-[9px] sm:text-[10px] text-emerald-400 mt-1.5 flex items-center gap-1 login-fade-in">
                    <CheckCircle className="w-3 h-3" /> Passwords match
                  </p>
                )}
              </div>

              {/* Access Code */}
              <div>
                <label className="block text-[10px] sm:text-xs font-medium text-gray-400 mb-1.5 sm:mb-2 uppercase tracking-wider" htmlFor="signup-access-code">Access Code</label>
                <div className="relative">
                  <KeyRound className={`absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200 ${focusedField === 'code' ? 'text-amber-400' : 'text-gray-600'}`} />
                  <input id="signup-access-code" type="text" required value={accessCode}
                    onChange={(e) => { setAccessCode(e.target.value.toUpperCase()); setError(''); }}
                    onFocus={() => setFocusedField('code')} onBlur={() => setFocusedField(null)}
                    placeholder="Enter organization access code"
                    className="w-full pl-10 sm:pl-11 pr-4 py-3 sm:py-3.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-amber-500/40 focus:bg-white/[0.05] transition-colors duration-200 text-sm font-mono tracking-wider uppercase" />
                </div>
                <p className="text-[9px] sm:text-[10px] text-gray-600 mt-1.5">Required — Contact your system administrator for this code</p>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3 sm:py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-4 sm:mt-6">
                {loading ? (
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                ) : (
                  <>Create Account <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            <div className="mt-5 sm:mt-8 pt-4 sm:pt-6 border-t border-white/[0.05]">
              <p className="text-xs sm:text-sm text-gray-500 text-center">
                Already have an account?{' '}
                <Link to="/login" className="text-white font-medium hover:text-blue-400 transition-colors">Sign in</Link>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
