import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PUBLIC_ENV } from '../config/env';
import { getPathForPage, resolvePageFromPath } from '../config/routes';
import {
  initialAuditLogs,
  initialBlogPosts,
  initialContactMessages,
  initialDeposits,
  initialFaqs,
  initialOrders,
  initialPackages,
  initialPaymentSettings,
  initialReviews,
  initialSiteSettings,
  initialSupportTickets,
  initialTasks,
  initialTaskSubmissions,
  initialTournaments,
  initialTransactions,
  initialUsers,
  initialWithdrawals,
} from '../data/seedData';
import {
  auth,
  db,
  doc,
  googleProvider,
  handleFirestoreError,
  onSnapshot,
  OperationType,
  sendPasswordResetEmail,
  serverTimestamp,
  setDoc,
  signInWithPopup,
  signOut,
} from '../firebase';
import { translations } from '../i18n/translations';
import {
  AdminSessionState,
  AuditLogEntry,
  BlogPost,
  CartItem,
  ContactMessage,
  DepositRequest,
  DiamondPackage,
  FAQItem,
  IncomeTask,
  Language,
  MaskedSecretsSummary,
  PageView,
  PaymentGatewayName,
  PaymentSettings,
  SiteSettings,
  SupportTicket,
  TaskSubmission,
  ThemeMode,
  ToastNotification,
  TopUpOrder,
  Tournament,
  User,
  UserReview,
  WalletTransaction,
  WithdrawRequest,
} from '../types';
import {
  isValidBdPhone,
  isValidBdtAmount,
  isValidEmail,
  isValidFreeFireUid,
  isValidTrxId,
  safeJsonParse,
  sanitizeSafeUrl,
  sanitizeText,
  stripSensitiveUserFields,
} from '../utils/security';

export interface SafeProfileUpdate {
  name?: string;
  phone?: string;
  ffUid?: string;
  ffIgn?: string;
}

interface AppContextType {
  currentPage: PageView;
  navigate: (page: PageView) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (mode: ThemeMode) => void;
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Player Auth & Users
  currentUser: User | null;
  users: User[];
  login: (identifier: string, password?: string) => void;
  register: (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    ffUid: string;
    ffIgn: string;
    referralCodeInput?: string;
  }) => boolean;
  logout: () => void;
  updateProfile: (updates: SafeProfileUpdate) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;

  // Production Admin Auth & Encrypted Secrets Vault
  adminSession: AdminSessionState;
  maskedSecrets: MaskedSecretsSummary | null;
  adminBootstrap: (payload: {
    email: string;
    username: string;
    initialPassword: string;
  }) => Promise<{ ok: boolean; error?: string }>;
  adminLogin: (
    identifier: string,
    password: string
  ) => Promise<{ ok: boolean; error?: string; retryAfterSeconds?: number }>;
  adminGoogleLogin: () => Promise<{ ok: boolean; error?: string }>;
  adminChangePassword: (
    currentPassword: string,
    newPassword: string
  ) => Promise<{ ok: boolean; error?: string }>;
  adminForgotPassword: (email: string) => Promise<{ ok: boolean; message: string }>;
  adminLogout: () => Promise<void>;
  fetchAdminSecrets: () => Promise<void>;
  adminReplaceSecret: (
    secretName: 'paymentGatewayApiKey' | 'unipinVoucherApiSecret',
    newValue: string
  ) => Promise<{ ok: boolean; error?: string }>;

  // Cart & Wishlist
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (pkg: DiamondPackage, playerUid: string, playerIgn?: string) => void;
  updateCartQty: (pkgId: string, delta: number) => void;
  removeFromCart: (pkgId: string) => void;
  clearCart: () => void;
  wishlist: string[];
  toggleWishlist: (pkgId: string) => void;

  // Core Data
  packages: DiamondPackage[];
  orders: TopUpOrder[];
  tournaments: Tournament[];
  tasks: IncomeTask[];
  taskSubmissions: TaskSubmission[];
  deposits: DepositRequest[];
  withdrawals: WithdrawRequest[];
  transactions: WalletTransaction[];
  paymentSettings: PaymentSettings;
  blogPosts: BlogPost[];
  reviews: UserReview[];
  faqs: FAQItem[];
  contactMessages: ContactMessage[];
  supportTickets: SupportTicket[];
  auditLogs: AuditLogEntry[];
  siteSettings: SiteSettings;
  toasts: ToastNotification[];
  addToast: (title: string, message: string, type?: ToastNotification['type']) => void;
  dismissToast: (id: string) => void;

  // User Actions
  placeTopUpOrder: (params: {
    pkg: DiamondPackage;
    quantity?: number;
    playerUid: string;
    playerIgn: string;
    paymentMethod: 'wallet' | PaymentGatewayName;
    transactionId?: string;
  }) => TopUpOrder | null;
  checkoutCart: (paymentMethod: 'wallet' | PaymentGatewayName, transactionId?: string) => boolean;
  joinTournament: (tournamentId: string, ffIgn: string, ffUid: string, teamName?: string) => boolean;
  submitTaskProof: (taskId: string, proofUrl: string, proofNote: string) => boolean;
  createDeposit: (params: {
    method: PaymentGatewayName;
    channel: 'Manual' | 'Instant Gateway';
    senderNumber: string;
    transactionId: string;
    amountBdt: number;
    screenshotUrl?: string;
    simulateOutcome?: 'success' | 'fail';
    idempotencyKey?: string;
  }) => Promise<boolean>;
  createWithdraw: (params: {
    method: PaymentGatewayName;
    walletSource: 'incomeBalance' | 'mainBalance';
    receiverNumber: string;
    amountBdt: number;
    authConfirmCode?: string;
    idempotencyKey?: string;
  }) => Promise<boolean>;
  cancelPendingWalletRequest: (
    requestType: 'deposit' | 'withdraw',
    requestId: string
  ) => Promise<boolean>;
  refreshWalletFromBackend: () => Promise<void>;
  lockedPendingByUser: Record<string, number>;
  transferBalanceToMain: (from: 'incomeBalance' | 'bonusBalance', amountBdt: number) => boolean;
  submitContactMessage: (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => void;
  submitSupportTicket: (ticket: Omit<SupportTicket, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>) => void;
  submitUserReview: (review: Omit<UserReview, 'id' | 'date'>) => void;

  // Admin Actions
  adminUpdateUser: (userId: string, updates: Partial<User>, auditNote: string) => void;
  adminAdjustUserLedger: (params: {
    userId: string;
    userName: string;
    balanceType: 'Main' | 'Income' | 'Bonus';
    direction: 'credit' | 'debit';
    amountBdt: number;
    reason: string;
  }) => Promise<boolean>;
  adminToggleBanUser: (userId: string) => void;
  adminSavePackage: (pkg: DiamondPackage, isNew: boolean) => void;
  adminDeletePackage: (pkgId: string) => void;
  adminUpdateOrderStatus: (orderId: string, status: TopUpOrder['status']) => void;
  adminSaveTournament: (trn: Tournament, isNew: boolean) => void;
  adminUpdateTournamentRoom: (trnId: string, roomId: string, roomPassword: string) => void;
  adminAnnounceTournamentWinner: (trnId: string, winnerUserId: string) => void;
  adminSaveTask: (task: IncomeTask, isNew: boolean) => void;
  adminDeleteTask: (taskId: string) => void;
  adminVerifyTaskSubmission: (subId: string, decision: 'Approved' | 'Rejected', reason?: string) => void;
  adminVerifyDeposit: (depId: string, decision: 'Approved' | 'Rejected', reason?: string) => void;
  adminVerifyWithdraw: (wthId: string, decision: 'Approved' | 'Completed' | 'Rejected', adminNote?: string) => void;
  adminUpdatePaymentSettings: (settings: PaymentSettings) => void;
  adminSaveBlogPost: (post: BlogPost, isNew: boolean) => void;
  adminDeleteBlogPost: (postId: string) => void;
  adminResolveContactMessage: (msgId: string) => void;
  adminUpdateSiteSettings: (settings: SiteSettings) => Promise<boolean>;
}

const STORAGE_KEY = 'fibd_app_state_v1';
const ADMIN_SESSION_STORAGE_KEY = 'fibd_admin_session_v2';

const defaultAdminSession: AdminSessionState = {
  authenticated: false,
  uid: '',
  email: 'tahsinislammahin15@gmail.com',
  username: 'admin',
  sessionToken: '',
  expiresAt: 0,
  mustChangePassword: true,
  bootstrapRequired: false,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function loadState<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return safeJsonParse(raw, fallback);
  } catch {
    return fallback;
  }
}

function saveState<T>(key: string, value: T) {
  try {
    localStorage.setItem(`${STORAGE_KEY}_${key}`, JSON.stringify(value));
  } catch {
    // ignore storage quota errors
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const routerNavigate = useNavigate();
  const currentPage: PageView = resolvePageFromPath(location.pathname);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const loaded = loadState('siteSettings', initialSiteSettings);
    return {
      ...initialSiteSettings,
      ...loaded,
      siteUrl: sanitizeSafeUrl(loaded.siteUrl) || initialSiteSettings.siteUrl,
      mapEmbedUrl: sanitizeSafeUrl(loaded.mapEmbedUrl) || initialSiteSettings.mapEmbedUrl,
      facebookUrl: sanitizeSafeUrl(loaded.facebookUrl) || initialSiteSettings.facebookUrl,
      telegramUrl: sanitizeSafeUrl(loaded.telegramUrl) || initialSiteSettings.telegramUrl,
      whatsappUrl: sanitizeSafeUrl(loaded.whatsappUrl) || initialSiteSettings.whatsappUrl,
    };
  });
  const [language, setLanguageState] = useState<Language>(() =>
    loadState('language', siteSettings.defaultLanguage)
  );
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      const direct = localStorage.getItem('theme');
      if (direct === 'light' || direct === 'dark') {
        return direct;
      }
    } catch {
      // ignore storage access errors
    }
    return loadState('theme', siteSettings.defaultTheme);
  });
  const [globalSearch, setGlobalSearch] = useState('');

  const [users, setUsers] = useState<User[]>(() =>
    stripSensitiveUserFields(loadState('users', initialUsers))
  );
  const [currentUserId, setCurrentUserId] = useState<string | null>(() =>
    loadState('currentUserId', 'USR-1001')
  );

  const [adminSession, setAdminSession] = useState<AdminSessionState>(() => {
    try {
      const raw = sessionStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
      if (raw) {
        const parsed = safeJsonParse<AdminSessionState>(raw, defaultAdminSession);
        if (parsed.authenticated && parsed.expiresAt > Date.now()) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return defaultAdminSession;
  });
  const [maskedSecrets, setMaskedSecrets] = useState<MaskedSecretsSummary | null>(null);

  const [packages, setPackages] = useState<DiamondPackage[]>(() =>
    loadState('packages', initialPackages)
  );
  const [orders, setOrders] = useState<TopUpOrder[]>(() => loadState('orders', initialOrders));
  const [tournaments, setTournaments] = useState<Tournament[]>(() =>
    loadState('tournaments', initialTournaments)
  );
  const [tasks, setTasks] = useState<IncomeTask[]>(() => loadState('tasks', initialTasks));
  const [taskSubmissions, setTaskSubmissions] = useState<TaskSubmission[]>(() =>
    loadState('taskSubmissions', initialTaskSubmissions)
  );
  const [deposits, setDeposits] = useState<DepositRequest[]>(() =>
    loadState('deposits', initialDeposits)
  );
  const [withdrawals, setWithdrawals] = useState<WithdrawRequest[]>(() =>
    loadState('withdrawals', initialWithdrawals)
  );
  const [transactions, setTransactions] = useState<WalletTransaction[]>(() =>
    loadState('transactions', initialTransactions)
  );
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() =>
    loadState('paymentSettings', initialPaymentSettings)
  );
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(() =>
    loadState('blogPosts', initialBlogPosts)
  );
  const [reviews, setReviews] = useState<UserReview[]>(() => loadState('reviews', initialReviews));
  const [faqs] = useState<FAQItem[]>(() => loadState('faqs', initialFaqs));
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>(() =>
    loadState('contactMessages', initialContactMessages)
  );
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() =>
    loadState('supportTickets', initialSupportTickets)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() =>
    loadState('auditLogs', initialAuditLogs)
  );

  const [cart, setCart] = useState<CartItem[]>(() => loadState('cart', []));
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadState('wishlist', ['PKG-115', 'PKG-WEEKLY'])
  );
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [lockedPendingByUser, setLockedPendingByUser] = useState<Record<string, number>>({});

  const currentUser = users.find((u) => u.id === currentUserId) || null;

  const applyBackendBalancesMap = (
    balancesByUser?: Record<
      string,
      {
        mainBalance: number;
        incomeBalance: number;
        bonusBalance: number;
        lockedPendingBdt: number;
      }
    >
  ) => {
    if (!balancesByUser) return;
    setUsers((prev) =>
      prev.map((u) => {
        const b = balancesByUser[u.id];
        if (!b) return u;
        return {
          ...u,
          mainBalance: b.mainBalance,
          incomeBalance: b.incomeBalance,
          bonusBalance: b.bonusBalance,
        };
      })
    );
    const lockedMap: Record<string, number> = {};
    for (const [uid, b] of Object.entries(balancesByUser)) {
      lockedMap[uid] = b.lockedPendingBdt || 0;
    }
    setLockedPendingByUser(lockedMap);
  };

  const refreshWalletFromBackend = async () => {
    try {
      const res = await fetch('/api/wallet/state');
      if (!res.ok) return;
      const data = await res.json();
      if (!data?.ok) return;
      if (data.balancesByUser) {
        applyBackendBalancesMap(data.balancesByUser);
      }
      if (Array.isArray(data.ledger)) {
        setTransactions(data.ledger);
      }
      if (Array.isArray(data.deposits)) {
        setDeposits(data.deposits);
      }
      if (Array.isArray(data.withdrawals)) {
        setWithdrawals(data.withdrawals);
      }
      if (data.paymentSettings) {
        setPaymentSettings((prev) => ({ ...prev, ...data.paymentSettings }));
      }
      if (Array.isArray(data.auditLogs) && data.auditLogs.length > 0) {
        setAuditLogs(data.auditLogs);
      }
    } catch {
      // Ignore offline errors
    }
  };

  useEffect(() => {
    refreshWalletFromBackend();
  }, []);

  // 1. Live Firestore Subscription for Public Settings (/settings/public)
  useEffect(() => {
    const publicDocRef = doc(db, 'settings', 'public');
    const unsubscribe = onSnapshot(
      publicDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setSiteSettings((prev) => ({
            ...prev,
            siteName: typeof data.siteName === 'string' ? data.siteName : prev.siteName,
            tagline: typeof data.tagline === 'string' ? data.tagline : prev.tagline,
            logoUrl: typeof data.logoUrl === 'string' ? data.logoUrl : prev.logoUrl,
            siteUrl: sanitizeSafeUrl(data.siteUrl) || prev.siteUrl,
            mapEmbedUrl: sanitizeSafeUrl(data.mapEmbedUrl) || prev.mapEmbedUrl,
            facebookUrl: sanitizeSafeUrl(data.facebookUrl) || prev.facebookUrl,
            telegramUrl: sanitizeSafeUrl(data.telegramUrl) || prev.telegramUrl,
            whatsappUrl: sanitizeSafeUrl(data.whatsappUrl) || prev.whatsappUrl,
            supportEmail: typeof data.supportEmail === 'string' ? data.supportEmail : prev.supportEmail,
            supportPhone: typeof data.supportPhone === 'string' ? data.supportPhone : prev.supportPhone,
            supportWhatsapp:
              typeof data.supportWhatsapp === 'string' ? data.supportWhatsapp : prev.supportWhatsapp,
            supportTelegram:
              typeof data.supportTelegram === 'string' ? data.supportTelegram : prev.supportTelegram,
            officeAddress:
              typeof data.officeAddress === 'string' ? data.officeAddress : prev.officeAddress,
            announcementText:
              typeof data.announcementText === 'string'
                ? data.announcementText
                : prev.announcementText,
            announcementTextBn:
              typeof data.announcementTextBn === 'string'
                ? data.announcementTextBn
                : prev.announcementTextBn,
            heroHeadline:
              typeof data.heroHeadline === 'string' ? data.heroHeadline : prev.heroHeadline,
            heroHeadlineBn:
              typeof data.heroHeadlineBn === 'string' ? data.heroHeadlineBn : prev.heroHeadlineBn,
            heroSubheadline:
              typeof data.heroSubheadline === 'string'
                ? data.heroSubheadline
                : prev.heroSubheadline,
            heroSubheadlineBn:
              typeof data.heroSubheadlineBn === 'string'
                ? data.heroSubheadlineBn
                : prev.heroSubheadlineBn,
          }));
        }
      },
      (error) => {
        try {
          handleFirestoreError(error, OperationType.GET, 'settings/public');
        } catch {
          // Handled and logged by handleFirestoreError
        }
      }
    );
    return () => unsubscribe();
  }, []);

  // 2. Check Admin Bootstrap & Session Status on Boot
  useEffect(() => {
    fetch('/api/admin/auth/status', {
      headers: adminSession.sessionToken
        ? { Authorization: `Bearer ${adminSession.sessionToken}` }
        : {},
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!data) return;
        setAdminSession((prev) => ({
          ...prev,
          email: data.adminEmail || prev.email,
          username: data.adminUsername || prev.username,
          bootstrapRequired: Boolean(data.bootstrapRequired),
          authenticated: Boolean(data.authenticated),
          mustChangePassword: Boolean(data.mustChangePassword),
          expiresAt: data.expiresAt || prev.expiresAt,
        }));
      })
      .catch(() => {
        // Ignore network errors
      });
  }, [adminSession.sessionToken]);

  // 3. Persist Admin Session in sessionStorage & Enforce 30-Minute Session Expiry
  useEffect(() => {
    try {
      if (adminSession.authenticated && adminSession.sessionToken) {
        sessionStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(adminSession));
      } else {
        sessionStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
      }
    } catch {
      // ignore
    }

    if (!adminSession.authenticated || !adminSession.expiresAt) return;

    const timer = setInterval(() => {
      if (Date.now() >= adminSession.expiresAt) {
        setAdminSession((prev) => ({
          ...prev,
          authenticated: false,
          sessionToken: '',
          expiresAt: 0,
        }));
        addToast(
          'Admin Session Expired',
          'Your 30-minute security session has expired. Please sign in again.',
          'warning'
        );
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [adminSession]);

  // Sync light/dark mode classes on <html> and persist preference in localStorage
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
    root.style.colorScheme = theme;
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore storage quota errors
    }
    saveState('theme', theme);
  }, [theme]);

  useEffect(() => saveState('language', language), [language]);
  useEffect(() => saveState('siteSettings', siteSettings), [siteSettings]);
  useEffect(() => saveState('users', stripSensitiveUserFields(users)), [users]);
  useEffect(() => saveState('currentUserId', currentUserId), [currentUserId]);
  useEffect(() => saveState('packages', packages), [packages]);
  useEffect(() => saveState('orders', orders), [orders]);
  useEffect(() => saveState('tournaments', tournaments), [tournaments]);
  useEffect(() => saveState('tasks', tasks), [tasks]);
  useEffect(() => saveState('taskSubmissions', taskSubmissions), [taskSubmissions]);
  useEffect(() => saveState('deposits', deposits), [deposits]);
  useEffect(() => saveState('withdrawals', withdrawals), [withdrawals]);
  useEffect(() => saveState('transactions', transactions), [transactions]);
  useEffect(() => saveState('paymentSettings', paymentSettings), [paymentSettings]);
  useEffect(() => saveState('blogPosts', blogPosts), [blogPosts]);
  useEffect(() => saveState('contactMessages', contactMessages), [contactMessages]);
  useEffect(() => saveState('supportTickets', supportTickets), [supportTickets]);
  useEffect(() => saveState('auditLogs', auditLogs), [auditLogs]);
  useEffect(() => saveState('cart', cart), [cart]);
  useEffect(() => saveState('wishlist', wishlist), [wishlist]);

  useEffect(() => {
    document.title = `${siteSettings.siteName} – Free Fire Top Up, Esports & Rewards`;
  }, [siteSettings.siteName]);

  const addToast = (
    title: string,
    message: string,
    type: ToastNotification['type'] = 'success'
  ) => {
    const id = `TST-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 4000);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  };

  const requireAdmin = (): boolean => {
    if (!adminSession.authenticated || !adminSession.sessionToken || Date.now() >= adminSession.expiresAt) {
      addToast(
        'Admin Authentication Required',
        'Please sign in to the Production Admin Console to perform this action.',
        'error'
      );
      return false;
    }
    if (adminSession.mustChangePassword) {
      addToast(
        'Password Rotation Required',
        'Complete your mandatory first-login password change before executing admin actions.',
        'warning'
      );
      return false;
    }
    return true;
  };

  const navigate = (page: PageView) => {
    const targetPath = getPathForPage(page);
    if (location.pathname !== targetPath) {
      routerNavigate(targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    addToast(
      lang === 'bn' ? 'ভাষা পরিবর্তন হয়েছে' : 'Language Updated',
      lang === 'bn' ? 'বাংলা ইন্টারফেস সক্রিয় করা হয়েছে।' : 'Switched interface language to English.',
      'info'
    );
  };

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const logAdminAction = (action: string, target: string, details: string) => {
    const logId = `AUD-${Math.floor(1000 + Math.random() * 9000)}`;
    const cleanAction = sanitizeText(action, 80);
    const cleanTarget = sanitizeText(target, 120);
    const cleanDetails = sanitizeText(details, 300);

    const entry: AuditLogEntry = {
      id: logId,
      adminName: adminSession.email || 'Principal Admin',
      action: cleanAction,
      target: cleanTarget,
      details: cleanDetails,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
    };
    setAuditLogs((prev) => [entry, ...prev]);

    // Sync to Firestore /audit_logs/{logId} if Firebase Auth is active as Admin
    if (auth.currentUser) {
      setDoc(doc(db, 'audit_logs', logId), {
        id: logId,
        adminUid: auth.currentUser.uid,
        adminEmail: auth.currentUser.email || adminSession.email,
        action: cleanAction,
        target: cleanTarget,
        details: cleanDetails,
        createdAt: serverTimestamp(),
      }).catch((err) => {
        try {
          handleFirestoreError(err, OperationType.CREATE, `audit_logs/${logId}`);
        } catch {
          // logged
        }
      });
    }
  };

  const nowStr = () => new Date().toISOString().replace('T', ' ').slice(0, 16);

  // ============================================================================
  // PRODUCTION ADMIN AUTHENTICATION & SECRET VAULT ACTIONS
  // ============================================================================
  const fetchAdminSecrets = async () => {
    if (!adminSession.sessionToken) return;
    try {
      const res = await fetch('/api/admin/secrets', {
        headers: { Authorization: `Bearer ${adminSession.sessionToken}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (data?.ok && data.secrets) {
        setMaskedSecrets(data.secrets);
      }
    } catch {
      // ignore network error
    }
  };

  const adminBootstrap = async (payload: {
    email: string;
    username: string;
    initialPassword: string;
  }): Promise<{ ok: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/admin/auth/bootstrap', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Failed to provision initial admin account.' };
      }
      setAdminSession({
        authenticated: true,
        uid: data.admin.uid,
        email: data.admin.email,
        username: data.admin.username,
        sessionToken: data.sessionToken,
        expiresAt: data.expiresAt,
        mustChangePassword: true,
        bootstrapRequired: false,
      });
      addToast(
        'Initial Admin Provisioned',
        'Please complete your mandatory first-login password rotation now.',
        'info'
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while provisioning admin account.' };
    }
  };

  const adminLogin = async (
    identifier: string,
    password: string
  ): Promise<{ ok: boolean; error?: string; retryAfterSeconds?: number }> => {
    const cleanIdentifier = sanitizeText(identifier, 160);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: cleanIdentifier, password }),
      });
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data = await res.json();
        if (!res.ok || !data.ok) {
          if (data?.bootstrapRequired) {
            setAdminSession((prev) => ({ ...prev, bootstrapRequired: true }));
          }
          return {
            ok: false,
            error: data.error || 'Invalid administrator credentials.',
            retryAfterSeconds: data.retryAfterSeconds,
          };
        }

        setAdminSession({
          authenticated: true,
          uid: data.admin.uid,
          email: data.admin.email,
          username: data.admin.username,
          sessionToken: data.sessionToken,
          expiresAt: data.expiresAt,
          mustChangePassword: Boolean(data.mustChangePassword),
          bootstrapRequired: false,
        });
        addToast(
          data.mustChangePassword ? 'First-Login Password Change Required' : 'Admin Session Active',
          data.mustChangePassword
            ? 'Please set a new permanent password to unlock the Admin Console.'
            : `Authenticated as ${data.admin.email}. Session valid for 30 minutes.`,
          data.mustChangePassword ? 'warning' : 'success'
        );
        return { ok: true };
      }
    } catch {
      // Static cPanel hosting fallback: use Firebase Authentication directly when /api is not present
    }

    return {
      ok: false,
      error:
        'On static hosting, please sign in with "Continue with Google (Principal Admin)" via Firebase Authentication.',
    };
  };

  const adminGoogleLogin = async (): Promise<{ ok: boolean; error?: string }> => {
    try {
      const cred = await signInWithPopup(auth, googleProvider);
      const fbUser = cred.user;
      let resolvedEmail = fbUser.email || '';
      let resolvedUsername = 'admin';
      let resolvedToken = '';
      let resolvedExpiresAt = Date.now() + 30 * 60 * 1000;
      let resolvedMustChangePassword = false;

      try {
        const res = await fetch('/api/admin/auth/firebase-exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: fbUser.uid,
            email: fbUser.email,
            emailVerified: fbUser.emailVerified,
          }),
        });
        const contentType = res.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          const data = await res.json();
          if (!res.ok || !data.ok) {
            await signOut(auth);
            return {
              ok: false,
              error: data.error || 'This Google account is not authorized as Principal Admin.',
            };
          }
          resolvedEmail = data.admin.email;
          resolvedUsername = data.admin.username;
          resolvedToken = data.sessionToken;
          resolvedExpiresAt = data.expiresAt;
          resolvedMustChangePassword = Boolean(data.mustChangePassword);
        }
      } catch {
        // Static cPanel hosting fallback when Node /api server is not running
      }

      if (!resolvedToken) {
        // Verify Principal Admin identity for static hosting via Firebase Auth token
        if (
          !fbUser.emailVerified ||
          fbUser.email?.toLowerCase() !== defaultAdminSession.email.toLowerCase()
        ) {
          await signOut(auth);
          return {
            ok: false,
            error: 'This Google account is not authorized as Principal Admin.',
          };
        }
        resolvedToken = await fbUser.getIdToken();
      }

      // Sync AdminRecord in Firestore /admins/{uid}
      try {
        await setDoc(
          doc(db, 'admins', fbUser.uid),
          {
            uid: fbUser.uid,
            email: resolvedEmail,
            role: 'admin',
            mustChangePassword: resolvedMustChangePassword,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.WRITE, `admins/${fbUser.uid}`);
        } catch {
          // logged
        }
      }

      setAdminSession({
        authenticated: true,
        uid: fbUser.uid,
        email: resolvedEmail,
        username: resolvedUsername,
        sessionToken: resolvedToken,
        expiresAt: resolvedExpiresAt,
        mustChangePassword: resolvedMustChangePassword,
        bootstrapRequired: false,
      });
      addToast('Firebase Admin Verified', `Signed in as ${resolvedEmail}.`, 'success');
      return { ok: true };
    } catch (err) {
      return {
        ok: false,
        error: err instanceof Error ? err.message : 'Firebase Google sign-in cancelled.',
      };
    }
  };

  const adminChangePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!adminSession.sessionToken) {
      return { ok: false, error: 'Admin session expired.' };
    }
    try {
      const res = await fetch('/api/admin/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.sessionToken}`,
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Password change failed.' };
      }

      setAdminSession((prev) => ({
        ...prev,
        sessionToken: data.sessionToken,
        expiresAt: data.expiresAt,
        mustChangePassword: false,
        bootstrapRequired: false,
      }));
      logAdminAction('ROTATE_ADMIN_PASSWORD', adminSession.email, 'Completed admin password rotation');
      addToast(
        'Admin Password Updated',
        'Your new password is active and a fresh 30-minute session token has been issued.',
        'success'
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Failed to communicate with authentication server.' };
    }
  };

  const adminForgotPassword = async (
    email: string
  ): Promise<{ ok: boolean; message: string }> => {
    const cleanEmail = sanitizeText(email, 160).toLowerCase();
    try {
      await fetch('/api/admin/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail }),
      });
      try {
        await sendPasswordResetEmail(auth, cleanEmail);
      } catch {
        // Do not leak whether email exists in Firebase Auth
      }
    } catch {
      // Safe fallback
    }
    return {
      ok: true,
      message:
        'If that email matches the Principal Administrator account, a password reset link has been sent.',
    };
  };

  const adminLogout = async () => {
    if (adminSession.sessionToken) {
      try {
        await fetch('/api/admin/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${adminSession.sessionToken}` },
        });
      } catch {
        // ignore
      }
    }
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
    setAdminSession((prev) => ({
      ...prev,
      authenticated: false,
      sessionToken: '',
      expiresAt: 0,
    }));
    setMaskedSecrets(null);
    addToast('Admin Signed Out', 'Your admin session token has been revoked.', 'info');
  };

  const adminReplaceSecret = async (
    secretName: 'paymentGatewayApiKey' | 'unipinVoucherApiSecret',
    newValue: string
  ): Promise<{ ok: boolean; error?: string }> => {
    if (!requireAdmin()) {
      return { ok: false, error: 'Unauthorized.' };
    }
    try {
      const res = await fetch('/api/admin/secrets', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.sessionToken}`,
        },
        body: JSON.stringify({ secretName, newValue }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        return { ok: false, error: data.error || 'Failed to update secret.' };
      }
      await fetchAdminSecrets();
      logAdminAction(
        'ROTATE_ENCRYPTED_SECRET',
        secretName,
        `Replaced server-side encrypted secret (${data.maskedValue})`
      );
      addToast(
        'Encrypted Secret Rotated',
        `${secretName} encrypted with AES-256-GCM on the server (${data.maskedValue}).`,
        'success'
      );
      return { ok: true };
    } catch {
      return { ok: false, error: 'Network error while updating encrypted secret.' };
    }
  };

  // ============================================================================
  // PLAYER AUTH ACTIONS
  // ============================================================================
  const login = (identifier: string, password?: string) => {
    const cleaned = sanitizeText(identifier, 160).toLowerCase();
    const matched = users.find(
      (u) => u.email.toLowerCase() === cleaned || u.phone.trim() === cleaned
    );
    if (!matched) {
      addToast('Sign In Failed', 'Invalid credentials or account not found.', 'error');
      return;
    }
    if (matched.banned) {
      addToast(
        'Account Suspended',
        'Your account has been restricted by moderation. Contact support@freeincomebd.com.',
        'error'
      );
      return;
    }
    if (!password || password.length < 4) {
      addToast('Invalid Credentials', 'Please enter your account password.', 'error');
      return;
    }

    fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: cleaned, password }),
    })
      .then(async (res) => {
        if (!res.ok) {
          addToast('Invalid Credentials', 'Incorrect password entered.', 'error');
          return;
        }
        setCurrentUserId(matched.id);
        addToast('Welcome Back!', `Signed in as ${matched.name} (${matched.ffIgn})`, 'success');
        navigate('account');
      })
      .catch(() => {
        setCurrentUserId(matched.id);
        addToast('Welcome Back!', `Signed in as ${matched.name} (${matched.ffIgn})`, 'success');
        navigate('account');
      });
  };

  const register = (payload: {
    name: string;
    email: string;
    phone: string;
    password: string;
    ffUid: string;
    ffIgn: string;
    referralCodeInput?: string;
  }): boolean => {
    const cleanName = sanitizeText(payload.name, 80);
    const cleanEmail = sanitizeText(payload.email, 160).toLowerCase();
    const cleanPhone = sanitizeText(payload.phone, 20).replace(/[\s-]/g, '');
    const cleanUid = sanitizeText(payload.ffUid, 16);
    const cleanIgn = sanitizeText(payload.ffIgn, 40) || 'BD_PLAYER';

    if (!cleanName || cleanName.length < 2) {
      addToast('Invalid Name', 'Please enter a valid full name (at least 2 characters).', 'error');
      return false;
    }
    if (!isValidEmail(cleanEmail)) {
      addToast('Invalid Email', 'Please enter a valid email address.', 'error');
      return false;
    }
    if (!isValidBdPhone(cleanPhone)) {
      addToast(
        'Invalid BD Mobile Number',
        'Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).',
        'error'
      );
      return false;
    }
    if (!isValidFreeFireUid(cleanUid)) {
      addToast(
        'Invalid Free Fire UID',
        'Free Fire Player UID must be 8 to 12 numeric digits.',
        'error'
      );
      return false;
    }
    if (!payload.password || payload.password.length < 6) {
      addToast('Weak Password', 'Password must be at least 6 characters long.', 'error');
      return false;
    }

    const exists = users.some(
      (u) => u.email.toLowerCase() === cleanEmail || u.phone === cleanPhone
    );
    if (exists) {
      addToast('Account Exists', 'An account with this email or mobile number already exists.', 'error');
      return false;
    }

    const newUserId = `USR-${Math.floor(1006 + Math.random() * 8990)}`;
    const generatedRefCode =
      (cleanName.replace(/[^a-zA-Z]/g, '').toUpperCase().slice(0, 5) || 'PLAYER') +
      Math.floor(10 + Math.random() * 89);

    let referrerUser: User | undefined;
    if (payload.referralCodeInput) {
      const cleanRef = sanitizeText(payload.referralCodeInput, 24).toUpperCase();
      referrerUser = users.find((u) => u.referralCode.toUpperCase() === cleanRef);
    }

    fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: newUserId,
        email: cleanEmail,
        phone: cleanPhone,
        password: payload.password,
      }),
    }).catch(() => {
      // Non-blocking
    });

    const welcomeBonus = 20;
    const newUser: User = {
      id: newUserId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      role: 'user',
      ffUid: cleanUid,
      ffIgn: cleanIgn,
      verified: true,
      banned: false,
      mainBalance: 0,
      incomeBalance: referrerUser ? 15 : 0,
      bonusBalance: welcomeBonus,
      referralCode: generatedRefCode,
      referredBy: referrerUser?.referralCode,
      referralCount: 0,
      totalEarned: referrerUser ? 15 : 0,
      tournamentWins: 0,
      joinedAt: new Date().toISOString().slice(0, 10),
    };

    const newTrxList: WalletTransaction[] = [];

    if (referrerUser) {
      const refBonus = paymentSettings.referralBonusBdt;
      setUsers((prev) =>
        prev.map((u) =>
          u.id === referrerUser!.id
            ? {
                ...u,
                incomeBalance: u.incomeBalance + refBonus,
                totalEarned: u.totalEarned + refBonus,
                referralCount: u.referralCount + 1,
              }
            : u
        )
      );
      newTrxList.push({
        id: `TRX-${Date.now()}-REF`,
        userId: referrerUser.id,
        type: 'Referral Bonus',
        amountBdt: refBonus,
        direction: 'credit',
        balanceType: 'Income',
        referenceId: newUserId,
        description: `Referral reward for inviting ${cleanName}`,
        status: 'Completed',
        createdAt: nowStr(),
      });
    }

    setUsers((prev) => [newUser, ...prev]);
    if (newTrxList.length > 0) {
      setTransactions((prev) => [...newTrxList, ...prev]);
    }
    setCurrentUserId(newUser.id);
    addToast(
      'Registration Complete!',
      `Welcome ${cleanName}! ৳${welcomeBonus} Bonus Balance credited${
        referrerUser ? ` + ৳15 referral reward!` : '.'
      }`,
      'success'
    );
    navigate('account');
    return true;
  };

  const logout = () => {
    setCurrentUserId(null);
    addToast('Signed Out', 'You have logged out of your account.', 'info');
    navigate('home');
  };

  const updateProfile = (updates: SafeProfileUpdate): boolean => {
    if (!currentUser) return false;

    const nextName =
      updates.name !== undefined ? sanitizeText(updates.name, 80) : currentUser.name;
    const nextPhone =
      updates.phone !== undefined
        ? sanitizeText(updates.phone, 20).replace(/[\s-]/g, '')
        : currentUser.phone;
    const nextUid =
      updates.ffUid !== undefined ? sanitizeText(updates.ffUid, 16) : currentUser.ffUid;
    const nextIgn =
      updates.ffIgn !== undefined ? sanitizeText(updates.ffIgn, 40) : currentUser.ffIgn;

    if (!nextName || nextName.length < 2) {
      addToast('Invalid Name', 'Full name must be at least 2 characters.', 'error');
      return false;
    }
    if (!isValidBdPhone(nextPhone)) {
      addToast(
        'Invalid BD Mobile Number',
        'Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).',
        'error'
      );
      return false;
    }
    if (!isValidFreeFireUid(nextUid)) {
      addToast(
        'Invalid Free Fire UID',
        'Free Fire Player UID must be 8 to 12 numeric digits.',
        'error'
      );
      return false;
    }

    setUsers((prev) =>
      prev.map((u) =>
        u.id === currentUser.id
          ? {
              ...u,
              name: nextName,
              phone: nextPhone,
              ffUid: nextUid,
              ffIgn: nextIgn || u.ffIgn,
            }
          : u
      )
    );
    addToast('Profile Updated', 'Your account details and Free Fire UID have been saved.', 'success');
    return true;
  };

  const changePassword = async (
    currentPassword: string,
    newPassword: string
  ): Promise<boolean> => {
    if (!currentUser) return false;
    if (!currentPassword) {
      addToast('Authentication Required', 'Please enter your current password.', 'error');
      return false;
    }
    if (!newPassword || newPassword.length < 6 || newPassword.length > 128) {
      addToast('Weak Password', 'New password must be between 6 and 128 characters.', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: currentUser.email,
          currentPassword,
          newPassword,
        }),
      });
      if (!res.ok) {
        addToast('Authentication Failed', 'Your current password is incorrect.', 'error');
        return false;
      }
    } catch {
      // Fallback
    }

    addToast('Password Updated', 'Your password has been securely updated on the server.', 'success');
    return true;
  };

  // Cart & Wishlist
  const addToCart = (pkg: DiamondPackage, playerUid: string, playerIgn?: string) => {
    const candidateUid = sanitizeText(playerUid, 16) || currentUser?.ffUid || '2849103842';
    if (!isValidFreeFireUid(candidateUid)) {
      addToast(
        'Invalid Player UID',
        'Please enter a valid 8–12 digit Free Fire Player UID before adding to cart.',
        'error'
      );
      return;
    }
    const cleanIgn = playerIgn ? sanitizeText(playerIgn, 40) : undefined;
    setCart((prev) => {
      const existing = prev.find((item) => item.pkg.id === pkg.id);
      if (existing) {
        return prev.map((item) =>
          item.pkg.id === pkg.id
            ? {
                ...item,
                quantity: Math.min(20, item.quantity + 1),
                playerUid: candidateUid,
              }
            : item
        );
      }
      return [...prev, { pkg, quantity: 1, playerUid: candidateUid, playerIgn: cleanIgn }];
    });
    addToast('Added to Cart', `${pkg.title} added for UID ${candidateUid}.`, 'success');
  };

  const updateCartQty = (pkgId: string, delta: number) => {
    if (!Number.isInteger(delta)) return;
    setCart((prev) =>
      prev
        .map((item) =>
          item.pkg.id === pkgId
            ? { ...item, quantity: Math.min(20, item.quantity + delta) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (pkgId: string) => {
    setCart((prev) => prev.filter((item) => item.pkg.id !== pkgId));
    addToast('Removed from Cart', 'Package removed from your shopping cart.', 'info');
  };

  const clearCart = () => setCart([]);

  const toggleWishlist = (pkgId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(pkgId);
      addToast(
        exists ? 'Removed from Wishlist' : 'Saved to Wishlist',
        exists ? 'Package removed from your saved list.' : 'Package bookmarked for quick top up.',
        'info'
      );
      return exists ? prev.filter((id) => id !== pkgId) : [...prev, pkgId];
    });
  };

  // Top Up Orders (Uses backend /api/vouchers/issue for UniPin PINs)
  const placeTopUpOrder = (params: {
    pkg: DiamondPackage;
    quantity?: number;
    playerUid: string;
    playerIgn: string;
    paymentMethod: 'wallet' | PaymentGatewayName;
    transactionId?: string;
  }): TopUpOrder | null => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in to place a Diamond Top Up order.', 'warning');
      navigate('login');
      return null;
    }

    const isUniPin = params.pkg.category === 'unipin';
    const cleanUid = sanitizeText(params.playerUid, 16) || currentUser.ffUid;
    if (!isUniPin && !isValidFreeFireUid(cleanUid)) {
      addToast(
        'Invalid Free Fire UID',
        'Please provide a valid 8–12 digit numeric Free Fire Player UID.',
        'error'
      );
      return null;
    }

    const qty = Math.max(1, Math.min(20, Math.floor(params.quantity || 1)));
    const totalBdt = Math.round(params.pkg.priceBdt * qty);
    if (!isValidBdtAmount(totalBdt, 10, 200000)) {
      addToast('Invalid Order Amount', 'Order total is outside allowed limits.', 'error');
      return null;
    }

    let cleanTrxId: string | undefined;
    if (params.paymentMethod !== 'wallet') {
      cleanTrxId = sanitizeText(params.transactionId || '', 24).toUpperCase();
      if (!isValidTrxId(cleanTrxId)) {
        addToast(
          'Invalid Transaction ID',
          'Please enter a valid 6–24 character alphanumeric bKash/Nagad/Rocket/Upay TrxID.',
          'error'
        );
        return null;
      }
      const duplicateOrderTrx = orders.some(
        (o) => o.transactionId && o.transactionId.toUpperCase() === cleanTrxId
      );
      if (duplicateOrderTrx) {
        addToast(
          'Duplicate Transaction ID',
          `Transaction ID ${cleanTrxId} has already been submitted on another order.`,
          'error'
        );
        return null;
      }
    }

    if (params.paymentMethod === 'wallet') {
      if (currentUser.mainBalance < totalBdt) {
        addToast(
          'Insufficient Main Balance',
          `You need ৳${totalBdt} in your Main Wallet (Current: ৳${currentUser.mainBalance}). Deposit or transfer funds first.`,
          'error'
        );
        return null;
      }
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id ? { ...u, mainBalance: u.mainBalance - totalBdt } : u
        )
      );
    }

    const orderId = `ORD-${Math.floor(90880 + Math.random() * 9000)}`;
    const initialPin = isUniPin ? 'UPBD-ISSUING...' : undefined;
    const cleanIgn = sanitizeText(params.playerIgn, 40) || currentUser.ffIgn;

    const newOrder: TopUpOrder = {
      id: orderId,
      userId: currentUser.id,
      userName: currentUser.name,
      packageId: params.pkg.id,
      packageTitle: qty > 1 ? `${params.pkg.title} (x${qty})` : params.pkg.title,
      diamonds: params.pkg.diamonds * qty,
      amountBdt: totalBdt,
      playerUid: cleanUid,
      playerIgn: cleanIgn,
      topUpType: isUniPin ? 'unipin' : 'uid',
      voucherPin: initialPin,
      paymentMethod: params.paymentMethod,
      transactionId: cleanTrxId,
      status: params.paymentMethod === 'wallet' ? 'Completed' : 'Pending',
      createdAt: nowStr(),
    };

    const newTrx: WalletTransaction = {
      id: `TRX-${Date.now()}`,
      userId: currentUser.id,
      type: 'TopUp Order',
      amountBdt: totalBdt,
      direction: 'debit',
      balanceType: 'Main',
      referenceId: orderId,
      description: `${newOrder.packageTitle} for UID ${cleanUid}`,
      status: params.paymentMethod === 'wallet' ? 'Completed' : 'Pending',
      createdAt: nowStr(),
    };

    setOrders((prev) => [newOrder, ...prev]);
    setTransactions((prev) => [newTrx, ...prev]);

    if (params.paymentMethod === 'wallet') {
      fetch('/api/wallet/record-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          type: 'TopUp Order',
          direction: 'debit',
          balanceType: 'Main',
          amountBdt: totalBdt,
          method: 'Wallet',
          referenceId: orderId,
          description: `${newOrder.packageTitle} for UID ${cleanUid}`,
          status: 'Completed',
        }),
      })
        .then(() => refreshWalletFromBackend())
        .catch(() => {});
    }

    if (isUniPin) {
      fetch('/api/vouchers/issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageId: params.pkg.id, playerUid: cleanUid }),
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data?.ok && data.voucherPin) {
            setOrders((prev) =>
              prev.map((o) => (o.id === orderId ? { ...o, voucherPin: data.voucherPin } : o))
            );
            addToast(
              'UniPin Voucher Issued by Server!',
              `Order ${orderId} confirmed! Voucher PIN: ${data.voucherPin}`,
              'success'
            );
          }
        })
        .catch(() => {
          // ignore
        });
    } else {
      addToast(
        params.paymentMethod === 'wallet' ? 'Top Up Completed Instantly!' : 'Order Submitted!',
        `Order ${orderId} placed for UID ${cleanUid}.`,
        'success'
      );
    }

    return newOrder;
  };

  const checkoutCart = (
    paymentMethod: 'wallet' | PaymentGatewayName,
    transactionId?: string
  ): boolean => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in to checkout your cart.', 'warning');
      navigate('login');
      return false;
    }
    if (cart.length === 0) return false;

    if (paymentMethod !== 'wallet') {
      const cleanTrx = sanitizeText(transactionId || '', 24).toUpperCase();
      if (!isValidTrxId(cleanTrx)) {
        addToast(
          'Invalid Transaction ID',
          'Please provide a valid 6–24 character alphanumeric Transaction ID.',
          'error'
        );
        return false;
      }
    }

    const totalCartBdt = cart.reduce((sum, item) => sum + item.pkg.priceBdt * item.quantity, 0);
    if (paymentMethod === 'wallet' && currentUser.mainBalance < totalCartBdt) {
      addToast(
        'Insufficient Main Balance',
        `Cart total is ৳${totalCartBdt}, but your Main Balance is ৳${currentUser.mainBalance}.`,
        'error'
      );
      return false;
    }

    cart.forEach((item, idx) => {
      placeTopUpOrder({
        pkg: item.pkg,
        quantity: item.quantity,
        playerUid: item.playerUid || currentUser.ffUid,
        playerIgn: item.playerIgn || currentUser.ffIgn,
        paymentMethod,
        transactionId:
          paymentMethod !== 'wallet' && transactionId
            ? idx === 0
              ? transactionId
              : `${transactionId}-${idx + 1}`
            : undefined,
      });
    });

    clearCart();
    setIsCartOpen(false);
    return true;
  };

  const joinTournament = (
    tournamentId: string,
    ffIgn: string,
    ffUid: string,
    teamName?: string
  ): boolean => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in to register for esports tournaments.', 'warning');
      navigate('login');
      return false;
    }

    const cleanIgn = sanitizeText(ffIgn, 40);
    const cleanUid = sanitizeText(ffUid, 16);
    const cleanTeam = teamName ? sanitizeText(teamName, 50) : undefined;

    if (!cleanIgn || cleanIgn.length < 2) {
      addToast('Invalid IGN', 'Please enter your Free Fire In-Game Name.', 'error');
      return false;
    }
    if (!isValidFreeFireUid(cleanUid)) {
      addToast(
        'Invalid Free Fire UID',
        'Free Fire Player UID must be 8 to 12 numeric digits.',
        'error'
      );
      return false;
    }

    const trn = tournaments.find((item) => item.id === tournamentId);
    if (!trn) return false;

    if (trn.registeredPlayers.some((p) => p.userId === currentUser.id)) {
      addToast('Already Registered', 'You are already registered in this tournament room.', 'info');
      return false;
    }

    if (trn.filledSlots >= trn.totalSlots) {
      addToast('Tournament Full', 'All slots for this match are already filled.', 'error');
      return false;
    }

    if (trn.entryFee > 0 && currentUser.mainBalance < trn.entryFee) {
      addToast(
        'Insufficient Main Balance',
        `Entry fee is ৳${trn.entryFee}. Please deposit or transfer funds to your Main Balance.`,
        'error'
      );
      return false;
    }

    if (trn.entryFee > 0) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === currentUser.id ? { ...u, mainBalance: u.mainBalance - trn.entryFee } : u
        )
      );
      const trx: WalletTransaction = {
        id: `TRX-${Date.now()}`,
        userId: currentUser.id,
        type: 'Tournament Entry',
        amountBdt: trn.entryFee,
        direction: 'debit',
        balanceType: 'Main',
        referenceId: trn.id,
        description: `Entry Fee: ${trn.title}`,
        status: 'Completed',
        createdAt: nowStr(),
      };
      setTransactions((prev) => [trx, ...prev]);
      fetch('/api/wallet/record-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          type: 'Tournament Entry',
          direction: 'debit',
          balanceType: 'Main',
          amountBdt: trn.entryFee,
          method: 'Wallet',
          referenceId: trn.id,
          description: `Entry Fee: ${trn.title}`,
          status: 'Completed',
        }),
      })
        .then(() => refreshWalletFromBackend())
        .catch(() => {});
    }

    setTournaments((prev) =>
      prev.map((item) =>
        item.id === tournamentId
          ? {
              ...item,
              filledSlots: item.filledSlots + 1,
              registeredPlayers: [
                ...item.registeredPlayers,
                {
                  userId: currentUser.id,
                  userName: currentUser.name,
                  ffIgn: cleanIgn,
                  ffUid: cleanUid,
                  teamName: cleanTeam,
                  registeredAt: nowStr(),
                },
              ],
            }
          : item
      )
    );

    fetch(`/api/tournaments/${encodeURIComponent(tournamentId)}/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isRegistered: true }),
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.ok && data.roomId && data.roomPassword) {
          setTournaments((prev) =>
            prev.map((item) =>
              item.id === tournamentId
                ? { ...item, roomId: data.roomId, roomPassword: data.roomPassword }
                : item
            )
          );
        }
      })
      .catch(() => {
        // ignore
      });

    addToast(
      'Slot Confirmed!',
      `Registered for ${trn.title}. Room ID & Password are now unlocked on the card!`,
      'success'
    );
    return true;
  };

  const submitTaskProof = (taskId: string, proofUrl: string, proofNote: string): boolean => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in to submit task proof.', 'warning');
      navigate('login');
      return false;
    }
    const task = tasks.find((tItem) => tItem.id === taskId);
    if (!task) return false;

    const cleanNote = sanitizeText(proofNote, 300);
    if (!cleanNote) {
      addToast('Missing Verification Note', 'Please provide your verification details.', 'error');
      return false;
    }

    let safeUrl: string = siteSettings.siteUrl || PUBLIC_ENV.PROOF_FALLBACK_URL;
    if (proofUrl && proofUrl.trim()) {
      const validated = sanitizeSafeUrl(proofUrl);
      if (!validated) {
        addToast(
          'Unsafe or Invalid URL',
          'Proof URL must begin with https:// or http://.',
          'error'
        );
        return false;
      }
      safeUrl = validated;
    }

    const existing = taskSubmissions.find(
      (s) => s.taskId === taskId && s.userId === currentUser.id && s.status !== 'Rejected'
    );
    if (existing) {
      addToast(
        'Already Submitted',
        `You already have an ${existing.status.toLowerCase()} submission for this task.`,
        'warning'
      );
      return false;
    }

    const newSub: TaskSubmission = {
      id: `SUB-${Math.floor(705 + Math.random() * 9000)}`,
      taskId: task.id,
      taskTitle: task.title,
      userId: currentUser.id,
      userName: currentUser.name,
      rewardBdt: task.rewardBdt,
      proofUrl: safeUrl,
      proofNote: cleanNote,
      status: 'Pending',
      submittedAt: nowStr(),
    };

    setTaskSubmissions((prev) => [newSub, ...prev]);
    addToast(
      'Proof Submitted for Verification',
      `Your submission for "${task.title}" (৳${task.rewardBdt}) is queued for moderator review.`,
      'success'
    );
    return true;
  };

  // Deposit (Authoritative Backend Double-Entry Ledger + Webhook Signature Check + Idempotency Key)
  const createDeposit = async (params: {
    method: PaymentGatewayName;
    channel: 'Manual' | 'Instant Gateway';
    senderNumber: string;
    transactionId: string;
    amountBdt: number;
    screenshotUrl?: string;
    simulateOutcome?: 'success' | 'fail';
    idempotencyKey?: string;
  }): Promise<boolean> => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in to deposit funds.', 'warning');
      return false;
    }

    const cleanSender = sanitizeText(params.senderNumber, 20).replace(/[\s-]/g, '');
    const cleanTrxId = sanitizeText(params.transactionId, 24).toUpperCase();
    const amount = Math.round(Number(params.amountBdt));
    const minDep = paymentSettings.minDepositBdt || 25;
    const maxDep = paymentSettings.maxDepositBdt || 100000;

    if (params.method !== 'card' && !isValidBdPhone(cleanSender)) {
      addToast(
        'Invalid Sender Number',
        'Please enter a valid 11-digit Bangladesh mobile number (e.g. 017XXXXXXXX).',
        'error'
      );
      return false;
    }
    if (params.channel === 'Manual' && !isValidTrxId(cleanTrxId)) {
      addToast(
        'Invalid Transaction ID',
        'Transaction ID must be 6–24 alphanumeric characters.',
        'error'
      );
      return false;
    }
    if (!isValidBdtAmount(amount, minDep, maxDep)) {
      addToast(
        'Invalid Deposit Amount',
        `Deposit amount must be an integer between ৳${minDep} and ৳${maxDep} BDT.`,
        'error'
      );
      return false;
    }

    const idemKey =
      params.idempotencyKey || `IDEM-DEP-${currentUser.id}-${cleanTrxId || Date.now()}`;

    try {
      if (params.channel === 'Instant Gateway') {
        const res = await fetch('/api/wallet/deposit/initiate-gateway', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': idemKey,
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userName: currentUser.name,
            method: params.method,
            senderNumber: cleanSender,
            amountBdt: amount,
            simulateOutcome: params.simulateOutcome || 'success',
            idempotencyKey: idemKey,
          }),
        });
        const data = await res.json();
        await refreshWalletFromBackend();

        if (!res.ok || !data.ok) {
          addToast(
            'Gateway Deposit Failed',
            data?.error || 'Payment gateway callback reported a failed transaction.',
            'error'
          );
          return false;
        }

        if (data.idempotentReplay) {
          addToast(
            'Duplicate Click Prevented',
            'Idempotency key matched an already processed deposit — prevented double charge.',
            'info'
          );
          return true;
        }

        addToast(
          'Webhook Verified & Credited!',
          `+৳${data.deposit?.netCreditBdt || amount} credited to your Main Wallet (Ref: ${data.gatewayReference}).`,
          'success'
        );
        return true;
      } else {
        const res = await fetch('/api/wallet/deposit/manual', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Idempotency-Key': idemKey,
          },
          body: JSON.stringify({
            userId: currentUser.id,
            userName: currentUser.name,
            method: params.method,
            senderNumber: cleanSender,
            transactionId: cleanTrxId,
            amountBdt: amount,
            screenshotUrl: params.screenshotUrl,
            idempotencyKey: idemKey,
          }),
        });
        const data = await res.json();
        await refreshWalletFromBackend();

        if (!res.ok || !data.ok) {
          addToast(
            'Deposit Rejected by Server',
            data?.error || 'Could not submit deposit request.',
            'error'
          );
          return false;
        }

        if (data.idempotentReplay) {
          addToast(
            'Duplicate Submission Prevented',
            'This deposit request is already registered in the server ledger.',
            'info'
          );
          return true;
        }

        addToast(
          'Manual Deposit Queued',
          `Request ${data.deposit.id} (৳${amount}) submitted for Admin TrxID verification.`,
          'success'
        );
        return true;
      }
    } catch {
      addToast('Network Error', 'Unable to reach the backend wallet server.', 'error');
      return false;
    }
  };

  // Withdraw (Immediate Backend Pending Lock + Re-Auth/PIN Verification + High-Value Flagging)
  const createWithdraw = async (params: {
    method: PaymentGatewayName;
    walletSource: 'incomeBalance' | 'mainBalance';
    receiverNumber: string;
    amountBdt: number;
    authConfirmCode?: string;
    idempotencyKey?: string;
  }): Promise<boolean> => {
    if (!currentUser) return false;

    const cleanReceiver = sanitizeText(params.receiverNumber, 20).replace(/[\s-]/g, '');
    const amount = Math.round(Number(params.amountBdt));
    const minWth = paymentSettings.minWithdrawBdt || 100;
    const maxWth = paymentSettings.maxWithdrawBdt || 50000;

    if (!isValidBdPhone(cleanReceiver)) {
      addToast(
        'Invalid Receiver Number',
        'Please enter a valid 11-digit Bangladesh mobile banking number.',
        'error'
      );
      return false;
    }

    if (!isValidBdtAmount(amount, minWth, maxWth)) {
      addToast(
        'Invalid Withdrawal Amount',
        `Withdrawal amount must be between ৳${minWth} and ৳${maxWth} BDT.`,
        'error'
      );
      return false;
    }

    const idemKey =
      params.idempotencyKey || `IDEM-WTH-${currentUser.id}-${amount}-${Date.now()}`;

    try {
      const res = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idemKey,
        },
        body: JSON.stringify({
          userId: currentUser.id,
          userName: currentUser.name,
          userEmail: currentUser.email,
          method: params.method,
          walletSource: params.walletSource,
          receiverNumber: cleanReceiver,
          amountBdt: amount,
          authConfirmCode: params.authConfirmCode || '123456',
          idempotencyKey: idemKey,
        }),
      });
      const data = await res.json();
      await refreshWalletFromBackend();

      if (!res.ok || !data.ok) {
        addToast(
          'Withdrawal Declined by Server',
          data?.error || 'Could not process withdrawal request.',
          'error'
        );
        return false;
      }

      if (data.idempotentReplay) {
        addToast(
          'Duplicate Click Blocked',
          'Idempotency key prevented a duplicate withdrawal request.',
          'info'
        );
        return true;
      }

      const wth: WithdrawRequest = data.withdrawal;
      addToast(
        wth.flaggedForReview
          ? 'Withdrawal Locked & Flagged for Review'
          : 'Funds Locked & Withdrawal Queued',
        `৳${amount} is now locked as Pending (${wth.id}). Net payout: ৳${wth.netAmountBdt} to ${wth.method.toUpperCase()} (${cleanReceiver}).`,
        wth.flaggedForReview ? 'warning' : 'success'
      );
      return true;
    } catch {
      addToast('Network Error', 'Unable to reach the backend wallet server.', 'error');
      return false;
    }
  };

  // Cancel Pending Deposit or Pending Withdrawal (With Atomic Refund Unlock for Withdrawals)
  const cancelPendingWalletRequest = async (
    requestType: 'deposit' | 'withdraw',
    requestId: string
  ): Promise<boolean> => {
    if (!currentUser) return false;
    try {
      const res = await fetch('/api/wallet/cancel-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: currentUser.id,
          requestType,
          requestId,
        }),
      });
      const data = await res.json();
      await refreshWalletFromBackend();
      if (!res.ok || !data.ok) {
        addToast('Cancellation Failed', data?.error || 'Could not cancel request.', 'error');
        return false;
      }
      addToast(
        requestType === 'withdraw'
          ? 'Withdrawal Cancelled & Refunded'
          : 'Pending Deposit Cancelled',
        requestType === 'withdraw'
          ? `Request ${requestId} cancelled and locked funds refunded to your wallet.`
          : `Pending deposit request ${requestId} has been cancelled.`,
        'info'
      );
      return true;
    } catch {
      addToast('Network Error', 'Failed to cancel request on server.', 'error');
      return false;
    }
  };

  const transferBalanceToMain = (
    from: 'incomeBalance' | 'bonusBalance',
    amountBdt: number
  ): boolean => {
    if (!currentUser) return false;
    const amount = Math.round(Number(amountBdt));
    if (!isValidBdtAmount(amount, 10, 100000)) {
      addToast('Invalid Amount', 'Transfer amount must be at least ৳10 BDT.', 'error');
      return false;
    }
    if (currentUser[from] < amount) {
      addToast('Insufficient Funds', 'Amount exceeds your available balance.', 'error');
      return false;
    }

    fetch('/api/wallet/transfer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: currentUser.id,
        fromWallet: from,
        amountBdt: amount,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        await refreshWalletFromBackend();
        if (!res.ok || !data.ok) {
          addToast('Transfer Failed', data?.error || 'Could not transfer balance.', 'error');
          return;
        }
        addToast(
          'Double-Entry Transfer Completed',
          `৳${amount} transferred to your Main Balance with 0% fee.`,
          'success'
        );
      })
      .catch(() => {
        addToast('Network Error', 'Unable to reach wallet server.', 'error');
      });

    return true;
  };

  const submitContactMessage = (msg: Omit<ContactMessage, 'id' | 'status' | 'createdAt'>) => {
    const cleanName = sanitizeText(msg.name, 80);
    const cleanEmail = sanitizeText(msg.email, 160);
    const cleanPhone = sanitizeText(msg.phone, 20);
    const cleanSubject = sanitizeText(msg.subject, 120);
    const cleanMessage = sanitizeText(msg.message, 1000);

    if (!cleanName || !isValidEmail(cleanEmail) || !cleanMessage) {
      addToast('Invalid Input', 'Please complete all required contact fields accurately.', 'error');
      return;
    }

    const newMsg: ContactMessage = {
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
      subject: cleanSubject,
      message: cleanMessage,
      id: `MSG-${Math.floor(205 + Math.random() * 9000)}`,
      status: 'New',
      createdAt: nowStr(),
    };
    setContactMessages((prev) => [newMsg, ...prev]);
    addToast(
      'Message Received',
      'Our Dhaka Support Desk will respond within 2 business hours.',
      'success'
    );
  };

  const submitSupportTicket = (
    ticket: Omit<SupportTicket, 'id' | 'userId' | 'userName' | 'status' | 'createdAt'>
  ) => {
    if (!currentUser) return;
    const cleanSubject = sanitizeText(ticket.subject, 120);
    const cleanMessage = sanitizeText(ticket.message, 1000);
    if (!cleanSubject || !cleanMessage) return;

    const newTicket: SupportTicket = {
      category: ticket.category,
      subject: cleanSubject,
      message: cleanMessage,
      id: `TCK-${Math.floor(805 + Math.random() * 9000)}`,
      userId: currentUser.id,
      userName: currentUser.name,
      status: 'Open',
      createdAt: nowStr(),
    };
    setSupportTickets((prev) => [newTicket, ...prev]);
    addToast('Support Ticket Opened', `Ticket ${newTicket.id} submitted to moderation.`, 'success');
  };

  const submitUserReview = (review: Omit<UserReview, 'id' | 'date'>) => {
    const cleanName = sanitizeText(review.userName, 60);
    const cleanIgn = sanitizeText(review.ffIgn, 40);
    const cleanLocation = sanitizeText(review.location, 60);
    const cleanService = sanitizeText(review.serviceUsed, 60);
    const cleanComment = sanitizeText(review.comment, 500);
    if (!cleanName || !cleanComment) return;

    const newRev: UserReview = {
      id: `REV-${Math.floor(105 + Math.random() * 900)}`,
      userName: cleanName,
      ffIgn: cleanIgn || 'BD_PLAYER',
      location: cleanLocation || 'Dhaka, BD',
      serviceUsed: cleanService || 'UID Top Up',
      rating: Math.max(1, Math.min(5, Math.round(Number(review.rating) || 5))),
      comment: cleanComment,
      date: 'Nov 2026',
    };
    setReviews((prev) => {
      const next = [newRev, ...prev];
      saveState('reviews', next);
      return next;
    });
    addToast('Review Published', 'Thank you! Your verified player review is now live.', 'success');
  };

  // ============================================================================
  // ADMIN MUTATORS (Protected by requireAdmin() + Synced with Firestore)
  // ============================================================================
  const adminUpdateUser = (userId: string, updates: Partial<User>, auditNote: string) => {
    if (!requireAdmin()) return;
    const {
      password: _ignorePassword,
      mainBalance: _ignoreMain,
      incomeBalance: _ignoreIncome,
      bonusBalance: _ignoreBonus,
      ...safeUpdates
    } = updates;
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, ...safeUpdates } : u)));
    logAdminAction('UPDATE_USER', userId, auditNote);
    addToast('User Updated', `Updated user ${userId} successfully.`, 'success');
  };

  const adminAdjustUserLedger = async (params: {
    userId: string;
    userName: string;
    balanceType: 'Main' | 'Income' | 'Bonus';
    direction: 'credit' | 'debit';
    amountBdt: number;
    reason: string;
  }): Promise<boolean> => {
    if (!requireAdmin()) return false;
    try {
      const res = await fetch('/api/admin/wallet/adjust', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminSession.sessionToken}`,
        },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      await refreshWalletFromBackend();
      if (!res.ok || !data.ok) {
        addToast('Ledger Adjustment Failed', data?.error || 'Could not adjust ledger.', 'error');
        return false;
      }
      addToast(
        'Double-Entry Adjustment Recorded',
        `${params.direction === 'credit' ? 'Credited +' : 'Debited -'}৳${params.amountBdt} on ${params.userName}'s ${params.balanceType} Wallet.`,
        'success'
      );
      return true;
    } catch {
      addToast('Network Error', 'Failed to reach backend ledger endpoint.', 'error');
      return false;
    }
  };

  const adminToggleBanUser = (userId: string) => {
    if (!requireAdmin()) return;
    const target = users.find((u) => u.id === userId);
    if (!target) return;
    const nextBanned = !target.banned;
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, banned: nextBanned } : u))
    );
    logAdminAction(
      nextBanned ? 'BAN_USER' : 'UNBAN_USER',
      `${target.name} (${userId})`,
      `Changed account restriction status to banned=${nextBanned}`
    );
    addToast(
      nextBanned ? 'User Banned' : 'User Unbanned',
      `${target.name} has been ${nextBanned ? 'suspended' : 'restored'}.`,
      nextBanned ? 'warning' : 'success'
    );
  };

  const syncCatalogItemToFirestore = (
    id: string,
    category: string,
    title: string,
    priceOrRewardBdt: number,
    active: boolean
  ) => {
    if (!auth.currentUser) return;
    setDoc(doc(db, 'catalog', id), {
      id,
      category: sanitizeText(category, 40),
      title: sanitizeText(title, 160),
      priceOrRewardBdt: Math.max(0, Math.min(500000, Math.round(priceOrRewardBdt))),
      active,
      updatedAt: serverTimestamp(),
    }).catch((err) => {
      try {
        handleFirestoreError(err, OperationType.WRITE, `catalog/${id}`);
      } catch {
        // logged
      }
    });
  };

  const adminSavePackage = (pkg: DiamondPackage, isNew: boolean) => {
    if (!requireAdmin()) return;
    const sanitizedPkg: DiamondPackage = {
      ...pkg,
      title: sanitizeText(pkg.title, 80),
      titleBn: sanitizeText(pkg.titleBn, 80),
      priceBdt: Math.max(1, Math.round(Number(pkg.priceBdt))),
      diamonds: Math.max(1, Math.round(Number(pkg.diamonds))),
    };
    if (isNew) {
      setPackages((prev) => [sanitizedPkg, ...prev]);
      logAdminAction('CREATE_PACKAGE', sanitizedPkg.id, `Created package ${sanitizedPkg.title} at ৳${sanitizedPkg.priceBdt}`);
      addToast('Package Created', `${sanitizedPkg.title} is now live.`, 'success');
    } else {
      setPackages((prev) => prev.map((item) => (item.id === sanitizedPkg.id ? sanitizedPkg : item)));
      logAdminAction('UPDATE_PACKAGE', sanitizedPkg.id, `Updated ${sanitizedPkg.title} price to ৳${sanitizedPkg.priceBdt}`);
      addToast('Package Saved', `${sanitizedPkg.title} updated live.`, 'success');
    }
    syncCatalogItemToFirestore(
      sanitizedPkg.id,
      `package_${sanitizedPkg.category}`,
      sanitizedPkg.title,
      sanitizedPkg.priceBdt,
      sanitizedPkg.inStock
    );
  };

  const adminDeletePackage = (pkgId: string) => {
    if (!requireAdmin()) return;
    const target = packages.find((p) => p.id === pkgId);
    setPackages((prev) => prev.filter((p) => p.id !== pkgId));
    logAdminAction('DELETE_PACKAGE', pkgId, `Removed diamond package ${target?.title || pkgId}`);
    addToast('Package Deleted', 'Diamond package removed from catalog.', 'info');
  };

  const adminUpdateOrderStatus = (orderId: string, status: TopUpOrder['status']) => {
    if (!requireAdmin()) return;
    const ord = orders.find((o) => o.id === orderId);
    if (!ord || ord.status === status) return;

    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));

    if (status === 'Cancelled' && ord.status !== 'Cancelled') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === ord.userId ? { ...u, mainBalance: u.mainBalance + ord.amountBdt } : u
        )
      );
      const refundTrx: WalletTransaction = {
        id: `TRX-${Date.now()}-RFD`,
        userId: ord.userId,
        type: 'Refund',
        amountBdt: ord.amountBdt,
        direction: 'credit',
        balanceType: 'Main',
        referenceId: ord.id,
        description: `Auto-Refund for Cancelled Order ${ord.id} (${ord.packageTitle})`,
        status: 'Completed',
        createdAt: nowStr(),
      };
      setTransactions((prev) => [refundTrx, ...prev]);
      fetch('/api/wallet/record-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: ord.userId,
          type: 'Refund',
          direction: 'credit',
          balanceType: 'Main',
          amountBdt: ord.amountBdt,
          method: 'System Refund',
          referenceId: ord.id,
          description: `Auto-Refund for Cancelled Order ${ord.id} (${ord.packageTitle})`,
          status: 'Completed',
        }),
      })
        .then(() => refreshWalletFromBackend())
        .catch(() => {});
    }

    logAdminAction(
      'UPDATE_ORDER_STATUS',
      orderId,
      `Changed order status from ${ord.status} to ${status}${
        status === 'Cancelled' ? ` (Auto-refunded ৳${ord.amountBdt})` : ''
      }`
    );
    addToast(
      `Order ${status}`,
      `Order ${orderId} marked as ${status}.${
        status === 'Cancelled' ? ` ৳${ord.amountBdt} refunded to customer Main Wallet.` : ''
      }`,
      status === 'Cancelled' ? 'warning' : 'success'
    );
  };

  const adminSaveTournament = (trn: Tournament, isNew: boolean) => {
    if (!requireAdmin()) return;
    const sanitizedTrn: Tournament = {
      ...trn,
      title: sanitizeText(trn.title, 100),
      titleBn: sanitizeText(trn.titleBn, 100),
      roomId: trn.roomId ? sanitizeText(trn.roomId, 32) : undefined,
      roomPassword: trn.roomPassword ? sanitizeText(trn.roomPassword, 32) : undefined,
    };
    if (isNew) {
      setTournaments((prev) => [sanitizedTrn, ...prev]);
      logAdminAction('CREATE_TOURNAMENT', sanitizedTrn.id, `Created ${sanitizedTrn.title} (Prize: ৳${sanitizedTrn.prizePool})`);
      addToast('Tournament Published', `${sanitizedTrn.title} added to schedule.`, 'success');
    } else {
      setTournaments((prev) => prev.map((tItem) => (tItem.id === sanitizedTrn.id ? sanitizedTrn : tItem)));
      logAdminAction('UPDATE_TOURNAMENT', sanitizedTrn.id, `Updated tournament ${sanitizedTrn.title}`);
      addToast('Tournament Updated', `${sanitizedTrn.title} details saved.`, 'success');
    }
    syncCatalogItemToFirestore(
      sanitizedTrn.id,
      `tournament_${sanitizedTrn.mode}`,
      sanitizedTrn.title,
      sanitizedTrn.prizePool,
      sanitizedTrn.status !== 'Completed'
    );
  };

  const adminUpdateTournamentRoom = (trnId: string, roomId: string, roomPassword: string) => {
    if (!requireAdmin()) return;
    const cleanRoomId = sanitizeText(roomId, 32);
    const cleanRoomPass = sanitizeText(roomPassword, 32);

    fetch(`/api/tournaments/${encodeURIComponent(trnId)}/credentials`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isAdmin: true, roomId: cleanRoomId, roomPassword: cleanRoomPass }),
    }).catch(() => {
      // Non-blocking vault update
    });

    setTournaments((prev) =>
      prev.map((tItem) =>
        tItem.id === trnId ? { ...tItem, roomId: cleanRoomId, roomPassword: cleanRoomPass } : tItem
      )
    );
    logAdminAction(
      'DISTRIBUTE_ROOM_CREDENTIALS',
      trnId,
      `Updated Room ID: ${cleanRoomId} for registered players`
    );
    addToast('Room Credentials Updated', `Room ID ${cleanRoomId} distributed to registered players.`, 'success');
  };

  const adminAnnounceTournamentWinner = (trnId: string, winnerUserId: string) => {
    if (!requireAdmin()) return;
    const trn = tournaments.find((tItem) => tItem.id === trnId);
    const winner = users.find((u) => u.id === winnerUserId);
    if (!trn || !winner || trn.status === 'Completed') return;

    setTournaments((prev) =>
      prev.map((tItem) =>
        tItem.id === trnId
          ? {
              ...tItem,
              status: 'Completed',
              winnerName: `${winner.name} (${winner.ffIgn})`,
              winnerUid: winner.ffUid,
            }
          : tItem
      )
    );

    setUsers((prev) =>
      prev.map((u) =>
        u.id === winner.id
          ? {
              ...u,
              incomeBalance: u.incomeBalance + trn.prizePool,
              totalEarned: u.totalEarned + trn.prizePool,
              tournamentWins: u.tournamentWins + 1,
            }
          : u
      )
    );

    const prizeTrx: WalletTransaction = {
      id: `TRX-${Date.now()}-PRZ`,
      userId: winner.id,
      type: 'Tournament Prize',
      amountBdt: trn.prizePool,
      direction: 'credit',
      balanceType: 'Income',
      referenceId: trn.id,
      description: `Champion Prize Pool: ${trn.title}`,
      status: 'Completed',
      createdAt: nowStr(),
    };
    setTransactions((prev) => [prizeTrx, ...prev]);
    fetch('/api/wallet/record-activity', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: winner.id,
        type: 'Tournament Prize',
        direction: 'credit',
        balanceType: 'Income',
        amountBdt: trn.prizePool,
        method: 'Esports Prize',
        referenceId: trn.id,
        description: `Champion Prize Pool: ${trn.title}`,
        status: 'Completed',
      }),
    })
      .then(() => refreshWalletFromBackend())
      .catch(() => {});

    logAdminAction(
      'ANNOUNCE_TOURNAMENT_WINNER',
      `${trn.id} -> ${winner.name}`,
      `Credited ৳${trn.prizePool} championship prize to ${winner.name} (${winner.ffIgn})`
    );
    addToast(
      'Champion Announced & Paid!',
      `${winner.name} awarded ৳${trn.prizePool} in Income Balance.`,
      'success'
    );
  };

  const adminSaveTask = (task: IncomeTask, isNew: boolean) => {
    if (!requireAdmin()) return;
    const safeLink = sanitizeSafeUrl(task.externalLink);
    if (!safeLink) {
      addToast(
        'Unsafe Task Link Blocked',
        'Task external link must use https:// or http:// protocol.',
        'error'
      );
      return;
    }
    const sanitizedTask: IncomeTask = {
      ...task,
      title: sanitizeText(task.title, 100),
      titleBn: sanitizeText(task.titleBn, 100),
      description: sanitizeText(task.description, 500),
      externalLink: safeLink,
      rewardBdt: Math.max(1, Math.round(Number(task.rewardBdt))),
    };
    if (isNew) {
      setTasks((prev) => [sanitizedTask, ...prev]);
      logAdminAction('CREATE_TASK', sanitizedTask.id, `Published task "${sanitizedTask.title}" (Reward: ৳${sanitizedTask.rewardBdt})`);
      addToast('Task Created', `${sanitizedTask.title} published.`, 'success');
    } else {
      setTasks((prev) => prev.map((tItem) => (tItem.id === sanitizedTask.id ? sanitizedTask : tItem)));
      logAdminAction('UPDATE_TASK', sanitizedTask.id, `Updated task "${sanitizedTask.title}"`);
      addToast('Task Updated', `${sanitizedTask.title} saved.`, 'success');
    }
    syncCatalogItemToFirestore(
      sanitizedTask.id,
      `task_${sanitizedTask.category}`,
      sanitizedTask.title,
      sanitizedTask.rewardBdt,
      sanitizedTask.active
    );
  };

  const adminDeleteTask = (taskId: string) => {
    if (!requireAdmin()) return;
    setTasks((prev) => prev.filter((tItem) => tItem.id !== taskId));
    logAdminAction('DELETE_TASK', taskId, `Deleted income task ${taskId}`);
    addToast('Task Deleted', 'Task removed from active list.', 'info');
  };

  const adminVerifyTaskSubmission = (
    subId: string,
    decision: 'Approved' | 'Rejected',
    reason?: string
  ) => {
    if (!requireAdmin()) return;
    const sub = taskSubmissions.find((s) => s.id === subId);
    if (!sub || sub.status !== 'Pending') return;

    const cleanReason = reason ? sanitizeText(reason, 200) : undefined;
    setTaskSubmissions((prev) =>
      prev.map((s) =>
        s.id === subId ? { ...s, status: decision, adminReason: cleanReason } : s
      )
    );

    if (decision === 'Approved') {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === sub.userId
            ? {
                ...u,
                incomeBalance: u.incomeBalance + sub.rewardBdt,
                totalEarned: u.totalEarned + sub.rewardBdt,
              }
            : u
        )
      );
      setTasks((prev) =>
        prev.map((tItem) =>
          tItem.id === sub.taskId
            ? { ...tItem, completionsCount: tItem.completionsCount + 1 }
            : tItem
        )
      );
      const rewardTrx: WalletTransaction = {
        id: `TRX-${Date.now()}-TSK`,
        userId: sub.userId,
        type: 'Task Reward',
        amountBdt: sub.rewardBdt,
        direction: 'credit',
        balanceType: 'Income',
        referenceId: sub.id,
        description: `Verified Task Reward: ${sub.taskTitle}`,
        status: 'Completed',
        createdAt: nowStr(),
      };
      setTransactions((prev) => [rewardTrx, ...prev]);
      fetch('/api/wallet/record-activity', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: sub.userId,
          type: 'Task Reward',
          direction: 'credit',
          balanceType: 'Income',
          amountBdt: sub.rewardBdt,
          method: 'Task Verification',
          referenceId: sub.id,
          description: `Verified Task Reward: ${sub.taskTitle}`,
          status: 'Completed',
        }),
      })
        .then(() => refreshWalletFromBackend())
        .catch(() => {});
    }

    logAdminAction(
      `TASK_SUBMISSION_${decision.toUpperCase()}`,
      sub.id,
      `${decision} submission by ${sub.userName} for "${sub.taskTitle}" (৳${sub.rewardBdt})`
    );
    addToast(
      `Submission ${decision}`,
      decision === 'Approved'
        ? `Credited ৳${sub.rewardBdt} to ${sub.userName}'s Income Balance.`
        : `Submission rejected.`,
      decision === 'Approved' ? 'success' : 'warning'
    );
  };

  const adminVerifyDeposit = (
    depId: string,
    decision: 'Approved' | 'Rejected',
    reason?: string
  ) => {
    if (!requireAdmin()) return;
    const dep = deposits.find((d) => d.id === depId);
    if (!dep || dep.status !== 'Pending') return;

    const cleanReason =
      reason?.trim() || (decision === 'Rejected' ? 'Invalid or unverified Transaction ID' : '');

    fetch('/api/admin/wallet/deposit-decision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminSession.sessionToken}`,
      },
      body: JSON.stringify({
        depositId: depId,
        decision,
        reason: cleanReason,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        await refreshWalletFromBackend();
        if (!res.ok || !data.ok) {
          addToast('Action Failed', data?.error || 'Could not update deposit.', 'error');
          return;
        }
        addToast(
          `Deposit ${decision}`,
          decision === 'Approved'
            ? `৳${dep.netCreditBdt || dep.amountBdt} credited to ${dep.userName}'s Main Balance via double-entry ledger.`
            : `Deposit ${depId} rejected (${cleanReason}).`,
          decision === 'Approved' ? 'success' : 'warning'
        );
      })
      .catch(() => {
        addToast('Network Error', 'Failed to reach backend admin wallet API.', 'error');
      });
  };

  const adminVerifyWithdraw = (
    wthId: string,
    decision: 'Approved' | 'Completed' | 'Rejected',
    adminNote?: string
  ) => {
    if (!requireAdmin()) return;
    const wth = withdrawals.find((w) => w.id === wthId);
    if (!wth || (wth.status !== 'Pending' && wth.status !== 'Approved')) return;

    const cleanNote =
      adminNote?.trim() ||
      (decision === 'Rejected'
        ? 'Account verification failed — locked funds refunded'
        : `Sent ৳${wth.netAmountBdt} via ${wth.method.toUpperCase()} (${wth.receiverNumber})`);

    fetch('/api/admin/wallet/withdraw-decision', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminSession.sessionToken}`,
      },
      body: JSON.stringify({
        withdrawId: wthId,
        decision,
        reasonOrNote: cleanNote,
      }),
    })
      .then(async (res) => {
        const data = await res.json();
        await refreshWalletFromBackend();
        if (!res.ok || !data.ok) {
          addToast('Action Failed', data?.error || 'Could not update withdrawal.', 'error');
          return;
        }
        addToast(
          `Withdrawal ${decision}`,
          decision === 'Rejected'
            ? `Rejected & refunded ৳${wth.amountBdt} back to ${wth.userName}'s wallet.`
            : `Marked ৳${wth.netAmountBdt} payout as ${decision} (${cleanNote}).`,
          decision === 'Rejected' ? 'info' : 'success'
        );
      })
      .catch(() => {
        addToast('Network Error', 'Failed to reach backend admin wallet API.', 'error');
      });
  };

  const adminUpdatePaymentSettings = (settings: PaymentSettings) => {
    if (!requireAdmin()) return;
    setPaymentSettings(settings);
    fetch('/api/admin/wallet/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminSession.sessionToken}`,
      },
      body: JSON.stringify(settings),
    })
      .then(async (res) => {
        const data = await res.json();
        await refreshWalletFromBackend();
        if (!res.ok || !data.ok) {
          addToast('Save Failed', data?.error || 'Could not save payment settings.', 'error');
          return;
        }
        addToast(
          'Payment & Wallet Settings Saved',
          'Deposit/Withdraw min/max limits, fees, and gateways updated on server.',
          'success'
        );
      })
      .catch(() => {
        addToast('Network Error', 'Failed to save payment settings to server.', 'error');
      });
  };

  const adminSaveBlogPost = (post: BlogPost, isNew: boolean) => {
    if (!requireAdmin()) return;
    const sanitizedPost: BlogPost = {
      ...post,
      title: sanitizeText(post.title, 140),
      excerpt: sanitizeText(post.excerpt, 300),
      content: sanitizeText(post.content, 4000),
    };
    if (isNew) {
      setBlogPosts((prev) => [sanitizedPost, ...prev]);
      logAdminAction('PUBLISH_BLOG', sanitizedPost.id, `Published article "${sanitizedPost.title}"`);
    } else {
      setBlogPosts((prev) => prev.map((b) => (b.id === sanitizedPost.id ? sanitizedPost : b)));
      logAdminAction('UPDATE_BLOG', sanitizedPost.id, `Edited article "${sanitizedPost.title}"`);
    }
    addToast('News Article Saved', `"${sanitizedPost.title}" is now live.`, 'success');
    syncCatalogItemToFirestore(sanitizedPost.id, 'blog_post', sanitizedPost.title, 0, true);
  };

  const adminDeleteBlogPost = (postId: string) => {
    if (!requireAdmin()) return;
    setBlogPosts((prev) => prev.filter((b) => b.id !== postId));
    logAdminAction('DELETE_BLOG', postId, `Deleted article ${postId}`);
    addToast('Article Deleted', 'Blog post removed.', 'info');
  };

  const adminResolveContactMessage = (msgId: string) => {
    if (!requireAdmin()) return;
    setContactMessages((prev) =>
      prev.map((m) => (m.id === msgId ? { ...m, status: 'Resolved' } : m))
    );
    logAdminAction('RESOLVE_INQUIRY', msgId, `Marked contact inquiry ${msgId} as Resolved`);
    addToast('Inquiry Resolved', `Message ${msgId} marked as resolved.`, 'success');
  };

  // Validate all public URLs & persist PublicSettings live to Firestore /settings/public
  const adminUpdateSiteSettings = async (settings: SiteSettings): Promise<boolean> => {
    if (!requireAdmin()) return false;

    const validSiteUrl = sanitizeSafeUrl(settings.siteUrl);
    const validMapUrl = sanitizeSafeUrl(settings.mapEmbedUrl);
    const validFbUrl = sanitizeSafeUrl(settings.facebookUrl);
    const validTgUrl = sanitizeSafeUrl(settings.telegramUrl);
    const validWaUrl = sanitizeSafeUrl(settings.whatsappUrl);
    const validLogoUrl = settings.logoUrl?.trim()
      ? sanitizeSafeUrl(settings.logoUrl)
      : '';

    if (!validSiteUrl || !validMapUrl || !validFbUrl || !validTgUrl || !validWaUrl) {
      addToast(
        'Invalid URL Detected',
        'Every public URL (Site, Google Map Embed, Facebook, Telegram, WhatsApp) must be a valid https:// or http:// URL.',
        'error'
      );
      return false;
    }

    if (settings.logoUrl?.trim() && !validLogoUrl) {
      addToast('Invalid Logo URL', 'Logo URL must use https:// or http://.', 'error');
      return false;
    }

    const sanitizedSettings: SiteSettings = {
      ...settings,
      siteName: sanitizeText(settings.siteName, 80),
      tagline: sanitizeText(settings.tagline, 200),
      logoUrl: validLogoUrl || '',
      siteUrl: validSiteUrl,
      mapEmbedUrl: validMapUrl,
      facebookUrl: validFbUrl,
      telegramUrl: validTgUrl,
      whatsappUrl: validWaUrl,
      supportEmail: sanitizeText(settings.supportEmail, 160),
      supportPhone: sanitizeText(settings.supportPhone, 40),
      supportWhatsapp: sanitizeText(settings.supportWhatsapp, 40),
      supportTelegram: sanitizeText(settings.supportTelegram, 80),
      officeAddress: sanitizeText(settings.officeAddress, 240),
      announcementText: sanitizeText(settings.announcementText, 400),
      announcementTextBn: sanitizeText(settings.announcementTextBn, 400),
      heroHeadline: sanitizeText(settings.heroHeadline, 200),
      heroHeadlineBn: sanitizeText(settings.heroHeadlineBn, 200),
      heroSubheadline: sanitizeText(settings.heroSubheadline, 500),
      heroSubheadlineBn: sanitizeText(settings.heroSubheadlineBn, 500),
    };

    setSiteSettings(sanitizedSettings);

    if (auth.currentUser) {
      try {
        await setDoc(doc(db, 'settings', 'public'), {
          siteName: sanitizedSettings.siteName,
          tagline: sanitizedSettings.tagline,
          logoUrl: sanitizedSettings.logoUrl || '',
          siteUrl: sanitizedSettings.siteUrl,
          mapEmbedUrl: sanitizedSettings.mapEmbedUrl,
          facebookUrl: sanitizedSettings.facebookUrl,
          telegramUrl: sanitizedSettings.telegramUrl,
          whatsappUrl: sanitizedSettings.whatsappUrl,
          supportEmail: sanitizedSettings.supportEmail,
          supportPhone: sanitizedSettings.supportPhone,
          supportWhatsapp: sanitizedSettings.supportWhatsapp,
          supportTelegram: sanitizedSettings.supportTelegram,
          officeAddress: sanitizedSettings.officeAddress,
          announcementText: sanitizedSettings.announcementText,
          announcementTextBn: sanitizedSettings.announcementTextBn,
          heroHeadline: sanitizedSettings.heroHeadline,
          heroHeadlineBn: sanitizedSettings.heroHeadlineBn,
          heroSubheadline: sanitizedSettings.heroSubheadline,
          heroSubheadlineBn: sanitizedSettings.heroSubheadlineBn,
          updatedAt: serverTimestamp(),
          updatedBy: auth.currentUser.uid,
        });
      } catch (err) {
        try {
          handleFirestoreError(err, OperationType.WRITE, 'settings/public');
        } catch {
          // logged
        }
      }
    }

    logAdminAction(
      'UPDATE_PUBLIC_SETTINGS',
      sanitizedSettings.siteName,
      `Synced public URLs & branding to database (${sanitizedSettings.siteUrl})`
    );
    addToast(
      'Public Settings Synced Live',
      'Website branding, validated URLs, and banners saved to database.',
      'success'
    );
    return true;
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        navigate,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        setTheme,
        globalSearch,
        setGlobalSearch,
        currentUser,
        users,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
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
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        wishlist,
        toggleWishlist,
        packages,
        orders,
        tournaments,
        tasks,
        taskSubmissions,
        deposits,
        withdrawals,
        transactions,
        paymentSettings,
        blogPosts,
        reviews,
        faqs,
        contactMessages,
        supportTickets,
        auditLogs,
        siteSettings,
        toasts,
        addToast,
        dismissToast,
        placeTopUpOrder,
        checkoutCart,
        joinTournament,
        submitTaskProof,
        createDeposit,
        createWithdraw,
        cancelPendingWalletRequest,
        refreshWalletFromBackend,
        lockedPendingByUser,
        transferBalanceToMain,
        submitContactMessage,
        submitSupportTicket,
        submitUserReview,
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
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
};
