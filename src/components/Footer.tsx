import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Send, Flame, Lock } from 'lucide-react';
import { PUBLIC_ENV } from '../config/env';
import { useApp } from '../context/AppContext';
import { sanitizeSafeUrl } from '../utils/security';

export const Footer: React.FC = () => {
  const { siteSettings, language, setLanguage } = useApp();

  return (
    <footer className="bg-[#230505] text-white border-t border-[#3D1414] mt-12 pt-10 pb-14 px-4">
      <div className="max-w-3xl mx-auto flex flex-col items-center text-center space-y-6">
        {/* 1. Stacked Telegram Support & Channel Cards (Matches 00:44 - 00:46 in Recording) */}
        <div className="w-full max-w-xs space-y-3">
          <a
            href={sanitizeSafeUrl(siteSettings.telegramUrl) || PUBLIC_ENV.TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-2xl bg-[#15192B] hover:bg-[#1B2038] border border-[#262F52] px-4 py-3.5 flex items-center gap-3.5 text-left transition-colors shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/40 text-[#38BDF8] flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                24/7 SUPPORT
              </div>
              <div className="font-display font-bold text-sm text-white">
                Telegram Support
              </div>
            </div>
          </a>

          <a
            href={sanitizeSafeUrl(siteSettings.telegramUrl) || PUBLIC_ENV.TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full rounded-2xl bg-[#15192B] hover:bg-[#1B2038] border border-[#262F52] px-4 py-3.5 flex items-center gap-3.5 text-left transition-colors shadow-md"
          >
            <div className="w-10 h-10 rounded-full bg-[#0284C7]/20 border border-[#38BDF8]/40 text-[#38BDF8] flex items-center justify-center shrink-0">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#38BDF8]">
                TELEGRAM CHANNEL
              </div>
              <div className="font-display font-bold text-sm text-white">
                Join Now
              </div>
            </div>
          </a>
        </div>

        {/* 2. Centered H41FFTOPUP Metallic Flame Logo */}
        <Link to="/" className="inline-flex items-center gap-2 pt-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-b from-[#FF7A00] to-[#D91B00] p-[1.5px]">
            <div className="w-full h-full rounded-[6px] bg-[#1E0404] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#FF5500] fill-[#FF5500]" />
            </div>
          </div>
          <span className="font-display font-black text-2xl tracking-tight">
            <span className="bg-gradient-to-b from-[#FFB800] via-[#FF5500] to-[#D91B00] bg-clip-text text-transparent">
              H41
            </span>{' '}
            <span className="bg-gradient-to-b from-[#FF6B00] to-[#C81E00] bg-clip-text text-transparent">
              FF TOPUP
            </span>
          </span>
        </Link>

        {/* 3. Centered Bangla/English Support Paragraph (Matches 00:46 in Recording) */}
        <p className="text-xs sm:text-sm text-gray-200 leading-relaxed max-w-xl font-medium">
          H41FFTOPUP-এর সাথে আপনার গেমিং জার্নি হোক ঝামেলাহীন ও নিরাপদ! TopUp Failed বা যেকোনো ইস্যুতে আমরা ২৪/৭ ইনস্ট্যান্ট সলিউশন নিশ্চিত করে থাকি। যেকোনো প্রশ্ন, ওয়েবসাইট ফিচার বা অর্ডার আপডেটের জন্য নিচে থাকা সাপোর্ট আইকনে ক্লিক করুন, আমাদের টিম দ্রুততম অফিসিয়াল টেলিগ্রাম চ্যানেলে জয়েন হয়ে প্রাইওরিটি কাস্টমার কেয়ার সার্ভিস গ্রহণ করুন।
        </p>

        {/* 4. Language Switch Button (Matches 00:46 & 01:23 in Recording) */}
        <button
          type="button"
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="px-5 py-2.5 rounded-xl bg-[#381212] hover:bg-[#4B1818] border border-[#5C2424] text-white text-xs font-bold inline-flex items-center gap-2 transition-colors"
        >
          <Globe className="w-4 h-4 text-[#38BDF8]" />
          <span>
            {language === 'bn'
              ? 'বাংলা — ভাষা পরিবর্তন'
              : 'English — Change Language'}
          </span>
        </button>

        {/* 5. Legal Policy Links Row (Privacy Policy · Terms & Conditions · Refund Policy) */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-bold text-white pt-1">
          <Link to="/privacy" className="hover:text-[#FF7A00] transition-colors">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-[#FF7A00] transition-colors">
            Terms & Conditions
          </Link>
          <Link to="/faq" className="hover:text-[#FF7A00] transition-colors">
            Refund Policy
          </Link>
        </div>

        {/* Secondary Client Feature Links Row so all 22 routes are reachable from Footer */}
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-gray-400 max-w-xl">
          <Link to="/topup" className="hover:text-white">UID TopUp</Link>
          <span>·</span>
          <Link to="/offers" className="hover:text-white">Weekly & Monthly</Link>
          <span>·</span>
          <Link to="/deposit" className="hover:text-white">Add Money</Link>
          <span>·</span>
          <Link to="/withdraw" className="hover:text-white">Withdraw</Link>
          <span>·</span>
          <Link to="/wallet" className="hover:text-white">Wallet</Link>
          <span>·</span>
          <Link to="/transactions" className="hover:text-white">My Orders</Link>
          <span>·</span>
          <Link to="/tournaments" className="hover:text-white">Tournaments</Link>
          <span>·</span>
          <Link to="/income" className="hover:text-white">Free Income</Link>
          <span>·</span>
          <Link to="/leaderboard" className="hover:text-white">Leaderboard</Link>
          <span>·</span>
          <Link to="/reviews" className="hover:text-white">Reviews</Link>
          <span>·</span>
          <Link to="/blog" className="hover:text-white">Blog</Link>
          <span>·</span>
          <Link to="/contact" className="hover:text-white">Contact</Link>
          <span>·</span>
          <Link to="/about" className="hover:text-white">About</Link>
          <span>·</span>
          <Link to="/admin" className="inline-flex items-center gap-1 text-[#FBBF24] hover:underline">
            <Lock className="w-3 h-3" />
            <span>Admin</span>
          </Link>
        </div>

        {/* 6. White Bangladeshi Mobile Wallet Strip */}
        <div className="w-full max-w-md rounded-md bg-white px-4 py-2 flex flex-wrap items-center justify-center gap-x-3.5 gap-y-1 text-[11px] sm:text-xs font-extrabold shadow-xs">
          <span className="text-gray-500 font-semibold">Pay With</span>
          <span className="text-[#E2136E]">bKash</span>
          <span className="text-[#F7941D]">Nagad</span>
          <span className="text-[#8C3494]">Rocket</span>
          <span className="text-[#006A4E]">Upay</span>
        </div>

        {/* 8. Bottom Divider & Copyright */}
        <div className="w-full pt-4 border-t border-white/10 space-y-1 text-xs text-gray-300">
          <div className="font-semibold">
            © H41FFTOPUP {new Date().getFullYear()} | All Rights Reserved
          </div>
          <div className="text-[11px] font-mono tracking-wider uppercase text-gray-400">
            DEVELOPED BY <span className="text-[#FF5500] font-bold">H41FFTOPUP</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
