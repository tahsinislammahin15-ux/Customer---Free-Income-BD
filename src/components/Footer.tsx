import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Phone, Mail, Send, Lock } from 'lucide-react';
import { PUBLIC_ENV } from '../config/env';
import { useApp } from '../context/AppContext';
import { sanitizeSafeUrl } from '../utils/security';

export const Footer: React.FC = () => {
  const { siteSettings, addToast } = useApp();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    addToast(
      'Alert Subscription Active',
      `We will notify ${email.trim()} when Free Entry Custom Rooms and Weekly Pass offers go live.`,
      'success'
    );
    setEmail('');
  };

  return (
    <footer className="bg-white dark:bg-[#080E1B] border-t border-[#E2E8F0] dark:border-[#1E2D4A] mt-20">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Trust Charter */}
          <div className="lg:col-span-4 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group w-fit">
              {siteSettings.logoUrl ? (
                <img
                  src={siteSettings.logoUrl}
                  alt={siteSettings.siteName}
                  loading="lazy"
                  referrerPolicy="no-referrer"
                  className="w-10 h-10 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E2D4A]"
                />
              ) : (
                <div className="w-10 h-10 rounded-xl btn-primary flex items-center justify-center text-white font-display font-extrabold text-sm">
                  FIBD
                </div>
              )}
              <div>
                <div className="font-display font-bold text-base text-[#0F172A] dark:text-[#F8FAFC]">
                  {siteSettings.siteName}
                </div>
                <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                  {siteSettings.tagline}
                </div>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
              Bangladesh’s trusted 3-in-1 Free Fire Diamond & UniPin Top Up center, moderated custom room tournament arena, and transparent online micro-task platform.
            </p>

            <div className="space-y-2 text-xs text-[#475569] dark:text-[#94A3B8]">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />
                <span>{siteSettings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#10B981] shrink-0" />
                <span className="font-mono">WhatsApp: {siteSettings.supportWhatsapp}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F59E0B] shrink-0" />
                <span className="font-mono">{siteSettings.supportEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 2: Gaming, Esports & Rewards Pages */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
              Platform Pages
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
              <li>
                <Link to="/topup" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                  Diamond Top Up Store
                </Link>
              </li>
              <li>
                <Link to="/offers" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                  Special Offers & VIP Passes
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                  Esports Custom Rooms
                </Link>
              </li>
              <li>
                <Link to="/income" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                  Free Income Tasks
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                  Top Winners & Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                  Esports Blog & Guides
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Account, Community & Legal Pages */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
              Player Wallet & Help Center
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8]">
              <Link to="/account" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                My Account
              </Link>
              <Link to="/reviews" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Player Reviews
              </Link>
              <Link to="/wallet" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Fintech Wallet
              </Link>
              <Link to="/faq" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Help & FAQ
              </Link>
              <Link to="/deposit" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Deposit BDT
              </Link>
              <Link to="/contact" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Contact Desk
              </Link>
              <Link to="/withdraw" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Withdraw BDT
              </Link>
              <Link to="/about" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                About Us
              </Link>
              <Link to="/transactions" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Ledger History
              </Link>
              <Link to="/privacy" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/profile" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                UID Profile
              </Link>
              <Link to="/terms" className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors">
                Terms & Rules
              </Link>
            </div>
          </div>

          {/* Col 4: Newsletter & Verified Gateways */}
          <div className="lg:col-span-3 space-y-4">
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-[#0F172A] dark:text-[#F8FAFC]">
              Tournament & Offer Alerts
            </h3>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
              Get notified when Free Entry Custom Rooms and discounted Weekly Memberships go live.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email..."
                className="flex-1 min-w-0 px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] text-[#0F172A] dark:text-[#F8FAFC]"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center gap-1 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Join</span>
              </button>
            </form>

            <div className="pt-2 space-y-1.5">
              <div className="text-[11px] font-medium text-[#475569] dark:text-[#94A3B8]">
                Supported Bangladesh Mobile Banking:
              </div>
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono font-semibold">
                <span className="text-[#E2136E]">bKash</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-[#F7941D]">Nagad</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-[#8C3494]">Rocket</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-[#006A4E]">Upay</span>
                <span className="text-[#94A3B8]">·</span>
                <span className="text-[#2563EB] dark:text-[#60A5FA]">UniPin BD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Security Note */}
        <div className="mt-10 pt-6 border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#475569] dark:text-[#94A3B8]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>
              © {new Date().getFullYear()} {siteSettings.siteName}. All rights reserved. Zero Game Password Required.
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <a
              href={sanitizeSafeUrl(siteSettings.facebookUrl) || PUBLIC_ENV.FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
            >
              Facebook Community
            </a>
            <a
              href={sanitizeSafeUrl(siteSettings.telegramUrl) || PUBLIC_ENV.TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#2563EB] dark:hover:text-[#60A5FA] transition-colors"
            >
              Telegram Channel
            </a>
            <a
              href={sanitizeSafeUrl(siteSettings.whatsappUrl) || PUBLIC_ENV.WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#10B981] transition-colors"
            >
              WhatsApp Desk
            </a>
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 hover:text-[#2563EB] dark:hover:text-[#60A5FA] font-medium transition-colors"
            >
              <Lock className="w-3 h-3" />
              <span>Admin Console</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
