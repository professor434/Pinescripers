import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./pages/App";
import "./index.css";
import { CartProvider } from "./context/CartContext"; // ✅ Προσθήκη

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider> {/* ✅ Τύλιγμα App */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
