import { useState } from 'react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'attendee' | 'organizer'>('attendee');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900 px-4 py-12 sm:px-6 lg:px-8 font-sans relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/5 via-transparent to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>
      
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800 bg-slate-950/80 backdrop-blur-xl p-8 shadow-2xl transition-all duration-300 hover:border-slate-700 relative z-10">
        
        {/* Branding Header */}
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 text-emerald-400 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 hover:shadow-emerald-500/20">
            {/* Vault Shield SVG Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="h-7 w-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-100 bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
            {isLogin ? 'Welcome back to EventVault' : 'Create your secure account'}
          </h2>
          <p className="mt-3 text-sm text-slate-400">
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors focus:outline-none relative group"
            >
              {isLogin ? 'Sign up now' : 'Sign in here'}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-emerald-400 transition-all duration-300 group-hover:w-full" />
            </button>
          </p>
        </div>

        {/* Form Content */}
        <form className="mt-8 space-y-6" onSubmit={(e) => e.preventDefault()}>
          
          {/* Role Selection Tabs (Only relevant for login context, or adaptable for registration) */}
          {isLogin && (
            <div className="grid grid-cols-2 gap-2 rounded-xl bg-slate-900/50 p-1.5 border border-slate-800 backdrop-blur-sm">
              <button
                type="button"
                onClick={() => setRole('attendee')}
                className={`rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                  role === 'attendee'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <i className="fas fa-user mr-2"></i>Attendee
              </button>
              <button
                type="button"
                onClick={() => setRole('organizer')}
                className={`rounded-lg py-2.5 text-sm font-medium transition-all duration-300 ${
                  role === 'organizer'
                    ? 'bg-gradient-to-r from-emerald-500/20 to-emerald-500/10 text-emerald-400 shadow-lg shadow-emerald-500/10 border border-emerald-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <i className="fas fa-building mr-2"></i>Organizer / Agent
              </button>
            </div>
          )}

          <div className="space-y-4 rounded-md shadow-sm">
            {/* Full Name Field (Register Only) */}
            {!isLogin && (
              <div className="group">
                <label className="block text-sm font-medium text-slate-400 mb-1.5 transition-colors group-focus-within:text-emerald-400">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <i className="fas fa-user text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-400 mb-1.5 transition-colors group-focus-within:text-emerald-400">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-11 pr-4 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="group">
              <label className="block text-sm font-medium text-slate-400 mb-1.5 transition-colors group-focus-within:text-emerald-400">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <i className="fas fa-lock text-slate-500 group-focus-within:text-emerald-400 transition-colors" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 pl-11 pr-12 py-3 text-slate-200 placeholder-slate-500 focus:border-emerald-500/50 focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 hover:text-emerald-400 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <i className="fas fa-eye-slash text-sm" />
                  ) : (
                    <i className="fas fa-eye text-sm" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Conditional Sub-options */}
          {isLogin ? (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-slate-950"
                />
                <label htmlFor="remember-me" className="ml-2 text-slate-400">
                  Remember device
                </label>
              </div>
              <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                Forgot password?
              </a>
            </div>
          ) : (
            <div className="flex items-start text-sm">
              <input
                id="terms"
                type="checkbox"
                required
                className="mt-0.5 h-4 w-4 rounded border-slate-800 bg-slate-900 text-emerald-500 focus:ring-emerald-500/30 focus:ring-offset-slate-950"
              />
              <label htmlFor="terms" className="ml-2 text-slate-400 leading-tight">
                I accept the Escrow Refund Guarantees and Platform Terms of Service.
              </label>
            </div>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 hover:shadow-emerald-500/40 active:scale-[0.98] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center gap-2">
                {isLogin ? (
                  <><i className="fas fa-unlock"></i>Unlock Vault</>
                ) : (
                  <><i className="fas fa-user-plus"></i>Register Account</>
                )}
              </span>
            </button>
          </div>
        </form>

        {/* Third-Party Authentication Divider */}
        {isLogin && (
          <div className="mt-6">
            <div className="relative flex items-center justify-center">
              <div className="absolute w-full border-t border-slate-800" />
              <span className="relative bg-slate-950 px-3 text-xs uppercase tracking-wider text-slate-500">
                Or secure access via
              </span>
            </div>

            <div className="mt-4">
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-900 hover:text-slate-100 hover:border-slate-700 transition-all duration-300 group"
              >
                {/* Standard Google Icon SVG */}
                <svg className="h-5 w-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}