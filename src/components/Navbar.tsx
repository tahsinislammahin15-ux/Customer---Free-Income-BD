import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  Wallet,
  Sun,
  Moon,
  Menu,
  X,
  LogOut,
  UserCheck,
  ShieldCheck,
  Globe,
  Sparkles,
  BookOpen,
  Star,
  HelpCircle,
  Trophy,
  Phone,
  Info,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const {
    theme,
    toggleTheme,
    language,
    setLanguage,
    currentUser,
    adminSession,
    logout,
    cart,
    setIsCartOpen,
    siteSettings,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const primaryLinks = [
    { path: '/', label: language === 'bn' ? 'হোম' : 'Home', end: true },
    { path: '/topup', label: language === 'bn' ? 'ডায়মন্ড টপ আপ' : 'Top Up' },
    { path: '/offers', label: language === 'bn' ? 'স্পেশাল অফার' : 'Special Offers' },
    { path: '/tournaments', label: language === 'bn' ? 'টুর্নামেন্ট' : 'Tournaments' },
    { path: '/income', label: language === 'bn' ? 'ফ্রি ইনকাম' : 'Free Income' },
    { path: '/blog', label: language === 'bn' ? 'ব্লগ ও গাইড' : 'Blog' },
    { path: '/reviews', label: language === 'bn' ? 'রিভিউ' : 'Reviews' },
    { path: '/faq', label: language === 'bn' ? 'প্রশ্নোত্তর' : 'FAQ' },
    { path: '/contact', label: language === 'bn' ? 'যোগাযোগ' : 'Contact' },
  ];

  const secondaryMobileLinks = [
    {
      path: '/leaderboard',
      label: language === 'bn' ? 'লিডারবোর্ড' : 'Leaderboard',
      icon: <Trophy className="w-3.5 h-3.5 text-[#F59E0B]" />,
    },
    {
      path: '/about',
      label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us',
      icon: <Info className="w-3.5 h-3.5 text-[#2563EB]" />,
    },
    {
      path: '/wallet',
      label: language === 'bn' ? 'ওয়ালেট' : 'Fintech Wallet',
      icon: <Wallet className="w-3.5 h-3.5 text-[#10B981]" />,
    },
    {
      path: '/deposit',
      label: language === 'bn' ? 'ডিপোজিট' : 'Deposit BDT',
      icon: <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />,
    },
    {
      path: '/withdraw',
      label: language === 'bn' ? 'উইথড্র' : 'Withdraw BDT',
      icon: <BookOpen className="w-3.5 h-3.5 text-[#10B981]" />,
    },
    {
      path: '/transactions',
      label: language === 'bn' ? 'লেনদেন ইতিহাস' : 'Ledger History',
      icon: <Star className="w-3.5 h-3.5 text-[#F59E0B]" />,
    },
    {
      path: '/privacy',
      label: language === 'bn' ? 'প্রাইভেসি পলিসি' : 'Privacy Policy',
      icon: <HelpCircle className="w-3.5 h-3.5 text-[#2563EB]" />,
    },
    {
      path: '/terms',
      label: language === 'bn' ? 'শর্তাবলী' : 'Terms & Rules',
      icon: <Phone className="w-3.5 h-3.5 text-[#10B981]" />,
    },
  ];

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalWalletBdt = currentUser
    ? currentUser.mainBalance + currentUser.incomeBalance + currentUser.bonusBalance
    : 0;

  return (
    <header className="sticky top-0 z-40 w-full">
      {/* Announcement Bar */}
      {siteSettings.announcementText && (
        <div className="bg-gradient-to-r from-[#1E3A8A] via-[#2563EB] to-[#0D9488] text-white text-xs py-2 px-4 text-center font-medium border-b border-white/15">
          <div className="max-w-[1440px] mx-auto flex items-center justify-center gap-2">
            <span className="font-mono font-bold text-[#FDE047] shrink-0 tracking-wider">
              [BD LIVE]
            </span>
            <span className="line-clamp-1 sm:line-clamp-none">
              {language === 'bn'
                ? siteSettings.announcementTextBn
                : siteSettings.announcementText}
            </span>
          </div>
        </div>
      )}

      {/* Main Glassmorphic Header */}
      <div className="bg-white/92 dark:bg-[#060A12]/90 backdrop-blur-xl border-b border-[#E2E8F0] dark:border-[#1E2D4A]">
        <div className="max-w-[1440px] mx-auto px-3.5 sm:px-6 lg:px-8 h-16 sm:h-[4.25rem] flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-left group shrink-0"
          >
            {siteSettings.logoUrl ? (
              <img
                src={siteSettings.logoUrl}
                alt={siteSettings.siteName}
                loading="lazy"
                referrerPolicy="no-referrer"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E2D4A]"
              />
            ) : (
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl btn-primary flex items-center justify-center text-white font-display font-extrabold text-xs sm:text-sm tracking-tight">
                FIBD
              </div>
            )}
            <div>
              <div className="font-display font-bold text-sm sm:text-base tracking-tight text-[#0F172A] dark:text-[#F8FAFC] leading-none flex items-center gap-1.5">
                <span>{siteSettings.siteName}</span>
              </div>
              <div className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] mt-1 leading-none hidden xs:block">
                Top Up · Esports · Rewards
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links with Active Route State */}
          <nav
            aria-label="Primary Navigation"
            className="hidden xl:flex items-center gap-1"
          >
            {primaryLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                end={link.end}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'btn-primary text-white'
                      : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#111C33]'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}

            {(currentUser?.role === 'admin' || adminSession.authenticated) && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `ml-1 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#F59E0B] text-[#060A12] shadow-xs'
                      : 'text-[#F59E0B] hover:bg-[#F59E0B]/10'
                  }`
                }
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </NavLink>
            )}
          </nav>

          {/* Right Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Wallet Quick Readout */}
            {currentUser && (
              <NavLink
                to="/wallet"
                className={({ isActive }) =>
                  `hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all ${
                    isActive
                      ? 'bg-[#EFF6FF] dark:bg-[#111C33] border-[#2563EB]'
                      : 'bg-[#F8FAFC] dark:bg-[#0D1526] border-[#E2E8F0] dark:border-[#1E2D4A] hover:border-[#2563EB]'
                  }`
                }
              >
                <Wallet className="w-4 h-4 text-[#10B981]" />
                <div className="text-left leading-tight">
                  <div className="text-[10px] font-medium text-[#475569] dark:text-[#94A3B8]">
                    {language === 'bn' ? 'ওয়ালেট' : 'Wallet'}
                  </div>
                  <div className="text-xs font-mono font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    ৳{totalWalletBdt}
                  </div>
                </div>
              </NavLink>
            )}

            {/* Cart Drawer Trigger */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              aria-label="Open Top Up Cart"
              className="relative min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#2563EB] transition-colors flex items-center justify-center"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-md bg-[#2563EB] text-white text-[11px] font-mono font-bold flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Language Switcher (EN / বাংলা) */}
            <button
              type="button"
              onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
              aria-label="Toggle Language"
              className="min-h-[40px] px-2.5 py-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] text-xs font-mono font-semibold text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#2563EB] transition-colors flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-[#2563EB] dark:text-[#60A5FA]" />
              <span>{language === 'en' ? 'বাংলা' : 'EN'}</span>
            </button>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle Dark or Light Mode"
              className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] text-[#0F172A] dark:text-[#F8FAFC] hover:border-[#2563EB] transition-colors flex items-center justify-center"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-[#F59E0B]" />
              ) : (
                <Moon className="w-4 h-4 text-[#475569]" />
              )}
            </button>

            {/* Auth / Account Button */}
            {currentUser ? (
              <div className="hidden md:flex items-center gap-1.5">
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                      isActive
                        ? 'bg-[#1D4ED8] text-white ring-2 ring-[#60A5FA]/40'
                        : 'btn-primary text-white'
                    }`
                  }
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span className="max-w-[96px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                </NavLink>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  aria-label="Sign out"
                  className="min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] text-[#475569] dark:text-[#94A3B8] hover:text-[#EF4444] transition-colors flex items-center justify-center"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5">
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    `min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold transition-colors flex items-center ${
                      isActive
                        ? 'text-[#2563EB] dark:text-[#60A5FA] bg-[#EFF6FF] dark:bg-[#111C33]'
                        : 'text-[#0F172A] dark:text-[#F8FAFC] hover:text-[#2563EB]'
                    }`
                  }
                >
                  {language === 'bn' ? 'লগইন' : 'Login'}
                </NavLink>
                <NavLink
                  to="/register"
                  className="min-h-[40px] px-3.5 py-2 rounded-xl btn-primary text-xs font-semibold flex items-center"
                >
                  {language === 'bn' ? 'রেজিস্টার' : 'Register'}
                </NavLink>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Navigation"
              aria-expanded={mobileMenuOpen}
              className="xl:hidden min-h-[40px] min-w-[40px] p-2 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] text-[#0F172A] dark:text-[#F8FAFC] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white dark:bg-[#0A1120] border-b border-[#E2E8F0] dark:border-[#1E2D4A] px-4 py-4 space-y-4 shadow-2xl max-h-[calc(100vh-4.5rem)] overflow-y-auto">
          {currentUser && (
            <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A]">
              <div>
                <div className="text-xs font-semibold text-[#0F172A] dark:text-[#F8FAFC]">
                  {currentUser.name} ({currentUser.ffIgn})
                </div>
                <div className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                  UID: {currentUser.ffUid}
                </div>
              </div>
              <Link
                to="/wallet"
                className="text-right"
              >
                <div className="text-[11px] text-[#475569] dark:text-[#94A3B8]">Total Wallet</div>
                <div className="text-sm font-mono font-bold text-[#10B981]">
                  ৳{totalWalletBdt} BDT
                </div>
              </Link>
            </div>
          )}

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-2">
              Primary Pages
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {primaryLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  end={link.end}
                  className={({ isActive }) =>
                    `min-h-[42px] px-3 py-2.5 rounded-xl text-xs font-semibold text-left transition-all flex items-center ${
                      isActive
                        ? 'btn-primary text-white'
                        : 'bg-[#F8FAFC] dark:bg-[#0D1526] text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E2D4A]'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-mono uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] mb-2">
              Wallet, Community & Legal Pages
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {secondaryMobileLinks.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                      isActive
                        ? 'bg-[#EFF6FF] dark:bg-[#111C33] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]'
                        : 'bg-[#F8FAFC] dark:bg-[#0D1526] text-[#475569] dark:text-[#94A3B8] border border-[#E2E8F0] dark:border-[#1E2D4A]'
                    }`
                  }
                >
                  {item.icon}
                  <span className="truncate">{item.label}</span>
                </NavLink>
              ))}

              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `min-h-[40px] px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-[#F59E0B] text-[#060A12]'
                      : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
                  }`
                }
              >
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {currentUser?.role === 'admin' || adminSession.authenticated
                    ? 'Admin Panel'
                    : 'Admin Login'}
                </span>
              </NavLink>
            </div>
          </div>

          <div className="pt-3 border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center justify-between gap-2">
            {currentUser ? (
              <>
                <Link
                  to="/account"
                  className="flex-1 min-h-[42px] py-2.5 px-3 rounded-xl btn-primary text-xs font-semibold text-center flex items-center justify-center"
                >
                  My Account Dashboard
                </Link>
                <Link
                  to="/profile"
                  className="min-h-[42px] py-2.5 px-3 rounded-xl btn-secondary text-xs font-semibold flex items-center justify-center"
                >
                  Edit Profile
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="min-h-[42px] py-2.5 px-3 rounded-xl bg-[#EF4444]/10 text-[#EF4444] text-xs font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex-1 min-h-[42px] py-2.5 rounded-xl btn-secondary text-xs font-semibold text-center flex items-center justify-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="flex-1 min-h-[42px] py-2.5 rounded-xl btn-primary text-xs font-semibold text-center flex items-center justify-center"
                >
                  Create Account
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
