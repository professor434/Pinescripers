import React from "react"

export default function GrantPage() {
  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] to-[#111111] text-white min-h-screen font-sans">
      {/* Hero Section */}
      <section className="text-center px-6 py-20 md:py-32">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-purple-400 to-cyan-400 text-transparent bg-clip-text">
          PINEscripters x Polygon Grant Proposal
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
          Empowering coders & traders to create, share, and monetize on-chain strategies with AI, marketplaces, and Web3 tooling.
        </p>
      </section>

      {/* Roadmap Section */}
      <section className="px-6 py-16 md:py-24 bg-[#181818]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">🚀 Roadmap</h2>
        <ul className="max-w-2xl mx-auto list-disc text-lg text-gray-200 space-y-4 pl-6">
          <li>Phase 1 – Core App & Strategy Marketplace (LIVE)</li>
          <li>Phase 2 – Blockchain Integration & Smart Contract Licensing</li>
          <li>Phase 3 – AI-assisted strategy builder (Pro users)</li>
          <li>Phase 4 – Full on-chain deployments, royalties, referral & staking system</li>
        </ul>
      </section>

      {/* Why Polygon Section */}
      <section className="px-6 py-16 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">🟣 Why Polygon?</h2>
        <p className="max-w-3xl mx-auto text-gray-300 text-lg text-center">
          Polygon is fast, dev-friendly, and backed by one of the strongest ecosystems in Web3. With low fees and vibrant user adoption,
          it’s the perfect home for monetizing trading knowledge on-chain.
          <br />
          We plan to launch all licensing, royalty and referral mechanics directly on Polygon.
        </p>
      </section>

      {/* Grant Goals Section */}
      <section className="px-6 py-16 md:py-24 bg-[#181818]">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-8">🎯 Grant Goals</h2>
        <ul className="max-w-2xl mx-auto list-disc text-lg text-gray-200 space-y-4 pl-6">
          <li>Deploy full Web3 logic for Pro users</li>
          <li>Enable wallet-based licensing and ownership</li>
          <li>Create on-chain referral and rewards system</li>
          <li>Expand marketplace with smart contract publishing</li>
        </ul>
      </section>

      {/* Contact */}
      <section className="text-center px-6 py-16 md:py-20">
        <p className="text-lg text-gray-400">
          Contact: <strong>giorgoshacks@gmail.com</strong> | Owner: <strong>CRYPTO HUNTER</strong><br />
          Polygon Wallet: <code className="text-purple-400">0x7528cf1984755a20a652e9e8a1e9a576efe2d960</code>
        </p>
      </section>
    </div>
  )
}

}
