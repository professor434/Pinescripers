import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Dialog } from "@headlessui/react";
import { Button } from "@/components/ui/button";

interface BuyNowModalProps {
  strategyId: string;
  title: string;
  price: number;
  onClose: () => void;
}

export default function BuyNowModal({
  strategyId,
  title,
  price,
  onClose,
}: BuyNowModalProps) {
  const supabase = createClientComponentClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "pending">("idle");
  const [timer, setTimer] = useState<number>(3600);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    fetchUser();
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "pending") {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const handleBuy = async () => {
    if (!userId) return;
    setStatus("pending");

    const now = new Date();
    const expires = new Date(now.getTime() + 60 * 60 * 1000);

    await supabase.from("purchases").insert({
      user_id: userId,
      strategy_id: strategyId,
      status: "pending",
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
    });
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <Dialog open={true} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/60" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-xl bg-[#111] p-6 text-white border border-gray-700 shadow-xl">
          <Dialog.Title className="text-lg font-bold flex items-center gap-2 mb-4">
            🛒 Checkout
          </Dialog.Title>

          <div className="flex flex-col items-center justify-center gap-3">
            {status === "pending" ? (
              <>
                <img
                  src="/assets/bep20-qr.png"
                  alt="Scan QR"
                  className="w-48 h-48 object-contain rounded border border-gray-600"
                />
                <p className="text-sm text-gray-300 text-center">
                  📩 Please include your <strong>email</strong> or{" "}
                  <strong>User ID</strong> in the memo/tag.
                </p>
                <p className="text-xs text-gray-500">User ID: {userId}</p>
                <p className="text-xs text-green-400">
                  ⏳ Expires in: <strong>{formatTime(timer)}</strong>
                </p>
                <p className="text-sm text-green-500 mt-2 text-center">
                  ✅ Request created. Please scan the QR to complete payment.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-400 text-center">
                  Click below to activate your payment request.
                </p>
                <Button onClick={handleBuy} className="w-full bg-green-600 hover:bg-green-700">
                  ✅ Complete Purchase
                </Button>
              </>
            )}

            <Button
              onClick={onClose}
              variant="ghost"
              className="mt-2 text-gray-400 hover:text-white"
            >
              ❌ Cancel
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
