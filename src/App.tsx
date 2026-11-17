import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
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

const AuthLoadingFallback: React.FC = () => (
  <div className="max-w-md mx-auto py-20 px-4 text-center space-y-3">
    <div className="w-9 h-9 rounded-full border-3 border-[#3B0A0A] dark:border-[#FF5500] border-t-transparent animate-spin mx-auto" />
    <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
      Verifying session...
    </p>
  </div>
);

const RequireAuth: React.FC<{ children: React.ReactElement }> = ({ children }) => {
  const { authReady, currentUser, pendingGoogleRegistration } = useApp();
  const location = useLocation();

  if (!authReady) {
    return <AuthLoadingFallback />;
  }
  if (pendingGoogleRegistration) {
    return <Navigate to="/register" replace />;
  }
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  return children;
};

const AppRoutesShell: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] dark:bg-[#0B0F17] text-[#111827] dark:text-[#F9FAFB] transition-colors duration-200">
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
          <Route
            path="/account"
            element={
              <RequireAuth>
                <MyAccountPage />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <UserProfilePage />
              </RequireAuth>
            }
          />
          <Route
            path="/wallet"
            element={
              <RequireAuth>
                <WalletPage />
              </RequireAuth>
            }
          />
          <Route
            path="/deposit"
            element={
              <RequireAuth>
                <DepositPage />
              </RequireAuth>
            }
          />
          <Route
            path="/withdraw"
            element={
              <RequireAuth>
                <WithdrawPage />
              </RequireAuth>
            }
          />
          <Route
            path="/transactions"
            element={
              <RequireAuth>
                <TransactionsPage />
              </RequireAuth>
            }
          />
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
