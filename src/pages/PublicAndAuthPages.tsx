import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Trophy,
  Award,
  Users,
  Mail,
  Phone,
  MapPin,
  Search,
  ChevronDown,
  ChevronUp,
  LogIn,
  UserPlus,
  Zap,
  Lock,
} from 'lucide-react';
import { PUBLIC_ENV } from '../config/env';
import { useApp } from '../context/AppContext';

/* ============================================================================
   2. ABOUT US PAGE
   ============================================================================ */
export const AboutPage: React.FC = () => {
  const { siteSettings, navigate } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="p-8 sm:p-10 rounded-2xl card-premium space-y-4">
        <div className="text-xs font-semibold text-[#2563EB]">
          About {siteSettings.siteName} · Established in Dhaka, Bangladesh
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
          Engineering Bangladesh’s Most Trusted 3-in-1 Gaming, Esports & Rewards Ecosystem
        </h1>
        <p className="text-sm sm:text-base text-[#475569] dark:text-[#94A3B8] leading-relaxed">
          {siteSettings.siteName} was built to solve three widespread problems faced by Bangladeshi mobile gamers: delayed or unsafe social-media diamond top-ups, unmoderated custom rooms that fail to pay winners, and opaque online task sites. By combining all three pillars under a single verified fintech wallet, players can top up, compete, and earn transparently.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl card-premium space-y-3">
          <div className="text-xs font-mono font-bold text-[#2563EB]">01. UID & UniPin Top Up</div>
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Zero Password Exposure
          </h2>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            We never ask for your Garena, Facebook, or Google login credentials. Diamonds are delivered directly via numeric Player UID or official redeemable UniPin vouchers in 30–60 seconds.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium space-y-3">
          <div className="text-xs font-mono font-bold text-[#06B6D4]">02. Moderated Esports</div>
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Anti-Cheat Custom Rooms
          </h2>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Every Solo, Duo, Squad, and Clash Squad room is supervised by Dhaka referees. Room IDs are visible only to registered participants, and prize money is credited automatically upon match completion.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium space-y-3">
          <div className="text-xs font-mono font-bold text-[#10B981]">03. Compliant Rewards</div>
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Transparent Task Verification
          </h2>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            We partner with verified regional brands and research surveys. We make zero guaranteed-income claims—users earn transparent BDT rewards for genuine, verified task completions.
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 rounded-2xl card-premium flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Ready to Experience {siteSettings.siteName}?
          </h3>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Headquartered at {siteSettings.officeAddress}.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('topup')}
            className="px-4 py-2.5 rounded-xl bg-[#2563EB] text-white text-xs font-semibold"
          >
            Explore Top Up Packages
          </button>
          <button
            onClick={() => navigate('contact')}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold"
          >
            Contact Dhaka Office
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   12. LEADERBOARD PAGE (TOURNAMENT WINNERS, TASK EARNERS, REFERRERS)
   ============================================================================ */
export const LeaderboardPage: React.FC = () => {
  const { users } = useApp();
  const [tab, setTab] = useState<'tournaments' | 'earners' | 'referrers'>('tournaments');

  const sortedUsers = [...users].sort((a, b) => {
    if (tab === 'tournaments') return b.tournamentWins - a.tournamentWins;
    if (tab === 'earners') return b.totalEarned - a.totalEarned;
    return b.referralCount - a.referralCount;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Bangladesh Hall of Fame & Standings
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
            Live leaderboard rankings across custom room championships, verified task rewards, and community referrals.
          </p>
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] overflow-x-auto max-w-full no-scrollbar">
          <button
            onClick={() => setTab('tournaments')}
            className={`min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              tab === 'tournaments'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            Top Tournament Winners
          </button>
          <button
            onClick={() => setTab('earners')}
            className={`min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              tab === 'earners'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            Top Task Earners
          </button>
          <button
            onClick={() => setTab('referrers')}
            className={`min-h-[38px] px-3.5 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
              tab === 'referrers'
                ? 'bg-[#2563EB] text-white'
                : 'text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            Top Referrers
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl card-premium overflow-x-auto">
        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8]">
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Player Name</th>
              <th className="py-3 px-4">Free Fire IGN & UID</th>
              <th className="py-3 px-4 text-right">Tournament Booyahs</th>
              <th className="py-3 px-4 text-right">Verified Referrals</th>
              <th className="py-3 px-4 text-right">Total BDT Earned</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
            {sortedUsers.map((u, idx) => (
              <tr key={u.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0B1120]">
                <td className="py-3.5 px-4 font-bold text-[#2563EB]">#0{idx + 1}</td>
                <td className="py-3.5 px-4 font-sans font-bold text-[#0F172A] dark:text-[#F8FAFC] whitespace-nowrap">
                  {u.name}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {u.ffIgn} · <span className="text-[#475569] dark:text-[#94A3B8]">{u.ffUid}</span>
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#F59E0B] whitespace-nowrap">
                  {u.tournamentWins} Wins
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#06B6D4] whitespace-nowrap">
                  {u.referralCount} Players
                </td>
                <td className="py-3.5 px-4 text-right font-bold text-[#10B981] whitespace-nowrap">
                  ৳{u.totalEarned} BDT
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================================================================
   13. CONTACT US PAGE (WITH EMBEDDED GOOGLE MAPS FOR BANANI, DHAKA-1213)
   ============================================================================ */
export const ContactPage: React.FC = () => {
  const { siteSettings, submitContactMessage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitContactMessage({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
          Contact Dhaka Operations & Player Support
        </h1>
        <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
          Direct support for UID Top Up orders, tournament room moderation, and mobile banking verifications.
        </p>
      </div>

      {/* Support Channel Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl card-premium space-y-2">
          <Phone className="w-5 h-5 text-[#10B981]" />
          <h2 className="text-base font-bold">WhatsApp & Telegram Desk</h2>
          <p className="text-xs font-mono text-[#0F172A] dark:text-[#F8FAFC]">
            WhatsApp: {siteSettings.supportWhatsapp}
          </p>
          <p className="text-xs font-mono text-[#2563EB]">
            Telegram: {siteSettings.supportTelegram}
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium space-y-2">
          <Mail className="w-5 h-5 text-[#2563EB]" />
          <h2 className="text-base font-bold">Official Support Email</h2>
          <p className="text-xs font-mono text-[#0F172A] dark:text-[#F8FAFC]">
            {siteSettings.supportEmail}
          </p>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Average response time: Under 2 hours (10:00 AM – 11:30 PM BST)
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium space-y-2">
          <MapPin className="w-5 h-5 text-[#F59E0B]" />
          <h2 className="text-base font-bold">Dhaka Headquarters</h2>
          <p className="text-xs text-[#0F172A] dark:text-[#F8FAFC]">
            {siteSettings.officeAddress}
          </p>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Banani Commercial Area, Dhaka-1213, Bangladesh
          </p>
        </div>
      </div>

      {/* Form & Embedded Map */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-6 p-5 sm:p-8 rounded-2xl card-premium space-y-4"
        >
          <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Send a Direct Message to Admin Support
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Your Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Tanvir Ahmed"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Mobile Number</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">Subject</label>
              <input
                type="text"
                required
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Order ID / Guild Inquiry"
                className="w-full min-h-[42px] px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Message</label>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your inquiry or partnership request here..."
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="w-full min-h-[44px] py-3 rounded-xl btn-primary text-xs font-semibold"
          >
            Send Inquiry to Admin Console
          </button>
        </form>

        <div className="lg:col-span-6 rounded-2xl overflow-hidden border border-[#E2E8F0] dark:border-[#1E293B] bg-white dark:bg-[#111827] min-h-[300px] sm:min-h-[360px]">
          <iframe
            title="Free Income BD Banani Dhaka Office Map"
            src={siteSettings.mapEmbedUrl || PUBLIC_ENV.MAP_EMBED_URL}
            className="w-full h-full min-h-[300px] sm:min-h-[360px] border-0"
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   14. CATEGORIZED SEARCHABLE FAQ PAGE
   ============================================================================ */
export const FaqPage: React.FC = () => {
  const { faqs } = useApp();
  const [cat, setCat] = useState<'All' | 'Top Up' | 'Tournaments' | 'Income Tasks' | 'Wallet & Payments'>('All');
  const [search, setSearch] = useState('');
  const [openId, setOpenId] = useState<string | null>('FAQ-1');

  const filtered = faqs.filter((f) => {
    if (cat !== 'All' && f.category !== cat) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
          Answers regarding UID Diamond delivery, Custom Room credentials, compliant tasks, and bKash/Nagad payouts.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B] overflow-x-auto max-w-full no-scrollbar">
          {(['All', 'Top Up', 'Tournaments', 'Income Tasks', 'Wallet & Payments'] as const).map(
            (c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`min-h-[36px] px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 ${
                  cat === c
                    ? 'bg-[#2563EB] text-white'
                    : 'text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {c}
              </button>
            )
          )}
        </div>

        <div className="relative">
          <Search className="w-4 h-4 text-[#475569] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            maxLength={100}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQ..."
            className="w-full sm:w-auto min-h-[40px] pl-9 pr-3.5 py-2 text-xs rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
          />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = openId === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl card-premium overflow-hidden"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4"
              >
                <div>
                  <span className="text-xs font-semibold text-[#2563EB] mr-2">
                    [{item.category}]
                  </span>
                  <span className="text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {item.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-[#2563EB] shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-[#475569] shrink-0" />
                )}
              </button>
              {isOpen && (
                <div className="px-6 pb-5 pt-3 border-t border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

/* ============================================================================
   15. PLAYER LOGIN PAGE (NO DEMO CREDENTIALS OR DEMO ADMIN SHORTCUTS)
   ============================================================================ */
export const LoginPage: React.FC = () => {
  const { login, navigate } = useApp();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(identifier, password);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-14">
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-6 shadow-xl">
        <div className="space-y-1 text-center">
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Player Sign In · Free Income BD
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Access your unified Diamond Top Up, Esports Room IDs, and Fintech Wallet.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold mb-1">
              Email or Bangladesh Mobile Number
            </label>
            <input
              type="text"
              required
              maxLength={160}
              autoComplete="username"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="you@example.com or 017XXXXXXXX"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">Password</label>
            <input
              type="password"
              required
              maxLength={128}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your account password"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Player Account</span>
          </button>
        </form>

        <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between gap-2 text-xs">
          <span className="text-[#475569] dark:text-[#94A3B8]">
            Administrator access?
          </span>
          <button
            type="button"
            onClick={() => navigate('admin')}
            className="text-[#2563EB] font-bold hover:underline inline-flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Open Admin Auth Portal →</span>
          </button>
        </div>

        <div className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
          New to Free Income BD?{' '}
          <button
            onClick={() => navigate('register')}
            className="text-[#2563EB] font-bold hover:underline"
          >
            Create Player Account →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   16. REGISTRATION PAGE (WITH AUTOMATIC ?ref=CODE DETECTION)
   ============================================================================ */
export const RegisterPage: React.FC = () => {
  const { register, navigate } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [ffUid, setFfUid] = useState('');
  const [ffIgn, setFfIgn] = useState('');
  const [password, setPassword] = useState('');
  const [referralCodeInput, setReferralCodeInput] = useState('TAHSINBD');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const refParam = params.get('ref');
    if (refParam) {
      setReferralCodeInput(refParam.replace(/[^a-zA-Z0-9]/g, '').slice(0, 20).toUpperCase());
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    register({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      ffUid: ffUid.trim(),
      ffIgn: ffIgn.trim(),
      referralCodeInput: referralCodeInput.trim() || undefined,
    });
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-6 shadow-xl">
        <div className="space-y-1">
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Create Your Free Income BD Account
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Receive a ৳20 Welcome Bonus Balance + ৳15 extra Income Balance when joining with a referral code.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Full Name</label>
              <input
                type="text"
                required
                maxLength={80}
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Shakib Al Hasan"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Bangladesh Mobile Number
              </label>
              <input
                type="tel"
                required
                maxLength={14}
                autoComplete="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">Email Address</label>
            <input
              type="email"
              required
              maxLength={160}
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="player@gmail.com"
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Free Fire Player UID (BD Server)
              </label>
              <input
                type="text"
                inputMode="numeric"
                required
                maxLength={12}
                value={ffUid}
                onChange={(e) => setFfUid(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2849103842"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                In-Game Name (IGN)
              </label>
              <input
                type="text"
                required
                maxLength={40}
                value={ffIgn}
                onChange={(e) => setFfIgn(e.target.value)}
                placeholder="e.g. BD_STRIKER"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">Password</label>
              <input
                type="password"
                required
                minLength={6}
                maxLength={128}
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Referral Code (Optional)
              </label>
              <input
                type="text"
                maxLength={20}
                value={referralCodeInput}
                onChange={(e) => setReferralCodeInput(e.target.value)}
                placeholder="e.g. TAHSINBD"
                className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Register & Claim Welcome Bonus</span>
          </button>
        </form>

        <div className="text-center text-xs text-[#475569] dark:text-[#94A3B8] pt-2 border-t border-[#E2E8F0] dark:border-[#1E293B]">
          Already have an account?{' '}
          <button
            onClick={() => navigate('login')}
            className="text-[#2563EB] font-bold hover:underline"
          >
            Sign In →
          </button>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   17. PRIVACY POLICY PAGE
   ============================================================================ */
export const PrivacyPage: React.FC = () => {
  const { siteSettings } = useApp();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="p-8 rounded-2xl card-premium space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#2563EB]">
          <Lock className="w-4 h-4" />
          <span>Data Protection & Payment Security Charter · Last Updated Nov 2026</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
          Privacy Policy
        </h1>
        <div className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
          <p>
            <strong>1. Zero Game Password Collection:</strong> {siteSettings.siteName} strictly collects only your public numeric Free Fire Player UID and In-Game Name (IGN) to process diamond top-ups and tournament registrations. We never request or store your Facebook, Google, VK, or Garena account passwords.
          </p>
          <p>
            <strong>2. Mobile Financial Transaction Data:</strong> When you deposit or withdraw via bKash, Nagad, Rocket, or Upay, we record only the sender/receiver mobile number and Transaction ID (TrxID) required for financial reconciliation and fraud prevention. We never ask for your mobile banking PIN or OTP.
          </p>
          <p>
            <strong>3. Task Proof & Anti-Fraud Logs:</strong> Task submissions (such as screenshot URLs or survey reference codes) are reviewed solely by internal moderators to validate advertiser compliance and are never sold to third-party data brokers.
          </p>
          <p>
            <strong>4. Contact & Data Deletion Requests:</strong> Players may request full account deletion or data export at any time by emailing{' '}
            <span className="font-mono text-[#2563EB]">{siteSettings.supportEmail}</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   18. TERMS & CONDITIONS PAGE
   ============================================================================ */
export const TermsPage: React.FC = () => {
  const { siteSettings, paymentSettings } = useApp();
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-6">
      <div className="p-8 rounded-2xl card-premium space-y-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-[#10B981]">
          <ShieldCheck className="w-4 h-4" />
          <span>Fair Play, Task Compliance & Financial Rules · Effective Nov 2026</span>
        </div>
        <h1 className="text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
          Terms & Conditions
        </h1>
        <div className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
          <p>
            <strong>1. Diamond Top Up & Refund Policy:</strong> Customers are responsible for entering the correct Bangladesh Server Free Fire Player UID. If an order is cancelled due to stock maintenance or invalid UID before fulfillment, 100% of the BDT amount is automatically refunded to your Main Wallet Balance.
          </p>
          <p>
            <strong>2. Esports Fair-Play & Anti-Cheat Rules:</strong> Participants in Solo, Duo, Squad, and Clash Squad custom rooms must play on mobile devices without PC emulators, third-party scripts, or teaming in Solo mode. Sharing unlocked Room IDs/Passwords with unregistered outsiders leads to immediate disqualification and account suspension.
          </p>
          <p>
            <strong>3. Free Income Task Compliance & No Guaranteed-Income Disclaimer:</strong>{' '}
            {siteSettings.siteName} is an active gaming and micro-task reward platform—NOT an investment scheme, MLM, or passive income program. Users earn rewards strictly per verified task completion or referral. Duplicate accounts, photoshopped proofs, or automated bots result in submission rejection.
          </p>
          <p>
            <strong>4. Withdrawal Conditions:</strong> Approved Income Balance can be withdrawn once a minimum balance of ৳{paymentSettings.minWithdrawBdt} BDT is reached via active gateways (bKash, Nagad, Rocket, Upay), or transferred to your Main Balance with 0% fee at any time.
          </p>
        </div>
      </div>
    </div>
  );
};
