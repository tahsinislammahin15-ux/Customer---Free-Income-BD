import {
  AuditLogEntry,
  BlogPost,
  ContactMessage,
  DepositRequest,
  DiamondPackage,
  FAQItem,
  IncomeTask,
  PaymentSettings,
  SiteSettings,
  SupportTicket,
  TaskSubmission,
  TopUpOrder,
  Tournament,
  User,
  UserReview,
  WalletTransaction,
  WithdrawRequest,
} from '../types';

export const HERO_BANNER_IMAGE = new URL(
  '../assets/images/hero_esports_arena_1794756547825.jpg',
  import.meta.url
).href;
export const TOURNAMENT_IMAGE = new URL(
  '../assets/images/tournament_clash_squad_1794756548699.jpg',
  import.meta.url
).href;
export const DIAMOND_IMAGE = new URL(
  '../assets/images/diamond_bundle_vault_1794756549175.jpg',
  import.meta.url
).href;
export const TASK_IMAGE = new URL(
  '../assets/images/task_reward_campaign_1794756550298.jpg',
  import.meta.url
).href;

export const initialSiteSettings: SiteSettings = {
  siteName: 'H41FFTOPUP',
  tagline: 'Bangladesh’s #1 Instant Free Fire UID Top Up, Weekly Pass & Esports Storefront',
  logoUrl: '',
  siteUrl: 'https://h41fftopup.com',
  mapEmbedUrl: 'https://www.google.com/maps?q=Banani,+Dhaka+1213,+Bangladesh&output=embed',
  facebookUrl: 'https://facebook.com',
  telegramUrl: 'https://telegram.org',
  whatsappUrl: 'https://whatsapp.com',
  announcementText:
    'H41FFTOPUP Express UID Delivery in 30 Seconds · Weekly & Monthly Membership Flash Sale Live · bKash & Nagad Automated Checkout Active 24/7',
  announcementTextBn:
    'H41FFTOPUP-এ ৩০ সেকেন্ডে অটোমেটিক ফ্রি ফায়ার UID ডায়মন্ড টপ আপ · উইকলি ও মান্থলি মেম্বারশিপ স্পেশাল ডিসকাউন্ট চলছে · বিকাশ ও নগদ পেমেন্ট ২৪/৭ চালু',
  heroHeadline: 'Bangladesh’s Fastest Free Fire UID Diamond Top Up & Esports Storefront',
  heroHeadlineBn: 'বাংলাদেশের দ্রুততম ফ্রি ফায়ার UID ডায়মন্ড টপ আপ ও ইস্পোর্টস স্টোর',
  heroSubheadline:
    'Enter your Free Fire Player UID, select your diamond package or Weekly/Monthly Pass, and complete payment via Wallet, bKash, Nagad, Rocket, or Upay with 30-second automated delivery.',
  heroSubheadlineBn:
    'আপনার ফ্রি ফায়ার প্লেয়ার UID দিন, ডায়মন্ড বা মেম্বারশিপ প্যাকেজ সিলেক্ট করুন এবং বিকাশ, নগদ, রকেট বা ওয়ালেট দিয়ে ৩০ সেকেন্ডে তাৎক্ষণিক ডেলিভারি নিন।',
  supportEmail: 'support@h41fftopup.com',
  supportPhone: '+880 1700-000000',
  supportWhatsapp: '+880 1700-000000',
  supportTelegram: '@h41fftopup',
  officeAddress: 'House 42, Road 11, Block F, Banani, Dhaka-1213, Bangladesh',
  defaultLanguage: 'en',
  defaultTheme: 'system',
};

export const initialUsers: User[] = [];

export const initialPackages: DiamondPackage[] = [
  {
    id: 'PKG-25',
    title: '25 Diamonds (UID Direct)',
    titleBn: '২৫ ডায়মন্ড (UID টপ আপ)',
    diamonds: 25,
    priceBdt: 25,
    originalPriceBdt: 30,
    category: 'uid',
    deliverySpeed: 'Instant · 30s',
    inStock: true,
  },
  {
    id: 'PKG-50',
    title: '50 Diamonds (UID Direct)',
    titleBn: '৫০ ডায়মন্ড (UID টপ আপ)',
    diamonds: 50,
    priceBdt: 45,
    originalPriceBdt: 52,
    category: 'uid',
    deliverySpeed: 'Instant · 30s',
    inStock: true,
  },
  {
    id: 'PKG-115',
    title: '115 Diamonds (UID Direct)',
    titleBn: '১১৫ ডায়মন্ড (UID টপ আপ)',
    diamonds: 115,
    priceBdt: 90,
    originalPriceBdt: 105,
    category: 'uid',
    deliverySpeed: 'Instant · 30s',
    popular: true,
    discountBadge: 'Best Seller',
    inStock: true,
  },
  {
    id: 'PKG-240',
    title: '240 Diamonds (UID Direct)',
    titleBn: '২৪০ ডায়মন্ড (UID টপ আপ)',
    diamonds: 240,
    priceBdt: 185,
    originalPriceBdt: 210,
    category: 'uid',
    deliverySpeed: 'Instant · 30s',
    popular: true,
    inStock: true,
  },
  {
    id: 'PKG-610',
    title: '610 Diamonds (UID Direct)',
    titleBn: '৬১০ ডায়মন্ড (UID টপ আপ)',
    diamonds: 610,
    priceBdt: 460,
    originalPriceBdt: 500,
    category: 'uid',
    deliverySpeed: 'Instant · 1m',
    discountBadge: 'Save ৳40',
    inStock: true,
  },
  {
    id: 'PKG-1240',
    title: '1240 Diamonds (UID Direct)',
    titleBn: '১২৪০ ডায়মন্ড (UID টপ আপ)',
    diamonds: 1240,
    priceBdt: 920,
    originalPriceBdt: 1020,
    category: 'uid',
    deliverySpeed: 'Instant · 1m',
    popular: true,
    discountBadge: 'Pro Bundle',
    inStock: true,
  },
  {
    id: 'PKG-WEEKLY',
    title: 'Weekly Membership (450💎 Value)',
    titleBn: 'উইকলি মেম্বারশিপ (৪৫০ ডায়মন্ড ভ্যালু)',
    diamonds: 450,
    priceBdt: 160,
    originalPriceBdt: 180,
    category: 'membership',
    deliverySpeed: 'Instant · 30s',
    popular: true,
    discountBadge: 'Most Popular',
    inStock: true,
  },
  {
    id: 'PKG-MONTHLY',
    title: 'Monthly Membership (2600💎 Value)',
    titleBn: 'মান্থলি মেম্বারশিপ (২৬০০ ডায়মন্ড ভ্যালু)',
    diamonds: 2600,
    priceBdt: 790,
    originalPriceBdt: 860,
    category: 'membership',
    deliverySpeed: 'Instant · 1m',
    discountBadge: 'Save ৳70',
    inStock: true,
  },
  {
    id: 'PKG-UNIPIN-240',
    title: 'UniPin 240 Diamonds Voucher PIN',
    titleBn: 'ইউনিপিন ২৪০ ডায়মন্ড ভাউচার পিন',
    diamonds: 240,
    priceBdt: 190,
    originalPriceBdt: 215,
    category: 'unipin',
    deliverySpeed: 'Auto PIN Code',
    inStock: true,
  },
  {
    id: 'PKG-UNIPIN-1240',
    title: 'Garena / UniPin 1240 Diamonds PIN',
    titleBn: 'গ্যারেনা / ইউনিপিন ১২৪০ ডায়মন্ড পিন',
    diamonds: 1240,
    priceBdt: 930,
    originalPriceBdt: 1030,
    category: 'unipin',
    deliverySpeed: 'Auto PIN Code',
    inStock: true,
  },
];

export const initialTournaments: Tournament[] = [
  {
    id: 'TRN-501',
    title: 'Dhaka Cyber Clash Squad 4v4 Showdown',
    titleBn: 'ঢাকা সাইবার ক্ল্যাশ স্কোয়াড ৪বনাম৪ শোডাউন',
    mode: 'Clash Squad',
    type: 'Paid',
    map: 'Bermuda',
    entryFee: 50,
    prizePool: 3500,
    perKillPrize: 15,
    totalSlots: 32,
    filledSlots: 0,
    startTime: 'Today, 09:00 PM BST',
    status: 'Live',
    rules: [
      'Level 40+ Free Fire Bangladesh Server accounts only.',
      'No PC emulators, macros, or third-party scripts allowed.',
      'Unlimited Gloo Wall enabled; grenade launcher disabled.',
      'Join the Custom Room at least 10 minutes before match start.',
    ],
    registeredPlayers: [],
    image: TOURNAMENT_IMAGE,
  },
  {
    id: 'TRN-502',
    title: 'Bangladesh Friday Grand Squad Championship',
    titleBn: 'বাংলাদেশ ফ্রাইডে গ্র্যান্ড স্কোয়াড চ্যাম্পিয়নশিপ',
    mode: 'Squad',
    type: 'Paid',
    map: 'Purgatory',
    entryFee: 100,
    prizePool: 15000,
    perKillPrize: 25,
    totalSlots: 48,
    filledSlots: 0,
    startTime: 'Tomorrow, 08:30 PM BST',
    status: 'Upcoming',
    rules: [
      'Full 4-player roster required at check-in.',
      'Points table: Booyah = 12 pts, Each Kill = 1 pt + ৳25 instant bonus.',
      'Screen recording mandatory for top 3 teams.',
    ],
    registeredPlayers: [],
    image: TOURNAMENT_IMAGE,
  },
  {
    id: 'TRN-503',
    title: 'Community Free Entry Solo Rush Cup',
    titleBn: 'কমিউনিটি ফ্রি এন্ট্রি সোলো রাশ কাপ',
    mode: 'Solo',
    type: 'Free',
    map: 'Bermuda',
    entryFee: 0,
    prizePool: 1000,
    perKillPrize: 10,
    totalSlots: 48,
    filledSlots: 0,
    startTime: 'Today, 10:30 PM BST',
    status: 'Upcoming',
    rules: [
      '100% Free entry for all verified H41FFTOPUP players.',
      'Teaming up in Solo mode leads to immediate disqualification.',
      'Prize money credited directly to Income Wallet within 30 minutes of match end.',
    ],
    registeredPlayers: [],
    image: TOURNAMENT_IMAGE,
  },
  {
    id: 'TRN-504',
    title: 'Pro Duo Sniper & Assault Series',
    titleBn: 'প্রো ডুয়ো স্নাইপার ও অ্যাসল্ট সিরিজ',
    mode: 'Duo',
    type: 'Paid',
    map: 'Kalahari',
    entryFee: 40,
    prizePool: 2400,
    perKillPrize: 15,
    totalSlots: 48,
    filledSlots: 0,
    startTime: '17 Nov 2026, 09:00 PM BST',
    status: 'Upcoming',
    rules: [
      '2 players per team; both UIDs must match registration.',
      'Revival points enabled; standard competitive loot table.',
    ],
    registeredPlayers: [],
    image: TOURNAMENT_IMAGE,
  },
  {
    id: 'TRN-505',
    title: 'Autumn Booyah Masters Cup #18',
    titleBn: 'অটাম বুইয়াহ মাস্টার্স কাপ #১৮',
    mode: 'Squad',
    type: 'Paid',
    map: 'Nexterra',
    entryFee: 80,
    prizePool: 8000,
    perKillPrize: 20,
    totalSlots: 48,
    filledSlots: 48,
    startTime: '14 Nov 2026, 09:00 PM BST',
    status: 'Completed',
    rules: ['Standard Bangladesh Esports Rulebook v2.4 applied.'],
    registeredPlayers: [],
    image: TOURNAMENT_IMAGE,
  },
];

export const initialTasks: IncomeTask[] = [
  {
    id: 'TSK-301',
    title: 'Subscribe & Review H41FFTOPUP Official YouTube Channel',
    titleBn: 'অফিশিয়াল ইউটিউব চ্যানেল সাবস্ক্রাইব ও কমেন্ট রিভিউ',
    category: 'Task Complete',
    description:
      'Watch our 3-minute tournament rulebook guide on YouTube, subscribe to the channel, and leave a constructive comment with your Free Fire IGN.',
    requirements: [
      'Watch at least 2 minutes of the tournament tutorial video.',
      'Subscribe to the official channel and copy your comment link or screenshot URL.',
      'Do not use automated bots or duplicate accounts.',
    ],
    externalLink: 'https://www.youtube.com',
    rewardBdt: 15,
    estimatedTime: '3 mins',
    image: TASK_IMAGE,
    active: true,
    completionsCount: 412,
  },
  {
    id: 'TSK-302',
    title: 'Join Official Telegram & Discord Esports Community',
    titleBn: 'অফিশিয়াল টেলিগ্রাম ও ডিসকর্ড কমিউনিটিতে যোগ দিন',
    category: 'Task Complete',
    description:
      'Join our verified Telegram announcement channel (@h41fftopup) to receive instant Custom Room IDs and daily voucher drops.',
    requirements: [
      'Join using your active Telegram account.',
      'Submit your Telegram @username in the verification note.',
    ],
    externalLink: 'https://telegram.org',
    rewardBdt: 12,
    estimatedTime: '2 mins',
    image: TASK_IMAGE,
    active: true,
    completionsCount: 689,
  },
  {
    id: 'TSK-303',
    title: 'Gaming Gear & Mobile Latency Survey (Bangladesh ISP Study)',
    titleBn: 'গেমিং পিং ও মোবাইল ইন্টারনেট ল্যাটেন্সি সার্ভে',
    category: 'Special Tasks',
    description:
      'Complete a 10-question survey regarding your average Free Fire ping on Bangladeshi mobile data & broadband networks to help optimize regional tournament servers.',
    requirements: [
      'Provide accurate ping metrics and device model.',
      'Submit the survey confirmation reference code.',
    ],
    externalLink: 'https://forms.google.com',
    rewardBdt: 35,
    estimatedTime: '5 mins',
    image: TASK_IMAGE,
    active: true,
    completionsCount: 234,
  },
  {
    id: 'TSK-304',
    title: 'Sponsored Partner App Trial: Daraz BD 11.11 Gamer Zone',
    titleBn: 'স্পন্সরড পার্টনার ভিজিট: দারাজ গেমার জোন ক্যাম্পেইন',
    category: 'Sponsored Content',
    description:
      'Visit our authorized promotional partner page, explore the mobile gaming accessories catalog for 60 seconds, and submit the campaign verification code displayed at the footer.',
    requirements: [
      'Compliant partner campaign — no forced purchases required.',
      'Enter the 6-digit campaign verification code in the submission form.',
    ],
    externalLink: 'https://www.daraz.com.bd',
    rewardBdt: 25,
    estimatedTime: '2 mins',
    image: TASK_IMAGE,
    active: true,
    completionsCount: 518,
  },
  {
    id: 'TSK-305',
    title: 'Write an Honest Platform Experience Review on Facebook',
    titleBn: 'ফেসবুক পেজে আপনার টপ আপ ও টুর্নামেন্ট অভিজ্ঞতা শেয়ার করুন',
    category: 'Bonus Rewards',
    description:
      'Share your genuine Order ID or Tournament screenshot on our Facebook Community Group and help new Bangladeshi players verify delivery speed.',
    requirements: [
      'Post must include a real completed Order ID or Tournament match result.',
      'Provide the public post link for moderator review.',
    ],
    externalLink: 'https://www.facebook.com',
    rewardBdt: 40,
    estimatedTime: '4 mins',
    image: TASK_IMAGE,
    active: true,
    completionsCount: 176,
  },
];

export const initialOrders: TopUpOrder[] = [];

export const initialTaskSubmissions: TaskSubmission[] = [];

export const initialDeposits: DepositRequest[] = [];

export const initialWithdrawals: WithdrawRequest[] = [];

export const initialTransactions: WalletTransaction[] = [];

export const initialPaymentSettings: PaymentSettings = {
  gateways: [
    {
      id: 'bkash',
      name: 'bKash',
      active: true,
      merchantNumber: '01700-000001',
      personalNumber: '01700-000002',
      instructions: 'Dial *247# or use bKash App -> Send Money / Make Payment -> Enter Reference H41FFTOPUP.',
      color: '#E2136E',
    },
    {
      id: 'nagad',
      name: 'Nagad',
      active: true,
      merchantNumber: '01800-000001',
      personalNumber: '01800-000002',
      instructions: 'Dial *167# or use Nagad App -> Send Money -> Copy Transaction ID and submit.',
      color: '#F7941D',
    },
    {
      id: 'rocket',
      name: 'Rocket',
      active: true,
      merchantNumber: '01900-0000018',
      personalNumber: '01900-0000029',
      instructions: 'Dial *322# or use Rocket App -> Send Money to 12-digit account.',
      color: '#8C3494',
    },
    {
      id: 'upay',
      name: 'Upay (UCB)',
      active: true,
      merchantNumber: '01600-000001',
      personalNumber: '01600-000002',
      instructions: 'Dial *268# or use Upay App -> Send Money -> Enter Transaction ID below.',
      color: '#005A9C',
    },
  ],
  minDepositBdt: 25,
  maxDepositBdt: 100000,
  depositFeePercent: 0,
  minWithdrawBdt: 100,
  maxWithdrawBdt: 50000,
  withdrawFeePercent: 0,
  processingTimeText: '30–120 Minutes (9:00 AM – 11:59 PM BST)',
  manualReviewThresholdBdt: 5000,
  referralBonusBdt: 25,
  instantGatewayEnabled: true,
};

export const initialBlogPosts: BlogPost[] = [
  {
    id: 'BLG-101',
    title: 'Free Fire OB47 Bangladesh Server Update: New Character Balancing & Economy Changes',
    category: 'Esports Update',
    excerpt:
      'Discover how the latest Clash Squad economy changes affect shotgun pricing, Gloo Wall generation, and competitive tournament meta in Bangladesh.',
    content:
      'The OB47 update introduces major adjustments to Clash Squad round economy and active character cooldowns. Our tournament moderators have updated the Friday Grand Squad rulebook to reflect these balance changes.',
    publishedAt: '12 Nov 2026',
    readTime: '4 min read',
    author: 'H41FFTOPUP Esports Desk',
  },
  {
    id: 'BLG-102',
    title: 'How Instant UID Top Up Works Without Sharing Your Garena Account Password',
    category: 'Security Guide',
    excerpt:
      'Learn why UID and UniPin voucher top-ups are the only safe way to purchase Free Fire diamonds in Bangladesh without risking account theft.',
    content:
      'Never share your Facebook, Gmail, or VK login credentials with third-party sellers. H41FFTOPUP uses authorized Garena Player UID and official UniPin voucher APIs so your account remains 100% secure.',
    publishedAt: '08 Nov 2026',
    readTime: '3 min read',
    author: 'Security & Trust Team',
  },
  {
    id: 'BLG-103',
    title: 'Compliant Online Task Rewards: How Verification & bKash Withdrawals Operate',
    category: 'Platform Guide',
    excerpt:
      'A transparent breakdown of how advertiser-funded micro-tasks, community surveys, and referral bonuses are verified and paid out.',
    content:
      'Unlike unrealistic schemes, H41FFTOPUP partners with local gaming brands and research surveys. Every submission is reviewed for quality, and approved rewards can be withdrawn once your Income Balance reaches ৳100.',
    publishedAt: '02 Nov 2026',
    readTime: '5 min read',
    author: 'Operations Team',
  },
];

export const initialReviews: UserReview[] = [
  {
    id: 'REV-1',
    userName: 'Mehedi Hasan Miraz',
    ffIgn: 'DHAKA_RUSHER',
    location: 'Mirpur, Dhaka',
    serviceUsed: 'Squad Tournament & UID Top Up',
    rating: 5,
    comment:
      'Before using H41FFTOPUP, our squad waited hours for custom room prizes on random Facebook pages. Here, our ৳8,000 Autumn Cup prize was credited to my wallet within 20 minutes and withdrawn to Nagad smoothly.',
    date: '14 Nov 2026',
  },
  {
    id: 'REV-2',
    userName: 'Rafiul Hasan',
    ffIgn: 'RAFI_SNIPER',
    location: 'Agrabad, Chattogram',
    serviceUsed: 'Weekly Membership & UniPin PIN',
    rating: 5,
    comment:
      'Ordered the Weekly Membership at ৳160 using bKash Instant Checkout. Diamonds landed on my UID 3910482716 in less than 35 seconds without asking for any password.',
    date: '11 Nov 2026',
  },
  {
    id: 'REV-3',
    userName: 'Sadia Afrin Mim',
    ffIgn: 'QUEEN_SADIA',
    location: 'Uttara, Dhaka',
    serviceUsed: 'Reward Tasks & Referrals',
    rating: 5,
    comment:
      'I complete the ISP ping surveys and partner tasks between college classes. Earned ৳620 this month and used part of it to buy a Weekly Membership directly from my wallet.',
    date: '09 Nov 2026',
  },
  {
    id: 'REV-4',
    userName: 'Tanvir Ahmed Shuvo',
    ffIgn: 'SYLHET_KING',
    location: 'Zindabazar, Sylhet',
    serviceUsed: 'Solo Free Entry Tournament',
    rating: 5,
    comment:
      'The Room ID and Password reveal right inside the tournament card for registered players prevents outsiders from leaking the room. Best managed esports & top-up site in BD.',
    date: '05 Nov 2026',
  },
];

export const initialFaqs: FAQItem[] = [
  {
    id: 'FAQ-1',
    category: 'Top Up',
    question: 'How fast are Free Fire Diamonds delivered after placing a UID Top Up order?',
    answer:
      'UID Direct orders paid via Main Wallet or Instant Gateway are processed within 30 to 90 seconds. Manual bKash/Nagad TrxID orders are verified by our operators within 3 to 5 minutes.',
  },
  {
    id: 'FAQ-2',
    category: 'Top Up',
    question: 'Do you ever need my Free Fire Facebook or Google password for Top Up?',
    answer:
      'Never. H41FFTOPUP only requires your numeric Free Fire Player UID (for UID Top Up) or delivers an official redeemable UniPin code. Never share your password with anyone.',
  },
  {
    id: 'FAQ-3',
    category: 'Tournaments',
    question: 'How and when do I receive the Custom Room ID and Password?',
    answer:
      'Once you register for a tournament, the Room ID and Password automatically unlock inside the Tournament Card 15 minutes before the scheduled match start time—visible exclusively to registered players.',
  },
  {
    id: 'FAQ-4',
    category: 'Income Tasks',
    question: 'Is there any registration fee to complete reward tasks, and is income guaranteed?',
    answer:
      'Creating an account and completing tasks on H41FFTOPUP is 100% free. Rewards depend strictly on completing genuine, verifiable tasks according to advertiser guidelines. We do not offer passive investment schemes or guaranteed income.',
  },
  {
    id: 'FAQ-5',
    category: 'Wallet & Payments',
    question: 'What is the minimum withdrawal amount and supported Bangladeshi payment methods?',
    answer:
      'The minimum withdrawal limit is ৳100 BDT. You can withdraw your approved Income Balance via bKash, Nagad, Rocket, or Upay, or transfer it to your Main Balance with zero fee to purchase Diamonds.',
  },
  {
    id: 'FAQ-6',
    category: 'Wallet & Payments',
    question: 'What happens if a Top Up order is cancelled or my UID was entered incorrectly?',
    answer:
      'If an order cannot be fulfilled due to an invalid UID or stock maintenance, our Admin team cancels the order and 100% of the BDT amount is automatically refunded to your Main Wallet Balance.',
  },
];

export const initialContactMessages: ContactMessage[] = [
  {
    id: 'MSG-201',
    name: 'Kamrul Islam',
    email: 'kamrul.esports@gmail.com',
    phone: '01788990011',
    subject: 'Custom Guild Tournament Sponsorship Inquiry',
    message:
      'Assalamu Alaikum, our guild (Dhaka Immortals, 150+ active players) would like to host a sponsored Friday Squad tournament on H41FFTOPUP.',
    status: 'New',
    createdAt: '2026-11-15 10:20',
  },
  {
    id: 'MSG-202',
    name: 'Nusrat Jahan',
    email: 'nusrat.ff@gmail.com',
    phone: '01811223344',
    subject: 'Question about UniPin Voucher Redemption',
    message: 'How do I redeem the UniPin 240 Diamonds PIN on shop.garena.my?',
    status: 'Resolved',
    createdAt: '2026-11-14 16:05',
  },
];

export const initialSupportTickets: SupportTicket[] = [];

export const initialAuditLogs: AuditLogEntry[] = [];
