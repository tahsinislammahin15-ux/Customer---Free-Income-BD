import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Heart,
  CheckCircle2,
  BookOpen,
  ShieldCheck,
  Search,
  Star,
  Send,
  Compass,
  ArrowLeft,
  ArrowRight,
  Copy,
  Gem,
  Trophy,
  Coins,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DIAMOND_IMAGE } from '../data/seedData';
import { BlogPost, DiamondPackage } from '../types';

/* ============================================================================
   DEDICATED PAGE: SPECIAL OFFERS & VIP BUNDLES (/offers)
   Unique Layout: Split VIP Vault Hero + Bundle Savings Simulator + Pass Matrix
   ============================================================================ */
export const SpecialOffersPage: React.FC = () => {
  const {
    packages,
    language,
    currentUser,
    addToCart,
    placeTopUpOrder,
    wishlist,
    toggleWishlist,
    navigate,
  } = useApp();

  const [targetUid, setTargetUid] = useState(currentUser?.ffUid || '2849103842');
  const [targetIgn, setTargetIgn] = useState(currentUser?.ffIgn || 'BD_TAHSIN_99');
  const [guildSquadSize, setGuildSquadSize] = useState<number>(4);

  const membershipPackages = packages.filter((p) => p.category === 'membership');
  const specialBundles = packages.filter(
    (p) => p.popular || p.discountBadge || p.originalPriceBdt || p.diamonds >= 500
  );

  const weeklyPass =
    membershipPackages.find((p) => p.title.toLowerCase().includes('weekly')) || packages[0];
  const monthlyPass =
    membershipPackages.find((p) => p.title.toLowerCase().includes('monthly')) || packages[1];

  const squadWeeklyTotal = (weeklyPass?.priceBdt || 155) * guildSquadSize;
  const squadDiscountBdt = Math.round(squadWeeklyTotal * 0.08);
  const squadNetBdt = squadWeeklyTotal - squadDiscountBdt;

  const handleInstantBundleOrder = (pkg: DiamondPackage) => {
    if (!targetUid.trim()) return;
    placeTopUpOrder({
      pkg,
      playerUid: targetUid.trim(),
      playerIgn: targetIgn.trim() || 'BD_PLAYER',
      paymentMethod: 'wallet',
    });
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-14">
      {/* Unique Hero: VIP Membership Vault & Squad Savings Calculator */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl card-premium flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="text-xs font-mono text-[#F59E0B] font-semibold">
              01. VIP PASSES & PROMOTIONAL BUNDLES · BD SERVER
            </div>
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#0B1120] dark:text-[#F8FAFC] leading-[1.14]"
              style={{ textWrap: 'balance' }}
            >
              Special Offers, Weekly Passes & High-Volume Diamond Bundles
            </h1>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-2xl">
              Maximize your Free Fire diamond value with official Garena Weekly and Monthly memberships, Evo-gun upgrade packs, and discounted guild bundles delivered directly via Player UID.
            </p>
          </div>

          {/* Target UID Bar */}
          <div className="p-4 sm:p-5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Recipient Free Fire UID (BD Server)
              </label>
              <input
                type="text"
                value={targetUid}
                onChange={(e) => setTargetUid(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2849103842"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#101829] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Recipient In-Game Name (IGN)
              </label>
              <input
                type="text"
                value={targetIgn}
                onChange={(e) => setTargetIgn(e.target.value)}
                placeholder="e.g. BD_TAHSIN_99"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#101829] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Guild Squad Bundle Calculator */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl bg-[#0B1120] text-white border border-[#1E293B] flex flex-col justify-between space-y-6 shadow-xl">
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-mono text-[#F59E0B] font-semibold">
                GUILD ROSTER ESTIMATOR
              </span>
              <img
                src={DIAMOND_IMAGE}
                alt="Free Fire Diamond Vault"
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-12 h-9 rounded-lg object-cover border border-[#1E2D4A]"
              />
            </div>
            <h2 className="font-display text-xl sm:text-2xl font-bold text-white">
              Squad Weekly Pass Bundle Estimator
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Sponsoring Weekly Memberships for your Clash Squad roster or tournament winners? Estimate multi-player bundle savings below.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-mono mb-2">
                <span className="text-slate-300">Number of Squad Players</span>
                <span className="text-[#F59E0B] font-bold">{guildSquadSize} Players</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={guildSquadSize}
                onChange={(e) => setGuildSquadSize(Number(e.target.value))}
                className="w-full accent-[#F59E0B]"
              />
            </div>

            <div className="p-4 rounded-xl bg-[#070B14] border border-[#1E293B] space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Standard Rate ({guildSquadSize} × Weekly Pass)</span>
                <span>৳{squadWeeklyTotal} BDT</span>
              </div>
              <div className="flex justify-between text-[#10B981]">
                <span>Guild Bundle Savings (8%)</span>
                <span>-৳{squadDiscountBdt} BDT</span>
              </div>
              <div className="pt-2 border-t border-[#1E293B] flex justify-between text-sm font-bold text-white">
                <span>Estimated Squad Total</span>
                <span className="text-[#F59E0B]">৳{squadNetBdt} BDT</span>
              </div>
            </div>

            <button
              onClick={() => {
                if (weeklyPass) addToCart(weeklyPass, targetUid, targetIgn);
              }}
              className="w-full min-h-[44px] py-2.5 px-4 rounded-xl btn-amber text-xs font-bold"
            >
              Add Weekly Pass to Cart →
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Side-by-Side Membership Comparison Table */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold">
              02. MEMBERSHIP VALUE MATRIX
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1120] dark:text-[#F8FAFC] mt-1">
              Weekly vs. Monthly VIP Pass Comparison
            </h2>
          </div>
          <Link
            to="/topup"
            className="text-xs font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline inline-flex items-center gap-1"
          >
            <span>View All {packages.length} Standard Packages</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[weeklyPass, monthlyPass].filter(Boolean).map((pass, idx) => (
            <div
              key={pass.id}
              className="p-6 sm:p-8 rounded-2xl card-premium flex flex-col justify-between space-y-6"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                    {idx === 0 ? '7-DAY VIP SUBSCRIPTION' : '30-DAY VIP SUBSCRIPTION'}
                  </span>
                  <span className="text-[#10B981] font-semibold">{pass.deliverySpeed}</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                  {language === 'bn' ? pass.titleBn : pass.title}
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {idx === 0
                    ? 'Includes 100 instant diamonds upon activation plus 50 daily check-in diamonds for 7 consecutive days (450 total diamonds value).'
                    : 'Includes 500 instant diamonds upon activation plus 70 daily check-in diamonds for 30 days (2,600 total diamonds value).'}
                </p>
                <div className="pt-2 space-y-1.5 text-xs text-[#0B1120] dark:text-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Zero Account Password Required — Activated by numeric UID</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                    <span>Stacks with active Elite / Booyah Pass progression</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE4F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    Total Value: {pass.diamonds} Diamonds
                  </div>
                  <div className="font-display text-3xl font-bold font-mono text-[#2563EB] dark:text-[#60A5FA]">
                    ৳{pass.priceBdt} <span className="text-xs font-normal">BDT</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => addToCart(pass, targetUid, targetIgn)}
                    className="min-h-[42px] px-4 py-2 rounded-xl btn-secondary text-xs font-semibold"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={() => handleInstantBundleOrder(pass)}
                    className="min-h-[42px] px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
                  >
                    Activate Pass Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Discounted & High-Volume Bundles */}
      <section className="space-y-6">
        <div>
          <div className="text-xs font-mono text-[#10B981] font-semibold">
            03. PROMOTIONAL DIAMOND BUNDLES
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1120] dark:text-[#F8FAFC] mt-1">
            Featured Discounted & High-Volume Packs
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {specialBundles.map((pkg) => {
            const isSaved = wishlist.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                className="p-6 rounded-2xl card-premium card-premium-interactive flex flex-col justify-between space-y-5"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="text-xs font-mono text-[#F59E0B] font-semibold">
                      {pkg.discountBadge || 'Featured Offer'} · {pkg.deliverySpeed}
                    </div>
                    <button
                      onClick={() => toggleWishlist(pkg.id)}
                      aria-label="Save bundle to wishlist"
                      className="min-h-[36px] min-w-[36px] -mt-1 -mr-1 p-1.5 rounded-lg text-[#475569] hover:text-[#EF4444] flex items-center justify-center"
                    >
                      <Heart
                        className={`w-4 h-4 ${isSaved ? 'fill-[#EF4444] text-[#EF4444]' : ''}`}
                      />
                    </button>
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                    {language === 'bn' ? pkg.titleBn : pkg.title}
                  </h3>
                  <div className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                    {pkg.diamonds} Diamonds · {pkg.category.toUpperCase()} Delivery
                  </div>
                </div>

                <div className="pt-4 border-t border-[#DCE4F0] dark:border-[#1E293B] space-y-3.5">
                  <div className="flex items-baseline justify-between">
                    <span className="font-display text-2xl font-bold font-mono text-[#2563EB] dark:text-[#60A5FA]">
                      ৳{pkg.priceBdt} <span className="text-xs font-normal">BDT</span>
                    </span>
                    {pkg.originalPriceBdt && (
                      <span className="text-xs font-mono text-[#94A3B8] line-through">
                        ৳{pkg.originalPriceBdt} BDT
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => addToCart(pkg, targetUid, targetIgn)}
                      className="min-h-[42px] px-3 py-2 rounded-xl btn-secondary text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 text-[#2563EB]" />
                      <span>Add Cart</span>
                    </button>
                    <button
                      onClick={() => handleInstantBundleOrder(pkg)}
                      className="min-h-[42px] px-3.5 py-2 rounded-xl btn-primary text-xs font-semibold"
                    >
                      Buy Bundle
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   DEDICATED PAGE: BLOG & ESPORTS NEWS (/blog)
   Unique Layout: Editorial Broadsheet Lead Hero + In-Page Split Article Reader
   ============================================================================ */
export const BlogAndNewsPage: React.FC = () => {
  const { blogPosts, addToast, navigate } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePostId, setActivePostId] = useState<string>(blogPosts[0]?.id || '');

  const categories = ['All', ...Array.from(new Set(blogPosts.map((b) => b.category)))];

  const filteredPosts = blogPosts.filter((post) => {
    if (selectedCategory !== 'All' && post.category !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activePost: BlogPost | undefined =
    blogPosts.find((p) => p.id === activePostId) || filteredPosts[0] || blogPosts[0];

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Unique Editorial Broadsheet Hero */}
      <section className="p-6 sm:p-10 rounded-2xl card-premium space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold">
              FREE INCOME BD EDITORIAL DESK · PATCH NOTES & UID SECURITY
            </div>
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#0B1120] dark:text-[#F8FAFC] leading-[1.14]"
              style={{ textWrap: 'balance' }}
            >
              Free Fire Bangladesh Esports Briefings, Patch Meta & Account Safety Guides
            </h1>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Verified weapon balance breakdowns, Clash Squad custom room tactics, and cybersecurity advisories to keep your Garena Free Fire account and mobile banking wallet protected.
            </p>
          </div>

          {/* Search & Category Filter */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="relative">
              <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles & guides..."
                className="w-full min-h-[44px] pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Bar */}
        <div className="pt-4 border-t border-[#DCE4F0] dark:border-[#1E293B] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                selectedCategory === cat
                  ? 'btn-primary text-white'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0B1120] dark:hover:text-white bg-[#F4F7FB] dark:bg-[#070B14]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Split Editorial Reader Layout (7 Cols Reader / 5 Cols Article Directory) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left 7 Cols: Active Full Article Reader */}
        <div className="lg:col-span-7 p-6 sm:p-9 rounded-2xl card-premium space-y-6">
          {activePost ? (
            <>
              <div className="space-y-3 border-b border-[#DCE4F0] dark:border-[#1E293B] pb-5">
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-[#2563EB] dark:text-[#60A5FA]">
                  <span className="font-semibold">{activePost.category}</span>
                  <span>·</span>
                  <span className="text-[#475569] dark:text-[#94A3B8]">
                    Published {activePost.publishedAt}
                  </span>
                  <span>·</span>
                  <span className="text-[#475569] dark:text-[#94A3B8]">{activePost.readTime}</span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#0B1120] dark:text-[#F8FAFC] leading-snug">
                  {activePost.title}
                </h2>
                <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  By <span className="font-semibold text-[#0B1120] dark:text-[#F8FAFC]">{activePost.author}</span> · Dhaka Esports Editorial Desk
                </div>
              </div>

              <div className="space-y-4 text-sm sm:text-base text-[#0B1120] dark:text-[#E2E8F0] leading-[1.75]">
                <p className="font-semibold text-[#475569] dark:text-[#94A3B8]">
                  {activePost.excerpt}
                </p>
                <p>{activePost.content}</p>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] pt-2">
                  All Free Income BD guides are verified for the Bangladesh Free Fire server. Remember: legitimate top-up services and custom room referees will never ask for your Facebook, Google, or Garena account login password.
                </p>
              </div>

              <div className="pt-5 border-t border-[#DCE4F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/blog`);
                    addToast('Article Link Copied', 'Copied blog URL to clipboard.', 'info');
                  }}
                  className="min-h-[40px] px-4 py-2 rounded-xl btn-secondary text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Copy Briefing Link</span>
                </button>
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => navigate('topup')}
                    className="min-h-[40px] px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
                  >
                    Go to UID Top Up →
                  </button>
                  <button
                    onClick={() => navigate('tournaments')}
                    className="min-h-[40px] px-4 py-2 rounded-xl btn-secondary text-xs font-semibold"
                  >
                    Tournament Lobby
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="text-sm text-[#475569] dark:text-[#94A3B8]">
              Select an article from the directory to read the full briefing.
            </div>
          )}
        </div>

        {/* Right 5 Cols: Selectable Briefings List & Security Charter */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl card-premium space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC] flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#2563EB]" />
                <span>All Published Briefings ({filteredPosts.length})</span>
              </h2>
            </div>

            <div className="space-y-3">
              {filteredPosts.map((post) => {
                const isSelected = activePost?.id === post.id;
                return (
                  <button
                    key={post.id}
                    onClick={() => setActivePostId(post.id)}
                    className={`w-full p-4 rounded-xl text-left border transition-all space-y-1.5 ${
                      isSelected
                        ? 'bg-[#EFF6FF] dark:bg-[#1E293B] border-[#2563EB]'
                        : 'bg-[#F4F7FB] dark:bg-[#070B14] border-[#DCE4F0] dark:border-[#1E293B] hover:border-[#2563EB]'
                    }`}
                  >
                    <div className="text-[11px] font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                      {post.category} · {post.publishedAt} · {post.readTime}
                    </div>
                    <div className="font-display text-sm font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                      {post.title}
                    </div>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] line-clamp-2">
                      {post.excerpt}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B1120] text-white border border-[#1E293B] space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#10B981] font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>PLAYER ACCOUNT SAFETY ADVISORY</span>
            </div>
            <h3 className="font-display text-lg font-bold text-white">
              3 Rules to Protect Your Free Fire UID
            </h3>
            <ul className="space-y-2 text-xs text-slate-300 leading-relaxed">
              <li>1. Only top up using your public numeric Player UID or official UniPin voucher codes.</li>
              <li>2. Never share your Facebook, Gmail, or VK password with social media sellers.</li>
              <li>3. Verify custom room IDs directly inside your Free Income BD dashboard.</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

/* ============================================================================
   DEDICATED PAGE: PLAYER REVIEWS & COMMUNITY PROOF (/reviews)
   Unique Layout: Quantitative Rating Distribution Hero + Interactive Review Form
   ============================================================================ */
export const PlayerReviewsPage: React.FC = () => {
  const { reviews, currentUser, submitUserReview, navigate } = useApp();
  const [serviceFilter, setServiceFilter] = useState<string>('All');

  // Review Submission State
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [ffIgn, setFfIgn] = useState(currentUser?.ffIgn || '');
  const [locationCity, setLocationCity] = useState('Dhaka, BD');
  const [serviceUsed, setServiceUsed] = useState('UID Diamond Top Up');
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');

  const filteredReviews = reviews.filter((rev) => {
    if (serviceFilter === 'All') return true;
    return rev.serviceUsed.toLowerCase().includes(serviceFilter.toLowerCase());
  });

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '5.0';

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;
    submitUserReview({
      userName: userName.trim(),
      ffIgn: ffIgn.trim() || 'BD_PLAYER',
      location: locationCity.trim() || 'Dhaka, BD',
      serviceUsed,
      rating,
      comment: comment.trim(),
    });
    setComment('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Unique Quantitative Trust & Rating Breakdown Hero */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-10 rounded-2xl card-premium flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="text-xs font-mono text-[#10B981] font-semibold">
              VERIFIED BANGLADESHI GAMER FEEDBACK · ATTRIBUTABLE OUTCOMES
            </div>
            <h1
              className="font-display text-3xl sm:text-4xl lg:text-[2.75rem] font-bold text-[#0B1120] dark:text-[#F8FAFC] leading-[1.14]"
              style={{ textWrap: 'balance' }}
            >
              Verified Player Reviews & Community Proof Across Bangladesh
            </h1>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Every review below includes the player’s Free Fire In-Game Name (IGN), city, and the exact service completed—from 30-second UID Diamond Top Ups to custom room prize payouts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            {['All', 'Top Up', 'Tournament', 'Income'].map((filterItem) => (
              <button
                key={filterItem}
                onClick={() => setServiceFilter(filterItem)}
                className={`min-h-[38px] px-4 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  serviceFilter === filterItem
                    ? 'btn-primary text-white'
                    : 'btn-secondary text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {filterItem === 'All' ? `All Reviews (${reviews.length})` : `${filterItem} Reviews`}
              </button>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Rating Distribution Card */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-2xl card-premium flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between gap-4 border-b border-[#DCE4F0] dark:border-[#1E293B] pb-4">
            <div>
              <div className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                AGGREGATE COMMUNITY SCORE
              </div>
              <div className="font-display text-4xl font-bold font-mono text-[#0B1120] dark:text-[#F8FAFC] mt-1">
                {avgRating} <span className="text-base font-normal text-[#F59E0B]">/ 5.0 ★</span>
              </div>
            </div>
            <div className="text-right text-xs font-mono text-[#10B981]">
              <div className="font-bold">99.4% Satisfaction</div>
              <div className="text-[#475569] dark:text-[#94A3B8]">{reviews.length} Verified Logs</div>
            </div>
          </div>

          <div className="space-y-2.5 text-xs font-mono">
            {[
              { stars: '5 Stars', pct: 92 },
              { stars: '4 Stars', pct: 7 },
              { stars: '3 Stars', pct: 1 },
            ].map((row) => (
              <div key={row.stars} className="flex items-center gap-3">
                <span className="w-16 text-[#475569] dark:text-[#94A3B8]">{row.stars}</span>
                <div className="flex-1 h-2 rounded-full bg-[#DCE4F0] dark:bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#F59E0B] rounded-full"
                    style={{ width: `${row.pct}%` }}
                  />
                </div>
                <span className="w-10 text-right font-bold">{row.pct}%</span>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
            <span>Want to see live tournament winners?</span>
            <button
              onClick={() => navigate('leaderboard')}
              className="text-[#2563EB] dark:text-[#60A5FA] font-bold hover:underline"
            >
              Open Leaderboard →
            </button>
          </div>
        </div>
      </section>

      {/* Section 2: Reviews Grid + Submit Review Form */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 grid grid-cols-1 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl card-premium flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between gap-2 text-xs font-mono">
                <span className="text-[#F59E0B] font-bold">
                  {'★'.repeat(rev.rating)} ({rev.rating}.0/5.0)
                </span>
                <span className="text-[#475569] dark:text-[#94A3B8]">{rev.date}</span>
              </div>

              <p className="text-sm sm:text-base text-[#0B1120] dark:text-[#F8FAFC] leading-relaxed">
                “{rev.comment}”
              </p>

              <div className="pt-3 border-t border-[#DCE4F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-2 text-xs text-[#475569] dark:text-[#94A3B8]">
                <div>
                  <span className="font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                    {rev.userName}
                  </span>{' '}
                  · <span className="font-mono text-[#2563EB] dark:text-[#60A5FA]">{rev.ffIgn}</span> ·{' '}
                  <span>{rev.location}</span>
                </div>
                <span className="text-[#10B981] font-mono font-semibold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{rev.serviceUsed}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Submit Verified Review Form */}
        <form
          onSubmit={handleReviewSubmit}
          className="lg:col-span-5 p-6 sm:p-8 rounded-2xl card-premium space-y-4"
        >
          <div className="space-y-1">
            <div className="text-xs font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold">
              SHARE YOUR EXPERIENCE
            </div>
            <h2 className="font-display text-xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
              Submit a Verified Player Review
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
              Completed a Diamond Top Up, Custom Room match, or bKash payout? Post your feedback below.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1">Your Name</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g. Sabbir Hossain"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Free Fire IGN</label>
              <input
                type="text"
                required
                value={ffIgn}
                onChange={(e) => setFfIgn(e.target.value)}
                placeholder="e.g. BD_SNIPER_07"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-semibold mb-1">City / Division</label>
              <input
                type="text"
                required
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                placeholder="e.g. Sylhet, BD"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Service Used</label>
              <select
                value={serviceUsed}
                onChange={(e) => setServiceUsed(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              >
                <option value="UID Diamond Top Up">UID Diamond Top Up</option>
                <option value="UniPin Voucher Code">UniPin Voucher Code</option>
                <option value="Clash Squad Tournament">Clash Squad Tournament</option>
                <option value="Income Task Payout">Income Task Payout</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Rating</label>
            <div className="flex items-center gap-2">
              {[5, 4, 3, 2, 1].map((rVal) => (
                <button
                  key={rVal}
                  type="button"
                  onClick={() => setRating(rVal)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    rating === rVal
                      ? 'bg-[#F59E0B] text-[#070B14] border-[#F59E0B]'
                      : 'bg-[#F4F7FB] dark:bg-[#070B14] border-[#DCE4F0] dark:border-[#1E293B]'
                  }`}
                >
                  {rVal} ★
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Your Review</label>
            <textarea
              rows={3}
              required
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe delivery speed, tournament room moderation, or withdrawal experience..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-[44px] py-2.5 px-4 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Publish Verified Review</span>
          </button>
        </form>
      </section>
    </div>
  );
};

/* ============================================================================
   CUSTOM 404 PAGE (/*)
   Unique Layout: Route Diagnostics + Working Back Button + Multi-Page Directory
   ============================================================================ */
export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const quickDestinations = [
    {
      path: '/topup',
      title: 'Diamond Top Up Store',
      desc: 'Instant BD Server UID & UniPin packages',
      icon: <Gem className="w-4 h-4 text-[#2563EB]" />,
    },
    {
      path: '/offers',
      title: 'Special Offers & VIP Passes',
      desc: 'Weekly & Monthly passes and bundles',
      icon: <Sparkles className="w-4 h-4 text-[#F59E0B]" />,
    },
    {
      path: '/tournaments',
      title: 'Esports Tournaments',
      desc: 'Solo, Duo, Squad & Clash Squad rooms',
      icon: <Trophy className="w-4 h-4 text-[#06B6D4]" />,
    },
    {
      path: '/income',
      title: 'Free Income Tasks',
      desc: 'Verified tasks & referral rewards',
      icon: <Coins className="w-4 h-4 text-[#10B981]" />,
    },
    {
      path: '/faq',
      title: 'Help Center & FAQ',
      desc: 'Answers on UID delivery & payouts',
      icon: <HelpCircle className="w-4 h-4 text-[#2563EB]" />,
    },
    {
      path: '/contact',
      title: 'Contact Dhaka Support',
      desc: 'Banani office map & direct ticket desk',
      icon: <Compass className="w-4 h-4 text-[#10B981]" />,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-20 space-y-10">
      <div className="p-8 sm:p-12 rounded-2xl card-premium text-center space-y-6">
        <div className="text-xs font-mono uppercase tracking-wider text-[#EF4444] font-bold">
          HTTP 404 · ROUTE NOT FOUND
        </div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
          This URL Does Not Match Any Active Page
        </h1>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] max-w-xl mx-auto leading-relaxed">
          The path <span className="font-mono font-bold text-[#2563EB] dark:text-[#60A5FA]">{location.pathname}</span> could not be found on Free Income BD. Use the Back button below or select any verified page from our directory.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? routerNavigate(-1) : routerNavigate('/'))}
            className="min-h-[44px] px-5 py-2.5 rounded-xl btn-secondary text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back to Previous Page</span>
          </button>
          <Link
            to="/"
            className="min-h-[44px] px-6 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-semibold inline-flex items-center gap-2"
          >
            <span>Return to Home Hub (/)</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
          Direct Multi-Page Directory
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickDestinations.map((dest) => (
            <Link
              key={dest.path}
              to={dest.path}
              className="p-5 rounded-2xl card-premium card-premium-interactive flex flex-col justify-between space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                  {dest.title}
                </span>
                {dest.icon}
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">{dest.desc}</p>
              <span className="text-[11px] font-mono text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                {dest.path} →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
