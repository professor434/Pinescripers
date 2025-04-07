export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="min-h-screen bg-cover bg-center text-white p-6"
      style={{ backgroundImage: "url('/assets/login-bg.png')" }}
    >
      <header className="mb-8 text-center bg-black/70 p-4 rounded-xl shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-tight">Pinescripters</h1>
        <p className="text-white/60 text-sm">Transforming ideas into strategy tools</p>
      </header>
      <main>{children}</main>
    </div>
  );
}
