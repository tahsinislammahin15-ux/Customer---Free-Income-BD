import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Wallet,
  Menu,
  X,
  LogOut,
  UserCheck,
  ShieldCheck,
  Globe,
  Trophy,
  Home,
  Flame,
  PlusCircle,
  ClipboardList,
  Coins,
  HelpCircle,
  BookOpen,
  Star,
  Phone,
  Info,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

export const Navbar: React.FC = () => {
  const {
    language,
    setLanguage,
    currentUser,
    adminSession,
    logout,
    cart,
    setIsCartOpen,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [pendingLang, setPendingLang] = useState<Language>(language);

  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    setPendingLang(language);
  }, [language]);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWalletBdt = currentUser
    ? currentUser.mainBalance + currentUser.incomeBalance + currentUser.bonusBalance
    : 0;

  const navDrawerLinks = [
    { path: '/', label: language === 'bn' ? 'হোম পেজ' : 'Home Store', icon: <Home className="w-4 h-4 text-[#FF5500]" />, end: true },
    { path: '/topup', label: language === 'bn' ? 'ডায়মন্ড টপ-আপ' : 'UID & Pin TopUp', icon: <Flame className="w-4 h-4 text-[#FF5500]" /> },
    { path: '/offers', label: language === 'bn' ? 'উইকলি ও মান্থলি' : 'Weekly & Monthly', icon: <Sparkles className="w-4 h-4 text-[#F59E0B]" /> },
    { path: '/deposit', label: language === 'bn' ? 'অ্যাড মানি (ডিপোজিট)' : 'Add Money (BDT)', icon: <PlusCircle className="w-4 h-4 text-[#00C853]" /> },
    { path: '/withdraw', label: language === 'bn' ? 'টাকা উত্তোলন (উইথড্র)' : 'Withdraw BDT', icon: <Wallet className="w-4 h-4 text-[#FF5500]" /> },
    { path: '/wallet', label: language === 'bn' ? 'মাই ওয়ালেট' : 'My Wallet', icon: <Wallet className="w-4 h-4 text-[#00C853]" /> },
    { path: '/transactions', label: language === 'bn' ? 'অর্ডার ও লেনদেন' : 'Order History', icon: <ClipboardList className="w-4 h-4 text-[#2563EB]" /> },
    { path: '/tournaments', label: language === 'bn' ? 'কাস্টম রুম টুর্নামেন্ট' : 'FF Custom Rooms', icon: <Trophy className="w-4 h-4 text-[#F59E0B]" /> },
    { path: '/income', label: language === 'bn' ? 'ফ্রি ডায়মন্ড টাস্ক' : 'Free Income Tasks', icon: <Coins className="w-4 h-4 text-[#00C853]" /> },
    { path: '/leaderboard', label: language === 'bn' ? 'টপ ১০০ লিডারবোর্ড' : 'Top 100 Leaderboard', icon: <Trophy className="w-4 h-4 text-[#F59E0B]" /> },
    { path: '/reviews', label: language === 'bn' ? 'কাস্টমার রিভিউ' : 'Customer Reviews', icon: <Star className="w-4 h-4 text-[#F59E0B]" /> },
    { path: '/blog', label: language === 'bn' ? 'ব্লগ ও গাইড' : 'News & Guides', icon: <BookOpen className="w-4 h-4 text-[#2563EB]" /> },
    { path: '/faq', label: language === 'bn' ? 'প্রশ্নোত্তর (FAQ)' : 'Help & FAQ', icon: <HelpCircle className="w-4 h-4 text-[#FF5500]" /> },
    { path: '/contact', label: language === 'bn' ? 'হেল্পলাইন' : 'Support Desk', icon: <Phone className="w-4 h-4 text-[#00C853]" /> },
    { path: '/about', label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', icon: <Info className="w-4 h-4 text-[#2563EB]" /> },
  ];

  const handleConfirmLanguage = () => {
    setLanguage(pendingLang);
    setLangModalOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full">

        {/* Main Deep Maroon Storefront Navbar (Matches 00:26 - 03:50 in Reference Recording) */}
        <div className="bg-[#280606] text-white border-b border-[#3D1414] shadow-md">
          <div className="max-w-5xl mx-auto px-3 sm:px-5 h-14 sm:h-16 flex items-center justify-between gap-2">
            {/* Left: Flame Emblem + Metallic Orange-Red Brand Wordmark */}
            <Link
              to="/"
              className="flex items-center gap-2 shrink-0 group"
              aria-label="H41FFTOPUP Home"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-b from-[#FF7A00] to-[#D91B00] p-[1.5px] shadow-sm">
                <div className="w-full h-full rounded-[6px] bg-[#1E0404] flex items-center justify-center">
                  <Flame className="w-4 h-4 sm:w-5 sm:h-5 text-[#FF5500] fill-[#FF5500]" />
                </div>
              </div>
              <div className="font-display font-black text-base sm:text-xl tracking-tight leading-none flex items-center gap-1 whitespace-nowrap">
                <span className="bg-gradient-to-b from-[#FFB800] via-[#FF5500] to-[#D91B00] bg-clip-text text-transparent drop-shadow-xs">
                  H41
                </span>
                <span className="bg-gradient-to-b from-[#FF6B00] to-[#C81E00] bg-clip-text text-transparent">
                  FF TOPUP
                </span>
              </div>
            </Link>

            {/* Center: Desktop Quick Links */}
            <nav
              aria-label="Primary Navigation"
              className="hidden lg:flex items-center gap-4 text-xs font-bold text-gray-200"
            >
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `hover:text-[#FF7A00] transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#FF7A00]' : ''
                  }`
                }
              >
                {language === 'bn' ? 'হোম' : 'Home'}
              </NavLink>
              <NavLink
                to="/topup"
                className={({ isActive }) =>
                  `hover:text-[#FF7A00] transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#FF7A00]' : ''
                  }`
                }
              >
                {language === 'bn' ? 'টপ-আপ' : 'TopUp'}
              </NavLink>
              <NavLink
                to="/deposit"
                className={({ isActive }) =>
                  `hover:text-[#FF7A00] transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#FF7A00]' : ''
                  }`
                }
              >
                {language === 'bn' ? 'অ্যাড মানি' : 'Add Money'}
              </NavLink>
              <NavLink
                to="/tournaments"
                className={({ isActive }) =>
                  `hover:text-[#FF7A00] transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#FF7A00]' : ''
                  }`
                }
              >
                {language === 'bn' ? 'টুর্নামেন্ট' : 'Tournaments'}
              </NavLink>
              <NavLink
                to="/income"
                className={({ isActive }) =>
                  `hover:text-[#FF7A00] transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#FF7A00]' : ''
                  }`
                }
              >
                {language === 'bn' ? 'ফ্রি ইনকাম' : 'Free Income'}
              </NavLink>
              <NavLink
                to="/leaderboard"
                className={({ isActive }) =>
                  `hover:text-[#FF7A00] transition-colors whitespace-nowrap ${
                    isActive ? 'text-[#FF7A00]' : ''
                  }`
                }
              >
                {language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard'}
              </NavLink>
              {(currentUser?.role === 'admin' || adminSession.authenticated) && (
                <NavLink
                  to="/admin"
                  className="text-[#FBBF24] hover:underline whitespace-nowrap flex items-center gap-1"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </NavLink>
              )}
            </nav>

            {/* Right: Language Pill + Register + Login (Exact Match to 00:26 & 01:03 in Recording) */}
            <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
              {/* Language Selector Pill (Opens Reference Modal) */}
              <button
                type="button"
                onClick={() => {
                  setPendingLang(language);
                  setLangModalOpen(true);
                }}
                aria-label="Select Language"
                className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-full bg-[#3D1414] hover:bg-[#4E1A1A] border border-[#5C2222] text-white text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0"
              >
                <span className="w-4 h-4 rounded-full bg-[#3B82F6] text-white flex items-center justify-center">
                  <Globe className="w-3 h-3" />
                </span>
                <span>{language === 'bn' ? 'BN' : 'EN'}</span>
              </button>

              {/* Cart Button (if items exist or on desktop) */}
              {cartItemCount > 0 && (
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Open Cart"
                  className="relative h-8 sm:h-9 px-2.5 rounded-lg bg-[#3D1414] border border-[#5C2222] text-white flex items-center justify-center"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span className="ml-1 text-[11px] font-mono font-bold text-[#FF7A00]">
                    {cartItemCount}
                  </span>
                </button>
              )}

              {/* Auth Buttons: Register (Maroon) + Login (Solid White) OR Wallet + Profile */}
              {currentUser ? (
                <>
                  <Link
                    to="/deposit"
                    className="h-8 sm:h-9 px-2.5 sm:px-3 rounded-lg bg-[#3D1414] border border-[#5C2222] text-white text-xs font-mono font-bold flex items-center gap-1 whitespace-nowrap shrink-0"
                    title="Wallet Balance — Click to Add Money"
                  >
                    <Wallet className="w-3.5 h-3.5 text-[#00C853]" />
                    <span>৳{totalWalletBdt}</span>
                  </Link>
                  <Link
                    to="/account"
                    className="h-8 sm:h-9 px-3 rounded-lg bg-white text-[#1A0505] hover:bg-gray-100 text-xs font-bold flex items-center gap-1 whitespace-nowrap shrink-0 shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="max-w-[72px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg bg-[#3D1414] hover:bg-[#4E1A1A] border border-[#5C2222] text-white text-xs font-bold flex items-center justify-center whitespace-nowrap shrink-0 transition-colors"
                  >
                    {language === 'bn' ? 'রেজিস্টার' : 'Register'}
                  </Link>
                  <Link
                    to="/login"
                    className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-lg bg-white hover:bg-gray-100 text-[#1A0505] text-xs font-extrabold flex items-center justify-center whitespace-nowrap shrink-0 shadow-xs transition-colors"
                  >
                    {language === 'bn' ? 'লগইন' : 'Login'}
                  </Link>
                </>
              )}

              {/* All-Pages Menu Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Open Navigation Menu"
                className="h-8 w-8 sm:h-9 sm:w-9 rounded-lg bg-[#3D1414] hover:bg-[#4E1A1A] border border-[#5C2222] text-white flex items-center justify-center shrink-0"
              >
                {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* All-Pages Slide-Down Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="bg-white dark:bg-[#111827] text-[#111827] dark:text-white border-b border-gray-200 dark:border-gray-800 shadow-2xl px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="max-w-5xl mx-auto space-y-4">
              {currentUser && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-xs sm:text-sm">
                      {currentUser.name} ({currentUser.ffIgn})
                    </div>
                    <div className="text-[11px] font-mono text-gray-500">
                      UID: {currentUser.ffUid} · Main: ৳{currentUser.mainBalance} · Income: ৳{currentUser.incomeBalance}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      to="/deposit"
                      className="px-3 py-1.5 rounded-lg bg-[#3B0A0A] text-white text-xs font-bold"
                    >
                      + Add Money
                    </Link>
                    <button
                      type="button"
                      onClick={logout}
                      className="p-1.5 rounded-lg bg-red-50 text-red-600"
                      title="Logout"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                {navDrawerLinks.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.end}
                    className={({ isActive }) =>
                      `px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-colors ${
                        isActive
                          ? 'bg-[#FFF5F5] border-[#3B0A0A] text-[#3B0A0A]'
                          : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-200 hover:border-[#3B0A0A]'
                      }`
                    }
                  >
                    {item.icon}
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                ))}
                <NavLink
                  to="/admin"
                  className="px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 border bg-amber-50 border-amber-300 text-amber-900"
                >
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span className="truncate">Admin Panel</span>
                </NavLink>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* =====================================================================
          LANGUAGE SELECTION MODAL (EXACT MATCH TO 01:00 & 01:05 IN RECORDING)
         ===================================================================== */}
      {langModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setLangModalOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-white text-[#111827] p-6 shadow-2xl space-y-5 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1">
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#111827]">
                {pendingLang === 'bn' ? 'আপনার ভাষা নির্বাচন করুন' : 'Choose your language'}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500">
                {pendingLang === 'bn'
                  ? 'চালিয়ে যেতে আপনার পছন্দের ভাষা নির্বাচন করুন'
                  : 'Select your preferred language to continue'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPendingLang('en')}
                className={`h-14 rounded-2xl font-display font-bold text-sm transition-all border ${
                  pendingLang === 'en'
                    ? 'bg-[#F5EBEB] border-[#3B0A0A] text-[#3B0A0A] shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setPendingLang('bn')}
                className={`h-14 rounded-2xl font-display font-bold text-sm transition-all border ${
                  pendingLang === 'bn'
                    ? 'bg-[#F5EBEB] border-[#3B0A0A] text-[#3B0A0A] shadow-xs'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                বাংলা
              </button>
            </div>

            <button
              type="button"
              onClick={handleConfirmLanguage}
              className="w-full h-12 rounded-xl bg-[#3B0A0A] hover:bg-[#280606] text-white font-display font-bold text-sm transition-colors shadow-md"
            >
              {pendingLang === 'bn' ? 'চালিয়ে যান' : 'Continue'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
