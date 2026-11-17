import React, { useState } from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, Wallet, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PaymentGatewayName } from '../types';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateCartQty,
    removeFromCart,
    checkoutCart,
    currentUser,
    paymentSettings,
    navigate,
  } = useApp();

  const [paymentMethod, setPaymentMethod] = useState<'wallet' | PaymentGatewayName>('wallet');
  const [trxId, setTrxId] = useState('');

  if (!isCartOpen) return null;

  const totalBdt = cart.reduce((sum, item) => sum + item.pkg.priceBdt * item.quantity, 0);
  const totalDiamonds = cart.reduce((sum, item) => sum + item.pkg.diamonds * item.quantity, 0);
  const activeGateways = paymentSettings.gateways.filter((g) => g.active);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (paymentMethod !== 'wallet' && !trxId.trim()) {
      return;
    }
    const ok = checkoutCart(paymentMethod, trxId.trim() || undefined);
    if (ok) {
      setTrxId('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white dark:bg-[#0D1526] h-full flex flex-col border-l border-[#E2E8F0] dark:border-[#1E2D4A] shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] dark:border-[#1E2D4A] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#3B0A0A] dark:text-[#FCA5A5]" />
            <h2 className="font-display text-base font-bold text-[#111827] dark:text-[#F8FAFC]">
              Top Up Cart ({cart.length})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            aria-label="Close cart drawer"
            className="min-h-[38px] min-w-[38px] p-1.5 rounded-xl text-[#475569] dark:text-[#94A3B8] hover:bg-[#F8FAFC] dark:hover:bg-[#111C33] flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <div className="text-center py-16 space-y-3">
              <ShoppingBag className="w-10 h-10 text-[#94A3B8] mx-auto" />
              <p className="font-display text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                Your Diamond Cart is Empty
              </p>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8]">
                Browse UID Diamond bundles or UniPin vouchers to add packages here.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  navigate('topup');
                }}
                className="min-h-[42px] px-5 py-2.5 text-xs font-semibold rounded-xl btn-primary"
              >
                Browse Diamond Packages
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.pkg.id}
                className="p-4 rounded-2xl bg-[#F8FAFC] dark:bg-[#060A12] border border-[#E2E8F0] dark:border-[#1E2D4A] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-display text-sm font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                      {item.pkg.title}
                    </h3>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono">
                      Target UID: {item.playerUid} · {item.pkg.diamonds}💎 each
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.pkg.id)}
                    aria-label="Remove item from cart"
                    className="text-[#475569] hover:text-[#EF4444] p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateCartQty(item.pkg.id, -1)}
                      aria-label="Decrease quantity"
                      className="min-h-[32px] min-w-[32px] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E2D4A] hover:border-[#3B0A0A] flex items-center justify-center"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-mono font-bold w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateCartQty(item.pkg.id, 1)}
                      aria-label="Increase quantity"
                      className="min-h-[32px] min-w-[32px] p-1 rounded-lg border border-[#E2E8F0] dark:border-[#1E2D4A] hover:border-[#3B0A0A] flex items-center justify-center"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-sm font-mono font-bold text-[#3B0A0A] dark:text-[#FCA5A5]">
                    ৳{item.pkg.priceBdt * item.quantity}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Checkout Footer */}
        {cart.length > 0 && (
          <form
            onSubmit={handleCheckout}
            className="p-6 border-t border-[#E2E8F0] dark:border-[#1E2D4A] bg-[#F8FAFC] dark:bg-[#060A12] space-y-4"
          >
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#475569] dark:text-[#94A3B8]">
                <span>Total Diamonds</span>
                <span className="font-mono font-semibold">{totalDiamonds} 💎</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
                <span>Total Payable</span>
                <span className="font-mono text-[#3B0A0A] dark:text-[#FCA5A5]">৳{totalBdt} BDT</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wallet')}
                  className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-colors ${
                    paymentMethod === 'wallet'
                      ? 'border-2 border-[#3B0A0A] bg-[#FFF5F5] dark:bg-[#2A0B0B] text-[#3B0A0A] dark:text-white'
                      : 'border-[#E5E7EB] dark:border-[#1E2D4A] text-[#4B5563] dark:text-[#94A3B8]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 shrink-0" />
                    <span>Wallet</span>
                  </div>
                  <div className="font-mono text-xs mt-0.5">
                    ৳{currentUser?.mainBalance || 0}
                  </div>
                </button>

                {activeGateways.map((gw) => (
                  <button
                    key={gw.id}
                    type="button"
                    onClick={() => setPaymentMethod(gw.id)}
                    className={`min-h-[48px] px-3 py-2 rounded-xl text-xs font-semibold border text-left transition-colors ${
                      paymentMethod === gw.id
                        ? 'border-2 border-[#3B0A0A] bg-[#FFF5F5] dark:bg-[#2A0B0B] text-[#3B0A0A] dark:text-white'
                        : 'border-[#E5E7EB] dark:border-[#1E2D4A] text-[#4B5563] dark:text-[#94A3B8]'
                    }`}
                  >
                    <div>{gw.name}</div>
                    <div className="font-mono text-xs mt-0.5 truncate">{gw.merchantNumber}</div>
                  </button>
                ))}
              </div>
            </div>

            {paymentMethod !== 'wallet' && (
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-[#475569] dark:text-[#94A3B8]">
                  Enter {paymentMethod.toUpperCase()} Transaction ID (TrxID)
                </label>
                <input
                  type="text"
                  required
                  value={trxId}
                  onChange={(e) => setTrxId(e.target.value)}
                  placeholder="e.g. BKS992018KL"
                  className="w-full min-h-[42px] px-3 py-2 text-xs font-mono rounded-xl bg-white dark:bg-[#0D1526] border border-[#E2E8F0] dark:border-[#1E2D4A]"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full min-h-[46px] py-3 px-4 rounded-xl btn-navy-buy text-sm font-semibold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {paymentMethod === 'wallet'
                  ? `Instant Checkout (৳${totalBdt})`
                  : `Submit Order with TrxID (৳${totalBdt})`}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
