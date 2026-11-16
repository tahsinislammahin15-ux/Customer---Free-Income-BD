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
  XCircle,
  Clock,
  CreditCard,
  Image as ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentGatewayName, SupportTicket, WalletStatus } from '../types';

export const WalletStatusBadge: React.FC<{ status: WalletStatus | string }> = ({ status }) => {
  const normalized = status as WalletStatus;
  const styles: Record<string, string> = {
    Pending:
      'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30',
    Approved:
      'bg-[#2563EB]/15 text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB]/30',
    Completed:
      'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30',
    Rejected:
      'bg-[#EF4444]/15 text-[#EF4444] border border-[#EF4444]/30',
    Failed:
      'bg-[#F43F5E]/15 text-[#F43F5E] border border-[#F43F5E]/30',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold ${
        styles[normalized] || styles.Pending
      }`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      <span>{status}</span>
    </span>
  );
};

/* ============================================================================
   6. MY ACCOUNT (UNIFIED USER DASHBOARD)
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
  } = useApp();

  const [ticketCategory, setTicketCategory] =
    useState<SupportTicket['category']>('Top Up Issue');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketMessage, setTicketMessage] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Sign In to Access Your Account</h1>
        <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
          View your unified Free Fire Top Up orders, tournament Room IDs, and task rewards.
        </p>
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
        >
          Go to Sign In
        </button>
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Account Welcome & Quick Navigation */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="text-xs font-mono text-[#2563EB]">
            Account ID: {currentUser.id} · Free Fire UID: {currentUser.ffUid} ({currentUser.ffIgn})
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Welcome back, {currentUser.name}
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Joined {currentUser.joinedAt} · {currentUser.referralCount} Verified Referrals ·{' '}
            {currentUser.tournamentWins} Tournament Booyahs
          </p>
        </div>

        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2.5">
          <button
            onClick={() => navigate('wallet')}
            className="min-h-[42px] px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold"
          >
            Open Wallet
          </button>
          <button
            onClick={() => navigate('deposit')}
            className="min-h-[42px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#2563EB] text-xs font-semibold"
          >
            Deposit BDT
          </button>
          <button
            onClick={() => navigate('withdraw')}
            className="min-h-[42px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] hover:border-[#10B981] text-xs font-semibold text-[#10B981]"
          >
            Withdraw BDT
          </button>
          <button
            onClick={() => navigate('profile')}
            className="min-h-[42px] px-4 py-2.5 rounded-xl border border-[#E2E8F0] dark:border-[#1E293B] text-xs font-semibold"
          >
            Edit Profile & UID
          </button>
        </div>
      </div>

      {/* 3 Wallet Balances Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl card-premium space-y-2">
          <div className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
            Main Balance (Deposits & Top Up)
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#2563EB]">
            ৳{currentUser.mainBalance} BDT
          </div>
          <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Used for instant UID Top Up & Tournament entry fees
          </div>
        </div>

        <div className="p-6 rounded-2xl card-premium space-y-2">
          <div className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
            Income Balance (Tasks, Prizes & Referrals)
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#10B981]">
            ৳{currentUser.incomeBalance} BDT
          </div>
          <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Withdrawable via bKash, Nagad, Rocket & Upay
          </div>
        </div>

        <div className="p-6 rounded-2xl card-premium space-y-2">
          <div className="text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
            Bonus Balance (Promotional Credits)
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F59E0B]">
            ৳{currentUser.bonusBalance} BDT
          </div>
          <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Transferable to Main Wallet for Diamond purchases
          </div>
        </div>
      </div>

      {/* Active Tournaments & Recent Orders Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Registered Tournaments with Room ID Reveal */}
        <div className="p-6 rounded-2xl card-premium space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              My Registered Tournaments ({myTournaments.length})
            </h2>
            <button
              onClick={() => navigate('tournaments')}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              Browse Lobby →
            </button>
          </div>
          {myTournaments.length === 0 ? (
            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
              You have not registered for any tournaments yet.
            </p>
          ) : (
            <div className="space-y-3">
              {myTournaments.map((trn) => (
                <div
                  key={trn.id}
                  className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {trn.title}
                    </span>
                    <span className="font-mono text-[#06B6D4] font-semibold">
                      {trn.startTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-[#E2E8F0] dark:border-[#1E293B]">
                    <span className="text-[#10B981]">
                      Room ID: {trn.roomId || 'TBA'} · Pass: {trn.roomPassword || 'TBA'}
                    </span>
                    {trn.roomId && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(trn.roomId!);
                          addToast('Room ID Copied', `Room ID ${trn.roomId} copied.`, 'info');
                        }}
                        className="text-[#2563EB] hover:underline inline-flex items-center gap-1"
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

        {/* Recent Top Up Orders */}
        <div className="p-6 rounded-2xl card-premium space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              My Diamond Orders ({myOrders.length})
            </h2>
            <button
              onClick={() => navigate('topup')}
              className="text-xs font-semibold text-[#2563EB] hover:underline"
            >
              New Top Up →
            </button>
          </div>
          <div className="space-y-3">
            {myOrders.slice(0, 4).map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {ord.packageTitle}
                  </div>
                  <div className="font-mono text-[#475569] dark:text-[#94A3B8]">
                    {ord.id} · UID: {ord.playerUid} · {ord.createdAt}
                  </div>
                </div>
                <div className="text-right font-mono">
                  <div className="font-bold text-[#2563EB]">৳{ord.amountBdt}</div>
                  <div
                    className={`font-bold ${
                      ord.status === 'Completed'
                        ? 'text-[#10B981]'
                        : ord.status === 'Cancelled'
                        ? 'text-[#EF4444]'
                        : 'text-[#F59E0B]'
                    }`}
                  >
                    {ord.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Feed & Support Ticket Submission */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 p-6 rounded-2xl card-premium space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Account Activity & Notifications
            </h2>
          </div>
          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
              <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Custom Room Unlocked: TRN-501
              </div>
              <div className="text-[#475569] dark:text-[#94A3B8] mt-0.5">
                Room ID <span className="font-mono">88492014</span> is active for tonight’s 9:00 PM Clash Squad match.
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
              <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Task Submissions ({mySubmissions.length})
              </div>
              <div className="text-[#475569] dark:text-[#94A3B8] mt-0.5">
                You have {mySubmissions.filter((s) => s.status === 'Pending').length} pending and{' '}
                {mySubmissions.filter((s) => s.status === 'Approved').length} approved task proofs.
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 p-6 rounded-2xl card-premium space-y-4">
          <div className="flex items-center gap-2">
            <LifeBuoy className="w-4 h-4 text-[#10B981]" />
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Open a Priority Support Ticket
            </h2>
          </div>
          <form onSubmit={handleTicketSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <select
                value={ticketCategory}
                onChange={(e) =>
                  setTicketCategory(e.target.value as SupportTicket['category'])
                }
                className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
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
                className="px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <textarea
              rows={2}
              required
              value={ticketMessage}
              onChange={(e) => setTicketMessage(e.target.value)}
              placeholder="Describe your issue clearly..."
              className="w-full px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Active Tickets: {myTickets.length}
              </span>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl btn-primary text-xs font-semibold"
              >
                Submit Support Ticket
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   7. USER PROFILE PAGE
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
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
        >
          Sign In Required
        </button>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ name, phone, ffUid, ffIgn });
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="p-6 sm:p-8 rounded-2xl card-premium flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Player Profile & Free Fire UID Binding
          </h1>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-1">
            Keep your Bangladesh Server UID accurate for one-click Diamond Top Ups and Tournament room checks.
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] text-xs font-semibold text-[#10B981] flex items-center gap-1.5">
          <UserCheck className="w-4 h-4" />
          <span>{currentUser.verified ? 'KYC & UID Verified' : 'Unverified'}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <form
          onSubmit={handleSaveProfile}
          className="p-6 rounded-2xl card-premium space-y-4"
        >
          <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC]">
            Personal & Game Identity
          </h2>
          <div>
            <label className="block text-xs font-semibold mb-1">Full Name</label>
            <input
              type="text"
              required
              maxLength={80}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Bangladesh Mobile Number (bKash/Nagad Linked)
            </label>
            <input
              type="tel"
              required
              maxLength={14}
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Free Fire Numeric Player UID
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={12}
              value={ffUid}
              onChange={(e) => setFfUid(e.target.value.replace(/\D/g, ''))}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1">
              Free Fire In-Game Name (IGN)
            </label>
            <input
              type="text"
              required
              maxLength={40}
              value={ffIgn}
              onChange={(e) => setFfIgn(e.target.value)}
              className="w-full px-3.5 py-2 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl btn-primary text-xs font-semibold"
          >
            Save Profile Changes
          </button>
        </form>

        <form
          onSubmit={handlePasswordChange}
          className="p-6 rounded-2xl card-premium space-y-4 flex flex-col justify-between"
        >
          <div className="space-y-4">
            <h2 className="text-base font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-[#2563EB]" />
              <span>Security & Password Update</span>
            </h2>
            <div>
              <label className="block text-xs font-semibold mb-1">Current Password</label>
              <input
                type="password"
                required
                maxLength={128}
                autoComplete="current-password"
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">New Password</label>
              <input
                type="password"
                required
                minLength={6}
                maxLength={128}
                autoComplete="new-password"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl border border-[#2563EB] text-[#2563EB] hover:bg-[#2563EB] hover:text-white text-xs font-semibold transition-colors"
          >
            Update Account Password
          </button>
        </form>
      </div>
    </div>
  );
};

/* ============================================================================
   8. WALLET PAGE (BACKEND DOUBLE-ENTRY BALANCES, PENDING LOCKS & FULL LEDGER)
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
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
        <h1 className="text-2xl font-bold">Sign In to Access Your Wallet</h1>
        <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
          View your double-entry ledger balances, deposit funds, or withdraw earnings.
        </p>
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
        >
          Sign In to View Wallet
        </button>
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Primary Deposit / Withdraw Actions */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-bold text-[#2563EB]">
            <ShieldCheck className="w-4 h-4 text-[#10B981]" />
            <span>SERVER-AUTHORITATIVE DOUBLE-ENTRY LEDGER · IDEMPOTENCY PROTECTED</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Fintech Wallet & Double-Entry Ledger
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8]">
            Every balance is dynamically computed on the server from atomic credit and debit entries. Never calculated or overwritten on the client.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleSyncLedger}
            className="min-h-[44px] px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold inline-flex items-center gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync Server Ledger</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('deposit')}
            className="min-h-[44px] px-5 py-2.5 rounded-xl btn-primary text-xs sm:text-sm font-bold inline-flex items-center gap-1.5"
          >
            <ArrowDownLeft className="w-4 h-4" />
            <span>Deposit BDT</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('withdraw')}
            className="min-h-[44px] px-5 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Withdraw BDT</span>
          </button>
        </div>
      </div>

      {/* 4 Balance Cards (3 Wallets + Locked Pending Withdrawals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl card-premium card-premium-interactive space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8]">
              01. MAIN BALANCE (AVAILABLE)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#2563EB]/10 border border-[#2563EB]/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#2563EB] dark:text-[#60A5FA]">
            ৳{currentUser.mainBalance}
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Funded via bKash, Nagad, Rocket, Upay & Card deposits. Used for Diamond Top Up & Tournaments.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium card-premium-interactive space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8]">
              02. INCOME BALANCE (WITHDRAWABLE)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#10B981]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#10B981]">
            ৳{currentUser.incomeBalance}
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Earned from verified tasks, tournament Booyah prizes, and referrals. Ready to withdraw.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium card-premium-interactive space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8]">
              03. BONUS BALANCE (PROMOTIONAL)
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
              <Wallet className="w-4 h-4 text-[#F59E0B]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#F59E0B]">
            ৳{currentUser.bonusBalance}
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Welcome & promo credits. Convert 1:1 into Main Balance with 0% fee for Diamond purchases.
          </p>
        </div>

        <div className="p-6 rounded-2xl card-premium card-premium-interactive space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-[#475569] dark:text-[#94A3B8]">
              04. LOCKED PENDING PAYOUTS
            </span>
            <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/10 border border-[#06B6D4]/20 flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#06B6D4]" />
            </div>
          </div>
          <div className="text-3xl font-extrabold font-mono text-[#06B6D4]">
            ৳{lockedPendingBdt}
          </div>
          <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
            Immediately debited & reserved when a withdrawal is requested so funds can never be double-spent.
          </p>
        </div>
      </div>

      {/* Active Pending Requests (With Instant User Cancellation & Auto-Refund) */}
      {(pendingDeposits.length > 0 || pendingWithdrawals.length > 0) && (
        <div className="p-6 rounded-2xl card-premium space-y-4 border border-[#F59E0B]/40">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-[#F59E0B]" />
              <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Active Pending Requests ({pendingDeposits.length + pendingWithdrawals.length})
              </h2>
            </div>
            <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
              You can cancel any pending request before Admin processing. Cancelled withdrawals auto-refund immediately.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pendingDeposits.map((dep) => (
              <div
                key={dep.id}
                className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      DEPOSIT · {dep.id}
                    </span>
                    <WalletStatusBadge status={dep.status} />
                  </div>
                  <div className="text-[#475569] dark:text-[#94A3B8]">
                    {dep.method.toUpperCase()} ({dep.channel}) · TrxID: {dep.transactionId}
                  </div>
                  <div className="text-[#10B981] font-bold">
                    Amount: +৳{dep.amountBdt} · {dep.createdAt}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cancelPendingWalletRequest('deposit', dep.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444] text-[#EF4444] hover:text-white font-sans font-semibold transition-colors"
                >
                  Cancel Request
                </button>
              </div>
            ))}

            {pendingWithdrawals.map((wth) => (
              <div
                key={wth.id}
                className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      WITHDRAW · {wth.id}
                    </span>
                    <WalletStatusBadge status={wth.status} />
                    {wth.flaggedForReview && (
                      <span className="px-2 py-0.5 rounded bg-[#EF4444]/15 text-[#EF4444] text-[10px] font-bold">
                        Flagged for Review
                      </span>
                    )}
                  </div>
                  <div className="text-[#475569] dark:text-[#94A3B8]">
                    {wth.method.toUpperCase()} ({wth.receiverNumber}) · Source: {wth.walletSource}
                  </div>
                  <div className="text-[#2563EB] font-bold">
                    Locked: ৳{wth.amountBdt} (Net Payout: ৳{wth.netAmountBdt}) · {wth.createdAt}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => cancelPendingWalletRequest('withdraw', wth.id)}
                  className="px-3 py-1.5 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444] text-[#EF4444] hover:text-white font-sans font-semibold transition-colors"
                >
                  Cancel & Refund ৳{wth.amountBdt}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Zero-Fee Balance Transfer Tool */}
      <form
        onSubmit={handleTransfer}
        className="p-6 sm:p-8 rounded-2xl card-premium space-y-5"
      >
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-[#2563EB]" />
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Atomic 0%-Fee Internal Balance Transfer to Main Wallet
            </h2>
          </div>
          <span className="text-xs font-mono text-[#10B981]">
            Writes paired Debit + Credit entries atomically on server
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-xs font-semibold mb-1.5">Source Balance</label>
            <select
              value={fromWallet}
              onChange={(e) =>
                setFromWallet(e.target.value as 'incomeBalance' | 'bonusBalance')
              }
              className="w-full min-h-[44px] px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
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
            <label className="block text-xs font-semibold mb-1.5">Amount to Transfer (Min ৳10 BDT)</label>
            <input
              type="number"
              min={10}
              required
              value={transferAmount}
              onChange={(e) => setTransferAmount(Number(e.target.value))}
              className="w-full min-h-[44px] px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
          </div>
          <button
            type="submit"
            className="min-h-[44px] py-2.5 px-5 rounded-xl btn-primary text-xs font-semibold"
          >
            Transfer to Main Balance
          </button>
        </div>
      </form>

      {/* Full Transaction History Ledger on Wallet Page */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Full Wallet Transaction History ({myTransactions.length} Entries)
            </h2>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">
              Complete double-entry ledger showing Date, Type, Amount, Method, Status badge, and Reference ID.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="text"
              value={ledgerSearch}
              onChange={(e) => setLedgerSearch(e.target.value)}
              placeholder="Search Ref ID, Method, Note..."
              className="px-3.5 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
            <select
              value={ledgerTypeFilter}
              onChange={(e) => setLedgerTypeFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
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
              <option value="Admin Adjustment">Admin Adjustment</option>
            </select>
            <select
              value={ledgerStatusFilter}
              onChange={(e) => setLedgerStatusFilter(e.target.value)}
              className="px-3 py-2 text-xs font-semibold rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
              <option value="Failed">Failed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8]">
                <th className="py-3 px-3">Date & Time</th>
                <th className="py-3 px-3">Type / Wallet</th>
                <th className="py-3 px-3">Method</th>
                <th className="py-3 px-3">Reference ID</th>
                <th className="py-3 px-3">Description</th>
                <th className="py-3 px-3 text-right">Amount (BDT)</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
              {myTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#475569] dark:text-[#94A3B8] font-sans">
                    No matching ledger transactions found.
                  </td>
                </tr>
              ) : (
                myTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0B1120]">
                    <td className="py-3 px-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                      {trx.createdAt}
                    </td>
                    <td className="py-3 px-3 font-sans">
                      <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                        {trx.type}
                      </div>
                      <div className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8]">
                        {trx.balanceType} Wallet ({trx.direction.toUpperCase()})
                      </div>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                        {trx.method || 'Wallet'}
                      </span>
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-bold text-[#2563EB]">{trx.referenceId}</div>
                      <div className="text-[10px] text-[#475569] dark:text-[#94A3B8]">{trx.id}</div>
                    </td>
                    <td className="py-3 px-3 font-sans text-[#475569] dark:text-[#94A3B8] max-w-xs">
                      {trx.description}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                        trx.direction === 'credit' ? 'text-[#10B981]' : 'text-[#EF4444]'
                      }`}
                    >
                      {trx.direction === 'credit' ? '+' : '-'}৳{trx.amountBdt}
                    </td>
                    <td className="py-3 px-3 whitespace-nowrap">
                      <WalletStatusBadge status={trx.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
   9. DEPOSIT PAGE (MANUAL SEND-MONEY + SCREENSHOT UPLOAD + HMAC WEBHOOK GATEWAY)
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

  const activeGateways = paymentSettings.gateways.filter((g) => g.active);
  const [selectedMethod, setSelectedMethod] = useState<PaymentGatewayName>(
    activeGateways[0]?.id || 'bkash'
  );
  const [channel, setChannel] = useState<'Manual' | 'Instant Gateway'>('Manual');
  const [senderNumber, setSenderNumber] = useState(currentUser?.phone || '01712345678');
  const [transactionId, setTransactionId] = useState('');
  const [amountBdt, setAmountBdt] = useState<number>(200);
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string>('');
  const [screenshotFileName, setScreenshotFileName] = useState<string>('');
  const [gatewayOutcome, setGatewayOutcome] = useState<'success' | 'fail'>('success');
  const [lastIdempotencyKey, setLastIdempotencyKey] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
        >
          Sign In to Deposit
        </button>
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
      senderNumber: selectedMethod === 'card' ? '432100009999' : senderNumber.trim(),
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

  return (
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#2563EB]">
            MIN DEPOSIT: ৳{minDeposit} · MAX DEPOSIT: ৳{maxDeposit} · DEPOSIT FEE: {depositFeePct}%
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
            Deposit Funds to Main Wallet (BDT)
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
            Choose Instant Payment Gateway (verified via server HMAC-SHA256 webhook signature) or Manual Send Money with TrxID & Screenshot upload.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('wallet')}
          className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold self-start"
        >
          ← Back to Wallet (Main: ৳{currentUser.mainBalance})
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Deposit Form */}
        <form
          onSubmit={(e) => handleSubmitDeposit(e, false)}
          className="lg:col-span-7 p-5 sm:p-8 rounded-2xl card-premium space-y-5"
        >
          {/* Channel Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]">
            <button
              type="button"
              onClick={() => setChannel('Manual')}
              className={`min-h-[42px] py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                channel === 'Manual'
                  ? 'bg-[#2563EB] text-white'
                  : 'text-[#475569] dark:text-[#94A3B8]'
              }`}
            >
              Manual Send Money (TrxID + Screenshot)
            </button>
            <button
              type="button"
              onClick={() => setChannel('Instant Gateway')}
              className={`min-h-[42px] py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                channel === 'Instant Gateway'
                  ? 'bg-[#10B981] text-white'
                  : 'text-[#475569] dark:text-[#94A3B8]'
              }`}
            >
              Instant Gateway (HMAC Webhook Verified)
            </button>
          </div>

          {/* Active Bangladeshi Gateways + Card */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold">
              1. Select Payment Method (bKash, Nagad, Rocket, Upay, or Card)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {activeGateways.map((gw) => (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => {
                    setSelectedMethod(gw.id);
                    if (gw.id === 'card') {
                      setChannel('Instant Gateway');
                    }
                  }}
                  className={`min-h-[56px] p-3 rounded-xl border text-left transition-colors ${
                    selectedMethod === gw.id
                      ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B]'
                      : 'border-[#E2E8F0] dark:border-[#1E293B]'
                  }`}
                >
                  <div className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC] flex items-center gap-1">
                    {gw.id === 'card' && <CreditCard className="w-3.5 h-3.5 text-[#2563EB]" />}
                    <span>{gw.name}</span>
                  </div>
                  <div className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] mt-0.5 truncate">
                    {gw.merchantNumber}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Clear Step-by-Step Instructions & Limits */}
          {currentGateway && (
            <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {currentGateway.name} Payment Instructions
                </span>
                {selectedMethod !== 'card' && (
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentGateway.personalNumber);
                      addToast('Number Copied', `${currentGateway.personalNumber} copied.`, 'info');
                    }}
                    className="text-[#2563EB] font-mono font-semibold inline-flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy {currentGateway.personalNumber}</span>
                  </button>
                )}
              </div>
              <div className="font-mono text-[#475569] dark:text-[#94A3B8]">
                Merchant: {currentGateway.merchantNumber} · Personal Send Money: {currentGateway.personalNumber}
              </div>
              <p className="text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                {currentGateway.instructions}
              </p>
              <div className="pt-1.5 border-t border-[#E2E8F0] dark:border-[#1E293B] flex flex-wrap items-center justify-between gap-2 font-mono text-[11px] text-[#2563EB]">
                <span>Limits: ৳{minDeposit} – ৳{maxDeposit} BDT</span>
                <span>Fee: {depositFeePct}% (৳{depositFeeBdt})</span>
                <span className="text-[#10B981] font-bold">Net Credit: +৳{netCreditBdt} BDT</span>
              </div>
            </div>
          )}

          {/* Quick Amount Presets */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold">Quick Amount Selection (BDT)</label>
            <div className="flex flex-wrap gap-2">
              {[50, 100, 200, 500, 1000, 2500, 5000].map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmountBdt(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold border transition-colors ${
                    amountBdt === preset
                      ? 'bg-[#2563EB] text-white border-[#2563EB]'
                      : 'bg-[#F8FAFC] dark:bg-[#0B1120] border-[#E2E8F0] dark:border-[#1E293B]'
                  }`}
                >
                  ৳{preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Deposit Amount (Min ৳{minDeposit} – Max ৳{maxDeposit})
              </label>
              <input
                type="number"
                min={minDeposit}
                max={maxDeposit}
                required
                value={amountBdt}
                onChange={(e) => setAmountBdt(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            {selectedMethod !== 'card' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Sender {selectedMethod.toUpperCase()} Number (11 Digits)
                </label>
                <input
                  type="text"
                  required
                  value={senderNumber}
                  onChange={(e) => setSenderNumber(e.target.value)}
                  placeholder="017XXXXXXXX"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>
            )}
          </div>

          {channel === 'Manual' ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Transaction ID (TrxID from SMS / Mobile Banking App)
                </label>
                <input
                  type="text"
                  required
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  placeholder="e.g. BKS984012KL"
                  className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
                />
              </div>

              {/* Payment Screenshot Proof Upload */}
              <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-dashed border-[#CBD5E1] dark:border-[#334155] space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-[#2563EB]" />
                    <span>Upload Payment Screenshot Proof (Optional, speeds up verification)</span>
                  </label>
                  {screenshotDataUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotDataUrl('');
                        setScreenshotFileName('');
                      }}
                      className="text-[11px] text-[#EF4444] hover:underline"
                    >
                      Remove Screenshot
                    </button>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotFileChange}
                  className="block w-full text-xs text-[#475569] dark:text-[#94A3B8] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#2563EB]/10 file:text-[#2563EB] hover:file:bg-[#2563EB]/20"
                />
                {screenshotDataUrl && (
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={screenshotDataUrl}
                      alt="Payment proof preview"
                      className="w-16 h-16 object-cover rounded-lg border border-[#E2E8F0] dark:border-[#1E293B]"
                    />
                    <div className="text-xs font-mono text-[#10B981]">
                      ✓ Screenshot attached ({screenshotFileName || 'proof.png'})
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-[#10B981]/5 border border-[#10B981]/30 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  Server Webhook Signature Verification Mode
                </span>
                <span className="text-[11px] font-mono text-[#10B981]">
                  HMAC-SHA256 Signed Callback
                </span>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                The frontend never credits your balance directly. Instead, the server verifies the HMAC-SHA256 signature on the payment gateway callback before writing a credit entry to the ledger.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setGatewayOutcome('success')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left ${
                    gatewayOutcome === 'success'
                      ? 'bg-[#10B981] text-white border-[#10B981]'
                      : 'bg-white dark:bg-[#0B1120] border-[#E2E8F0] dark:border-[#1E293B]'
                  }`}
                >
                  ✓ Test Deposit Success (Valid Webhook)
                </button>
                <button
                  type="button"
                  onClick={() => setGatewayOutcome('fail')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border text-left ${
                    gatewayOutcome === 'fail'
                      ? 'bg-[#EF4444] text-white border-[#EF4444]'
                      : 'bg-white dark:bg-[#0B1120] border-[#E2E8F0] dark:border-[#1E293B]'
                  }`}
                >
                  ✕ Test Deposit Fail (Declined Callback)
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 min-h-[48px] py-3 px-4 rounded-xl btn-primary text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                {submitting
                  ? 'Processing on Server...'
                  : channel === 'Instant Gateway'
                  ? gatewayOutcome === 'success'
                    ? `Pay & Verify Webhook (+৳${netCreditBdt})`
                    : `Simulate Failed Gateway Deposit (৳${amountBdt})`
                  : `Submit Manual Deposit Request (৳${amountBdt})`}
              </span>
            </button>

            {lastIdempotencyKey && (
              <button
                type="button"
                onClick={(e) => handleSubmitDeposit(e, true)}
                className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[#2563EB] text-[#2563EB] text-xs font-mono font-bold hover:bg-[#2563EB]/10 transition-colors"
                title="Re-sends the exact same X-Idempotency-Key to verify duplicate click protection"
              >
                Test Duplicate Click (Idempotency)
              </button>
            )}
          </div>
        </form>

        {/* Deposit History */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl card-premium space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              My Deposit History ({myDeposits.length})
            </h2>
            <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
              Live Server Status
            </span>
          </div>
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {myDeposits.map((dep) => (
              <div
                key={dep.id}
                className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2 text-xs font-mono"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {dep.id} · {dep.method.toUpperCase()} ({dep.channel})
                  </span>
                  <WalletStatusBadge status={dep.status} />
                </div>
                <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span className="truncate">TrxID: {dep.transactionId}</span>
                  <span className="font-bold text-[#10B981]">
                    +৳{dep.netCreditBdt ?? dep.amountBdt} BDT
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#475569] dark:text-[#94A3B8]">
                  <span>Sender: {dep.senderNumber}</span>
                  <span>{dep.createdAt}</span>
                </div>
                {dep.screenshotUrl && (
                  <div className="pt-1 flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span className="text-[11px] text-[#2563EB] font-sans">
                      Payment proof screenshot attached
                    </span>
                  </div>
                )}
                {dep.adminReason && (
                  <div className="p-2 rounded-lg bg-[#EF4444]/10 text-[#EF4444] font-sans text-xs">
                    Note: {dep.adminReason}
                  </div>
                )}
                {dep.status === 'Pending' && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => cancelPendingWalletRequest('deposit', dep.id)}
                      className="px-3 py-1 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444] text-[#EF4444] hover:text-white font-sans font-semibold transition-colors"
                    >
                      Cancel Pending Request
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
   10. WITHDRAW PAGE (IMMEDIATE PENDING LOCK, RE-AUTH/OTP & HIGH-VALUE FLAGGING)
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
    (g) => g.active && g.id !== 'card'
  );
  const [method, setMethod] = useState<PaymentGatewayName>(
    activeGateways[0]?.id || 'bkash'
  );
  const [walletSource, setWalletSource] = useState<'incomeBalance' | 'mainBalance'>(
    'incomeBalance'
  );
  const [receiverNumber, setReceiverNumber] = useState(currentUser?.phone || '01712345678');
  const [amountBdt, setAmountBdt] = useState<number>(paymentSettings.minWithdrawBdt || 100);
  const [authConfirmCode, setAuthConfirmCode] = useState<string>('123456');
  const [lastWithdrawIdemKey, setLastWithdrawIdemKey] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <button
          onClick={() => navigate('login')}
          className="px-5 py-2.5 rounded-xl bg-[#2563EB] text-white text-sm font-semibold"
        >
          Sign In to Withdraw
        </button>
      </div>
    );
  }

  const minWithdraw = paymentSettings.minWithdrawBdt || 100;
  const maxWithdraw = paymentSettings.maxWithdrawBdt || 50000;
  const manualReviewThreshold = paymentSettings.manualReviewThresholdBdt || 5000;
  const processingTimeText =
    paymentSettings.processingTimeText || '30–120 Minutes (Instant Lock)';
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono font-bold text-[#10B981]">
            MIN: ৳{minWithdraw} · MAX: ৳{maxWithdraw} · FEE: {paymentSettings.withdrawFeePercent}% · PROCESSING: {processingTimeText}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC] mt-1">
            Withdraw Earnings to Mobile Banking
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
            Requested amounts are immediately locked as <span className="font-mono font-bold">Pending</span> in the server double-entry ledger to prevent double-spending.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start">
          <div className="px-3.5 py-2 rounded-xl bg-[#06B6D4]/10 border border-[#06B6D4]/30 text-xs font-mono text-[#06B6D4]">
            Locked Pending: ৳{lockedPendingBdt}
          </div>
          <button
            type="button"
            onClick={() => navigate('wallet')}
            className="px-4 py-2.5 rounded-xl btn-secondary text-xs font-semibold"
          >
            ← Back to Wallet
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <form
          onSubmit={(e) => handleWithdrawSubmit(e, false)}
          className="lg:col-span-7 p-5 sm:p-8 rounded-2xl card-premium space-y-5"
        >
          <div>
            <label className="block text-xs font-semibold mb-1.5">1. Select Wallet Source</label>
            <select
              value={walletSource}
              onChange={(e) =>
                setWalletSource(e.target.value as 'incomeBalance' | 'mainBalance')
              }
              className="w-full min-h-[44px] px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
            >
              <option value="incomeBalance">
                Income Balance (Available: ৳{currentUser.incomeBalance} BDT)
              </option>
              <option value="mainBalance">
                Main Balance (Available: ৳{currentUser.mainBalance} BDT)
              </option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1.5">
              2. Select Payout Method
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {activeGateways.map((gw) => (
                <button
                  key={gw.id}
                  type="button"
                  onClick={() => setMethod(gw.id)}
                  className={`min-h-[44px] p-3 rounded-xl border text-left text-xs font-bold transition-colors ${
                    method === gw.id
                      ? 'border-[#2563EB] bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-white'
                      : 'border-[#E2E8F0] dark:border-[#1E293B]'
                  }`}
                >
                  {gw.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Personal {method.toUpperCase()} Account Number (11 Digits)
              </label>
              <input
                type="text"
                required
                value={receiverNumber}
                onChange={(e) => setReceiverNumber(e.target.value)}
                placeholder="017XXXXXXXX"
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Withdraw Amount (Min ৳{minWithdraw} – Max ৳{maxWithdraw})
              </label>
              <input
                type="number"
                min={minWithdraw}
                max={maxWithdraw}
                required
                value={amountBdt}
                onChange={(e) => setAmountBdt(Number(e.target.value))}
                className="w-full min-h-[44px] px-3.5 py-2.5 text-sm font-mono rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B]"
              />
            </div>
          </div>

          {/* Security Confirmation (Account Password or 6-Digit Security PIN / OTP) */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2">
            <label className="block text-xs font-semibold flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-[#2563EB]" />
                <span>Security Confirmation: Account Password or 6-Digit OTP/PIN</span>
              </span>
              <span className="font-mono text-[11px] text-[#10B981]">
                Verified on Server before Lock
              </span>
            </label>
            <input
              type="password"
              required
              minLength={4}
              value={authConfirmCode}
              onChange={(e) => setAuthConfirmCode(e.target.value)}
              placeholder="Enter account password or 6-digit OTP (e.g. 123456)"
              className="w-full min-h-[42px] px-3.5 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
            />
            <p className="text-[11px] text-[#475569] dark:text-[#94A3B8]">
              Re-authentication protects your wallet against unauthorized session access. Enter your account password or a 6-digit security PIN (e.g. <span className="font-mono">123456</span>).
            </p>
          </div>

          {/* Fee, Net Payout, Processing Time & High-Value Warning */}
          <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2 text-xs font-mono">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>Available in Selected Wallet: ৳{availableInSelectedWallet} BDT</span>
              <span>Processing Fee ({paymentSettings.withdrawFeePercent}%): ৳{feeBdt}</span>
              <span className="font-bold text-[#10B981]">Net Payout: ৳{netAmount} BDT</span>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#475569] dark:text-[#94A3B8] pt-1 border-t border-[#E2E8F0] dark:border-[#1E293B]">
              <span>Expected Processing Time: {processingTimeText}</span>
              <span>Manual Review Threshold: ≥ ৳{manualReviewThreshold} BDT</span>
            </div>
            {Number(amountBdt) >= manualReviewThreshold && (
              <div className="p-2 rounded-lg bg-[#F59E0B]/15 text-[#F59E0B] font-sans flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>
                  This withdrawal is ≥ ৳{manualReviewThreshold} and will be automatically flagged for senior Admin compliance review.
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 min-h-[48px] py-3 px-4 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white text-xs sm:text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {submitting
                ? 'Locking Funds on Server...'
                : `Lock ৳${amountBdt} & Request Payout (Net ৳${netAmount})`}
            </button>

            {lastWithdrawIdemKey && (
              <button
                type="button"
                onClick={(e) => handleWithdrawSubmit(e, true)}
                className="min-h-[48px] px-4 py-2.5 rounded-xl border border-[#2563EB] text-[#2563EB] text-xs font-mono font-bold hover:bg-[#2563EB]/10 transition-colors"
                title="Re-sends the exact same X-Idempotency-Key to verify duplicate withdrawal protection"
              >
                Test Duplicate Click
              </button>
            )}
          </div>
        </form>

        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl card-premium space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Withdrawal History ({myWithdrawals.length})
            </h2>
            <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
              Atomic Lock & Refund
            </span>
          </div>
          <div className="space-y-3 max-h-[620px] overflow-y-auto pr-1">
            {myWithdrawals.map((w) => (
              <div
                key={w.id}
                className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#0B1120] border border-[#E2E8F0] dark:border-[#1E293B] space-y-2 text-xs font-mono"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {w.id} · {w.method.toUpperCase()} ({w.receiverNumber})
                  </span>
                  <WalletStatusBadge status={w.status} />
                </div>
                <div className="flex items-center justify-between text-[#475569] dark:text-[#94A3B8]">
                  <span>Gross: ৳{w.amountBdt} (Fee: ৳{w.feeBdt})</span>
                  <span className="font-bold text-[#2563EB]">Net: ৳{w.netAmountBdt} BDT</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-[#475569] dark:text-[#94A3B8]">
                  <span>Source: {w.walletSource}</span>
                  <span>{w.createdAt}</span>
                </div>
                {w.flaggedForReview && (
                  <div className="px-2.5 py-1 rounded bg-[#F59E0B]/15 text-[#F59E0B] font-sans text-[11px] flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>Flagged for Review: {w.flagReason || 'High-value withdrawal'}</span>
                  </div>
                )}
                {(w.adminNote || w.adminReason) && (
                  <div
                    className={`p-2 rounded-lg font-sans text-xs ${
                      w.status === 'Rejected'
                        ? 'bg-[#EF4444]/10 text-[#EF4444]'
                        : 'bg-[#10B981]/10 text-[#10B981]'
                    }`}
                  >
                    {w.adminReason || w.adminNote}
                  </div>
                )}
                {w.status === 'Pending' && (
                  <div className="pt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => cancelPendingWalletRequest('withdraw', w.id)}
                      className="px-3 py-1 rounded-lg bg-[#EF4444]/15 hover:bg-[#EF4444] text-[#EF4444] hover:text-white font-sans font-semibold transition-colors"
                    >
                      Cancel & Auto-Refund ৳{w.amountBdt}
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
   11. UNIFIED TRANSACTION HISTORY LEDGER
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
    'Admin Adjustment',
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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0F172A] dark:text-[#F8FAFC]">
            Unified Double-Entry Financial Ledger
          </h1>
          <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
            Complete audit trail of deposits, withdrawals, refunds, diamond orders, tournament fees, prizes, and task rewards.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="w-4 h-4 text-[#2563EB] shrink-0" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
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
            className="min-h-[40px] px-3.5 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-[#1E293B]"
          >
            {statuses.map((st) => (
              <option key={st} value={st}>
                {st === 'All' ? 'All Statuses' : st}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="p-5 sm:p-6 rounded-2xl card-premium overflow-x-auto">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8]">
              <th className="py-3 px-3">Date & Time</th>
              <th className="py-3 px-3">Type & Wallet</th>
              <th className="py-3 px-3">Method</th>
              <th className="py-3 px-3">Reference ID</th>
              <th className="py-3 px-3">Description</th>
              <th className="py-3 px-3 text-right">Amount</th>
              <th className="py-3 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#1E293B] text-xs font-mono">
            {filtered.map((trx) => (
              <tr key={trx.id} className="hover:bg-[#F8FAFC] dark:hover:bg-[#0B1120]">
                <td className="py-3 px-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                  {trx.createdAt}
                </td>
                <td className="py-3 px-3 font-sans">
                  <div className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                    {trx.type}
                  </div>
                  <div className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8]">
                    {trx.balanceType} Wallet ({trx.direction.toUpperCase()})
                  </div>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <span className="px-2 py-0.5 rounded bg-[#EFF6FF] dark:bg-[#1E293B] text-[#2563EB] dark:text-[#60A5FA] font-semibold">
                    {trx.method || 'Wallet'}
                  </span>
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <div className="font-bold text-[#2563EB]">{trx.referenceId}</div>
                  <div className="text-[10px] text-[#475569] dark:text-[#94A3B8]">{trx.id}</div>
                </td>
                <td className="py-3 px-3 font-sans text-[#475569] dark:text-[#94A3B8]">
                  {trx.description}
                </td>
                <td
                  className={`py-3 px-3 text-right font-bold whitespace-nowrap ${
                    trx.direction === 'credit' ? 'text-[#10B981]' : 'text-[#EF4444]'
                  }`}
                >
                  {trx.direction === 'credit' ? '+' : '-'}৳{trx.amountBdt}
                </td>
                <td className="py-3 px-3 whitespace-nowrap">
                  <WalletStatusBadge status={trx.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
