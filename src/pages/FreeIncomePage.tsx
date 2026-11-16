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
    <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Header & Transparent Reward Terms Banner */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-4">
            <img
              src={TASK_IMAGE}
              alt="Verified Online Micro-Tasks and Referral Rewards"
              loading="lazy"
              referrerPolicy="no-referrer"
              className="hidden sm:block w-20 h-14 rounded-xl object-cover border border-[#E2E8F0] dark:border-[#1E2D4A] shrink-0"
            />
            <div>
              <div className="text-xs font-mono uppercase tracking-[0.14em] text-[#10B981] font-semibold mb-1">
                TRANSPARENT MICRO-TASK & REFERRAL LEDGER
              </div>
              <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Compliant Online Tasks & Referral Rewards
              </h1>
              <p className="text-sm text-[#475569] dark:text-[#94A3B8] mt-1">
                Complete verified community tasks, ISP latency surveys, and partner campaigns. Approved rewards credit your Income Wallet.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#060A12] border border-[#E2E8F0] dark:border-[#1E2D4A] text-xs font-mono">
              Income Balance:{' '}
              <span className="font-bold text-[#10B981]">
                ৳{currentUser?.incomeBalance ?? 0} BDT
              </span>
            </div>
            <button
              onClick={() => navigate('withdraw')}
              className="min-h-[40px] px-4 py-2.5 rounded-xl btn-emerald text-xs font-semibold whitespace-nowrap"
            >
              Withdraw (Min ৳{paymentSettings.minWithdrawBdt})
            </button>
          </div>
        </div>

        {/* Compliance & Policy Disclosure */}
        <div className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#060A12] border border-[#E2E8F0] dark:border-[#1E2D4A] flex items-start gap-3 text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-[#0F172A] dark:text-[#F8FAFC]">
              Fair Reward & Partner Compliance Notice:
            </span>{' '}
            Free Income BD does not offer passive investment schemes or guaranteed income. All rewards are funded by promotional campaigns and research surveys, subject to manual proof verification. Minimum withdrawal is ৳{paymentSettings.minWithdrawBdt} via bKash, Nagad, Rocket, or Upay.
          </div>
        </div>
      </div>

      {/* Referral Program Card */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-7 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider font-semibold text-[#2563EB] dark:text-[#60A5FA] flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>VERIFIED PLAYER REFERRAL PROGRAM</span>
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
            Invite Bangladeshi Free Fire Friends & Earn ৳{paymentSettings.referralBonusBdt} Per Verified Sign-Up
          </h2>
          <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed">
            Share your unique referral link. When a teammate registers using your code, you receive ৳{paymentSettings.referralBonusBdt} in your Income Balance and they receive a ৳15 starter reward.
          </p>
        </div>
        <div className="lg:col-span-5 flex flex-col sm:flex-row gap-2.5">
          <input
            type="text"
            readOnly
            value={referralUrl}
            className="flex-1 min-h-[44px] px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
          />
          <button
            onClick={() => {
              navigator.clipboard.writeText(referralUrl);
              addToast('Referral Link Copied', 'Share this link with your squad!', 'success');
            }}
            className="min-h-[44px] px-4 py-2.5 rounded-xl btn-primary text-xs font-semibold inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy Link ({currentUser?.referralCount ?? 0} Invited)</span>
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl card-premium overflow-x-auto max-w-full no-scrollbar">
        {(
          ['All', 'Task Complete', 'Special Tasks', 'Sponsored Content', 'Bonus Rewards'] as const
        ).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`min-h-[38px] px-4 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
              categoryFilter === cat
                ? 'btn-primary text-white'
                : 'text-[#475569] dark:text-[#94A3B8]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active Tasks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeTasks.map((task) => {
          const userSub = currentUser
            ? taskSubmissions.find(
                (s) => s.taskId === task.id && s.userId === currentUser.id
              )
            : undefined;

          return (
            <div
              key={task.id}
              className="p-6 rounded-2xl card-premium card-premium-interactive flex flex-col justify-between space-y-5"
            >
              <div className="space-y-3">
                <div className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
                  <span className="font-semibold text-[#2563EB] dark:text-[#60A5FA]">{task.category}</span>
                  <span> · </span>
                  <span>Est. {task.estimatedTime}</span>
                  <span> · </span>
                  <span>{task.completionsCount} done</span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                  {language === 'bn' ? task.titleBn : task.title}
                </h3>

                <p className="text-xs text-[#475569] dark:text-[#94A3B8] leading-relaxed">
                  {task.description}
                </p>

                <div className="p-3.5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] space-y-1 text-xs text-[#475569] dark:text-[#94A3B8]">
                  <div className="font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                    Verification Requirements:
                  </div>
                  {task.requirements.map((req, i) => (
                    <div key={i}>• {req}</div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#DCE4F0] dark:border-[#1E293B] space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-[#475569] dark:text-[#94A3B8]">
                      Verified Reward
                    </div>
                    <div className="font-display text-xl font-bold font-mono text-[#10B981]">
                      +৳{task.rewardBdt} BDT
                    </div>
                  </div>
                  <a
                    href={sanitizeSafeUrl(task.externalLink) || PUBLIC_ENV.SITE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[38px] px-3.5 py-1.5 rounded-xl btn-secondary text-xs font-semibold inline-flex items-center gap-1"
                  >
                    <span>Open Link</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {userSub ? (
                  <div className="w-full py-2.5 px-3 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] text-center text-xs font-mono font-bold">
                    Submission Status:{' '}
                    <span
                      className={
                        userSub.status === 'Approved'
                          ? 'text-[#10B981]'
                          : userSub.status === 'Rejected'
                          ? 'text-[#EF4444]'
                          : 'text-[#F59E0B]'
                      }
                    >
                      {userSub.status}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setSelectedTask(task)}
                    className="w-full min-h-[44px] py-2.5 px-4 rounded-xl btn-emerald text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Submit Verification Proof</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Task Submission History */}
      <div className="p-6 sm:p-8 rounded-2xl card-premium space-y-4">
        <h2 className="font-display text-lg sm:text-xl font-bold text-[#0B1120] dark:text-[#F8FAFC]">
          Task Verification History
        </h2>
        <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-[#DCE4F0] dark:border-[#1E293B] text-xs text-[#475569] dark:text-[#94A3B8]">
                <th className="py-3 px-3">Submission ID</th>
                <th className="py-3 px-3">Task Title</th>
                <th className="py-3 px-3">Proof Note / Link</th>
                <th className="py-3 px-3 text-right">Reward</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Submitted At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4F0] dark:divide-[#1E293B] text-xs font-mono">
              {mySubmissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-[#F4F7FB] dark:hover:bg-[#070B14]">
                  <td className="py-3 px-3 font-bold text-[#2563EB] dark:text-[#60A5FA] whitespace-nowrap">{sub.id}</td>
                  <td className="py-3 px-3 font-sans font-semibold text-[#0B1120] dark:text-[#F8FAFC]">
                    {sub.taskTitle}
                  </td>
                  <td className="py-3 px-3 font-sans text-[#475569] dark:text-[#94A3B8]">
                    {sub.proofNote}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-[#10B981]">
                    +৳{sub.rewardBdt}
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-bold ${
                        sub.status === 'Approved'
                          ? 'text-[#10B981]'
                          : sub.status === 'Rejected'
                          ? 'text-[#EF4444]'
                          : 'text-[#F59E0B]'
                      }`}
                    >
                      {sub.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-[#475569] dark:text-[#94A3B8] whitespace-nowrap">
                    {sub.submittedAt}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Proof Submission Modal */}
      {selectedTask && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleProofSubmit}
            className="max-w-md w-full rounded-2xl card-premium p-6 space-y-4 shadow-2xl"
          >
            <h3 className="font-display text-lg font-bold text-[#0B1120] dark:text-[#F8FAFC]">
              Submit Task Verification Proof
            </h3>
            <div className="p-3.5 rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B] text-xs space-y-1">
              <div className="font-bold text-[#0B1120] dark:text-[#F8FAFC]">
                {selectedTask.title}
              </div>
              <div className="font-mono text-[#10B981] font-bold">
                Reward upon approval: +৳{selectedTask.rewardBdt} BDT
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Screenshot Link or Profile Proof URL
              </label>
              <input
                type="url"
                required
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                placeholder="https://prnt.sc/... or social profile link"
                className="w-full min-h-[42px] px-3 py-2 text-xs font-mono rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Verification Note (Username / Reference Code)
              </label>
              <textarea
                rows={3}
                required
                value={proofNote}
                onChange={(e) => setProofNote(e.target.value)}
                placeholder="Enter your Telegram @username, survey reference code, or comment details..."
                className="w-full px-3 py-2 text-xs rounded-xl bg-[#F4F7FB] dark:bg-[#070B14] border border-[#DCE4F0] dark:border-[#1E293B]"
              />
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setSelectedTask(null)}
                className="min-h-[42px] px-4 py-2 rounded-xl btn-secondary text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="min-h-[42px] px-5 py-2 rounded-xl btn-emerald text-xs font-semibold flex items-center gap-1.5"
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
