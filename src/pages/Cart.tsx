// Cart.tsx
import React, { useContext } from "react";
import { supabase } from "@/lib/supabaseClient";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  const handleCheckout = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    if (!userId) {
      alert("You must be logged in to checkout.");
      return;
    }

    const now = new Date();
    const expires = new Date(now.getTime() + 60 * 60 * 1000); // +1 ώρα

    const purchaseData = cart.map((item) => ({
      user_id: userId,
      strategy_id: item.id,
      title: item.title,
      price: item.price,
      payed: false,
      status: false,
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
    }));

    const { error } = await supabase.from("purchases").insert(purchaseData);

    if (error) {
      console.error("Purchase error:", error);
      alert("❌ Purchase failed. Please try again.");
    } else {
      clearCart();
      alert("✅ Request sent successfully!");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Cart</h2>
      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cart.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <div>
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-gray-500">${item.price}</p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  ❌
                </Button>
              </CardContent>
            </Card>
          ))}
          <Button className="bg-green-600 text-white" onClick={handleCheckout}>
            ✅ Complete Checkout (${cart.reduce((acc, item) => acc + item.price, 0)})
          </Button>
        </div>
      )}
    </div>
  );
};

export default Cart;
