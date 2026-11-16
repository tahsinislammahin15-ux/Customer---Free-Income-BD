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
  const [regIgn, setRegIgn] = useState(currentUser?.ffIgn || 'BD_TAHSIN_99');
  const [regUid, setRegUid] = useState(currentUser?.ffUid || '2849103842');
  const [regTeam, setRegTeam] = useState('Banani Strikers');

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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header & Filter Bar */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-5 sm:space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={TOURNAMENT_IMAGE}
              alt="Free Fire Bangladesh Esports Custom Room Arena"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="hidden sm:block w-20 h-14 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E2D4A] shrink-0"
            />
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#F59E0B] font-semibold mb-1">
                REFEREE-MODERATED CUSTOM ROOMS · BD SERVER
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Free Fire Bangladesh Esports Tournaments
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
                Moderated custom rooms for Solo, Duo, Squad & Clash Squad 4v4. Entry fees deduct from your Main Wallet, and Room ID/Password unlock automatically for registered players.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#060A12] border border-[#E2E8F0] dark:border-[#1E2D4A] text-xs font-mono">
              Main Wallet:{' '}
              <span className="font-bold text-[#10B981]">
                ৳{currentUser?.mainBalance ?? 0} BDT
              </span>
            </div>
            <button
              onClick={() => navigate('deposit')}
              className="min-h-[40px] px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold whitespace-nowrap"
            >
              Deposit Entry Funds
            </button>
          </div>
        </div>

        {/* Mode & Type Filters */}
        <div className="pt-4 border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] overflow-x-auto max-w-full no-scrollbar">
            {(['All', 'Solo', 'Duo', 'Squad', 'Clash Squad'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setModeFilter(m)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  modeFilter === m
                    ? 'btn-primary text-white'
                    : 'text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] w-fit">
            {(['All', 'Free', 'Paid'] as const).map((tType) => (
              <button
                key={tType}
                onClick={() => setTypeFilter(tType)}
                className={`min-h-[36px] px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  typeFilter === tType
                    ? 'btn-primary text-white'
                    : 'text-[#475569] dark:text-[#94A3B8]'
                }`}
              >
                {tType} Entry
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tournament Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filtered.map((trn) => {
          const isRegistered =
            currentUser && trn.registeredPlayers.some((p) => p.userId === currentUser.id);
          const progressPct = Math.min(100, Math.round((trn.filledSlots / trn.totalSlots) * 100));

          return (
            <div
              key={trn.id}
              className="p-6 rounded-2xl card-premium card-premium-interactive flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                  <div>
                    <span className="font-bold text-[#06B6D4] uppercase">{trn.status}</span>
                    <span> · </span>
                    <span className="text-[#0B1120] dark:text-[#F8FAFC] font-semibold">{trn.mode}</span>
                    <span> · </span>
                    <span>Map: {trn.map}</span>
                    <span> · </span>
                    <span>{trn.id}</span>
                  </div>
                  <span className="font-semibold text-[#F59E0B]">
                    {trn.startTime}
                  </span>
                </div>

                <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                  {language === 'bn' ? trn.titleBn : trn.title}
                </h2>

                {/* Prize & Fee Breakdown */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 p-3.5 sm:p-4 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]">
                  <div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8]">Prize Pool</div>
                    <div className="font-display text-base sm:text-lg font-bold font-mono text-[#F59E0B]">
                      ৳{trn.prizePool}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8]">Per Kill</div>
                    <div className="font-display text-base sm:text-lg font-bold font-mono text-[#10B981]">
                      ৳{trn.perKillPrize}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8]">Entry Fee</div>
                    <div className="font-display text-base sm:text-lg font-bold font-mono text-[#2563EB] dark:text-[#60A5FA]">
                      {trn.entryFee === 0 ? 'FREE' : `৳${trn.entryFee}`}
                    </div>
                  </div>
                </div>

                {/* Rules */}
                <ul className="space-y-1 text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {trn.rules.map((r, i) => (
                    <li key={i}>• {r}</li>
                  ))}
                </ul>

                {/* Room ID & Password Box (Revealed ONLY to registered players) */}
                {trn.status === 'Completed' && trn.winnerName ? (
                  <div className="p-3.5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#F59E0B]/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Trophy className="w-4 h-4 text-[#F59E0B] shrink-0" />
                      <span className="font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                        Champion: {trn.winnerName} (UID: {trn.winnerUid})
                      </span>
                    </div>
                    <span className="font-mono text-[#10B981] font-bold">Prize Paid</span>
                  </div>
                ) : isRegistered ? (
                  <div className="p-4 rounded-xl bg-[#EFF6FF] dark:bg-[#1E293B] border border-[#2563EB] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <KeyRound className="w-4 h-4 text-[#2563EB] shrink-0" />
                      <div>
                        <div className="font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                          Unlocked Custom Room Credentials
                        </div>
                        <div className="font-mono text-xs text-[#2563EB] dark:text-[#06B6D4]">
                          Room ID: {trn.roomId || 'Pending'} · Password: {trn.roomPassword || 'Pending'}
                        </div>
                      </div>
                    </div>
                    {trn.roomId && (
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(trn.roomId!);
                          addToast('Room ID Copied', `Copied Room ID ${trn.roomId} to clipboard.`, 'info');
                        }}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-lg btn-primary text-xs font-semibold inline-flex items-center justify-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Room ID</span>
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] flex items-center gap-2 text-xs text-[#475569] dark:text-[#94A3B8]">
                    <Lock className="w-4 h-4 text-[#94A3B8] shrink-0" />
                    <span>
                      Custom Room ID & Password are encrypted and automatically reveal here once you register.
                    </span>
                  </div>
                )}
              </div>

              {/* Slots & CTA */}
              <div className="space-y-3 pt-3 border-t border-[#DCE4F0] dark:border-[#1E293B]">
                <div className="flex items-center justify-between text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Registered Roster: {trn.filledSlots} / {trn.totalSlots} slots
                    </span>
                  </span>
                  <span>{progressPct}% Full</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#DCE4F0] dark:bg-[#1E293B] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-[#06B6D4] rounded-full"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-1">
                  <span className="text-xs text-[#475569] dark:text-[#94A3B8]">
                    {trn.registeredPlayers.length} verified FIBD profiles visible
                  </span>
                  {trn.status === 'Completed' ? (
                    <span className="text-xs font-mono font-bold text-[#94A3B8]">
                      Match Concluded
                    </span>
                  ) : isRegistered ? (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#10B981]">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Registered</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => setSelectedTrn(trn)}
                      className="min-h-[42px] px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold"
                    >
                      Register Now ({trn.entryFee === 0 ? 'Free' : `৳${trn.entryFee}`})
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
            className="max-w-md w-full rounded-2xl card-premium p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
              Tournament Slot Registration
            </h3>
            <div className="p-3.5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] text-xs space-y-1">
              <div className="font-bold text-sm text-[#0B1120] dark:text-[#F8FAFC]">
                {selectedTrn.title}
              </div>
              <div className="font-mono text-[#475569] dark:text-[#94A3B8]">
                Mode: {selectedTrn.mode} · Entry Fee:{' '}
                {selectedTrn.entryFee === 0 ? 'FREE' : `৳${selectedTrn.entryFee} BDT`}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Free Fire In-Game Name (IGN)
              </label>
              <input
                type="text"
                required
                value={regIgn}
                onChange={(e) => setRegIgn(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 text-xs font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Free Fire Numeric Player UID
              </label>
              <input
                type="text"
                required
                value={regUid}
                onChange={(e) => setRegUid(e.target.value)}
                className="w-full min-h-[42px] px-3 py-2 text-xs font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>

            {selectedTrn.mode !== 'Solo' && (
              <div>
                <label className="block text-xs font-semibold mb-1">
                  Squad / Duo Team Name
                </label>
                <input
                  type="text"
                  required
                  value={regTeam}
                  onChange={(e) => setRegTeam(e.target.value)}
                  className="w-full min-h-[42px] px-3 py-2 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
                />
              </div>
            )}

            <div className="p-3 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] text-xs text-[#475569] dark:text-[#94A3B8] flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-[#F59E0B] shrink-0 mt-0.5" />
              <span>
                By registering, you agree to join with the exact UID above. Emulators or hacks result in permanent account ban.
              </span>
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTrn(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl btn-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[42px] px-5 py-2 rounded-xl btn-primary text-xs font-semibold"
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
