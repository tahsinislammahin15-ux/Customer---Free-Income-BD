import React, { useState } from 'react';
import { Headphones, X, Send } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChatWidget: React.FC = () => {
  const { siteSettings, paymentSettings, navigate, language } = useApp();
  const [open, setOpen] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(true);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Assalamu Alaikum! Welcome to ${siteSettings.siteName} 24/7 Support Desk. Ask me anything about UID Diamond Top Up, Custom Room IDs, or bKash/Nagad Withdrawals.`,
      time: 'Just now',
    },
  ]);

  const quickReplies = [
    'How fast is UID Top Up?',
    'Where is the Tournament Room ID?',
    'Minimum bKash Withdraw?',
    'How do Reward Tasks work?',
  ];

  const generateReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('top up') || q.includes('diamond') || q.includes('uid') || q.includes('fast')) {
      return 'UID Direct Top Ups on H41FFTOPUP paid via Main Wallet or Instant Gateway are delivered in 5–30 seconds. Manual bKash/Nagad TrxID orders take 2–5 minutes.';
    }
    if (q.includes('room') || q.includes('tournament') || q.includes('password')) {
      return 'Once you register for a tournament, the Custom Room ID and Password unlock directly inside the Tournament Card 15 minutes before match start.';
    }
    if (q.includes('withdraw') || q.includes('bkash') || q.includes('nagad') || q.includes('minimum')) {
      return `Minimum withdrawal is ৳${paymentSettings.minWithdrawBdt} via bKash, Nagad, Rocket, or Upay. You can also transfer Income Balance to Main Balance with 0% fee anytime!`;
    }
    if (q.includes('task') || q.includes('income') || q.includes('earn') || q.includes('reward')) {
      return 'Visit the Reward Tasks page, complete verified community or partner tasks, and submit your proof link. Moderators approve valid proofs and credit your Income Balance.';
    }
    return `Thank you for reaching out to H41FFTOPUP! For urgent order or room assistance, message our support team on WhatsApp (${siteSettings.supportWhatsapp}) or Telegram (${siteSettings.supportTelegram}).`;
  };

  const handleSend = (textToSend?: string) => {
    const content = (textToSend ?? input).trim();
    if (!content) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: content,
      time: 'Now',
    };
    const botMsg: ChatMessage = {
      id: `b-${Date.now() + 1}`,
      sender: 'bot',
      text: generateReply(content),
      time: 'Now',
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
    if (!textToSend) setInput('');
  };

  return (
    <div className="fixed bottom-4 right-3.5 sm:right-5 z-40 flex flex-col items-end gap-2">
      {open ? (
        <div className="w-[calc(100vw-1.75rem)] max-w-sm rounded-2xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 bg-[#280606] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4 text-[#FF7A00] shrink-0" />
              <div>
                <div className="font-display text-xs font-bold">H41FFTOPUP 24/7 Support</div>
                <div className="text-[10px] text-gray-300">
                  Instant Automated Help & Telegram Desk
                </div>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/10"
              aria-label="Close support chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="p-3.5 h-60 overflow-y-auto space-y-2.5 bg-gray-50 dark:bg-[#0B0F17]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-[#3B0A0A] text-white'
                      : 'bg-white dark:bg-[#161F30] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-1.5">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => handleSend(qr)}
                className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-[#3B0A0A] hover:text-white transition-colors"
              >
                {qr}
              </button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-2.5 bg-white dark:bg-[#111827] border-t border-gray-200 dark:border-gray-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Top Up, Room ID, or Withdraw..."
              className="flex-1 h-9 px-3 text-xs rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 border border-gray-200 dark:border-gray-700"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="h-9 w-9 rounded-xl bg-[#3B0A0A] dark:bg-[#FF5500] text-white flex items-center justify-center shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="px-4 py-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Need direct human support?</span>
            <button
              onClick={() => {
                setOpen(false);
                navigate('contact');
              }}
              className="font-bold text-[#3B0A0A] dark:text-[#FF7A00] hover:underline"
            >
              Contact Helpline →
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-end gap-2">
          {/* Dark Floating Tooltip Pill */}
          {tooltipVisible && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#1C1917] text-white text-[11px] font-bold shadow-lg border border-white/10">
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="whitespace-nowrap"
              >
                {language === 'bn'
                  ? 'এইখানে ক্লিক করে সহজেই এর কাজ'
                  : 'Click here for 24/7 Support & Guide'}
              </button>
              <button
                type="button"
                onClick={() => setTooltipVisible(false)}
                aria-label="Dismiss tip"
                className="text-gray-400 hover:text-white ml-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Circular Headset Button */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open 24/7 Support"
            className="w-12 h-12 rounded-full bg-white dark:bg-[#161F30] text-[#111827] dark:text-white border border-gray-200 dark:border-gray-700 shadow-[0_6px_20px_rgba(0,0,0,0.18)] flex items-center justify-center hover:scale-105 transition-transform"
          >
            <Headphones className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
};
