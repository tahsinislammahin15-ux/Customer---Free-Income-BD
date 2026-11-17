import React, { useState } from 'react';
import { Trophy, Users, Lock, KeyRound, CheckCircle2, ShieldAlert, Copy } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TOURNAMENT_IMAGE } from '../data/seedData';
import { Tournament } from '../types';

export const TournamentsPage: React.FC = () => {
  const {
    tournaments,
    currentUser,
    language,
    joinTournament,
    addToast,
    navigate,
  } = useApp();

  const [modeFilter, setModeFilter] = useState<'All' | 'Solo' | 'Duo' | 'Squad' | 'Clash Squad'>('All');
  const [typeFilter, setTypeFilter] = useState<'All' | 'Free' | 'Paid'>('All');

  const [selectedTrn, setSelectedTrn] = useState<Tournament | null>(null);
  const [regIgn, setRegIgn] = useState(currentUser?.ffIgn || '');
  const [regUid, setRegUid] = useState(currentUser?.ffUid || '');
  const [regTeam, setRegTeam] = useState('');

  const handleOpenJoinModal = (trn: Tournament) => {
    if (!currentUser) {
      addToast('Sign In Required', 'Please sign in or register to join a tournament.', 'warning');
      navigate('login');
      return;
    }
    setRegIgn(currentUser.ffIgn || '');
    setRegUid(currentUser.ffUid || '');
    setRegTeam('');
    setSelectedTrn(trn);
  };

  const filtered = tournaments.filter((trn) => {
    if (modeFilter !== 'All' && trn.mode !== modeFilter) return false;
    if (typeFilter !== 'All' && trn.type !== typeFilter) return false;
    return true;
  });

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrn) return;
    const ok = joinTournament(
      selectedTrn.id,
      regIgn.trim(),
      regUid.trim(),
      selectedTrn.mode !== 'Solo' ? regTeam.trim() : undefined
    );
    if (ok) {
      setSelectedTrn(null);
    }
  };

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      {/* Header & Filter Card */}
      <div className="zvy-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={TOURNAMENT_IMAGE}
              alt="Free Fire Bangladesh Esports Custom Room Arena"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] dark:border-[#1E293B] shrink-0"
            />
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#3B0A0A] dark:text-[#FCA5A5] uppercase">
                REFEREE-MODERATED CUSTOM ROOMS · BD SERVER
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                Free Fire Esports Tournaments
              </h1>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                Solo, Duo, Squad & Clash Squad rooms. Room ID & Password unlock immediately upon joining.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-mono">
              Wallet:{' '}
              <span className="font-extrabold text-[#059669]">
                ৳{currentUser?.mainBalance ?? 0} BDT
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('deposit')}
              className="h-[38px] px-3.5 rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-semibold whitespace-nowrap transition-colors"
            >
              + Add Money
            </button>
          </div>
        </div>

        {/* Mode & Entry Type Segmented Filters */}
        <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F3F4F6] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] overflow-x-auto no-scrollbar">
            {(['All', 'Solo', 'Duo', 'Squad', 'Clash Squad'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setModeFilter(m)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap shrink-0 ${
                  modeFilter === m
                    ? 'bg-[#3B0A0A] text-white'
                    : 'text-[#4B5563] dark:text-[#94A3B8]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F3F4F6] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] w-fit">
            {(['All', 'Free', 'Paid'] as const).map((tType) => (
              <button
                key={tType}
                type="button"
                onClick={() => setTypeFilter(tType)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors whitespace-nowrap ${
                  typeFilter === tType
                    ? 'bg-[#0D3B66] text-white'
                    : 'text-[#4B5563] dark:text-[#94A3B8]'
                }`}
              >
                {tType} Entry
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((trn, idx) => {
          const isRegistered =
            currentUser && trn.registeredPlayers.some((p) => p.userId === currentUser.id);
          const progressPct = Math.min(100, Math.round((trn.filledSlots / trn.totalSlots) * 100));

          return (
            <div
              key={trn.id}
              className="zvy-card p-4 sm:p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Card Step Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="step-badge shrink-0">{idx + 1}</span>
                    <div className="text-[11px] font-mono text-[#6B7280] truncate">
                      <span className="font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5] uppercase">
                        {trn.mode}
                      </span>{' '}
                      · Map: {trn.map}
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase shrink-0 ${
                      trn.status === 'Completed'
                        ? 'bg-[#E5E7EB] text-[#4B5563]'
                        : 'bg-[#00C853] text-white'
                    }`}
                  >
                    {trn.status}
                  </span>
                </div>

                <div>
                  <h2 className="text-base font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                    {language === 'bn' ? trn.titleBn : trn.title}
                  </h2>
                  <div className="text-[11px] font-mono font-bold text-[#D97706] mt-0.5">
                    Match Time: {trn.startTime} · ID: {trn.id}
                  </div>
                </div>

                {/* Prize Pool / Per Kill / Entry Fee Matrix */}
                <div className="grid grid-cols-3 gap-2 p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-center">
                  <div>
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase">
                      Prize Pool
                    </div>
                    <div className="text-sm sm:text-base font-extrabold font-mono text-[#D97706]">
                      ৳{trn.prizePool}
                    </div>
                  </div>
                  <div className="border-x border-[#E5E7EB] dark:border-[#1E293B]">
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase">
                      Per Kill
                    </div>
                    <div className="text-sm sm:text-base font-extrabold font-mono text-[#059669]">
                      ৳{trn.perKillPrize}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase">
                      Entry Fee
                    </div>
                    <div className="text-sm sm:text-base font-extrabold font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">
                      {trn.entryFee === 0 ? 'FREE' : `৳${trn.entryFee}`}
                    </div>
                  </div>
                </div>

                {/* Match Rules */}
                <ul className="space-y-1 text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
                  {trn.rules.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>

                {/* Room ID & Password Box */}
                {trn.status === 'Completed' && trn.winnerName ? (
                  <div className="p-3 rounded-xl bg-[#FFFBEB] dark:bg-[#1E293B] border border-[#F59E0B] flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#D97706] shrink-0" />
                      <span className="font-bold text-[#111827] dark:text-white">
                        Winner: {trn.winnerName} (UID: {trn.winnerUid})
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-[#00C853] text-white text-[10px] font-extrabold">
                      PAID
                    </span>
                  </div>
                ) : isRegistered ? (
                  <div className="p-3 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#0D3B66] flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs min-w-0">
                      <KeyRound className="w-4 h-4 text-[#0D3B66] dark:text-[#60A5FA] shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-[#111827] dark:text-white text-[11px]">
                          Unlocked Room Credentials
                        </div>
                        <div className="font-mono text-xs font-extrabold text-[#0D3B66] dark:text-[#60A5FA] truncate">
                          ID: {trn.roomId || 'Pending'} · Pass: {trn.roomPassword || 'Pending'}
                        </div>
                      </div>
                    </div>
                    {trn.roomId && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(trn.roomId!);
                          addToast('Room ID Copied', `Copied Room ID ${trn.roomId}.`, 'info');
                        }}
                        className="px-3 py-1.5 rounded-lg bg-[#0D3B66] text-white text-[11px] font-bold inline-flex items-center gap-1 shrink-0"
                      >
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-2.5 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center gap-2 text-[11px] text-[#6B7280]">
                    <Lock className="w-3.5 h-3.5 shrink-0" />
                    <span>Room ID & Password unlock here immediately after joining.</span>
                  </div>
                )}
              </div>

              {/* Slots Bar & CTA */}
              <div className="space-y-2.5 pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B]">
                <div className="flex items-center justify-between text-[11px] font-mono text-[#6B7280]">
                  <span className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5" />
                    <span>
                      Slots: {trn.filledSlots} / {trn.totalSlots}
                    </span>
                  </span>
                  <span className="font-bold">{progressPct}% Full</span>
                </div>

                <div className="w-full h-2 rounded-full bg-[#E5E7EB] dark:bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-[#3B0A0A] rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-[#6B7280]">
                    {trn.registeredPlayers.length} verified players joined
                  </span>
                  {trn.status === 'Completed' ? (
                    <span className="text-xs font-mono font-bold text-[#6B7280]">
                      Match Ended
                    </span>
                  ) : isRegistered ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#00C853] text-white text-[11px] font-extrabold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>REGISTERED</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleOpenJoinModal(trn)}
                      className="h-[38px] px-4 rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold transition-colors"
                    >
                      Join Match ({trn.entryFee === 0 ? 'Free' : `৳${trn.entryFee}`})
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {selectedTrn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleRegisterSubmit}
            className="max-w-md w-full zvy-card p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="step-badge">1</span>
              <h3 className="text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                TOURNAMENT REGISTRATION
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-xs space-y-0.5">
              <div className="font-bold text-[#111827] dark:text-white">
                {selectedTrn.title}
              </div>
              <div className="font-mono text-[#6B7280]">
                Mode: {selectedTrn.mode} · Entry:{' '}
                <span className="font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5]">
                  {selectedTrn.entryFee === 0 ? 'FREE' : `৳${selectedTrn.entryFee} BDT`}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111827] dark:text-gray-200 mb-1">
                Free Fire In-Game Name (IGN)
              </label>
              <input
                type="text"
                required
                value={regIgn}
                onChange={(e) => setRegIgn(e.target.value)}
                placeholder="Enter your Free Fire IGN"
                className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-white placeholder:text-gray-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[#111827] dark:text-gray-200 mb-1">
                Free Fire Numeric UID
              </label>
              <input
                type="text"
                required
                value={regUid}
                onChange={(e) => setRegUid(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your numeric Player UID"
                className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-white placeholder:text-gray-400"
              />
            </div>

            {selectedTrn.mode !== 'Solo' && (
              <div>
                <label className="block text-xs font-medium text-[#111827] dark:text-gray-200 mb-1">
                  Squad / Duo Team Name
                </label>
                <input
                  type="text"
                  required
                  value={regTeam}
                  onChange={(e) => setRegTeam(e.target.value)}
                  placeholder="Enter squad or duo team name"
                  className="w-full h-[40px] px-3 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B] text-[#111827] dark:text-white placeholder:text-gray-400"
                />
              </div>
            )}

            <div className="p-2.5 rounded-xl bg-[#FFFBEB] dark:bg-[#1E293B] border border-[#FDE68A] text-[11px] text-[#92400E] dark:text-[#FDE68A] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Join using the exact registered UID. Emulators or scripts result in ban.</span>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedTrn(null)}
                className="h-[40px] px-4 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-[40px] px-5 rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold transition-colors"
              >
                Confirm & Unlock Room ID
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
