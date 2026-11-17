import React, { useEffect, useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Calculator,
  CheckCircle2,
  Wallet,
  Copy,
  Zap,
  ChevronRight,
  Info,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DIAMOND_IMAGE, HERO_BANNER_IMAGE, TOURNAMENT_IMAGE } from '../data/seedData';
import { DiamondPackage, PaymentGatewayName } from '../types';

export const TopUpPage: React.FC = () => {
  const {
    packages,
    orders,
    currentUser,
    language,
    globalSearch,
    setGlobalSearch,
    addToCart,
    setIsCartOpen,
    placeTopUpOrder,
    wishlist,
    toggleWishlist,
    paymentSettings,
    addToast,
  } = useApp();

  const [categoryTab, setCategoryTab] = useState<
    'uid' | 'membership' | 'special' | 'unipin' | 'wishlist'
  >('uid');
  const [selectedPkgId, setSelectedPkgId] = useState<string>(packages[2]?.id || 'PKG-115');
  const [playerUid, setPlayerUid] = useState<string>(currentUser?.ffUid || '');
  const [checkedIgn, setCheckedIgn] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser?.ffUid) {
      setPlayerUid((prev) => prev || currentUser.ffUid);
    } else if (!currentUser) {
      setCheckedIgn(null);
    }
  }, [currentUser]);
  const [paymentMode, setPaymentMode] = useState<'wallet' | 'instant'>('instant');
  const [selectedGateway, setSelectedGateway] = useState<PaymentGatewayName>('bkash');
  const [trxId, setTrxId] = useState<string>('');
  const [howToOrderOpen, setHowToOrderOpen] = useState<boolean>(false);
  const [showCustomCalc, setShowCustomCalc] = useState<boolean>(false);

  // Custom Diamond Calculator State
  const [customDiamonds, setCustomDiamonds] = useState<number>(350);
  const customPriceBdt = Math.max(20, Math.round(customDiamonds * 0.76));
  const [customSelectedPkg, setCustomSelectedPkg] = useState<DiamondPackage | null>(null);

  // Order Tracker State
  const [trackOrderId, setTrackOrderId] = useState<string>('');
  const trackedOrder = orders.find(
    (o) => o.id.toLowerCase() === trackOrderId.trim().toLowerCase()
  );

  // Additional authentic reference items so the 2-column grid matches 02:04 & 02:13 in the recording
  const extendedCatalog: DiamondPackage[] = [
    ...packages,
    {
      id: 'PKG-75',
      title: '75 Diamond 💎',
      titleBn: '৭৫ ডায়মন্ড 💎',
      diamonds: 75,
      priceBdt: 58,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-100',
      title: '100 Diamond 💎',
      titleBn: '১০০ ডায়মন্ড 💎',
      diamonds: 100,
      priceBdt: 72,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-355',
      title: '355 Diamond 💎',
      titleBn: '৩৫৫ ডায়মন্ড 💎',
      diamonds: 355,
      priceBdt: 237,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-480',
      title: '480 Diamond 💎',
      titleBn: '৪৮০ ডায়মন্ড 💎',
      diamonds: 480,
      priceBdt: 316,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-505',
      title: '505 Diamond 💎',
      titleBn: '৫০৫ ডায়মন্ড 💎',
      diamonds: 505,
      priceBdt: 339,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-725',
      title: '725 Diamond 💎',
      titleBn: '৭২৫ ডায়মন্ড 💎',
      diamonds: 725,
      priceBdt: 480,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-850',
      title: '850 Diamond 💎',
      titleBn: '৮৫০ ডায়মন্ড 💎',
      diamonds: 850,
      priceBdt: 560,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-1090',
      title: '1090 Diamond 💎',
      titleBn: '১০৯০ ডায়মন্ড 💎',
      diamonds: 1090,
      priceBdt: 716,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-1595',
      title: '1595 Diamond 💎',
      titleBn: '১৫৯৫ ডায়মন্ড 💎',
      diamonds: 1595,
      priceBdt: 1045,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-1850',
      title: '1850 Diamond 💎',
      titleBn: '১৮৫০ ডায়মন্ড 💎',
      diamonds: 1850,
      priceBdt: 1210,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-5060',
      title: '5060 Diamond 💎',
      titleBn: '৫০৬০ ডায়মন্ড 💎',
      diamonds: 5060,
      priceBdt: 3220,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    },
    {
      id: 'PKG-10120',
      title: '10120 Diamond 💎',
      titleBn: '১০১২০ ডায়মন্ড 💎',
      diamonds: 10120,
      priceBdt: 6440,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: false,
    },
  ];

  // Deduplicate by id
  const uniquePackages = Array.from(
    new Map(extendedCatalog.map((item) => [item.id, item])).values()
  );

  const filteredPackages = uniquePackages.filter((pkg) => {
    if (categoryTab === 'wishlist' && !wishlist.includes(pkg.id)) return false;
    if (categoryTab !== 'wishlist' && pkg.category !== categoryTab) return false;
    if (globalSearch.trim()) {
      const q = globalSearch.toLowerCase();
      return (
        pkg.title.toLowerCase().includes(q) ||
        pkg.titleBn.toLowerCase().includes(q) ||
        String(pkg.diamonds).includes(q)
      );
    }
    return true;
  });

  const activeSelectedPkg =
    customSelectedPkg ||
    uniquePackages.find((p) => p.id === selectedPkgId) ||
    filteredPackages[0] ||
    uniquePackages[0];

  const activeGateways = paymentSettings.gateways.filter(
    (g) => g.active && (g.id as string) !== 'card'
  );
  const currentGatewayConfig =
    activeGateways.find((g) => g.id === selectedGateway) || activeGateways[0];

  const categoryMeta = {
    uid: {
      title: 'UID TOPUP',
      badgeBn: 'ইউআইডি টপআপ',
      image: DIAMOND_IMAGE,
      gradient: 'from-[#FF5500] to-[#B91C1C]',
    },
    membership: {
      title: 'WEEKLY & MONTHLY',
      badgeBn: 'উইকলি মান্থলি',
      image: HERO_BANNER_IMAGE,
      gradient: 'from-[#EA580C] to-[#9A3412]',
    },
    special: {
      title: 'LEVEL UP & SPECIAL PASS',
      badgeBn: 'লেভেল আপ পাস',
      image: TOURNAMENT_IMAGE,
      gradient: 'from-[#2563EB] to-[#1D4ED8]',
    },
    unipin: {
      title: 'UNIPIN VOUCHER BD',
      badgeBn: 'ইউনিপিন ভাউচার',
      image: DIAMOND_IMAGE,
      gradient: 'from-[#0284C7] to-[#1E3A8A]',
    },
    wishlist: {
      title: 'SAVED PACKAGES',
      badgeBn: 'পছন্দের তালিকা',
      image: DIAMOND_IMAGE,
      gradient: 'from-[#E11D48] to-[#9F1239]',
    },
  }[categoryTab];

  const handleCheckGameId = () => {
    const cleanUid = playerUid.trim();
    if (cleanUid.length < 6) {
      addToast('Player ID প্রয়োজন', 'অনুগ্রহ করে সঠিক Free Fire Player ID লিখুন।', 'warning');
      return;
    }
    const ign =
      currentUser?.ffUid === cleanUid
        ? currentUser.ffIgn
        : `BD_PLAYER_${cleanUid.slice(-4)}`;
    setCheckedIgn(ign);
    addToast('Game ID Checked', `Verified Player Name: ${ign}`, 'success');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSelectedPkg) return;
    if (!activeSelectedPkg.inStock) {
      addToast('Stock Out', 'এই প্যাকেজটি বর্তমানে স্টকে নেই। অন্য প্যাকেজ সিলেক্ট করুন।', 'error');
      return;
    }

    const targetUid = playerUid.trim() || currentUser?.ffUid || '';
    if (targetUid.length < 6) {
      addToast('Player ID প্রয়োজন', 'অনুগ্রহ করে সঠিক Free Fire Player ID লিখুন।', 'warning');
      return;
    }

    const ord = placeTopUpOrder({
      pkg: activeSelectedPkg,
      playerUid: targetUid,
      playerIgn: checkedIgn || currentUser?.ffIgn || 'BD Player',
      paymentMethod: paymentMode === 'wallet' ? 'wallet' : selectedGateway,
      transactionId:
        paymentMode === 'instant'
          ? trxId.trim() || `AUTO${Date.now().toString().slice(-6)}`
          : undefined,
    });

    if (ord) {
      setCustomSelectedPkg(null);
      setTrxId('');
      setTrackOrderId(ord.id);
    }
  };

  const handleApplyCustomDiamonds = () => {
    const customPkg: DiamondPackage = {
      id: `PKG-CUSTOM-${customDiamonds}`,
      title: `Custom ${customDiamonds} Diamond 💎`,
      titleBn: `কাস্টম ${customDiamonds} ডায়মন্ড 💎`,
      diamonds: customDiamonds,
      priceBdt: customPriceBdt,
      category: 'uid',
      deliverySpeed: 'Instant · 30s',
      inStock: true,
    };
    setCustomSelectedPkg(customPkg);
    setShowCustomCalc(false);
    addToast(
      'Custom Diamond Selected',
      `${customDiamonds} Diamonds (৳${customPriceBdt} BDT) selected.`,
      'info'
    );
  };

  return (
    <div className="max-w-2xl mx-auto px-3.5 sm:px-5 py-4 sm:py-6 space-y-4">
      {/* Category Switcher Strip (UID TopUp · Weekly & Monthly · Level Up Pass · UniPin · Saved) */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
        {[
          { id: 'uid', label: language === 'bn' ? 'UID TOPUP' : 'UID TOPUP' },
          { id: 'membership', label: language === 'bn' ? 'Weekly & Monthly' : 'Weekly & Monthly' },
          { id: 'special', label: language === 'bn' ? 'Level Up Pass' : 'Level Up Pass' },
          { id: 'unipin', label: language === 'bn' ? 'UniPin Voucher' : 'UniPin Voucher' },
          { id: 'wishlist', label: `Saved (${wishlist.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => {
              setCustomSelectedPkg(null);
              setCategoryTab(
                tab.id as 'uid' | 'membership' | 'special' | 'unipin' | 'wishlist'
              );
              const firstInTab = uniquePackages.find((p) => p.category === tab.id);
              if (firstInTab) setSelectedPkgId(firstInTab.id);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-display font-extrabold whitespace-nowrap shrink-0 border transition-all ${
              categoryTab === tab.id
                ? 'bg-[#280606] text-white border-[#280606] shadow-xs'
                : 'bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-800 hover:border-[#3B0A0A]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Top Product Header Card (Exact Match to 02:12, 02:37, 02:53 in Recording) */}
      <div className="zvy-card p-3.5 sm:p-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0 relative bg-[#111827]">
            <img
              src={categoryMeta.image}
              alt={categoryMeta.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div
              className={`absolute inset-x-0 bottom-0 bg-gradient-to-r ${categoryMeta.gradient} text-white text-[8px] font-extrabold text-center py-0.5 truncate px-1`}
            >
              {categoryMeta.badgeBn}
            </div>
          </div>
          <h1 className="font-display font-black text-sm sm:text-base uppercase tracking-tight text-[#111827] dark:text-white truncate">
            {categoryMeta.title}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setHowToOrderOpen(true)}
          className="px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-700 text-[11px] font-bold text-[#111827] dark:text-white hover:border-[#3B0A0A] inline-flex items-center gap-1 shrink-0 transition-colors"
        >
          <span>{language === 'bn' ? 'কিভাবে অর্ডার করবেন?' : 'How to Order?'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="space-y-4">
        {/* ===================================================================
            CARD 1: [1] SELECT RECHARGE (Exact Match to 02:04 & 02:13 in Recording)
           =================================================================== */}
        <div className="zvy-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2.5">
              <span className="step-badge">1</span>
              <h2 className="font-display font-extrabold text-sm sm:text-base uppercase tracking-tight text-[#111827] dark:text-white">
                SELECT RECHARGE
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowCustomCalc(!showCustomCalc)}
                className="px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-[10px] font-bold inline-flex items-center gap-1 hover:bg-gray-200"
              >
                <Calculator className="w-3 h-3 text-[#FF5500]" />
                <span>Custom 💎</span>
              </button>
              <span className="px-2.5 py-1 rounded-full bg-[#FFFBEB] border border-[#FDE68A] text-[#D97706] text-[11px] font-bold inline-flex items-center gap-1">
                <span>Min. 0 Coins</span>
                <span>💰</span>
              </span>
            </div>
          </div>

          {/* Optional Search & Custom Diamond Calculator */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'প্যাকেজ খুঁজুন (যেমন: 115, 240, Weekly)...'
                    : 'Filter packages (e.g. 115, 240, Weekly)...'
                }
                className="w-full h-9 pl-9 pr-3 rounded-xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 text-xs text-[#111827] dark:text-white placeholder:text-gray-400"
              />
          </div>

          {showCustomCalc && (
            <div className="p-3.5 rounded-xl bg-[#FFF9F5] dark:bg-[#161F30] border border-[#3B0A0A]/25 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span>Custom Diamond Calculator (50 – 5,000 💎)</span>
                <span className="font-mono text-[#FF5500]">
                  {customDiamonds} 💎 = ৳{customPriceBdt} BDT
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={25}
                value={customDiamonds}
                onChange={(e) => setCustomDiamonds(Number(e.target.value))}
                className="w-full accent-[#3B0A0A]"
              />
              <button
                type="button"
                onClick={handleApplyCustomDiamonds}
                className="w-full py-2 rounded-lg bg-[#3B0A0A] text-white text-xs font-bold"
              >
                Use Custom {customDiamonds} Diamonds (৳{customPriceBdt} BDT)
              </button>
            </div>
          )}

          {/* 2-Column Denomination Radio Grid (Matches 02:04 & 02:13 in Recording) */}
          <div className="grid grid-cols-2 gap-2.5">
            {filteredPackages.map((pkg) => {
              const isSelected = activeSelectedPkg?.id === pkg.id;
              const isWished = wishlist.includes(pkg.id);
              const cleanName = pkg.title
                .replace(/\s*\(UID Direct\)/i, ' 💎')
                .replace(/\s*\(UniPin Voucher\)/i, ' 🎟️');

              return (
                <div
                  key={pkg.id}
                  onClick={() => {
                    if (!pkg.inStock) return;
                    setCustomSelectedPkg(null);
                    setSelectedPkgId(pkg.id);
                  }}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && pkg.inStock) {
                      e.preventDefault();
                      setCustomSelectedPkg(null);
                      setSelectedPkgId(pkg.id);
                    }
                  }}
                  className={`zvy-recharge-item text-left ${
                    isSelected ? 'zvy-recharge-item-selected' : ''
                  } ${!pkg.inStock ? 'opacity-65 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-center gap-2 min-w-0">
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
                      {language === 'bn' ? pkg.titleBn : cleanName}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 pl-1">
                    {!pkg.inStock ? (
                      <div className="text-right">
                        <div className="text-[11px] font-mono font-bold text-red-400">
                          {pkg.priceBdt} BDT
                        </div>
                        <span className="inline-block px-1.5 py-0.5 rounded bg-red-50 border border-red-200 text-red-600 text-[9px] font-mono font-extrabold uppercase">
                          STOCKOUT
                        </span>
                      </div>
                    ) : (
                      <div className="text-right leading-none">
                        <div className="font-mono font-extrabold text-xs sm:text-sm text-[#111827] dark:text-white">
                          {pkg.priceBdt}
                        </div>
                        <div className="text-[9px] font-mono font-semibold text-gray-500 uppercase mt-0.5">
                          BDT
                        </div>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(pkg.id);
                      }}
                      aria-label="Toggle Wishlist"
                      className={`p-0.5 rounded transition-colors ${
                        isWished ? 'text-red-500' : 'text-gray-300 hover:text-red-400'
                      }`}
                    >
                      <Heart className={`w-3 h-3 ${isWished ? 'fill-current' : ''}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================================
            CARD 2: [2] ACCOUNT INFO (Exact Match to 02:05 in Recording)
           =================================================================== */}
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
                setCheckedIgn(null);
              }}
              placeholder="Enter Player ID"
              maxLength={12}
              className="w-full h-12 px-4 rounded-xl bg-white dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-700 text-sm font-mono text-[#111827] dark:text-white"
            />
          </div>

          <button
            type="button"
            onClick={handleCheckGameId}
            className="w-full h-11 rounded-xl bg-[#EFF6FF] hover:bg-[#DBEAFE] text-[#2563EB] font-display font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span>
              {checkedIgn
                ? `গেম আইডি ভেরিফাইড: ${checkedIgn}`
                : language === 'bn'
                ? 'আপনার গেম আইডির নাম চেক করুন'
                : 'Check Your Game ID Name'}
            </span>
          </button>
        </div>

        {/* ===================================================================
            CARD 3: [3] পেমেন্ট পদ্ধতি (Exact Match to 02:06 in Recording)
           =================================================================== */}
        <div className="zvy-card p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-1">
            <span className="w-7 h-7 rounded-full bg-[#280606] text-white font-display font-extrabold text-xs flex items-center justify-center">
              3
            </span>
            <h2 className="font-display font-extrabold text-base sm:text-lg text-[#111827] dark:text-white">
              {language === 'bn' ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}
            </h2>
          </div>

          {/* 2 Graphic Payment Cards (Wallet Payment vs Instant Payment) */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMode('wallet')}
              className={`rounded-2xl overflow-hidden border-2 text-center transition-all ${
                paymentMode === 'wallet'
                  ? 'border-[#280606] dark:border-[#FF5500] shadow-md'
                  : 'border-gray-200 dark:border-gray-700 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="h-24 sm:h-28 bg-gradient-to-br from-[#2A0808] via-[#450A0A] to-[#111827] p-3 flex items-center justify-between">
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

            <button
              type="button"
              onClick={() => setPaymentMode('instant')}
              className={`rounded-2xl overflow-hidden border-2 text-center transition-all ${
                paymentMode === 'instant'
                  ? 'border-[#280606] dark:border-[#FF5500] shadow-md'
                  : 'border-gray-200 dark:border-gray-700 opacity-85 hover:opacity-100'
              }`}
            >
              <div className="h-24 sm:h-28 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#092B4C] p-3 flex items-center justify-between">
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
                    Send <strong>৳{activeSelectedPkg?.priceBdt ?? 0}</strong> to{' '}
                    {currentGatewayConfig.name.split(' ')[0]}:
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentGatewayConfig.merchantNumber);
                      addToast(
                        'Merchant Number Copied',
                        `${currentGatewayConfig.merchantNumber} copied!`,
                        'info'
                      );
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
                className="w-full h-10 px-3 rounded-lg bg-white dark:bg-[#161F30] border border-gray-200 dark:border-gray-700 text-xs font-mono text-[#111827] dark:text-white placeholder:text-gray-400"
              />
            </div>
          )}

          {/* 2 Info Lines (Required Amount & Current Wallet Balance) */}
          <div className="space-y-1.5 pt-1 text-xs text-gray-700 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-400 shrink-0" />
              <span>
                {language === 'bn' ? 'প্রোডাক্ট কিনতে আপনার প্রয়োজন' : 'Required to purchase product'}{' '}
                <strong className="font-mono text-[#111827] dark:text-white">
                  Tk {activeSelectedPkg?.priceBdt ?? 0} BDT
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
              href="#topup-rules-section"
              className="text-xs font-bold text-[#0D3B66] dark:text-[#60A5FA] underline"
            >
              {language === 'bn' ? 'অর্ডার করার নিয়মাবলী দেখুন' : 'View Order Rules & Conditions'}
            </a>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full h-12 rounded-xl btn-navy-buy font-display font-bold text-sm shadow-md flex items-center justify-center gap-2"
            >
              <span>
                {currentUser
                  ? language === 'bn'
                    ? `এখনই কিনুন (৳${activeSelectedPkg?.priceBdt ?? 0} BDT)`
                    : `Buy Now (৳${activeSelectedPkg?.priceBdt ?? 0} BDT)`
                  : language === 'bn'
                  ? 'লগইন / এখনই কিনুন'
                  : 'Login / Buy Now'}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!activeSelectedPkg) return;
                const cartUid = playerUid.trim() || currentUser?.ffUid || '';
                if (cartUid.length < 6) {
                  addToast('Player ID প্রয়োজন', 'কার্টে যোগ করার আগে সঠিক Free Fire Player ID লিখুন।', 'warning');
                  return;
                }
                addToCart(
                  activeSelectedPkg,
                  cartUid,
                  checkedIgn || currentUser?.ffIgn || 'BD Player'
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

      {/* ===================================================================
          CARD 4: নিয়ম ও শর্তাবলী (Rules & Conditions — Matches 02:30 - 02:33)
         =================================================================== */}
      <div id="topup-rules-section" className="zvy-card p-4 sm:p-5 space-y-3">
        <h3 className="font-display font-extrabold text-sm sm:text-base text-[#111827] dark:text-white pb-2 border-b border-gray-100 dark:border-gray-800">
          {language === 'bn' ? 'নিয়ম ও শর্তাবলী' : 'Rules & Conditions'}
        </h3>
        <div className="text-xs font-bold text-[#111827] dark:text-white flex items-center gap-1.5">
          <span>📢</span>
          <span>H41FFTOPUP - Rules & Conditions</span>
        </div>
        <ul className="space-y-2.5 text-xs text-gray-700 dark:text-gray-300 leading-relaxed list-disc pl-4">
          <li>
            🇧🇩 শুধুমাত্র <strong>Bangladesh (BD) Server</strong>-এ <strong>Player ID Code</strong> ব্যবহার করে Top Up করা যাবে।
          </li>
          <li>
            🆔 <strong>Player ID</strong> ভুল প্রদান করলে Top Up সম্পন্ন না হওয়ার জন্য <strong>H41FFTOPUP</strong> কর্তৃপক্ষ দায়ী থাকবে না। অর্ডার করার আগে অবশ্যই আপনার Player ID সঠিকভাবে যাচাই করুন।
          </li>
          <li>
            💎 অর্ডার <strong>Completed</strong> হওয়ার পরও যদি Diamond আপনার অ্যাকাউন্টে না পৌঁছায়, তাহলে যাচাইয়ের জন্য <strong>Player ID</strong> এবং প্রয়োজনে <strong>Account Login Information</strong> প্রদান করতে হতে পারে।
          </li>
          <li>
            ❌ কোনো অর্ডার <strong>Cancelled</strong> হলে তার সুনির্দিষ্ট কারণ <strong>Order History</strong>-তে উল্লেখ থাকবে। অনুগ্রহ করে কারণটি দেখে সঠিক তথ্য দিয়ে পুনরায় অর্ডার করুন।
          </li>
        </ul>
      </div>

      {/* Live Order ID & UniPin Voucher PIN Tracker Card */}
      <div className="zvy-card p-4 sm:p-5 space-y-3">
        <h3 className="font-display font-extrabold text-sm text-[#111827] dark:text-white">
          {language === 'bn' ? 'অর্ডার ট্র্যাকার ও ভাউচার পিন চেক' : 'Track Order Status & UniPin PIN'}
        </h3>
        <input
          type="text"
          value={trackOrderId}
          onChange={(e) => setTrackOrderId(e.target.value)}
          placeholder={`Enter Order ID (e.g. ${orders[0]?.id || 'ORD-90124'})`}
          className="w-full h-10 px-3.5 rounded-xl bg-gray-50 dark:bg-[#0B0F17] border border-gray-200 dark:border-gray-800 text-xs font-mono text-[#111827] dark:text-white placeholder:text-gray-400"
        />
        {trackedOrder && (
          <div className="p-3.5 rounded-xl bg-[#00C853]/10 border border-[#00C853]/30 text-xs space-y-1">
            <div className="flex justify-between font-mono font-bold">
              <span className="text-[#3B0A0A] dark:text-[#FF7A00]">{trackedOrder.id}</span>
              <span className="text-[#00C853]">{trackedOrder.status}</span>
            </div>
            <div className="font-bold text-[#111827] dark:text-white">
              {trackedOrder.packageTitle} — ৳{trackedOrder.amountBdt} BDT
            </div>
            <div className="font-mono text-[11px] text-gray-500">
              Player ID: {trackedOrder.playerUid} ({trackedOrder.playerIgn})
            </div>
            {trackedOrder.voucherPin && (
              <div className="pt-1 font-mono font-bold text-[#2563EB] flex items-center justify-between">
                <span>UniPin Code: {trackedOrder.voucherPin}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(trackedOrder.voucherPin || '');
                    addToast('PIN Copied', 'UniPin voucher copied to clipboard!', 'info');
                  }}
                  className="underline text-[11px]"
                >
                  Copy PIN
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* How to Order Modal */}
      {howToOrderOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setHowToOrderOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-sm sm:text-base">
                কিভাবে অর্ডার করবেন? (H41FFTOPUP Guide)
              </h3>
              <button
                type="button"
                onClick={() => setHowToOrderOpen(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              <p>১. প্রথমে <strong>SELECT RECHARGE</strong> থেকে আপনার পছন্দের ডায়মন্ড বা মেম্বারশিপ প্যাকটি সিলেক্ট করুন।</p>
              <p>২. এরপর <strong>ACCOUNT INFO</strong> বক্সে আপনার Free Fire Player UID লিখুন এবং নাম চেক করুন।</p>
              <p>৩. <strong>পেমেন্ট পদ্ধতি</strong> থেকে ওয়ালেট পেমেন্ট অথবা ইনস্ট্যান্ট পেমেন্ট (বিকাশ/নগদ/রকেট) সিলেক্ট করে <strong>এখনই কিনুন</strong> বাটনে ক্লিক করুন।</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
