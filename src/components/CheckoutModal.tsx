import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { useCart } from '@/context/CartContext';
import { supabase } from '@/lib/supabaseClient';

export default function CheckoutModal({ isOpen, onClose, userId }) {
  const { cartItems, removeFromCart, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [expiresAt, setExpiresAt] = useState(null);
  const [timer, setTimer] = useState('60:00');
  const [message, setMessage] = useState('');

  useEffect(() => {
    let interval;
    if (expiresAt) {
      interval = setInterval(() => {
        const now = new Date();
        const diff = new Date(expiresAt) - now;
        if (diff <= 0) {
          setTimer('Expired');
          clearInterval(interval);
        } else {
          const minutes = Math.floor(diff / 60000);
          const seconds = Math.floor((diff % 60000) / 1000);
          setTimer(`${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [expiresAt]);

  const handleCheckout = async () => {
    setLoading(true);
    const newExpiresAt = new Date(Date.now() + 60 * 60 * 1000);
    try {
      for (const item of cartItems) {
        await supabase.from('purchases').insert({
          user_id: userId,
          strategy_id: item.id,
          status: 'pending',
          payed: false,
          expires_at: newExpiresAt.toISOString(),
        });
      }
      setExpiresAt(newExpiresAt);
      setShowQR(true);
      clearCart();
      setMessage('✅ Request created. Please scan the QR to complete payment.');
    } catch (err) {
      console.error('Error:', err);
      setMessage('❌ Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50 flex items-center justify-center">
      <Dialog.Panel className="bg-zinc-900 text-white p-6 rounded-lg shadow-lg border border-zinc-700 w-full max-w-md">
        <Dialog.Title className="text-xl font-bold mb-4">🛒 Checkout</Dialog.Title>

        {!showQR ? (
          <>
            {cartItems.length === 0 ? (
              <p className="text-zinc-400">Your cart is empty.</p>
            ) : (
              <>
                <ul className="mb-4 space-y-2">
                  {cartItems.map((item) => (
                    <li key={item.id} className="flex justify-between items-center border border-zinc-700 p-2 rounded">
                      <span>{item.title}</span>
                      <button className="text-red-500" onClick={() => removeFromCart(item.id)}>❌</button>
                    </li>
                  ))}
                </ul>
                <button
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full disabled:opacity-50"
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : '✅ Complete Purchase'}
                </button>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center space-y-3 bg-zinc-800 p-4 rounded border border-zinc-700">
            <img
              src="/bep20-qr.jpg"
              alt="Scan QR"
              className="w-44 h-44 rounded-sm border border-zinc-600 shadow"
            />
            <p className="text-sm text-zinc-300">
              💬 Please include your <strong className="text-white">email</strong> or <strong className="text-white">User ID</strong> in the memo/tag.
            </p>
            <p className="text-xs text-zinc-400">User ID: <code className="text-amber-400">{userId}</code></p>
            <p className="text-sm text-white">⏳ Expires in: <strong className="text-green-400">{timer}</strong></p>
            {message && <p className="text-sm text-green-500">{message}</p>}
          </div>
        )}
      </Dialog.Panel>
    </Dialog>
  );
}
