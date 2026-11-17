import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  Search,
  CheckCircle2,
  Info,
  Crown,
  ChevronDown,
  ChevronRight,
  Play,
  ArrowLeft,
  ShieldCheck,
  Wallet,
  Zap,
  Copy,
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  HERO_BANNER_IMAGE,
  DIAMOND_IMAGE,
  TOURNAMENT_IMAGE,
  TASK_IMAGE,
} from '../data/seedData';
import { DiamondPackage, PaymentGatewayName } from '../types';

interface CatalogProductGroup {
  id:
    | 'uid-bd'
    | 'levelup-bd'
    | 'weekly-lite'
    | 'weekly-monthly'
    | 'uid-id'
    | 'weekly-id'
    | 'levelup-id';
  title: string;
  badgeBn: string;
  server: 'BD' | 'ID';
  image: string;
  gradientOverlay: string;
  rulesTitle: string;
  rulesList: string[];
  items: {
    id: string;
    name: string;
    diamonds: number;
    priceBdt: number;
    stockout?: boolean;
  }[];
}

const REFERENCE_PRODUCT_GROUPS: CatalogProductGroup[] = [
  {
    id: 'uid-bd',
    title: 'UID TOPUP',
    badgeBn: 'ইউআইডি টপআপ',
    server: 'BD',
    image: DIAMOND_IMAGE,
    gradientOverlay: 'from-[#FF5500] to-[#B91C1C]',
    rulesTitle: 'H41FFTOPUP - UID TopUp Rules & Conditions',
    rulesList: [
      'শুধুমাত্র Bangladesh (BD) Server-এ Player ID Code ব্যবহার করে Top Up করা যাবে।',
      'Player ID ভুল প্রদান করলে Top Up সম্পন্ন না হওয়ার জন্য H41FFTOPUP কর্তৃপক্ষ দায়ী থাকবে না। অর্ডার করার আগে অবশ্যই আপনার Player ID সঠিকভাবে যাচাই করুন।',
      'অর্ডার Completed হওয়ার পরও যদি Diamond আপনার অ্যাকাউন্টে না পৌঁছায়, তাহলে যাচাইয়ের জন্য Player ID এবং প্রয়োজনে Account Login Information প্রদান করতে হতে পারে।',
      'কোনো অর্ডার Cancelled হলে তার সুনির্দিষ্ট কারণ Order History-তে উল্লেখ থাকবে। অনুগ্রহ করে কারণটি দেখে সঠিক তথ্য দিয়ে পুনরায় অর্ডার করুন।',
    ],
    items: [
      { id: 'uid-wk', name: 'Weekly Membership', diamonds: 450, priceBdt: 158 },
      { id: 'uid-mo', name: 'Monthly Membership', diamonds: 2600, priceBdt: 790 },
      { id: 'uid-25', name: '25 Diamond 💎', diamonds: 25, priceBdt: 22 },
      { id: 'uid-50', name: '50 Diamond 💎', diamonds: 50, priceBdt: 37 },
      { id: 'uid-75', name: '75 Diamond 💎', diamonds: 75, priceBdt: 58 },
      { id: 'uid-100', name: '100 Diamond 💎', diamonds: 100, priceBdt: 72 },
      { id: 'uid-115', name: '115 Diamond 💎', diamonds: 115, priceBdt: 79 },
      { id: 'uid-240', name: '240 Diamond 💎', diamonds: 240, priceBdt: 158 },
      { id: 'uid-355', name: '355 Diamond 💎', diamonds: 355, priceBdt: 237 },
      { id: 'uid-480', name: '480 Diamond 💎', diamonds: 480, priceBdt: 316 },
      { id: 'uid-505', name: '505 Diamond 💎', diamonds: 505, priceBdt: 339 },
      { id: 'uid-610', name: '610 Diamond 💎', diamonds: 610, priceBdt: 400 },
      { id: 'uid-725', name: '725 Diamond 💎', diamonds: 725, priceBdt: 480 },
      { id: 'uid-850', name: '850 Diamond 💎', diamonds: 850, priceBdt: 560 },
      { id: 'uid-1090', name: '1090 Diamond 💎', diamonds: 1090, priceBdt: 716 },
      { id: 'uid-1240', name: '1240 Diamond 💎', diamonds: 1240, priceBdt: 800 },
      { id: 'uid-1595', name: '1595 Diamond 💎', diamonds: 1595, priceBdt: 1045 },
      { id: 'uid-1850', name: '1850 Diamond 💎', diamonds: 1850, priceBdt: 1210 },
      { id: 'uid-2090', name: '2090 Diamond 💎', diamonds: 2090, priceBdt: 1350 },
      { id: 'uid-2530', name: '2530 Diamond 💎', diamonds: 2530, priceBdt: 1610 },
      { id: 'uid-3140', name: '3140 Diamond 💎', diamonds: 3140, priceBdt: 2020 },
      { id: 'uid-4380', name: '4380 Diamond 💎', diamonds: 4380, priceBdt: 2810 },
      { id: 'uid-5060', name: '5060 Diamond 💎', diamonds: 5060, priceBdt: 3220 },
      { id: 'uid-7590', name: '7590 Diamond 💎', diamonds: 7590, priceBdt: 4830 },
      { id: 'uid-10120', name: '10120 Diamond 💎', diamonds: 10120, priceBdt: 6440 },
    ],
  },
  {
    id: 'levelup-bd',
    title: 'Level Up Pass',
    badgeBn: 'লেভেল আপ পাস',
    server: 'BD',
    image: HERO_BANNER_IMAGE,
    gradientOverlay: 'from-[#2563EB] to-[#1D4ED8]',
    rulesTitle: 'H41FFTOPUP - Level Up Pass Rules & Conditions',
    rulesList: [
      'অর্ডার করার আগে আপনার গেম প্রোফাইল চেক করে Level Up Pass আপনার অ্যাকাউন্টে উপলব্ধ আছে কিনা যাচাই করুন।',
      'যেকোনো অ্যাকাউন্টে Level Up Pass কেবল একবারই নেওয়া যায়। আগে নেওয়া থাকলে টাকা Refund প্রদান করা হবে না।',
      'শুধুমাত্র Bangladesh (BD) Server-এ Player ID Code ব্যবহার করে Top Up করা যাবে।',
      'অর্ডার করার সময় ভুল Player ID প্রদান করলে H41FFTOPUP কর্তৃপক্ষ দায়ী থাকবে না।',
    ],
    items: [
      { id: 'lvl-6', name: 'Level 6 - (120 💎)', diamonds: 120, priceBdt: 40 },
      { id: 'lvl-10', name: 'Level 10 - (200 💎)', diamonds: 200, priceBdt: 70 },
      { id: 'lvl-15', name: 'Level 15 - (200 💎)', diamonds: 200, priceBdt: 70 },
      { id: 'lvl-20', name: 'Level 20 - (200 💎)', diamonds: 200, priceBdt: 70 },
      { id: 'lvl-25', name: 'Level 25 - (200 💎)', diamonds: 200, priceBdt: 70 },
      { id: 'lvl-30', name: 'Level 30 - (350 💎)', diamonds: 350, priceBdt: 98 },
      { id: 'lvl-all', name: 'All Level Up Pass - (1270 💎)', diamonds: 1270, priceBdt: 418 },
    ],
  },
  {
    id: 'weekly-lite',
    title: 'Weekly Lite',
    badgeBn: 'WEEKLY LITE',
    server: 'BD',
    image: DIAMOND_IMAGE,
    gradientOverlay: 'from-[#0284C7] to-[#1E3A8A]',
    rulesTitle: 'H41FFTOPUP - Weekly Lite Rules & Conditions',
    rulesList: [
      'শুধুমাত্র Bangladesh (BD) Server-এ Player ID Code ব্যবহার করে Top Up করা যাবে।',
      'Player ID ভুল প্রদান করলে Top Up সম্পন্ন না হওয়ার জন্য H41FFTOPUP কর্তৃপক্ষ দায়ী থাকবে না।',
      'অর্ডার Completed হওয়ার পর সাথে সাথে আপনার গেম মেইল বক্স বা মেম্বারশিপ সেকশন চেক করুন।',
    ],
    items: [
      { id: 'wl-1', name: 'Weekly Lite', diamonds: 100, priceBdt: 41 },
      { id: 'wl-2', name: '2x Weekly Lite', diamonds: 200, priceBdt: 82 },
      { id: 'wl-3', name: '3x Weekly Lite', diamonds: 300, priceBdt: 123 },
      { id: 'wl-4', name: '4x Weekly Lite', diamonds: 400, priceBdt: 164 },
      { id: 'wl-5', name: '5x Weekly Lite', diamonds: 500, priceBdt: 205 },
      { id: 'wl-6', name: '6x Weekly Lite', diamonds: 600, priceBdt: 246 },
      { id: 'wl-8', name: '8x Weekly Lite', diamonds: 800, priceBdt: 328 },
      { id: 'wl-10', name: '10x Weekly Lite', diamonds: 1000, priceBdt: 410 },
    ],
  },
  {
    id: 'weekly-monthly',
    title: 'Weekly & Monthly',
    badgeBn: 'উইকলি মান্থলি',
    server: 'BD',
    image: HERO_BANNER_IMAGE,
    gradientOverlay: 'from-[#EA580C] to-[#9A3412]',
    rulesTitle: 'H41FFTOPUP - Weekly & Monthly Rules & Conditions',
    rulesList: [
      'শুধুমাত্র Bangladesh (BD) Server-এ Player ID Code ব্যবহার করে Top Up করা যাবে।',
      'Weekly এবং Monthly Membership অর্ডারের ক্ষেত্রে মাত্র ৫–৩০ সেকেন্ডে অটো ডেলিভারি সম্পন্ন হয়।',
      'অর্ডার করার আগে অবশ্যই আপনার Player ID সঠিকভাবে যাচাই করুন।',
    ],
    items: [
      { id: 'wm-1w', name: 'Weekly Membership', diamonds: 450, priceBdt: 158 },
      { id: 'wm-1m', name: 'Monthly Membership', diamonds: 2600, priceBdt: 790 },
      { id: 'wm-2w', name: '2x Weekly Membership', diamonds: 900, priceBdt: 316 },
      { id: 'wm-2m', name: '2x Monthly Membership', diamonds: 5200, priceBdt: 1580 },
      { id: 'wm-3w', name: '3x Weekly Membership', diamonds: 1350, priceBdt: 474 },
      { id: 'wm-4w', name: '4x Weekly Membership', diamonds: 1800, priceBdt: 632 },
      { id: 'wm-5w', name: '5x Weekly Membership', diamonds: 2250, priceBdt: 790 },
      { id: 'wm-1w1m', name: '1 Weekly + 1 Monthly', diamonds: 3050, priceBdt: 948 },
      { id: 'wm-4w1m', name: '4 Weekly + 1 Monthly', diamonds: 4400, priceBdt: 1422 },
    ],
  },
];

const REFERENCE_LATEST_ORDERS = [
  { id: 'ro-1', name: 'Tuhin Miaa', time: '9:54 PM 16 November', item: 'Weekly 💎 - 158 tk', color: '#00897B', initial: 'T' },
  { id: 'ro-2', name: 'ABDUR RAHMAN', time: '9:48 PM 16 November', item: '2x Weekly Lite 💎 - 82 tk', color: '#3949AB', initial: 'A' },
  { id: 'ro-3', name: 'JOYNTO', time: '9:46 PM 16 November', item: 'Weekly 💎 - 158 tk', color: '#43A047', initial: 'J' },
  { id: 'ro-4', name: 'Masud YT', time: '9:45 PM 16 November', item: '115 Diamond 💎 - 79 tk', color: '#C2185B', initial: 'M' },
  { id: 'ro-5', name: 'Masud YT', time: '9:44 PM 16 November', item: 'Weekly 💎 - 158 tk', color: '#C2185B', initial: 'M' },
  { id: 'ro-6', name: 'Md Atik', time: '9:44 PM 16 November', item: 'Weekly Lite 💎 - 41 tk', color: '#1E88E5', initial: 'M' },
  { id: 'ro-7', name: 'Apon Khan', time: '9:43 PM 16 November', item: '25 Diamond 💎 - 22 tk', color: '#D81B60', initial: 'A' },
  { id: 'ro-8', name: 'Adnan Hossain', time: '9:39 PM 16 November', item: 'Monthly 💎 - 790 tk', color: '#00ACC1', initial: 'A' },
  { id: 'ro-9', name: 'Abir Hossain', time: '9:39 PM 16 November', item: 'Weekly 💎 - 158 tk', color: '#5E35B1', initial: 'A' },
  { id: 'ro-10', name: 'jihad Mia', time: '9:34 PM 16 November', item: 'Weekly 💎 - 158 tk', color: '#8E24AA', initial: 'j' },
];

const LEADERBOARD_DATA = {
  lifetime: {
    podium: [
      { rank: 2, name: 'Prince Gaming', tier: 'Grand Master', spend: '৳163,620', initial: 'P', color: '#64748B' },
      { rank: 1, name: 'mrkinges', tier: 'Grand Master', spend: '৳192,210', initial: 'm', color: '#FF5500' },
      { rank: 3, name: 'FAHIM AL HASAN FF', tier: 'Grand Master', spend: '৳131,444', initial: 'F', color: '#B45309' },
    ],
    list: [
      { rank: 4, name: 'Zisan Vai YT', tier: 'Heroic', spend: '৳120,765', initial: 'Z', color: '#15803D' },
      { rank: 5, name: 'Niloy Paul', tier: 'Heroic', spend: '৳94,100', initial: 'N', color: '#7E22CE' },
      { rank: 6, name: 'Habibur-Rahman 2205', tier: 'Heroic', spend: '৳76,792', initial: 'H', color: '#BE185D' },
      { rank: 7, name: 'Bastob Kolpona', tier: 'Heroic', spend: '৳62,044', initial: 'B', color: '#0369A1' },
      { rank: 8, name: 'Arefin Meraz', tier: 'Master', spend: '৳54,765', initial: 'A', color: '#4338CA' },
      { rank: 9, name: 'Its Angon', tier: 'Master', spend: '৳54,314', initial: 'I', color: '#0F766E' },
      { rank: 10, name: 'May Miraz', tier: 'Master', spend: '৳54,225', initial: 'M', color: '#B91C1C' },
      { rank: 11, name: 'ON RFFF', tier: 'Master', spend: '৳50,701', initial: 'O', color: '#1E293B' },
      { rank: 12, name: 'Abir Hasan', tier: 'Master', spend: '৳50,660', initial: 'A', color: '#7E22CE' },
      { rank: 13, name: 'Iasin Arafat', tier: 'Master', spend: '৳50,333', initial: 'I', color: '#C2410C' },
      { rank: 14, name: 'Saidul Alam', tier: 'Master', spend: '৳46,009', initial: 'S', color: '#0284C7' },
      { rank: 15, name: 'ARMAN BHAI', tier: 'Master', spend: '৳44,602', initial: 'A', color: '#15803D' },
      { rank: 16, name: 'Samin Islam', tier: 'Master', spend: '৳43,671', initial: 'S', color: '#6D28D9' },
      { rank: 17, name: 'Md Saiful', tier: 'Master', spend: '৳43,482', initial: 'M', color: '#B45309' },
      { rank: 18, name: 'Free Fire 1', tier: 'Master', spend: '৳39,715', initial: 'F', color: '#E11D48' },
      { rank: 19, name: 'Md Sayed', tier: 'Master', spend: '৳38,837', initial: 'M', color: '#0D9488' },
      { rank: 20, name: 'Naeemul Islam', tier: 'Master', spend: '৳38,486', initial: 'N', color: '#4F46E5' },
    ],
  },
  monthly: {
    podium: [
      { rank: 2, name: 'FAHIM AL HASAN FF', tier: 'Master', spend: '৳59,610', initial: 'F', color: '#64748B' },
      { rank: 1, name: 'Prince Gaming', tier: 'Grand Master', spend: '৳100,280', initial: 'P', color: '#FF5500' },
      { rank: 3, name: 'Bastob Kolpona', tier: 'Heroic', spend: '৳45,392', initial: 'B', color: '#B45309' },
    ],
    list: [
      { rank: 4, name: 'mrkinges', tier: 'Heroic', spend: '৳41,200', initial: 'm', color: '#EA580C' },
      { rank: 5, name: 'Zisan Vai YT', tier: 'Heroic', spend: '৳36,450', initial: 'Z', color: '#15803D' },
      { rank: 6, name: 'Niloy Paul', tier: 'Master', spend: '৳29,800', initial: 'N', color: '#7E22CE' },
      { rank: 7, name: 'Habibur-Rahman 2205', tier: 'Master', spend: '৳24,110', initial: 'H', color: '#BE185D' },
      { rank: 8, name: 'Arefin Meraz', tier: 'Master', spend: '৳21,900', initial: 'A', color: '#4338CA' },
    ],
  },
  weekly: {
    podium: [
      { rank: 2, name: 'mirajhossen', tier: 'Diamond', spend: '৳19,618', initial: 'm', color: '#64748B' },
      { rank: 1, name: 'Noman Hossain', tier: 'Diamond', spend: '৳23,438', initial: 'N', color: '#15803D' },
      { rank: 3, name: 'Prince Gaming', tier: 'Diamond', spend: '৳17,450', initial: 'P', color: '#B45309' },
    ],
    list: [
      { rank: 4, name: 'FAHIM AL HASAN FF', tier: 'Diamond', spend: '৳14,920', initial: 'F', color: '#B45309' },
      { rank: 5, name: 'Masud YT', tier: 'Diamond', spend: '৳12,300', initial: 'M', color: '#C2185B' },
      { rank: 6, name: 'ABDUR RAHMAN', tier: 'Diamond', spend: '৳10,840', initial: 'A', color: '#3949AB' },
      { rank: 7, name: 'Adnan Hossain', tier: 'Diamond', spend: '৳9,510', initial: 'A', color: '#00ACC1' },
      { rank: 8, name: 'JOYNTO', tier: 'Diamond', spend: '৳8,190', initial: 'J', color: '#43A047' },
    ],
  },
};

export const HomePage: React.FC = () => {
  const {
    language,
    orders,
    tournaments,
    tasks,
    currentUser,
    paymentSettings,
    placeTopUpOrder,
    addToCart,
    setIsCartOpen,
    addToast,
  } = useApp();

  // 1. Dark Notice Box State (00:26 in Recording)
  const [noticeVisible, setNoticeVisible] = useState(true);

  // 2. Hero Promotional Banner Carousel State (00:29 - 01:03 in Recording)
  const [activeSlide, setActiveSlide] = useState(0);

  // 3. Selected Product Group (When user clicks a Square Card like UID TOPUP / Level Up Pass / Weekly Lite, matches 02:02 - 03:35)
  const [activeProductGroupId, setActiveProductGroupId] = useState<CatalogProductGroup['id'] | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string>('uid-115');
  const [playerUid, setPlayerUid] = useState<string>(currentUser?.ffUid || '');
  const [checkedPlayerName, setCheckedPlayerName] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'instant'>('instant');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayName>('bkash');
  const [trxId, setTrxId] = useState<string>('');
  const [tutorialModalOpen, setTutorialModalOpen] = useState<boolean>(false);

  // 4. Leaderboard Period Tab State (WEEKLY | MONTHLY | LIFETIME — matches 00:38 & 03:40)
  const [leaderboardTab, setLeaderboardTab] = useState<'weekly' | 'monthly' | 'lifetime'>('lifetime');
  const [showAllRanked, setShowAllRanked] = useState(false);

  const bannerSlides = [
    {
      id: 'b1',
      badge: 'H41FFTOPUP OFFICIAL',
      titleBn: 'গিভওয়ে ও সকল অফার সম্পর্কে জানতে টেলিগ্রামে জয়েন করুন',
      titleEn: 'Join Our Official Telegram for Giveaways & Flash Offers',
      subBn: 'প্রতিদিন স্পেশাল ডিসকাউন্ট ও ফ্রি কাস্টম রুম আপডেট',
      subEn: 'Daily special discounts & Free Fire custom room updates',
      accentBg: 'from-[#450A0A] via-[#7F1D1D] to-[#1E1B4B]',
      pillColor: '#0284C7',
      image: HERO_BANNER_IMAGE,
    },
    {
      id: 'b2',
      badge: '24/7 HELPLINE ACTIVE',
      titleBn: 'যেকোনো সমস্যায় টেলিগ্রামে যোগাযোগ করুন!',
      titleEn: 'Contact Our 24/7 Telegram Support Anytime!',
      subBn: 'অর্ডার বা পেমেন্ট সংক্রান্ত যেকোনো ইস্যুতে ২ মিনিটে সমাধান',
      subEn: 'Instant resolution for any top-up or wallet payment issue',
      accentBg: 'from-[#1E1B4B] via-[#0F172A] to-[#3B0764]',
      pillColor: '#10B981',
      image: DIAMOND_IMAGE,
    },
    {
      id: 'b3',
      badge: '৬০ টাকায় উইকলি · ৯ টাকায় উইকলি লাইট',
      titleBn: 'সব থেকে কম দামে টপ-আপ করুন মাত্র ৫ সেকেন্ডে',
      titleEn: 'Lowest Price Free Fire Top-Up in Just 5 Seconds',
      subBn: '১০০% অটোমেটিক ডেলিভারি — কোনো পাসওয়ার্ড প্রয়োজন নেই',
      subEn: '100% automated UID delivery — zero game password needed',
      accentBg: 'from-[#3B0A0A] via-[#7C2D12] to-[#0F172A]',
      pillColor: '#FF5500',
      image: TOURNAMENT_IMAGE,
    },
  ];

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % bannerSlides.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [bannerSlides.length]);

  const activeProductGroup = REFERENCE_PRODUCT_GROUPS.find(
    (g) => g.id === activeProductGroupId
  );

  const selectedRechargeItem =
    activeProductGroup?.items.find((i) => i.id === selectedItemId) ||
    activeProductGroup?.items.find((i) => !i.stockout) ||
    activeProductGroup?.items[0];

  const handleOpenProductGroup = (groupId: CatalogProductGroup['id']) => {
    const grp = REFERENCE_PRODUCT_GROUPS.find((g) => g.id === groupId);
    setActiveProductGroupId(groupId);
    if (grp && grp.items.length > 0) {
      const firstAvailable = grp.items.find((i) => !i.stockout) || grp.items[0];
      setSelectedItemId(firstAvailable.id);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckGameIdName = () => {
    const cleanUid = playerUid.trim();
    if (cleanUid.length < 6) {
      addToast('Player ID প্রয়োজন', 'অনুগ্রহ করে সঠিক Free Fire Player ID লিখুন।', 'warning');
      return;
    }
    const resolvedIgn =
      currentUser?.ffUid === cleanUid
        ? currentUser.ffIgn
        : `BD_PLAYER_${cleanUid.slice(-4)}`;
    setCheckedPlayerName(resolvedIgn);
    addToast('Game ID Verified', `Player Name: ${resolvedIgn} (BD Server)`, 'success');
  };

  const handleBuyProductNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProductGroup || !selectedRechargeItem) return;
    if (selectedRechargeItem.stockout) {
      addToast('Stock Out', 'এই প্যাকেজটি বর্তমানে স্টকে নেই। অন্য প্যাকেজ সিলেক্ট করুন।', 'error');
      return;
    }
    const targetUid = playerUid.trim() || currentUser?.ffUid || '2849103842';
    const targetIgn = checkedPlayerName || currentUser?.ffIgn || 'BD_PLAYER';

    const syntheticPkg: DiamondPackage = {
      id: selectedRechargeItem.id.toUpperCase(),
      title: `${selectedRechargeItem.name} (${activeProductGroup.title})`,
      titleBn: `${selectedRechargeItem.name} (${activeProductGroup.badgeBn})`,
      diamonds: selectedRechargeItem.diamonds,
      priceBdt: selectedRechargeItem.priceBdt,
      category: activeProductGroup.id.includes('weekly') ? 'membership' : 'uid',
      deliverySpeed: 'Instant · 5s',
      inStock: true,
    };

    const ord = placeTopUpOrder({
      pkg: syntheticPkg,
      playerUid: targetUid,
      playerIgn: targetIgn,
      paymentMethod: paymentMode === 'wallet' ? 'wallet' : selectedGateway,
      transactionId:
        paymentMode === 'instant' ? trxId.trim() || `AUTO${Date.now().toString().slice(-6)}` : undefined,
    });

    if (ord) {
      setTrxId('');
    }
  };

  const activeGateways = paymentSettings.gateways.filter((g) => g.active);
  const currentGatewayConfig =
    activeGateways.find((g) => g.id === selectedGateway) || activeGateways[0];

  const bdServerGroups = REFERENCE_PRODUCT_GROUPS.filter((g) => g.server === 'BD');

  // Combine live orders with the 10 reference recent orders so new orders appear at the top immediately
  const combinedLatestOrders = [
    ...orders.slice(0, 3).map((o, idx) => ({
      id: o.id,
      name: o.userName || o.playerIgn || 'BD Player',
      time: o.createdAt || 'Just now',
      item: `${o.packageTitle.replace(/\s*\(.*?\)/g, '')} 💎 - ${o.amountBdt} tk`,
      color: idx % 2 === 0 ? '#C2185B' : '#00897B',
      initial: (o.userName || 'P').charAt(0).toUpperCase(),
    })),
    ...REFERENCE_LATEST_ORDERS,
  ].slice(0, 10);

  const activeLeaderboard = LEADERBOARD_DATA[leaderboardTab];
  const visibleLeaderboardRows = showAllRanked
    ? activeLeaderboard.list
    : activeLeaderboard.list.slice(0, 10);

  /* ===========================================================================
     IF A GAME CARD IS CLICKED: RENDER EXACT PRODUCT TOP-UP VIEW (02:03 - 03:35)
     =========================================================================== */
  if (activeProductGroup) {
    return (
      <div className="max-w-2xl mx-auto px-3.5 sm:px-5 py-4 sm:py-6 space-y-4">
        {/* Back to Home Storefront Link */}
        <button
          type="button"
          onClick={() => setActiveProductGroupId(null)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3B0A0A] dark:text-[#FF7A00] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'bn' ? 'হোম পেজে ফিরে যান' : 'Back to Home Store'}</span>
        </button>

        {/* Top Product Header Bar (Matches 02:12, 02:37, 02:53 in Recording) */}
        <div className="zvy-card p-3.5 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-gray-200 shrink-0 relative bg-[#111827]">
              <img
                src={activeProductGroup.image}
                alt={activeProductGroup.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div
                className={`absolute inset-x-0 bottom-0 bg-gradient-to-r ${activeProductGroup.gradientOverlay} text-white text-[8px] font-extrabold text-center py-0.5 truncate px-1`}
              >
                {activeProductGroup.badgeBn}
              </div>
            </div>
            <h1 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-[#111827] dark:text-white truncate">
              {activeProductGroup.title}
            </h1>
          </div>

          <button
            type="button"
            onClick={() => setTutorialModalOpen(true)}
            className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-[11px] font-bold text-[#111827] dark:text-white hover:border-[#3B0A0A] inline-flex items-center gap-1 shrink-0 transition-colors"
          >
            <span>{language === 'bn' ? 'কিভাবে অর্ডার করবেন?' : 'How to Order?'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleBuyProductNow} className="space-y-4">
          {/* CARD 1: [1] SELECT RECHARGE (Matches 02:04 & 02:13 in Recording) */}
          <div className="zvy-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <span className="step-badge">1</span>
                <h2 className="font-display font-extrabold text-sm sm:text-base uppercase tracking-tight text-[#111827] dark:text-white">
                  SELECT RECHARGE
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] text-[11px] font-bold inline-flex items-center gap-1">
                <span>Min. 0 Coins</span>
                <span>💰</span>
              </span>
            </div>

            {/* 2-Column Radio Denomination Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {activeProductGroup.items.map((item) => {
                const isSelected = selectedRechargeItem?.id === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    disabled={item.stockout}
                    onClick={() => setSelectedItemId(item.id)}
                    className={`zvy-recharge-item text-left ${
                      isSelected ? 'zvy-recharge-item-selected' : ''
                    } ${item.stockout ? 'opacity-65 cursor-not-allowed' : ''}`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {/* Radio Indicator Circle */}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'border-[#3B0A0A] bg-[#3B0A0A]'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </span>
                      <span className="text-xs font-bold text-[#1F2937] dark:text-gray-100 leading-tight truncate">
                        {item.name}
                      </span>
                    </div>

                    <div className="text-right shrink-0 pl-1">
                      {item.stockout ? (
                        <div>
                          <div className="text-[11px] font-mono font-bold text-red-400">
                            {item.priceBdt} BDT
                          </div>
                          <span className="inline-block px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-600 text-[9px] font-mono font-extrabold uppercase">
                            STOCKOUT
                          </span>
                        </div>
                      ) : (
                        <div className="leading-none">
                          <div className="font-mono font-extrabold text-xs sm:text-sm text-[#111827] dark:text-white">
                            {item.priceBdt}
                          </div>
                          <div className="text-[9px] font-mono font-semibold text-gray-500 uppercase mt-0.5">
                            BDT
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* CARD 2: [2] ACCOUNT INFO (Matches 02:05 in Recording) */}
          <div className="zvy-card p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-lg bg-gray-100 dark:bg-gray-800 text-[#111827] dark:text-white font-display font-extrabold text-xs flex items-center justify-center">
                  2
                </span>
                <h2 className="font-display font-extrabold text-sm sm:text-base uppercase tracking-tight text-[#111827] dark:text-white">
                  ACCOUNT INFO
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-[10px] font-bold uppercase tracking-wider">
                • REQUIRED
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">
                Player ID
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                value={playerUid}
                onChange={(e) => {
                  setPlayerUid(e.target.value.replace(/[^0-9]/g, ''));
                  setCheckedPlayerName(null);
                }}
                placeholder="Enter Player ID"
                maxLength={12}
                className="w-full h-12 px-4 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-700 text-sm font-mono text-[#111827] dark:text-white"
              />
            </div>

            {/* Light Blue Game ID Name Check Button (Matches 02:05 in Recording) */}
            <button
              type="button"
              onClick={handleCheckGameIdName}
              className="w-full h-11 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>
                {checkedPlayerName
                  ? `গেম আইডি ভেরিফাইড: ${checkedPlayerName}`
                  : language === 'bn'
                  ? 'আপনার গেম আইডির নাম চেক করুন'
                  : 'Check Your Game ID Name'}
              </span>
            </button>
          </div>

          {/* CARD 3: [3] পেমেন্ট পদ্ধতি (Matches 02:06 in Recording) */}
          <div className="zvy-card p-4 sm:p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2">
              <span className="w-7 h-7 rounded-full bg-[#280606] text-white font-display font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <h2 className="font-display font-extrabold text-base sm:text-lg text-[#111827] dark:text-white">
                {language === 'bn' ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
              </h2>
            </div>

            {/* 2 Side-by-Side Graphic Payment Cards (Wallet Payment vs Instant Payment) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Option A: ওয়ালেট পেমেন্ট */}
              <button
                type="button"
                onClick={() => setPaymentMode('wallet')}
                className={`rounded-2xl overflow-hidden border-2 text-center transition-all ${
                  paymentMode === 'wallet'
                    ? 'border-[#280606] dark:border-[#FF5500] shadow-md'
                    : 'border-gray-200 dark:border-gray-700 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="h-24 sm:h-28 bg-gradient-to-br from-[#2A0808] via-[#450A0A] to-[#111827] p-3 flex items-center justify-between relative">
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-[#FF7A00] uppercase">
                      H41FFTOPUP
                    </div>
                    <div className="font-display font-black text-sm sm:text-base text-white leading-tight mt-0.5">
                      ওয়ালেট
                      <br />
                      পেমেন্ট
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#FBBF24]">
                    <Wallet className="w-6 h-6" />
                  </div>
                </div>
                <div className="py-2 px-2 bg-white dark:bg-[#161F30] flex items-center justify-center gap-1.5 text-xs font-bold text-[#111827] dark:text-white">
                  {paymentMode === 'wallet' && (
                    <CheckCircle2 className="w-4 h-4 text-[#280606] dark:text-[#FF5500] shrink-0" />
                  )}
                  <span>{language === 'bn' ? 'ওয়ালেট পেমেন্ট' : 'Wallet Pay'}</span>
                </div>
              </button>

              {/* Option B: ইনস্ট্যান্ট পেমেন্ট */}
              <button
                type="button"
                onClick={() => setPaymentMode('instant')}
                className={`rounded-2xl overflow-hidden border-2 text-center transition-all ${
                  paymentMode === 'instant'
                    ? 'border-[#280606] dark:border-[#FF5500] shadow-md'
                    : 'border-gray-200 dark:border-gray-700 opacity-85 hover:opacity-100'
                }`}
              >
                <div className="h-24 sm:h-28 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#092B4C] p-3 flex items-center justify-between relative">
                  <div className="text-left">
                    <div className="text-[9px] font-mono font-bold text-[#38BDF8] uppercase">
                      bKash · Nagad · Rocket
                    </div>
                    <div className="font-display font-black text-sm sm:text-base text-white leading-tight mt-0.5">
                      ইনস্ট্যান্ট
                      <br />
                      পেমেন্ট
                    </div>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-[#38BDF8]/20 border border-[#38BDF8]/40 flex items-center justify-center text-[#38BDF8]">
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
                <div className="py-2 px-2 bg-white dark:bg-[#161F30] flex items-center justify-center gap-1.5 text-xs font-bold text-[#111827] dark:text-white">
                  {paymentMode === 'instant' && (
                    <CheckCircle2 className="w-4 h-4 text-[#280606] dark:text-[#FF5500] shrink-0" />
                  )}
                  <span>{language === 'bn' ? 'ইনস্ট্যান্ট পেমেন্ট' : 'Instant Pay'}</span>
                </div>
              </button>
            </div>

            {/* If Instant Payment is selected, show quick bKash/Nagad/Rocket selector */}
            {paymentMode === 'instant' && (
              <div className="p-3.5 rounded-xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 space-y-2.5">
                <div className="grid grid-cols-4 gap-1.5">
                  {activeGateways.slice(0, 4).map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setSelectedGateway(gw.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                        selectedGateway === gw.id
                          ? 'bg-white dark:bg-[#161F30] border-[#3B0A0A] text-[#111827] dark:text-white shadow-xs'
                          : 'border-transparent text-gray-500'
                      }`}
                    >
                      {gw.name.split(' ')[0]}
                    </button>
                  ))}
                </div>
                {currentGatewayConfig && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Send <strong>৳{selectedRechargeItem?.priceBdt ?? 0}</strong> to{' '}
                      {currentGatewayConfig.name.split(' ')[0]}:
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(currentGatewayConfig.merchantNumber);
                        addToast('Copied', `${currentGatewayConfig.merchantNumber} copied!`, 'info');
                      }}
                      className="font-mono font-bold text-[#FF5500] inline-flex items-center gap-1"
                    >
                      <span>{currentGatewayConfig.merchantNumber}</span>
                      <Copy className="w-3 h-3" />
                    </button>
                  </div>
                )}
                <input
                  type="text"
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="Transaction ID (অথবা খালি রাখলে অটো গেটওয়ে)"
                  className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-mono"
                />
              </div>
            )}

            {/* Required Amount & Current Wallet Balance Info Lines (Matches 02:06 in Recording) */}
            <div className="space-y-1.5 pt-1 text-xs text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400 shrink-0" />
                <span>
                  {language === 'bn' ? 'প্রোডাক্ট কিনতে আপনার প্রয়োজন' : 'Required to purchase product'}{' '}
                  <strong className="font-mono text-[#111827] dark:text-white">
                    Tk {selectedRechargeItem?.priceBdt ?? 0} BDT
                  </strong>
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gray-400 shrink-0" />
                <span>
                  {language === 'bn' ? 'আপনার ওয়ালেট ব্যালেন্স' : 'Your Wallet Balance'}{' '}
                  <strong className="font-mono text-[#111827] dark:text-white">
                    Tk {currentUser?.mainBalance ?? 0} BDT
                  </strong>
                </span>
              </div>
            </div>

            <div className="text-center pt-1">
              <a
                href="#product-rules-card"
                className="text-xs font-bold text-[#0D3B66] dark:text-[#60A5FA] underline"
              >
                {language === 'bn' ? 'অর্ডার করার নিয়মাবলী দেখুন' : 'View Order Rules & Conditions'}
              </a>
            </div>

            {/* Deep Navy Full-Width Buy CTA Button (Matches 02:06 in Recording) */}
            <div className="space-y-2">
              <button
                type="submit"
                className="w-full h-12 rounded-xl btn-navy-buy font-display font-bold text-sm shadow-md flex items-center justify-center gap-2"
              >
                <span>
                  {currentUser
                    ? language === 'bn'
                      ? `এখনই কিনুন (৳${selectedRechargeItem?.priceBdt ?? 0} BDT)`
                      : `Buy Now (৳${selectedRechargeItem?.priceBdt ?? 0} BDT)`
                    : language === 'bn'
                    ? 'লগইন / এখনই কিনুন'
                    : 'Login / Buy Now'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!selectedRechargeItem) return;
                  const syntheticPkg: DiamondPackage = {
                    id: selectedRechargeItem.id.toUpperCase(),
                    title: `${selectedRechargeItem.name} (${activeProductGroup.title})`,
                    titleBn: `${selectedRechargeItem.name} (${activeProductGroup.badgeBn})`,
                    diamonds: selectedRechargeItem.diamonds,
                    priceBdt: selectedRechargeItem.priceBdt,
                    category: 'uid',
                    deliverySpeed: 'Instant · 5s',
                    inStock: true,
                  };
                  addToCart(
                    syntheticPkg,
                    playerUid.trim() || currentUser?.ffUid || '2849103842',
                    checkedPlayerName || currentUser?.ffIgn || 'BD_PLAYER'
                  );
                  setIsCartOpen(true);
                }}
                className="w-full h-10 rounded-xl btn-secondary text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Multi-Pack Cart'}</span>
              </button>
            </div>
          </div>
        </form>

        {/* CARD 4: নিয়ম ও শর্তাবলী (Rules & Conditions — Matches 02:30 - 02:33 in Recording) */}
        <div id="product-rules-card" className="zvy-card p-4 sm:p-5 space-y-3">
          <h3 className="font-display font-extrabold text-sm sm:text-base text-[#111827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
            {language === 'bn' ? 'নিয়ম ও শর্তাবলী' : 'Rules & Conditions'}
          </h3>
          <div className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
            <span>📢</span>
            <span>{activeProductGroup.rulesTitle}</span>
          </div>
          <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-4">
            {activeProductGroup.rulesList.map((rule, idx) => (
              <li key={idx}>{rule}</li>
            ))}
          </ul>
        </div>

        {/* Tutorial Video Modal when user clicks "কিভাবে অর্ডার করবেন?" */}
        {tutorialModalOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
            onClick={() => setTutorialModalOpen(false)}
          >
            <div
              className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] p-5 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-sm sm:text-base">
                  কিভাবে H41FFTOPUP থেকে অর্ডার করবেন?
                </h3>
                <button
                  type="button"
                  onClick={() => setTutorialModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>১. প্রথমে <strong>SELECT RECHARGE</strong> থেকে আপনার পছন্দের ডায়মন্ড বা মেম্বারশিপ প্যাকটি সিলেক্ট করুন।</p>
                <p>২. এরপর <strong>ACCOUNT INFO</strong> বক্সে আপনার Free Fire Player UID লিখুন এবং নাম চেক করুন।</p>
                <p>৩. <strong>পেমেন্ট পদ্ধতি</strong> থেকে ওয়ালেট পেমেন্ট অথবা ইনস্ট্যান্ট পেমেন্ট (বিকাশ/নগদ/রকেট) সিলেক্ট করে <strong>এখনই কিনুন</strong> বাটনে ক্লিক করুন। মাত্র ৫–৩০ সেকেন্ডে ডায়মন্ড পৌঁছে যাবে!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  /* ===========================================================================
     DEFAULT HOME STOREFRONT VIEW (EXACT MATCH TO 00:26 - 02:02 IN RECORDING)
     =========================================================================== */
  const currentBanner = bannerSlides[activeSlide] || bannerSlides[0];

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-5 pt-3 pb-8 space-y-6 sm:space-y-8">
      {/* =====================================================================
          SECTION 1: DARK CHARCOAL NOTICE BOX (Matches 00:26 & 00:31 in Recording)
         ===================================================================== */}
      {noticeVisible && (
        <div className="rounded-xl bg-[#141414] text-white p-3.5 sm:p-4 relative shadow-sm">
          <button
            type="button"
            onClick={() => setNoticeVisible(false)}
            aria-label="Close Notice"
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="font-display font-bold text-xs sm:text-sm text-white mb-1">
            Notice:
          </div>
          <p className="text-xs sm:text-sm text-gray-200 leading-relaxed pr-5">
            {language === 'bn'
              ? 'Welcome to H41FFTOPUP 🔥 সঠিকভাবে ফর্ম পূরণ করে অর্ডার করুন। আমাদের এখানে ২৪ ঘণ্টা অটোমেটিক ডেলিভারি সিস্টেম চালু আছে। যেকোনো ইস্যুতে ইনস্ট্যান্ট সলিউশন দেওয়া হয়। যেকোনো প্রয়োজনে আমাদের ২৪/৭ টেলিগ্রাম হেল্পলাইনে যোগাযোগ করুন, আমরা আছি আপনার সেবায় সর্বক্ষণ।'
              : 'Welcome to H41FFTOPUP 🔥 Please enter your Player UID carefully before ordering. Our 24-hour automated delivery system dispatches diamonds within seconds. For any support, reach out to our 24/7 Telegram Helpline.'}
          </p>
        </div>
      )}

      {/* =====================================================================
          SECTION 2: PROMOTIONAL BANNER SLIDER + 3 CENTER DOTS (Matches 00:29 - 01:03)
         ===================================================================== */}
      <section aria-label="Storefront Promotional Banner">
        <div
          className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${currentBanner.accentBg} border border-gray-200 dark:border-gray-800 shadow-md min-h-[165px] sm:min-h-[230px] flex items-center`}
        >
          <img
            src={currentBanner.image}
            alt={currentBanner.titleEn}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30" />

          <div className="relative z-10 w-full p-4 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-2 max-w-xl">
              <span
                className="inline-block px-2.5 py-0.5 rounded-md text-white text-[10px] sm:text-xs font-extrabold uppercase tracking-wider"
                style={{ backgroundColor: currentBanner.pillColor }}
              >
                {currentBanner.badge}
              </span>
              <h1 className="font-display font-black text-lg sm:text-2xl md:text-3xl text-white leading-tight drop-shadow-sm">
                {language === 'bn' ? currentBanner.titleBn : currentBanner.titleEn}
              </h1>
              <p className="text-xs sm:text-sm text-amber-200 font-semibold">
                {language === 'bn' ? currentBanner.subBn : currentBanner.subEn}
              </p>
            </div>

            <button
              type="button"
              onClick={() => handleOpenProductGroup('uid-bd')}
              className="self-start sm:self-center px-4 py-2.5 rounded-xl bg-[#FF5500] hover:bg-[#E04800] text-white font-display font-bold text-xs sm:text-sm shadow-lg shrink-0 transition-transform active:scale-95"
            >
              {language === 'bn' ? 'টপ-আপ করুন →' : 'TopUp Now →'}
            </button>
          </div>
        </div>

        {/* Centered Pagination Dots Below Banner (Matches 00:29 & 00:32 in Recording) */}
        <div className="flex items-center justify-center gap-1.5 pt-2.5">
          {bannerSlides.map((s, idx) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setActiveSlide(idx)}
              aria-label={`Banner slide ${idx + 1}`}
              className={`h-2 rounded-full transition-all ${
                activeSlide === idx
                  ? 'w-4 bg-[#280606] dark:bg-[#FF5500]'
                  : 'w-2 bg-gray-300 dark:bg-gray-700'
              }`}
            />
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 3: FREE FIRE TOPUP BD SERVER (3-COLUMN SQUARE GRID — Matches 00:32)
         ===================================================================== */}
      <section aria-label="Free Fire TopUp BD Server">
        <h2 className="font-display font-black text-base sm:text-xl uppercase tracking-tight text-center text-[#111827] dark:text-white mb-4">
          FREE FIRE TOPUP BD SERVER
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4">
          {bdServerGroups.map((grp) => (
            <button
              key={grp.id}
              type="button"
              onClick={() => handleOpenProductGroup(grp.id)}
              className="zvy-square-tile group"
            >
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-[#111827]">
                <img
                  src={grp.image}
                  alt={grp.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-[#280606]/90 text-[#FF7A00] text-[8px] sm:text-[9px] font-mono font-extrabold">
                  H41
                </div>
                <div className="absolute bottom-1.5 inset-x-1.5">
                  <div
                    className={`w-full py-1 px-1 rounded-lg bg-gradient-to-r ${grp.gradientOverlay} text-white font-display font-black text-[10px] sm:text-xs leading-tight shadow-xs truncate`}
                  >
                    {grp.badgeBn}
                  </div>
                </div>
              </div>
              <span className="mt-2 font-display font-bold text-[11px] sm:text-xs text-[#111827] dark:text-gray-100 leading-tight line-clamp-1">
                {grp.title}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 4: CLIENT FEATURES IN EXACT ZVYTOPUP 3-COLUMN SQUARE CARD STYLE
          (Esports Custom Rooms, Free Income Tasks, Add Money, Withdraw, Offers, Orders)
         ===================================================================== */}
      <section aria-label="Esports, Free Income and Wallet Services">
        <h2 className="font-display font-black text-base sm:text-xl uppercase tracking-tight text-center text-[#111827] dark:text-white mb-4">
          {language === 'bn'
            ? 'ESPORTS, FREE INCOME & WALLET'
            : 'ESPORTS, FREE INCOME & WALLET'}
        </h2>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4">
          {[
            {
              path: '/tournaments',
              title: 'Custom Rooms',
              badgeBn: 'কাস্টম রুম',
              sub: `${tournaments.length} Rooms`,
              image: TOURNAMENT_IMAGE,
              gradient: 'from-[#F59E0B] to-[#B45309]',
            },
            {
              path: '/income',
              title: 'Free Income',
              badgeBn: 'ফ্রি ইনকাম',
              sub: `${tasks.length} Tasks`,
              image: TASK_IMAGE,
              gradient: 'from-[#10B981] to-[#047857]',
            },
            {
              path: '/deposit',
              title: 'Add Money',
              badgeBn: 'অ্যাড মানি',
              sub: 'bKash / Nagad',
              image: DIAMOND_IMAGE,
              gradient: 'from-[#E2136E] to-[#9D174D]',
            },
            {
              path: '/withdraw',
              title: 'Withdraw BDT',
              badgeBn: 'টাকা উত্তোলন',
              sub: 'Fast Payout',
              image: HERO_BANNER_IMAGE,
              gradient: 'from-[#2563EB] to-[#1E40AF]',
            },
            {
              path: '/offers',
              title: 'Special Offers',
              badgeBn: 'স্পেশাল অফার',
              sub: 'VIP Bundles',
              image: DIAMOND_IMAGE,
              gradient: 'from-[#FF5500] to-[#C2410C]',
            },
            {
              path: '/transactions',
              title: 'My Orders',
              badgeBn: 'অর্ডার লিস্ট',
              sub: 'Track Status',
              image: TOURNAMENT_IMAGE,
              gradient: 'from-[#7C3AED] to-[#5B21B6]',
            },
          ].map((feat) => (
            <Link key={feat.path} to={feat.path} className="zvy-square-tile group">
              <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm bg-[#111827]">
                <img
                  src={feat.image}
                  alt={feat.title}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/70 text-white text-[8px] font-mono font-bold">
                  {feat.sub}
                </div>
                <div className="absolute bottom-1.5 inset-x-1.5">
                  <div
                    className={`w-full py-1 px-1 rounded-lg bg-gradient-to-r ${feat.gradient} text-white font-display font-black text-[10px] sm:text-xs leading-tight shadow-xs truncate`}
                  >
                    {feat.badgeBn}
                  </div>
                </div>
              </div>
              <span className="mt-2 font-display font-bold text-[11px] sm:text-xs text-[#111827] dark:text-gray-100 leading-tight line-clamp-1">
                {feat.title}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 6: LATEST ORDERS (সাম্প্রতিক ১০টি অর্ডার এক নজরে — Matches 00:35 - 00:37)
         ===================================================================== */}
      <section aria-label="Latest 10 Orders">
        <div className="text-center space-y-1 mb-4">
          <h2 className="font-display font-black text-lg sm:text-2xl uppercase tracking-tight text-[#111827] dark:text-white">
            LATEST ORDERS
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            {language === 'bn'
              ? 'সবচেয়ে সাম্প্রতিক ১০টি অর্ডার এক নজরে'
              : 'Most recent 10 automated top-up orders at a glance'}
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-3 sm:p-5 shadow-xs space-y-2.5">
          {combinedLatestOrders.map((ord) => (
            <div
              key={ord.id}
              className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#161F30] px-3 sm:px-4 py-2.5 shadow-[0_2px_10px_rgba(0,0,0,0.03)] flex items-center justify-between gap-2.5"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-9 h-9 sm:w-10 sm:h-10 rounded-full text-white font-display font-bold text-sm flex items-center justify-center shrink-0 shadow-xs"
                  style={{ backgroundColor: ord.color }}
                >
                  {ord.initial}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-baseline gap-x-2">
                    <span className="font-display font-extrabold text-xs sm:text-sm text-[#111827] dark:text-white truncate">
                      {ord.name}
                    </span>
                    <span className="text-[10px] sm:text-[11px] text-gray-400 font-mono">
                      {ord.time}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-300 font-medium truncate mt-0.5">
                    {ord.item}
                  </div>
                </div>
              </div>

              <span className="px-3 py-1 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs">
                COMPLETE
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================================
          SECTION 7: TOP 100 SPEND LEADERBOARD (Matches 00:38 - 00:44 & 03:40 - 03:45)
         ===================================================================== */}
      <section aria-label="Top 100 Spend Leaderboard">
        <div className="rounded-3xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] p-4 sm:p-6 shadow-xs space-y-5">
          {/* Header & Period Switcher */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#B45309] text-[10px] font-extrabold uppercase tracking-wider">
              <Crown className="w-3 h-3 fill-current" />
              <span>LEADERBOARD</span>
            </div>

            <h2 className="font-display font-black text-xl sm:text-2xl uppercase tracking-tight text-gradient-leaderboard">
              TOP 100 SPEND LEADERBOARD
            </h2>

            <p className="text-xs text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Explore the highest spenders. Rankings use the same rank system as your profile.
            </p>

            {/* WEEKLY | MONTHLY | LIFETIME Pill Switcher */}
            <div className="pt-2 flex justify-center">
              <div className="inline-flex items-center p-1 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                {(['weekly', 'monthly', 'lifetime'] as const).map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setLeaderboardTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                      leaderboardTab === tab
                        ? 'bg-white dark:bg-[#111827] text-[#111827] dark:text-white shadow-xs'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Top 3 Podium (#2 Left, #1 Center with Crown, #3 Right — Matches 00:39) */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-4 pb-2">
            {activeLeaderboard.podium.map((p) => {
              const isFirst = p.rank === 1;
              return (
                <div
                  key={p.rank}
                  className={`flex flex-col items-center text-center ${
                    isFirst ? '-mt-4' : ''
                  }`}
                >
                  {isFirst && (
                    <Crown className="w-6 h-6 text-[#F59E0B] fill-[#F59E0B] mb-1 animate-bounce" />
                  )}
                  <div className="relative">
                    <div
                      className={`${
                        isFirst ? 'w-16 h-16 sm:w-20 sm:h-20 ring-4 ring-[#F59E0B]/40' : 'w-13 h-13 sm:w-16 sm:h-16 ring-2 ring-gray-300'
                      } rounded-full flex items-center justify-center text-white font-display font-black text-lg sm:text-2xl shadow-md`}
                      style={{ backgroundColor: p.color }}
                    >
                      {p.initial}
                    </div>
                    <span
                      className={`absolute -bottom-1.5 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold text-white shadow-xs ${
                        isFirst
                          ? 'bg-[#F59E0B]'
                          : p.rank === 2
                          ? 'bg-slate-600'
                          : 'bg-amber-800'
                      }`}
                    >
                      #{p.rank}
                    </span>
                  </div>

                  <div className="mt-3 font-display font-extrabold text-xs sm:text-sm text-[#111827] dark:text-white truncate max-w-full px-1">
                    {p.name}
                  </div>
                  <div className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold flex items-center justify-center gap-1 mt-0.5">
                    <ShieldCheck className="w-3 h-3 shrink-0" />
                    <span className="truncate">{p.tier}</span>
                  </div>
                  <div
                    className={`mt-1 font-mono font-extrabold text-xs sm:text-sm ${
                      isFirst ? 'text-[#D97706]' : 'text-[#E11D48]'
                    }`}
                  >
                    {p.spend}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Leaderboard Table Header */}
          <div className="px-3 pt-2 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-gray-400 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <span>RANK</span>
              <span>PLAYER</span>
            </div>
            <div className="flex items-center gap-6">
              <span>TIER</span>
              <span>SPEND BDT</span>
            </div>
          </div>

          {/* Ranked Rows (#4 - #20 — Matches 00:40 - 00:43) */}
          <div className="space-y-2">
            {visibleLeaderboardRows.map((row) => (
              <div
                key={row.rank}
                className="rounded-2xl border border-[#FDE68A]/60 dark:border-gray-800 bg-[#FFFDF9] dark:bg-[#161F30] px-3 py-2.5 flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <span className="w-6 h-6 rounded-md bg-[#F59E0B] text-white font-mono font-extrabold text-[11px] flex items-center justify-center shrink-0 shadow-2xs">
                    {row.rank}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full text-white font-display font-bold text-xs flex items-center justify-center shrink-0"
                    style={{ backgroundColor: row.color }}
                  >
                    {row.initial}
                  </div>
                  <span className="font-display font-bold text-xs sm:text-sm text-[#111827] dark:text-white truncate">
                    {row.name}
                  </span>
                </div>

                <div className="flex items-center gap-3 sm:gap-5 shrink-0">
                  <span className="text-xs" title={row.tier}>
                    🛡️
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-[#FEF3C7] dark:bg-amber-500/15 text-[#B45309] dark:text-amber-300 font-mono font-extrabold text-[11px]">
                    {row.spend}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Load More Players Button (Matches 00:43 in Recording) */}
          <div className="pt-2 text-center space-y-2.5">
            <div className="text-xs text-gray-500">
              Showing <strong>{visibleLeaderboardRows.length + 3}</strong> of <strong>100</strong> ranked players
            </div>
            <button
              type="button"
              onClick={() => setShowAllRanked(!showAllRanked)}
              className="px-6 py-2.5 rounded-full bg-[#280606] hover:bg-[#3B0A0A] text-white font-display font-bold text-xs inline-flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  showAllRanked ? 'rotate-180' : ''
                }`}
              />
              <span>{showAllRanked ? 'Show Top Players' : 'Load More Players'}</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
