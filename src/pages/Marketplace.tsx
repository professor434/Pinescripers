import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/context/CartContext";
import CheckoutModal from "@/components/CheckoutModal";
import { Button } from "@/components/ui/button";
import backgroundImage from "/assets/marketplace.png";

interface Strategy {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image_url: string;
  file_url: string;
  resale_enabled: boolean;
  approved: boolean;
}

export default function Marketplace() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [customCart, setCustomCart] = useState<Strategy[]>([]);
  const { addToCart, cartItems } = useCart();

  useEffect(() => {
    const fetchStrategies = async () => {
      const { data, error } = await supabase
        .from("marketplace")
        .select("*")
        .eq("approved", true);

      if (error) {
        console.error("Error fetching strategies:", error);
      } else {
        setStrategies(data);
      }
    };

    fetchStrategies();
  }, []);

  const totalPrice = cartItems?.reduce((acc, item) => acc + item.price, 0);

  const handleBuyNow = (strategy: Strategy) => {
    setCustomCart([strategy]);
    setShowCheckout(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center p-10"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <h1 className="text-white text-4xl font-bold text-center mb-10">PineScript3rs</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {strategies.map((strategy) => (
          <div
            key={strategy.id}
            className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg"
          >
            <img
              src={strategy.image_url}
              alt={strategy.title}
              className="w-full h-40 object-cover rounded-lg mb-4"
            />
            <h2 className="text-white text-xl font-semibold mb-2">{strategy.title}</h2>
            <p className="text-white text-sm mb-2">{strategy.description}</p>
            <p className="text-white font-bold mb-4">${strategy.price.toFixed(2)}</p>
            <div className="flex flex-wrap space-x-2">
              <Button onClick={() => setSelectedStrategy(strategy)}>Preview</Button>
              <Button variant="outline" onClick={() => addToCart(strategy)}>
                Add to Cart
              </Button>
              <Button
                variant="default"
                className="bg-green-600 text-white"
                onClick={() => handleBuyNow(strategy)}
              >
                Buy Now
              </Button>
            </div>
          </div>
        ))}
      </div>

      {cartItems.length > 0 && (
        <div className="mt-10 flex justify-center">
          <Button
            className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700"
            onClick={() => {
              setCustomCart(cartItems);
              setShowCheckout(true);
            }}
          >
            Complete Your Purchase (${totalPrice.toFixed(2)})
          </Button>
        </div>
      )}

      {selectedStrategy && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-[90%] md:w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedStrategy.title}</h2>
              <button
                onClick={() => setSelectedStrategy(null)}
                className="text-red-500 text-xl"
              >
                ✕
              </button>
            </div>
            <p className="mb-4 text-gray-700">{selectedStrategy.description}</p>
            <div className="bg-gray-100 p-4 rounded overflow-auto h-40">
              <p className="text-sm text-gray-600 italic">
                File Preview: {selectedStrategy.file_url || "N/A"}
              </p>
            </div>
          </div>
        </div>
      )}

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        overrideCart={customCart}
      />
    </div>
  );
}
