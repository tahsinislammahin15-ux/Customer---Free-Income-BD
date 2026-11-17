import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
} from 'recharts';
import {
  LayoutDashboard,
  Users,
  Package,
  ShoppingCart,
  Trophy,
  CheckSquare,
  Share2,
  Wallet,
  CreditCard,
  Newspaper,
  MessageSquare,
  Settings,
  FileText,
  RotateCcw,
  Plus,
  Trash2,
  Ban,
  CheckCircle2,
  XCircle,
  Lock,
  KeyRound,
  ShieldCheck,
  LogOut,
  AlertTriangle,
  RefreshCw,
  Clock,
  Globe,
  Server,
  Eye,
} from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';
import { useApp } from '../context/AppContext';
import { auth } from '../firebase';
import { TASK_IMAGE, TOURNAMENT_IMAGE } from '../data/seedData';
import {
  BlogPost,
  DiamondPackage,
  IncomeTask,
  TopUpOrder,
  Tournament,
  User,
  WalletTransaction,
} from '../types';
import { WalletStatusBadge } from './AccountAndWalletPages';

type AdminTab =
  | 'dashboard'
  | 'users'
  | 'packages'
  | 'orders'
  | 'tournaments'
  | 'tasks'
  | 'referrals'
  | 'finance'
  | 'payments'
  | 'news'
  | 'messages'
  | 'settings'
  | 'secrets'
  | 'audit';

export const AdminPanelPage: React.FC = () => {
  const {
    users,
    packages,
    orders,
    tournaments,
    tasks,
    taskSubmissions,
    deposits,
    withdrawals,
    paymentSettings,
    blogPosts,
    contactMessages,
    auditLogs,
    siteSettings,
    adminSession,
    maskedSecrets,
    adminBootstrap,
    adminLogin,
    adminGoogleLogin,
    adminChangePassword,
    adminForgotPassword,
    adminLogout,
    fetchAdminSecrets,
    adminReplaceSecret,
    adminUpdateUser,
    adminAdjustUserLedger,
    adminToggleBanUser,
    adminSavePackage,
    adminDeletePackage,
    adminUpdateOrderStatus,
    adminSaveTournament,
    adminUpdateTournamentRoom,
    adminAnnounceTournamentWinner,
    adminSaveTask,
    adminDeleteTask,
    adminVerifyTaskSubmission,
    adminVerifyDeposit,
    adminVerifyWithdraw,
    adminUpdatePaymentSettings,
    adminSaveBlogPost,
    adminDeleteBlogPost,
    adminResolveContactMessage,
    adminUpdateSiteSettings,
    lockedPendingByUser,
    refreshWalletFromBackend,
    addToast,
    theme,
  } = useApp();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [userSearch, setUserSearch] = useState('');

  // Finance Tab Filters, Search & Rejection Reason State
  const [depSearch, setDepSearch] = useState('');
  const [depStatusFilter, setDepStatusFilter] = useState<string>('All');
  const [wthSearch, setWthSearch] = useState('');
  const [wthStatusFilter, setWthStatusFilter] = useState<string>('All');
  const [decisionReasonById, setDecisionReasonById] = useState<Record<string, string>>({});
  const [previewScreenshotUrl, setPreviewScreenshotUrl] = useState<string | null>(null);

  // User Wallet & Double-Entry Ledger Inspector State
  const [inspectUser, setInspectUser] = useState<User | null>(null);
  const [inspectBalances, setInspectBalances] = useState<{
    mainBalance: number;
    incomeBalance: number;
    bonusBalance: number;
    lockedPendingBdt: number;
  } | null>(null);
  const [inspectLedger, setInspectLedger] = useState<WalletTransaction[]>([]);
  const [inspectLoading, setInspectLoading] = useState(false);
  const [adjWallet, setAdjWallet] = useState<'Main' | 'Income' | 'Bonus'>('Main');
  const [adjDirection, setAdjDirection] = useState<'credit' | 'debit'>('credit');
  const [adjAmount, setAdjAmount] = useState<number>(100);
  const [adjReason, setAdjReason] = useState<string>('Manual promotional or reconciliation adjustment');

  const handleInspectUserWallet = async (userObj: User) => {
    setInspectUser(userObj);
    setInspectLoading(true);
    try {
      const headers: Record<string, string> = {};
      if (adminSession.sessionToken) {
        headers.Authorization = `Bearer ${adminSession.sessionToken}`;
        headers['X-Admin-Token'] = adminSession.sessionToken;
      } else if (auth.currentUser) {
        const idToken = await auth.currentUser.getIdToken();
        headers.Authorization = `Bearer ${idToken}`;
      }
      const res = await fetch(`/api/wallet/user/${encodeURIComponent(userObj.id)}`, {
        headers,
      });
      if (res.ok) {
        const data = await res.json();
        if (data?.ok) {
          setInspectBalances(data.balances || null);
          setInspectLedger(
            Array.isArray(data.userLedger)
              ? data.userLedger
              : Array.isArray(data.ledger)
              ? data.ledger
              : []
          );
        }
      } else {
        addToast('Ledger Fetch Failed', 'Unable to authorize user wallet lookup.', 'error');
      }
    } catch {
      addToast('Network Error', 'Failed to inspect user ledger.', 'error');
    }
    setInspectLoading(false);
  };

  // Auth Portal State
  const [authMode, setAuthMode] = useState<'login' | 'bootstrap' | 'forgot'>('login');
  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

  // Bootstrap Form State
  const [bootEmail, setBootEmail] = useState('');
  const [bootUsername, setBootUsername] = useState('');
  const [bootPassword, setBootPassword] = useState('');

  // Forgot Password State
  const [forgotEmail, setForgotEmail] = useState('');
  const [selectedWinnerByTrn, setSelectedWinnerByTrn] = useState<Record<string, string>>({});

  // Change Password Form State (Mandatory First Login + Voluntary Rotation)
  const [currPass, setCurrPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');
  const [passChangeError, setPassChangeError] = useState('');
  const [passChangeBusy, setPassChangeBusy] = useState(false);

  // Server Secret Replacement State (Write-Only, Never Reveal)
  const [newPaymentSecret, setNewPaymentSecret] = useState('');
  const [newUnipinSecret, setNewUnipinSecret] = useState('');
  const [secretBusy, setSecretBusy] = useState(false);

  // Backend Function Verification State
  const [verifyTrxId, setVerifyTrxId] = useState('BKH99482716');
  const [verifyMethod, setVerifyMethod] = useState('bkash');
  const [verifyAmount, setVerifyAmount] = useState(500);
  const [backendTestOutput, setBackendTestOutput] = useState<string | null>(null);

  // Session Countdown Timer
  const [remainingSecs, setRemainingSecs] = useState<number>(0);

  useEffect(() => {
    if (adminSession.bootstrapRequired) {
      setAuthMode('bootstrap');
    } else {
      setAuthMode('login');
    }
  }, [adminSession.bootstrapRequired]);

  useEffect(() => {
    setSiteForm(siteSettings);
  }, [siteSettings]);

  useEffect(() => {
    setPayForm(paymentSettings);
  }, [paymentSettings]);

  useEffect(() => {
    if (!adminSession.authenticated || !adminSession.expiresAt) {
      setRemainingSecs(0);
      return;
    }
    const updateTimer = () => {
      const diff = Math.max(0, Math.floor((adminSession.expiresAt! - Date.now()) / 1000));
      setRemainingSecs(diff);
      if (diff <= 0) {
        adminLogout();
      }
    };
    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, [adminSession.authenticated, adminSession.expiresAt, adminLogout]);

  // Package Form State
  const [pkgTitle, setPkgTitle] = useState('');
  const [pkgDiamonds, setPkgDiamonds] = useState(115);
  const [pkgPrice, setPkgPrice] = useState(90);
  const [pkgCategory, setPkgCategory] = useState<DiamondPackage['category']>('uid');

  // Tournament Form State
  const [trnTitle, setTrnTitle] = useState('');
  const [trnMode, setTrnMode] = useState<Tournament['mode']>('Squad');
  const [trnType, setTrnType] = useState<Tournament['type']>('Paid');
  const [trnFee, setTrnFee] = useState(50);
  const [trnPrize, setTrnPrize] = useState(3000);
  const [trnTime, setTrnTime] = useState('Tomorrow, 09:00 PM BST');
  const [trnRoomId, setTrnRoomId] = useState('90128834');
  const [trnRoomPass, setTrnRoomPass] = useState('H41FF');

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskCategory, setTaskCategory] = useState<IncomeTask['category']>('Task Complete');
  const [taskReward, setTaskReward] = useState(20);
  const [taskLink, setTaskLink] = useState('https://telegram.org');
  const [taskDesc, setTaskDesc] = useState('');

  // Blog Post Form State
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCat, setBlogCat] = useState('Esports Update');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');

  // Editable Site Settings State
  const [siteForm, setSiteForm] = useState(siteSettings);
  const [payForm, setPayForm] = useState(paymentSettings);

  /* ============================================================================
     GATE 1: UNAUTHENTICATED PRODUCTION ADMIN PORTAL
     ============================================================================ */
  if (!adminSession.authenticated) {
    const handleLoginSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      setAuthSubmitting(true);
      const res = await adminLogin(loginId, loginPassword);
      setAuthSubmitting(false);
      if (!res.ok) {
        setAuthError(res.error || 'Authentication failed.');
      } else {
        setLoginPassword('');
      }
    };

    const handleBootstrapSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      setAuthSubmitting(true);
      const res = await adminBootstrap({
        email: bootEmail,
        username: bootUsername,
        initialPassword: bootPassword,
      });
      setAuthSubmitting(false);
      if (!res.ok) {
        setAuthError(res.error || 'Bootstrap failed.');
      } else {
        setLoginId(bootEmail);
        setLoginPassword('');
        setBootPassword('');
        setAuthMode('login');
      }
    };

    const handleForgotSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      setAuthSubmitting(true);
      await adminForgotPassword(forgotEmail);
      setAuthSubmitting(false);
      setAuthMode('login');
    };

    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-16">
        <div className="p-6 sm:p-8 rounded-2xl zvy-card space-y-6 border border-[#E5E7EB] dark:border-[#1E293B]">
          <div className="flex items-center justify-between gap-3 border-b border-[#E5E7EB] dark:border-[#1E293B] pb-4">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-[#3B0A0A] text-white flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#3B0A0A] dark:text-[#FCA5A5]">
                  PRODUCTION ADMIN SECURITY GATE
                </div>
                <h1 className="text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC] truncate">
                  H41FFTOPUP · Admin Console
                </h1>
              </div>
            </div>
            <ThemeToggle variant="surface" compact />
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-[#FEE2E2] border border-[#FECACA] text-xs text-[#B91C1C] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {/* Mode Tabs */}
          <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-[#F3F4F6] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setAuthError('');
              }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'login'
                  ? 'bg-[#3B0A0A] text-white'
                  : 'text-[#4B5563] dark:text-[#94A3B8]'
              }`}
            >
              Admin Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('bootstrap');
                setAuthError('');
              }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'bootstrap'
                  ? 'bg-[#3B0A0A] text-white'
                  : 'text-[#4B5563] dark:text-[#94A3B8]'
              }`}
            >
              1st-Time Setup
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('forgot');
                setAuthError('');
              }}
              className={`py-2 rounded-lg transition-colors ${
                authMode === 'forgot'
                  ? 'bg-[#3B0A0A] text-white'
                  : 'text-[#4B5563] dark:text-[#94A3B8]'
              }`}
            >
              Forgot Password
            </button>
          </div>

          {authMode === 'login' && (
            <div className="space-y-5">
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Admin Email or Username
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={160}
                    autoComplete="username"
                    value={loginId}
                    onChange={(e) => setLoginId(e.target.value)}
                    placeholder="admin@example.com or admin_username"
                    className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] text-[#111827] dark:text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Admin Password (Hashed via Server scrypt)
                  </label>
                  <input
                    type="password"
                    required
                    maxLength={128}
                    autoComplete="current-password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your admin password"
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] text-[#111827] dark:text-white placeholder:text-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={authSubmitting}
                  className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Lock className="w-4 h-4" />
                  <span>{authSubmitting ? 'Verifying Credentials...' : 'Sign In with Password'}</span>
                </button>
              </form>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-[#E2E8F0] dark:border-[#1E293B]" />
                <span className="shrink mx-3 text-[11px] font-mono uppercase text-[#475569] dark:text-[#94A3B8]">
                  OR FIREBASE VERIFIED OWNER AUTH
                </span>
                <div className="flex-grow border-t border-[#E2E8F0] dark:border-[#1E293B]" />
              </div>

              <button
                type="button"
                onClick={adminGoogleLogin}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck className="w-4 h-4 text-white" />
                <span>Sign In with Google (Authorized Principal Admin)</span>
              </button>

              <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-[11px] text-[#4B5563] dark:text-[#94A3B8] space-y-1">
                <div className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                  Production Security Enforcement Active:
                </div>
                <div>• Rate Limited: Max 5 login attempts per 15-minute window</div>
                <div>• Session Expiry: 30-minute HMAC-SHA256 token with server revocation</div>
                <div>• First-Time Setup: Use the "1st-Time Setup" tab if no admin password is set yet</div>
              </div>
            </div>
          )}

          {authMode === 'bootstrap' && (
            <form onSubmit={handleBootstrapSubmit} className="space-y-4">
              <div className="p-3.5 rounded-xl bg-[#FFF5F5] border border-[#FECACA] text-xs text-[#3B0A0A] space-y-1">
                <div className="font-bold">Step 1 of Client Handover: Create Admin Account</div>
                <p className="text-[11px] leading-relaxed">
                  Provisions the initial administrator record on the server using scrypt + auto-generated server salt. Upon first login, the system will force an immediate password change.
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Admin Email</label>
                <input
                  type="email"
                  required
                  value={bootEmail}
                  onChange={(e) => setBootEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Admin Username</label>
                <input
                  type="text"
                  required
                  minLength={3}
                  value={bootUsername}
                  onChange={(e) => setBootUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Initial Temporary Password (Min 10 characters)
                </label>
                <input
                  type="password"
                  required
                  minLength={10}
                  value={bootPassword}
                  onChange={(e) => setBootPassword(e.target.value)}
                  placeholder="Enter strong initial password (min 10 chars)"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 rounded-xl btn-primary text-xs font-bold"
              >
                {authSubmitting ? 'Provisioning Admin...' : 'Initialize Admin Account'}
              </button>
            </form>
          )}

          {authMode === 'forgot' && (
            <form onSubmit={handleForgotSubmit} className="space-y-4">
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                Enter your administrator email address. If it matches the configured principal admin account, a Firebase password reset link and server recovery audit event will be dispatched.
              </p>
              <div>
                <label className="block text-xs font-semibold mb-1">Administrator Email</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>
              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-3 rounded-xl btn-primary text-xs font-bold"
              >
                {authSubmitting ? 'Dispatching...' : 'Send Password Recovery Instructions'}
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  /* ============================================================================
     GATE 2: MANDATORY FIRST-LOGIN PASSWORD CHANGE GATE
     ============================================================================ */
  if (adminSession.mustChangePassword) {
    const handleMandatoryPasswordChange = async (e: React.FormEvent) => {
      e.preventDefault();
      setPassChangeError('');
      if (newPass !== confirmNewPass) {
        setPassChangeError('New password and confirmation do not match.');
        return;
      }
      setPassChangeBusy(true);
      const res = await adminChangePassword(currPass, newPass);
      setPassChangeBusy(false);
      if (!res.ok) {
        setPassChangeError(res.error || 'Password change failed.');
      } else {
        setCurrPass('');
        setNewPass('');
        setConfirmNewPass('');
      }
    };

    return (
      <div className="max-w-lg mx-auto px-4 py-14">
        <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-6 border-2 border-[#F59E0B]">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/15 text-[#F59E0B] flex items-center justify-center shrink-0">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[11px] font-mono font-bold uppercase text-[#F59E0B]">
                  MANDATORY SECURITY POLICY
                </div>
                <h1 className="text-xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                  Change Temporary Admin Password
                </h1>
              </div>
            </div>
            <ThemeToggle variant="surface" compact />
          </div>

          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            You are signed in as <span className="font-mono font-bold">{adminSession.email}</span> on your first login. For security compliance, you must replace your initial password before accessing the Admin Console.
          </p>

          {passChangeError && (
            <div className="p-3.5 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
              {passChangeError}
            </div>
          )}

          <form onSubmit={handleMandatoryPasswordChange} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Current / Initial Temporary Password
              </label>
              <input
                type="password"
                required
                value={currPass}
                onChange={(e) => setCurrPass(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                New Permanent Password (Min 10 chars, Upper, Lower, Digit & Symbol)
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="e.g. Dhaka#Esports2026!"
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Confirm New Permanent Password
              </label>
              <input
                type="password"
                required
                minLength={10}
                value={confirmNewPass}
                onChange={(e) => setConfirmNewPass(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={adminLogout}
                className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold"
              >
                Sign Out
              </button>
              <button
                type="submit"
                disabled={passChangeBusy}
                className="px-5 py-2.5 rounded-xl btn-primary text-xs font-bold"
              >
                {passChangeBusy ? 'Updating Password...' : 'Save New Password & Unlock Console'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  /* ============================================================================
     AUTHENTICATED PRODUCTION ADMIN CONSOLE
     ============================================================================ */
  const totalRevenue = orders
    .filter((o) => o.status === 'Completed')
    .reduce((sum, o) => sum + o.amountBdt, 0);
  const pendingOrdersCount = orders.filter(
    (o) => o.status === 'Pending' || o.status === 'Processing'
  ).length;
  const pendingWithdrawCount = withdrawals.filter((w) => w.status === 'Pending').length;
  const activeTournamentsCount = tournaments.filter((t) => t.status !== 'Completed').length;

  const revenueChartData = [
    { day: 'Sat', topup: 14200, tournament: 4500, tasks: 2100 },
    { day: 'Sun', topup: 16800, tournament: 5200, tasks: 2450 },
    { day: 'Mon', topup: 12900, tournament: 3800, tasks: 1900 },
    { day: 'Tue', topup: 18400, tournament: 6100, tasks: 2800 },
    { day: 'Wed', topup: 21500, tournament: 7400, tasks: 3100 },
    { day: 'Thu', topup: 24900, tournament: 8900, tasks: 3400 },
    { day: 'Fri', topup: 31200, tournament: 12500, tasks: 4200 },
  ];

  const menuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: '01. Dashboard & Analytics', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'users', label: '02. User & Balance Control', icon: <Users className="w-4 h-4" /> },
    { id: 'packages', label: '03. Diamond Packages', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: '04. Top Up Orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { id: 'tournaments', label: '05. Tournaments & Rooms', icon: <Trophy className="w-4 h-4" /> },
    { id: 'tasks', label: '06. Tasks & Proof Review', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'referrals', label: '07. Referral Program', icon: <Share2 className="w-4 h-4" /> },
    { id: 'finance', label: '08. Deposits & Withdrawals', icon: <Wallet className="w-4 h-4" /> },
    { id: 'payments', label: '09. Payment Gateways', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'news', label: '10. News & Announcements', icon: <Newspaper className="w-4 h-4" /> },
    { id: 'messages', label: '11. Contact Inquiries', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'settings', label: '12. Public Settings & URLs', icon: <Globe className="w-4 h-4" /> },
    { id: 'secrets', label: '13. Server Secrets & Auth', icon: <Server className="w-4 h-4" /> },
    { id: 'audit', label: '14. Immutable Audit Log', icon: <FileText className="w-4 h-4" /> },
  ];

  const handleCreatePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pkgTitle.trim()) return;
    adminSavePackage(
      {
        id: `PKG-${Math.floor(100 + Math.random() * 900)}`,
        title: pkgTitle.trim(),
        titleBn: pkgTitle.trim(),
        diamonds: Number(pkgDiamonds),
        priceBdt: Number(pkgPrice),
        category: pkgCategory,
        deliverySpeed: 'Instant · 30s',
        inStock: true,
      },
      true
    );
    setPkgTitle('');
  };

  const handleCreateTournament = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trnTitle.trim()) return;
    adminSaveTournament(
      {
        id: `TRN-${Math.floor(510 + Math.random() * 480)}`,
        title: trnTitle.trim(),
        titleBn: trnTitle.trim(),
        mode: trnMode,
        type: trnType,
        map: 'Bermuda',
        entryFee: trnType === 'Free' ? 0 : Number(trnFee),
        prizePool: Number(trnPrize),
        perKillPrize: 15,
        totalSlots: 48,
        filledSlots: 0,
        startTime: trnTime,
        status: 'Upcoming',
        roomId: trnRoomId,
        roomPassword: trnRoomPass,
        rules: ['Standard Bangladesh Esports Rulebook applied.'],
        registeredPlayers: [],
        image: TOURNAMENT_IMAGE,
      },
      true
    );
    setTrnTitle('');
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;
    adminSaveTask(
      {
        id: `TSK-${Math.floor(310 + Math.random() * 600)}`,
        title: taskTitle.trim(),
        titleBn: taskTitle.trim(),
        category: taskCategory,
        description: taskDesc.trim() || 'Complete the partner instructions and submit proof URL.',
        requirements: ['Follow instructions carefully and submit screenshot or reference link.'],
        externalLink: taskLink.trim(),
        rewardBdt: Number(taskReward),
        estimatedTime: '3 mins',
        image: TASK_IMAGE,
        active: true,
        completionsCount: 0,
      },
      true
    );
    setTaskTitle('');
    setTaskDesc('');
  };

  const handleCreateBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blogTitle.trim()) return;
    const newPost: BlogPost = {
      id: `BLG-${Math.floor(110 + Math.random() * 800)}`,
      title: blogTitle.trim(),
      category: blogCat,
      excerpt: blogExcerpt.trim() || blogContent.slice(0, 120),
      content: blogContent.trim(),
      publishedAt: '15 Nov 2026',
      readTime: '3 min read',
      author: adminSession.email || 'Admin',
    };
    adminSaveBlogPost(newPost, true);
    setBlogTitle('');
    setBlogExcerpt('');
    setBlogContent('');
  };

  const handleReplacePaymentSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPaymentSecret.trim()) return;
    setSecretBusy(true);
    const res = await adminReplaceSecret('paymentGatewayApiKey', newPaymentSecret.trim());
    setSecretBusy(false);
    if (res.ok) setNewPaymentSecret('');
  };

  const handleReplaceUnipinSecret = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUnipinSecret.trim()) return;
    setSecretBusy(true);
    const res = await adminReplaceSecret('unipinVoucherApiSecret', newUnipinSecret.trim());
    setSecretBusy(false);
    if (res.ok) setNewUnipinSecret('');
  };

  const handleVoluntaryPasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassChangeError('');
    if (newPass !== confirmNewPass) {
      setPassChangeError('New password and confirmation do not match.');
      return;
    }
    setPassChangeBusy(true);
    const res = await adminChangePassword(currPass, newPass);
    setPassChangeBusy(false);
    if (!res.ok) {
      setPassChangeError(res.error || 'Password change failed.');
    } else {
      setCurrPass('');
      setNewPass('');
      setConfirmNewPass('');
    }
  };

  const handleBackendPaymentTest = async () => {
    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transactionId: verifyTrxId,
          method: verifyMethod,
          amountBdt: verifyAmount,
        }),
      });
      const data = await res.json();
      setBackendTestOutput(JSON.stringify(data, null, 2));
      if (res.ok) {
        addToast('Payment Verified', `Verified ${data.referenceId || verifyTrxId} via server-side Payment Gateway function.`, 'success');
      } else {
        addToast('Verification Error', data.error || 'Payment gateway secret not configured yet.', 'error');
      }
    } catch {
      addToast('Network Error', 'Failed to reach backend payment function.', 'error');
    }
  };

  const handleBackendVoucherIssue = async (orderId: string, playerUid: string, diamonds: number) => {
    try {
      const res = await fetch('/api/vouchers/issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.sessionToken}`,
        },
        body: JSON.stringify({ orderId, playerUid, diamonds }),
      });
      const data = await res.json();
      setBackendTestOutput(JSON.stringify(data, null, 2));
      if (res.ok) {
        addToast('UniPin Voucher Issued', `Issued voucher ${data.voucherPin} via server-side UniPin secret.`, 'success');
      } else {
        addToast('Voucher Error', data.error || 'UniPin secret not configured yet.', 'error');
      }
    } catch {
      addToast('Network Error', 'Failed to invoke backend voucher endpoint.', 'error');
    }
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Security & Session Status Bar */}
      <div className="p-4 sm:p-5 rounded-2xl zvy-card flex flex-wrap items-center justify-between gap-4 border-[#280606]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#280606] text-white flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold uppercase">
                AUTHENTICATED ADMIN SESSION
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#FFF5F5] text-[#3B0A0A] border border-[#FECACA] flex items-center gap-1 font-bold">
                <Clock className="w-3 h-3" />
                <span>TTL {formatCountdown(remainingSecs)}</span>
              </span>
            </div>
            <div className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] font-mono mt-0.5">
              {adminSession.email} ({adminSession.username})
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <ThemeToggle variant="surface" />
          <button
            onClick={() => {
              setActiveTab('secrets');
              fetchAdminSecrets();
            }}
            className="px-3.5 py-2 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold text-[#111827] dark:text-white flex items-center gap-1.5 hover:border-[#3B0A0A]"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#3B0A0A] dark:text-[#FCA5A5]" />
            <span>Server Secrets & Password</span>
          </button>
          <button
            onClick={adminLogout}
            className="px-3.5 py-2 rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out & Revoke Token</span>
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Sidebar Navigation */}
        <aside className="lg:w-64 shrink-0 space-y-3">
          <nav className="p-2 rounded-2xl zvy-card flex lg:flex-col gap-1 overflow-x-auto no-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id === 'secrets') fetchAdminSecrets();
                }}
                className={`min-h-[40px] px-3.5 py-2 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap shrink-0 ${
                  activeTab === item.id
                    ? 'bg-[#3B0A0A] text-white'
                    : 'text-[#4B5563] dark:text-[#94A3B8] hover:text-[#111827] dark:hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Viewport */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* 1. DASHBOARD & ANALYTICS */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { label: 'Total Users', value: users.length, color: 'text-[#3B0A0A] dark:text-[#FCA5A5]' },
                  { label: 'Completed TopUp Rev', value: `৳${totalRevenue}`, color: 'text-[#00C853]' },
                  { label: 'Pending Orders', value: pendingOrdersCount, color: 'text-[#D97706]' },
                  { label: 'Pending Withdraws', value: pendingWithdrawCount, color: 'text-[#DC2626]' },
                  { label: 'Active Tournaments', value: activeTournamentsCount, color: 'text-[#0D3B66] dark:text-[#60A5FA]' },
                ].map((kpi) => (
                  <div key={kpi.label} className="p-5 rounded-2xl zvy-card">
                    <div className="text-xs text-[#6B7280] dark:text-[#94A3B8]">{kpi.label}</div>
                    <div className={`text-2xl font-extrabold font-mono mt-1 ${kpi.color}`}>
                      {kpi.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-6 rounded-2xl zvy-card space-y-4">
                  <h2 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
                    7-Day BDT Revenue Breakdown (Top Up vs Tournament Entry)
                  </h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueChartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === 'dark' ? '#334155' : '#E5E7EB'}
                          opacity={0.6}
                        />
                        <XAxis
                          dataKey="day"
                          stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'}
                          fontSize={12}
                        />
                        <YAxis
                          stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'}
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={
                            theme === 'dark'
                              ? {
                                  backgroundColor: '#111827',
                                  borderColor: '#1F2937',
                                  color: '#F8FAFC',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                }
                              : {
                                  backgroundColor: '#FFFFFF',
                                  borderColor: '#E5E7EB',
                                  color: '#111827',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                }
                          }
                        />
                        <Bar
                          dataKey="topup"
                          name="Diamond Top Up (৳)"
                          fill={theme === 'dark' ? '#FF5500' : '#3B0A0A'}
                          radius={[6, 6, 0, 0]}
                        />
                        <Bar dataKey="tournament" name="Tournament Fees (৳)" fill="#0D3B66" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="p-6 rounded-2xl card-premium space-y-4">
                  <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    Verified Task Rewards Distributed (BDT)
                  </h2>
                  <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={revenueChartData}>
                        <CartesianGrid
                          strokeDasharray="3 3"
                          stroke={theme === 'dark' ? '#334155' : '#E5E7EB'}
                          opacity={0.6}
                        />
                        <XAxis
                          dataKey="day"
                          stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'}
                          fontSize={12}
                        />
                        <YAxis
                          stroke={theme === 'dark' ? '#94A3B8' : '#6B7280'}
                          fontSize={12}
                        />
                        <Tooltip
                          contentStyle={
                            theme === 'dark'
                              ? {
                                  backgroundColor: '#111827',
                                  borderColor: '#1F2937',
                                  color: '#F8FAFC',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                }
                              : {
                                  backgroundColor: '#FFFFFF',
                                  borderColor: '#E5E7EB',
                                  color: '#111827',
                                  borderRadius: '12px',
                                  fontSize: '12px',
                                }
                          }
                        />
                        <Area
                          type="monotone"
                          dataKey="tasks"
                          name="Task Payouts (৳)"
                          stroke="#10B981"
                          fill="#10B981"
                          fillOpacity={0.2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. USER & DOUBLE-ENTRY WALLET LEDGER INSPECTOR */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl card-premium space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold">
                      User Accounts, Double-Entry Balances & Ledger Inspector
                    </h2>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                      Balances are computed on the backend from double-entry ledger transactions. Click “Inspect Wallet & Ledger” on any user to view their full ledger or record an audited adjustment.
                    </p>
                  </div>
                  <input
                    type="text"
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    placeholder="Search by Name, UID, IGN, or Phone..."
                    className="px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8]">
                        <th className="py-3 px-3">User / IGN</th>
                        <th className="py-3 px-3">UID & Phone</th>
                        <th className="py-3 px-3">Main Wallet (৳)</th>
                        <th className="py-3 px-3">Income Wallet (৳)</th>
                        <th className="py-3 px-3">Locked Pending (৳)</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-3">Wallet Ledger & Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
                      {users
                        .filter((u) => {
                          const q = userSearch.toLowerCase();
                          return (
                            u.name.toLowerCase().includes(q) ||
                            u.ffIgn.toLowerCase().includes(q) ||
                            u.ffUid.includes(q) ||
                            u.phone.includes(q)
                          );
                        })
                        .map((u) => (
                          <tr key={u.id}>
                            <td className="py-3 px-3 font-sans">
                              <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                                {u.name}
                              </div>
                              <div className="text-[11px] font-mono text-[#0D3B66] dark:text-[#FCA5A5]">
                                {u.id} · {u.ffIgn} ({u.role})
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div>UID: {u.ffUid}</div>
                              <div className="text-[#475569]">{u.phone}</div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#0D3B66] dark:text-[#FCA5A5]">৳{u.mainBalance}</span>
                                <button
                                  onClick={() =>
                                    adminAdjustUserLedger({
                                      userId: u.id,
                                      userName: u.name,
                                      balanceType: 'Main',
                                      direction: 'credit',
                                      amountBdt: 100,
                                      reason: `Quick +৳100 credit to ${u.name}'s Main Wallet`,
                                    })
                                  }
                                  className="px-2 py-0.5 rounded bg-[#FFF5F5] dark:bg-[#1E293B] text-[#0D3B66] dark:text-[#FCA5A5] text-[10px] font-bold"
                                >
                                  +৳100
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-[#10B981]">৳{u.incomeBalance}</span>
                                <button
                                  onClick={() =>
                                    adminAdjustUserLedger({
                                      userId: u.id,
                                      userName: u.name,
                                      balanceType: 'Income',
                                      direction: 'credit',
                                      amountBdt: 50,
                                      reason: `Quick +৳50 credit to ${u.name}'s Income Wallet`,
                                    })
                                  }
                                  className="px-2 py-0.5 rounded bg-[#FFF5F5] dark:bg-[#1E293B] text-[#10B981] text-[10px] font-bold"
                                >
                                  +৳50
                                </button>
                              </div>
                            </td>
                            <td className="py-3 px-3 font-bold text-[#06B6D4]">
                              ৳{lockedPendingByUser[u.id] || 0}
                            </td>
                            <td className="py-3 px-3">
                              <span
                                className={`font-bold ${
                                  u.banned ? 'text-[#EF4444]' : 'text-[#10B981]'
                                }`}
                              >
                                {u.banned ? 'BANNED' : 'ACTIVE'}
                              </span>
                            </td>
                            <td className="py-3 px-3">
                              <div className="flex flex-wrap items-center gap-1.5 font-sans">
                                <button
                                  type="button"
                                  onClick={() => handleInspectUserWallet(u)}
                                  className="px-2.5 py-1 rounded-lg bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-semibold inline-flex items-center gap-1"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Inspect Wallet & Ledger</span>
                                </button>
                                {u.role !== 'admin' && (
                                  <button
                                    onClick={() => adminToggleBanUser(u.id)}
                                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold inline-flex items-center gap-1 ${
                                      u.banned
                                        ? 'bg-[#10B981] text-white'
                                        : 'bg-[#EF4444] text-white'
                                    }`}
                                  >
                                    <Ban className="w-3 h-3" />
                                    <span>{u.banned ? 'Unban' : 'Ban'}</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Selected User Double-Entry Wallet & Ledger Inspector Panel */}
              {inspectUser && (
                <div className="p-6 rounded-2xl card-premium space-y-5 border-2 border-[#3B0A0A]">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E2E8F0] dark:border-[#1E293B] pb-4">
                    <div>
                      <div className="text-xs font-mono font-bold text-[#0D3B66] dark:text-[#FCA5A5]">
                        USER WALLET & DOUBLE-ENTRY LEDGER INSPECTOR
                      </div>
                      <h3 className="text-lg font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
                        {inspectUser.name} ({inspectUser.id} · UID: {inspectUser.ffUid})
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleInspectUserWallet(inspectUser)}
                        className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-semibold"
                      >
                        Refresh User Ledger
                      </button>
                      <button
                        type="button"
                        onClick={() => setInspectUser(null)}
                        className="px-3 py-1.5 rounded-xl bg-[#EF4444]/15 text-[#EF4444] text-xs font-bold"
                      >
                        Close Inspector
                      </button>
                    </div>
                  </div>

                  {/* Computed Double-Entry Balances */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="text-xs text-[#475569]">Main Balance (Sum)</div>
                      <div className="text-xl font-extrabold font-mono text-[#0D3B66] dark:text-[#FCA5A5] mt-1">
                        ৳{inspectBalances?.mainBalance ?? inspectUser.mainBalance}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="text-xs text-[#475569]">Income Balance (Sum)</div>
                      <div className="text-xl font-extrabold font-mono text-[#10B981] mt-1">
                        ৳{inspectBalances?.incomeBalance ?? inspectUser.incomeBalance}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="text-xs text-[#475569]">Bonus Balance (Sum)</div>
                      <div className="text-xl font-extrabold font-mono text-[#F59E0B] mt-1">
                        ৳{inspectBalances?.bonusBalance ?? inspectUser.bonusBalance}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
                      <div className="text-xs text-[#475569]">Locked Pending Withdraw</div>
                      <div className="text-xl font-extrabold font-mono text-[#06B6D4] mt-1">
                        ৳{inspectBalances?.lockedPendingBdt ?? (lockedPendingByUser[inspectUser.id] || 0)}
                      </div>
                    </div>
                  </div>

                  {/* Admin Double-Entry Adjustment Form */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const ok = await adminAdjustUserLedger({
                        userId: inspectUser.id,
                        userName: inspectUser.name,
                        balanceType: adjWallet,
                        direction: adjDirection,
                        amountBdt: Number(adjAmount),
                        reason: adjReason,
                      });
                      if (ok) {
                        await handleInspectUserWallet(inspectUser);
                      }
                    }}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3"
                  >
                    <div className="text-xs font-bold">
                      Record Audited Double-Entry Ledger Adjustment (Never Overwrites Balance Directly)
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                      <select
                        value={adjWallet}
                        onChange={(e) =>
                          setAdjWallet(e.target.value as 'Main' | 'Income' | 'Bonus')
                        }
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                      >
                        <option value="Main">Main Wallet</option>
                        <option value="Income">Income Wallet</option>
                        <option value="Bonus">Bonus Wallet</option>
                      </select>
                      <select
                        value={adjDirection}
                        onChange={(e) =>
                          setAdjDirection(e.target.value as 'credit' | 'debit')
                        }
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                      >
                        <option value="credit">Credit (+BDT)</option>
                        <option value="debit">Debit (-BDT)</option>
                      </select>
                      <input
                        type="number"
                        min={1}
                        required
                        value={adjAmount}
                        onChange={(e) => setAdjAmount(Number(e.target.value))}
                        placeholder="Amount BDT"
                        className="px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                      />
                      <input
                        type="text"
                        required
                        value={adjReason}
                        onChange={(e) => setAdjReason(e.target.value)}
                        placeholder="Mandatory Audit Reason..."
                        className="px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl btn-primary text-xs font-bold"
                      >
                        Post Ledger Entry
                      </button>
                    </div>
                  </form>

                  {/* User Ledger Entries Table */}
                  <div className="overflow-x-auto max-h-80">
                    <table className="w-full min-w-[680px] text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569]">
                          <th className="py-2 px-3">Entry ID</th>
                          <th className="py-2 px-3">Date</th>
                          <th className="py-2 px-3">Type / Wallet</th>
                          <th className="py-2 px-3">Method & Ref</th>
                          <th className="py-2 px-3">Description</th>
                          <th className="py-2 px-3 text-right">Amount</th>
                          <th className="py-2 px-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
                        {inspectLoading ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center font-sans">
                              Loading user double-entry ledger from server...
                            </td>
                          </tr>
                        ) : inspectLedger.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="py-6 text-center font-sans text-[#475569]">
                              No ledger entries found for this user.
                            </td>
                          </tr>
                        ) : (
                          inspectLedger.map((entry) => (
                            <tr key={entry.id}>
                              <td className="py-2 px-3 font-bold text-[#0D3B66] dark:text-[#FCA5A5]">{entry.id}</td>
                              <td className="py-2 px-3 text-[#475569]">{entry.createdAt}</td>
                              <td className="py-2 px-3 font-sans">
                                <span className="font-bold">{entry.type}</span> ({entry.balanceType})
                              </td>
                              <td className="py-2 px-3">
                                {entry.method || 'Wallet'} · {entry.referenceId}
                              </td>
                              <td className="py-2 px-3 font-sans text-[#475569]">
                                {entry.description}
                              </td>
                              <td
                                className={`py-2 px-3 text-right font-bold ${
                                  entry.direction === 'credit'
                                    ? 'text-[#10B981]'
                                    : 'text-[#EF4444]'
                                }`}
                              >
                                {entry.direction === 'credit' ? '+' : '-'}৳{entry.amountBdt}
                              </td>
                              <td className="py-2 px-3">
                                <WalletStatusBadge status={entry.status} />
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3. DIAMOND PACKAGE MANAGEMENT */}
          {activeTab === 'packages' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCreatePackage}
                className="p-6 rounded-2xl card-premium space-y-4"
              >
                <h2 className="text-lg font-bold">
                  Create New Diamond / UniPin Package (Synced to Firestore /catalog)
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={pkgTitle}
                    onChange={(e) => setPkgTitle(e.target.value)}
                    placeholder="Package Title e.g. 500 Diamonds"
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="number"
                    required
                    value={pkgDiamonds}
                    onChange={(e) => setPkgDiamonds(Number(e.target.value))}
                    placeholder="Diamonds"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="number"
                    required
                    value={pkgPrice}
                    onChange={(e) => setPkgPrice(Number(e.target.value))}
                    placeholder="Price BDT"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <select
                    value={pkgCategory}
                    onChange={(e) =>
                      setPkgCategory(e.target.value as DiamondPackage['category'])
                    }
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  >
                    <option value="uid">UID Direct</option>
                    <option value="unipin">UniPin Voucher</option>
                    <option value="membership">Membership</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Package to Catalog</span>
                </button>
              </form>

              <div className="p-6 rounded-2xl card-premium space-y-4">
                <h3 className="text-base font-bold">Live Package Pricing Table ({packages.length})</h3>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569]">
                        <th className="py-2.5 px-3">ID</th>
                        <th className="py-2.5 px-3">Title</th>
                        <th className="py-2.5 px-3">Diamonds</th>
                        <th className="py-2.5 px-3">Live BDT Price</th>
                        <th className="py-2.5 px-3">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
                      {packages.map((p) => (
                        <tr key={p.id}>
                          <td className="py-2.5 px-3">{p.id}</td>
                          <td className="py-2.5 px-3 font-sans font-bold">{p.title}</td>
                          <td className="py-2.5 px-3">{p.diamonds}💎</td>
                          <td className="py-2.5 px-3">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#0D3B66] dark:text-[#FCA5A5]">৳{p.priceBdt}</span>
                              <button
                                onClick={() =>
                                  adminSavePackage({ ...p, priceBdt: Math.max(10, p.priceBdt - 5) }, false)
                                }
                                className="px-2 py-0.5 rounded border border-[#E2E8F0] dark:border-[#1E293B]"
                              >
                                -৳5
                              </button>
                              <button
                                onClick={() =>
                                  adminSavePackage({ ...p, priceBdt: p.priceBdt + 5 }, false)
                                }
                                className="px-2 py-0.5 rounded border border-[#E2E8F0] dark:border-[#1E293B]"
                              >
                                +৳5
                              </button>
                            </div>
                          </td>
                          <td className="py-2.5 px-3">
                            <button
                              onClick={() => adminDeletePackage(p.id)}
                              className="text-[#EF4444] hover:underline inline-flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 4. TOP UP ORDER MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="p-6 rounded-2xl card-premium space-y-4">
              <h2 className="text-xl font-bold">
                Top Up Order Fulfillment & Server-Side UniPin Voucher Issuance
              </h2>
              {backendTestOutput && (
                <pre className="p-3.5 rounded-xl bg-[#0B1120] text-[#10B981] text-xs font-mono overflow-x-auto border border-[#1E293B]">
                  {backendTestOutput}
                </pre>
              )}
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569]">
                      <th className="py-3 px-3">Order ID</th>
                      <th className="py-3 px-3">Customer & UID</th>
                      <th className="py-3 px-3">Package</th>
                      <th className="py-3 px-3">Amount / Method</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Fulfillment & Server Voucher</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="py-3 px-3 font-bold text-[#0D3B66] dark:text-[#FCA5A5]">{ord.id}</td>
                        <td className="py-3 px-3 font-sans">
                          <div className="font-bold">{ord.userName}</div>
                          <div className="font-mono text-[#475569]">
                            UID: {ord.playerUid} ({ord.playerIgn})
                          </div>
                        </td>
                        <td className="py-3 px-3 font-sans">{ord.packageTitle}</td>
                        <td className="py-3 px-3">
                          ৳{ord.amountBdt} · {ord.paymentMethod.toUpperCase()}
                        </td>
                        <td className="py-3 px-3 font-bold">{ord.status}</td>
                        <td className="py-3 px-3">
                          <div className="flex flex-wrap gap-1.5 font-sans">
                            {(['Processing', 'Completed', 'Cancelled'] as TopUpOrder['status'][]).map(
                              (st) => (
                                <button
                                  key={st}
                                  onClick={() => adminUpdateOrderStatus(ord.id, st)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold ${
                                    ord.status === st
                                      ? 'bg-[#3B0A0A] hover:bg-[#280606] text-white'
                                      : 'bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]'
                                  }`}
                                >
                                  {st}
                                </button>
                              )
                            )}
                            <button
                              onClick={() =>
                                handleBackendVoucherIssue(ord.id, ord.playerUid, ord.diamonds)
                              }
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30"
                            >
                              Issue UniPin (Server Function)
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 5. TOURNAMENT & ROOM MANAGEMENT */}
          {activeTab === 'tournaments' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCreateTournament}
                className="p-6 rounded-2xl card-premium space-y-4"
              >
                <h2 className="text-lg font-bold">Publish New Esports Tournament</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={trnTitle}
                    onChange={(e) => setTrnTitle(e.target.value)}
                    placeholder="Tournament Name"
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <select
                    value={trnMode}
                    onChange={(e) => setTrnMode(e.target.value as Tournament['mode'])}
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  >
                    <option value="Solo">Solo</option>
                    <option value="Duo">Duo</option>
                    <option value="Squad">Squad</option>
                    <option value="Clash Squad">Clash Squad</option>
                  </select>
                  <select
                    value={trnType}
                    onChange={(e) => setTrnType(e.target.value as Tournament['type'])}
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  >
                    <option value="Paid">Paid Entry</option>
                    <option value="Free">Free Entry</option>
                  </select>
                  <input
                    type="number"
                    value={trnPrize}
                    onChange={(e) => setTrnPrize(Number(e.target.value))}
                    placeholder="Prize Pool (BDT)"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="number"
                    value={trnFee}
                    onChange={(e) => setTrnFee(Number(e.target.value))}
                    placeholder="Entry Fee (BDT)"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="text"
                    value={trnTime}
                    onChange={(e) => setTrnTime(e.target.value)}
                    placeholder="Schedule Time"
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="text"
                    value={trnRoomId}
                    onChange={(e) => setTrnRoomId(e.target.value)}
                    placeholder="Room ID"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="text"
                    value={trnRoomPass}
                    onChange={(e) => setTrnRoomPass(e.target.value)}
                    placeholder="Room Password"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-semibold"
                >
                  Publish Tournament
                </button>
              </form>

              <div className="space-y-4">
                {tournaments.map((trn) => (
                  <div key={trn.id} className="p-6 rounded-2xl card-premium space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <span className="text-xs font-mono text-[#0D3B66] dark:text-[#FCA5A5]">{trn.id}</span> ·{' '}
                        <span className="text-base font-bold">{trn.title}</span>
                        <div className="text-xs text-[#475569] font-mono">
                          Prize: ৳{trn.prizePool} · Slots: {trn.filledSlots}/{trn.totalSlots} · Status:{' '}
                          {trn.status}
                        </div>
                      </div>

                      {trn.status !== 'Completed' && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            onClick={() =>
                              adminUpdateTournamentRoom(
                                trn.id,
                                `${Math.floor(10000000 + Math.random() * 90000000)}`,
                                `BD${Math.floor(10 + Math.random() * 89)}`
                              )
                            }
                            className="px-3 py-1.5 rounded-xl border border-[#3B0A0A] text-[#0D3B66] dark:text-[#FCA5A5] text-xs font-semibold"
                          >
                            Rotate Room ID ({trn.roomId || 'None'})
                          </button>

                          {trn.registeredPlayers.length > 0 ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <select
                                value={selectedWinnerByTrn[trn.id] || trn.registeredPlayers[0].userId}
                                onChange={(e) =>
                                  setSelectedWinnerByTrn((prev) => ({
                                    ...prev,
                                    [trn.id]: e.target.value,
                                  }))
                                }
                                className="px-2.5 py-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#111827] dark:text-white"
                              >
                                {trn.registeredPlayers.map((p) => (
                                  <option key={p.userId} value={p.userId}>
                                    {p.ffIgn} ({p.ffUid})
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() =>
                                  adminAnnounceTournamentWinner(
                                    trn.id,
                                    selectedWinnerByTrn[trn.id] || trn.registeredPlayers[0].userId
                                  )
                                }
                                className="px-3 py-1.5 rounded-xl bg-[#10B981] text-white text-xs font-semibold"
                              >
                                Declare Winner & Auto-Credit ৳{trn.prizePool}
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-[#6B7280] dark:text-[#94A3B8] italic">
                              No registered players yet
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. TASK & SUBMISSION MANAGEMENT */}
          {activeTab === 'tasks' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCreateTask}
                className="p-6 rounded-2xl card-premium space-y-4"
              >
                <h2 className="text-lg font-bold">Publish New Compliant Income Task</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    required
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                    placeholder="Task Title"
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <select
                    value={taskCategory}
                    onChange={(e) =>
                      setTaskCategory(e.target.value as IncomeTask['category'])
                    }
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  >
                    <option value="Task Complete">Task Complete</option>
                    <option value="Special Tasks">Special Tasks</option>
                    <option value="Sponsored Content">Sponsored Content</option>
                    <option value="Bonus Rewards">Bonus Rewards</option>
                  </select>
                  <input
                    type="number"
                    required
                    value={taskReward}
                    onChange={(e) => setTaskReward(Number(e.target.value))}
                    placeholder="Reward BDT"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="url"
                    required
                    value={taskLink}
                    onChange={(e) => setTaskLink(e.target.value)}
                    placeholder="External Link"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task instructions & verification policy..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-semibold"
                >
                  Create Task
                </button>
              </form>

              <div className="p-6 rounded-2xl card-premium space-y-4">
                <h3 className="text-base font-bold">
                  User Task Proof Submissions ({taskSubmissions.length})
                </h3>
                <div className="space-y-3">
                  {taskSubmissions.map((sub) => (
                    <div
                      key={sub.id}
                      className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-bold">
                          {sub.id} · {sub.userName} · {sub.taskTitle} (+৳{sub.rewardBdt})
                        </div>
                        <div className="font-mono text-[#475569]">
                          Proof: {sub.proofUrl} — “{sub.proofNote}”
                        </div>
                      </div>
                      {sub.status === 'Pending' ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => adminVerifyTaskSubmission(sub.id, 'Approved')}
                            className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white font-semibold inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve & Credit ৳{sub.rewardBdt}</span>
                          </button>
                          <button
                            onClick={() =>
                              adminVerifyTaskSubmission(sub.id, 'Rejected', 'Invalid screenshot')
                            }
                            className="px-3 py-1.5 rounded-lg bg-[#EF4444] text-white font-semibold inline-flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <span className="font-mono font-bold">{sub.status}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-6 rounded-2xl card-premium space-y-3">
                <h3 className="text-base font-bold">Manage Active Tasks ({tasks.length})</h3>
                {tasks.map((tItem) => (
                  <div
                    key={tItem.id}
                    className="py-2.5 border-b border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold">{tItem.title}</span> ·{' '}
                      <span className="font-mono text-[#10B981]">+৳{tItem.rewardBdt}</span>
                    </div>
                    <button
                      onClick={() => adminDeleteTask(tItem.id)}
                      className="text-[#EF4444] hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. REFERRAL MANAGEMENT */}
          {activeTab === 'referrals' && (
            <div className="p-6 rounded-2xl card-premium space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold">Referral Bonus & Commission Logs</h2>
                  <p className="text-xs text-[#475569]">
                    Configure how much BDT is credited when a user invites a verified player.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Global Referral Bonus (BDT):</span>
                  <input
                    type="number"
                    value={payForm.referralBonusBdt}
                    onChange={(e) =>
                      setPayForm({ ...payForm, referralBonusBdt: Number(e.target.value) })
                    }
                    className="w-24 px-3 py-1.5 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <button
                    onClick={() => adminUpdatePaymentSettings(payForm)}
                    className="px-3.5 py-1.5 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-semibold"
                  >
                    Update Bonus
                  </button>
                </div>
              </div>

              <div className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
                {users.map((u) => (
                  <div key={u.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-sans font-bold">{u.name}</span> · Code:{' '}
                      <span className="text-[#0D3B66] dark:text-[#FCA5A5] font-bold">{u.referralCode}</span>
                    </div>
                    <div>
                      {u.referralCount} Invites · Earned ৳
                      {u.referralCount * paymentSettings.referralBonusBdt}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. DEPOSIT & WITHDRAW MANAGEMENT (SEARCH, FILTERS, REJECTION REASON & AUDIT) */}
          {activeTab === 'finance' && (
            <div className="space-y-6">
              {/* Finance Dashboard Totals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="p-4 rounded-2xl card-premium">
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Approved Deposits Total
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#10B981] mt-1">
                    ৳
                    {deposits
                      .filter((d) => d.status === 'Approved' || d.status === 'Completed')
                      .reduce((s, d) => s + (d.netCreditBdt ?? d.amountBdt), 0)}
                  </div>
                </div>
                <div className="p-4 rounded-2xl card-premium">
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Pending Deposits
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#F59E0B] mt-1">
                    {deposits.filter((d) => d.status === 'Pending').length} Requests
                  </div>
                </div>
                <div className="p-4 rounded-2xl card-premium">
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Completed Withdrawals
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#0D3B66] dark:text-[#FCA5A5] mt-1">
                    ৳
                    {withdrawals
                      .filter((w) => w.status === 'Completed' || w.status === 'Approved')
                      .reduce((s, w) => s + w.netAmountBdt, 0)}
                  </div>
                </div>
                <div className="p-4 rounded-2xl card-premium">
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Locked Pending Withdrawals
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#06B6D4] mt-1">
                    ৳
                    {withdrawals
                      .filter((w) => w.status === 'Pending')
                      .reduce((s, w) => s + w.amountBdt, 0)}
                  </div>
                </div>
                <div className="p-4 rounded-2xl card-premium">
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Flagged High-Value Withdraws
                  </div>
                  <div className="text-2xl font-extrabold font-mono text-[#EF4444] mt-1">
                    {
                      withdrawals.filter(
                        (w) => w.flaggedForReview && w.status === 'Pending'
                      ).length
                    }{' '}
                    Flagged
                  </div>
                </div>
              </div>

              {/* Backend Payment Verification Function Tester */}
              <div className="p-5 rounded-2xl card-premium space-y-3 border border-[#3B0A0A]/30">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-mono font-bold text-[#0D3B66] dark:text-[#FCA5A5]">
                    BACKEND FUNCTION: /api/payments/verify (USES SERVER-SIDE PAYMENT SECRET)
                  </div>
                  <button
                    type="button"
                    onClick={() => refreshWalletFromBackend()}
                    className="px-3 py-1 rounded-lg btn-secondary text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Sync Server Ledger</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="text"
                    value={verifyTrxId}
                    onChange={(e) => setVerifyTrxId(e.target.value)}
                    placeholder="TrxID e.g. BKH99482716"
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <select
                    value={verifyMethod}
                    onChange={(e) => setVerifyMethod(e.target.value)}
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  >
                    <option value="bkash">bKash</option>
                    <option value="nagad">Nagad</option>
                    <option value="rocket">Rocket</option>
                    <option value="upay">Upay</option>
                  </select>
                  <input
                    type="number"
                    value={verifyAmount}
                    onChange={(e) => setVerifyAmount(Number(e.target.value))}
                    className="px-3 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <button
                    type="button"
                    onClick={handleBackendPaymentTest}
                    className="px-4 py-2 rounded-xl btn-primary text-xs font-bold"
                  >
                    Verify TrxID via Server
                  </button>
                </div>
              </div>

              {/* Screenshot Modal Preview */}
              {previewScreenshotUrl && (
                <div className="p-5 rounded-2xl card-premium border-2 border-[#3B0A0A] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold">Uploaded Payment Screenshot Proof</span>
                    <button
                      type="button"
                      onClick={() => setPreviewScreenshotUrl(null)}
                      className="px-3 py-1 rounded-lg bg-[#EF4444]/15 text-[#EF4444] text-xs font-bold"
                    >
                      Close Preview
                    </button>
                  </div>
                  <img
                    src={previewScreenshotUrl}
                    alt="Deposit screenshot proof"
                    className="max-h-80 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Deposit Requests Column */}
                <div className="p-6 rounded-2xl card-premium space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-lg font-bold">
                      Deposit Requests ({deposits.length})
                    </h2>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={depSearch}
                        onChange={(e) => setDepSearch(e.target.value)}
                        placeholder="Search TrxID, User, Phone..."
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                      />
                      <select
                        value={depStatusFilter}
                        onChange={(e) => setDepStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                      >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                    {deposits
                      .filter((d) => {
                        if (depStatusFilter !== 'All' && d.status !== depStatusFilter) return false;
                        if (depSearch.trim()) {
                          const q = depSearch.toLowerCase();
                          return (
                            d.id.toLowerCase().includes(q) ||
                            d.userName.toLowerCase().includes(q) ||
                            d.transactionId.toLowerCase().includes(q) ||
                            d.senderNumber.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((d) => (
                        <div
                          key={d.id}
                          className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2.5 text-xs font-mono"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                              {d.id} · {d.userName} ({d.method.toUpperCase()} · {d.channel})
                            </span>
                            <WalletStatusBadge status={d.status} />
                          </div>
                          <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
                            <span>Sender: {d.senderNumber} · TrxID: {d.transactionId}</span>
                            <span className="font-bold text-[#10B981]">
                              +৳{d.netCreditBdt ?? d.amountBdt} BDT
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-[#475569]">
                            <span>{d.createdAt}</span>
                            {d.screenshotUrl && (
                              <button
                                type="button"
                                onClick={() => setPreviewScreenshotUrl(d.screenshotUrl!)}
                                className="text-[#0D3B66] dark:text-[#FCA5A5] hover:underline font-sans font-semibold"
                              >
                                View Proof Screenshot
                              </button>
                            )}
                          </div>
                          {d.adminReason && (
                            <div className="p-2 rounded bg-[#EF4444]/10 text-[#EF4444] font-sans">
                              Reason: {d.adminReason}
                            </div>
                          )}
                          {d.status === 'Pending' && (
                            <div className="space-y-2 pt-1 font-sans">
                              <input
                                type="text"
                                value={decisionReasonById[d.id] || ''}
                                onChange={(e) =>
                                  setDecisionReasonById((prev) => ({
                                    ...prev,
                                    [d.id]: e.target.value,
                                  }))
                                }
                                placeholder="Rejection reason or verification note..."
                                className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                              />
                              <div className="flex flex-wrap gap-2">
                                <button
                                  type="button"
                                  onClick={() =>
                                    adminVerifyDeposit(
                                      d.id,
                                      'Approved',
                                      decisionReasonById[d.id]
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white font-semibold"
                                >
                                  Approve & Credit +৳{d.netCreditBdt ?? d.amountBdt}
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    adminVerifyDeposit(
                                      d.id,
                                      'Rejected',
                                      decisionReasonById[d.id] ||
                                        'Unverified or mismatched Transaction ID'
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-[#EF4444] text-white font-semibold"
                                >
                                  Reject with Reason
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>

                {/* Withdrawal Requests Column */}
                <div className="p-6 rounded-2xl card-premium space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <h2 className="text-lg font-bold">
                      Withdrawal Requests ({withdrawals.length})
                    </h2>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={wthSearch}
                        onChange={(e) => setWthSearch(e.target.value)}
                        placeholder="Search ID, User, Receiver..."
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                      />
                      <select
                        value={wthStatusFilter}
                        onChange={(e) => setWthStatusFilter(e.target.value)}
                        className="px-2.5 py-1.5 text-xs rounded-lg bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                      >
                        <option value="All">All</option>
                        <option value="Pending">Pending</option>
                        <option value="Flagged">Flagged Only</option>
                        <option value="Approved">Approved</option>
                        <option value="Completed">Completed</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-3 max-h-[680px] overflow-y-auto pr-1">
                    {withdrawals
                      .filter((w) => {
                        if (wthStatusFilter === 'Flagged') {
                          if (!w.flaggedForReview) return false;
                        } else if (wthStatusFilter !== 'All' && w.status !== wthStatusFilter) {
                          return false;
                        }
                        if (wthSearch.trim()) {
                          const q = wthSearch.toLowerCase();
                          return (
                            w.id.toLowerCase().includes(q) ||
                            w.userName.toLowerCase().includes(q) ||
                            w.receiverNumber.toLowerCase().includes(q)
                          );
                        }
                        return true;
                      })
                      .map((w) => (
                        <div
                          key={w.id}
                          className={`p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border space-y-2.5 text-xs font-mono ${
                            w.flaggedForReview && w.status === 'Pending'
                              ? 'border-[#F59E0B]'
                              : 'border-[#E2E8F0] dark:border-[#1E293B]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                              {w.id} · {w.userName} ({w.method.toUpperCase()})
                            </span>
                            <WalletStatusBadge status={w.status} />
                          </div>
                          <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
                            <span>
                              Receiver: {w.receiverNumber} · Source: {w.walletSource}
                            </span>
                            <span className="font-bold text-[#0D3B66] dark:text-[#FCA5A5]">
                              Net: ৳{w.netAmountBdt} (Locked: ৳{w.amountBdt})
                            </span>
                          </div>
                          {w.flaggedForReview && (
                            <div className="p-2 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-sans flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                              <span>
                                Flagged for Manual Review: {w.flagReason || 'High-value withdrawal'}
                              </span>
                            </div>
                          )}
                          {(w.adminNote || w.adminReason) && (
                            <div
                              className={`p-2 rounded font-sans ${
                                w.status === 'Rejected'
                                  ? 'bg-[#EF4444]/10 text-[#EF4444]'
                                  : 'bg-[#10B981]/10 text-[#10B981]'
                              }`}
                            >
                              {w.adminReason || w.adminNote}
                            </div>
                          )}
                          {(w.status === 'Pending' || w.status === 'Approved') && (
                            <div className="space-y-2 pt-1 font-sans">
                              <input
                                type="text"
                                value={decisionReasonById[w.id] || ''}
                                onChange={(e) =>
                                  setDecisionReasonById((prev) => ({
                                    ...prev,
                                    [w.id]: e.target.value,
                                  }))
                                }
                                placeholder="Payout TrxID note or mandatory rejection reason..."
                                className="w-full px-3 py-1.5 text-xs rounded-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                              />
                              <div className="flex flex-wrap gap-2">
                                {w.status === 'Pending' && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      adminVerifyWithdraw(
                                        w.id,
                                        'Approved',
                                        decisionReasonById[w.id] ||
                                          `Approved payout of ৳${w.netAmountBdt} via ${w.method.toUpperCase()}`
                                      )
                                    }
                                    className="px-3 py-1.5 rounded-lg bg-[#3B0A0A] hover:bg-[#280606] text-white font-semibold"
                                  >
                                    Approve
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() =>
                                    adminVerifyWithdraw(
                                      w.id,
                                      'Completed',
                                      decisionReasonById[w.id] ||
                                        `Completed payout of ৳${w.netAmountBdt} via ${w.method.toUpperCase()} (${w.receiverNumber})`
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-[#10B981] text-white font-semibold"
                                >
                                  Mark Completed (Paid)
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    adminVerifyWithdraw(
                                      w.id,
                                      'Rejected',
                                      decisionReasonById[w.id] ||
                                        'Account verification failed — locked funds refunded'
                                    )
                                  }
                                  className="px-3 py-1.5 rounded-lg bg-[#EF4444] text-white font-semibold"
                                >
                                  Reject & Auto-Refund ৳{w.amountBdt}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. PAYMENT GATEWAY & WALLET LIMITS/FEES SETTINGS */}
          {activeTab === 'payments' && (
            <div className="p-6 rounded-2xl card-premium space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold">
                    Wallet Limits, Fees, Processing Time & Payment Methods
                  </h2>
                  <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
                    Configure min/max deposit & withdrawal limits, fee percentages, high-value manual review threshold, and payment account numbers. Gateway API keys are stored encrypted on the server.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('secrets');
                    fetchAdminSecrets();
                  }}
                  className="px-3.5 py-2 rounded-xl btn-secondary text-xs font-semibold flex items-center gap-1.5"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#0D3B66] dark:text-[#FCA5A5]" />
                  <span>Manage Encrypted Gateway Keys ({maskedSecrets?.paymentGatewayApiKey.maskedValue || '••••'})</span>
                </button>
              </div>

              {/* Deposit & Withdrawal Limits and Fees Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Min Deposit Limit (BDT)
                  </label>
                  <input
                    type="number"
                    value={payForm.minDepositBdt ?? 25}
                    onChange={(e) =>
                      setPayForm({ ...payForm, minDepositBdt: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Max Deposit Limit (BDT)
                  </label>
                  <input
                    type="number"
                    value={payForm.maxDepositBdt ?? 100000}
                    onChange={(e) =>
                      setPayForm({ ...payForm, maxDepositBdt: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Deposit Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={25}
                    value={payForm.depositFeePercent ?? 0}
                    onChange={(e) =>
                      setPayForm({ ...payForm, depositFeePercent: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    High-Value Review Threshold (BDT)
                  </label>
                  <input
                    type="number"
                    value={payForm.manualReviewThresholdBdt ?? 5000}
                    onChange={(e) =>
                      setPayForm({
                        ...payForm,
                        manualReviewThresholdBdt: Number(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Min Withdraw Limit (BDT)
                  </label>
                  <input
                    type="number"
                    value={payForm.minWithdrawBdt}
                    onChange={(e) =>
                      setPayForm({ ...payForm, minWithdrawBdt: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Max Withdraw Limit (BDT)
                  </label>
                  <input
                    type="number"
                    value={payForm.maxWithdrawBdt ?? 50000}
                    onChange={(e) =>
                      setPayForm({ ...payForm, maxWithdrawBdt: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Withdrawal Fee (%)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min={0}
                    max={25}
                    value={payForm.withdrawFeePercent}
                    onChange={(e) =>
                      setPayForm({ ...payForm, withdrawFeePercent: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Expected Processing Time Text
                  </label>
                  <input
                    type="text"
                    value={payForm.processingTimeText ?? '30–120 Minutes'}
                    onChange={(e) =>
                      setPayForm({ ...payForm, processingTimeText: e.target.value })
                    }
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs font-bold">
                  Available Deposit & Payout Methods (Merchant Numbers, Personal Numbers & Instructions)
                </div>
                {payForm.gateways
                  .filter((gw) => (gw.id as string) !== 'card')
                  .map((gw) => {
                    const idx = payForm.gateways.findIndex((item) => item.id === gw.id);
                    return (
                  <div
                    key={gw.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3 text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-center">
                      <div className="font-bold text-sm">{gw.name}</div>
                      <div>
                        <label className="block text-[10px] text-[#475569] mb-0.5">
                          Merchant Number / Gateway Label
                        </label>
                        <input
                          type="text"
                          value={gw.merchantNumber}
                          onChange={(e) => {
                            const next = [...payForm.gateways];
                            next[idx] = { ...gw, merchantNumber: e.target.value };
                            setPayForm({ ...payForm, gateways: next });
                          }}
                          className="w-full px-3 py-1.5 font-mono rounded-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-[#475569] mb-0.5">
                          Personal Send-Money Number
                        </label>
                        <input
                          type="text"
                          value={gw.personalNumber}
                          onChange={(e) => {
                            const next = [...payForm.gateways];
                            next[idx] = { ...gw, personalNumber: e.target.value };
                            setPayForm({ ...payForm, gateways: next });
                          }}
                          className="w-full px-3 py-1.5 font-mono rounded-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const next = [...payForm.gateways];
                          next[idx] = { ...gw, active: !gw.active };
                          setPayForm({ ...payForm, gateways: next });
                        }}
                        className={`px-3 py-2 rounded-lg font-bold self-end ${
                          gw.active ? 'bg-[#10B981] text-white' : 'bg-[#EF4444] text-white'
                        }`}
                      >
                        {gw.active ? 'Active ON' : 'Disabled OFF'}
                      </button>
                    </div>
                    <div>
                      <label className="block text-[10px] text-[#475569] mb-0.5">
                        User Deposit Instructions
                      </label>
                      <input
                        type="text"
                        value={gw.instructions}
                        onChange={(e) => {
                          const next = [...payForm.gateways];
                          next[idx] = { ...gw, instructions: e.target.value };
                          setPayForm({ ...payForm, gateways: next });
                        }}
                        className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                      />
                    </div>
                  </div>
                    );
                  })}
              </div>

              <button
                onClick={() => adminUpdatePaymentSettings(payForm)}
                className="px-5 py-2.5 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-bold"
              >
                Save Wallet Limits, Fees & Payment Gateway Settings to Server
              </button>
            </div>
          )}

          {/* 10. NEWS & BLOG MANAGEMENT */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <form
                onSubmit={handleCreateBlog}
                className="p-6 rounded-2xl card-premium space-y-4"
              >
                <h2 className="text-lg font-bold">Publish News or Patch Guide</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="Article Headline"
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="text"
                    required
                    value={blogCat}
                    onChange={(e) => setBlogCat(e.target.value)}
                    placeholder="Category e.g. Esports Update"
                    className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <textarea
                  rows={3}
                  required
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="Full article body..."
                  className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-semibold"
                >
                  Publish Article
                </button>
              </form>

              <div className="p-6 rounded-2xl card-premium space-y-3">
                {blogPosts.map((post) => (
                  <div
                    key={post.id}
                    className="py-3 border-b border-[#E2E8F0] dark:divide-[#1E293B] flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold">{post.title}</span> ·{' '}
                      <span className="text-[#475569]">{post.publishedAt}</span>
                    </div>
                    <button
                      onClick={() => adminDeleteBlogPost(post.id)}
                      className="text-[#EF4444] hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 11. CONTACT MESSAGES */}
          {activeTab === 'messages' && (
            <div className="p-6 rounded-2xl card-premium space-y-4">
              <h2 className="text-xl font-bold">
                User Contact Messages ({contactMessages.length})
              </h2>
              <div className="space-y-3">
                {contactMessages.map((m) => (
                  <div
                    key={m.id}
                    className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="font-bold">
                        {m.subject} — {m.name} ({m.phone} · {m.email})
                      </div>
                      <p className="text-[#475569] dark:text-[#94A3B8]">{m.message}</p>
                    </div>
                    {m.status === 'New' ? (
                      <button
                        onClick={() => adminResolveContactMessage(m.id)}
                        className="px-3.5 py-1.5 rounded-lg bg-[#10B981] text-white font-semibold"
                      >
                        Mark Resolved
                      </button>
                    ) : (
                      <span className="font-mono font-bold text-[#10B981]">Resolved</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 12. PUBLIC SETTINGS & LIVE URLS (STORED IN FIRESTORE /settings/public) */}
          {activeTab === 'settings' && (
            <div className="p-6 rounded-2xl card-premium space-y-6">
              <div>
                <div className="text-xs font-mono font-bold text-[#0D3B66] dark:text-[#FCA5A5]">
                  FIRESTORE LIVE COLLECTION: /settings/public
                </div>
                <h2 className="text-xl font-bold">
                  Public Website Settings, Validated URLs & Branding
                </h2>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1">
                  Every URL below is validated against strict HTTP/HTTPS rules and synced live to Firestore. The website reads these settings in real time via onSnapshot.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">Site Name</label>
                  <input
                    type="text"
                    value={siteForm.siteName}
                    onChange={(e) => setSiteForm({ ...siteForm, siteName: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Logo URL (Optional HTTPS Image URL)
                  </label>
                  <input
                    type="url"
                    value={siteForm.logoUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, logoUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Public Site URL (Validated HTTPS)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteForm.siteUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, siteUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Google Map Embed URL (Validated HTTPS)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteForm.mapEmbedUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, mapEmbedUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Facebook Page URL (Validated HTTPS)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteForm.facebookUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    Telegram Channel URL (Validated HTTPS)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteForm.telegramUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, telegramUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">
                    WhatsApp Direct URL (Validated HTTPS)
                  </label>
                  <input
                    type="url"
                    required
                    value={siteForm.whatsappUrl}
                    onChange={(e) => setSiteForm({ ...siteForm, whatsappUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Support Email</label>
                  <input
                    type="email"
                    required
                    value={siteForm.supportEmail}
                    onChange={(e) => setSiteForm({ ...siteForm, supportEmail: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Support WhatsApp Number</label>
                  <input
                    type="text"
                    value={siteForm.supportWhatsapp}
                    onChange={(e) => setSiteForm({ ...siteForm, supportWhatsapp: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">Dhaka Office Address</label>
                  <input
                    type="text"
                    value={siteForm.officeAddress}
                    onChange={(e) => setSiteForm({ ...siteForm, officeAddress: e.target.value })}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1">
                  Live Top Announcement Ticker (English)
                </label>
                <input
                  type="text"
                  value={siteForm.announcementText}
                  onChange={(e) =>
                    setSiteForm({ ...siteForm, announcementText: e.target.value })
                  }
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Hero Display Headline (English)
                </label>
                <input
                  type="text"
                  value={siteForm.heroHeadline}
                  onChange={(e) => setSiteForm({ ...siteForm, heroHeadline: e.target.value })}
                  className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>

              <button
                onClick={() => adminUpdateSiteSettings(siteForm)}
                className="px-5 py-2.5 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white text-xs font-bold"
              >
                Validate URLs & Publish Live to Firestore
              </button>
            </div>
          )}

          {/* 13. SERVER SECRETS (AES-256-GCM) & ADMIN PASSWORD ROTATION */}
          {activeTab === 'secrets' && (
            <div className="space-y-6">
              <div className="p-6 rounded-2xl card-premium space-y-5 border border-[#3B0A0A]/30">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono font-bold text-[#0D3B66] dark:text-[#FCA5A5]">
                      SERVER-ONLY AES-256-GCM ENCRYPTED VAULT (WRITE-ONLY · NEVER REVEAL)
                    </div>
                    <h2 className="text-xl font-bold">
                      Payment Gateway & UniPin Voucher API Secrets
                    </h2>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1">
                      Secrets are encrypted at rest on the backend server and blocked in Firestore rules (`allow read, write: if false`). This panel only receives masked suffixes (e.g. `••••1234`) and allows Replace/Update—never Reveal.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={fetchAdminSecrets}
                    className="px-3 py-1.5 rounded-xl btn-secondary text-xs font-semibold flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Refresh Masked Status</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Secret 1: Payment Gateway API Secret */}
                  <form
                    onSubmit={handleReplacePaymentSecret}
                    className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">Payment Gateway API Key / Secret</span>
                      <span className="px-2.5 py-0.5 rounded bg-[#3B0A0A]/10 text-[#3B0A0A] dark:text-[#FCA5A5] font-mono text-xs font-bold">
                        {maskedSecrets?.paymentGatewayApiKey.maskedValue || 'Not Configured'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#475569]">
                      Last Updated:{' '}
                      {maskedSecrets?.paymentGatewayApiKey.updatedAt || 'Never'}
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPaymentSecret}
                      onChange={(e) => setNewPaymentSecret(e.target.value)}
                      placeholder="Enter new Payment Gateway Secret (min 8 chars)..."
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                    />
                    <button
                      type="submit"
                      disabled={secretBusy}
                      className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold"
                    >
                      Replace Payment Gateway Secret (Server Encrypted)
                    </button>
                  </form>

                  {/* Secret 2: UniPin Voucher API Secret */}
                  <form
                    onSubmit={handleReplaceUnipinSecret}
                    className="p-5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">UniPin Voucher API Secret</span>
                      <span className="px-2.5 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] font-mono text-xs font-bold">
                        {maskedSecrets?.unipinVoucherApiSecret.maskedValue || 'Not Configured'}
                      </span>
                    </div>
                    <div className="text-[11px] font-mono text-[#475569]">
                      Last Updated:{' '}
                      {maskedSecrets?.unipinVoucherApiSecret.updatedAt || 'Never'}
                    </div>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newUnipinSecret}
                      onChange={(e) => setNewUnipinSecret(e.target.value)}
                      placeholder="Enter new UniPin Voucher Secret (min 8 chars)..."
                      className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
                    />
                    <button
                      type="submit"
                      disabled={secretBusy}
                      className="w-full py-2.5 rounded-xl btn-primary text-xs font-bold"
                    >
                      Replace UniPin API Secret (Server Encrypted)
                    </button>
                  </form>
                </div>

                <div className="p-4 rounded-xl bg-[#070B14] text-slate-300 border border-[#1E293B] text-xs font-mono space-y-1">
                  <div className="text-[#10B981] font-bold">
                    ✓ AUTO-GENERATED INTERNAL SERVER KEYS (HIDDEN FROM UI BY DESIGN):
                  </div>
                  <div>
                    • Auth Password Salt (`authSalt`): Generated automatically via `crypto.randomBytes(32)` on the server. Never transmitted or displayed.
                  </div>
                  <div>
                    • Session Token HMAC Secret (`sessionTokenSecret`): Generated automatically via `crypto.randomBytes(64)` on the server. Never transmitted or displayed.
                  </div>
                </div>
              </div>

              {/* Admin Password Change Form */}
              <div className="p-6 rounded-2xl card-premium space-y-4">
                <h3 className="text-lg font-bold">Rotate Admin Account Password</h3>
                {passChangeError && (
                  <div className="p-3 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-xs text-[#EF4444]">
                    {passChangeError}
                  </div>
                )}
                <form onSubmit={handleVoluntaryPasswordChange} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    type="password"
                    required
                    value={currPass}
                    onChange={(e) => setCurrPass(e.target.value)}
                    placeholder="Current Password"
                    className="px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <input
                    type="password"
                    required
                    minLength={10}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="New Password (Min 10 chars + Symbol)"
                    className="px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                  />
                  <div className="flex gap-2">
                    <input
                      type="password"
                      required
                      minLength={10}
                      value={confirmNewPass}
                      onChange={(e) => setConfirmNewPass(e.target.value)}
                      placeholder="Confirm New Password"
                      className="flex-1 px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                    />
                    <button
                      type="submit"
                      disabled={passChangeBusy}
                      className="px-4 py-2.5 rounded-xl btn-primary text-xs font-bold shrink-0"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* 14. IMMUTABLE ADMIN AUDIT LOG */}
          {activeTab === 'audit' && (
            <div className="p-6 rounded-2xl card-premium space-y-4">
              <h2 className="text-xl font-bold">
                Immutable Admin Audit Log ({auditLogs.length} Entries)
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px] text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569]">
                      <th className="py-3 px-3">Log ID</th>
                      <th className="py-3 px-3">Administrator</th>
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Target</th>
                      <th className="py-3 px-3">Details</th>
                      <th className="py-3 px-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
                    {auditLogs.map((log) => (
                      <tr key={log.id}>
                        <td className="py-3 px-3 font-bold text-[#0D3B66] dark:text-[#FCA5A5]">{log.id}</td>
                        <td className="py-3 px-3 font-sans">{log.adminName}</td>
                        <td className="py-3 px-3 font-bold text-[#10B981]">{log.action}</td>
                        <td className="py-3 px-3">{log.target}</td>
                        <td className="py-3 px-3 font-sans text-[#475569] dark:text-[#94A3B8]">
                          {log.details}
                        </td>
                        <td className="py-3 px-3 text-[#475569]">{log.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
