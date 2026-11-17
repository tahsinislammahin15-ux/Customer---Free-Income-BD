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
   1. SPECIAL OFFERS & VIP BUNDLES (/offers)
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
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      {/* Top Target UID & Guild Savings Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 zvy-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold text-[#3B0A0A] dark:text-[#FCA5A5] uppercase">
              VIP MEMBERSHIPS & PROMOTIONAL BUNDLES · BD SERVER
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
              Special Offers, Weekly & Monthly Passes
            </h1>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              Discounted Weekly & Monthly memberships and Evo-gun diamond bundles delivered directly to your Player UID.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Player ID (UID)</label>
              <input
                type="text"
                value={targetUid}
                onChange={(e) => setTargetUid(e.target.value.replace(/\D/g, ''))}
                placeholder="2849103842"
                className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Player IGN (Optional)</label>
              <input
                type="text"
                value={targetIgn}
                onChange={(e) => setTargetIgn(e.target.value)}
                placeholder="BD_TAHSIN_99"
                className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
          </div>
        </div>

        {/* Squad Weekly Pass Estimator */}
        <div className="lg:col-span-5 zvy-card p-4 sm:p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-extrabold text-[#D97706] uppercase">
                GUILD BUNDLE ESTIMATOR
              </span>
              <h2 className="text-base font-extrabold text-[#111827] dark:text-white">
                Squad Pass Calculator
              </h2>
            </div>
            <img
              src={DIAMOND_IMAGE}
              alt="Diamond Bundles"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-12 h-10 rounded-lg object-cover border border-[#E5E7EB]"
            />
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-mono mb-1">
                <span>Squad Size</span>
                <span className="font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5]">
                  {guildSquadSize} Players
                </span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                step={1}
                value={guildSquadSize}
                onChange={(e) => setGuildSquadSize(Number(e.target.value))}
                className="w-full accent-[#3B0A0A]"
              />
            </div>

            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1 text-xs font-mono">
              <div className="flex justify-between text-[#6B7280]">
                <span>{guildSquadSize} × Weekly Pass</span>
                <span>৳{squadWeeklyTotal} BDT</span>
              </div>
              <div className="flex justify-between text-[#059669]">
                <span>Squad Discount (8%)</span>
                <span>-৳{squadDiscountBdt} BDT</span>
              </div>
              <div className="pt-1 border-t border-[#E5E7EB] dark:border-[#1E293B] flex justify-between font-extrabold text-[#111827] dark:text-white">
                <span>Total</span>
                <span className="text-[#3B0A0A] dark:text-[#FCA5A5]">৳{squadNetBdt} BDT</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (weeklyPass) addToCart(weeklyPass, targetUid, targetIgn);
              }}
              className="w-full h-[40px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-bold transition-colors"
            >
              Add Weekly Pass to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Membership Cards */}
      <div className="zvy-card p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="step-badge">1</span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              WEEKLY & MONTHLY MEMBERSHIPS
            </h2>
          </div>
          <Link to="/topup" className="text-xs font-bold text-[#3B0A0A] hover:underline">
            All Top-Up Packages →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {[weeklyPass, monthlyPass].filter(Boolean).map((pass, idx) => (
            <div
              key={pass.id}
              className="p-4 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5]">
                    {idx === 0 ? '7-DAY PASS' : '30-DAY PASS'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold">
                    {pass.deliverySpeed}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                  {language === 'bn' ? pass.titleBn : pass.title}
                </h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">
                  {idx === 0
                    ? '100 instant diamonds + 50 daily check-in diamonds for 7 days.'
                    : '500 instant diamonds + 70 daily check-in diamonds for 30 days.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B]">
                <div className="text-xl font-extrabold font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">
                  ৳{pass.priceBdt} BDT
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => addToCart(pass, targetUid, targetIgn)}
                    className="h-[36px] px-3 rounded-lg border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold"
                  >
                    + Cart
                  </button>
                  <button
                    type="button"
                    onClick={() => handleInstantBundleOrder(pass)}
                    className="h-[36px] px-4 rounded-lg bg-[#0D3B66] text-white text-xs font-bold"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Discounted Diamond Bundles */}
      <div className="zvy-card p-4 sm:p-5 space-y-4">
        <div className="flex items-center gap-2">
          <span className="step-badge">2</span>
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
            FEATURED DIAMOND PACKS
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {specialBundles.map((pkg) => {
            const isSaved = wishlist.includes(pkg.id);
            return (
              <div
                key={pkg.id}
                className="zvy-recharge-item flex-col items-stretch justify-between space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold text-[#D97706] uppercase">
                      {pkg.discountBadge || 'Popular Offer'} · {pkg.deliverySpeed}
                    </div>
                    <h3 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] mt-0.5">
                      {language === 'bn' ? pkg.titleBn : pkg.title}
                    </h3>
                    <div className="text-[11px] font-mono text-[#6B7280]">
                      {pkg.diamonds} Diamonds
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleWishlist(pkg.id)}
                    aria-label="Save bundle"
                    className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#DC2626]"
                  >
                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#DC2626] text-[#DC2626]' : ''}`} />
                  </button>
                </div>

                <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-2">
                  <div>
                    <div className="text-base font-extrabold font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">
                      ৳{pkg.priceBdt} BDT
                    </div>
                    {pkg.originalPriceBdt && (
                      <div className="text-[11px] font-mono text-[#9CA3AF] line-through">
                        ৳{pkg.originalPriceBdt} BDT
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => addToCart(pkg, targetUid, targetIgn)}
                      className="h-[34px] px-2.5 rounded-lg border border-[#D1D5DB] text-xs font-semibold flex items-center gap-1"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Cart</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInstantBundleOrder(pkg)}
                      className="h-[34px] px-3 rounded-lg bg-[#0D3B66] text-white text-xs font-bold"
                    >
                      Buy
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. BLOG & ESPORTS NEWS (/blog)
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
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      <div className="zvy-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#3B0A0A] dark:text-[#FCA5A5] uppercase">
              H41FFTOPUP GUIDES · UID SAFETY & ESPORTS META
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
              Free Fire Bangladesh Guides & News
            </h1>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
              Patch breakdowns, Clash Squad tips, and account security guides.
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides..."
              className="w-full h-[38px] pl-9 pr-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-2 border-t border-[#E5E7EB] dark:border-[#1E293B]">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#3B0A0A] text-white'
                  : 'text-[#4B5563] bg-[#F3F4F6] dark:bg-[#0B1120]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 zvy-card p-5 sm:p-6 space-y-4">
          {activePost ? (
            <>
              <div className="space-y-2 border-b border-[#E5E7EB] dark:border-[#1E293B] pb-4">
                <div className="text-[11px] font-mono text-[#3B0A0A] dark:text-[#FCA5A5] font-bold">
                  {activePost.category} · {activePost.publishedAt} · {activePost.readTime}
                </div>
                <h2 className="text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                  {activePost.title}
                </h2>
                <div className="text-xs text-[#6B7280]">By {activePost.author}</div>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-[#374151] dark:text-[#D1D5DB] leading-relaxed">
                <p className="font-semibold text-[#111827] dark:text-white">
                  {activePost.excerpt}
                </p>
                <p>{activePost.content}</p>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/blog`);
                    addToast('Link Copied', 'Copied guide URL to clipboard.', 'info');
                  }}
                  className="h-[36px] px-3 rounded-lg border border-[#D1D5DB] text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate('topup')}
                  className="h-[36px] px-4 rounded-lg bg-[#0D3B66] text-white text-xs font-bold"
                >
                  Go to Top-Up →
                </button>
              </div>
            </>
          ) : (
            <div className="text-xs text-[#6B7280]">Select a guide from the list.</div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="zvy-card p-4 sm:p-5 space-y-3">
            <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5 uppercase">
              <BookOpen className="w-4 h-4 text-[#3B0A0A]" />
              <span>ALL GUIDES ({filteredPosts.length})</span>
            </h2>
            <div className="space-y-2">
              {filteredPosts.map((post) => (
                <button
                  key={post.id}
                  type="button"
                  onClick={() => setActivePostId(post.id)}
                  className={`w-full p-3 rounded-xl text-left border transition-all space-y-1 ${
                    activePost?.id === post.id
                      ? 'border-2 border-[#3B0A0A] bg-[#FFF5F5] dark:bg-[#2A0B0B]'
                      : 'border-[#E5E7EB] dark:border-[#1E293B] bg-[#FAFAFA] dark:bg-[#0B1120]'
                  }`}
                >
                  <div className="text-[10px] font-mono font-bold text-[#3B0A0A] dark:text-[#FCA5A5]">
                    {post.category} · {post.publishedAt}
                  </div>
                  <div className="text-xs font-extrabold text-[#111827] dark:text-white">
                    {post.title}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="zvy-card p-4 sm:p-5 space-y-2 bg-[#230505] text-white border-[#3D1414]">
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#00C853] uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>ACCOUNT SECURITY NOTICE</span>
            </div>
            <p className="text-xs text-white/80 leading-relaxed">
              H41FFTOPUP only requires your numeric Player UID. Never share your Facebook, Gmail, or VK passwords with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   3. PLAYER REVIEWS & COMMUNITY PROOF (/reviews)
   ============================================================================ */
export const PlayerReviewsPage: React.FC = () => {
  const { reviews, currentUser, submitUserReview, navigate } = useApp();
  const [serviceFilter, setServiceFilter] = useState<string>('All');

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
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-7 zvy-card p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-[#059669] uppercase">
              VERIFIED CUSTOMER REVIEWS · BANGLADESH
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
              Player Reviews & Order Proof
            </h1>
            <p className="text-xs text-[#6B7280]">
              Feedback from Bangladeshi Free Fire players for UID Top-Ups, Custom Rooms, and bKash payouts.
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {['All', 'Top Up', 'Tournament', 'Income'].map((filterItem) => (
              <button
                key={filterItem}
                type="button"
                onClick={() => setServiceFilter(filterItem)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                  serviceFilter === filterItem
                    ? 'bg-[#3B0A0A] text-white'
                    : 'bg-[#F3F4F6] dark:bg-[#0B1120] text-[#4B5563]'
                }`}
              >
                {filterItem === 'All' ? `All (${reviews.length})` : filterItem}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 zvy-card p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-3">
            <div>
              <div className="text-[11px] font-bold text-[#6B7280] uppercase">RATING</div>
              <div className="text-3xl font-extrabold font-mono text-[#111827] dark:text-white">
                {avgRating} <span className="text-sm text-[#F59E0B]">/ 5.0 ★</span>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold">
              99.4% TRUSTED
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#6B7280]">{reviews.length} verified reviews</span>
            <button
              type="button"
              onClick={() => navigate('leaderboard')}
              className="font-bold text-[#3B0A0A] hover:underline"
            >
              View Leaderboard →
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        <div className="lg:col-span-7 space-y-3">
          {filteredReviews.map((rev) => (
            <div key={rev.id} className="zvy-card p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[#F59E0B] font-extrabold">
                  {'★'.repeat(rev.rating)} ({rev.rating}.0)
                </span>
                <span className="text-[#6B7280]">{rev.date}</span>
              </div>
              <p className="text-xs sm:text-sm text-[#111827] dark:text-[#F8FAFC]">
                “{rev.comment}”
              </p>
              <div className="pt-2 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between text-[11px]">
                <span className="font-bold">
                  {rev.userName} ({rev.ffIgn}) · {rev.location}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>{rev.serviceUsed}</span>
                </span>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleReviewSubmit} className="lg:col-span-5 zvy-card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <span className="step-badge">1</span>
            <h2 className="text-sm font-extrabold uppercase">SUBMIT YOUR REVIEW</h2>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium mb-1">Your Name</label>
              <input
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="Sabbir"
                className="w-full h-[38px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Free Fire IGN</label>
              <input
                type="text"
                required
                value={ffIgn}
                onChange={(e) => setFfIgn(e.target.value)}
                placeholder="BD_SNIPER"
                className="w-full h-[38px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-medium mb-1">City</label>
              <input
                type="text"
                required
                value={locationCity}
                onChange={(e) => setLocationCity(e.target.value)}
                className="w-full h-[38px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Service</label>
              <select
                value={serviceUsed}
                onChange={(e) => setServiceUsed(e.target.value)}
                className="w-full h-[38px] px-2.5 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB]"
              >
                <option value="UID Diamond Top Up">UID Diamond Top Up</option>
                <option value="UniPin Voucher Code">UniPin Voucher Code</option>
                <option value="Clash Squad Tournament">Clash Squad Tournament</option>
                <option value="Income Task Payout">Income Task Payout</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {[5, 4, 3, 2, 1].map((rVal) => (
              <button
                key={rVal}
                type="button"
                onClick={() => setRating(rVal)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${
                  rating === rVal
                    ? 'bg-[#3B0A0A] text-white border-[#3B0A0A]'
                    : 'bg-white border-[#D1D5DB]'
                }`}
              >
                {rVal} ★
              </button>
            ))}
          </div>

          <textarea
            rows={3}
            required
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your Top-Up speed or tournament experience..."
            className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB]"
          />

          <button
            type="submit"
            className="w-full h-[40px] rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Review</span>
          </button>
        </form>
      </div>
    </div>
  );
};

/* ============================================================================
   4. CUSTOM 404 PAGE (/*)
   ============================================================================ */
export const NotFoundPage: React.FC = () => {
  const location = useLocation();
  const routerNavigate = useNavigate();

  const quickDestinations = [
    {
      path: '/topup',
      title: 'Diamond Top Up Store',
      desc: 'BD Server UID & UniPin packages',
      icon: <Gem className="w-4 h-4 text-[#3B0A0A]" />,
    },
    {
      path: '/offers',
      title: 'Special Offers & Passes',
      desc: 'Weekly & Monthly memberships',
      icon: <Sparkles className="w-4 h-4 text-[#D97706]" />,
    },
    {
      path: '/tournaments',
      title: 'Esports Tournaments',
      desc: 'Solo, Duo, Squad custom rooms',
      icon: <Trophy className="w-4 h-4 text-[#0D3B66]" />,
    },
    {
      path: '/income',
      title: 'Free Income Tasks',
      desc: 'Verified tasks & referrals',
      icon: <Coins className="w-4 h-4 text-[#059669]" />,
    },
    {
      path: '/faq',
      title: 'Help Center & FAQ',
      desc: 'Order & wallet answers',
      icon: <HelpCircle className="w-4 h-4 text-[#3B0A0A]" />,
    },
    {
      path: '/contact',
      title: 'Contact Support',
      desc: 'Dhaka helpdesk & ticket form',
      icon: <Compass className="w-4 h-4 text-[#059669]" />,
    },
  ];

  return (
    <div className="max-w-[820px] mx-auto px-3.5 py-12 space-y-6">
      <div className="zvy-card p-6 sm:p-8 text-center space-y-4">
        <div className="inline-block px-2.5 py-1 rounded-full bg-[#FEE2E2] text-[#B91C1C] text-[11px] font-extrabold">
          404 · PAGE NOT FOUND
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
          Page Not Found on H41FFTOPUP
        </h1>
        <p className="text-xs sm:text-sm text-[#6B7280] max-w-md mx-auto">
          The URL <span className="font-mono font-bold text-[#3B0A0A]">{location.pathname}</span> does not match an active page.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
          <button
            type="button"
            onClick={() => (window.history.length > 1 ? routerNavigate(-1) : routerNavigate('/'))}
            className="h-[40px] px-4 rounded-xl border border-[#D1D5DB] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
          <Link
            to="/"
            className="h-[40px] px-5 rounded-xl bg-[#3B0A0A] text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <span>Return Home</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickDestinations.map((dest) => (
          <Link
            key={dest.path}
            to={dest.path}
            className="zvy-card p-4 flex flex-col justify-between space-y-1.5 hover:border-[#3B0A0A] transition-colors"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#111827] dark:text-white">
                {dest.title}
              </span>
              {dest.icon}
            </div>
            <p className="text-[11px] text-[#6B7280]">{dest.desc}</p>
            <span className="text-[11px] font-mono font-bold text-[#3B0A0A]">
              {dest.path} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
