import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] transition-colors">
      <Navbar />
      <PageSeoAndBreadcrumbs />
      <ToastContainer />
      <CartDrawer />
      <main key={location.pathname} className="flex-1 page-enter">
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
