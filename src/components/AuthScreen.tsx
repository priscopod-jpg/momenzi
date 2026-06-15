import React, { useState } from 'react';
import { 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  VolumeX, 
  AlertCircle,
  CheckCircle,
  Terminal,
  Activity,
  Chrome
} from 'lucide-react';
import { UserProfile } from '../types';

interface AuthScreenProps {
  onLoginSuccess: (profile: UserProfile) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register' | 'verify' | 'forgot'>('login');
  
  // Fields state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('alex.morgan@operating.system');
  const [password, setPassword] = useState('•••••••••');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Errors/Success messages state
  const [errorMsg, setErrorMsg] = useState('');
  const [infoMsg, setInfoMsg] = useState('');
  const [resendTimer, setResendTimer] = useState(0);

  const handleStartLoginSim = () => {
    setErrorMsg('');
    
    // Simulate validation
    if (!email.trim() || !password.trim()) {
      setErrorMsg('Inputs are required to authenticate your profile.');
      return;
    }

    onLoginSuccess({
      id: 'user_1',
      firstName: firstName || 'Alex',
      lastName: lastName || 'Morgan',
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200',
      isGoogleConnected: false,
      joinedAt: new Date().toISOString()
    });
  };

  const handleGoogleOAuth = () => {
    // Immediate Google sign-in simulation
    onLoginSuccess({
      id: 'user_g1',
      firstName: 'Alex',
      lastName: 'Morgan',
      email: 'alex.morgan@gmail.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      isGoogleConnected: true,
      joinedAt: new Date().toISOString()
    });
  };

  const handleRequestRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setInfoMsg('');

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setErrorMsg('All fields are required to secure your account.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Validation match failure. Passwords must match.');
      return;
    }

    // Advance to simulated verification screen
    setMode('verify');
    setResendTimer(30);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.trim() !== '7729') {
      setErrorMsg('Incorrect simulated verification parameters. Enter 7729.');
      return;
    }

    onLoginSuccess({
      id: 'user_new',
      firstName: firstName,
      lastName: lastName,
      email: email,
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      isGoogleConnected: false,
      joinedAt: new Date().toISOString()
    });
  };

  const startResendMock = () => {
    setResendTimer(45);
    setInfoMsg('Simulated verification code has been dispatched again to your email ID.');
  };

  const handleForgotTrigger = () => {
    setInfoMsg('Secure credential recovery links dispatched to your inbox.');
    setMode('login');
  };

  return (
    <div id="auth-screen-layout" className="min-h-screen bg-slate-950 flex flex-col justify-center items-center p-4 relative overflow-hidden select-none">
      
      {/* Visual backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-3xl -z-10 animate-pulse-glow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl -z-10" />

      {/* Main card */}
      <div className="w-full max-w-md bg-blur-card rounded-3xl p-6 md:p-8 border border-indigo-950/40 shadow-2xl space-y-6">
        
        {/* Logo and Brand tagline */}
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-60 blur-xs" />
              <img 
                src="https://www.image2url.com/r2/default/images/1781514813185-f218cda4-2cbf-4bea-ae94-8b0a4734273d.png" 
                alt="Momenzi Logo" 
                className="relative w-12 h-12 object-contain bg-slate-900 rounded-xl p-1"
              />
            </div>
          </div>
          
          <h1 className="font-display font-black text-2xl tracking-tight text-white">Momenzi OS</h1>
          <p className="text-xs text-slate-400">Personal Productivity Operating System</p>
        </div>

        {/* Dynamic Modes Forms */}
        {mode === 'login' && (
          <div className="space-y-4 animate-fadeIn">
            
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {infoMsg && (
              <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs rounded-xl flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                <span>{infoMsg}</span>
              </div>
            )}

            <div className="space-y-3">
              <div>
                <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Email Address</label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center">
                  <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Password credential</label>
                  <button 
                    onClick={() => setMode('forgot')}
                    className="text-[10px] text-indigo-400 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-202 outline-none focus:border-indigo-505"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-450 font-mono">
              <label className="flex items-center space-x-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded accent-indigo-500"
                />
                <span>Remember session</span>
              </label>

              <span className="text-slate-500 text-[10px]">SUPABASE AUTHS SECURED</span>
            </div>

            <button
              id="login-submit-btn"
              onClick={handleStartLoginSim}
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-500/10 transition flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Authenticate Session</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            {/* Google OAuth Quick link */}
            <div className="relative flex items-center justify-center py-2.5">
              <div className="border-t border-slate-850 w-full absolute" />
              <span className="bg-slate-900 px-3 text-[10px] font-mono text-slate-500 uppercase font-bold relative z-10">Or connect via</span>
            </div>

            <button
              onClick={handleGoogleOAuth}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-200 text-xs font-bold rounded-xl transition flex items-center justify-center space-x-2"
            >
              <Chrome className="w-4 h-4 text-indigo-400" />
              <span>Sign in with Google</span>
            </button>

            <p className="text-xs text-center text-slate-400">
              New to Momenzi?{' '}
              <button onClick={() => setMode('register')} className="text-indigo-400 font-bold hover:underline">
                Create personal workspace
              </button>
            </p>

          </div>
        )}

        {mode === 'register' && (
          <form onSubmit={handleRequestRegister} className="space-y-4 animate-fadeIn">
            
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">First Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Alex"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8.5 pr-2 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Last Name</label>
                <div className="relative mt-1">
                  <User className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="Morgan"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8.5 pr-2 py-2 text-xs text-slate-200 outline-none"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Email Address</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="alex.morgan@operating.system"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-200 outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-slate-455 uppercase font-mono font-bold">Password</label>
                <input
                  type="password"
                  required
                  placeholder="Min 6 chars"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-200 outline-none"
                />
              </div>

              <div>
                <label className="text-[10px] text-slate-455 uppercase font-mono font-bold">Confirm Pass</label>
                <input
                  type="password"
                  required
                  placeholder="Match password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-200 outline-none"
                />
              </div>
            </div>

            <button
              id="register-submit-btn"
              type="submit"
              className="w-full py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white text-xs font-bold rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>Build Account & Verify</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <p className="text-xs text-center text-slate-400">
              Already possess credentials?{' '}
              <button type="button" onClick={() => setMode('login')} className="text-indigo-400 font-bold hover:underline">
                Authenticate here
              </button>
            </p>

          </form>
        )}

        {mode === 'verify' && (
          <form onSubmit={handleVerifyCode} className="space-y-4 animate-fadeIn">
            
            <div className="p-3 bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs rounded-xl flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 flex-shrink-0" />
              <span>We have dispatched a simulated validation code to: {email}. Enter code 7729.</span>
            </div>

            {errorMsg && (
              <div className="p-2 bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs rounded-lg">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Verification code</label>
              <input
                type="text"
                required
                maxLength={4}
                placeholder="7729"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 mt-1 text-center font-mono text-lg tracking-widest text-white font-bold focus:border-indigo-500"
              />
            </div>

            <button
              id="verify-code-submit"
              type="submit"
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-650 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Verify Code
            </button>

            <div className="text-center">
              {resendTimer > 0 ? (
                <p className="text-xs text-slate-500">Resend email code in {resendTimer}s</p>
              ) : (
                <button type="button" onClick={startResendMock} className="text-xs text-indigo-400 font-bold hover:underline">
                  Resend verification code details
                </button>
              )}
            </div>
          </form>
        )}

        {mode === 'forgot' && (
          <div className="space-y-4 animate-fadeIn">
            <p className="text-xs text-slate-400">Enter your workspace index email ID to recover secure credentials.</p>
            
            <div>
              <label className="text-[10px] text-slate-450 uppercase font-mono font-bold">Email Address</label>
              <input
                type="email"
                placeholder="alex.morgan@operating.system"
                className="w-full bg-slate-905 border border-slate-800 rounded-xl px-3 py-2 text-xs mt-1 text-slate-200 outline-none"
              />
            </div>

            <button
              onClick={handleForgotTrigger}
              className="w-full py-2.5 bg-indigo-500 hover:bg-indigo-605 text-white font-bold text-xs rounded-xl shadow-lg transition"
            >
              Dispatch Recovery
            </button>

            <button 
              onClick={() => setMode('login')} 
              className="w-full text-xs text-slate-500 hover:text-white"
            >
              Return to Authentication
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
