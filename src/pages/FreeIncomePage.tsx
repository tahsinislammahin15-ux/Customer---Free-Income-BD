import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
  Send,
  ShieldCheck,
  Copy,
  Users,
} from 'lucide-react';
import { PUBLIC_ENV } from '../config/env';
import { useApp } from '../context/AppContext';
import { TASK_IMAGE } from '../data/seedData';
import { IncomeTask } from '../types';
import { sanitizeSafeUrl } from '../utils/security';

export const FreeIncomePage: React.FC = () => {
  const {
    tasks,
    taskSubmissions,
    currentUser,
    language,
    submitTaskProof,
    paymentSettings,
    addToast,
    navigate,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<
    'All' | 'Task Complete' | 'Special Tasks' | 'Sponsored Content' | 'Bonus Rewards'
  >('All');
  const [selectedTask, setSelectedTask] = useState<IncomeTask | null>(null);
  const [proofUrl, setProofUrl] = useState('');
  const [proofNote, setProofNote] = useState('');

  const activeTasks = tasks.filter(
    (item) =>
      item.active && (categoryFilter === 'All' || item.category === categoryFilter)
  );

  const mySubmissions = currentUser
    ? taskSubmissions.filter((s) => s.userId === currentUser.id)
    : taskSubmissions;

  const referralUrl = `${window.location.origin}/?ref=${
    currentUser?.referralCode || 'TAHSINBD'
  }`;

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;
    const ok = submitTaskProof(selectedTask.id, proofUrl.trim(), proofNote.trim());
    if (ok) {
      setSelectedTask(null);
      setProofUrl('');
      setProofNote('');
    }
  };

  return (
    <div className="max-w-[960px] mx-auto px-3 sm:px-5 py-6 space-y-4">
      {/* Header & Income Wallet Card */}
      <div className="zvy-card p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <img
              src={TASK_IMAGE}
              alt="Verified Online Micro-Tasks and Referral Rewards"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-xl object-cover border border-[#E5E7EB] dark:border-[#1E293B] shrink-0"
            />
            <div className="space-y-0.5">
              <div className="text-[11px] font-bold text-[#059669] uppercase">
                FREE INCOME & REFERRAL REWARDS · BDT WALLET
              </div>
              <h1 className="text-lg sm:text-2xl font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                Verified Tasks & Referral Rewards
              </h1>
              <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
                Complete verified community tasks to earn BDT in your Income Balance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3 py-2 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-xs font-mono">
              Income:{' '}
              <span className="font-extrabold text-[#059669]">
                ৳{currentUser?.incomeBalance ?? 0} BDT
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('withdraw')}
              className="h-[38px] px-3.5 rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-semibold whitespace-nowrap transition-colors"
            >
              Withdraw (Min ৳{paymentSettings.minWithdrawBdt})
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-start gap-2 text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
          <ShieldCheck className="w-4 h-4 text-[#00C853] shrink-0 mt-0.5" />
          <span>
            <strong>Reward Policy:</strong> All rewards require genuine proof verification before payout via bKash, Nagad, Rocket, or Upay, or 0%-fee transfer to Main Wallet for Diamond Top-Ups.
          </span>
        </div>
      </div>

      {/* Step 1: Referral Card */}
      <div className="zvy-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="step-badge">1</span>
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase flex items-center gap-1.5">
            <Users className="w-4 h-4 text-[#3B0A0A] dark:text-[#FCA5A5]" />
            <span>INVITE FRIENDS & EARN ৳{paymentSettings.referralBonusBdt} BDT PER SIGN-UP</span>
          </h2>
        </div>

        <p className="text-xs text-[#6B7280] dark:text-[#94A3B8]">
          Share your referral link with Free Fire squadmates. You earn ৳{paymentSettings.referralBonusBdt} BDT and your friend receives a ৳15 starter reward.
        </p>

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="flex-1 h-[40px] px-3 text-xs font-mono rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
          />
          <button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(referralUrl);
              addToast('Referral Link Copied', 'Share this link with your friends!', 'success');
            }}
            className="h-[40px] px-4 rounded-xl bg-[#3B0A0A] hover:bg-[#4C0E0E] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link ({currentUser?.referralCount ?? 0} Invited)</span>
          </button>
        </div>
      </div>

      {/* Category Filter Strip */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white dark:bg-[#111827] border border-[#E5E7EB] dark:border-[#1E293B] overflow-x-auto no-scrollbar">
        {(
          ['All', 'Task Complete', 'Special Tasks', 'Sponsored Content', 'Bonus Rewards'] as const
        ).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors whitespace-nowrap shrink-0 ${
              categoryFilter === cat
                ? 'bg-[#3B0A0A] text-white'
                : 'text-[#4B5563] dark:text-[#94A3B8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Step 2: Active Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeTasks.map((task) => {
          const userSub = currentUser
            ? taskSubmissions.find(
                (s) => s.taskId === task.id && s.userId === currentUser.id
              )
            : undefined;

          return (
            <div
              key={task.id}
              className="zvy-card p-4 sm:p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="font-extrabold text-[#3B0A0A] dark:text-[#FCA5A5] uppercase">
                    {task.category}
                  </span>
                  <span className="text-[#6B7280]">{task.estimatedTime}</span>
                </div>

                <h3 className="text-base font-extrabold text-[#111827] dark:text-[#F8FAFC]">
                  {language === 'bn' ? task.titleBn : task.title}
                </h3>

                <p className="text-xs text-[#4B5563] dark:text-[#94A3B8] leading-relaxed">
                  {task.description}
                </p>

                <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] space-y-1 text-[11px] text-[#4B5563] dark:text-[#94A3B8]">
                  <div className="font-bold text-[#111827] dark:text-white">
                    Requirements:
                  </div>
                  {task.requirements.map((req, i) => (
                    <div key={i}>• {req}</div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-[#E5E7EB] dark:border-[#1E293B] space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[10px] font-semibold text-[#6B7280] uppercase">
                      Reward
                    </div>
                    <div className="text-lg font-extrabold font-mono text-[#059669]">
                      +৳{task.rewardBdt} BDT
                    </div>
                  </div>
                  <a
                    href={sanitizeSafeUrl(task.externalLink) || PUBLIC_ENV.SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-[34px] px-3 rounded-lg border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold inline-flex items-center gap-1 hover:border-[#3B0A0A]"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {userSub ? (
                  <div className="w-full py-2 px-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-center text-xs font-bold">
                    Status:{' '}
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ml-1 ${
                        userSub.status === 'Approved'
                          ? 'bg-[#00C853] text-white'
                          : userSub.status === 'Rejected'
                          ? 'bg-[#FEE2E2] text-[#B91C1C]'
                          : 'bg-[#FEF3C7] text-[#B45309]'
                      }`}
                    >
                      {userSub.status}
                    </span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setSelectedTask(task)}
                    className="w-full h-[40px] rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Proof</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Step 3: Submission History List */}
      <div className="zvy-card p-4 sm:p-5 space-y-3">
        <div className="flex items-center gap-2">
          <span className="step-badge">2</span>
          <h2 className="text-sm sm:text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
            TASK VERIFICATION HISTORY ({mySubmissions.length})
          </h2>
        </div>

        <div className="space-y-2">
          {mySubmissions.map((sub) => (
            <div
              key={sub.id}
              className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] flex items-center justify-between gap-3 text-xs"
            >
              <div className="min-w-0 space-y-0.5">
                <div className="font-bold text-[#111827] dark:text-white truncate">
                  {sub.taskTitle}
                </div>
                <div className="text-[11px] text-[#6B7280] truncate">{sub.proofNote}</div>
                <div className="text-[10px] font-mono text-[#9CA3AF]">
                  {sub.id} · {sub.submittedAt}
                </div>
              </div>

              <div className="text-right shrink-0 space-y-1">
                <div className="font-mono font-extrabold text-[#059669]">
                  +৳{sub.rewardBdt} BDT
                </div>
                <span
                  className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    sub.status === 'Approved'
                      ? 'bg-[#00C853] text-white'
                      : sub.status === 'Rejected'
                      ? 'bg-[#FEE2E2] text-[#B91C1C]'
                      : 'bg-[#FEF3C7] text-[#B45309]'
                  }`}
                >
                  {sub.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Proof Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleProofSubmit}
            className="max-w-md w-full zvy-card p-5 sm:p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-center gap-2">
              <span className="step-badge">1</span>
              <h3 className="text-base font-extrabold text-[#111827] dark:text-[#F8FAFC] uppercase">
                SUBMIT TASK PROOF
              </h3>
            </div>

            <div className="p-3 rounded-xl bg-[#FAFAFA] dark:bg-[#0B1120] border border-[#E5E7EB] dark:border-[#1E293B] text-xs space-y-0.5">
              <div className="font-bold text-[#111827] dark:text-white">
                {selectedTask.title}
              </div>
              <div className="font-mono text-[#059669] font-extrabold">
                Reward: +৳{selectedTask.rewardBdt} BDT
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Screenshot or Proof URL
              </label>
              <input
                type="url"
                required
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://prnt.sc/... or profile link"
                className="w-full h-[40px] px-3 text-xs font-mono rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1">
                Verification Note (Username / Reference Code)
              </label>
              <textarea
                rows={3}
                required
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="Enter your @username or reference code..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-white dark:bg-[#0B1120] border border-[#D1D5DB] dark:border-[#1E293B]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="h-[40px] px-4 rounded-xl border border-[#D1D5DB] dark:border-[#1E293B] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-[40px] px-5 rounded-xl bg-[#0D3B66] hover:bg-[#092B4C] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit Proof</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
