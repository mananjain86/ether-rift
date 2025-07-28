import React from "react";

const dimensions = [
  {
    icon: "[*]",
    name: "STABLE DIMENSION",
    desc: "LOW VOLATILITY, FOR BEGINNERS",
    apr: "4.2%",
    color: "border-cyan-400 text-cyan-300",
    border: "border-l-4 border-cyan-400",
  },
  {
    icon: "[!]",
    name: "VOLATILE DIMENSION",
    desc: "HIGH RISK, HIGH REWARD",
    apr: "18.7%",
    color: "border-pink-400 text-pink-300",
    border: "border-l-4 border-pink-400",
  },
  {
    icon: "[#]",
    name: "ARBITRAGE DIMENSION",
    desc: "EXPLOIT CROSS-MARKET",
    apr: "11.3%",
    color: "border-green-400 text-green-300",
    border: "border-l-4 border-green-400",
  },
];

const steps = [
  {
    label: "CONNECT WALLET",
    desc: "securely link your crypto wallet",
  },
  {
    label: "CHOOSE DIMENSION",
    desc: "pick a trading universe",
  },
  {
    label: "START TRADING",
    desc: "compete, strategize, master defi",
  },
];

const TerminalCaret = () => (
  <span className="inline-block w-2 h-5 align-middle bg-cyan-400 ml-1 animate-caret" />
);

const LandingPage = () => {
  return (
    <div className="relative min-h-[80vh] w-full flex flex-col items-center justify-center bg-gradient-to-br from-black via-cyan-950 to-pink-950 text-cyan-100 font-mono pt-24 pb-12 px-2 overflow-x-hidden">
      {/* Scanline Overlay */}
      <div className="pointer-events-none fixed inset-0 z-10 mix-blend-soft-light opacity-30" style={{background: "repeating-linear-gradient(to bottom, transparent, transparent 6px, #0ff1 7px)"}} />

      {/* Main Terminal Box */}
      <div className="w-full max-w-3xl mx-auto relative rounded-lg shadow-2xl p-8 mb-10 border-2 border-cyan-400 bg-black/70 backdrop-blur-xl glassmorph animate-border-glow">
        <div className="absolute inset-0 rounded-lg border-2 border-cyan-400 pointer-events-none animate-border-glow z-0" style={{filter: 'blur(4px)', opacity: 0.5}} />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-cyan-100 mb-2 tracking-wide font-orbitron">ETHERRIFT</h1>
          <h2 className="text-lg md:text-xl text-cyan-400 font-bold mb-4 tracking-widest font-orbitron">MULTIDIMENSIONAL TRADING ARENA</h2>
          <div className="h-1 w-12 bg-cyan-400 mb-4" />
          <p className="text-base md:text-lg text-cyan-200 mb-8 max-w-2xl font-mono">
            A sci-fi trading game across parallel universes. Compete, strategize, and master DeFi in a crisp, terminal-inspired interface.
          </p>
          <a
            href="/dimensions"
            className="block w-fit mx-auto px-8 py-3 border-2 border-cyan-400 text-cyan-100 font-bold text-lg font-orbitron tracking-widest rounded transition hover:bg-cyan-400 hover:text-black focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 animate-pulse-btn shadow-lg relative overflow-hidden"
            style={{boxShadow: '0 0 16px #0ff8'}}
          >
            ENTER THE RIFT
          </a>
        </div>
      </div>

      {/* Dimension Cards */}
      <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 mb-10">
        {dimensions.map((dim, i) => (
          <div
            key={dim.name}
            className={`flex-1 bg-black/60 backdrop-blur-lg glassmorph rounded-lg p-6 border-2 ${dim.color} ${dim.border} min-w-[220px] shadow-lg flex flex-col items-start gap-2`}
            style={{boxShadow: `0 0 12px ${dim.color.includes('cyan') ? '#22d3ee55' : dim.color.includes('pink') ? '#ec489955' : '#22c55e55'}`}}
          >
            <div className="text-2xl font-bold font-mono mb-1">{dim.icon}</div>
            <div className="text-lg font-bold text-cyan-100 font-orbitron mb-0.5">{dim.name}</div>
            <div className="text-xs text-cyan-400 tracking-widest mb-1">{dim.desc}</div>
            <div className="text-xs text-cyan-200">APR: <span className="font-mono">{dim.apr}</span></div>
          </div>
        ))}
      </div>

      {/* Steps */}
      <div className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-10">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center flex-1">
            <div className="text-cyan-400 text-2xl font-bold mb-2 font-mono">&gt;</div>
            <div className="text-base font-bold text-cyan-100 mb-1 tracking-widest font-mono">{step.label}</div>
            <div className="text-xs text-cyan-400 mb-2 font-mono">{step.desc}</div>
            <div className="w-1 h-8 bg-cyan-400 md:hidden" />
          </div>
        ))}
      </div>

      {/* Terminal Log Box */}
      <div className="w-full max-w-3xl mx-auto bg-black/80 border-2 border-cyan-400 rounded-lg p-4 mt-4 backdrop-blur-lg glassmorph shadow-lg relative">
        <div className="text-cyan-400 text-xs font-bold mb-2 font-mono">[TERMINAL LOG]</div>
        <div className="text-cyan-200 text-sm whitespace-pre-line font-mono flex items-center">
          {`Welcome to EtherRift. Connect your wallet, choose a dimension, and begin your journey in the multidimensional trading arena.\nNo glows. No distractions. Just pure sci-fi trading action.`}
          <TerminalCaret />
        </div>
      </div>

      {/* Custom CSS for effects */}
      <style>{`
        .glassmorph {
          background: rgba(16, 24, 32, 0.7);
          backdrop-filter: blur(8px);
        }
        .animate-border-glow {
          animation: borderGlow 2.5s linear infinite alternate;
        }
        @keyframes borderGlow {
          0% { box-shadow: 0 0 16px #0ff8, 0 0 0 #000; border-color: #22d3ee; }
          100% { box-shadow: 0 0 32px #ec489988, 0 0 0 #000; border-color: #ec4899; }
        }
        .animate-pulse-btn {
          transition: box-shadow 0.2s, transform 0.2s;
        }
        .animate-pulse-btn:hover {
          box-shadow: 0 0 32px #0ff, 0 0 0 #000;
          transform: scale(1.05);
        }
        .animate-caret {
          animation: caretBlink 1.1s steps(1) infinite;
        }
        @keyframes caretBlink {
          0%, 60% { opacity: 1; }
          61%, 100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage; 