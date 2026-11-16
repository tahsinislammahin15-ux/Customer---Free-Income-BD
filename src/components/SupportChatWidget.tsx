import React, { useState } from 'react';
import { MessageSquare, X, Send, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const SupportChatWidget: React.FC = () => {
  const { siteSettings, paymentSettings, navigate } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm1',
      sender: 'bot',
      text: `Assalamu Alaikum! Welcome to ${siteSettings.siteName} Support Desk. Ask me anything about UID Diamond Top Up, Custom Room IDs, or bKash/Nagad Withdrawals.`,
      time: 'Just now',
    },
  ]);

  const quickReplies = [
    'How fast is UID Top Up?',
    'Where is the Tournament Room ID?',
    'Minimum bKash Withdraw?',
    'How do Free Income tasks work?',
  ];

  const generateReply = (query: string): string => {
    const q = query.toLowerCase();
    if (q.includes('top up') || q.includes('diamond') || q.includes('uid') || q.includes('fast')) {
      return 'UID Direct Top Ups paid via Main Wallet or Instant Gateway are delivered in 30–60 seconds. Manual bKash/Nagad TrxID orders take 3–5 minutes.';
    }
    if (q.includes('room') || q.includes('tournament') || q.includes('password')) {
      return 'Once you register for a tournament, the Custom Room ID and Password unlock directly inside the Tournament Card 15 minutes before match start.';
    }
    if (q.includes('withdraw') || q.includes('bkash') || q.includes('nagad') || q.includes('minimum')) {
      return `Minimum withdrawal is ৳${paymentSettings.minWithdrawBdt} via bKash, Nagad, Rocket, or Upay. You can also transfer Income Balance to Main Balance with 0% fee anytime!`;
    }
    if (q.includes('task') || q.includes('income') || q.includes('earn')) {
      return 'Visit the Free Income page, complete verified community or partner tasks, and submit your proof link. Moderators approve valid proofs and credit your Income Balance.';
    }
    return `Thank you for reaching out! For urgent order or room assistance, message our Dhaka desk on WhatsApp (${siteSettings.supportWhatsapp}) or Telegram (${siteSettings.supportTelegram}).`;
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
    <div className="fixed bottom-20 lg:bottom-5 right-3 sm:right-5 z-40">
      {open ? (
        <div className="w-[calc(100vw-1.5rem)] max-w-sm rounded-2xl bg-white dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A] shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-4 py-3 btn-primary text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <div>
                <div className="font-display text-xs font-bold">{siteSettings.siteName} Live Help</div>
                <div className="text-[11px] text-blue-100">
                  Instant Automated Guide · Dhaka Support
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
          <div className="p-4 h-60 sm:h-64 overflow-y-auto space-y-3 bg-[#F8FAFC] dark:bg-[#060A12]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.sender === 'user'
                      ? 'btn-primary text-white'
                      : 'bg-white dark:bg-[#0D1526] text-[#0F172A] dark:text-[#F8FAFC] border border-[#E2E8F0] dark:border-[#1E2D4A]'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Prompt Chips */}
          <div className="px-3 py-2 bg-white dark:bg-[#0D1526] border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex flex-wrap gap-1.5">
            {quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => handleSend(qr)}
                className="px-2.5 py-1.5 text-xs font-medium rounded-lg bg-[#F8FAFC] dark:bg-[#111C33] text-[#475569] dark:text-[#94A3B8] hover:text-[#2563EB] dark:hover:text-white transition-colors"
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
            className="p-2.5 bg-white dark:bg-[#0D1526] border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about Top Up, Room ID, or Withdraw..."
              className="flex-1 min-h-[38px] px-3 py-2 text-xs rounded-xl bg-[#F8FAFC] dark:bg-[#060A12] border border-[#E2E8F0] dark:border-[#1E2D4A]"
            />
            <button
              type="submit"
              aria-label="Send message"
              className="min-h-[38px] min-w-[38px] p-2 rounded-xl btn-primary text-white flex items-center justify-center"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

          <div className="px-4 py-2 bg-[#F8FAFC] dark:bg-[#060A12] border-t border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
            <span>Need human help?</span>
            <button
              onClick={() => {
                setOpen(false);
                navigate('contact');
              }}
              className="font-semibold text-[#2563EB] dark:text-[#60A5FA] hover:underline"
            >
              Open Contact Page →
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setOpen(true)}
          className="min-h-[44px] px-4 py-2.5 rounded-2xl btn-primary shadow-lg flex items-center gap-2 text-xs font-bold"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Live Support</span>
        </button>
      )}
    </div>
  );
};
