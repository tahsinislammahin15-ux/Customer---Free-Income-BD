import React, { useState } from 'react';
import {
  ShoppingBag,
  Heart,
  Search,
  Calculator,
  CheckCircle2,
  PackageCheck,
  Wallet,
  Copy,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DIAMOND_IMAGE } from '../data/seedData';
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
    placeTopUpOrder,
    wishlist,
    toggleWishlist,
    paymentSettings,
    addToast,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'all' | 'uid' | 'unipin' | 'membership' | 'wishlist'>('all');
  const [playerUid, setPlayerUid] = useState(currentUser?.ffUid || '2849103842');
  const [playerIgn, setPlayerIgn] = useState(currentUser?.ffIgn || 'BD_TAHSIN_99');

  // Custom Diamond Calculator State
  const [customDiamonds, setCustomDiamonds] = useState<number>(350);
  const customPriceBdt = Math.max(20, Math.round(customDiamonds * 0.76));

  // Order Tracker State
  const [trackOrderId, setTrackOrderId] = useState('');
  const trackedOrder = orders.find(
    (o) => o.id.toLowerCase() === trackOrderId.trim().toLowerCase()
  );

  // Direct Buy Modal
  const [checkoutPkg, setCheckoutPkg] = useState<DiamondPackage | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | PaymentGatewayName>('wallet');
  const [trxId, setTrxId] = useState('');

  const filteredPackages = packages.filter((pkg) => {
    if (categoryFilter === 'wishlist' && !wishlist.includes(pkg.id)) return false;
    if (categoryFilter !== 'all' && categoryFilter !== 'wishlist' && pkg.category !== categoryFilter)
      return false;
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

  const handleConfirmDirectBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutPkg) return;
    const ord = placeTopUpOrder({
      pkg: checkoutPkg,
      playerUid: playerUid.trim() || '2849103842',
      playerIgn: playerIgn.trim() || 'BD_PLAYER',
      paymentMethod,
      transactionId: trxId.trim() || undefined,
    });
    if (ord) {
      setCheckoutPkg(null);
      setTrxId('');
      setTrackOrderId(ord.id);
    }
  };

  const handleCustomPackageBuy = () => {
    const customPkg: DiamondPackage = {
      id: `PKG-CUSTOM-${customDiamonds}`,
      title: `Custom ${customDiamonds} Diamonds (UID Direct)`,
      titleBn: `কাস্টম ${customDiamonds} ডায়মন্ড (UID টপ আপ)`,
      diamonds: customDiamonds,
      priceBdt: customPriceBdt,
      category: 'uid',
      deliverySpeed: 'Instant · 1m',
      inStock: true,
    };
    setCheckoutPkg(customPkg);
  };

  const activeGateways = paymentSettings.gateways.filter((g) => g.active);

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header & Player UID Verification Bar */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={DIAMOND_IMAGE}
              alt="Free Fire Diamond Vault"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="hidden sm:block w-20 h-14 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E2D4A] shrink-0"
            />
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#2563EB] dark:text-[#60A5FA] font-semibold mb-1">
                BD SERVER · ZERO PASSWORD TOP UP DESK
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Free Fire Diamond & UniPin Top Up Center
              </h1>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
                Instant Bangladesh Server UID Top Up, Weekly/Monthly Memberships, and Official Garena UniPin Vouchers.
              </p>
            </div>
          </div>
          <div className="text-xs font-mono bg-[#F8FAFC] dark:bg-[#060A12] px-4 py-3 rounded-xl border border-[#E2E8F0] dark:border-[#1E2D4A] shrink-0">
            Main Wallet Balance:{' '}
            <span className="font-bold text-[#10B981]">
              ৳{currentUser?.mainBalance ?? 0} BDT
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#E2E8F0] dark:border-[#1E2D4A]">
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#0B1120] dark:text-[#F8FAFC] mb-1.5">
              1. Free Fire Player UID (Bangladesh Server)
            </label>
            <input
              type="text"
              value={playerUid}
              onChange={(e) => setPlayerUid(e.target.value)}
              placeholder="Enter numeric UID e.g. 2849103842"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#0B1120] dark:text-[#F8FAFC] mb-1.5">
              2. Player In-Game Name (IGN)
            </label>
            <input
              type="text"
              value={playerIgn}
              onChange={(e) => setPlayerIgn(e.target.value)}
              placeholder="e.g. BD_TAHSIN_99"
              className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] focus:outline-none focus:border-[#2563EB]"
            />
          </div>
          <div>
            <label className="block text-xs font-mono uppercase tracking-wider font-semibold text-[#0B1120] dark:text-[#F8FAFC] mb-1.5">
              3. Search Packages
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search e.g. 115, Weekly, UniPin..."
                className="w-full min-h-[44px] pl-9 pr-3.5 py-2.5 text-sm rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] focus:outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 p-1.5 rounded-xl card-premium overflow-x-auto max-w-full no-scrollbar">
          {[
            { id: 'all', label: 'All Packages' },
            { id: 'uid', label: 'UID Direct Top Up' },
            { id: 'membership', label: 'Weekly & Monthly Pass' },
            { id: 'unipin', label: 'UniPin / Garena PIN' },
            { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setCategoryFilter(tab.id as typeof categoryFilter)}
              className={`min-h-[38px] px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                categoryFilter === tab.id
                  ? 'btn-primary text-white'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0B1120] dark:hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredPackages.map((pkg) => {
          const isSaved = wishlist.includes(pkg.id);
          return (
            <div
              key={pkg.id}
              className="p-5 sm:p-6 rounded-2xl card-premium card-premium-interactive flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="text-xs font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                    <span>{pkg.category.toUpperCase()}</span>
                    <span> · </span>
                    <span>{pkg.deliverySpeed}</span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(pkg.id)}
                    aria-label="Toggle wishlist"
                    className="min-h-[36px] min-w-[36px] -mt-1 -mr-1 text-[#475569] hover:text-[#EF4444] flex items-center justify-center shrink-0"
                  >
                    <Heart
                      className={`w-4 h-4 ${isSaved ? 'fill-[#EF4444] text-[#EF4444]' : ''}`}
                    />
                  </button>
                </div>

                <h3 className="font-display text-base sm:text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                  {language === 'bn' ? pkg.titleBn : pkg.title}
                </h3>

                <div className="text-xs font-mono text-[#F59E0B] font-semibold">
                  {pkg.diamonds} Diamonds Value
                  {pkg.discountBadge ? ` · ${pkg.discountBadge}` : ''}
                </div>
              </div>

              <div className="pt-3.5 border-t border-[#DCE4F0] dark:border-[#1E293B] space-y-3.5">
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-2xl font-bold font-mono text-[#2563EB] dark:text-[#60A5FA]">
                    ৳{pkg.priceBdt} <span className="text-xs font-normal">BDT</span>
                  </span>
                  {pkg.originalPriceBdt && (
                    <span className="text-xs font-mono text-[#94A3B8] line-through">
                      ৳{pkg.originalPriceBdt}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => addToCart(pkg, playerUid, playerIgn)}
                    className="min-h-[42px] py-2 px-3 rounded-xl btn-secondary text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0 text-[#2563EB]" />
                    <span>Add Cart</span>
                  </button>
                  <button
                    onClick={() => setCheckoutPkg(pkg)}
                    className="min-h-[42px] py-2 px-3 rounded-xl btn-primary text-xs font-semibold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Diamond Calculator & Live Order Tracker Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Custom Package Calculator */}
        <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-5">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-[#2563EB] shrink-0" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
              Custom Diamond Calculator
            </h2>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Need a specific number of diamonds to unlock an Evo Gun or Lucky Royale spin? Slide or enter any diamond amount to calculate instant BDT pricing.
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span>Desired Diamonds Amount</span>
                <span className="font-mono text-[#F59E0B]">{customDiamonds} 💎</span>
              </div>
              <input
                type="range"
                min={50}
                max={5000}
                step={25}
                value={customDiamonds}
                onChange={(e) => setCustomDiamonds(Number(e.target.value))}
                className="w-full accent-[#2563EB]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  Calculated BDT Rate (৳0.76 / 💎)
                </div>
                <div className="font-display text-2xl font-bold font-mono text-[#2563EB] dark:text-[#60A5FA]">
                  ৳{customPriceBdt} BDT
                </div>
              </div>
              <button
                onClick={handleCustomPackageBuy}
                className="min-h-[44px] px-5 py-2.5 rounded-xl btn-primary text-xs font-semibold"
              >
                Order {customDiamonds}💎 Now
              </button>
            </div>
          </div>
        </div>

        {/* Order Tracking by Order ID */}
        <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-5">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-[#10B981] shrink-0" />
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
              Real-Time Order Tracker
            </h2>
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Enter your Order ID (e.g., <span className="font-mono">ORD-90812</span> or{' '}
            <span className="font-mono">ORD-90871</span>) to verify delivery status or retrieve your UniPin Voucher PIN.
          </p>

          <div className="flex flex-col sm:flex-row gap-2.5">
            <input
              type="text"
              value={trackOrderId}
              onChange={(e) => setTrackOrderId(e.target.value)}
              placeholder="Enter Order ID e.g. ORD-90871"
              className="flex-1 min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
            />
            <button
              onClick={() => setTrackOrderId('ORD-90871')}
              className="min-h-[44px] px-4 py-2.5 rounded-xl btn-secondary text-xs font-mono font-semibold"
            >
              Load Sample ID
            </button>
          </div>

          {trackedOrder ? (
            <div className="p-4 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2 font-mono">
                <span className="font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                  {trackedOrder.id} · {trackedOrder.packageTitle}
                </span>
                <span className="font-bold text-[#10B981]">{trackedOrder.status}</span>
              </div>
              <div className="text-[#475569] dark:text-[#94A3B8] font-mono">
                Player UID: {trackedOrder.playerUid} ({trackedOrder.playerIgn}) · Amount: ৳
                {trackedOrder.amountBdt}
              </div>
              {trackedOrder.voucherPin && (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-[#DCE4F0] dark:border-[#1E293B]">
                  <span className="font-mono font-bold text-[#F59E0B] break-all">
                    UniPin Voucher: {trackedOrder.voucherPin}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(trackedOrder.voucherPin!);
                      addToast('PIN Copied', 'UniPin voucher code copied to clipboard.', 'info');
                    }}
                    className="inline-flex items-center gap-1 text-[#2563EB] font-semibold"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy PIN</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            trackOrderId.trim() && (
              <div className="text-xs text-[#EF4444]">
                No order found matching “{trackOrderId}”. Check the Order History table below.
              </div>
            )
          )}
        </div>
      </div>

      {/* Order History Table */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-4">
        <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
          Recent Diamond & UniPin Order History
        </h2>
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[680px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DCE4F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8]">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Package</th>
                <th className="py-3 px-3">Target UID / IGN</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3 text-right">Amount</th>
                <th className="py-3 px-3">Voucher PIN / Status</th>
                <th className="py-3 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4F0] dark:divide-[#1E293B] text-xs font-mono">
              {orders.map((ord) => (
                <tr key={ord.id} className="hover:bg-[#F4F7FB] dark:hover:bg-[#070B14]">
                  <td className="py-3 px-3 font-bold text-[#2563EB] dark:text-[#60A5FA] whitespace-nowrap">{ord.id}</td>
                  <td className="py-3 px-3 font-sans font-semibold text-[#0B1120] dark:text-[#F8FAFC]">
                    {ord.packageTitle}
                  </td>
                  <td className="py-3 px-3 whitespace-nowrap">
                    {ord.playerUid} ({ord.playerIgn})
                  </td>
                  <td className="py-3 px-3 uppercase">{ord.paymentMethod}</td>
                  <td className="py-3 px-3 text-right font-bold">৳{ord.amountBdt}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        ord.status === 'Completed'
                          ? 'text-[#10B981]'
                          : ord.status === 'Cancelled'
                          ? 'text-[#EF4444]'
                          : 'text-[#F59E0B]'
                      }`}
                    >
                      {ord.status}
                    </span>
                    {ord.voucherPin && (
                      <span className="ml-2 text-[#475569] dark:text-[#94A3B8]">
                        ({ord.voucherPin})
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                    {ord.createdAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Direct Buy Checkout Modal */}
      {checkoutPkg && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmDirectBuy}
            className="max-w-md w-full max-h-[90vh] overflow-y-auto rounded-2xl card-premium p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
              Confirm Top Up Order
            </h3>
            <div className="p-3.5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] text-xs space-y-1 font-mono">
              <div className="font-sans font-bold text-sm text-[#0B1120] dark:text-[#F8FAFC]">
                {checkoutPkg.title}
              </div>
              <div>
                Target UID: {playerUid} ({playerIgn})
              </div>
              <div className="text-[#2563EB] dark:text-[#60A5FA] font-bold">
                Total Payable: ৳{checkoutPkg.priceBdt} BDT
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold">Select Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs font-semibold ${
                    paymentMethod === 'wallet'
                      ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-white'
                      : 'border-[#DCE4F0] dark:border-[#1E293B]'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Wallet className="w-3.5 h-3.5 shrink-0" />
                    <span>Wallet</span>
                  </div>
                  <div className="font-mono text-xs mt-0.5">
                    ৳{currentUser?.mainBalance ?? 0}
                  </div>
                </button>
                {activeGateways.map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setPaymentMethod(gw.id)}
                    className={`min-h-[48px] p-2.5 rounded-xl border text-left text-xs font-semibold ${
                      paymentMethod === gw.id
                        ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-white'
                        : 'border-[#DCE4F0] dark:border-[#1E293B]'
                    }`}
                  >
                    <div>{gw.name}</div>
                    <div className="font-mono text-xs mt-0.5 truncate">{gw.merchantNumber}</div>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod !== 'wallet' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Enter {paymentMethod.toUpperCase()} Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. BKS884920KL"
                  className="w-full min-h-[42px] px-3 py-2 text-xs font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
                />
              </div>
            )}

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setCheckoutPkg(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl btn-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[42px] px-5 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm & Pay ৳{checkoutPkg.priceBdt}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
