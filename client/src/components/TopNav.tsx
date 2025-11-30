import { Settings, Menu, Radio, Cpu } from "lucide-react";

export default function TopNav() {
  return (
    <div className="fixed top-0 left-0 w-full h-16 z-30 flex items-center justify-between px-6 bg-gradient-to-b from-black via-black/80 to-transparent pointer-events-none">
      {/* Left: Logo */}
      <div className="flex items-center gap-2 pointer-events-auto group cursor-pointer">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 border border-neon-purple rounded-full animate-spin-slow opacity-50 group-hover:opacity-100 transition-opacity" />
          <div className="w-4 h-4 bg-neon-purple rounded-full shadow-[0_0_10px_#9d4edd]" />
        </div>
        <span className="text-xl font-display font-bold tracking-widest text-white group-hover:text-neon-purple transition-colors">
          DATA<span className="text-neon-pink">-ORB</span>
        </span>
      </div>

      {/* Center: Ticker */}
      <div className="hidden md:flex flex-1 max-w-2xl mx-8 overflow-hidden relative h-full items-center mask-linear-gradient">
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-black to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-black to-transparent z-10" />
        
        <div className="whitespace-nowrap animate-ticker text-neon-purple/60 font-mono text-xs tracking-[0.2em]">
           /// SYSTEM STATUS: ONLINE /// GLOBAL POPULATION: 8,102,394,122 /// DATA STREAMS: ACTIVE /// SECURITY LEVEL: ALPHA /// NEURAL LINK: CONNECTED /// UPDATING MATRIX...
        </div>
      </div>

      {/* Right: Settings */}
      <div className="flex items-center gap-4 pointer-events-auto">
        <button className="p-2 text-white/50 hover:text-neon-pink transition-colors hover:bg-white/5 rounded-full">
          <Cpu className="w-5 h-5" />
        </button>
        <button className="p-2 text-white/50 hover:text-neon-purple transition-colors hover:bg-white/5 rounded-full animate-pulse-slow">
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
