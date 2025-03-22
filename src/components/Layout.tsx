export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-zinc-900 to-black text-white p-6">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">PINEREE</h1>
        <p className="text-white/50 text-sm">Transforming ideas into strategy tools</p>
      </header>
      <main>{children}</main>
    </div>
  );
}