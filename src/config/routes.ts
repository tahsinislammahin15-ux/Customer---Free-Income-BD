import { PageView } from '../types';

export interface RouteMeta {
  page: PageView;
  path: string;
  label: string;
  labelBn: string;
  category: string;
  seoTitle: string;
  seoDescription: string;
  schemaType: 'WebSite' | 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage' | 'Blog';
}

export const ROUTE_CONFIG: Record<PageView, RouteMeta> = {
  home: {
    page: 'home',
    path: '/',
    label: 'Home',
    labelBn: 'হোম',
    category: 'Platform Hub',
    seoTitle: 'Free Income BD – Free Fire Diamond Top Up, Esports & Rewards',
    seoDescription:
      'Bangladesh’s unified Free Fire UID & UniPin Diamond Top Up store, moderated custom room esports tournaments, and compliant online task rewards platform.',
    schemaType: 'WebSite',
  },
  about: {
    page: 'about',
    path: '/about',
    label: 'About Us',
    labelBn: 'আমাদের সম্পর্কে',
    category: 'Company & Charter',
    seoTitle: 'About Free Income BD – Dhaka Esports & Fintech Architecture',
    seoDescription:
      'Learn how Free Income BD engineered Bangladesh’s zero-password Free Fire UID top-up desk, referee-supervised custom rooms, and transparent BDT wallet.',
    schemaType: 'AboutPage',
  },
  topup: {
    page: 'topup',
    path: '/topup',
    label: 'Diamond Top Up',
    labelBn: 'ডায়মন্ড টপ আপ',
    category: 'Gaming Store',
    seoTitle: 'Free Fire UID & UniPin Diamond Top Up Bangladesh – Free Income BD',
    seoDescription:
      'Instant 30-second Free Fire Bangladesh Server UID Diamond Top Up, Garena UniPin vouchers, custom diamond calculator, and live order tracking.',
    schemaType: 'CollectionPage',
  },
  offers: {
    page: 'offers',
    path: '/offers',
    label: 'Special Offers',
    labelBn: 'স্পেশাল অফার',
    category: 'Gaming Store',
    seoTitle: 'VIP Weekly & Monthly Passes & Diamond Bundles – Free Income BD',
    seoDescription:
      'Compare Free Fire Weekly and Monthly VIP memberships, high-volume guild diamond bundles, and discounted promotional packages in Bangladesh.',
    schemaType: 'CollectionPage',
  },
  tournaments: {
    page: 'tournaments',
    path: '/tournaments',
    label: 'Tournaments',
    labelBn: 'টুর্নামেন্ট',
    category: 'Esports Arena',
    seoTitle: 'Free Fire Bangladesh Custom Room Tournaments – Free Income BD',
    seoDescription:
      'Register for referee-supervised Solo, Duo, Squad, and Clash Squad 4v4 Free Fire tournaments in Bangladesh with automatic Room ID unlock and BDT prizes.',
    schemaType: 'CollectionPage',
  },
  income: {
    page: 'income',
    path: '/income',
    label: 'Free Income Tasks',
    labelBn: 'ফ্রি ইনকাম টাস্ক',
    category: 'Rewards & Tasks',
    seoTitle: 'Verified Online Micro-Tasks & Referral Rewards – Free Income BD',
    seoDescription:
      'Complete compliant digital tasks, ISP latency surveys, and verified player referrals in Bangladesh to earn withdrawable BDT in your Income Wallet.',
    schemaType: 'CollectionPage',
  },
  leaderboard: {
    page: 'leaderboard',
    path: '/leaderboard',
    label: 'Leaderboard',
    labelBn: 'লিডারবোর্ড',
    category: 'Esports Arena',
    seoTitle: 'Bangladesh Hall of Fame & Esports Standings – Free Income BD',
    seoDescription:
      'Live rankings of top Bangladeshi Free Fire tournament champions, verified task earners, and community referrers on Free Income BD.',
    schemaType: 'WebPage',
  },
  blog: {
    page: 'blog',
    path: '/blog',
    label: 'Blog & News',
    labelBn: 'ব্লগ ও নিউজ',
    category: 'Editorial & Guides',
    seoTitle: 'Free Fire Patch Notes, Esports Meta & UID Safety Blog – Free Income BD',
    seoDescription:
      'Read official OB patch breakdowns, Clash Squad weapon meta guides, and account security advisories from the Free Income BD editorial desk.',
    schemaType: 'Blog',
  },
  reviews: {
    page: 'reviews',
    path: '/reviews',
    label: 'Player Reviews',
    labelBn: 'প্লেয়ার রিভিউ',
    category: 'Community Proof',
    seoTitle: 'Verified Bangladeshi Player Reviews & Ratings – Free Income BD',
    seoDescription:
      'Explore verified ratings and testimonials from Free Fire players across Dhaka, Chattogram, Sylhet, and Rajshahi using Free Income BD.',
    schemaType: 'WebPage',
  },
  faq: {
    page: 'faq',
    path: '/faq',
    label: 'FAQ',
    labelBn: 'সাধারণ জিজ্ঞাসা',
    category: 'Help Center',
    seoTitle: 'Frequently Asked Questions (UID Top Up, Rooms & Payouts) – Free Income BD',
    seoDescription:
      'Find instant answers on Free Fire UID delivery times, custom tournament Room IDs, compliant task proof verification, and bKash/Nagad withdrawals.',
    schemaType: 'FAQPage',
  },
  contact: {
    page: 'contact',
    path: '/contact',
    label: 'Contact Us',
    labelBn: 'যোগাযোগ',
    category: 'Help Center',
    seoTitle: 'Contact Dhaka Support Desk (Banani, Dhaka-1213) – Free Income BD',
    seoDescription:
      'Reach the Free Income BD Banani Dhaka operations desk via WhatsApp, Telegram, email, or direct support ticket for order and tournament assistance.',
    schemaType: 'ContactPage',
  },
  account: {
    page: 'account',
    path: '/account',
    label: 'My Account',
    labelBn: 'আমার অ্যাকাউন্ট',
    category: 'Player Workspace',
    seoTitle: 'My Player Dashboard & Unlocked Room IDs – Free Income BD',
    seoDescription:
      'Manage your unified Free Income BD player dashboard, unlocked tournament Room IDs, recent diamond top-up orders, and priority support tickets.',
    schemaType: 'WebPage',
  },
  profile: {
    page: 'profile',
    path: '/profile',
    label: 'User Profile',
    labelBn: 'প্রোফাইল ও UID',
    category: 'Player Workspace',
    seoTitle: 'Player Profile & Free Fire UID Binding – Free Income BD',
    seoDescription:
      'Bind your Bangladesh Server Free Fire numeric UID and In-Game Name (IGN), update your mobile banking phone number, and manage account security.',
    schemaType: 'WebPage',
  },
  wallet: {
    page: 'wallet',
    path: '/wallet',
    label: 'Fintech Wallet',
    labelBn: 'ফিনটেক ওয়ালেট',
    category: 'Fintech Wallet',
    seoTitle: 'Triple-Balance BDT Wallet (Main, Income & Bonus) – Free Income BD',
    seoDescription:
      'View your Main, Income, and Bonus BDT balances and perform instant 0%-fee internal transfers to fund Free Fire Diamond purchases.',
    schemaType: 'WebPage',
  },
  deposit: {
    page: 'deposit',
    path: '/deposit',
    label: 'Deposit BDT',
    labelBn: 'ডিপোজিট করুন',
    category: 'Fintech Wallet',
    seoTitle: 'Deposit BDT via bKash, Nagad, Rocket & Upay – Free Income BD',
    seoDescription:
      'Add funds to your Free Income BD Main Wallet using manual TrxID verification or instant gateway checkout across Bangladeshi mobile banking channels.',
    schemaType: 'WebPage',
  },
  withdraw: {
    page: 'withdraw',
    path: '/withdraw',
    label: 'Withdraw BDT',
    labelBn: 'উইথড্র করুন',
    category: 'Fintech Wallet',
    seoTitle: 'Withdraw Earnings to bKash, Nagad, Rocket & Upay – Free Income BD',
    seoDescription:
      'Request fast BDT payouts from your verified Income Balance directly to your personal bKash, Nagad, Rocket, or Upay account.',
    schemaType: 'WebPage',
  },
  transactions: {
    page: 'transactions',
    path: '/transactions',
    label: 'Transactions',
    labelBn: 'লেনদেনের ইতিহাস',
    category: 'Fintech Wallet',
    seoTitle: 'Unified Financial Transaction Ledger – Free Income BD',
    seoDescription:
      'Inspect your complete credit and debit audit trail across deposits, withdrawals, diamond orders, tournament entries, prizes, and task rewards.',
    schemaType: 'WebPage',
  },
  login: {
    page: 'login',
    path: '/login',
    label: 'Sign In',
    labelBn: 'লগইন',
    category: 'Authentication',
    seoTitle: 'Player Sign In – Free Income BD',
    seoDescription:
      'Sign in to your Free Income BD account to access instant UID Diamond Top Ups, tournament Room IDs, and your BDT Fintech Wallet.',
    schemaType: 'WebPage',
  },
  register: {
    page: 'register',
    path: '/register',
    label: 'Register',
    labelBn: 'রেজিস্টার',
    category: 'Authentication',
    seoTitle: 'Create Player Account & Claim Welcome Bonus – Free Income BD',
    seoDescription:
      'Register your Free Fire Bangladesh UID on Free Income BD to receive a ৳20 Welcome Bonus Balance and ৳15 referral starter reward.',
    schemaType: 'WebPage',
  },
  privacy: {
    page: 'privacy',
    path: '/privacy',
    label: 'Privacy Policy',
    labelBn: 'প্রাইভেসি পলিসি',
    category: 'Legal & Compliance',
    seoTitle: 'Privacy Policy & Zero Game-Password Charter – Free Income BD',
    seoDescription:
      'Read our data protection policy covering zero game-password collection, mobile banking TrxID security, and task proof verification privacy.',
    schemaType: 'WebPage',
  },
  terms: {
    page: 'terms',
    path: '/terms',
    label: 'Terms & Conditions',
    labelBn: 'শর্তাবলী',
    category: 'Legal & Compliance',
    seoTitle: 'Terms & Conditions, Esports Fair-Play & Refund Policy – Free Income BD',
    seoDescription:
      'Review official terms for UID Diamond Top Up refunds, anti-cheat custom room rules, compliant task verification, and BDT withdrawals.',
    schemaType: 'WebPage',
  },
  admin: {
    page: 'admin',
    path: '/admin',
    label: 'Admin Console',
    labelBn: 'অ্যাডমিন কনসোল',
    category: 'Administration',
    seoTitle: 'Production Admin Console (RBAC Protected) – Free Income BD',
    seoDescription:
      'Authorized administrator portal for managing users, diamond packages, custom room credentials, task proofs, live Firestore settings, and server secrets.',
    schemaType: 'WebPage',
  },
  notfound: {
    page: 'notfound',
    path: '/404',
    label: '404 Not Found',
    labelBn: 'পেজ পাওয়া যায়নি',
    category: 'System Error',
    seoTitle: '404 Page Not Found – Free Income BD',
    seoDescription:
      'The requested page URL could not be found on Free Income BD. Return to the Home Hub, Diamond Top Up Store, or Esports Tournament Lobby.',
    schemaType: 'WebPage',
  },
};

export const PATH_TO_PAGE: Record<string, PageView> = Object.values(ROUTE_CONFIG).reduce(
  (acc, item) => {
    acc[item.path.toLowerCase()] = item.page;
    return acc;
  },
  {} as Record<string, PageView>
);

export function resolvePageFromPath(pathname: string): PageView {
  const normalized = pathname === '/' ? '/' : pathname.replace(/\/+$/, '').toLowerCase();
  return PATH_TO_PAGE[normalized] || 'notfound';
}

export function getPathForPage(page: PageView): string {
  return ROUTE_CONFIG[page]?.path || '/';
}
