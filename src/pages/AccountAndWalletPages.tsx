import React, { useState } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  RefreshCw,
  Bell,
  LifeBuoy,
  UserCheck,
  KeyRound,
  Copy,
  CheckCircle2,
  ShieldCheck,
  Filter,
  Lock,
  Upload,
  AlertTriangle,
  Clock,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentGatewayName, SupportTicket, WalletStatus } from '../types';

/* ============================================================================
   REFERENCE-STYLE STATUS BADGE (#00C853 COMPLETE / AMBER PENDING / RED REJECTED)
   ============================================================================ */
export const WalletStatusBadge: React.FC<{ status: WalletStatus | string }> = ({ status }) => {
  const normalized = status as WalletStatus;
  const styles: Record<string, string> = {
    Pending: 'bg-[#FEF3C7] text-[#B45309] border border-[#FDE68A]',
    Approved: 'bg-[#DBEAFE] text-[#1D4ED8] border border-[#BFDBFE]',
    Completed: 'bg-[#00C853] text-white border border-[#00C853]',
    Rejected: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]',
    Failed: 'bg-[#FEE2E2] text-[#B91C1C] border border-[#FECACA]',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide ${
        styles[normalized] || styles.Pending
      }`}
    >
      <span>{status === 'Completed' ? 'COMPLETE' : status}</span>
    </span>
  );
};

/* ============================================================================
   1. MY ACCOUNT (UNIFIED PLAYER DASHBOARD — /account)
   ============================================================================ */
export const MyAccountPage: React.FC = () => {
  const {
    currentUser,
    navigate,
    orders,
    tournaments,
    taskSubmissions,
    supportTickets,
    submitSupportTicket,
    addToast,
    logout,
  } = useApp();

  const [ticketCategory, setTicketCategory] =
    useState<SupportTicket['category']>('Top Up Issue');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-[440px] mx-auto px-3.5 py-12">
        <div className="zvy-card p-6 text-center space-y-4">
          <h1 className="text-xl font-bold text-[#111827] dark:text-[#F8FAFC]">
            Sign In to Access Your Account
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
            View your Free Fire Top Up orders, tournament Room IDs, and wallet balance.
          </p>
          <button
            type="button"
            onClick={() => navigate('login')}
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const myOrders = orders.filter((o) => o.userId === currentUser.id);
  const myTournaments = tournaments.filter((trn) =>
    trn.registeredPlayers.some((p) => p.userId === currentUser.id)
  );
  const mySubmissions = taskSubmissions.filter((s) => s.userId === currentUser.id);
  const myTickets = supportTickets.filter((tItem) => tItem.userId === currentUser.id);

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject.trim() || !ticketMessage.trim()) return;
    submitSupportTicket({
      category: ticketCategory,
      subject: ticketSubject.trim(),
      message: ticketMessage.trim(),
    });
    setTicketSubject('');
    setTicketMessage('');
  };

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      {/* Top Account Identity & Quick Actions Card */}
      <div className="zvy-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-[#3B0A0A] text-white font-extrabold text-lg flex items-center justify-center shrink-0 shadow-xs">
            {currentUser.name.slice(0, 1).toUpperCase()}
          </div>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                {currentUser.name}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold uppercase">
                {currentUser.ffUid ? `UID: ${currentUser.ffUid}` : 'UID Not Set'}
              </span>
            </div>
            <p className="text-xs text-[#6B7280] dark:text-[#94A3B8] font-mono">
              {currentUser.ffIgn ? `IGN: ${currentUser.ffIgn} · ` : ''}Ref: {currentUser.referralCode} · Refs: {currentUser.referralCount}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navigate('wallet')}
            className="h-[38px] px-3.5 rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            My Wallet
          </button>
          <button
            type="button"
            onClick={() => navigate('deposit')}
            className="h-[38px] px-3.5 rounded-xl bg-[#0D3B66] text-white text-xs font-semibold"
          >
            + Add Money
          </button>
          <button
            type="button"
            onClick={() => navigate('withdraw')}
            className="h-[38px] px-3.5 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold text-[#059669]"
          >
            Withdraw
          </button>
          <button
            type="button"
            onClick={() => navigate('profile')}
            className="h-[38px] px-3.5 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold text-[#111827] dark:text-white"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => void logout()}
            className="col-span-2 sm:col-span-1 h-[38px] px-3.5 rounded-xl bg-[#FEE2E2] dark:bg-red-950/60 text-[#B91C1C] dark:text-red-300 text-xs font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 3 Wallet Balances Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="zvy-card p-4 space-y-1">
          <div className="text-[11px] font-bold text-[#6B7280] uppercase">
            Main Wallet Balance
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">
            ৳{currentUser.mainBalance} BDT
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Instant Top-Up & Room Entry
          </div>
        </div>

        <div className="zvy-card p-4 space-y-1">
          <div className="text-[11px] font-bold text-[#6B7280] uppercase">
            Income Balance
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#059669]">
            ৳{currentUser.incomeBalance} BDT
          </div>
          <div className="text-[11px] text-[#6B7280]">
            Withdrawable via bKash / Nagad
          </div>
        </div>

        <div className="zvy-card p-4 space-y-1">
          <div className="text-[11px] font-bold text-[#6B7280] uppercase">
            Bonus Balance
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#D97706]">
            ৳{currentUser.bonusBalance} BDT
          </div>
          <div className="text-[11px] text-[#6B7280]">
            0%-Fee Transfer to Main Wallet
          </div>
        </div>
      </div>

      {/* Recent Top-Up Orders (Matching Latest Orders Card Style at 00:35) & Registered Tournaments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* My Diamond Orders */}
        <div className="zvy-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="step-badge">1</span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                MY TOP-UP ORDERS ({myOrders.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('topup')}
              className="text-xs font-bold text-[#3B0A0A] dark:text-[#FCA5A5] hover:underline"
            >
              + New Order
            </button>
          </div>

          <div className="space-y-2">
            {myOrders.slice(0, 5).map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-2 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="font-bold text-[#111827] dark:text-[#F8FAFC] truncate">
                    {ord.packageTitle}
                  </div>
                  <div className="text-[11px] font-mono text-[#6B7280]">
                    {ord.id} · UID: {ord.playerUid}
                  </div>
                  {ord.voucherPin && (
                    <div className="text-[11px] font-mono font-bold text-[#0D3B66] dark:text-[#60A5FA]">
                      PIN: {ord.voucherPin}
                    </div>
                  )}
                </div>
                <div className="text-right shrink-0 space-y-1">
                  <div className="font-mono font-extrabold text-[#111827] dark:text-white">
                    ৳{ord.amountBdt}
                  </div>
                  <WalletStatusBadge status={ord.status} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* My Registered Esports Tournaments */}
        <div className="zvy-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="step-badge">2</span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                MY TOURNAMENT ROOMS ({myTournaments.length})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('tournaments')}
              className="text-xs font-bold text-[#3B0A0A] dark:text-[#FCA5A5] hover:underline"
            >
              Join Match →
            </button>
          </div>

          {myTournaments.length === 0 ? (
            <p className="text-xs text-[#6B7280] py-4 text-center">
              You have not joined any tournament rooms yet.
            </p>
          ) : (
            <div className="space-y-2">
              {myTournaments.map((trn) => (
                <div
                  key={trn.id}
                  className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1.5 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                      {trn.title}
                    </span>
                    <span className="text-[11px] font-mono font-semibold text-[#3B0A0A] dark:text-[#FCA5A5]">
                      {trn.startTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-1 border-t border-[#E5E7EB] dark:border-[#1E293B] font-mono text-[11px]">
                    <span className="text-[#059669] font-bold">
                      Room ID: {trn.roomId || 'TBA'} · Pass: {trn.roomPassword || 'TBA'}
                    </span>
                    {trn.roomId && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(trn.roomId!);
                          addToast('Room ID Copied', `Room ID ${trn.roomId} copied.`, 'info');
                        }}
                        className="text-[#3B0A0A] dark:text-[#FCA5A5] font-bold inline-flex items-center gap-1 hover:underline"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Activity Feed & Support Ticket Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-5 zvy-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#3B0A0A] dark:text-[#FCA5A5]" />
            <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              ACCOUNT NOTIFICATIONS
            </h2>
          </div>
          <div className="space-y-2 text-xs">
            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B]">
              <div className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                {myTournaments.some((trn) => trn.roomId)
                  ? `Custom Room Unlocked: ${myTournaments.find((trn) => trn.roomId)?.id}`
                  : `Top-Up Activity (${myOrders.length} Orders)`}
              </div>
              <div className="text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
                {myTournaments.some((trn) => trn.roomId)
                  ? `Room ID ${myTournaments.find((trn) => trn.roomId)?.roomId} is available in My Tournament Rooms.`
                  : `${myOrders.filter((o) => o.status === 'Completed').length} completed · ${myOrders.filter((o) => o.status === 'Pending').length} pending orders.`}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B]">
              <div className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                Task Submissions ({mySubmissions.length})
              </div>
              <div className="text-[#6B7280] dark:text-[#94A3B8] mt-0.5">
                {mySubmissions.filter((s) => s.status === 'Pending').length} pending ·{' '}
                {mySubmissions.filter((s) => s.status === 'Approved').length} approved proofs.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 zvy-card p-4 sm:p-5 space-y-3">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-[#3B0A0A] dark:text-[#FCA5A5]" />
            <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              OPEN SUPPORT TICKET ({myTickets.length} ACTIVE)
            </h2>
          </div>
          <form onSubmit={handleTicketSubmit} className="space-y-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <select
                value={ticketCategory}
                onChange={(e) =>
                  setTicketCategory(e.target.value as SupportTicket['category'])
                }
                className="h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              >
                <option value="Top Up Issue">Top Up Issue</option>
                <option value="Tournament Room">Tournament Room</option>
                <option value="Task Verification">Task Verification</option>
                <option value="Deposit / Withdraw">Deposit / Withdraw</option>
              </select>
              <input
                type="text"
                required
                value={ticketSubject}
                onChange={(e) => setTicketSubject(e.target.value)}
                placeholder="Order ID or Match Reference"
                className="h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <textarea
              rows={2}
              required
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Write your issue details..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-5 h-[40px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-semibold transition-colors"
            >
              Submit Support Ticket
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   2. USER PROFILE PAGE (/profile)
   ============================================================================ */
export const UserProfilePage: React.FC = () => {
  const { currentUser, updateProfile, changePassword, navigate } = useApp();

  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [ffUid, setFfUid] = useState(currentUser?.ffUid || '');
  const [ffIgn, setFfIgn] = useState(currentUser?.ffIgn || '');
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-[440px] mx-auto px-3.5 py-12 text-center">
        <div className="zvy-card p-6 space-y-4">
          <button
            type="button"
            onClick={() => navigate('login')}
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            Login Required
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, phone, ffUid, ffIgn });
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await changePassword(currentPass, newPass);
    if (ok) {
      setCurrentPass('');
      setNewPass('');
    }
  };

  return (
    <div className="max-w-[820px] mx-auto px-3.5 sm:px-6 py-6 space-y-4">
      <div className="zvy-card p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
            Player Profile & Free Fire UID Settings
          </h1>
          <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
            Keep your Free Fire Player ID accurate for instant 1-click Top-Ups.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full bg-[#00C853] text-white text-[11px] font-extrabold inline-flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5" />
          <span>{currentUser.verified ? 'VERIFIED PLAYER' : 'ACTIVE'}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form onSubmit={handleSaveProfile} className="zvy-card p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="step-badge">1</span>
            <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              PERSONAL & GAME INFO
            </h2>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Name</label>
            <input
              type="text"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Phone number</label>
            <input
              type="tel"
              required
              maxLength={14}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Free Fire Player ID (UID)</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={12}
              value={ffUid}
              onChange={(e) => setFfUid(e.target.value.replace(/\D/g, ''))}
              placeholder="Optional 8-12 digit UID"
              className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">In-Game Name (IGN)</label>
            <input
              type="text"
              maxLength={40}
              value={ffIgn}
              onChange={(e) => setFfIgn(e.target.value)}
              placeholder="Optional In-Game Name"
              className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-semibold transition-colors"
          >
            Save Profile Changes
          </button>
        </form>

        <form
          onSubmit={handlePasswordChange}
          className="zvy-card p-5 space-y-3.5 flex flex-col justify-between"
        >
          <div className="space-y-3.5">
            <div className="flex items-center gap-2">
              <span className="step-badge">2</span>
              <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                CHANGE PASSWORD
              </h2>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">Current Password</label>
              <input
                type="password"
                required
                maxLength={128}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="password"
                className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                maxLength={128}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="new password"
                className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full h-[42px] rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-semibold transition-colors"
          >
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

/* ============================================================================
   3. WALLET PAGE (/wallet — DOUBLE-ENTRY BALANCES, PENDING LOCKS & LEDGER)
   ============================================================================ */
export const WalletPage: React.FC = () => {
  const {
    currentUser,
    transactions,
    deposits,
    withdrawals,
    lockedPendingByUser,
    transferBalanceToMain,
    cancelPendingWalletRequest,
    refreshWalletFromBackend,
    navigate,
  } = useApp();

  const [fromWallet, setFromWallet] = useState<'incomeBalance' | 'bonusBalance'>('incomeBalance');
  const [transferAmount, setTransferAmount] = useState<number>(50);
  const [ledgerTypeFilter, setLedgerTypeFilter] = useState<string>('All');
  const [ledgerStatusFilter, setLedgerStatusFilter] = useState<string>('All');
  const [ledgerSearch, setLedgerSearch] = useState<string>('');
  const [syncing, setSyncing] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-[440px] mx-auto px-3.5 py-12 text-center">
        <div className="zvy-card p-6 space-y-4">
          <h1 className="text-xl font-bold">Sign In to Access Your Wallet</h1>
          <p className="text-xs text-[#6B7280]">
            View your wallet balances, add money via bKash/Nagad, or withdraw earnings.
          </p>
          <button
            type="button"
            onClick={() => navigate('login')}
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            Login Now
          </button>
        </div>
      </div>
    );
  }

  const lockedPendingBdt = lockedPendingByUser[currentUser.id] || 0;
  const myDeposits = deposits.filter((d) => d.userId === currentUser.id);
  const myWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);
  const pendingDeposits = myDeposits.filter((d) => d.status === 'Pending');
  const pendingWithdrawals = myWithdrawals.filter((w) => w.status === 'Pending');

  const myTransactions = transactions.filter((trx) => {
    if (trx.userId !== currentUser.id) return false;
    if (ledgerTypeFilter !== 'All' && trx.type !== ledgerTypeFilter) return false;
    if (ledgerStatusFilter !== 'All' && trx.status !== ledgerStatusFilter) return false;
    if (ledgerSearch.trim()) {
      const q = ledgerSearch.toLowerCase();
      return (
        trx.id.toLowerCase().includes(q) ||
        trx.referenceId.toLowerCase().includes(q) ||
        trx.description.toLowerCase().includes(q) ||
        (trx.method || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    transferBalanceToMain(fromWallet, Number(transferAmount));
  };

  const handleSyncLedger = async () => {
    setSyncing(true);
    await refreshWalletFromBackend();
    setSyncing(false);
  };

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      {/* Header & Primary Add Money / Withdraw Buttons */}
      <div className="zvy-card p-4 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#3B0A0A] dark:text-[#FCA5A5]">
            <ShieldCheck className="w-4 h-4 text-[#00C853]" />
            <span>H41FFTOPUP WALLET · INSTANT TOP-UP & PAYOUT LEDGER</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
            My Wallet & Balance History
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleSyncLedger}
            className="h-[40px] px-3.5 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('deposit')}
            className="h-[40px] px-4 rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>+ Add Money (Deposit)</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('withdraw')}
            className="h-[40px] px-4 rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold inline-flex items-center gap-1.5"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw BDT</span>
          </button>
        </div>
      </div>

      {/* 4 Wallet Balance Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="zvy-card p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase">
              MAIN BALANCE
            </span>
            <Wallet className="w-4 h-4 text-[#3B0A0A] dark:text-[#FCA5A5]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">
            ৳{currentUser.mainBalance}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            For Diamond Top-Up & Rooms
          </p>
        </div>

        <div className="zvy-card p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase">
              INCOME BALANCE
            </span>
            <Wallet className="w-4 h-4 text-[#059669]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#059669]">
            ৳{currentUser.incomeBalance}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Tasks, Prizes & Referrals
          </p>
        </div>

        <div className="zvy-card p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase">
              BONUS BALANCE
            </span>
            <Wallet className="w-4 h-4 text-[#D97706]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#D97706]">
            ৳{currentUser.bonusBalance}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Convert 1:1 to Main Wallet
          </p>
        </div>

        <div className="zvy-card p-4 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold text-[#6B7280] uppercase">
              LOCKED PENDING
            </span>
            <Lock className="w-4 h-4 text-[#0D3B66]" />
          </div>
          <div className="text-2xl font-extrabold font-mono text-[#0D3B66] dark:text-[#60A5FA]">
            ৳{lockedPendingBdt}
          </div>
          <p className="text-[11px] text-[#6B7280]">
            Reserved for active payout
          </p>
        </div>
      </div>

      {/* Active Pending Requests */}
      {(pendingDeposits.length > 0 || pendingWithdrawals.length > 0) && (
        <div className="zvy-card p-4 sm:p-5 space-y-3 border-[#F59E0B]">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#D97706]" />
              <h2 className="text-sm font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                ACTIVE PENDING REQUESTS ({pendingDeposits.length + pendingWithdrawals.length})
              </h2>
            </div>
            <span className="text-[11px] text-[#6B7280]">
              Cancel anytime before admin review for instant auto-refund
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingDeposits.map((dep) => (
              <div
                key={dep.id}
                className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111827] dark:text-white">
                      DEPOSIT · {dep.id}
                    </span>
                    <WalletStatusBadge status={dep.status} />
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {dep.method.toUpperCase()} · TrxID: {dep.transactionId}
                  </div>
                  <div className="text-[#059669] font-bold">+৳{dep.amountBdt}</div>
                </div>
                <button
                  type="button"
                  onClick={() => cancelPendingWalletRequest('deposit', dep.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#FEE2E2] text-[#B91C1C] font-sans text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            ))}

            {pendingWithdrawals.map((wth) => (
              <div
                key={wth.id}
                className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-2 text-xs font-mono"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#111827] dark:text-white">
                      WITHDRAW · {wth.id}
                    </span>
                    <WalletStatusBadge status={wth.status} />
                  </div>
                  <div className="text-[11px] text-[#6B7280]">
                    {wth.method.toUpperCase()} ({wth.receiverNumber})
                  </div>
                  <div className="text-[#0D3B66] dark:text-[#60A5FA] font-bold">
                    Locked: ৳{wth.amountBdt} (Net: ৳{wth.netAmountBdt})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cancelPendingWalletRequest('withdraw', wth.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#FEE2E2] text-[#B91C1C] font-sans text-xs font-semibold"
                >
                  Cancel & Refund
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 0%-Fee Balance Transfer Card */}
      <form onSubmit={handleTransfer} className="zvy-card p-4 sm:p-5 space-y-3.5">
        <div className="flex items-center gap-2">
          <span className="step-badge">1</span>
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
            0%-FEE TRANSFER TO MAIN WALLET
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div>
            <label className="block text-xs font-medium mb-1">From Balance</label>
            <select
              value={fromWallet}
              onChange={(e) =>
                setFromWallet(e.target.value as 'incomeBalance' | 'bonusBalance')
              }
              className="w-full h-[42px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            >
              <option value="incomeBalance">
                Income Balance (Available: ৳{currentUser.incomeBalance})
              </option>
              <option value="bonusBalance">
                Bonus Balance (Available: ৳{currentUser.bonusBalance})
              </option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium mb-1">Amount (Min ৳10 BDT)</label>
            <input
              type="number"
              min={10}
              required
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="h-[42px] px-5 rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-semibold transition-colors"
          >
            Transfer to Main Wallet
          </button>
        </div>
      </form>

      {/* Transaction History List */}
      <div className="zvy-card p-4 sm:p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="step-badge">2</span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              TRANSACTION HISTORY ({myTransactions.length})
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <input
              type="text"
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              placeholder="Search ID, Method..."
              className="h-[36px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            />
            <select
              value={ledgerTypeFilter}
              onChange={(e) => setLedgerTypeFilter(e.target.value)}
              className="h-[36px] px-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            >
              <option value="All">All Types</option>
              <option value="Deposit">Deposit</option>
              <option value="Withdraw">Withdraw</option>
              <option value="Refund">Refund</option>
              <option value="TopUp Order">TopUp Order</option>
              <option value="Tournament Entry">Tournament Entry</option>
              <option value="Tournament Prize">Tournament Prize</option>
              <option value="Task Reward">Task Reward</option>
              <option value="Referral Bonus">Referral Bonus</option>
              <option value="Balance Transfer">Balance Transfer</option>
            </select>
            <select
              value={ledgerStatusFilter}
              onChange={(e) => setLedgerStatusFilter(e.target.value)}
              className="h-[36px] px-2.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          {myTransactions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6B7280]">
              No matching transactions found.
            </div>
          ) : (
            myTransactions.map((trx) => (
              <div
                key={trx.id}
                className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[#111827] dark:text-white">
                      {trx.type}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#E5E7EB] dark:bg-[#1E293B] text-[10px] font-mono font-bold">
                      {trx.method || trx.balanceType}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#6B7280] truncate">
                    {trx.description}
                  </div>
                  <div className="text-[10px] font-mono text-[#9CA3AF]">
                    Ref: {trx.referenceId} · {trx.createdAt}
                  </div>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <div
                    className={`font-mono font-extrabold text-sm ${
                      trx.direction === 'credit' ? 'text-[#059669]' : 'text-[#DC2626]'
                    }`}
                  >
                    {trx.direction === 'credit' ? '+' : '-'}৳{trx.amountBdt}
                  </div>
                  <WalletStatusBadge status={trx.status} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   4. DEPOSIT PAGE (/deposit — STEP-NUMBERED ZVY CARDS FOR ADD MONEY)
   ============================================================================ */
export const DepositPage: React.FC = () => {
  const {
    paymentSettings,
    deposits,
    currentUser,
    createDeposit,
    cancelPendingWalletRequest,
    addToast,
    navigate,
  } = useApp();

  const activeGateways = paymentSettings.gateways.filter(
    (g) => g.active && (g.id as string) !== 'card'
  );
  const [selectedMethod, setSelectedMethod] = useState<PaymentGatewayName>(
    activeGateways[0]?.id || 'bkash'
  );
  const [channel, setChannel] = useState<'Manual' | 'Instant Gateway'>('Manual');
  const [senderNumber, setSenderNumber] = useState(currentUser?.phone || '');
  const [transactionId, setTransactionId] = useState('');
  const [amountBdt, setAmountBdt] = useState<number>(200);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [gatewayOutcome, setGatewayOutcome] = useState<'success' | 'fail'>('success');
  const [lastIdempotencyKey, setLastIdempotencyKey] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-[440px] mx-auto px-3.5 py-12 text-center">
        <div className="zvy-card p-6 space-y-4">
          <button
            type="button"
            onClick={() => navigate('login')}
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            Login to Add Money
          </button>
        </div>
      </div>
    );
  }

  const currentGateway =
    activeGateways.find((g) => g.id === selectedMethod) || activeGateways[0];

  const minDeposit = paymentSettings.minDepositBdt || 25;
  const maxDeposit = paymentSettings.maxDepositBdt || 100000;
  const depositFeePct = paymentSettings.depositFeePercent || 0;
  const depositFeeBdt = Math.round((Number(amountBdt || 0) * depositFeePct) / 100);
  const netCreditBdt = Math.max(0, Number(amountBdt || 0) - depositFeeBdt);

  const handleScreenshotFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      addToast('File Too Large', 'Please choose a screenshot image under 2 MB.', 'error');
      return;
    }
    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setScreenshotDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitDeposit = async (e: React.FormEvent, reuseIdempotencyKey = false) => {
    e.preventDefault();
    const autoTrx =
      channel === 'Instant Gateway'
        ? `SSL-${selectedMethod.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`
        : transactionId.trim();

    if (channel === 'Manual' && !autoTrx) {
      addToast('Missing Transaction ID', 'Please enter your payment TrxID.', 'error');
      return;
    }

    const idemKey =
      reuseIdempotencyKey && lastIdempotencyKey
        ? lastIdempotencyKey
        : `IDEM-DEP-${currentUser.id}-${channel === 'Manual' ? autoTrx.toUpperCase() : Date.now()}`;

    setLastIdempotencyKey(idemKey);
    setSubmitting(true);
    const ok = await createDeposit({
      method: selectedMethod,
      channel,
      senderNumber: senderNumber.trim(),
      transactionId: autoTrx,
      amountBdt: Number(amountBdt),
      screenshotUrl: screenshotDataUrl || undefined,
      simulateOutcome: gatewayOutcome,
      idempotencyKey: idemKey,
    });
    setSubmitting(false);

    if (ok && !reuseIdempotencyKey && channel === 'Manual') {
      setTransactionId('');
      setScreenshotDataUrl('');
      setScreenshotFileName('');
    }
  };

  const myDeposits = deposits.filter((d) => d.userId === currentUser.id);

  const gatewayBadgeColors: Record<string, string> = {
    bkash: 'bg-[#E2136E] text-white',
    nagad: 'bg-[#F7941D] text-white',
    rocket: 'bg-[#8C3494] text-white',
    upay: 'bg-[#00529B] text-white',
  };

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      <div className="zvy-card p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
            Add Money to Wallet (BDT)
          </h1>
          <p className="text-xs text-[#6B7280]">
            Min ৳{minDeposit} · Max ৳{maxDeposit} · Main Balance: ৳{currentUser.mainBalance}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('wallet')}
          className="px-3.5 py-2 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold"
        >
          ← Back to Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <form
          onSubmit={(e) => handleSubmitDeposit(e, false)}
          className="lg:col-span-7 zvy-card p-4 sm:p-6 space-y-4"
        >
          {/* Step 1: Channel & Payment Method */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="step-badge">1</span>
              <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                SELECT PAYMENT METHOD
              </h2>
            </div>
            <span className="text-[11px] font-bold text-[#EF4444]">• REQUIRED</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => setChannel('Manual')}
              className={`p-3 rounded-xl border text-left transition-all ${
                channel === 'Manual'
                  ? 'border-2 border-[#3B0A0A] bg-[#FFF5F5] dark:bg-[#2A0B0B]'
                  : 'border-[#E5E7EB] dark:border-[#1E293B]'
              }`}
            >
              <div className="text-xs font-extrabold text-[#111827] dark:text-white">
                Manual Send Money
              </div>
              <div className="text-[11px] text-[#6B7280]">
                TrxID + Screenshot Verification
              </div>
            </button>

            <button
              type="button"
              onClick={() => setChannel('Instant Gateway')}
              className={`p-3 rounded-xl border text-left transition-all ${
                channel === 'Instant Gateway'
                  ? 'border-2 border-[#3B0A0A] bg-[#FFF5F5] dark:bg-[#2A0B0B]'
                  : 'border-[#E5E7EB] dark:border-[#1E293B]'
              }`}
            >
              <div className="text-xs font-extrabold text-[#111827] dark:text-white">
                ইনস্ট্যান্ট পেমেন্ট (Gateway)
              </div>
              <div className="text-[11px] text-[#6B7280]">
                Auto Webhook Credit
              </div>
            </button>
          </div>

          {/* Gateway Tiles (4-column aligned MFS options: bKash, Nagad, Rocket, Upay) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeGateways.map((gw) => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setSelectedMethod(gw.id)}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  selectedMethod === gw.id
                    ? 'border-2 border-[#3B0A0A] dark:border-[#FF5500] bg-[#FFF5F5] dark:bg-[#2A0B0B]'
                    : 'border-[#E5E7EB] dark:border-[#1E293B]'
                }`}
              >
                <span
                  className={`inline-block px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                    gatewayBadgeColors[gw.id] || 'bg-[#3B0A0A] text-white'
                  }`}
                >
                  {gw.name}
                </span>
                <div className="text-[10px] font-mono text-[#6B7280] dark:text-[#94A3B8] mt-1 truncate">
                  {gw.merchantNumber}
                </div>
              </button>
            ))}
          </div>

          {/* Instructions Box */}
          {currentGateway && (
            <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#111827] dark:text-white">
                  {currentGateway.name} Number
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(currentGateway.personalNumber);
                    addToast('Number Copied', `${currentGateway.personalNumber} copied.`, 'info');
                  }}
                  className="text-[#3B0A0A] dark:text-[#FCA5A5] font-mono font-bold inline-flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy {currentGateway.personalNumber}</span>
                </button>
              </div>
              <p className="text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
                {currentGateway.instructions}
              </p>
              <div className="pt-1 border-t border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between font-mono text-[11px]">
                <span>Fee: {depositFeePct}% (৳{depositFeeBdt})</span>
                <span className="font-extrabold text-[#059669]">
                  Net Credit: +৳{netCreditBdt} BDT
                </span>
              </div>
            </div>
          )}

          {/* Step 2: Amount & Sender Details */}
          <div className="flex items-center gap-2 pt-1">
            <span className="step-badge">2</span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              ENTER AMOUNT & TRXID
            </h2>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {[50, 100, 200, 500, 1000, 2500].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmountBdt(preset)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border ${
                  amountBdt === preset
                    ? 'bg-[#3B0A0A] text-white border-[#3B0A0A]'
                    : 'bg-white dark:bg-[#0B1120] border-[#D1D5DB] dark:border-[#1E293B]'
                }`}
              >
                ৳{preset}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">Amount (BDT)</label>
              <input
                type="number"
                min={minDeposit}
                max={maxDeposit}
                required
                value={amountBdt}
                onChange={(e) => setAmountBdt(Number(e.target.value))}
                className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Sender {selectedMethod.toUpperCase()} Number
              </label>
              <input
                type="text"
                required
                value={senderNumber}
                onChange={(e) => setSenderNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
          </div>

          {channel === 'Manual' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium mb-1">
                  Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="Enter TrxID (e.g. BKS984012KL)"
                  className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-dashed border-[#D1D5DB] dark:border-[#334155] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#3B0A0A]" />
                    <span>Payment Screenshot (Optional)</span>
                  </span>
                  {screenshotDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotDataUrl('');
                        setScreenshotFileName('');
                      }}
                      className="text-[11px] text-[#DC2626] hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotFileChange}
                  className="block w-full text-xs text-[#6B7280] file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#3B0A0A] file:text-white"
                />
                {screenshotDataUrl && (
                  <div className="text-[11px] font-mono text-[#059669]">
                    ✓ Attached: {screenshotFileName || 'screenshot.png'}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-2">
              <div className="text-xs font-bold">Instant Gateway Verification Mode</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setGatewayOutcome('success')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                    gatewayOutcome === 'success'
                      ? 'bg-[#00C853] text-white border-[#00C853]'
                      : 'bg-white dark:bg-[#111827] border-[#D1D5DB]'
                  }`}
                >
                  ✓ Verified Callback
                </button>
                <button
                  type="button"
                  onClick={() => setGatewayOutcome('fail')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border ${
                    gatewayOutcome === 'fail'
                      ? 'bg-[#DC2626] text-white border-[#DC2626]'
                      : 'bg-white dark:bg-[#111827] border-[#D1D5DB]'
                  }`}
                >
                  ✕ Declined Callback
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2.5">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-[44px] rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {submitting
                  ? 'Processing...'
                  : `Confirm Deposit (+৳${netCreditBdt} BDT)`}
              </span>
            </button>
            {lastIdempotencyKey && (
              <button
                type="button"
                onClick={(e) => handleSubmitDeposit(e, true)}
                className="h-[44px] px-3 rounded-xl border border-[#3B0A0A] text-[#3B0A0A] text-xs font-mono font-bold"
              >
                Retry Idempotent
              </button>
            )}
          </div>
        </form>

        {/* Deposit History */}
        <div className="lg:col-span-5 zvy-card p-4 sm:p-5 space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
            MY DEPOSITS ({myDeposits.length})
          </h2>
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {myDeposits.map((dep) => (
              <div
                key={dep.id}
                className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] dark:text-white">
                    {dep.id} · {dep.method.toUpperCase()}
                  </span>
                  <WalletStatusBadge status={dep.status} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span className="truncate">TrxID: {dep.transactionId}</span>
                  <span className="font-extrabold text-[#059669]">
                    +৳{dep.netCreditBdt ?? dep.amountBdt}
                  </span>
                </div>
                {dep.screenshotUrl && (
                  <div className="text-[10px] text-[#0D3B66] font-sans flex items-center gap-1">
                    <ImageIcon className="w-3 h-3" />
                    <span>Screenshot attached</span>
                  </div>
                )}
                {dep.status === 'Pending' && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => cancelPendingWalletRequest('deposit', dep.id)}
                      className="px-2.5 py-1 rounded bg-[#FEE2E2] text-[#B91C1C] font-sans text-[11px] font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   5. WITHDRAW PAGE (/withdraw — STEP-NUMBERED ZVY CARDS FOR PAYOUTS)
   ============================================================================ */
export const WithdrawPage: React.FC = () => {
  const {
    paymentSettings,
    withdrawals,
    currentUser,
    lockedPendingByUser,
    createWithdraw,
    cancelPendingWalletRequest,
    navigate,
  } = useApp();

  const activeGateways = paymentSettings.gateways.filter(
    (g) => g.active && (g.id as string) !== 'card'
  );
  const [method, setMethod] = useState<PaymentGatewayName>(
    activeGateways[0]?.id || 'bkash'
  );
  const [walletSource, setWalletSource] = useState<'incomeBalance' | 'mainBalance'>(
    'incomeBalance'
  );
  const [receiverNumber, setReceiverNumber] = useState(currentUser?.phone || '');
  const [amountBdt, setAmountBdt] = useState<number>(paymentSettings.minWithdrawBdt || 100);
  const [authConfirmCode, setAuthConfirmCode] = useState<string>('');
  const [lastWithdrawIdemKey, setLastWithdrawIdemKey] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-[440px] mx-auto px-3.5 py-12 text-center">
        <div className="zvy-card p-6 space-y-4">
          <button
            type="button"
            onClick={() => navigate('login')}
            className="w-full h-[42px] rounded-xl bg-[#3B0A0A] text-white text-xs font-semibold"
          >
            Login to Withdraw
          </button>
        </div>
      </div>
    );
  }

  const minWithdraw = paymentSettings.minWithdrawBdt || 100;
  const maxWithdraw = paymentSettings.maxWithdrawBdt || 50000;
  const manualReviewThreshold = paymentSettings.manualReviewThresholdBdt || 5000;
  const processingTimeText =
    paymentSettings.processingTimeText || '30–120 Minutes';
  const feeBdt = Math.round((Number(amountBdt || 0) * paymentSettings.withdrawFeePercent) / 100);
  const netAmount = Math.max(0, Number(amountBdt || 0) - feeBdt);
  const availableInSelectedWallet =
    walletSource === 'incomeBalance' ? currentUser.incomeBalance : currentUser.mainBalance;
  const lockedPendingBdt = lockedPendingByUser[currentUser.id] || 0;

  const handleWithdrawSubmit = async (e: React.FormEvent, reuseIdemKey = false) => {
    e.preventDefault();
    const idemKey =
      reuseIdemKey && lastWithdrawIdemKey
        ? lastWithdrawIdemKey
        : `IDEM-WTH-${currentUser.id}-${amountBdt}-${Date.now()}`;
    setLastWithdrawIdemKey(idemKey);
    setSubmitting(true);
    await createWithdraw({
      method,
      walletSource,
      receiverNumber: receiverNumber.trim(),
      amountBdt: Number(amountBdt),
      authConfirmCode: authConfirmCode.trim(),
      idempotencyKey: idemKey,
    });
    setSubmitting(false);
  };

  const myWithdrawals = withdrawals.filter((w) => w.userId === currentUser.id);

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      <div className="zvy-card p-4 sm:p-5 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
            Withdraw Earnings (bKash / Nagad / Rocket / Upay)
          </h1>
          <p className="text-xs text-[#6B7280]">
            Min ৳{minWithdraw} · Fee {paymentSettings.withdrawFeePercent}% · Locked Pending: ৳{lockedPendingBdt}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('wallet')}
          className="px-3.5 py-2 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold"
        >
          ← Back to Wallet
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <form
          onSubmit={(e) => handleWithdrawSubmit(e, false)}
          className="lg:col-span-7 zvy-card p-4 sm:p-6 space-y-4"
        >
          <div className="flex items-center gap-2">
            <span className="step-badge">1</span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              SELECT WALLET & PAYOUT METHOD
            </h2>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1">Wallet Source</label>
            <select
              value={walletSource}
              onChange={(e) =>
                setWalletSource(e.target.value as 'incomeBalance' | 'mainBalance')
              }
              className="w-full h-[42px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
            >
              <option value="incomeBalance">
                Income Balance (Available: ৳{currentUser.incomeBalance} BDT)
              </option>
              <option value="mainBalance">
                Main Balance (Available: ৳{currentUser.mainBalance} BDT)
              </option>
            </select>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {activeGateways.map((gw) => (
              <button
                key={gw.id}
                type="button"
                onClick={() => setMethod(gw.id)}
                className={`h-[42px] px-3 rounded-xl border text-xs font-extrabold transition-all ${
                  method === gw.id
                    ? 'border-2 border-[#3B0A0A] bg-[#FFF5F5] dark:bg-[#2A0B0B] text-[#3B0A0A] dark:text-white'
                    : 'border-[#E5E7EB] dark:border-[#1E293B]'
                }`}
              >
                {gw.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <span className="step-badge">2</span>
            <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
              RECEIVER NUMBER & SECURITY PIN
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium mb-1">
                Personal {method.toUpperCase()} Number
              </label>
              <input
                type="text"
                required
                value={receiverNumber}
                onChange={(e) => setReceiverNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1">
                Withdraw Amount (Min ৳{minWithdraw})
              </label>
              <input
                type="number"
                min={minWithdraw}
                max={maxWithdraw}
                required
                value={amountBdt}
                onChange={(e) => setAmountBdt(Number(e.target.value))}
                className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-1 flex items-center gap-1.5">
              <KeyRound className="w-3.5 h-3.5 text-[#3B0A0A]" />
              <span>Security Confirmation (Password or 6-Digit PIN)</span>
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={authConfirmCode}
              onChange={(e) => setAuthConfirmCode(e.target.value)}
              placeholder="Enter security PIN or password"
              className="w-full h-[42px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] text-[#111827] dark:text-white border border-[#D1D5DB] dark:border-[#1E293B]"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1.5 text-xs font-mono">
            <div className="flex items-center justify-between">
              <span>Available: ৳{availableInSelectedWallet}</span>
              <span>Fee: ৳{feeBdt}</span>
              <span className="font-extrabold text-[#059669]">Net Payout: ৳{netAmount}</span>
            </div>
            <div className="text-[11px] text-[#6B7280] font-sans">
              Expected Time: {processingTimeText}
            </div>
            {Number(amountBdt) >= manualReviewThreshold && (
              <div className="p-2 rounded bg-[#FEF3C7] text-[#B45309] font-sans text-[11px] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>Withdrawals ≥ ৳{manualReviewThreshold} require senior admin review.</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full h-[44px] rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs sm:text-sm font-bold transition-colors disabled:opacity-60"
          >
            {submitting
              ? 'Locking Funds...'
              : `Request Payout (Net ৳${netAmount} BDT)`}
          </button>
        </form>

        {/* Withdrawal History */}
        <div className="lg:col-span-5 zvy-card p-4 sm:p-5 space-y-3">
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
            MY WITHDRAWALS ({myWithdrawals.length})
          </h2>
          <div className="space-y-2 max-h-[540px] overflow-y-auto pr-1">
            {myWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1.5 text-xs font-mono"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#111827] dark:text-white">
                    {w.id} · {w.method.toUpperCase()}
                  </span>
                  <WalletStatusBadge status={w.status} />
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#6B7280]">
                  <span>To: {w.receiverNumber}</span>
                  <span className="font-extrabold text-[#0D3B66] dark:text-[#60A5FA]">
                    Net: ৳{w.netAmountBdt}
                  </span>
                </div>
                {w.status === 'Pending' && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => cancelPendingWalletRequest('withdraw', w.id)}
                      className="px-2.5 py-1 rounded bg-[#FEE2E2] text-[#B91C1C] font-sans text-[11px] font-semibold"
                    >
                      Cancel & Refund ৳{w.amountBdt}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   6. UNIFIED TRANSACTIONS PAGE (/transactions)
   ============================================================================ */
export const TransactionsPage: React.FC = () => {
  const { transactions, currentUser } = useApp();
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  const types = [
    'All',
    'Deposit',
    'Withdraw',
    'Refund',
    'TopUp Order',
    'Tournament Entry',
    'Tournament Prize',
    'Task Reward',
    'Referral Bonus',
    'Balance Transfer',
  ];

  const statuses = ['All', 'Pending', 'Approved', 'Completed', 'Rejected', 'Failed'];

  const filtered = transactions.filter((trx) => {
    if (currentUser && currentUser.role !== 'admin' && trx.userId !== currentUser.id) {
      return false;
    }
    if (typeFilter !== 'All' && trx.type !== typeFilter) return false;
    if (statusFilter !== 'All' && trx.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      <div className="zvy-card p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
            Wallet & Order Transaction Ledger
          </h1>
          <p className="text-xs text-[#6B7280]">
            Complete log of all top-ups, deposits, withdrawals, and rewards.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#3B0A0A] shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-[36px] px-3 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#1E293B]"
          >
            {types.map((tItem) => (
              <option key={tItem} value={tItem}>
                {tItem}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-[36px] px-3 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-[#D1D5DB] dark:border-[#1E293B]"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="zvy-card p-4 sm:p-5 space-y-2">
        {filtered.map((trx) => (
          <div
            key={trx.id}
            className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-3 text-xs"
          >
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#111827] dark:text-white">{trx.type}</span>
                <span className="px-2 py-0.5 rounded bg-[#E5E7EB] dark:bg-[#1E293B] text-[10px] font-mono">
                  {trx.method || trx.balanceType}
                </span>
              </div>
              <div className="text-[11px] text-[#6B7280] truncate">{trx.description}</div>
              <div className="text-[10px] font-mono text-[#9CA3AF]">
                {trx.referenceId} · {trx.createdAt}
              </div>
            </div>
            <div className="text-right shrink-0 space-y-1">
              <div
                className={`font-mono font-extrabold text-sm ${
                  trx.direction === 'credit' ? 'text-[#059669]' : 'text-[#DC2626]'
                }`}
              >
                {trx.direction === 'credit' ? '+' : '-'}৳{trx.amountBdt}
              </div>
              <WalletStatusBadge status={trx.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
