import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { Gem, Trophy, Coins, Wallet, Sparkles } from 'lucide-react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';
import { SupportChatWidget } from './components/SupportChatWidget';
import { PageSeoAndBreadcrumbs } from './components/PageSeoAndBreadcrumbs';
import { HomePage } from './pages/HomePage';
import { TopUpPage } from './pages/TopUpPage';
import { TournamentsPage } from './pages/TournamentsPage';
import { FreeIncomePage } from './pages/FreeIncomePage';
import {
  MyAccountPage,
  UserProfilePage,
  WalletPage,
  DepositPage,
  WithdrawPage,
  TransactionsPage,
} from './pages/AccountAndWalletPages';
import {
  AboutPage,
  LeaderboardPage,
  ContactPage,
  FaqPage,
  LoginPage,
  RegisterPage,
  PrivacyPage,
  TermsPage,
} from './pages/PublicAndAuthPages';
import {
  SpecialOffersPage,
  BlogAndNewsPage,
  PlayerReviewsPage,
  NotFoundPage,
} from './pages/DedicatedSectionPages';
import { AdminPanelPage } from './pages/AdminPanelPage';

const AppRoutesShell: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      document
        .querySelectorAll('.reveal-on-scroll')
        .forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -32px 0px' }
    );

    const timer = window.setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => observer.observe(el));
    }, 35);

    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, [location.pathname]);

  const mobileTabs = [
    { path: '/topup', label: 'Top Up', icon: <Gem className="w-4 h-4" /> },
    { path: '/offers', label: 'Offers', icon: <Sparkles className="w-4 h-4" /> },
    { path: '/tournaments', label: 'Esports', icon: <Trophy className="w-4 h-4" /> },
    { path: '/income', label: 'Income', icon: <Coins className="w-4 h-4" /> },
    { path: '/wallet', label: 'Wallet', icon: <Wallet className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#060A12] text-[#0F172A] dark:text-[#F8FAFC] transition-colors">
      <Navbar />
      <PageSeoAndBreadcrumbs />
      <ToastContainer />
      <CartDrawer />
      <main key={location.pathname} className="flex-1 pb-20 lg:pb-0 page-enter">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/topup" element={<TopUpPage />} />
          <Route path="/offers" element={<SpecialOffersPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/income" element={<FreeIncomePage />} />
          <Route path="/blog" element={<BlogAndNewsPage />} />
          <Route path="/reviews" element={<PlayerReviewsPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/account" element={<MyAccountPage />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/deposit" element={<DepositPage />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/admin" element={<AdminPanelPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <SupportChatWidget />
      <Footer />

      {/* Mobile Sticky Bottom Quick-Action Dock */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 dark:bg-[#09101F]/95 backdrop-blur-xl border-t border-[#E2E8F0] dark:border-[#1E2D4A] px-2 py-1.5 grid grid-cols-5 gap-1 shadow-[0_-8px_24px_rgba(0,0,0,0.08)]">
        {mobileTabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `min-h-[46px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[11px] font-semibold transition-all ${
                isActive
                  ? 'bg-[#2563EB] text-white shadow-sm'
                  : 'text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white'
              }`
            }
          >
            {tab.icon}
            <span className="leading-none">{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

export function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <AppProvider>
        <AppRoutesShell />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;

