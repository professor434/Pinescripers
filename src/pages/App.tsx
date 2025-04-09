import Grant from "@/pages/Grant";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import UserDashboard from "./UserDashboard";
import Cart from "@/pages/Cart";
import DevPanel from "@/components/DevPanel"; // ✅ Προσοχή: όχι "coponents"
import Marketplace from "@/pages/Marketplace";
import ProtectedRoute from "../components/ProtectedRoute";
import StrategyBuilder from "@/components/StrategyBuilder";
import IdeaSubmissionForm from "@/components/IdeaSubmissionForm";
import MarketplaceAdminUpload from "@/components/MarketplaceAdminUpload";
import MarketplaceUpload from "@/components/MarketplaceUpload";
const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRoles={["user", "pro", "plus"]}>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <DevPanel />
          </ProtectedRoute>
        }
      />

      {/* Common user pages */}
      <Route path="/builder" element={<StrategyBuilder />} />
      <Route path="/submit-idea" element={<IdeaSubmissionForm />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/marketplace" element={<Marketplace />} / >
      <Route path="/admin-upload" element={<MarketplaceAdminUpload />} />
	{/* Fallback route */}
      <Route path="*" element={<Navigate to="/login" />} />
  <Route path="/grant" element={<Grant />} />  
</Routes>
  );
};

export default App;

