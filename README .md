# 📈 PINESCRIPERS

Το **PINESCRIPERS** είναι μια πλήρως λειτουργική πλατφόρμα marketplace για PineScript στρατηγικές, που επιτρέπει στους χρήστες να αγοράζουν, να ανεβάζουν και να προτείνουν ιδέες για νέες στρατηγικές με απλό και ασφαλή τρόπο. Περιλαμβάνει διαχειριστικό πάνελ, QR-based πληρωμές, και role-based περιβάλλον χρήστη.

## 🚀 Τεχνολογίες

- React + Vite
- TypeScript
- Supabase (DB + Auth + Storage)
- TailwindCSS + Shadcn UI
- Lucide Icons
- QR Payment Integration (request & timer flow)
- Role-based access

## 💡 Χαρακτηριστικά

### Για χρήστες
- 🛒 Marketplace με "Add to Cart" και "Buy Now"
- 🧠 Υποβολή ιδεών προς αξιολόγηση
- 👤 User Dashboard με αγορές, uploads, submissions
- 📥 Δυνατότητα Download μόνο για πληρωμένες στρατηγικές

### Για Pro χρήστες
- 📤 Ανέβασμα στρατηγικής στο marketplace
- 🧠 Πρόσβαση στο Strategy Builder
- 💼 Δήλωση wallet address για πληρωμές

### Για Admins
- 🔐 Admin Panel με sections:
  - 💡 Pending Ideas
  - 💸 Payment Approvals (Pre-Marketplace)
  - 🪙 Marketplace Approvals με QR Timer Flow
  - 👥 Διαχείριση χρηστών και ρόλων
- 🧾 Manual Confirm για πληρωμές
- 📥 Admin download κουμπί

## 🛠 Εγκατάσταση

```bash
git clone https://github.com/professor434/Pinescripers.git
cd Pinescripers
npm install
npm run dev
```

- Δημιούργησε `.env` με μεταβλητές για Supabase URL & Key
- Όρισε Supabase Tables (purchases, profiles, marketplace, ideaz κ.λπ.)

## 📁 Δομή

```
/components
  /ui         → Custom UI components (Select, Tabs, Button κλπ)
  /admin      → DevPanel, Admin downloads, Approvals
  /dashboard  → UserDashboard, DownloadButton
  /marketplace → BuyNowModal, Checkout, Cart κ.λπ.
/lib           → supabaseClient.ts, purchaseUtils.ts
/pages         → Routing setup
```

## 🗺 Roadmap

- [x] Marketplace με QR flow
- [x] Role-based dashboard (User / Pro / Admin)
- [x] Upload & Approvals
- [x] Manual Payment Confirm
- [x] Download προστασία
- [x] Strategy Builder (Pro only)
- [x] Wallet support
- [x] Pre-marketplace & legacy ideas με custom flows
- [ ] Webhook για auto-expire
- [ ] Stripe Integration (αν χρειαστεί)

## 🤝 Συνεισφορά

Ανοιχτό για feature requests και pull requests.

## 🪪 License

MIT License © 2025 - Pinescripers Project