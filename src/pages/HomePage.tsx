import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap,
  Trophy,
  Coins,
  ShieldCheck,
  ArrowRight,
  Clock,
  CheckCircle2,
  Tag,
  HelpCircle,
  Star,
  MessageSquare,
  BookOpen,
  Wallet,
  Award,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  HERO_BANNER_IMAGE,
  DIAMOND_IMAGE,
  TOURNAMENT_IMAGE,
  TASK_IMAGE,
} from '../data/seedData';

export const HomePage: React.FC = () => {
  const {
    language,
    packages,
    tournaments,
    tasks,
    blogPosts,
    reviews,
    addToCart,
    setIsCartOpen,
    currentUser,
  } = useApp();

  const [quickUid, setQuickUid] = useState(currentUser?.ffUid || '');
  const [selectedQuickPkg, setSelectedQuickPkg] = useState(packages[1]?.id || 'pkg-2');

  const popularPackages = packages.filter((p) => p.category === 'uid').slice(0, 4);
  const openTournamentsCount = tournaments.filter((t) => t.status !== 'Completed').length;
  const activeTasksCount = tasks.filter((t) => t.active).length;
  const specialOffersCount = packages.filter(
    (p) => p.category === 'special' || p.category === 'membership'
  ).length;

  const handleInstantDispatch = () => {
    const chosen = packages.find((p) => p.id === selectedQuickPkg) || popularPackages[0];
    if (chosen) {
      addToCart(chosen, quickUid || currentUser?.ffUid || '2849103842');
      setIsCartOpen(true);
    }
  };

  return (
    <div className="space-y-14 sm:space-y-20 pb-16 overflow-x-hidden">
      {/* =====================================================================
          1. ARCHITECTURAL HERO COMMAND DECK (BENTO GRID + VISUAL FOCAL POINT)
         ===================================================================== */}
      <section className="relative pt-5 sm:pt-10 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-stretch">
            {/* Left 7 Cols: Bold Brand Authority, Hero Artwork Banner & Primary Gateways */}
            <div className="lg:col-span-7 card-premium rounded-2xl p-6 sm:p-10 lg:p-11 flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10 space-y-5">
                <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-[0.14em] text-[#2563EB] dark:text-[#60A5FA]">
                  <span>BANGLADESH #1 UNIFIED ESPORTS & REWARDS PLATFORM</span>
                </div>

                <h1 className="font-display font-extrabold text-3xl sm:text-5xl lg:text-[3.35rem] tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-[1.08]">
                  {language === 'en' ? (
                    <>
                      Instant FF Top-Up,{' '}
                      <span className="text-gradient-brand">Pro Arenas</span> & Verified Rewards.
                    </>
                  ) : (
                    <>
                      ইনস্ট্যান্ট ডায়মন্ড টপ-আপ,{' '}
                      <span className="text-gradient-brand">প্রো টুর্নামেন্ট</span> এবং ভেরিফায়েড আয়।
                    </>
                  )}
                </h1>

                <p className="text-[#475569] dark:text-[#94A3B8] text-sm sm:text-base lg:text-[1.0625rem] leading-relaxed max-w-2xl">
                  {language === 'en'
                    ? 'A unified multi-page gaming ecosystem engineered for Bangladeshi Free Fire players. Navigate dedicated pages for 30-second UID Diamond Top-Ups, daily custom rooms, and transparent micro-task income backed by bKash, Nagad, Rocket & Upay.'
                    : 'বাংলাদেশি ফ্রি ফায়ার প্লেয়ারদের জন্য তৈরি পূর্ণাঙ্গ মাল্টি-পেজ গেমিং ও ফিনটেক প্ল্যাটফর্ম। ৩০ সেকেন্ডে ডায়মন্ড ডেলিভারি, কাস্টম রুম টুর্নামেন্ট এবং বিকাশ/নগদ/রকেটে দ্রুত পেমেন্ট।'}
                </p>

                {/* Framed Esports Arena Visual Focal Banner */}
                <div className="relative rounded-xl overflow-hidden border border-[#E2E8F0] dark:border-[#1E2D4A] aspect-[21/9] bg-[#060A12]">
                  <img
                    src={HERO_BANNER_IMAGE}
                    alt="Free Income BD Esports Arena and Instant UID Diamond Dispatch"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060A12]/90 via-[#060A12]/35 to-transparent flex items-end justify-between p-4 sm:p-5">
                    <div>
                      <div className="text-[11px] font-mono uppercase tracking-wider text-[#34D399] font-semibold">
                        DHAKA SERVER NODE · ZERO PASSWORD TOP-UP
                      </div>
                      <div className="font-display text-sm sm:text-base font-bold text-white mt-0.5">
                        Official Garena BD UID Dispatch & Referee-Moderated Custom Rooms
                      </div>
                    </div>
                    <Link
                      to="/offers"
                      className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white/15 hover:bg-white/25 backdrop-blur-md text-white text-xs font-semibold transition-colors shrink-0"
                    >
                      <span>VIP Offers</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="relative z-10 pt-6 sm:pt-7 space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <Link
                    to="/topup"
                    className="min-h-[46px] btn-primary px-6 py-3 rounded-xl font-display font-bold text-sm flex items-center justify-center gap-2"
                  >
                    <Zap className="w-4 h-4 shrink-0" />
                    <span>
                      {language === 'en' ? 'Diamond Top-Up Store' : 'ডায়মন্ড টপ-আপ স্টোর'}
                    </span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </Link>
                  <Link
                    to="/tournaments"
                    className="min-h-[46px] btn-secondary px-5 py-3 rounded-xl font-display font-bold text-sm text-[#0F172A] dark:text-[#F8FAFC] flex items-center justify-center gap-2"
                  >
                    <Trophy className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <span>{language === 'en' ? 'Browse Tournaments' : 'টুর্নামেন্ট দেখুন'}</span>
                  </Link>
                  <Link
                    to="/income"
                    className="min-h-[46px] btn-secondary px-5 py-3 rounded-xl font-display font-bold text-sm text-[#10B981] dark:text-[#34D399] flex items-center justify-center gap-2"
                  >
                    <Coins className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>{language === 'en' ? 'Free Income Tasks' : 'ফ্রি ইনকাম টাস্ক'}</span>
                  </Link>
                </div>

                {/* Trust Strip */}
                <div className="pt-5 border-t border-[#E2E8F0] dark:border-[#1E2D4A] grid grid-cols-3 gap-3 text-left">
                  <div className="flex items-center gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        Zero ID Login
                      </div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] hidden sm:block">
                        100% Ban-Safe UID
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-[#F59E0B] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        28s Dispatch
                      </div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] hidden sm:block">
                        24/7 Automated Node
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        4.9/5 Rating
                      </div>
                      <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] hidden sm:block">
                        48,920+ BD Gamers
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Cols: Express 1-Click UID Top-Up Terminal */}
            <div className="lg:col-span-5 card-premium rounded-2xl p-6 sm:p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="space-y-5">
                <div className="flex items-center justify-between border-b border-[#E2E8F0] dark:border-[#1E2D4A] pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/25 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-display font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        {language === 'en'
                          ? 'Express UID Top-Up Terminal'
                          : 'এক্সপ্রেস ইউআইডি টপ-আপ টার্মিনাল'}
                      </h2>
                      <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                        {language === 'en'
                          ? 'Select a popular pack or open the full store'
                          : 'প্যাকেজ নির্বাচন করুন অথবা সম্পূর্ণ স্টোরে যান'}
                      </p>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md border border-[#10B981]/25">
                    BD SERVER
                  </span>
                </div>

                {/* Step 1: UID Input */}
                <div>
                  <label className="block text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC] mb-1.5">
                    1. Free Fire Player UID (SG/BD Server)
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quickUid}
                    onChange={(e) => setQuickUid(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="e.g. 2849103842"
                    maxLength={12}
                    className="w-full min-h-[44px] px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#060A12] border border-[#E2E8F0] dark:border-[#1E2D4A] text-sm font-mono text-[#0F172A] dark:text-[#F8FAFC]"
                  />
                </div>

                {/* Step 2: 2x2 Quick Package Selector */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                      2. Select Diamond Denomination
                    </label>
                    <Link
                      to="/topup"
                      className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                    >
                      All {packages.length} Packages →
                    </Link>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {popularPackages.map((pkg) => {
                      const isSelected = selectedQuickPkg === pkg.id;
                      return (
                        <button
                          key={pkg.id}
                          type="button"
                          onClick={() => setSelectedQuickPkg(pkg.id)}
                          className={`min-h-[68px] p-3.5 rounded-xl border text-left transition-all ${
                            isSelected
                              ? 'border-[#2563EB] bg-[#2563EB]/10 dark:bg-[#2563EB]/15 ring-1 ring-[#2563EB]'
                              : 'border-[#E2E8F0] dark:border-[#1E2D4A] bg-[#F8FAFC] dark:bg-[#060A12]/60 hover:border-[#2563EB]/60'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-xs font-display font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                              💎 {pkg.diamonds}
                            </span>
                            {pkg.discountBadge && (
                              <span className="text-[10px] font-mono font-bold text-[#10B981]">
                                {pkg.discountBadge}
                              </span>
                            )}
                          </div>
                          <div className="mt-1.5 flex items-baseline justify-between">
                            <span className="text-sm font-mono font-extrabold text-[#2563EB] dark:text-[#60A5FA]">
                              ৳{pkg.priceBdt}
                            </span>
                            {pkg.originalPriceBdt && (
                              <span className="text-[10px] font-mono text-[#64748B] line-through">
                                ৳{pkg.originalPriceBdt}
                              </span>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-[#E2E8F0] dark:border-[#1E2D4A] space-y-3">
                <button
                  onClick={handleInstantDispatch}
                  className="w-full min-h-[46px] py-3 rounded-xl btn-primary font-display font-bold text-sm flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {language === 'en' ? 'Instant Checkout Now' : 'এখনই ইনস্ট্যান্ট টপ-আপ করুন'}
                  </span>
                </button>
                <div className="flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
                  <span>Supports Wallet, bKash, Nagad, Rocket</span>
                  <Link
                    to="/topup"
                    className="font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
                  >
                    Custom Calculator →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Metric Quantitative Strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5 mt-6 reveal-on-scroll">
            {[
              {
                label: 'Diamonds Delivered',
                value: '14.8M+',
                sub: 'Avg 28s UID Dispatch',
                color: 'text-[#2563EB] dark:text-[#60A5FA]',
              },
              {
                label: 'Tournament Prize Paid',
                value: '৳8,45,000+',
                sub: 'Daily Custom Rooms',
                color: 'text-[#F59E0B] dark:text-[#FBBF24]',
              },
              {
                label: 'Task Rewards Settled',
                value: '৳4,12,500+',
                sub: 'Zero False Claims',
                color: 'text-[#10B981] dark:text-[#34D399]',
              },
              {
                label: 'Verified BD Players',
                value: '48,920+',
                sub: '99.94% Order Success',
                color: 'text-[#0F172A] dark:text-[#F8FAFC]',
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="card-premium rounded-2xl p-4 sm:p-5 flex flex-col justify-between"
              >
                <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">
                  {stat.label}
                </span>
                <div className={`text-xl sm:text-2xl font-mono font-extrabold mt-1 ${stat.color}`}>
                  {stat.value}
                </div>
                <span className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] mt-1">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          2. MULTI-PAGE PLATFORM DIRECTORY (DEDICATED DESTINATIONS BENTO)
         ===================================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-widest text-[#2563EB] dark:text-[#60A5FA] mb-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>
                {language === 'en'
                  ? 'DEDICATED MULTI-PAGE ARCHITECTURE'
                  : 'ডেডিকেটেড মাল্টি-পেজ প্ল্যাটফর্ম'}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold text-[#0F172A] dark:text-[#F8FAFC] tracking-tight">
              {language === 'en'
                ? 'Explore Every Platform Destination'
                : 'প্ল্যাটফর্মের প্রতিটি আলাদা পেজ ঘুরে দেখুন'}
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
              {language === 'en'
                ? 'Every core service, community hub, and fintech tool lives on its own specialized page with dedicated tools and live telemetry.'
                : 'প্রতিটি মূল সার্ভিস, কমিউনিটি হাব এবং ফিনটেক টুল নিজস্ব আলাদা পেজে সাজানো হয়েছে।'}
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
            <span>22 Dedicated Routes</span>
            <span>•</span>
            <Link
              to="/about"
              className="text-[#2563EB] dark:text-[#60A5FA] font-semibold hover:underline"
            >
              Platform Architecture →
            </Link>
          </div>
        </div>

        {/* Primary 3 Core Pillars (Large Visual Cards with Customer Artwork) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Pillar 1: Diamond Top-Up */}
          <Link
            to="/topup"
            className="card-premium card-premium-interactive rounded-2xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#060A12] border-b border-[#E2E8F0] dark:border-[#1E2D4A]">
                <img
                  src={DIAMOND_IMAGE}
                  alt="Free Fire Diamond Top-Up Store"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA]">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#2563EB] dark:text-[#60A5FA] bg-[#2563EB]/10 px-2.5 py-1 rounded-md">
                    /topup · {packages.length} Packs
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                  Free Fire Diamond Top-Up Store
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  UID Instant Top-Up, UniPin Voucher PINs, Custom Diamond Calculator, Wishlist, and live Order ID Status Tracker.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center justify-between text-xs font-bold text-[#2563EB] dark:text-[#60A5FA]">
              <span>Open Top-Up Page</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 2: Esports Tournaments */}
          <Link
            to="/tournaments"
            className="card-premium card-premium-interactive rounded-2xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#060A12] border-b border-[#E2E8F0] dark:border-[#1E2D4A]">
                <img
                  src={TOURNAMENT_IMAGE}
                  alt="Free Fire Esports Tournament Arena"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#F59E0B] bg-[#F59E0B]/10 px-2.5 py-1 rounded-md">
                    /tournaments · {openTournamentsCount} Active
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors">
                  Esports Tournament Arena
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Solo, Duo, Squad & 4v4 Clash Squad custom rooms. Encrypted Room ID & Password vault for registered competitors.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center justify-between text-xs font-bold text-[#F59E0B]">
              <span>Enter Tournament Lobby</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Pillar 3: Free Income Platform */}
          <Link
            to="/income"
            className="card-premium card-premium-interactive rounded-2xl overflow-hidden flex flex-col justify-between group"
          >
            <div>
              <div className="aspect-[16/9] w-full overflow-hidden bg-[#060A12] border-b border-[#E2E8F0] dark:border-[#1E2D4A]">
                <img
                  src={TASK_IMAGE}
                  alt="Verified Free Income Tasks & Referral Hub"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                    <Coins className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono font-bold text-[#10B981] bg-[#10B981]/10 px-2.5 py-1 rounded-md">
                    /income · {activeTasksCount} Tasks
                  </span>
                </div>
                <h3 className="text-xl font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                  Verified Free Income Hub
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  Transparent micro-tasks, social missions, referral bonuses, and proof submission workspace with strict anti-fraud audit.
                </p>
              </div>
            </div>
            <div className="px-6 pb-6 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center justify-between text-xs font-bold text-[#10B981]">
              <span>Start Earning Rewards</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Secondary 6 Dedicated Pages Grid (Offers, Leaderboard, Blog, Reviews, FAQ, Contact) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            to="/offers"
            className="card-premium card-premium-interactive rounded-2xl p-5 flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Tag className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors">
                  Special Offers & Passes
                </h3>
                <span className="text-[11px] font-mono text-[#F59E0B]">
                  {specialOffersCount} Deals
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">
                Weekly & Monthly VIP Membership matrix, Level Up Pass, and Squad Savings Estimator.
              </p>
            </div>
          </Link>

          <Link
            to="/leaderboard"
            className="card-premium card-premium-interactive rounded-2xl p-5 flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                  Hall of Fame Leaderboard
                </h3>
                <span className="text-[11px] font-mono text-[#2563EB] dark:text-[#60A5FA]">
                  Top Ranked
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">
                Verified tournament champions, kill rankings, and top task reward earners across Bangladesh.
              </p>
            </div>
          </Link>

          <Link
            to="/blog"
            className="card-premium card-premium-interactive rounded-2xl p-5 flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
              <BookOpen className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                  Blog & Gaming News
                </h3>
                <span className="text-[11px] font-mono text-[#10B981]">
                  {blogPosts.length} Articles
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">
                OB44 patch analyses, custom room tournament tactics, and UID security advisories.
              </p>
            </div>
          </Link>

          <Link
            to="/reviews"
            className="card-premium card-premium-interactive rounded-2xl p-5 flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B] shrink-0">
              <Star className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#F59E0B] transition-colors">
                  Player Reviews & Ratings
                </h3>
                <span className="text-[11px] font-mono text-[#F59E0B]">
                  4.9★ ({reviews.length})
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">
                Read verified feedback from Bangladeshi players or submit your own service rating.
              </p>
            </div>
          </Link>

          <Link
            to="/faq"
            className="card-premium card-premium-interactive rounded-2xl p-5 flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center text-[#2563EB] dark:text-[#60A5FA] shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#2563EB] dark:group-hover:text-[#60A5FA] transition-colors">
                  Help Center & FAQ
                </h3>
                <span className="text-[11px] font-mono text-[#2563EB] dark:text-[#60A5FA]">
                  Instant Answers
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">
                Complete documentation on UID delivery times, custom room rules, and wallet withdrawals.
              </p>
            </div>
          </Link>

          <Link
            to="/contact"
            className="card-premium card-premium-interactive rounded-2xl p-5 flex items-start gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-display font-bold text-[#0F172A] dark:text-[#F8FAFC] group-hover:text-[#10B981] transition-colors">
                  24/7 Support Desk
                </h3>
                <span className="text-[11px] font-mono text-[#10B981]">
                  Live Ticket
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1 line-clamp-2">
                Direct WhatsApp helpline, Telegram community channel, and priority ticket dispatch.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* =====================================================================
          3. UNIFIED TRIPLE-WALLET FINTECH ARCHITECTURE STRIP
         ===================================================================== */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 reveal-on-scroll">
        <div className="rounded-2xl p-6 sm:p-9 lg:p-11 bg-gradient-to-br from-[#0B1222] via-[#0D162B] to-[#0A2229] text-white border border-[#1E2D4A] shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-[#34D399]">
                <Wallet className="w-4 h-4" />
                <span>UNIFIED FINTECH WALLET ARCHITECTURE</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-display font-extrabold tracking-tight text-white">
                {language === 'en'
                  ? 'One Account. Three Dedicated Balances. Instant BD Settlements.'
                  : 'একটি অ্যাকাউন্ট। তিনটি আলাদা ব্যালেন্স। দ্রুত বাংলাদেশি পেমেন্ট।'}
              </h2>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
                {language === 'en'
                  ? 'Manage your Main Balance (for Diamond Top-Ups & Tournament entries), Income Balance (withdrawable to bKash, Nagad, Rocket & Upay), and Promotional Bonus Balance from dedicated fintech pages.'
                  : 'ডায়মন্ড টপ-আপ ও টুর্নামেন্টের জন্য মেইন ব্যালেন্স, বিকাশ/নগদে উত্তোলনের জন্য ইনকাম ব্যালেন্স এবং প্রমোশনাল বোনাস ব্যালেন্স—সবকিছু আলাদা পেজ থেকে নিয়ন্ত্রণ করুন।'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/wallet"
                  className="min-h-[44px] px-5 py-2.5 rounded-xl btn-emerald font-display font-bold text-xs sm:text-sm flex items-center gap-1.5"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Open Triple-Wallet</span>
                </Link>
                <Link
                  to="/deposit"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs sm:text-sm transition-all flex items-center"
                >
                  Add Money (/deposit)
                </Link>
                <Link
                  to="/withdraw"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs sm:text-sm transition-all flex items-center"
                >
                  Cashout (/withdraw)
                </Link>
                <Link
                  to="/transactions"
                  className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 font-semibold text-xs sm:text-sm transition-all flex items-center"
                >
                  Ledger (/transactions)
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
              <div className="p-4 rounded-xl bg-[#060A12]/80 border border-[#1E2D4A] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    1. Main Balance
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">Top-Ups & Entry Fees</div>
                </div>
                <span className="text-xs font-mono font-bold text-[#60A5FA]">
                  {currentUser ? `৳${currentUser.mainBalance}` : 'Instant Load'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#060A12]/80 border border-[#1E2D4A] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    2. Income Balance
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Tasks & Prize Cashouts
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#34D399]">
                  {currentUser ? `৳${currentUser.incomeBalance}` : 'Min ৳100 Cashout'}
                </span>
              </div>
              <div className="p-4 rounded-xl bg-[#060A12]/80 border border-[#1E2D4A] flex items-center justify-between">
                <div>
                  <div className="text-[11px] font-mono uppercase text-slate-400">
                    3. Bonus Balance
                  </div>
                  <div className="text-sm font-bold text-white mt-0.5">
                    Referral & Promo Credits
                  </div>
                </div>
                <span className="text-xs font-mono font-bold text-[#FBBF24]">
                  {currentUser ? `৳${currentUser.bonusBalance}` : '10% Discount Eligible'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
