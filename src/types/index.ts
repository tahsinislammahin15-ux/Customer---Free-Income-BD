export type PageView =
  | 'home'
  | 'about'
  | 'topup'
  | 'offers'
  | 'tournaments'
  | 'income'
  | 'leaderboard'
  | 'blog'
  | 'reviews'
  | 'account'
  | 'profile'
  | 'wallet'
  | 'deposit'
  | 'withdraw'
  | 'transactions'
  | 'contact'
  | 'faq'
  | 'login'
  | 'register'
  | 'privacy'
  | 'terms'
  | 'admin'
  | 'notfound';

export type Language = 'en' | 'bn';
export type ThemeMode = 'dark' | 'light';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin';
  ffUid: string;
  ffIgn: string;
  verified: boolean;
  banned: boolean;
  mainBalance: number;
  incomeBalance: number;
  bonusBalance: number;
  referralCode: string;
  referredBy?: string;
  referralCount: number;
  totalEarned: number;
  tournamentWins: number;
  joinedAt: string;
}

export interface DiamondPackage {
  id: string;
  title: string;
  titleBn: string;
  diamonds: number;
  priceBdt: number;
  originalPriceBdt?: number;
  category: 'uid' | 'unipin' | 'membership' | 'special';
  deliverySpeed: string;
  popular?: boolean;
  discountBadge?: string;
  inStock: boolean;
}

export interface CartItem {
  pkg: DiamondPackage;
  quantity: number;
  playerUid: string;
  playerIgn?: string;
}

export interface TopUpOrder {
  id: string;
  userId: string;
  userName: string;
  packageId: string;
  packageTitle: string;
  diamonds: number;
  amountBdt: number;
  playerUid: string;
  playerIgn: string;
  topUpType: 'uid' | 'unipin';
  voucherPin?: string;
  paymentMethod: 'wallet' | PaymentGatewayName;
  transactionId?: string;
  status: 'Pending' | 'Processing' | 'Completed' | 'Cancelled';
  createdAt: string;
}

export interface TournamentPlayer {
  userId: string;
  userName: string;
  ffIgn: string;
  ffUid: string;
  teamName?: string;
  registeredAt: string;
}

export interface Tournament {
  id: string;
  title: string;
  titleBn: string;
  mode: 'Solo' | 'Duo' | 'Squad' | 'Clash Squad';
  type: 'Free' | 'Paid';
  map: 'Bermuda' | 'Purgatory' | 'Kalahari' | 'Alpine' | 'Nexterra';
  entryFee: number;
  prizePool: number;
  perKillPrize: number;
  totalSlots: number;
  filledSlots: number;
  startTime: string;
  status: 'Upcoming' | 'Live' | 'Completed';
  roomId?: string;
  roomPassword?: string;
  rules: string[];
  registeredPlayers: TournamentPlayer[];
  winnerName?: string;
  winnerUid?: string;
  image: string;
}

export interface IncomeTask {
  id: string;
  title: string;
  titleBn: string;
  category: 'Task Complete' | 'Special Tasks' | 'Sponsored Content' | 'Bonus Rewards';
  description: string;
  requirements: string[];
  externalLink: string;
  rewardBdt: number;
  estimatedTime: string;
  image: string;
  active: boolean;
  completionsCount: number;
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  userId: string;
  userName: string;
  rewardBdt: number;
  proofUrl: string;
  proofNote: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  adminReason?: string;
  submittedAt: string;
}

export type PaymentGatewayName = 'bkash' | 'nagad' | 'rocket' | 'upay' | 'card';

export type WalletStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed' | 'Failed';

export interface DepositRequest {
  id: string;
  userId: string;
  userName: string;
  method: PaymentGatewayName;
  channel: 'Manual' | 'Instant Gateway';
  senderNumber: string;
  transactionId: string;
  amountBdt: number;
  feeBdt?: number;
  netCreditBdt?: number;
  screenshotUrl?: string;
  gatewayReference?: string;
  adminReason?: string;
  status: WalletStatus;
  createdAt: string;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userName: string;
  method: PaymentGatewayName;
  walletSource: 'incomeBalance' | 'mainBalance';
  receiverNumber: string;
  amountBdt: number;
  feeBdt: number;
  netAmountBdt: number;
  status: WalletStatus;
  flaggedForReview?: boolean;
  flagReason?: string;
  adminNote?: string;
  adminReason?: string;
  createdAt: string;
}

export interface WalletTransaction {
  id: string;
  userId: string;
  type:
    | 'Deposit'
    | 'Withdraw'
    | 'TopUp Order'
    | 'Tournament Entry'
    | 'Tournament Prize'
    | 'Task Reward'
    | 'Referral Bonus'
    | 'Balance Transfer'
    | 'Refund';
  amountBdt: number;
  direction: 'credit' | 'debit';
  balanceType: 'Main' | 'Income' | 'Bonus';
  method?: string;
  referenceId: string;
  description: string;
  status: WalletStatus;
  createdAt: string;
}

export interface PaymentGatewayConfig {
  id: PaymentGatewayName;
  name: string;
  active: boolean;
  merchantNumber: string;
  personalNumber: string;
  instructions: string;
  color: string;
}

export interface PaymentSettings {
  gateways: PaymentGatewayConfig[];
  minDepositBdt: number;
  maxDepositBdt: number;
  depositFeePercent: number;
  minWithdrawBdt: number;
  maxWithdrawBdt: number;
  withdrawFeePercent: number;
  processingTimeText: string;
  manualReviewThresholdBdt: number;
  referralBonusBdt: number;
  instantGatewayEnabled: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  readTime: string;
  author: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'New' | 'Resolved';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  category: 'Top Up Issue' | 'Tournament Room' | 'Task Verification' | 'Deposit / Withdraw';
  subject: string;
  message: string;
  status: 'Open' | 'Resolved';
  createdAt: string;
}

export interface UserReview {
  id: string;
  userName: string;
  ffIgn: string;
  location: string;
  serviceUsed: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FAQItem {
  id: string;
  category: 'Top Up' | 'Tournaments' | 'Income Tasks' | 'Wallet & Payments';
  question: string;
  answer: string;
}

export interface AuditLogEntry {
  id: string;
  adminName: string;
  action: string;
  target: string;
  details: string;
  timestamp: string;
}

export interface SiteSettings {
  siteName: string;
  tagline: string;
  logoUrl?: string;
  siteUrl: string;
  mapEmbedUrl: string;
  facebookUrl: string;
  telegramUrl: string;
  whatsappUrl: string;
  announcementText: string;
  announcementTextBn: string;
  heroHeadline: string;
  heroHeadlineBn: string;
  heroSubheadline: string;
  heroSubheadlineBn: string;
  supportEmail: string;
  supportPhone: string;
  supportWhatsapp: string;
  supportTelegram: string;
  officeAddress: string;
  defaultLanguage: Language;
  defaultTheme: ThemeMode;
}

export interface MaskedSecretItem {
  configured: boolean;
  maskedValue: string;
  updatedAt: string;
}

export interface MaskedSecretsSummary {
  paymentGatewayApiKey: MaskedSecretItem;
  unipinVoucherApiSecret: MaskedSecretItem;
}

export interface AdminSessionState {
  authenticated: boolean;
  uid: string;
  email: string;
  username: string;
  sessionToken: string;
  expiresAt: number;
  mustChangePassword: boolean;
  bootstrapRequired: boolean;
}

export interface ToastNotification {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

