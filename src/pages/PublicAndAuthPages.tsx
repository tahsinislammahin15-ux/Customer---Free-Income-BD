import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Trophy,
  Crown,
  Mail,
  Phone,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  Lock,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
} from 'lucide-react';
import { PUBLIC_ENV } from '../config/env';
import { useApp } from '../context/AppContext';

/* ============================================================================
   GOOGLE 'G' SVG BADGE
   ============================================================================ */
const GoogleBadgeIcon: React.FC = () => (
  <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
      <path
        fill="#EA4335"
        d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.8C6.2 7.2 8.9 5 12 5z"
      />
      <path
        fill="#4285F4"
        d="M23.5 12.3c0-.8-.1-1.7-.2-2.5H12v4.8h6.5c-.3 1.5-1.1 2.8-2.4 3.6l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
      />
      <path
        fill="#FBBC05"
        d="M5.3 14.8c-.2-.8-.4-1.6-.4-2.5s.2-1.7.4-2.5L1.6 7C.6 9 .1 11.2.1 13.5s.5 4.5 1.5 6.5l3.7-2.9z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3.1 0-5.8-2.1-6.7-5l-3.7 2.9C3.5 21.4 7.4 24 12 24z"
      />
    </svg>
  </span>
);

/* ============================================================================
   1. PLAYER LOGIN PAGE (/login)
   ============================================================================ */
export const LoginPage: React.FC = () => {
  const {
    authReady,
    currentUser,
    pendingGoogleRegistration,
    login,
    signInWithGoogle,
    sendPasswordReset,
    navigate,
  } = useApp();
  const location = useLocation();
  const routerNavigate = useNavigate();

  const fromPath = (location.state as { from?: string } | null)?.from || '/account';

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  // Forgot password flow
  const [resetMode, setResetMode] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetBusy, setResetBusy] = useState(false);
  const [resetFeedback, setResetFeedback] = useState<{ ok: boolean; text: string } | null>(null);

  if (!authReady) {
    return (
      <div className="max-w-[440px] mx-auto px-3.5 py-16 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-3 border-[#3B0A0A] dark:border-[#FF5500] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-gray-500 dark:text-gray-400">Checking authentication status...</p>
      </div>
    );
  }

  if (pendingGoogleRegistration) {
    return <Navigate to="/register" replace />;
  }

  if (currentUser) {
    return <Navigate to={fromPath} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setSubmitting(true);
    const res = await login(identifier, password);
    setSubmitting(false);

    if (res.needsRegistration) {
      routerNavigate('/register', { replace: true });
      return;
    }
    if (res.ok) {
      routerNavigate(fromPath, { replace: true });
      return;
    }
    setAuthError(res.error || 'Unable to sign in. Please verify your credentials.');
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setGoogleBusy(true);
    const res = await signInWithGoogle();
    setGoogleBusy(false);

    if (res.needsRegistration) {
      routerNavigate('/register', { replace: true });
      return;
    }
    if (res.ok) {
      routerNavigate(fromPath, { replace: true });
      return;
    }
    if (res.error) {
      setAuthError(res.error);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetFeedback(null);
    setResetBusy(true);
    const res = await sendPasswordReset(resetEmail);
    setResetBusy(false);
    if (res.ok) {
      setResetFeedback({
        ok: true,
        text: 'Password reset link sent! Check your inbox and spam folder.',
      });
    } else {
      setResetFeedback({
        ok: false,
        text: res.error || 'Could not send reset email.',
      });
    }
  };

  return (
    <div className="max-w-[440px] mx-auto px-3.5 py-8 sm:py-12">
      <div className="zvy-card p-6 sm:p-7 space-y-5">
        {resetMode ? (
          <>
            <div className="space-y-1 text-left">
              <button
                type="button"
                onClick={() => {
                  setResetMode(false);
                  setResetFeedback(null);
                }}
                className="text-xs font-semibold text-[#3B0A0A] dark:text-[#FCA5A5] inline-flex items-center gap-1 hover:underline mb-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
              <h1 className="text-[22px] font-bold text-[#111827] dark:text-[#F8FAFC] leading-tight">
                Reset Password
              </h1>
              <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8]">
                Enter your registered account email to receive a password reset link.
              </p>
            </div>

            {resetFeedback && (
              <div
                role="alert"
                className={`p-3 rounded-xl text-xs flex items-start gap-2 border ${
                  resetFeedback.ok
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-700 dark:text-red-200'
                }`}
              >
                {resetFeedback.ok ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                )}
                <span>{resetFeedback.text}</span>
              </div>
            )}

            <form onSubmit={handleResetSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1.5">
                  Account Email
                </label>
                <input
                  type="email"
                  required
                  maxLength={160}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full h-[44px] px-3.5 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <button
                type="submit"
                disabled={resetBusy}
                className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-[14px] font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {resetBusy ? 'Sending Link...' : 'Send Reset Email'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="space-y-1 text-left">
              <h1 className="text-[22px] font-bold text-[#111827] dark:text-[#F8FAFC] leading-tight">
                Login
              </h1>
              <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8]">
                Sign in with your account or Google to continue
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-200 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1.5">
                  Email or Phone
                </label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  autoComplete="username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter Email or 017XXXXXXXX"
                  className="w-full h-[44px] px-3.5 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0]">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setResetEmail(identifier.includes('@') ? identifier : '');
                      setResetMode(true);
                    }}
                    className="text-[11px] font-semibold text-[#3B0A0A] dark:text-[#FCA5A5] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <input
                  type="password"
                  required
                  maxLength={128}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-[44px] px-3.5 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || googleBusy}
                className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-[14px] font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {submitting ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="text-center text-[12px] font-semibold text-[#6B7280] dark:text-[#94A3B8] py-0.5">
              OR
            </div>

            <button
              type="button"
              disabled={googleBusy || submitting}
              onClick={handleGoogleSignIn}
              className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs disabled:opacity-60"
            >
              <GoogleBadgeIcon />
              <span>{googleBusy ? 'Connecting Google...' : 'Continue with Google'}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate('register')}
                className="text-[13px] font-semibold text-[#3B0A0A] dark:text-[#FCA5A5] underline underline-offset-2 hover:opacity-80"
              >
                New User? Register Now
              </button>
            </div>

            <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between text-[11px] text-[#6B7280] dark:text-[#94A3B8]">
              <span>Admin Console</span>
              <button
                type="button"
                onClick={() => navigate('admin')}
                className="font-semibold text-[#3B0A0A] dark:text-[#FCA5A5] hover:underline inline-flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal →</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   2. REGISTRATION PAGE (/register + FIRST-TIME GOOGLE PROFILE COMPLETION)
   ============================================================================ */
export const RegisterPage: React.FC = () => {
  const {
    authReady,
    currentUser,
    pendingGoogleRegistration,
    register,
    signInWithGoogle,
    completeGoogleRegistration,
    cancelGoogleRegistration,
    navigate,
  } = useApp();
  const routerNavigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [ffIgn, setFfIgn] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('');
  const [showOptionalGameFields, setShowOptionalGameFields] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      setReferralCodeInput(refParam.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase());
      setShowOptionalGameFields(true);
    }
  }, []);

  useEffect(() => {
    if (pendingGoogleRegistration) {
      setName((prev) => prev || pendingGoogleRegistration.name || '');
      setEmail(pendingGoogleRegistration.email || '');
      setAuthError('');
    }
  }, [pendingGoogleRegistration]);

  if (!authReady) {
    return (
      <div className="max-w-[460px] mx-auto px-3.5 py-16 text-center space-y-3">
        <div className="w-8 h-8 rounded-full border-3 border-[#3B0A0A] dark:border-[#FF5500] border-t-transparent animate-spin mx-auto" />
        <p className="text-xs text-gray-500 dark:text-gray-400">Checking authentication status...</p>
      </div>
    );
  }

  if (currentUser && !pendingGoogleRegistration) {
    return <Navigate to="/account" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (pendingGoogleRegistration) {
      setSubmitting(true);
      const res = await completeGoogleRegistration({
        name: name.trim(),
        phone: phone.trim(),
        ffUid: ffUid.trim().replace(/\D/g, '') || undefined,
        ffIgn: ffIgn.trim() || undefined,
        referralCodeInput: referralCodeInput.trim() || undefined,
      });
      setSubmitting(false);

      if (res.ok) {
        routerNavigate('/account', { replace: true });
      } else {
        setAuthError(res.error || 'Could not complete your registration.');
      }
      return;
    }

    if (password !== confirmPassword) {
      setAuthError('Password and Confirm Password do not match.');
      return;
    }

    setSubmitting(true);
    const res = await register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      ffUid: ffUid.trim().replace(/\D/g, '') || undefined,
      ffIgn: ffIgn.trim() || undefined,
      referralCodeInput: referralCodeInput.trim() || undefined,
    });
    setSubmitting(false);

    if (res.ok) {
      routerNavigate('/account', { replace: true });
    } else {
      setAuthError(res.error || 'Registration failed. Please check your details.');
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setGoogleBusy(true);
    const res = await signInWithGoogle();
    setGoogleBusy(false);

    if (res.ok && !res.needsRegistration) {
      routerNavigate('/account', { replace: true });
      return;
    }
    if (!res.ok && res.error) {
      setAuthError(res.error);
    }
  };

  const handleCancelGoogle = async () => {
    setAuthError('');
    await cancelGoogleRegistration();
    routerNavigate('/login', { replace: true });
  };

  return (
    <div className="max-w-[460px] mx-auto px-3.5 py-8 sm:py-12">
      <div className="zvy-card p-6 sm:p-7 space-y-5">
        {pendingGoogleRegistration ? (
          <>
            <div className="space-y-1 text-left">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Google Account Connected</span>
              </div>
              <h1 className="text-[22px] font-bold text-[#111827] dark:text-[#F8FAFC] leading-tight">
                Complete Registration
              </h1>
              <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8]">
                First-time setup: confirm your profile details to create your personal wallet & account.
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-200 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                  Google Email (Verified)
                </label>
                <input
                  type="email"
                  readOnly
                  value={pendingGoogleRegistration.email}
                  className="w-full h-[42px] px-3.5 text-[13px] rounded-xl bg-gray-100 dark:bg-[#161F30] border border-[#D1D5DB] dark:border-[#1E293B] text-[#4B5563] dark:text-[#CBD5E1] cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full h-[42px] px-3.5 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                  Phone Number (Bangladesh)
                </label>
                <input
                  type="tel"
                  required
                  maxLength={14}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full h-[42px] px-3.5 text-[13px] font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8] mb-1">
                    Free Fire UID (Optional)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={12}
                    value={ffUid}
                    onChange={(e) => setFfUid(e.target.value.replace(/\D/g, ''))}
                    placeholder="Player UID"
                    className="w-full h-[36px] px-2.5 text-[12px] font-mono rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8] mb-1">
                    In-Game Name (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={40}
                    value={ffIgn}
                    onChange={(e) => setFfIgn(e.target.value)}
                    placeholder="Your IGN"
                    className="w-full h-[36px] px-2.5 text-[12px] font-mono rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8] mb-1">
                    Referral Code (Optional)
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={referralCodeInput}
                    onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                    placeholder="Referral code"
                    className="w-full h-[36px] px-2.5 text-[12px] font-mono rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-[14px] font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {submitting ? 'Creating Account...' : 'Complete Registration & Sign In'}
              </button>

              <button
                type="button"
                onClick={handleCancelGoogle}
                className="w-full h-[40px] rounded-xl border border-[#D1D5DB] dark:border-[#334155] text-xs font-semibold text-[#4B5563] dark:text-[#CBD5E1] hover:bg-gray-50 dark:hover:bg-[#161F30] transition-colors"
              >
                Cancel / Use Different Account
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="space-y-1 text-left">
              <h1 className="text-[22px] font-bold text-[#111827] dark:text-[#F8FAFC] leading-tight">
                Sign Up
              </h1>
              <p className="text-[13px] text-[#6B7280] dark:text-[#94A3B8]">
                Enter your information to create an account
              </p>
            </div>

            {authError && (
              <div
                role="alert"
                className="p-3 rounded-xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-200 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  autoComplete="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full h-[42px] px-3.5 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  maxLength={160}
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your Email Address"
                  className="w-full h-[42px] px-3.5 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                  Phone number
                </label>
                <input
                  type="tel"
                  required
                  maxLength={14}
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full h-[42px] px-3.5 text-[13px] font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    maxLength={128}
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 chars"
                    className="w-full h-[42px] px-3 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-[#111827] dark:text-[#E2E8F0] mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    maxLength={128}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat password"
                    className="w-full h-[42px] px-3 text-[13px] rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-[#F8FAFC] placeholder-[#9CA3AF] focus:outline-none focus:border-[#3B0A0A]"
                  />
                </div>
              </div>

              <div className="pt-0.5">
                <button
                  type="button"
                  onClick={() => setShowOptionalGameFields((prev) => !prev)}
                  className="text-[11px] font-semibold text-[#3B0A0A] dark:text-[#FCA5A5] flex items-center gap-1 hover:underline"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {showOptionalGameFields
                      ? 'Hide Free Fire UID & Referral Code (৳20 Bonus)'
                      : '+ Add Free Fire UID & Referral Code (Claim ৳20 Welcome Bonus)'}
                  </span>
                </button>

                {showOptionalGameFields && (
                  <div className="mt-2.5 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8] mb-1">
                        Free Fire UID
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        maxLength={12}
                        value={ffUid}
                        onChange={(e) => setFfUid(e.target.value.replace(/\D/g, ''))}
                        placeholder="Player UID"
                        className="w-full h-[36px] px-2.5 text-[12px] font-mono rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8] mb-1">
                        In-Game Name
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        value={ffIgn}
                        onChange={(e) => setFfIgn(e.target.value)}
                        placeholder="Your IGN"
                        className="w-full h-[36px] px-2.5 text-[12px] font-mono rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-medium text-[#4B5563] dark:text-[#94A3B8] mb-1">
                        Referral Code
                      </label>
                      <input
                        type="text"
                        maxLength={20}
                        value={referralCodeInput}
                        onChange={(e) => setReferralCodeInput(e.target.value.toUpperCase())}
                        placeholder="Optional code"
                        className="w-full h-[36px] px-2.5 text-[12px] font-mono rounded-lg bg-white dark:bg-[#111827] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
                      />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || googleBusy}
                className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-[14px] font-semibold transition-colors shadow-xs disabled:opacity-60"
              >
                {submitting ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            <div className="text-center text-[12px] font-semibold text-[#6B7280] dark:text-[#94A3B8] py-0.5">
              OR
            </div>

            <button
              type="button"
              disabled={googleBusy || submitting}
              onClick={handleGoogleSignIn}
              className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-[14px] font-semibold flex items-center justify-center gap-3 transition-colors shadow-xs disabled:opacity-60"
            >
              <GoogleBadgeIcon />
              <span>{googleBusy ? 'Connecting Google...' : 'Continue with Google'}</span>
            </button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => navigate('login')}
                className="text-[13px] font-semibold text-[#3B0A0A] dark:text-[#FCA5A5] underline underline-offset-2 hover:opacity-80"
              >
                Already have account? Login Now
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   3. LEADERBOARD PAGE (/leaderboard — LIVE DATA ONLY, ZERO FAKE DEMO ACCOUNTS)
   ============================================================================ */
export const LeaderboardPage: React.FC = () => {
  const { users, orders, navigate } = useApp();
  const [periodTab, setPeriodTab] = useState<'WEEKLY' | 'MONTHLY' | 'LIFETIME'>('MONTHLY');
  const [categoryTab, setCategoryTab] = useState<'spend' | 'tournaments' | 'earners' | 'referrers'>(
    'spend'
  );
  const [visibleCount, setVisibleCount] = useState(20);

  const spendLeaderboard = React.useMemo(() => {
    const appUserEntries = users.map((u) => {
      const userOrders = orders.filter((o) => o.userId === u.id && o.status === 'Completed');
      const realSpend = userOrders.reduce((acc, o) => acc + o.amountBdt, 0);
      return {
        id: u.id,
        name: u.name,
        uid: u.ffUid || '—',
        spend: realSpend,
        orders: userOrders.length,
        wins: u.tournamentWins,
        referrals: u.referralCount,
        earned: u.totalEarned,
      };
    });

    return appUserEntries.sort((a, b) => {
      if (categoryTab === 'tournaments') return b.wins - a.wins;
      if (categoryTab === 'earners') return b.earned - a.earned;
      if (categoryTab === 'referrers') return b.referrals - a.referrals;
      return b.spend - a.spend;
    });
  }, [users, orders, categoryTab, periodTab]);

  const top3 = spendLeaderboard.slice(0, 3);
  const restRows = spendLeaderboard.slice(3, visibleCount);

  const formatMetric = (item: (typeof spendLeaderboard)[number]) => {
    if (categoryTab === 'tournaments') return `${item.wins} Booyahs`;
    if (categoryTab === 'earners') return `৳${item.earned.toLocaleString()} Earned`;
    if (categoryTab === 'referrers') return `${item.referrals} Referrals`;
    return `৳${item.spend.toLocaleString()}`;
  };

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-5">
      <div className="zvy-card p-4 sm:p-6 space-y-5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center justify-center gap-2">
            <Trophy className="w-5 h-5 text-[#F59E0B]" />
            <h1 className="text-[18px] sm:text-[22px] font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight uppercase">
              TOP 100 SPEND LEADERBOARD
            </h1>
          </div>
          <p className="text-[12px] text-[#6B7280] dark:text-[#94A3B8]">
            Verified H41FFTOPUP players ranked by completed orders, esports Booyahs & rewards
          </p>
        </div>

        <div className="flex justify-center">
          <div className="inline-flex items-center bg-[#F3F4F6] dark:bg-[#1E293B] p-1 rounded-xl border border-[#E5E7EB] dark:border-[#334155]">
            {(['WEEKLY', 'MONTHLY', 'LIFETIME'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodTab(p)}
                className={`px-4 py-1.5 rounded-lg text-[11px] font-extrabold tracking-wide transition-all ${
                  periodTab === p
                    ? 'bg-[#3B0A0A] text-white shadow-xs'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-1.5 flex-wrap">
          {[
            { id: 'spend', label: 'Top Spend (BDT)' },
            { id: 'tournaments', label: 'Esports Booyahs' },
            { id: 'earners', label: 'Task Earners' },
            { id: 'referrers', label: 'Top Referrers' },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryTab(cat.id as typeof categoryTab)}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                categoryTab === cat.id
                  ? 'bg-[#FFF5F5] dark:bg-[#3B0A0A]/40 border-[#3B0A0A] dark:border-[#FF5500] text-[#3B0A0A] dark:text-[#FCA5A5]'
                  : 'bg-white dark:bg-[#0B1120] border-[#E5E7EB] dark:border-[#1E293B] text-[#6B7280] dark:text-[#94A3B8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {spendLeaderboard.length === 0 ? (
          <div className="py-10 px-4 rounded-2xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-center space-y-3">
            <Trophy className="w-8 h-8 text-[#F59E0B] mx-auto" />
            <div className="text-sm font-bold text-[#111827] dark:text-white">
              Leaderboard Rankings Populate Automatically
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] max-w-md mx-auto">
              Sign in and place Diamond Top-Up orders or win Custom Room matches to appear on the live verified leaderboard.
            </p>
            <button
              type="button"
              onClick={() => navigate('topup')}
              className="px-4 py-2 rounded-xl bg-[#3B0A0A] text-white text-xs font-bold"
            >
              Browse Top-Up Packages
            </button>
          </div>
        ) : (
          <>
            {top3.length >= 3 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-5 pb-2">
                <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#334155] bg-gradient-to-b from-[#F8FAFC] to-[#F1F5F9] dark:from-[#1E293B] dark:to-[#0F172A] p-3 text-center space-y-1.5 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-[#64748B] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center ring-2 ring-[#94A3B8]">
                    #2
                  </div>
                  <div className="text-[11px] sm:text-[13px] font-extrabold text-[#111827] dark:text-white truncate">
                    {top3[1].name}
                  </div>
                  <div className="text-[12px] sm:text-[14px] font-extrabold text-[#059669]">
                    {formatMetric(top3[1])}
                  </div>
                  <div className="text-[10px] font-semibold text-[#64748B] dark:text-[#94A3B8]">
                    {top3[1].orders} Orders
                  </div>
                </div>

                <div className="rounded-2xl border-2 border-[#F59E0B] bg-gradient-to-b from-[#FFFBEB] to-[#FEF3C7] dark:from-[#3B2306] dark:to-[#1F1203] p-3.5 sm:p-4 text-center space-y-1.5 shadow-md -translate-y-2">
                  <div className="flex justify-center -mt-6 mb-0.5">
                    <span className="w-7 h-7 rounded-full bg-[#F59E0B] text-white flex items-center justify-center shadow-xs animate-bounce">
                      <Crown className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-full bg-[#D97706] text-white font-extrabold text-sm sm:text-base flex items-center justify-center ring-2 ring-[#FBBF24]">
                    #1
                  </div>
                  <div className="text-[12px] sm:text-[14px] font-extrabold text-[#111827] dark:text-white truncate">
                    {top3[0].name}
                  </div>
                  <div className="text-[13px] sm:text-[16px] font-extrabold text-[#B45309] dark:text-[#FBBF24]">
                    {formatMetric(top3[0])}
                  </div>
                  <div className="text-[10px] font-bold text-[#92400E] dark:text-[#FDE68A]">
                    {top3[0].orders} Orders
                  </div>
                </div>

                <div className="rounded-2xl border border-[#FDBA74] dark:border-[#9A3412] bg-gradient-to-b from-[#FFF7ED] to-[#FFEDD5] dark:from-[#2C1606] dark:to-[#170B02] p-3 text-center space-y-1.5 shadow-xs">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-full bg-[#EA580C] text-white font-extrabold text-xs sm:text-sm flex items-center justify-center ring-2 ring-[#FB923C]">
                    #3
                  </div>
                  <div className="text-[11px] sm:text-[13px] font-extrabold text-[#111827] dark:text-white truncate">
                    {top3[2].name}
                  </div>
                  <div className="text-[12px] sm:text-[14px] font-extrabold text-[#EA580C]">
                    {formatMetric(top3[2])}
                  </div>
                  <div className="text-[10px] font-semibold text-[#9A3412] dark:text-[#FDBA74]">
                    {top3[2].orders} Orders
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {(top3.length < 3 ? spendLeaderboard : restRows).map((row, index) => {
                const rankNum = top3.length < 3 ? index + 1 : index + 4;
                return (
                  <div
                    key={row.id}
                    className="flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="w-7 h-7 rounded-lg bg-[#3B0A0A] text-white text-[11px] font-extrabold flex items-center justify-center shrink-0">
                        #{rankNum}
                      </span>
                      <div className="min-w-0">
                        <div className="text-[13px] font-bold text-[#111827] dark:text-[#F8FAFC] truncate">
                          {row.name}
                        </div>
                        <div className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] font-mono">
                          UID: {row.uid} · {row.orders} Orders
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[13px] font-extrabold text-[#059669]">
                        {formatMetric(row)}
                      </div>
                      <div className="text-[10px] text-[#6B7280] dark:text-[#94A3B8]">
                        {row.wins} Wins · {row.referrals} Refs
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {visibleCount < spendLeaderboard.length && (
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 10)}
                  className="px-5 py-2 rounded-xl bg-[#3B0A0A] text-white text-xs font-bold hover:bg-[#4C0E0E] transition-colors"
                >
                  Load More Players
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
   4. ABOUT US PAGE (/about)
   ============================================================================ */
export const AboutPage: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  return (
    <div className="max-w-[960px] mx-auto px-3.5 sm:px-6 py-8 space-y-6">
      <div className="zvy-card p-6 sm:p-8 space-y-3">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#3B0A0A] text-white text-[11px] font-bold">
          About {siteSettings.siteName} · Dhaka, Bangladesh
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
          Bangladesh’s Trusted Free Fire Diamond Top Up, Esports & Rewards Hub
        </h1>
        <p className="text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
          {siteSettings.siteName} delivers instant 30–60 second Bangladesh (BD) server UID top-ups, Weekly/Monthly memberships, moderated Free Fire custom rooms, and verified BDT reward tasks under a single unified wallet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="zvy-card p-5 space-y-2">
          <div className="text-xs font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5]">
            01. Instant UID & UniPin Top Up
          </div>
          <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
            Zero Password Required
          </h2>
          <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
            We never ask for your Garena, Facebook, or Google login credentials. Diamonds are delivered directly via Player ID in 30–60 seconds.
          </p>
        </div>

        <div className="zvy-card p-5 space-y-2">
          <div className="text-xs font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5]">
            02. Moderated Esports Rooms
          </div>
          <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
            Anti-Cheat Custom Matches
          </h2>
          <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
            Every Solo, Duo, Squad, and Clash Squad tournament is supervised by Dhaka referees with instant prize pool payouts.
          </p>
        </div>

        <div className="zvy-card p-5 space-y-2">
          <div className="text-xs font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5]">
            03. Verified Free Income Tasks
          </div>
          <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
            Transparent Task Rewards
          </h2>
          <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
            Complete verified community tasks and referrals to earn BDT that can be transferred to your Main Wallet with 0% fee or withdrawn via bKash/Nagad.
          </p>
        </div>
      </div>

      <div className="zvy-card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
            Ready to Top Up on {siteSettings.siteName}?
          </h3>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
            Headquartered at {siteSettings.officeAddress}.
          </p>
        </div>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => navigate('topup')}
            className="px-4 py-2.5 rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            Browse Top Up Packages
          </button>
          <button
            type="button"
            onClick={() => navigate('contact')}
            className="px-4 py-2.5 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold"
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. CONTACT US PAGE (/contact)
   ============================================================================ */
export const ContactPage: React.FC = () => {
  const { siteSettings, submitContactMessage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-[960px] mx-auto px-3.5 sm:px-6 py-8 space-y-6">
      <div className="zvy-card p-5 sm:p-6 space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
          24/7 Player Support & Dhaka Helpdesk
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] dark:text-[#94A3B8]">
          Direct assistance for UID Top Up orders, tournament room IDs, and bKash/Nagad wallet verifications.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="zvy-card p-5 space-y-1.5">
          <Phone className="w-5 h-5 text-[#3B0A0A] dark:text-[#FCA5A5]" />
          <h2 className="text-sm font-bold">WhatsApp & Telegram</h2>
          <p className="text-xs font-mono text-[#111827] dark:text-[#F8FAFC]">
            WhatsApp: {siteSettings.supportWhatsapp}
          </p>
          <p className="text-xs font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">
            Telegram: {siteSettings.supportTelegram}
          </p>
        </div>

        <div className="zvy-card p-5 space-y-1.5">
          <Mail className="w-5 h-5 text-[#3B0A0A] dark:text-[#FCA5A5]" />
          <h2 className="text-sm font-bold">Official Support Email</h2>
          <p className="text-xs font-mono text-[#111827] dark:text-[#F8FAFC]">
            {siteSettings.supportEmail}
          </p>
          <p className="text-[11px] text-[#6B7280]">
            9:00 AM – 12:00 AM BST Daily
          </p>
        </div>

        <div className="zvy-card p-5 space-y-1.5">
          <MapPin className="w-5 h-5 text-[#3B0A0A] dark:text-[#FCA5A5]" />
          <h2 className="text-sm font-bold">Dhaka Office</h2>
          <p className="text-xs text-[#111827] dark:text-[#F8FAFC]">
            {siteSettings.officeAddress}
          </p>
          <p className="text-[11px] text-[#6B7280]">
            Banani, Dhaka-1213, Bangladesh
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 zvy-card p-5 sm:p-6 space-y-3.5"
        >
          <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
            Send a Message to Admin Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Phone number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Order ID / Support Topic"
                className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Describe your order or support request..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-semibold transition-colors"
          >
            Submit Support Message
          </button>
        </form>

        <div className="lg:col-span-6 zvy-card overflow-hidden min-h-[280px]">
          <iframe
            title="H41FFTOPUP Banani Dhaka Office Map"
            src={siteSettings.mapEmbedUrl || PUBLIC_ENV.MAP_EMBED_URL}
            className="w-full h-full min-h-[280px] border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   6. FAQ PAGE (/faq)
   ============================================================================ */
export const FaqPage: React.FC = () => {
  const { faqs } = useApp();
  const [cat, setCat] = useState<'All' | 'Top Up' | 'Tournaments' | 'Income Tasks' | 'Wallet & Payments'>('All');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>('FAQ-1');

  const filtered = faqs.filter((f) => {
    if (cat !== 'All' && f.category !== cat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-[820px] mx-auto px-3.5 sm:px-6 py-8 space-y-5">
      <div className="zvy-card p-5 space-y-1">
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
          Instant answers for UID Diamond Top-Up, Esports Custom Rooms, and Wallet Payments.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1E293B] overflow-x-auto no-scrollbar">
          {(['All', 'Top Up', 'Tournaments', 'Income Tasks', 'Wallet & Payments'] as const).map(
            (c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
                  cat === c
                    ? 'bg-[#3B0A0A] text-white'
                    : 'text-[#4B5563] dark:text-[#94A3B8]'
                }`}
              >
                {c}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            maxLength={100}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQ..."
            className="w-full sm:w-56 h-[38px] pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1E293B]"
          />
        </div>
      </div>

      <div className="space-y-2.5">
        {filtered.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div key={item.id} className="zvy-card overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-[11px] font-bold text-[#3B0A0A] dark:text-[#FCA5A5] mr-2">
                    [{item.category}]
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
                    {item.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#3B0A0A] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#6B7280] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-5 pb-4 pt-2.5 border-t border-[#E5E7EB] dark:border-[#1E293B] text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   7. PRIVACY POLICY PAGE (/privacy)
   ============================================================================ */
export const PrivacyPage: React.FC = () => {
  const { siteSettings } = useApp();
  return (
    <div className="max-w-[820px] mx-auto px-3.5 sm:px-6 py-8">
      <div className="zvy-card p-6 sm:p-8 space-y-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B0A0A] dark:text-[#FCA5A5]">
          <Lock className="w-4 h-4" />
          <span>Data Protection & Payment Security · {siteSettings.siteName}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
          Privacy Policy
        </h1>
        <div className="space-y-3.5 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
          <p>
            <strong>1. Zero Game Password Collection:</strong> {siteSettings.siteName} collects only your public numeric Free Fire Player UID and In-Game Name (IGN) to fulfill diamond top-ups and tournament entries. We never ask for your Facebook, Google, VK, or Garena passwords.
          </p>
          <p>
            <strong>2. Mobile Banking Security:</strong> When you pay or deposit via bKash, Nagad, Rocket, or Upay, we record only the sender/receiver number and Transaction ID (TrxID) for order verification. We never request your MFS PIN or OTP.
          </p>
          <p>
            <strong>3. Task Proof Privacy:</strong> Task submission proofs are reviewed solely by internal moderators to credit your reward balance and are never shared with third-party brokers.
          </p>
          <p>
            <strong>4. Support & Account Deletion:</strong> Contact{' '}
            <span className="font-mono font-bold text-[#3B0A0A] dark:text-[#FCA5A5]">
              {siteSettings.supportEmail}
            </span>{' '}
            for any account data inquiry.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   8. TERMS & CONDITIONS PAGE (/terms)
   ============================================================================ */
export const TermsPage: React.FC = () => {
  const { siteSettings, paymentSettings } = useApp();
  return (
    <div className="max-w-[820px] mx-auto px-3.5 sm:px-6 py-8">
      <div className="zvy-card p-6 sm:p-8 space-y-5">
        <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B0A0A] dark:text-[#FCA5A5]">
          <ShieldCheck className="w-4 h-4" />
          <span>Terms, Refund Policy & Fair-Play Rules · {siteSettings.siteName}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
          Terms & Conditions
        </h1>
        <div className="space-y-3.5 text-xs sm:text-sm text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
          <p>
            <strong>1. Diamond Top Up & Refund Policy:</strong> Players must enter the correct Free Fire Player ID (UID). Orders sent to a valid UID submitted by the customer cannot be reversed once diamonds are credited by Garena. If an order is cancelled due to stock maintenance before fulfillment, 100% of the BDT amount is refunded to your Main Wallet.
          </p>
          <p>
            <strong>2. Esports Custom Room Rules:</strong> Custom room participants must play on mobile devices without emulators or third-party scripts. Sharing unlocked Room IDs/Passwords with unregistered players results in disqualification.
          </p>
          <p>
            <strong>3. Task Rewards Policy:</strong> {siteSettings.siteName} rewards genuine task completions and verified referrals. Duplicate accounts or fake screenshot proofs will be rejected.
          </p>
          <p>
            <strong>4. Wallet Withdrawals:</strong> Approved Income Balance can be withdrawn once the minimum threshold of ৳{paymentSettings.minWithdrawBdt} BDT is met via bKash, Nagad, Rocket, or Upay, or transferred to Main Balance with 0% fee.
          </p>
        </div>
      </div>
    </div>
  );
};
